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
        malThumbnails();
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
                    miniMalButton(window.location.href.split('/').slice(0,6).join('/').split("?")[0]);
                });
            }

            $( document).ready(function(){
                getanime(window.location.href, function(actual){
                    console.log(actual['.add_anime[tags]']);
                    if(actual['.add_anime[tags]'].indexOf("last::") > -1 ){
                        var url = atobURL( actual['.add_anime[tags]'].split("last::")[1].split("::")[0] );
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
                     }\
                     \
                     #flash-div-top, #flash-div, #flashinfo-div{\
                        font-family: "Helvetica","Arial",sans-serif;\
                        color: white;\
                        font-size: 14px;\
                        font-weight: 400;\
                        line-height: 17px;\
                     }\
                     #flash-div-top h2, #flash-div h2, #flashinfo-div h2{\
                        font-family: "Helvetica","Arial",sans-serif;\
                        color: white;\
                        font-size: 14px;\
                        font-weight: 700;\
                        line-height: 17px;\
                        padding: 0;\
                        margin: 0;\
                     }\
                     #flash-div-top a, #flash-div a, #flashinfo-div a{\
                        color: #DF6300;\
                     }');

        $('body').after('<div id="flash-div-top" style="text-align: center;pointer-events: none;position: fixed;top:0px;width:100%;z-index: 2147483647;left: 0;"></div>\
            <div id="flash-div" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;z-index: 2147483647;left: 0;"><div id="flash" style="display:none;  background-color: red;padding: 20px; margin: 0 auto;max-width: 60%;          -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 20px;background:rgba(227,0,0,0.6);"></div></div>\
            <div id="flashinfo-div" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;left: 0;">');

        changelog();
    });
