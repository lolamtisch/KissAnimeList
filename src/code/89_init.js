    if(window.location.href.indexOf("/BookmarkList") > -1 ){
        $.docReady(function() {
            var optionsTarget = $("#divEmailNotify");
            if(malBookmarks == 1){
                var check = 'checked';
            }else{
                var check = '';
            }
            if(BookmarksStyle == 1 && malBookmarks == 1){
                var checkfix = 'checked';
                $('.bigBarContainer').before('<div id="rightside" style="margin-right: 100px;"><div class="rightBox"> <div class="barTitle">Options</div> <div class="barContent"> <div class="arrow-general"> &nbsp;</div> <div id="optionsTarget"> </div> </div> </div></div>');
                optionsTarget = $("#optionsTarget");
                $('.bigBarContainer>.barContent>div>div:not([class])').first().remove();
            }else{
                var checkfix = '';
            }
            if(classicBookmarks == 1 && malBookmarks == 1){
                var checkClassic = 'checked';
            }else{
                var checkClassic = '';
            }
            $.bookmarkButton(optionsTarget, check);//optionsTarget.before('<div><input type="checkbox" id="malBookmarks" '+check+' > MyAnimeList Bookmarks</div><div class="clear2">&nbsp;</div>');
            $('#malBookmarks').change(function(){
                if($('#malBookmarks').is(":checked")){
                    malBookmarks = 1;
                    GM_setValue('malBookmarks', 1);
                    location.reload();
                }else{
                    malBookmarks = 0;
                    GM_setValue('malBookmarks', 0);
                    location.reload();
                }
            });
            if(malBookmarks == 1){
                $.classicBookmarkButton(optionsTarget, checkClassic);//optionsTarget.before('<div><input type="checkbox" id="BookmarksStyle" '+checkfix+' > Fix Bookmark styling</div><div class="clear2">&nbsp;</div>');
                $('#classicBookmarks').change(function(){
                    if($('#classicBookmarks').is(":checked")){
                        classicBookmarks = 1;
                        GM_setValue('classicBookmarks', 1);
                        location.reload();
                    }else{
                        classicBookmarks = 0;
                        GM_setValue('classicBookmarks', 0);
                        location.reload();
                    }
                });
            }
        });
        if(malBookmarks == 1){
            try{
                GM_addStyle(bookmarkCss);
                if(BookmarksStyle == 1){
                    GM_addStyle(bookmarkFixCss);
                }
                if(classicBookmarks == 1){
                    GM_addStyle('.listing tr:not(.head) br{display: none;} .listing tr:not(.head) .title{width: 30%; float: left;padding-bottom: 0 !important;}.kissData { width: 35% !important;} .MalData {width: 35% !important;}td.Timage {height: 0 !important;} #cssTableSet{min-width: 0 !important} #endSpacer{width: 0 !important;}');
                    GM_addStyle('select.malStatus { width: 33% !important; float: left; margin-right: 9%;}select.malUserRating {width: 33% !important; float: left;}.malEpisode {width: 25%; float: left;}');
                }
            }catch(e){}

            getMalXml();
        }
    }else if(window.location.href.indexOf("myanimelist.net") > -1 ){
        malThumbnails();
        if(window.location.href.indexOf("myanimelist.net/anime.php") > -1){
            window.history.replaceState(null, null, '/anime/'+$.urlParam('id') );
        }
        if(window.location.href.indexOf("myanimelist.net/manga.php") > -1){
            window.history.replaceState(null, null, '/manga/'+$.urlParam('id') );
        }
        if(window.location.href.indexOf("myanimelist.net/animelist") > -1 || window.location.href.indexOf("myanimelist.net/mangalist") > -1 ){
            $.listType = $.listType.substring(0,5);
            tagToContinue();
        }else{
            setKissToMal(window.location.href);
            if(miniMALonMal){
                $( document).ready(function(){
                    setTimeout(function(){
                        createIframe();
                        miniMalButton(window.location.href.split('/').slice(0,6).join('/').split("?")[0]);
                    }, 4000);
                });
            }

            $( document).ready(function(){

                epPrediction(window.location.href.split('/')[4], function(timestamp, airing, diffWeeks, diffDays, diffHours, diffMinutes, episode){
                    if(airing){
                        var titleMsg = 'Next episode estimated in '+diffDays+'d '+diffHours+'h '+diffMinutes+'m' ;
                        if(episode){
                            $('[id="curEps"]').before('<span title="'+titleMsg+'">['+episode+']</span> ');
                        }
                        $('#addtolist').prev().before('<span>'+titleMsg+'</span>');
                    }else{
                        $('#addtolist').prev().before('<span>Airing in '+((diffWeeks*7)+diffDays)+'d '+diffHours+'h '+diffMinutes+'m </span>');
                    }
                });

                getanime(window.location.href, function(actual){
                    if(actual['.add_'+$.listType+'[tags]'].indexOf("last::") > -1 ){
                        var url = atobURL( actual['.add_'+$.listType+'[tags]'].split("last::")[1].split("::")[0] );
                        $('.h1 span').first().after('<div class="data title progress" style="display: inline-block; position: relative; top: 2px;"><div class="link" style="display: none;">'+$('#myinfo_watchedeps').first().val()+'</div></div>');
                        setStreamLinks(url, $('.h1').first().parent());
                    }
                }, window.location.href, window.location.href.split('/')[3]);
            });
        }
    }else{
        $("head").click(function() {
            checkdata();
        });

        $.init();

        try{
            window.onpopstate = function (event) {
                checkdata();
            };
        }catch(e){}
    }

    $(document).ready(function(){
        changelog();
    });
