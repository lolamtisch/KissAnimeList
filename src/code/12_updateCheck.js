	var newEPTime = 0;
	var newEpUpdate = 0;
	var checkFail = [];
	var NexEpProcessed = 0;
	var NexEpFinished = 0;
	function checkForNewEpisodes(url, entrySelector, totalEntrys, title = '', img = ''){
		if(newEpInterval == 'null'){
			return;
		}

		var selector = '';

		if(newEPTime == 0){
			if($('.username').first().attr('href')){
				return;
			}
			if( $.now() - GM_getValue('newEp_last_update', 0) > newEpInterval){
				$('body').before('<div style="z-index: 20000000000; height: 5px; position: fixed; top: 0; left: 0; right: 0;"><div id="checkProgress" style="width: 0%;background-color: #3f51b5; height: 100%; transition: width 1s;"></div></div>');
				newEpUpdate = 1;
				GM_setValue('newEp_last_update', $.now());
			}
			newEPTime = 1;
		}

		if( url.indexOf("kissanime.ru") > -1 ){
			selector = ".listing a";
			function checkAiringState(parsed, html){
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
			checkForNewEpisodesDone(totalEntrys, true);
			return;
			selector = ".listing a";
		}else if( url.indexOf("masterani.me") > -1 ){
			var masterid = url.split('/')[5].split('-')[0];
			url = 'https://www.masterani.me/api/anime/'+masterid+'/detailed';
			selector = ".thumbnail a.title";
			function checkAiringState(parsed, html){
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
			function checkAiringState(parsed, html){
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
			function checkAiringState(parsed, html){
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
			function checkAiringState(parsed, html){
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
			if(debug){ $(entrySelector).attr('style', 'border-left: 4px solid green !important');}
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
					onload: function(response) {
						if(response.response.indexOf('Your detected location is United States of America') == -1 && url.indexOf("crunchyroll.com") > -1){
							response.status = 502;
						}
						if(response.status != 200){//TODO: Cloudflare handling
							GM_deleteValue('newEp_last_update');
							con.log('[EpCheck] [ERROR]', response);
							var message = '<div>Coud Not Check</div><div class="errorpage"></div>'//;<button class="okChangelog" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px;cursor: pointer;">Ok</button></div>';
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
			con.log('[EpCheck]', GM_getValue('newEp_'+url+'_number',null), EpNumber);
			if( GM_getValue('newEp_'+url+'_number', EpNumber) < EpNumber){
				con.log('[NewEP]', url);

				if(GM_getValue('newEp_'+url+'_cache', null) != EpNumber){
					try{
						GM_notification({text: "New episode got released!", title: title, image: img, timeout: 0, onclick: function(){
							try{
								GM_setValue('newEp_'+url+'_number', EpNumber);
							}catch(e){}
							location.href = url;
						} });
					}catch(e){
						console.log('[ERROR] Could not execute GM_notification');
						alert('New episode for '+title+' released');
					}
				}

				GM_setValue('newEp_'+url+'_cache', EpNumber);
				$(entrySelector).attr('style', 'border: 3px solid #'+newEpBorder+' !important');
				$(entrySelector).parent().one('click', function(){
					GM_setValue('newEp_'+url+'_number', EpNumber);
					$(entrySelector).attr('style', '');
					$(entrySelector).find('.newEp').remove();
					return true;
				});
				$(entrySelector).append('<div class="newEp"></div>');
			}else{
				if(GM_getValue('newEp_'+url+'_number', null) == null){
					GM_setValue('newEp_'+url+'_number', EpNumber);
				}
				if(debug){ $(entrySelector).attr('style', 'border-left: 4px solid yellow !important');}
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
						tagToContinue();
					}
				}
				if(checkFail.length){
					checkFailBackground();
				}
			}
		}
	};

