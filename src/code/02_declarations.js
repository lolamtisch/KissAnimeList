//if (window.top != window.self) {return; }
//TODO: temporary workaround

    var googleover = 0;
    var debug = 0;

    var con = console;
    con = {
        log: function() {},
        error: function() {},
        debug: function() {}
    };

    var element = new Image();

    var debugging = GM_getValue('debugging', 0 );

    if(debugging){
        debug = 1;
        con.log = function(){
            var args = Array.prototype.slice.call(arguments);
            args.unshift("color: blue;");
            args.unshift("%c[KAL]");
            console.log.apply(console, args);
        }
    }else{
        Object.defineProperty(element, 'id', {
          get: function () {
            debug = 1;
            con.log = function(){
                var args = Array.prototype.slice.call(arguments);
                args.unshift("color: blue;");
                args.unshift("%c[KAL]");
                console.log.apply(console, args);
            }
          }
        });
    }
    console.log('%cKissAnimeList ['+GM_info.script.version+']', element,);



    var malBookmarks = GM_getValue( 'malBookmarks', 1 );
    var classicBookmarks = GM_getValue( 'classicBookmarks', 0 );
    if(classicBookmarks === 0){
        var BookmarksStyle = 1;
    }

    var tagLinks = GM_getValue( 'tagLinks', 1 );
    var epPredictions = GM_getValue( 'epPredictions', 1 );
    var newEpInterval = GM_getValue( 'newEpInterval', 'null' );
    var newEpNotification = GM_getValue( 'newEpNotification', 1 );
    var newEpBorder = GM_getValue( 'newEpBorder', 'ff0000' );
    var openInBg = GM_getValue( 'openInBg', 1 );
    var newEpCR = GM_getValue( 'newEpCR', 0 );

    var searchLinks = GM_getValue( 'searchLinks', 1 );
    var kissanimeLinks = GM_getValue( 'kissanimeLinks', 1 );
    var kissmangaLinks = GM_getValue( 'kissmangaLinks', 1 );
    var masteraniLinks = GM_getValue( 'masteraniLinks', 1 );
    var nineanimeLinks = GM_getValue( 'nineanimeLinks', 1 );
    var crunchyrollLinks = GM_getValue( 'crunchyrollLinks', 1 );
    var gogoanimeLinks = GM_getValue( 'gogoanimeLinks', 1 );

    var malThumbnail = GM_getValue( 'malThumbnail', 100 );

    var miniMALonMal = GM_getValue( 'miniMALonMal', 0 );
    var posLeft = GM_getValue( 'posLeft', 'left' );
    var outWay = GM_getValue( 'outWay', 1 );
    var miniMalWidth = GM_getValue( 'miniMalWidth', '30%' );
    var miniMalHeight = GM_getValue( 'miniMalHeight', '90%' );

    var displayFloatButton = GM_getValue( 'displayFloatButton', 1 );

    var episodeInfoBox = GM_getValue( 'episodeInfoBox', 0 );
    var episodeInfoSynopsis = GM_getValue( 'episodeInfoSynopsis', 1 );
    var episodeInfoImage = GM_getValue( 'episodeInfoImage', 1 );
    var episodeInfoSubtitle = GM_getValue( 'episodeInfoSubtitle', 1 );

    var autoTracking = GM_getValue( 'autoTracking', 1 );

    var delay = GM_getValue( 'delay', 3 );

    var currentMalData = null;

    var loadingText = 'Loading';

    var curVersion = GM_info.script.version;

    function changelog(){
        if(curVersion != GM_getValue( 'Version', null )){
            var message = '<div style="text-align: left;">';
            if(GM_getValue( 'Version', null ) != null){
                switch(curVersion) {
                    case '0.86.4':
                        message += 'Kissanimelist (v0.86)<br/>- 9anime Support<br/>- Link to last streaming page on Myanimelist\'s Animelist (Tags have to be activated)';
                        break;
                    case '0.86.5':
                        message += 'Kissanimelist (v0.86.5)<br/>- add config Page (Can be found in Mal profile settings)';
                        break;
                    case '0.87.1':
                        message += 'Kissanimelist (v0.87.1)<br/>- Materialize UI<br/>- Add miniMAL popup';
                        break;
                    case '0.87.3':
                        message += 'Kissanimelist (v0.87.3)<br/>- Crunchyroll Support (Video page only)<br/>- Added MAL classic bookmark support<br/>- Added next episode links in MAL bookmarks';
                        break;
                    case '0.87.8':
                        message += 'Kissanimelist (v0.87.8)<br/>- Android Support<br/>- Added Autoupdate delay settings';
                        break;
                    case '0.87.9':
                        message += 'Kissanimelist (v0.87.9)<br/>- Gogoanime Support<br/>- Crunchyroll multiple season support';
                        break;
                    case '0.89.0':
                        message += 'Check out the new <a href="https://discord.gg/cTH4yaw">Discord channel</a>!<br/><br/>Kissanimelist (v0.89.0)</br>- Add Search to miniMAL</br>- Add MyAnimeList Bookmarks to miniMAL</br>- MyAnimeList Tags don\'t need to be activated anymore</br>- Mal2Crunchyroll links now hides remaining seasons</br>';
                        break;
                    case '0.90.0':
                        message += 'Changelog (v0.90.0):<br/>    - Added a shortcut for MiniMAL ( CTRL + M )<br/>    - Added MiniMAL position and dimension settings<br/>    - Added an option for displaying \'Episode Hoverinfo\'<br/>    - Added miniMAL to MyAnimeList<br/>    - Changed the \'Add to Mal\'-message, to a non-blocking message<br/>    - Fixed the database structure<br/><br/>New on KissAnimeLists <a href="https://discord.gg/cTH4yaw">Discord</a>:<br/>    - Feed showing newly added episodes for each of the supported streaming sites.';
                        break;
                    case '0.90.2':
                        message += 'KissAnimeList (v0.90.2):<br/>    - Added support for 9anime.is and 9anime.ru';
                        break;
                    case '0.91.0':
                        message += 'Changelog (v0.91.0):<br/><br/> [Added]  <br/> - Feature: Thumbnails on MAL have been enlarged, with added resizing options. <br/> - Feature: "Move out of the way"-feature, which moves the video when miniMAL is opened. <br/> - Feature: "Continue watching"-links has been added to both the Overview-tab in miniMAL, and to the details-tab on MAL. <br/> - Info-bubbles has been added to the settings tab in miniMAL. <br/><br/> [Changed] <br/> - Updated the miniMAL styling. <br/><br/> [Fixed] <br/> - miniMAL-button didn\'t always appear.';
                        break;
                    case '0.91.1':
                        message += 'KissAnimeList (v0.91.1):<br/><br/>  [Fixed] <br/> - KAL now works with 9anime\'s new layout';
                        break;
                    case '0.91.2':
                        message += 'KissAnimeList (v0.91.2):<br/><br/>  [Fixed] <br/> - New database-structure for 9anime urls';
                        break;
                    case '0.91.3':
                        message += 'KissAnimeList (v0.91.3):<br/><br/>  [Fixed] <br/> - Improved title recognition on 9anime & MasterAnime';
                        break;
                    case '0.91.4':
                        message += 'KissAnimeList (v0.91.4):<br/><br/> [Added] <br/> - Support for 9anime.ch  <br/> <br/> [Fixed] <br/> - "MAL thumbnails" and "Episode Hoverinfo" not working in Opera <br/> - The miniMAL-button was not appearing for anime\'s without a MAL-url';
                        break;
                    case '0.92.1':
                        message += 'KissAnimeList (v0.92.0):<br/><br/> [Added] <br/>- Feature: Display a tentative episode number and air time for anime.  <br/>- Feature: If autotracking is deactivated - Display a popup for manually updating  <br/>- Mangalist integration <br/>- Added a section for characters to miniMAL.  <br/>- Added anime/manga switches for miniMAL\'s search and bookmarks <br/>- Feature: Episode/Chapter releases check [BETA] (Deactivated by default) <br/> ';
                        break;
                }
            }else{
                message += '<h2>Welcome to <a href="https://greasyfork.org/en/scripts/27564-kissanimelist">KissAnimeList</a></h2><br/>Support:<br/><a href="https://discord.gg/cTH4yaw">Discord Channel</a><br/><a href="https://github.com/lolamtisch/KissAnimeList">GitHub</a> <a href="https://github.com/lolamtisch/KissAnimeList/issues">Issues</a>';
            }
            if(message != '<div style="text-align: left;">'){
                message += '</div><button class="okChangelog" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px;cursor: pointer;">Close</button>'
                flashm(message, false, false, true);
                $('.okChangelog').click(function(){
                    GM_setValue( 'Version', curVersion );
                    $('.flashPerm').remove();
                });
            }else{
                GM_setValue( 'Version', curVersion );
            }
        }
    }

    function getDeclaration(kalUrl){
    var Kal = {};

    if( kalUrl.indexOf("kissanime.ru") > -1 ){
        //#########Kissanime#########
        Kal.domain = 'http://kissanime.ru';
        Kal.textColor = '#d5f406';
        Kal.dbSelector = 'Kissanime';
        Kal.listType = 'anime';
        Kal.bookmarkCss = ".listing tr td:nth-child(1){height: 150px;padding-left: 125px;} .listing tr td{vertical-align: top;}";
        Kal.bookmarkFixCss = ".bigBarContainer {margin: 0px; width: 630px !important; text-align: left; float: left;}";
        Kal.videoSelector = '#divContentVideo';

        Kal.init = function() {
            checkdata();
        }

        Kal.imageCache = function(selector) {
            return $('#rightside').find('img').attr('src');
        };

        Kal.isOverviewPage = function() {
            if(typeof kalUrl.split('/')[5] != 'undefined'){
                if($('#centerDivVideo').length){
                    return false;
                }
            }
            return true;
        };
        Kal.episodeListSelector = function() {
            return $(".listing a");
        };
        Kal.episodeListElementHref = function(selector) {
            return $.absoluteLink(selector.attr('href'));
        };
        Kal.episodeListElementTitle = function(selector) {
            return selector.text().replace($('.bigChar').text(),'');
        };
        Kal.episodeListNextElement = function(selector, index) {
            if ((index-1) > -1) {
                return Kal.episodeListSelector().eq(index-1);
            }
            return $();
        };
        Kal.handleNextLink = function(truelink, anime){
            return truelink;
        };

        Kal.urlEpisodePart = function(url) {
            return url.split("/")[5].split("?")[0];
        };
        Kal.urlAnimeIdent = function(url) {
            return url.split('/').slice(0,5).join('/');
        };
        Kal.urlAnimeSelector = function(url) {
            return url.split("/")[4].split("?")[0];
        };
        Kal.urlAnimeTitle = function(url) {
            return Kal.urlAnimeSelector(url);
        };

        Kal.EpisodePartToEpisode = function(string) {
            var temp = [];
            temp = string.match(/[e,E][p,P][i,I]?[s,S]?[o,O]?[d,D]?[e,E]?\D?\d{3}/);
            if(temp !== null){
                string = temp[0];
            }
            temp = string.match(/\d{3}/);
            if(temp === null){
                temp = string.match(/\d{2,}\-/);
                if(temp === null){
                    string = 0;
                }else{
                    string = temp[0];
                }
            }else{
                string = temp[0];
            }
            return string;
        };

        Kal.uiPos = function(selector) {
            selector.insertAfter($(".bigChar").first());
        };
        Kal.uiWrongPos = function(selector) {
            selector.insertAfter($(".bigChar").first());
        };
        Kal.uiHeadPos = function(selector) {
            selector.appendTo($(".barTitle").first());
        };

        Kal.docReady = function(data) {
            return $( document).ready(data);
        };

        Kal.normalUrl = function(){
            return Kal.urlAnimeIdent(kalUrl);
        };

        Kal.epListReset = function(selector) {
            selector.parent().parent().css("background-color","initial");
        };
        Kal.epListActive = function(selector) {
            selector.parent().parent().css("background-color","#002966");
        };

        Kal.bookmarkEntrySelector = function() {
            return $(".trAnime");
        };

        Kal.nextEpLink = function(url) {
            return url+'/'+$('#selectEpisode option:selected').next().val();
        };

        Kal.classicBookmarkButton = function(selector, checkClassic) {
            selector.before('<div><input type="checkbox" id="classicBookmarks" '+checkClassic+' > Classic styling</div><div class="clear2">&nbsp;</div>');
        };
        Kal.bookmarkButton = function(selector, check) {
            selector.before('<div><input type="checkbox" id="malBookmarks" '+check+' > MyAnimeList Bookmarks</div><div class="clear2">&nbsp;</div>');
        };

        Kal.BookmarksStyleAfterLoad = function() {
            if( BookmarksStyle == 1 ){
                var optionsTarget = $("#optionsTarget");
                var blackSpacer = "";
            }else{
                var optionsTarget = $("#divIsShared");
                var blackSpacer = '<th id="endSpacer" width="36%" style="border: 0;">';
            }
            $(".head").html('<th id="cssTableSet" style="min-width:120px;padding-right: 5px;"></th><th></th>'+blackSpacer+'</th>');
            $( ".listing tr td:nth-child(1)" ).before("<td class='Timage' style='padding-left: 0;'></td>");
            $( ".listing tr td:nth-child(1)" ).css("height","150px");
            optionsTarget.after('<div class="clear2">&nbsp;</div><div><button type="button" id="clearCache">Clear Cache</button></div>');
            $("#clearCache").click( function(){
                clearCache();
            });
        };
        //###########################
    }else if( kalUrl.indexOf("kissmanga.com") > -1 ){
        //#########Kissmanga#########
        Kal.domain = 'http://kissmanga.com';
        Kal.textColor = '#72cefe';
        Kal.dbSelector = 'Kissmanga';
        Kal.listType = 'manga';
        Kal.bookmarkCss = ".listing tr td:nth-child(1){height: 150px;padding-left: 125px;} .listing tr td{vertical-align: top;}";
        if(classicBookmarks == 0){
            Kal.bookmarkCss += '#leftside{width: 581px !important;} #rightside{ float: left !important; margin-left: 30px;}';
        }
        Kal.bookmarkFixCss = "";
        BookmarksStyle = "";

        Kal.init = function() {
            Kal.docReady(function(){
                if(!Kal.isOverviewPage()){
                    $('#divImage > p').each(function(index, el) {
                        $(this).attr('id', index+1).addClass('kal-image');
                    });
                    var hash = window.location.hash;
                    setTimeout(function(){
                        var page = parseInt(hash.substring(1));
                        if(!isNaN(page)){
                            window.location.hash = '';
                            window.location.hash = hash;
                        }

                        if($( "button:contains('Load Manga')" ).length){
                            $( "button:contains('Load Manga')").click(function(){
                                manga_loader();
                            });
                        }
                        if($('.ml-images').length){
                            manga_loader();
                        }
                        function manga_loader(){
                            setTimeout(function(){
                                var tempDocHeight = $(document).height();
                                if(hash && !(isNaN(page))) findPage();
                                function findPage(){
                                    if($(".ml-images .ml-counter:contains('"+page+"')").length){
                                        $("html, body").animate({ scrollTop: $(".ml-images .ml-counter:contains('"+page+"')").prev().offset().top }, "slow");
                                    }else{
                                        $("html, body").animate({ scrollTop: $(document).height() }, 0);
                                        setTimeout(function(){
                                            $('html').scroll();
                                            if(tempDocHeight != $(document).height()){
                                                tempDocHeight = $(document).height();
                                                findPage();
                                            }
                                        }, 500);
                                    }
                                }
                            }, 2000);
                        }
                        var delayUpate = 1;
                        $(document).scroll(function() {
                            if(delayUpate){
                                delayUpate = 0;
                                setTimeout(function(){ delayUpate = 1; }, 2000);
                                $('.kal-image').each(function(index, el) {
                                    if($(this).isInViewport()){
                                        if(window.location.hash != '#'+$(this).attr('id')){
                                            history.pushState({}, null, '#'+$(this).attr('id'));
                                            checkdata();
                                        }
                                        return false;
                                    }
                                });
                                $('.ml-images img').each(function(index, el) {
                                    if($(this).isInViewport()){
                                        if(window.location.hash != '#'+$(this).next().text()){
                                            history.pushState({}, null, '#'+$(this).next().text());
                                            checkdata();
                                        }
                                        return false;
                                    }
                                });
                            }
                        });
                    }, 5000);
                }
            });
            checkdata();
        }

        Kal.imageCache = function(selector) {
            return $('#rightside').find('img').attr('src');
        };

        Kal.isOverviewPage = function() {
            if($("#malp").width() !== null){
                return true;
            }else{
                return false;
            }
        };
        Kal.episodeListSelector = function() {
            return $(".listing a");
        };
        Kal.episodeListElementHref = function(selector) {
            return $.absoluteLink(selector.attr('href'));
        };
        Kal.episodeListElementTitle = function(selector) {
            return selector.text().replace($('.bigChar').text(),'');
        };
        Kal.episodeListNextElement = function(selector, index) {
            if ((index-1) > -1) {
                return Kal.episodeListSelector().eq(index-1);
            }
            return $();
        };
        Kal.handleNextLink = function(truelink, anime){
            return truelink;
        };

        Kal.urlEpisodePart = function(url) {
            return url.split("/")[5].split("?")[0];
        };
        Kal.urlAnimeIdent = function(url) {
            return url.split('/').slice(0,5).join('/');
        };
        Kal.urlAnimeSelector = function(url) {
            return url.split("/")[4].split("?")[0];
        };
        Kal.urlAnimeTitle = function(url) {
            return Kal.urlAnimeSelector(url);
        };

        Kal.EpisodePartToEpisode = function(string) {
            var temp = [];
            try{
                string = string.replace($('.bigChar').attr('href').split('/')[2],'');
            }catch(e){string = string.replace(kalUrl.split("/")[4],'');}
            temp = string.match(/[c,C][h,H][a,A]?[p,P]?[t,T]?[e,E]?[r,R]?\D?\d+/);
            if(temp === null){
                string = string.replace(/[V,v][o,O][l,L]\D?\d+/,'');
                temp = string.match(/\d{3}/);
                if(temp === null){
                    temp = string.match(/\d+/);
                    if(temp === null){
                        string = 0;
                    }else{
                        string = temp[0];
                    }
                }else{
                    string = temp[0];
                }
            }else{
                string = temp[0].match(/\d+/)[0];
            }
            return string;
        };

        Kal.uiPos = function(selector) {
            selector.insertAfter($(".bigChar").first());
        };
        Kal.uiWrongPos = function(selector) {
            selector.insertAfter($(".bigChar").first());
        };
        Kal.uiHeadPos = function(selector) {
            selector.appendTo($(".barTitle").first());
        };

        Kal.docReady = function(data) {
            return $( document).ready(data);
        };

        Kal.normalUrl = function(){
            return Kal.urlAnimeIdent(kalUrl);
        };

        Kal.epListReset = function(selector) {
            selector.parent().parent().css("background-color","initial");
        };
        Kal.epListActive = function(selector) {
            selector.parent().parent().css("background-color","#002966");
        };

        Kal.bookmarkEntrySelector = function() {
            return $(".listing tr:not(.head)");
        };

        Kal.nextEpLink = function(url) {
            return kalUrl;
        };

        Kal.classicBookmarkButton = function(selector, checkClassic) {
            $("#rightside .barContent div").last().after('<div><input type="checkbox" id="classicBookmarks" '+checkClassic+' > Classic styling</div><div class="clear2">&nbsp;</div>');
        };
        Kal.bookmarkButton = function(selector, check) {
            $("#rightside .barContent div").last().after('<div class="clear2" style="border-bottom: 1px solid #DDD2A4;">&nbsp;</div><div class="clear2">&nbsp;</div><div><input type="checkbox" id="malBookmarks" '+check+' > MyAnimeList Bookmarks</div>');
        };

        Kal.BookmarksStyleAfterLoad = function() {
            $(".head").html('<th id="cssTableSet" style="min-width:120px;padding-right: 5px;"></th><th></th>');//<th width="21%" style=""></th>');
            $( ".listing tr td:nth-child(1)" ).before("<td class='Timage' style='padding-left: 0;'></td>");
            $( ".listing tr td:nth-child(1)" ).css("height","150px");
            $("#rightside .barContent div").last().after('<div class="clear2">&nbsp;</div><div><button type="button" id="clearCache">Clear Cache</button></div>');
            $("#clearCache").click( function(){
                clearCache();
            });
        };
        //###########################
    }else if( kalUrl.indexOf("masterani.me") > -1 ){
        //#########Masterani.me#########
        Kal.domain = 'https://www.masterani.me';
        Kal.textColor = 'white';
        Kal.dbSelector = 'Masterani';
        Kal.listType = 'anime';
        Kal.bookmarkCss = "";
        Kal.bookmarkFixCss = "";
        Kal.videoSelector = '.ui.embed';
        var winLoad = 0;

        Kal.init = function() {
            checkdata();
        }

        Kal.imageCache = function(selector) {
            return $('.class').first().find('img').attr('src');
        };

        Kal.isOverviewPage = function() {
            if(Kal.normalUrl().split('/')[4] !== 'watch'){
                return true;
            }else{
                return false;
            }
        };
        Kal.episodeListSelector = function() {
            return $(".thumbnail a.title");
        };
        Kal.episodeListElementHref = function(selector) {
            return $.absoluteLink(selector.attr('href'));
        };
        Kal.episodeListElementTitle = function(selector) {
            return selector.find("div").text()+' ('+selector.find("span").text()+')';
        };
        Kal.episodeListNextElement = function(selector, index) {
            if ((index+1) > -1) {
                return Kal.episodeListSelector().eq(index+1);
            }
            return $();
        };
        Kal.handleNextLink = function(truelink, anime){
            $('.menu.pagination').off('click').on( "click", function() {
                handleanime(anime);
            });
            if(truelink == null){
                var nextEp = parseInt(anime['.add_anime[num_watched_episodes]'])+1;
                if(nextEp <= parseInt(anime['totalEp'])){
                    return '<a style="color: white;" href="/anime/watch/'+Kal.normalUrl().replace(/#[^#]*$/, "").replace(/\?[^\?]*$/, "").split("/")[5]+'/'+nextEp+'">Ep. '+nextEp+'</a>';
                }
            }
            return truelink;
        };

        Kal.urlEpisodePart = function(url) {
            return url.split("/")[6].split("?")[0];
        };
        Kal.urlAnimeIdent = function(url) {
            return url.split('/').slice(0,6).join('/');
        };
        Kal.urlAnimeSelector = function(url) {
            return url.split("/")[5].split("?")[0];
        };
        Kal.urlAnimeTitle = function(url) {
            return Kal.urlAnimeSelector(url).replace(/^\d*-/,'');
        };

        Kal.EpisodePartToEpisode = function(string) {
            return string;
        };

        Kal.uiPos = function(selector) {
            selector.prependTo($("#stats").first());
        };
        Kal.uiWrongPos = function(selector) {
            selector.css('margin-top','5px').appendTo($(".ui.info.list").first());
        };
        Kal.uiHeadPos = function(selector) {
            selector.appendTo($("h1").first());
        };

        $(window).load(function(){
            winLoad = 1;
        });
        if(kalUrl.indexOf("/info/") > -1){
            Kal.docReady = function(data) {
                var checkExist = setInterval(function() {
                    if ($('#stats').length) {
                        clearInterval(checkExist);
                        if(winLoad == 0){
                            //winLoad = 1;alert();
                            return $(window).load(data);
                        }else{
                            return $( document).ready(data);
                        }
                    }
                }, 500);
            };
        }else{
            Kal.docReady = function(data) {
                return $( document).ready(data);
            }
        };

        Kal.normalUrl = function(){
            return Kal.urlAnimeIdent(kalUrl);
        };

        Kal.epListReset = function(selector) {
            selector.parent().parent().css("background-color","initial");
        };
        Kal.epListActive = function(selector) {
            selector.parent().parent().css("background-color","#002966");
        };

        Kal.bookmarkEntrySelector = function() {
            return $(".trAnime");
        };

        Kal.nextEpLink = function(url) {
            return 'https://www.masterani.me'+$('#watch .anime-info .actions a').last().attr('href');
        };

        Kal.classicBookmarkButton = function(selector, checkfix) {
        };
        Kal.bookmarkButton = function(selector, check) {
        };

        Kal.BookmarksStyleAfterLoad = function() {
        };
        //###########################
    }else if( kalUrl.indexOf("9anime.") > -1 ){
        //#########9anime#########
        Kal.domain = 'https://'+window.location.hostname;
        Kal.textColor = '#694ba1';
        Kal.dbSelector = '9anime';
        Kal.listType = 'anime';
        Kal.bookmarkCss = "";
        Kal.bookmarkFixCss = "";
        Kal.videoSelector = '#player';
        var winLoad = 0;

        Kal.init = function() {
            GM_addStyle('.headui a {color: inherit !important;}');
            var tempEpisode = "";
            Kal.docReady(function(){
                document.addEventListener("load", event =>{
                    var curEpisode = $(".servers .episodes a.active").attr('data-base');
                    if(curEpisode !== tempEpisode){
                        tempEpisode =  curEpisode;
                        if($('.servers').height() == null){
                            tempEpisode = "";
                            return;
                        }
                        if(curEpisode != ''){
                            var animechange = {};
                            animechange['.add_anime[num_watched_episodes]'] = parseInt(curEpisode);
                            animechange['checkIncrease'] = 1;
                            animechange['forceUpdate'] = 1;
                            setanime( Kal.normalUrl(),animechange);
                        }
                    }
                }, true);
            });
            checkdata();
        }

        Kal.imageCache = function(selector) {
            return $('.class').first().find('img').attr('src');
        };

        Kal.isOverviewPage = function() {
            if(Kal.normalUrl().split('/')[4] !== 'watch'){
                return true;
            }else{
                return false;
            }
        };
        Kal.episodeListSelector = function() {
            return $(".servers .episodes a");
        };
        Kal.episodeListElementHref = function(selector) {
            return $.absoluteLink(selector.attr('href'))+'?ep='+selector.attr('data-base');
        };
        Kal.episodeListElementTitle = function(selector) {
            if(selector.text() == ''){
                return '';
            }
            return 'Episode '+selector.text();
        };
        Kal.episodeListNextElement = function(selector, index) {
            if ((index+1) > -1) {
                return Kal.episodeListSelector().eq(index+1);
            }
            return $();
        };
        Kal.handleNextLink = function(truelink, anime){
            return truelink;
        };

        Kal.urlEpisodePart = function(url) {
            return url.split('?ep=')[1];
        };
        Kal.urlAnimeIdent = function(url) {
            return url.split('/').slice(0,5).join('/');
        };
        Kal.urlAnimeSelector = function(url) {
                url = url.split("/")[4].split("?")[0];
            if( url.indexOf(".") > -1 ){
                url = url.split(".")[1];
            }
            return url;
        };
        Kal.urlAnimeTitle = function(url) {
            return url.split("/")[4].split("?")[0].split(".")[0];
        };

        Kal.EpisodePartToEpisode = function(string) {
            return string;
        };

        Kal.uiPos = function(selector) {
            $('<div class="widget info"><div class="widget-body"> '+selector.html()+'</div></div>').insertBefore($(".widget.info").first());
        };
        Kal.uiWrongPos = function(selector) {
            selector.css('font-size','14px').insertBefore($("#info").first());
            $('.title').first().css('display', 'inline-block');
        };
        Kal.uiHeadPos = function(selector) {
            selector.addClass('title').css('margin-right','0').appendTo($(".widget.player .widget-title").first());
        };

        $(window).load(function(){
            winLoad = 1;
        });
        if(kalUrl.indexOf("/info/") > -1){
            Kal.docReady = function(data) {
                var checkExist = setInterval(function() {
                    if ($('#stats').length) {
                        clearInterval(checkExist);
                        if(winLoad == 0){
                            //winLoad = 1;alert();
                            return $(window).load(data);
                        }else{
                            return $( document).ready(data);
                        }
                    }
                }, 500);
            };
        }else{
            Kal.docReady = function(data) {
                return $( document).ready(data);
            }
        };

        Kal.normalUrl = function(){
            return Kal.urlAnimeIdent(kalUrl);
        };

        Kal.epListReset = function(selector) {
            selector.css("border-style","none");
        };
        Kal.epListActive = function(selector) {
            selector.css("border-color","#002966").css("border-width","2px").css("border-style","solid");
        };

        Kal.bookmarkEntrySelector = function() {
            return $(".trAnime");
        };

        Kal.nextEpLink = function(url) {
            return Kal.domain+$(".servers .episodes a.active").parent('li').next().find('a').attr('href');
        };

        Kal.classicBookmarkButton = function(selector, checkfix) {
        };
        Kal.bookmarkButton = function(selector, check) {
        };

        Kal.BookmarksStyleAfterLoad = function() {
        };
        //###########################
    }else if( kalUrl.indexOf("crunchyroll.com") > -1 ){
        //TODO:
        //http://www.crunchyroll.com/ace-of-the-diamond
        //http://www.crunchyroll.com/trinity-seven
        //#########Crunchyroll#########
        if(kalUrl == 'http://www.crunchyroll.com/'){
            return;
        }
        Kal.domain = 'http://www.crunchyroll.com';
        Kal.textColor = 'black';
        Kal.dbSelector = 'Crunchyroll';
        Kal.listType = 'anime';
        Kal.bookmarkCss = "";
        Kal.bookmarkFixCss = "";
        Kal.videoSelector = '#showmedia_video_box_wide,#showmedia_video_box';
        GM_addStyle('.headui a {color: black !important;} #malp{margin-bottom: 8px;}');

        Kal.init = function() {
            $( document).ready(function(){
                if( $('.season-dropdown').length > 1){
                    $('.season-dropdown').append('<span class="exclusivMal" style="float: right; margin-right: 20px; color: #0A6DA4;" onclick="return false;">MAL</span>');
                    $('.exclusivMal').click(function(){
                        $('#showview_content').before('<div><a href="'+kalUrl.split('?')[0]+'">Show hidden seasons</a></div>');
                        var thisparent =  $(this).parent();
                        $('.season-dropdown').not(thisparent).siblings().remove();
                        $('.season-dropdown').not(thisparent).remove();
                        $('.portrait-grid').css('display','block').find("li.group-item img.landscape").each(function() {
                            void 0 === $(this).attr("src") && $(this).attr("src", $(this).attr("data-thumbnailUrl"))
                        }),
                        $('.exclusivMal').remove();
                        checkdata();
                    });
                    var season = new RegExp('[\?&]' + 'season' + '=([^&#]*)').exec(kalUrl);
                    if(season != null){
                        season = season[1] || null;
                        if(season != null){
                            season = decodeURIComponent(decodeURI(season));
                            $('.season-dropdown[title="'+season+'" i] .exclusivMal').first().click();
                        }
                    }
                    return;
                }else{
                    checkdata();
                }
            });
        }

        Kal.imageCache = function(selector) {
            return $('#rightside').find('img').attr('src');
        };

        Kal.isOverviewPage = function() {
            if(typeof kalUrl.split('/')[4] != 'undefined'){
                if($('#showmedia_video').length){
                    return false;
                }
            }
            return true;
        };
        Kal.episodeListSelector = function() {
            return $("#showview_content_videos .list-of-seasons .group-item a");
        };
        Kal.episodeListElementHref = function(selector) {
            return $.absoluteLink(selector.attr('href'));
        };
        Kal.episodeListElementTitle = function(selector) {
            return selector.find('.series-title').text();
        };
        Kal.episodeListNextElement = function(selector, index) {//TODO
            if ((index-1) > -1) {
                return Kal.episodeListSelector().eq(index-1);
            }
            return $();
        };
        Kal.handleNextLink = function(truelink, anime){
            return truelink;
        };

        Kal.urlEpisodePart = function(url) {
            return url.split("/")[4];
        };
        Kal.urlAnimeIdent = function(url) {
            return url.split('/').slice(0,4).join('/');
        };
        /*$( document).ready(function(){//TODO
            var seasons = 0;
            $('.season-dropdown').each(function(index){
                seasons = 1;
                checkdata('.season-dropdown:nth-child('+index+') ');
                $('.season-dropdown:nth-child('+index+')').css('background-color','red');
                //alert($(this).text());
            });

            if(seasons == 0){
                alert($('#source_showview h1 span').text());
            }


            var script = ($("#template_body script")[1]).innerHTML;
            script = script.split('mediaMetadata =')[1].split('"name":"')[1].split(' -')[0];
            alert(script);
        });*/
        Kal.urlAnimeSelector = function(url) {
            if(Kal.isOverviewPage()){
                if( $('.season-dropdown').length > 1){
                    $('<div>Kissanimelist does not support multiple seasons on one page</div>').uiPos();
                    throw new Error('Kissanimelist does not support multiple seasons');
                }else{
                    if($('.season-dropdown').length){
                        return $('.season-dropdown').first().text();
                    }else{
                        return $('#source_showview h1 span').text();
                    }
                }
            }else{
                var script = ($("#template_body script")[1]).innerHTML;
                script = script.split('mediaMetadata =')[1].split('"name":"')[1].split(' -')[0];
                script = JSON.parse('"' + script.replace('"', '\\"') + '"');
                //console.log(script);
                return script;
                return url.split("/")[3];
            }
        };
        Kal.urlAnimeTitle = function(url) {
            return Kal.urlAnimeSelector(url);
        };

        Kal.EpisodePartToEpisode = function(string) {
            var temp = [];
            temp = string.match(/[e,E][p,P][i,I]?[s,S]?[o,O]?[d,D]?[e,E]?\D?\d+/);
            if(temp !== null){
                string = temp[0];
            }else{
                string = '';
            }
            temp = string.match(/\d+/);
            if(temp === null){
                string = 1;
            }else{
                string = temp[0];
            }
            return string;
        };

        Kal.uiPos = function(selector) {//TODO
            if(Kal.isOverviewPage()){
                //selector.insertAfter($("h1.ellipsis"));
                selector.insertBefore($("#tabs").first());
                $('#malStatus option').css('background-color','#f2f2f2');
                $('#malUserRating option').css('background-color','#f2f2f2');
                //selector.prependTo($('.season-dropdown'));
            }
        };
        Kal.uiWrongPos = function(selector) {//TODO after second element
            //selector.prependTo($("#sidebar_elements").first());
        };
        Kal.uiHeadPos = function(selector) {//TODO
            selector.appendTo($(".ellipsis").first());
        };

        Kal.docReady = function(data) {
            return $( document).ready(data);
        };

        Kal.normalUrl = function(){
            return Kal.urlAnimeIdent(kalUrl);
        };

        Kal.epListReset = function(selector) {
            selector.css("background-color","#fff");
        };
        Kal.epListActive = function(selector) {
            selector.css("background-color","#b2d1ff");
        };

        Kal.bookmarkEntrySelector = function() {
            //return $(".trAnime");
        };

        Kal.nextEpLink = function(url) {
            return 'http://www.crunchyroll.com'+$('.collection-carousel-media-link-current').parent().next().find('.link').attr('href');
        };

        Kal.classicBookmarkButton = function(selector, checkClassic) {

        };
        Kal.bookmarkButton = function(selector, check) {

        };

        Kal.BookmarksStyleAfterLoad = function() {

        };
        //###########################
    }else if( kalUrl.indexOf("gogoanime.") > -1 ){
        //#########Gogoanime.tv#########
        if(!kalUrl.split('/')[3]){
            return;
        }
        Kal.domain = kalUrl.split('/').slice(0,3).join('/')+'/';
        Kal.textColor = 'white';
        Kal.dbSelector = 'Gogoanime';
        Kal.listType = 'anime';
        Kal.bookmarkCss = "";
        Kal.bookmarkFixCss = "";
        Kal.videoSelector = '.anime_video_body_watch_items';
        var winLoad = 0;

        Kal.init = function() {
            GM_addStyle('.headui a {color: inherit !important;}');
            checkdata();
        }

        Kal.imageCache = function(selector) {
            return $('.class').first().find('img').attr('src');
        };

        Kal.isOverviewPage = function() {
            if(kalUrl.split('/')[3] === 'category'){
                return true;
            }else{
                return false;
            }
        };
        Kal.episodeListSelector = function() {
            return $("#episode_related a");
        };
        Kal.episodeListElementHref = function(selector) {
            return Kal.domain+selector.attr('href').replace(' /','');
        };
        Kal.episodeListElementTitle = function(selector) {
            return selector.find("div.name").text();
        };
        Kal.episodeListNextElement = function(selector, index) {
            if ((index-1) > -1) {
                return Kal.episodeListSelector().eq(index-1);
            }
            return $();
        };
        Kal.handleNextLink = function(truelink, anime){
            if(truelink == null){
                var nextEp = parseInt(anime['.add_anime[num_watched_episodes]'])+1;
                if(nextEp <= parseInt(anime['totalEp'])){
                    return '<a style="color: white;" href="/'+Kal.normalUrl().split('/')[4]+'-episode-'+nextEp+'">Ep '+nextEp+'</a>';
                }
            }
            return truelink;
        };

        Kal.urlEpisodePart = function(url) {
            return url.split("/")[3].split("?")[0].split('episode-')[1];
        };
        Kal.urlAnimeIdent = function(url) {
            if(url.split('/')[3] === 'category'){
                return url.split('/').slice(0,5).join('/');
            }else{
                return url.split('/').slice(0,3).join('/') + '/category/' + url.split("/")[3].split("?")[0].split('-episode')[0];
            }
        };
        Kal.urlAnimeSelector = function(url) {
            return url.split("/")[4].split("?")[0];
        };
        Kal.urlAnimeTitle = function(url) {
            return Kal.urlAnimeSelector(url);
        };

        Kal.EpisodePartToEpisode = function(string) {
            return string;
        };

        Kal.uiPos = function(selector) {
            selector.prependTo($(".anime_info_body").first());
        };
        Kal.uiWrongPos = function(selector) {//TODO
            selector.css('margin-top','5px').appendTo($(".ui.info.list").first());
        };
        Kal.uiHeadPos = function(selector) {//TODO
            selector.appendTo($("h1").first());
        };

        Kal.docReady = function(data) {
            return $( document).ready(data);
        };

        Kal.normalUrl = function(){
            return Kal.urlAnimeIdent(kalUrl);
        };

        Kal.epListReset = function(selector) {
            selector.css("background-color","#363636");
        };
        Kal.epListActive = function(selector) {
            selector.css("background-color","#002966");
        };

        Kal.bookmarkEntrySelector = function() {
        };

        Kal.nextEpLink = function(url) {
            var url = Kal.domain + 's..' + $('.anime_video_body_episodes_r a').last().attr('href');
            return url.replace('/s..','');
        };

        Kal.classicBookmarkButton = function(selector, checkfix) {
        };
        Kal.bookmarkButton = function(selector, check) {
        };

        Kal.BookmarksStyleAfterLoad = function() {
        };
        //###########################
    }else if( kalUrl.indexOf("mangadex.org") > -1 ){
        //#########Masterani.me#########
        Kal.domain = 'https://www.mangadex.org';
        Kal.textColor = 'black';
        Kal.dbSelector = 'Mangadex';
        Kal.listType = 'manga';
        Kal.bookmarkCss = "";
        Kal.bookmarkFixCss = "";
        Kal.videoSelector = '';

        Kal.init = function() {
            Kal.docReady(function(){
                checkdata();
            })
        }

        Kal.imageCache = function(selector) {
            return $('.class').first().find('img').attr('src');
        };

        Kal.isOverviewPage = function() {
            if(kalUrl.split('/')[3] !== 'chapter'){
                return true;
            }else{
                return false;
            }
        };
        Kal.episodeListSelector = function() {
            return $(".edit.tab-content .table-striped tbody > tr");
        };
        Kal.episodeListElementHref = function(selector) {
            return $.absoluteLink(selector.find("a").first().attr('href'));
        };
        Kal.episodeListElementTitle = function(selector) {
            return selector.find("a").first().text().trim();
        };
        Kal.episodeListNextElement = function(selector, index) {
            if ((index+1) > -1) {
                return Kal.episodeListSelector().eq(index+1);
            }
            return $();
        };
        Kal.handleNextLink = function(truelink, anime){//TODO
            $('.menu.pagination').off('click').on( "click", function() {
                handleanime(anime);
            });
            if(truelink == null){
                var nextEp = parseInt(anime['.add_anime[num_watched_episodes]'])+1;
                if(nextEp <= parseInt(anime['totalEp'])){
                    return '<a style="color: white;" href="/anime/watch/'+Kal.normalUrl().replace(/#[^#]*$/, "").replace(/\?[^\?]*$/, "").split("/")[5]+'/'+nextEp+'">Ep. '+nextEp+'</a>';
                }
            }
            return truelink;
        };

        Kal.urlEpisodePart = function(url) {

            if(Kal.isOverviewPage()){
                var relativUrl = url.replace(url.split('/').slice(0,3).join('/'),'');
                var someA = $('a[href*="'+relativUrl+'"]')
                if(someA.length){
                    var chapterNr = someA.attr('data-chapter-num');
                    if(chapterNr){
                        return chapterNr;
                    }
                }
            }else{
                chapterId = url.split('/')[4];
                var curOption = $('#jump_chapter option[value="'+chapterId+'"]');
                if(curOption.length){
                    console.log(curOption.text().trim());
                    return curOption.text().trim();
                }
            }

            return null;
        };
        Kal.urlAnimeIdent = function(url) {
            if(Kal.isOverviewPage()){
                return url.split('/').slice(0,5).join('/');
            }else{
                return $.absoluteLink($('.panel-title a').first().attr('href'));
            }
        };
        Kal.urlAnimeSelector = function(url) {
            return url.split("/")[4].split("?")[0];
        };
        Kal.urlAnimeTitle = function(url) {
            var onMal = $('.list-inline a[href^="https://myanimelist.net/"]');
            if(onMal.length){
                return onMal.attr('href').split('/')[4];
            }
            return $('.panel-title').text().trim();
        };

        Kal.EpisodePartToEpisode = function(string) {
            if(!(isNaN(parseInt(string)))){
                return string;
            }
            var temp = [];
            temp = string.match(/chapter\ \d+/i);
            console.log(temp);
            if(temp !== null){
                string = temp[0];
                temp = string.match(/\d+/);
                if(temp !== null){
                    return temp[0];
                }
            }
            return '';
        };

        Kal.uiPos = function(selector) {
            $("#content .edit.row .table tr").first().after("<tr><th>MyAnimeList:</th><td colspan='5' class='kal-ui'></td></tr>");
            selector.appendTo($("#content .kal-ui").first());
        };
        Kal.uiWrongPos = function(selector) {//TODO
            //selector.css('margin-top','5px').appendTo($(".ui.info.list").first());
        };
        Kal.uiHeadPos = function(selector) {//TODO
            selector.appendTo($("h1").first());
        };

        Kal.docReady = function(data) {
            return $( document).ready(data);
        };

        Kal.normalUrl = function(){
            return Kal.urlAnimeIdent(kalUrl);
        };

        Kal.epListReset = function(selector) {
            selector.parent().parent().css("background-color","initial");
        };
        Kal.epListActive = function(selector) {
            selector.parent().parent().css("background-color","#002966");
        };

        Kal.bookmarkEntrySelector = function() {
            return $(".trAnime");
        };

        Kal.nextEpLink = function(url) {
            return 'https://www.masterani.me'+$('#watch .anime-info .actions a').last().attr('href');
        };

        Kal.classicBookmarkButton = function(selector, checkfix) {
        };
        Kal.bookmarkButton = function(selector, check) {
        };

        Kal.BookmarksStyleAfterLoad = function() {
        };
        //###########################
    }else if( kalUrl.indexOf("myanimelist.net") > -1 ){
        googleover = 1;
        Kal.listType = kalUrl.split('/')[3];
        Kal.isOverviewPage = function() {
            return false;
        };
        Kal.urlAnimeSelector = function(url) {
            return $('.h1 span').first().text();
        };
        Kal.urlAnimeTitle = function(url) {
            return Kal.urlAnimeSelector(url);
        };
        Kal.docReady = function(data) {
            return $( document).ready(data);
        };
    }

    return Kal;
    }

    var K = getDeclaration(window.location.href);

    //#######Anime or Manga######
    if(K.listType == 'anime'){
        var googleMalUrl = "site:myanimelist.net/Anime/+-site:myanimelist.net/Anime/genre/+-site:myanimelist.net/anime/season/+";
        var middleType = 'episodes';
        var middleVerb = 'watched';

        var planTo = 'Plan to Watch';
        var watching = 'Watching'
    }else{
        var googleMalUrl = "site:myanimelist.net/manga/+-site:myanimelist.net/manga/genre/+-site:myanimelist.net/manga/season/+";
        var middleType = 'chapters';
        var middleVerb = 'read';

        var planTo = 'Plan to Read';
        var watching = 'Reading'
    }
    //###########################

    $.absoluteLink = function(url) {
        if (typeof url === "undefined") {
            return url;
        }
        if(!url.startsWith("http")) { url = K.domain + url;}
        return url;
    };
    $.titleToDbKey = function(title) {
        if( window.location.href.indexOf("crunchyroll.com") > -1 ){
            return encodeURIComponent(title.toLowerCase().split('#')[0]).replace(/\./g, '%2E');
        }
        return title.toLowerCase().split('#')[0].replace(/\./g, '%2E');
    };

    //ignore loading
    if(document.title == "Please wait 5 seconds..."){
        con.log("loading");
        return;
    }

    if( window.location.href.indexOf("id="+GM_getValue( 'checkFail', 0 )) > -1 ){
        $(window).load(function(){
            GM_setValue( 'checkFail', 0 )
        });
    }

