	function checkForNewEpisodes(){
		var time = 0;

		getMalXml("", function(bookXML){
			$('body').before('<div style="z-index: 20000000000; height: 5px; position: fixed; top: 0; left: 0; right: 0;"><div id="checkProgress" style="width: 0%;background-color: #3f51b5; height: 100%; transition: width 1s;"></div></div>');
			var totalEntrys = bookXML.find('my_status:contains(1)').parent().length;
			bookXML.find('my_status:contains(1)').parent().each(function(index){

				if($(this).find('my_tags').first().text().indexOf("last::") > -1 ){
					var url = atobURL( $(this).find('my_tags').first().text().split("last::")[1].split("::")[0] );
					var title = $(this).find('series_title').first().text();
					var id = $(this).find('series_animedb_id').first().text();
					var selector = '';

					if( url.indexOf("kissanime.ru") > -1 ){
						selector = ".listing a";
						function checkAiringState(parsed, html){
							try{
								if(html.split('Status:</span>')[1].split('<')[0].indexOf("Completed") > -1){
									return true;
								}
							}catch(e){
								con.log([ERROR],e);
							}
							return false;
						}
					}else if( url.indexOf("kissmanga.com") > -1 ){
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
								con.log([ERROR],e);
							}
							return false;
						}
					}else if( url.indexOf("9anime.to") > -1 ){
						selector = "#servers .episodes:first a";
						function checkAiringState(parsed, html){
							try{
								if(html.split('<dt>Status:</dt>')[1].split('</dl>')[0].indexOf("Completed") > -1){
									return true;
								}
							}catch(e){
								con.log([ERROR],e);
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
								con.log([ERROR],e);
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
								con.log([ERROR],e);
							}
							return false;
						}
					}else{
						return;
					}

					if( GM_getValue('newEp_'+url+'_finished', false) == true){
						con.log('[EpCheck] [Finished]', title);
						if(debug){ $('.data.title a[href^="/anime/'+id+'/"]').parent().parent().attr('style', 'border: 2px solid green !important');}
						return true;
					}

					setTimeout( function(){
						$('#checkProgress').css('width', ((index+1)/totalEntrys*100) + '%');
						con.log('[EpCheck]', title, url );
						GM_xmlhttpRequest({
							method: "GET",
							url: url,
							synchronous: false,
							onload: function(response) {
								if(response.status != 200){//TODO: Cloudflare handling
									con.log('[EpCheck] [ERROR]', response);
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
										return;
									}

									con.log('[EpCheck]', GM_getValue('newEp_'+url+'_number',null), EpNumber);
									if( GM_getValue('newEp_'+url+'_number', EpNumber) < EpNumber){
										con.log('[NewEP]', url);
										$('.data.title a[href^="/anime/'+id+'/"]').parent().parent().attr('style', 'border: 2px solid red !important');
										//alert(title);
										$('.data.title a[href^="/anime/'+id+'/"]').parent().parent().parent().one('click', function(){
											GM_setValue('newEp_'+url+'_number', EpNumber);
											$('.data.title a[href^="/anime/'+id+'/"]').parent().parent().attr('style', '');
											return false;
										});
									}else{
										if(GM_getValue('newEp_'+url+'_number', null) == null){
											GM_setValue('newEp_'+url+'_number', EpNumber);
										}
										if(debug){ $('.data.title a[href^="/anime/'+id+'/"]').parent().parent().attr('style', 'border: 2px solid yellow !important');}
									}
								}
							}
						});

					}, time);
					time += 1000;
				}
			});
			setTimeout( function(){
				$('#checkProgress').parent().fadeOut({
                    duration: 400,
                    queue: false,
                    complete: function() { $(this).remove(); }});
			}, time);
		});
	}