	var newEPTime = 0;
	var newEpUpdate = 0;
	var checkFail = [];
	var NexEpProcessed = 0;
	var NexEpFinished = 0;
	var newEpRetrys = 0;

	var checkArray = [];
	function checkForNewEpisodes(url, entrySelector, title = '', img = ''){
		checkArray.push(function(totalEntrys){checkForNewEpisode(url, entrySelector, totalEntrys, title, img);});
	}

	function startCheckForNewEpisodes(localListType = listType){
		newEpRetrys++;
		if(newEpInterval == 'null'){
			return;
		}
		if($('.username').first().attr('href')){
			return;
		}
		if(!checkArray.length){
			return;
		}
		if( $.now() - GM_getValue('newEp_last_update_'+localListType, 0) > newEpInterval){
			$('body').before('<div style="z-index: 20000000000; height: 5px; position: fixed; top: 0; left: 0; right: 0;background-color: rgba(255,225,255,0.5);"><div id="checkProgress" style="width: 0%;background-color: #3f51b5; height: 100%; transition: width 1s;"></div></div>');
			newEpUpdate = 1;
		}
		var tempArray = checkArray;
		checkArray = [];
		newEPTime = 0;
		for(var i=0 ; i < tempArray.length ; i++){
			tempArray[i](tempArray.length);
		}
	}

	function checkForNewEpisode(url, entrySelector, totalEntrys, title = '', img = ''){
		var selector = '';
		var hasStyle = 0;
		var localListType = 'anime';
		var checkAiringState = function(parsed, html){};
		if($(entrySelector).attr('style')) hasStyle = 1;

		if( url.indexOf("kissanime.ru") > -1 ){
			selector = ".listing a";
			checkAiringState = function(parsed, html){
				try{
					if(html.split('Status:</span>')[1].split('<')[0].indexOf("Completed") > -1){
						return true;
					}
				}catch(e){
					con.log('[ERROR]',e);
				}
				return false;
			}
		}else if( url.indexOf("kissmanga.com") > -1 ){
			localListType = 'manga';
			selector = ".listing a";
			checkAiringState = function(parsed, html){
				try{
					if(html.split('Status:</span>')[1].split('<')[0].indexOf("Completed") > -1){
						return true;
					}
				}catch(e){
					con.log('[ERROR]',e);
				}
				return false;
			}
		}else if( url.indexOf("masterani.me") > -1 ){
			var masterid = url.split('/')[5].split('-')[0];
			url = 'https://www.masterani.me/api/anime/'+masterid+'/detailed';
			selector = ".thumbnail a.title";
			checkAiringState = function(parsed, html){
				try{
					if(parsed["info"]["status"] == 0){
						return true;
					}
				}catch(e){
					con.log('[ERROR]',e);
				}
				return false;
			}
		}else if( url.indexOf("9anime.") > -1 ){
			selector = ".server:first-child .episodes a";
			checkAiringState = function(parsed, html){
				try{
					if(html.split('<dt>Status:</dt>')[1].split('</dl>')[0].indexOf("Completed") > -1){
						return true;
					}
				}catch(e){
					con.log('[ERROR]',e);
				}
				return false;
			}
		}else if( url.indexOf("crunchyroll.com") > -1 ){
			selector = "#showview_content_videos .list-of-seasons .group-item a";
			checkAiringState = function(parsed, html){
				try{
					if(!(html.indexOf("Simulcast on") > -1)){
						return true;
					}
				}catch(e){
					con.log('[ERROR]',e);
				}
				return false;
			}
		}else if( url.indexOf("gogoanime.") > -1 ){
			selector = "#episode_page a:last";
			checkAiringState = function(parsed, html){
				try{
					if(html.split('Status: </span>')[1].split('<')[0].indexOf("Completed") > -1){
						return true;
					}
				}catch(e){
					con.log('[ERROR]',e);
				}
				return false;
			}
		}else{
			checkForNewEpisodesDone(totalEntrys, true);
			return;
		}

		if( GM_getValue('newEp_'+url+'_finished', false) == true){
			con.log('[EpCheck] [Finished]', title);
			if(debug && !hasStyle){ $(entrySelector).attr('style', 'border-left: 4px solid green !important');}
			checkForNewEpisodesDone(totalEntrys, true);
			return true;
		}

		setBorder(GM_getValue('newEp_'+url+'_cache', null));
		if(newEpUpdate){
			setTimeout( function(){
				con.log('[EpCheck]', title, url );
				GM_xmlhttpRequest({
					method: "GET",
					url: url,
					synchronous: false,
					onerror: function(response) {
						con.log('[ERROR]',url+' could not be loaded');
						checkForNewEpisodesDone(totalEntrys, true);
					},
					onload: function(response) {
						if(newEpCR){
							if(response.response.indexOf('Your detected location is United States of America') == -1 && url.indexOf("crunchyroll.com") > -1){
								response.status = 502;
							}
						}
						if(response.status != 200){//TODO: Cloudflare handling
							con.log('[EpCheck] [ERROR]', response);
							var checkFailMessage = 'Coud Not Check';
							if(newEpRetrys < 3 && openInBg){
								checkFailMessage = 'Please wait';
							}
							var message = '<div>'+checkFailMessage+'</div><div class="errorpage"></div>'//;<button class="okChangelog" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px;cursor: pointer;">Ok</button></div>';
							if( !$('.errorpage').length ){
								flashm(message,false,false,true);
							}
							var erClass = url.split('/')[2].replace(".", "").replace(".", "");
							if(!($('.'+erClass).length)){
								$('.errorpage').prepend('<a target="_blank" class="'+erClass+'" href="'+url+'">'+url.split('/')[2]+'</a><br class="'+erClass+'" />');
								$('.'+erClass).click(function(){
									$(this).remove();
									if($('.errorpage').text() == ''){
										$('.flashPerm').remove();
									}
								});

								checkFail.push(url);
							}

							checkForNewEpisodes(url, entrySelector, title, img);

						}else{
							if( url.indexOf("masterani.me") > -1 ){
								var parsed  = $.parseJSON(response.response);
								var EpNumber = parsed['episodes'].length;
								var complete = checkAiringState(parsed, response.response);
							}else if( url.indexOf("gogoanime.") > -1 ){
								var parsed  = $.parseHTML(response.response);
								var EpNumber = $(parsed).find( selector ).text();
								EpNumber = parseInt(EpNumber.split('-')[1]);
								var complete = checkAiringState(parsed, response.response);
							}else{
								var parsed  = $.parseHTML(response.response);
								var EpNumber = $(parsed).find( selector ).length;
								var complete = checkAiringState(parsed, response.response);
							}

							if(complete){
								con.log('[EpCheck] [SetFinished]', title);
								GM_setValue('newEp_'+url+'_finished', true);
							}else{
								setBorder(EpNumber);
							}

						}
						checkForNewEpisodesDone(totalEntrys);
					}
				});

			}, newEPTime);
			newEPTime += 1000;
		}

		function setBorder(EpNumber){
			if(EpNumber === null){
				return;
			}
			var currentEpisode = $(entrySelector).find('.data.progress .link').text().trim().replace(/\/.*/,'');
			con.log('[EpCheck]', GM_getValue('newEp_'+url+'_number',null), EpNumber);
			if( GM_getValue('newEp_'+url+'_number', EpNumber) < EpNumber
				&& currentEpisode != $(entrySelector).find('.kal-ep-pre').attr('ep')){
				con.log('[NewEP]', url);

				if(GM_getValue('newEp_'+url+'_cache', null) != EpNumber){
					var newMessage = 'New episode got released!';
					if(localListType != 'anime'){
						newMessage = 'New chapter got released!';
					}
					if(newEpNotification){
						try{
							GM_notification({text: newMessage, title: title, image: img, timeout: 0, onclick: function(){
								try{
									//GM_setValue('newEp_'+url+'_number', EpNumber);
								}catch(e){}
								location.href = url;
							} });
						}catch(e){
							console.log('[ERROR] Could not execute GM_notification');
							alert('New episode for '+title+' released');
						}
					}
				}

				GM_setValue('newEp_'+url+'_cache', EpNumber);
				if(!hasStyle) $(entrySelector).attr('style', 'border: 3px solid #'+newEpBorder+' !important');
				if(GM_getValue('newEp_'+url+'_last', null) != currentEpisode
					&& GM_getValue('newEp_'+url+'_last', null) != null){
					GM_setValue('newEp_'+url+'_number', EpNumber);
					if(!hasStyle) $(entrySelector).attr('style', '');
					$(entrySelector).find('.newEp').remove();
					GM_setValue('newEp_'+url+'_last', currentEpisode);
					return true;
				};
				GM_setValue('newEp_'+url+'_last', currentEpisode);
				if(!$(entrySelector).find('.newEp').length) $(entrySelector).append('<div class="newEp"></div>');
			}else{
				if(GM_getValue('newEp_'+url+'_number', null) == null){
					GM_setValue('newEp_'+url+'_number', EpNumber);
				}
				if(debug && !hasStyle){ $(entrySelector).attr('style', 'border-left: 4px solid yellow !important');}
			}
		}

		function checkForNewEpisodesDone(totalEntrys, finishedCache = false){
			NexEpProcessed++;
			if(finishedCache) NexEpFinished++;
			con.log('[EpCheck]','('+ NexEpProcessed+'/'+totalEntrys+')');
			$('#checkProgress').css('width', ((NexEpProcessed - NexEpFinished)/( totalEntrys - NexEpFinished)*100) + '%');

			if(NexEpProcessed === totalEntrys){
				NexEpProcessed = 0;
				NexEpFinished = 0;

				$('#checkProgress').parent().fadeOut({
					duration: 2500,
					queue: false,
					complete: function() { $(this).remove(); }});

				function checkFailBackground(){
					if(!openInBg) return;
					if(checkFail.length){
						var rNumber = Math.floor((Math.random() * 1000) + 1);
						var url = checkFail[0];
						var erClass = url.split('/')[2].replace(".", "").replace(".", "");
						$('.'+erClass).click();
						GM_setValue( 'checkFail', rNumber );
						var tab = GM_openInTab(url+'?id='+rNumber);
						checkFail.shift();
						console.log(tab);
						var timeou = setTimeout(function(){
						    tab.close();
						    checkFailBackground();
						}, 60000);
						var index = 0;
						var inter = setInterval(function(){
							index++;
							if(index > 59){
								clearInterval(inter);
							}
							if(GM_getValue( 'checkFail', 0 ) == 0){
								clearInterval(inter);
								clearTimeout(timeou);
								tab.close();
								checkFailBackground();
							}
						}, 1000);

					}else{
						newEPTime = 0;
						newEpUpdate = 0;
						startCheckForNewEpisodes();
					}
				}
				if(checkFail.length && newEpRetrys < 3){
					checkFailBackground();
				}else{
					newEpRetrys = 0;
					GM_setValue('newEp_last_update_'+localListType, $.now());
				}
			}
		}
	};

	//EP_Prediction
	function epPrediction( malId , callback){
	    timestampUpdate();
	    var timestamp = GM_getValue('mal/'+malId+'/release', false);
	    if(timestamp){
	        var airing = 1;
	        var episode = 0;
	        if(Date.now() < timestamp) airing = 0;

	        if(airing){
	            var delta = Math.abs(Date.now() - timestamp) / 1000;
	        }else{
	            var delta = Math.abs(timestamp - Date.now()) / 1000;
	        }


	        var diffWeeks = Math.floor(delta / (86400 * 7));
	        delta -= diffWeeks * (86400 * 7);

	        if(airing){
	            //We need the time until the week is complete
	            delta = (86400 * 7) - delta;
	        }

	        var diffDays = Math.floor(delta / 86400);
	        delta -= diffDays * 86400;

	        var diffHours = Math.floor(delta / 3600) % 24;
	        delta -= diffHours * 3600;

	        var diffMinutes = Math.floor(delta / 60) % 60;
	        delta -= diffMinutes * 60;

	        if(airing){
	        	episode = diffWeeks - (new Date().getFullYear() - new Date(timestamp).getFullYear()); //Remove 1 week between years
	    		episode++;
	    		if( episode > 50 ){
	    			episode = 0;
	    		}
	    	}
	    	if(episode < GM_getValue('mal/'+malId+'/eps', 100000)){
	        	callback(timestamp, airing, diffWeeks, diffDays, diffHours, diffMinutes, episode);
	    	}
	    }
	}

	function timestampUpdate(){
	    function toTimestamp(year,month,day,hour,minute,second){
	        var datum = new Date(Date.UTC(year,month-1,day,hour,minute,second));
	        return (datum.getTime())-32400000;//for GMT
	    }

	    if( $.now() - GM_getValue('timestampUpdate/release', 0) < 345600000){
	        return 0;
	    }

	    var url = 'https://myanimelist.net/anime/season/schedule';
	    GM_xmlhttpRequest({
	        method: "GET",
	        url: url,
	        synchronous: false,
	        onload: function(response) {
	        	var found = 0;
	            var parsed = $.parseHTML(response.response);
	            var se = '.js-seasonal-anime-list-key-';
	            se = se+'monday, '+se+'tuesday ,'+se+'wednesday ,'+se+'thursday ,'+se+'friday ,'+se+'saturday ,'+se+'sunday';
	            $(parsed).find(se).find('.seasonal-anime').each(function(){
	            	found = 1;
	                if($(this).find('.info .remain-time').text().match(/\w+\ \d+.\ \d+,\ \d+:\d+\ \(JST\)/i)){
	                    var malId = $(this).find('a.link-title').attr('href').split('/')[4];
	                    var jpdate = $(this).find('.info .remain-time').text().trim();
	                    //day
	                    var day = jpdate.split(' ')[1].replace(',','').trim();
	                    //month
	                    var month = jpdate.split(' ')[0].trim();
	                    month = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1);
	                    //year
	                    var year = jpdate.split(' ')[2].replace(',','').trim();
	                    //time
	                    var time = jpdate.split(' ')[3].trim();
	                    var minute = time.split(':')[1];
	                    var hour = time.split(':')[0];
	                    //timezone
	                    var timestamp = toTimestamp(year,month,day,hour,minute,0);
	                    GM_setValue('mal/'+malId+'/release', timestamp);
	                    var episode = $(this).find('.eps a span').last().text();
	                    if(episode.match(/^\d+/)){
	                    	GM_setValue('mal/'+malId+'/eps', parseInt( episode.match(/^\d+/)[0]) );
	                    }
	                }
	            });
	            if(found){
	            	GM_setValue('timestampUpdate/release', $.now());
	        	}

	        }
	    });
	    return 1;
	}

