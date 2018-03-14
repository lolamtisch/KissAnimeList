    var tagToContinueNumber = 0;
    function tagToContinue(){
        tagToContinueNumber++;
        if(tagLinks == 0){
            return false;
        }
        if(tagToContinueNumber > 1){
            alternativTagOnSite();
            return true;
        }
        $(window).load(function(){
            var checkExist = setInterval(function() {
                if ($('.list-item').first().length || $('.header_cw').first().length){
                    clearInterval(checkExist);
                    var url = '';
                    //Classic List formating

                    var span = '';
                    if($('#list_surround').length){
                        span = 'span';
                    };

                    $('#list_surround table').addClass("list-table-data");
                    $('#list_surround table .animetitle').parent().addClass("title").addClass("data");
                    $('#list_surround table .animetitle').addClass("link");
                    $('.table_header').each(function(index){
                        if($(this).find('strong a:contains(Progress), a:contains(Chapters)').length){
                            $('#list_surround table td[class^="td"]:nth-child('+(index+1)+')').addClass("progress").addClass("data").find('a span').addClass('link');
                        }
                        if($('strong:contains(Tags)').length){
                            $('#list_surround table td[class^="td"]:nth-child('+(index+1)+')').addClass("tags");  //.css('background-color','red');
                        }
                    })
                    //

                    tagToContinueEpPrediction();

                    if( $('.header-title.tags').length || $('.td1.tags').length){
                        $('.tags span a').each(function( index ) {
                            if($(this).text().indexOf("last::") > -1 ){
                                url = atobURL( $(this).text().split("last::")[1].split("::")[0] );
                                setStreamLinks(url, $(this).closest('.list-table-data'));
                                if($(this).closest('.list-table-data').find('.watching , .reading').length || $('#list_surround').length){
                                    checkForNewEpisodes(url, $(this).closest('.list-table-data'), $(this).closest('.list-table-data').find('.title .link '+span).text(), $(this).closest('.list-table-data').find('.link img.image').attr('src'));
                                }
                                if($('#list_surround').length){
                                    $(this).remove();
                                }else{
                                    $(this).parent().remove();
                                }
                            }
                        });
                        startCheckForNewEpisodes();
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
            con.log('[BOOK] Modern Tags');
            var data = $.parseJSON($('.list-table').attr('data-items'));
            $.each(data,function(index, el) {
                if(el['tags'].indexOf("last::") > -1){
                    var url = atobURL( el['tags'].split("last::")[1].split("::")[0] );
                    setStreamLinks(url, $('.list-item a[href^="'+el[listType+'_url']+'"]').parent().parent('.list-table-data'));
                    if( parseInt(el['status']) === 1 ){
                        checkForNewEpisodes(url, $('.list-item a[href^="'+el[listType+'_url']+'"]').parent().parent('.list-table-data'), el[listType+'_title'], el[listType+'_image_path']);
                    }
                }
            });
            startCheckForNewEpisodes();
        }else{
            con.log('[BOOK] Classic Tags');
            alternativTagToContinue();
        }
    }

    function alternativTagToContinue(){
        var user = window.location.href.split('/')[4].split('?')[0];
        var listType = window.location.href.split('.net/')[1].split('list')[0];
        url = "https://myanimelist.net/malappinfo.php?u="+user+"&status=all&type="+listType;
        con.log("[BOOK] XML Url:", url);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: false,
            onload: function(response) {
                //con.log(response);
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
                        url = atobURL( xmlAnime.find('my_tags').text().split("last::")[1].split("::")[0] );
                        setStreamLinks(url, $(this));
                        if(parseInt(xmlAnime.find('my_status').text()) === 1){
                            checkForNewEpisodes(url, $(this), xmlAnime.find('series_title').text(), xmlAnime.find('series_image').text());
                        }
                    }
                });
                startCheckForNewEpisodes();
            }
        });
    }

    function setStreamLinks(url, tableData){
        if(url.indexOf("masterani.me") > -1 && url.indexOf("/watch/") > -1){
            url = url.replace('/watch/','/info/');
        }
        var icon = '<img src="https://www.google.com/s2/favicons?domain='+url.split('/')[2]+'">'
        $(tableData).find('.data.title .link').after('<a class="stream" title="'+url.split('/')[2]+'" target="_blank" style="margin: 0 5px;" href="'+url+'">'+icon+'</a>');


        if(parseInt($(tableData).find('.data.progress .link').text().trim().replace(/\/.*/,''))+1 == GM_getValue( url+'/next') || GM_getValue( url+'/next') == 'manga'){
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

    function tagToContinueEpPrediction(){
        var modernList = 0;
        $('.list-table .list-item').each(function(){
            modernList = 1;
            var el = $(this);
            var malid = el.find('.link').first().attr('href').split('/')[2];
            epPrediction( malid , function(timestamp, airing, diffWeeks, diffDays, diffHours, diffMinutes){
                el.find('.data.progress span').first().after( epPredictionMessage(timestamp, airing, diffWeeks, diffDays, diffHours, diffMinutes) );
            });
        });

        if(modernList) return;

        //Classic
        $('.progress.data').each(function(){
            var el = $(this).closest('.list-table-data');
            var malid = el.find('.link').first().attr('href').split('/')[2];
            epPrediction( malid , function(timestamp, airing, diffWeeks, diffDays, diffHours, diffMinutes){
                el.find('.data.progress').first().prepend( epPredictionMessage(timestamp, airing, diffWeeks, diffDays, diffHours, diffMinutes) );
            });
        });

        function epPredictionMessage(timestamp, airing, diffWeeks, diffDays, diffHours, diffMinutes){
            if(airing){
                diffWeeks = diffWeeks - (new Date().getFullYear() - new Date(timestamp).getFullYear()); //Remove 1 week between years
                if(diffWeeks < 50){
                    var titleMsg = 'Next episode estimated in '+diffDays+'d '+diffHours+'h '+diffMinutes+'m';
                    return '<a class="kal-ep-pre" ep="'+(diffWeeks+1)+'" title="'+titleMsg+'">['+(diffWeeks+1)+']</a> ';
                }
            }
        }
    }
