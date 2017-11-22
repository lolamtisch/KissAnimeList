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
            optionsTarget.bookmarkButton(check);//optionsTarget.before('<div><input type="checkbox" id="malBookmarks" '+check+' > MyAnimeList Bookmarks</div><div class="clear2">&nbsp;</div>');
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
                optionsTarget.classicBookmarkButton(checkClassic);//optionsTarget.before('<div><input type="checkbox" id="BookmarksStyle" '+checkfix+' > Fix Bookmark styling</div><div class="clear2">&nbsp;</div>');
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
        if(window.location.href.indexOf("myanimelist.net/anime.php") > -1){
            window.history.replaceState(null, null, '/anime/'+$.urlParam('id') );
        }
        if(window.location.href.indexOf("myanimelist.net/manga.php") > -1){
            window.history.replaceState(null, null, '/manga/'+$.urlParam('id') );
        }
        if(window.location.href.indexOf("myanimelist.net/animelist") > -1 ){
            tagToContinue();
        }else{
            setKissToMal(window.location.href);
            if(miniMALonMal){
                $( document).ready(function(){
                    createIframe();
                    miniMalButton(window.location.href.split('/').slice(0,5).join('/').split("?")[0]);
                });
            }
        }
    }else{
        $("head").click(function() {
            checkdata();
        });

        $.init();

        window.onpopstate = function (event) {
            checkdata();
        };
    }

    $(document).ready(function(){
        GM_addStyle('.flashinfo{\
                        transition: max-height 2s;\
                     }\
                     .flashinfo:hover{\
                        max-height:5000px !important;\
                        z-index: 2147483647;\
                     }\
                     .flashinfo .synopsis{\
                        transition: max-height 2s, max-width 2s ease 2s;\
                     }\
                     .flashinfo:hover .synopsis{\
                        max-height:9999px !important;\
                        max-width: 500px !important;\
                        transition: max-height 2s;\
                     }\
                     #flashinfo-div{\
                      z-index: 2;\
                      transition: 2s;\
                     }\
                     #flashinfo-div:hover, #flashinfo-div.hover{\
                      z-index: 2147483647;\
                     }');

        $('body').after('<div id="flash-div-top" style="text-align: center;pointer-events: none;position: fixed;top:0px;width:100%;z-index: 2147483647;left: 0;"></div>\
            <div id="flash-div" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;z-index: 2147483647;left: 0;"><div id="flash" style="display:none;  background-color: red;padding: 20px; margin: 0 auto;max-width: 60%;          -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 20px;background:rgba(227,0,0,0.6);"></div></div>\
            <div id="flashinfo-div" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;left: 0;">');

        changelog();
    });
