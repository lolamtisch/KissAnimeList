	function checkForNewEpisodes(){
		var time = 0;

		getMalXml("", function(bookXML){
			bookXML.find('my_status:contains(1)').parent().each(function(){
				if($(this).find('my_tags').first().text().indexOf("last::") > -1 ){
					var url = atobURL( $(this).find('my_tags').first().text().split("last::")[1].split("::")[0] );
					var title = $(this).find('series_title').first().text()
					setTimeout( function(){
						con.log('[EpCheck]', title, url );
						GM_xmlhttpRequest({//TODO: Cloudflare handling
							method: "GET",
							url: url,
							synchronous: false,
							onload: function(response) {
								var parsed  = $.parseHTML(response.response);
								var EpNumber = $(parsed).find(".listing a").length;
								con.log('[EpCheck]', GM_getValue('newEp_'+url+'_number',null), EpNumber);
								if( GM_getValue('newEp_'+url+'_number', EpNumber) != EpNumber){
									con.log('[NewEP]', url);
									alert('change');
								}
								GM_setValue('newEp_'+url+'_number', EpNumber);
							}
						});

					}, time);
					time += 5000;
					return false;

				}
			});
		});
	}