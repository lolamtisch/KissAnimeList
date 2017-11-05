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
					}else if( url.indexOf("kissmanga.com") > -1 ){
					    selector = ".listing a";
					}else if( url.indexOf("masterani.me") > -1 ){
						var masterid = url.split('/')[5].split('-')[0];
						url = 'https://www.masterani.me/api/anime/'+masterid+'/detailed';
					    selector = ".thumbnail a.title";
					}else if( url.indexOf("9anime.to") > -1 ){
					    selector = "#servers .episodes:first a";
					}else if( url.indexOf("crunchyroll.com") > -1 ){
					    selector = "#showview_content_videos .list-of-seasons .group-item a";
					}else if( url.indexOf("gogoanime.") > -1 ){
					    selector = "#episode_page a:last";
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
									}else if( url.indexOf("gogoanime.") > -1 ){
										var parsed  = $.parseHTML(response.response);
										var EpNumber = $(parsed).find( selector ).text();
										EpNumber = parseInt(EpNumber.split('-')[1]);
									}else{
										var parsed  = $.parseHTML(response.response);
										var EpNumber = $(parsed).find( selector ).length;
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

						malinfourl = 'https://myanimelist.net/includes/ajax.inc.php?t=64&id='+id;
						GM_xmlhttpRequest({
							method: "GET",
							url: malinfourl,
							synchronous: false,
							onload: function(response) {
								if(response.status != 200){
									con.log('[EpCheck] [ERROR]', response);
								}else{
									if(' Finished Airing' == response.response.split('Status:</span>')[1].split('<')[0]){
										con.log('[EpCheck] [SetFinished]', title);
										GM_setValue('newEp_'+url+'_finished', true);
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