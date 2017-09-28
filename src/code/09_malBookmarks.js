    function tagToContinue(){
        if(tagLinks == 0){
            return false;
        }
        $(window).load(function(){
            var checkExist = setInterval(function() {
                if ($('.list-item').first().length || $('.header_cw').first().length){
                    clearInterval(checkExist);
                    var url = '';
                    //Classic List formating

                    $('#list_surround table').addClass("list-table-data");
                    $('#list_surround table td[class^="td"]:first-child').addClass("title").addClass("data");
                    $('#list_surround table .animetitle').addClass("link");
                    $('.table_header').each(function(index){
                        if($(this).find('strong a:contains(Progress)').height()){
                            $('#list_surround table td[class^="td"]:nth-child('+(index+1)+')').addClass("progress").addClass("data").find('span a').addClass('link');
                        }
                        if($('strong:contains(Tags)').height()){
                            $('#list_surround table td[class^="td"]:nth-child('+(index+1)+')').addClass("tags");  //.css('background-color','red');
                        }
                    })
                    //
                    if( $('.header-title.tags').height() || $('.td1.tags').height()){
                        $('.tags span a').each(function( index ) {
                            if($(this).text().indexOf("last::") > -1 ){
                                url = $(this).text().split("last::")[1].split("::")[0];
                                setStreamLinks(url, $(this).closest('.list-table-data'));
                                if($('#list_surround').length){
                                    $(this).remove();
                                }else{
                                    $(this).parent().remove();
                                }
                            }
                        });
                    }else{
                        alternativTagOnSite();
                    }

                    return true;
                }
            }, 300);
        });
    }

    function alternativTagOnSite(){
        if($('.list-table').length){
            con.log('Modern Tags');
            var data = $.parseJSON($('.list-table').attr('data-items'));
            $.each(data,function(index, el) {
                if(el['tags'].indexOf("last::") > -1 ){
                    var url = el['tags'].split("last::")[1].split("::")[0];
                    setStreamLinks(url, $('.list-item a[href^="'+el['anime_url']+'"]').parent().parent('.list-table-data'));
                }
            });
        }else{
            con.log('Classic Tags');
            alternativTagToContinue();
        }
    }

    function alternativTagToContinue(){
        var user = window.location.href.split('/')[4].split('?')[0];
        var listType = window.location.href.split('.net/')[1].split('list')[0];
        url = "https://myanimelist.net/malappinfo.php?u="+user+"&status=all&type="+listType;
        con.log("XML Url:", url);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: false,
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            onload: function(response) {
                con.log(response);
                var xml = $(response.responseXML);
                var title = '';
                var xmlAnime = '';
                var span = '';
                if($('#list_surround').length){
                    span = 'span';
                };
                $('.list-table-data').each(function( index ) {
                    title = $(this).find('.title .link '+span).text();
                    xmlAnime = xml.find('series_title:contains('+title+')').first().parent();
                    if(xmlAnime.find('my_tags').text().indexOf("last::") > -1 ){
                        url = xmlAnime.find('my_tags').text().split("last::")[1].split("::")[0];
                        setStreamLinks(url, $(this));
                    }
                });
            }
        });
    }

    function setStreamLinks(url, tableData){
        if(url.indexOf("masterani.me") > -1 && url.indexOf("/watch/") > -1){
            url = url.replace('/watch/','/info/');
        }
        var icon = '<img src="https://www.google.com/s2/favicons?domain='+url.split('/')[2]+'">'
        $(tableData).find('.data.title .link').after('<a class="stream" title="'+url.split('/')[2]+'" target="_blank" style="margin: 0 5px;" href="'+url+'">'+icon+'</a>');


        if(parseInt($(tableData).find('.data.progress .link').text())+1 == GM_getValue( url+'/next')){
            if(typeof GM_getValue( url+'/nextEp') != 'undefined' && !( GM_getValue( url+'/nextEp').match(/undefined$/) )){
                $(tableData).find('.stream').after('<a class="nextStream" title="Next Episode" target="_blank" style="margin: 0 5px 0 0; color: #BABABA;" href="'+ GM_getValue( url+'/nextEp')+'">'+'<img src="https://raw.githubusercontent.com/lolamtisch/KissAnimeList/master/Screenshots/if_Double_Arrow_Right_1063903.png" width="16" height="16">'+'</a>');
            }
        }
    }

    function detailsPopup(){
        $(window).load(function(){
            $('a[href*="editlist.php"]').click(function(){
                $('.editlist').remove();
                $('body').after('<div class="editlist" style="position: fixed; width: 80%; height: 60%; top: 20%; left: 10%;"><div onclick="this.parentElement.remove();" style="position: absolute; right: -15px; top: -15px; border-radius: 50%;-moz-border-radius: 50%;-webkit-border-radius: 50%;background-color: black;color: white;height: 30px;width: 30px;" class="closeEditList">X</div><iframe style="border: none; height: 100%; width: 100%;" src="'+$(this).attr('href')+'&hideLayout" /></div>')
                return false;
            });
        });
    }
