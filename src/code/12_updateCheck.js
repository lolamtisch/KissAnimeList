	function checkForNewEpisodes(){
		getMalXml("", function(bookXML){
			bookXML.find('my_status:contains(1)').parent().each(function(){
				if($(this).find('my_tags').first().text().indexOf("last::") > -1 ){
					var url = atobURL( $(this).find('my_tags').first().text().split("last::")[1].split("::")[0] );
					con.log('[EpCheck]', $(this).find('series_title').first().text(), url );

					GM_xmlhttpRequest({//TODO: Cloudflare handling
						method: "GET",
						url: url,
						synchronous: false,
						onload: function(response) {
							var parsed  = $.parseHTML(response.response);
							console.log($(parsed).find(".listing a"));
						}
					});
					return false;
				}
			});
		});
	}