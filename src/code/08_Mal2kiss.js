    function displaySites(responsearray, page){
        if($('#'+page+'Links').width() == null){
            $('#siteSearch').before('<h2 id="'+page+'Links" class="mal_links"><img src="https://www.google.com/s2/favicons?domain='+responsearray['url'].split('/')[2]+'"> '+page+'</h2><br class="mal_links" />');
        }
        if($("#info-iframe").contents().find('#'+page+'Links').width() == null){
            $("#info-iframe").contents().find('.stream-block-inner').append('<li class="mdl-list__item mdl-list__item--three-line"><span class="mdl-list__item-primary-content"><span>'+page+'</span><span id="'+page+'Links" class="mdl-list__item-text-body"></span></span></li>');
        }
        $('#'+page+'Links').after('<div class="mal_links"><a target="_blank" href="'+responsearray['url']+'">'+responsearray['title']+'</a><div>');
        $("#info-iframe").contents().find('#'+page+'Links').append('<div><a target="_blank" href="'+responsearray['url']+'">'+responsearray['title']+'</a><div>');
        $("#info-iframe").contents().find('.stream-block').show();
    }

    function getSites(sites, page){
        $.each(sites, function(index, value){
            if( GM_getValue( value+'/'+encodeURIComponent(index)+'/MalToKiss', null) != null ){
                con.log('[2Kiss] Cache' );
                var responsearray = $.parseJSON(GM_getValue( value+'/'+encodeURIComponent(index)+'/MalToKiss', null));
                displaySites(responsearray, page);
            }else{
                GM_xmlhttpRequest({
                    url: 'https://kissanimelist.firebaseio.com/Data/'+value+'/'+encodeURIComponent(index)+'.json',
                    method: "GET",
                    onload: function (response) {
                        con.log('[2Kiss] ',response.response);
                        if(response.response != null){
                            var responsearray = $.parseJSON(response.response);
                            if( value == 'Crunchyroll' ){
                                responsearray['url'] = responsearray['url'] + '?season=' + index;
                            }
                            GM_setValue( value+'/'+encodeURIComponent(index)+'/MalToKiss', '{"title":"'+responsearray['title']+'","url":"'+responsearray['url']+'"}' );
                            displaySites(responsearray, page);
                        }
                    },
                    onerror: function(error) {
                        con.log("error: "+error);
                    }
                });
            }
        });
    }

    function setKissToMal(malUrl){
        $(document).ready(function() {
            $('.mal_links').remove();
            var type = malUrl.split('/')[3];
            var uid = malUrl.split('/')[4];
            var sites = new Array();
            if(kissanimeLinks != 0){
                sites.push('Kissanime');
            }
            if(kissmangaLinks != 0){
                sites.push('Kissmanga');
            }
            if(masteraniLinks != 0){
                sites.push('Masterani');
            }
            if(nineanimeLinks != 0){
                sites.push('9anime');
            }
            if(crunchyrollLinks != 0){
                sites.push('Crunchyroll');
            }
            if(gogoanimeLinks != 0){
                sites.push('Gogoanime');
            }
            if(searchLinks != 0){
                $('h2:contains("Information")').before('<h2 id="siteSearch" class="mal_links">Search</h2><br class="mal_links" />');
                if(type == 'anime'){
                    $('#siteSearch').after('<div class="mal_links"></div>');
                    $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.google.com/search?q=site:www.masterani.me/anime/info/+'+encodeURI($('#contentWrapper > div:first-child span').text())+'">Masterani (Google)</a> <a target="_blank" href="https://www.masterani.me/anime?search='+$('#contentWrapper > div:first-child span').text()+'">(Site)</a></div>');
                    $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.gogoanime.tv/search.html?keyword='+$('#contentWrapper > div:first-child span').text()+'">Gogoanime</a></div>');
                    $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.crunchyroll.com/search?q='+$('#contentWrapper > div:first-child span').text()+'">Crunchyroll</a></div>');
                    $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="https://9anime.to/search?keyword='+$('#contentWrapper > div:first-child span').text()+'">9anime</a></div>');
                    $('#siteSearch').after('<form class="mal_links" target="_blank" action="http://kissanime.ru/Search/Anime" id="kissanimeSearch" method="post" _lpchecked="1"><a href="#" onclick="return false;" class="submitKissanimeSearch">Kissanime</a><input type="hidden" id="keyword" name="keyword" value="'+$('#contentWrapper > div:first-child span').text()+'"/></form>');
                    $('.submitKissanimeSearch').click(function(){
                      $('#kissanimeSearch').submit();
                    });
                }else{
                    $('#siteSearch').after('<form class="mal_links" target="_blank" action="http://kissmanga.com/Search/Manga" id="kissmangaSearch" method="post" _lpchecked="1"><a href="#" onclick="return false;" class="submitKissmangaSearch">Kissmanga</a><input type="hidden" id="keyword" name="keyword" value="'+$('#contentWrapper > div:first-child span').text()+'"/></form>');
                    $('.submitKissmangaSearch').click(function(){
                      $('#kissmangaSearch').submit();
                    });
                }
            }else{
                $('h2:contains("Information")').before('<div class="mal_links" id="siteSearch"></div>');
            }
            $.each( sites, function( index, page ){
                var url = 'https://kissanimelist.firebaseio.com/Data/Mal'+type+'/'+uid+'/Sites/'+page+'.json';
                GM_xmlhttpRequest({
                    url: url,
                    method: "GET",
                    onload: function (response) {
                        con.log('[2Kiss]', url, response.response);
                        if(response.response != 'null'){
                            getSites($.parseJSON(response.response), page);
                        }
                    },
                    onerror: function(error) {
                        con.log("error: "+error);
                    }
                });
            });
       });
    }

