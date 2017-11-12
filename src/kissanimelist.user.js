// ==UserScript==
// @name        KissAnimeList
// @version     0.90.2
// @description Integrates MyAnimeList into various sites, with auto episode tracking.
// @author      lolamtisch@gmail.com
// @license 	CC-BY-4.0; https://creativecommons.org/licenses/by/4.0/legalcode
// @license 	MIT
// @supportURL  https://github.com/lolamtisch/KissAnimeList/issues
// @include     http://kissanime.ru/Anime/*
// @include     http://kissanime.to/Anime/*
// @include     http://kissanime.ru/BookmarkList
// @include     http://kissanime.to/BookmarkList
// @exclude     http://kissanime.ru/AnimeList*
//
// @include     http://kissmanga.com/manga/*
// @include     http://kissmanga.com/BookmarkList
// @exclude     http://kissmanga.com/MangaList*
//
// @include     https://myanimelist.net/anime/*
// @include     https://myanimelist.net/manga/*
// @include     https://myanimelist.net/animelist/*
//
// @include     https://www.masterani.me/anime/info/*
// @include     https://www.masterani.me/anime/watch/*
// @include     https://myanimelist.net/anime.php?*id=*
// @include     https://myanimelist.net/manga.php?*id=*
//
// @include     https://9anime.to/watch/*/*
// @include     /https?://9anime.to/watch/*/*/
//
// @include     https://9anime.is/watch/*/*
// @include     /https?://9anime.is/watch/*/*/
//
// @include     https://9anime.ru/watch/*/*
// @include     /https?://9anime.ru/watch/*/*/
//
// @include     http://www.crunchyroll.com/*
// @exclude     http://www.crunchyroll.com/videos*
// @exclude     http://www.crunchyroll.com/news*
// @exclude     http://www.crunchyroll.com/anime*
// @exclude     http://www.crunchyroll.com/forum*
// @exclude     http://www.crunchyroll.com/user*
// @exclude     http://www.crunchyroll.com/login*
// @exclude     http://www.crunchyroll.com/store*
// @exclude     http://www.crunchyroll.com/search*
// @exclude     http://www.crunchyroll.com/home*
// @exclude     http://www.crunchyroll.com/edit*
// @exclude     http://www.crunchyroll.com/acct*
// @exclude     http://www.crunchyroll.com/email*
// @exclude     http://www.crunchyroll.com/inbox*
// @exclude     http://www.crunchyroll.com/newprivate*
// @exclude     http://www.crunchyroll.com/outbox*
// @exclude     http://www.crunchyroll.com/pm*
// @exclude     http://www.crunchyroll.com/notifications*
// @exclude     http://www.crunchyroll.com/comics*
// @exclude     http://www.crunchyroll.com/order*
//
// @include     /https?://.*gogoanime\.tv/.*
// @exclude     /https?://.*gogoanime\.tv/.*\.html.*
// @exclude     /https?://.*gogoanime\.tv/genre/.*
// @exclude     /https?://.*gogoanime\.tv/sub-category/.*
// @include     /https?://.*gogoanime\.io/.*
// @exclude     /https?://.*gogoanime\.io/.*\.html*
// @exclude     /https?://.*gogoanime\.io/genre/.*
// @exclude     /https?://.*gogoanime\.io/sub-category/.*
//
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @resource    materialCSS https://code.getmdl.io/1.3.0/material.indigo-pink.min.css
// @resource    materialFont https://fonts.googleapis.com/icon?family=Material+Icons
// @resource    materialjs https://code.getmdl.io/1.3.0/material.min.js
//
// @connect     www.google.com
// @connect     ipv4.google.com
// @connect     myanimelist.net
// @connect     kissanimelist.firebaseio.com
// @connect     *
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @run-at      document-start
// @namespace https://greasyfork.org/users/92233
// ==/UserScript==

(function() {
    'use strict';
//if (window.top != window.self) {return; }
//TODO: temporary workaround
    var googleover = 0;

    var con = console;
    con = {
        log: function() {},
        error: function() {},
        debug: function() {}
    };

    var element = new Image();
    Object.defineProperty(element, 'id', {
      get: function () {
        con.log = function(){
            var args = Array.prototype.slice.call(arguments);
            args.unshift("color: blue;");
            args.unshift("%c[KAL]");
            console.log.apply(console, args);
        }
      }
    });
    console.log('%cKissAnimeList ['+GM_info.script.version+']', element,);

    var malBookmarks = GM_getValue( 'malBookmarks', 1 );
    var classicBookmarks = GM_getValue( 'classicBookmarks', 0 );
    if(classicBookmarks === 0){
        var BookmarksStyle = 1;
    }

    var tagLinks = GM_getValue( 'tagLinks', 1 );
    var searchLinks = GM_getValue( 'searchLinks', 1 );
    var kissanimeLinks = GM_getValue( 'kissanimeLinks', 1 );
    var kissmangaLinks = GM_getValue( 'kissmangaLinks', 1 );
    var masteraniLinks = GM_getValue( 'masteraniLinks', 1 );
    var nineanimeLinks = GM_getValue( 'nineanimeLinks', 1 );
    var crunchyrollLinks = GM_getValue( 'crunchyrollLinks', 1 );
    var gogoanimeLinks = GM_getValue( 'gogoanimeLinks', 1 );

    var miniMALonMal = GM_getValue( 'miniMALonMal', 0 );
    var posLeft = GM_getValue( 'posLeft', 1 );
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
                        message += 'KissAnimeList (v0.90.2):<br/>    - Add support for 9anime.is and 9anime.ru';
                        break;
                }
            }else{
                message += '<h2>Welcome to <a href="https://greasyfork.org/en/scripts/27564-kissanimelist">KissAnimeList</a></h2><br/>Support:<br/><a href="https://discord.gg/cTH4yaw">Discord Channel</a><br/><a href="https://github.com/lolamtisch/KissAnimeList">GitHub</a> <a href="https://github.com/lolamtisch/KissAnimeList/issues">Issues</a>';
            }
            if(message != '<div style="text-align: left;">'){
                message += '</div><button class="okChangelog" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px;cursor: pointer;">Ok</button>'
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


    if( window.location.href.indexOf("kissanime.ru") > -1 ){
        //#########Kissanime#########
        var domain = 'http://kissanime.ru';
        var textColor = '#d5f406';
        var dbSelector = 'Kissanime';
        var listType = 'anime';
        var bookmarkCss = ".listing tr td:nth-child(1){height: 150px;padding-left: 125px;} .listing tr td{vertical-align: top;}";
        var bookmarkFixCss = ".bigBarContainer {margin: 0px; width: 630px !important; text-align: left; float: left;}";

        $.init = function() {
            checkdata();
        }

        $.fn.imageCache = function() {
            return $('#rightside').find('img').attr('src');
        };

        $.isOverviewPage = function() {
            if(typeof window.location.href.split('/')[5] != 'undefined'){
                if($('#centerDivVideo').length){
                    return false;
                }
            }
            return true;
        };
        $.episodeListSelector = function() {
            return $(".listing a");
        };
        $.fn.episodeListElementHref = function() {
            return $.absoluteLink(this.attr('href'));
        };
        $.fn.episodeListElementTitle = function() {
            return this.text().replace($('.bigChar').text(),'');
        };
        $.fn.episodeListNextElement = function(index) {
            if ((index-1) > -1) {
                return $.episodeListSelector().eq(index-1);
            }
            return $();
        };
        $.handleNextLink = function(truelink, anime){
            return truelink;
        };

        $.urlEpisodePart = function(url) {
            return url.split("/")[5].split("?")[0];
        };
        $.urlAnimeIdent = function(url) {
            return url.split('/').slice(0,5).join('/');
        };
        $.urlAnimeTitle = function(url) {
            return url.split("/")[4].split("?")[0];
        };

        $.EpisodePartToEpisode = function(string) {
            var temp = [];
            temp = string.match(/[e,E][p,P][i,I]?[s,S]?[o,O]?[d,D]?[e,E]?\D?\d{3}/);
            if(temp !== null){
                string = temp[0];
            }
            temp = string.match(/\d{3}/);
            if(temp === null){
                string = 0;
            }else{
                string = temp[0];
            }
            return string;
        };

        $.fn.uiPos = function() {
            this.insertAfter($(".bigChar").first());
        };
        $.fn.uiWrongPos = function() {
            this.insertAfter($(".bigChar").first());
        };
        $.fn.uiHeadPos = function() {
            this.appendTo($(".barTitle").first());
        };

        $.docReady = function(data) {
            return $( document).ready(data);
        };

        $.normalUrl = function(){
            return $.urlAnimeIdent(window.location.href);
        };

        $.fn.epListReset = function() {
            this.parent().parent().css("background-color","initial");
        };
        $.fn.epListActive = function() {
            this.parent().parent().css("background-color","#002966");
        };

        $.bookmarkEntrySelector = function() {
            return $(".trAnime");
        };

        $.nextEpLink = function(url) {
            return url+'/'+$('#selectEpisode option:selected').next().val();
        };

        $.fn.classicBookmarkButton = function(checkClassic) {
            this.before('<div><input type="checkbox" id="classicBookmarks" '+checkClassic+' > Classic styling</div><div class="clear2">&nbsp;</div>');
        };
        $.fn.bookmarkButton = function(check) {
            this.before('<div><input type="checkbox" id="malBookmarks" '+check+' > MyAnimeList Bookmarks</div><div class="clear2">&nbsp;</div>');
        };

        $.BookmarksStyleAfterLoad = function() {
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
    }else if( window.location.href.indexOf("kissmanga.com") > -1 ){
        //#########Kissmanga#########
        var domain = 'http://kissmanga.com';
        var textColor = '#72cefe';
        var dbSelector = 'Kissmanga';
        var listType = 'manga';
        var bookmarkCss = ".listing tr td:nth-child(1){height: 150px;padding-left: 125px;} .listing tr td{vertical-align: top;}";
        if(classicBookmarks == 0){
            bookmarkCss += '#leftside{width: 581px !important;} #rightside{ float: left !important; margin-left: 30px;}';
        }
        var bookmarkFixCss = "";
        BookmarksStyle = "";

        $.init = function() {
            checkdata();
        }

        $.fn.imageCache = function() {
            return $('#rightside').find('img').attr('src');
        };

        $.isOverviewPage = function() {
            if($("#malp").width() !== null){
                return true;
            }else{
                return false;
            }
        };
        $.episodeListSelector = function() {
            return $(".listing a");
        };
        $.fn.episodeListElementHref = function() {
            return $.absoluteLink(this.attr('href'));
        };
        $.fn.episodeListElementTitle = function() {
            return this.text().replace($('.bigChar').text(),'');
        };
        $.fn.episodeListNextElement = function( index ) {
            if ((index-1) > -1) {
                return $.episodeListSelector().eq(index-1);
            }
            return $();
        };
        $.handleNextLink = function(truelink, anime){
            return truelink;
        };

        $.urlEpisodePart = function(url) {
            return url.split("/")[5].split("?")[0];
        };
        $.urlAnimeIdent = function(url) {
            return url.split('/').slice(0,5).join('/');
        };
        $.urlAnimeTitle = function(url) {
            return url.split("/")[4].split("?")[0];
        };

        $.EpisodePartToEpisode = function(string) {
            var temp = [];
            try{
                string = string.replace($('.bigChar').attr('href').split('/')[2],'');
            }catch(e){string = string.replace(window.location.href.split("/")[4],'');}
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

        $.fn.uiPos = function() {
            this.insertAfter($(".bigChar").first());
        };
        $.fn.uiWrongPos = function() {
            this.insertAfter($(".bigChar").first());
        };
        $.fn.uiHeadPos = function() {
            this.appendTo($(".barTitle").first());
        };

        $.docReady = function(data) {
            return $( document).ready(data);
        };

        $.normalUrl = function(){
            return $.urlAnimeIdent(window.location.href);
        };

        $.fn.epListReset = function() {
            this.parent().parent().css("background-color","initial");
        };
        $.fn.epListActive = function() {
            this.parent().parent().css("background-color","#002966");
        };

        $.bookmarkEntrySelector = function() {
            return $(".listing tr:not(.head)");
        };

        $.fn.classicBookmarkButton = function(checkClassic) {
            $("#rightside .barContent div").last().after('<div><input type="checkbox" id="classicBookmarks" '+checkClassic+' > Classic styling</div><div class="clear2">&nbsp;</div>');
        };
        $.fn.bookmarkButton = function(check) {
            $("#rightside .barContent div").last().after('<div class="clear2" style="border-bottom: 1px solid #DDD2A4;">&nbsp;</div><div class="clear2">&nbsp;</div><div><input type="checkbox" id="malBookmarks" '+check+' > MyAnimeList Bookmarks</div>');
        };

        $.BookmarksStyleAfterLoad = function() {
            $(".head").html('<th id="cssTableSet" style="min-width:120px;padding-right: 5px;"></th><th></th>');//<th width="21%" style=""></th>');
            $( ".listing tr td:nth-child(1)" ).before("<td class='Timage' style='padding-left: 0;'></td>");
            $( ".listing tr td:nth-child(1)" ).css("height","150px");
            $("#rightside .barContent div").last().after('<div class="clear2">&nbsp;</div><div><button type="button" id="clearCache">Clear Cache</button></div>');
            $("#clearCache").click( function(){
                clearCache();
            });
        };
        //###########################
    }else if( window.location.href.indexOf("masterani.me") > -1 ){
        //#########Masterani.me#########
        var domain = 'https://www.masterani.me';
        var textColor = 'white';
        var dbSelector = 'Masterani';
        var listType = 'anime';
        var bookmarkCss = "";
        var bookmarkFixCss = "";
        var winLoad = 0;

        $.init = function() {
            checkdata();
        }

        $.fn.imageCache = function() {
            return $('.class').first().find('img').attr('src');
        };

        $.isOverviewPage = function() {
            if($.normalUrl().split('/')[4] !== 'watch'){
                return true;
            }else{
                return false;
            }
        };
        $.episodeListSelector = function() {
            return $(".thumbnail a.title");
        };
        $.fn.episodeListElementHref = function() {
            return $.absoluteLink(this.attr('href'));
        };
        $.fn.episodeListElementTitle = function() {
            return this.find("div").text()+' ('+this.find("span").text()+')';
        };
        $.fn.episodeListNextElement = function( index ) {
            if ((index+1) > -1) {
                return $.episodeListSelector().eq(index+1);
            }
            return $();
        };
        $.handleNextLink = function(truelink, anime){
            $('.menu.pagination').off('click').on( "click", function() {
                handleanime(anime);
            });
            if(truelink == null){
                var nextEp = parseInt(anime['.add_anime[num_watched_episodes]'])+1;
                if(nextEp <= parseInt(anime['totalEp'])){
                    return '<a style="color: white;" href="/anime/watch/'+$.normalUrl().replace(/#[^#]*$/, "").replace(/\?[^\?]*$/, "").split("/")[5]+'/'+nextEp+'">Ep. '+nextEp+'</a>';
                }
            }
            return truelink;
        };

        $.urlEpisodePart = function(url) {
            return url.split("/")[6].split("?")[0];
        };
        $.urlAnimeIdent = function(url) {
            return url.split('/').slice(0,6).join('/');
        };
        $.urlAnimeTitle = function(url) {
            return url.split("/")[5].split("?")[0];
        };

        $.EpisodePartToEpisode = function(string) {
            return string;
        };

        $.fn.uiPos = function() {
            this.prependTo($("#stats").first());
        };
        $.fn.uiWrongPos = function() {
            this.css('margin-top','5px').appendTo($(".ui.info.list").first());
        };
        $.fn.uiHeadPos = function() {
            this.appendTo($("h1").first());
        };

        $(window).load(function(){
            winLoad = 1;
        });
        if(window.location.href.indexOf("/info/") > -1){
            $.docReady = function(data) {
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
            $.docReady = function(data) {
                return $( document).ready(data);
            }
        };

        $.normalUrl = function(){
            return $.urlAnimeIdent(window.location.href);
        };

        $.fn.epListReset = function() {
            this.parent().parent().css("background-color","initial");
        };
        $.fn.epListActive = function() {
            this.parent().parent().css("background-color","#002966");
        };

        $.bookmarkEntrySelector = function() {
            return $(".trAnime");
        };

        $.nextEpLink = function(url) {
            return 'https://www.masterani.me'+$('#watch .anime-info .actions a').last().attr('href');
        };

        $.fn.classicBookmarkButton = function(checkfix) {
        };
        $.fn.bookmarkButton = function(check) {
        };

        $.BookmarksStyleAfterLoad = function() {
        };
        //###########################
    }else if( window.location.href.indexOf("9anime.") > -1 ){
        //#########9anime#########
        var domain = 'https://'+window.location.hostname;
        var textColor = 'white';
        var dbSelector = '9anime';
        var listType = 'anime';
        var bookmarkCss = "";
        var bookmarkFixCss = "";
        var winLoad = 0;

        $.init = function() {
            checkdata();
        }

        $.fn.imageCache = function() {
            return $('.class').first().find('img').attr('src');
        };

        $.isOverviewPage = function() {
            if($.normalUrl().split('/')[4] !== 'watch'){
                return true;
            }else{
                return false;
            }
        };
        $.episodeListSelector = function() {
            return $("#servers .episodes a");
        };
        $.fn.episodeListElementHref = function() {
            return $.absoluteLink(this.attr('href'))+'?ep='+this.attr('data-base');
        };
        $.fn.episodeListElementTitle = function() {
            if(this.text() == ''){
                return '';
            }
            return 'Episode '+this.text();
        };
        $.fn.episodeListNextElement = function( index ) {
            if ((index+1) > -1) {
                return $.episodeListSelector().eq(index+1);
            }
            return $();
        };
        $.handleNextLink = function(truelink, anime){
            return truelink;
        };

        $.urlEpisodePart = function(url) {
            return url.split('?ep=')[1];
        };
        $.urlAnimeIdent = function(url) {
            return url.split('/').slice(0,5).join('/');
        };
        $.urlAnimeTitle = function(url) {
            return url.split("/")[4].split('?')[0];
        };

        $.EpisodePartToEpisode = function(string) {
            return string;
        };

        $.fn.uiPos = function() {
            this.prependTo($("#info").first());
        };
        $.fn.uiWrongPos = function() {
            this.css('font-size','14px').insertBefore($("#info").first());
            $('.title').first().css('display', 'inline-block');
        };
        $.fn.uiHeadPos = function() {
            this.css('margin','18px 0 9px 0').css('font-weight','400').css('font-size','1.68rem').css('text-transform','uppercase').insertBefore($("#info").first());
            $('.title').first().css('display', 'inline-block');
        };

        $(window).load(function(){
            winLoad = 1;
        });
        if(window.location.href.indexOf("/info/") > -1){
            $.docReady = function(data) {
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
            $.docReady = function(data) {
                return $( document).ready(data);
            }
        };

        $.normalUrl = function(){
            return $.urlAnimeIdent(window.location.href);
        };

        $.fn.epListReset = function() {
            this.css("border-style","none");
        };
        $.fn.epListActive = function() {
            this.css("border-color","#002966").css("border-width","2px").css("border-style","solid");
        };

        $.bookmarkEntrySelector = function() {
            return $(".trAnime");
        };

        $.nextEpLink = function(url) {
            return domain+$("#servers .episodes a.active").parent('li').next().find('a').attr('href');
        };

        $.fn.classicBookmarkButton = function(checkfix) {
        };
        $.fn.bookmarkButton = function(check) {
        };

        $.BookmarksStyleAfterLoad = function() {
        };

        var address = "";
        document.addEventListener("load", event =>{
            if(window.location.href !== address){
                address =  window.location.href;
                if($('#servers').height() == null){
                    address = "";
                    return;
                }
                var curEpisode = $("#servers .episodes a.active").attr('data-base');
                if(curEpisode != ''){
                    var animechange = {};
                    animechange['.add_anime[num_watched_episodes]'] = parseInt(curEpisode);
                    animechange['checkIncrease'] = 1;
                    animechange['forceUpdate'] = 1;
                    setanime( $.normalUrl(),animechange);
                }
            }
        }, true);
        //###########################
    }else if( window.location.href.indexOf("crunchyroll.com") > -1 ){
        //TODO:
        //http://www.crunchyroll.com/ace-of-the-diamond
        //http://www.crunchyroll.com/trinity-seven
        //#########Crunchyroll#########
        if(window.location.href == 'http://www.crunchyroll.com/'){
            return;
        }
        var domain = 'http://www.crunchyroll.com';
        var textColor = 'black';
        var dbSelector = 'Crunchyroll';
        var listType = 'anime';
        var bookmarkCss = "";
        var bookmarkFixCss = "";
        GM_addStyle('.headui a {color: black !important;} #malp{margin-bottom: 8px;}');

        $.init = function() {
            $( document).ready(function(){
                if( $('.season-dropdown').length > 1){
                    $('.season-dropdown').append('<span class="exclusivMal" style="float: right; margin-right: 20px; color: #0A6DA4;" onclick="return false;">MAL</span>');
                    $('.exclusivMal').click(function(){
                        $('#showview_content').before('<div><a href="'+window.location.href.split('?')[0]+'">Show hidden seasons</a></div>');
                        var thisparent =  $(this).parent();
                        $('.season-dropdown').not(thisparent).siblings().remove();
                        $('.season-dropdown').not(thisparent).remove();
                        $('.portrait-grid').css('display','block').find("li.group-item img.landscape").each(function() {
                            void 0 === $(this).attr("src") && $(this).attr("src", $(this).attr("data-thumbnailUrl"))
                        }),
                        $('.exclusivMal').remove();
                        checkdata();
                    });
                    var season = new RegExp('[\?&]' + 'season' + '=([^&#]*)').exec(window.location.href);
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

        $.fn.imageCache = function() {
            return $('#rightside').find('img').attr('src');
        };

        $.isOverviewPage = function() {
            if(typeof window.location.href.split('/')[4] != 'undefined'){
                if($('#showmedia_video').length){
                    return false;
                }
            }
            return true;
        };
        $.episodeListSelector = function() {
            return $("#showview_content_videos .list-of-seasons .group-item a");
        };
        $.fn.episodeListElementHref = function() {
            return $.absoluteLink(this.attr('href'));
        };
        $.fn.episodeListElementTitle = function() {
            return this.find('.series-title').text();
        };
        $.fn.episodeListNextElement = function(index) {//TODO
            if ((index-1) > -1) {
                return $.episodeListSelector().eq(index-1);
            }
            return $();
        };
        $.handleNextLink = function(truelink, anime){
            return truelink;
        };

        $.urlEpisodePart = function(url) {
            return url.split("/")[4];
        };
        $.urlAnimeIdent = function(url) {
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
        $.urlAnimeTitle = function(url) {
            if($.isOverviewPage()){
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

        $.EpisodePartToEpisode = function(string) {
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

        $.fn.uiPos = function() {//TODO
            if($.isOverviewPage()){
                //this.insertAfter($("h1.ellipsis"));
                this.insertBefore($("#tabs").first());
                $('#malStatus option').css('background-color','#f2f2f2');
                $('#malUserRating option').css('background-color','#f2f2f2');
                //this.prependTo($('.season-dropdown'));
            }
        };
        $.fn.uiWrongPos = function() {//TODO after second element
            //this.prependTo($("#sidebar_elements").first());
        };
        $.fn.uiHeadPos = function() {//TODO
            this.appendTo($(".ellipsis").first());
        };

        $.docReady = function(data) {
            return $( document).ready(data);
        };

        $.normalUrl = function(){
            return $.urlAnimeIdent(window.location.href);
        };

        $.fn.epListReset = function() {
            this.css("background-color","#fff");
        };
        $.fn.epListActive = function() {
            this.css("background-color","#b2d1ff");
        };

        $.bookmarkEntrySelector = function() {
            //return $(".trAnime");
        };

        $.nextEpLink = function(url) {
            return 'http://www.crunchyroll.com'+$('.collection-carousel-media-link-current').parent().next().find('.link').attr('href');
        };

        $.fn.classicBookmarkButton = function(checkClassic) {

        };
        $.fn.bookmarkButton = function(check) {

        };

        $.BookmarksStyleAfterLoad = function() {

        };
        //###########################
    }else if( window.location.href.indexOf("gogoanime.") > -1 ){
        //#########Gogoanime.tv#########
        if(!window.location.href.split('/')[3]){
            return;
        }
        var domain = window.location.href.split('/').slice(0,3).join('/')+'/';
        var textColor = 'white';
        var dbSelector = 'Gogoanime';
        var listType = 'anime';
        var bookmarkCss = "";
        var bookmarkFixCss = "";
        var winLoad = 0;
        GM_addStyle('.headui a {color: inherit !important;}');

        $.init = function() {
            checkdata();
        }

        $.fn.imageCache = function() {
            return $('.class').first().find('img').attr('src');
        };

        $.isOverviewPage = function() {
            if(window.location.href.split('/')[3] === 'category'){
                return true;
            }else{
                return false;
            }
        };
        $.episodeListSelector = function() {
            return $("#episode_related a");
        };
        $.fn.episodeListElementHref = function() {
            return domain+this.attr('href').replace(' /','');
        };
        $.fn.episodeListElementTitle = function() {
            return this.find("div.name").text();
        };
        $.fn.episodeListNextElement = function( index ) {
            if ((index-1) > -1) {
                return $.episodeListSelector().eq(index-1);
            }
            return $();
        };
        $.handleNextLink = function(truelink, anime){
            if(truelink == null){
                var nextEp = parseInt(anime['.add_anime[num_watched_episodes]'])+1;
                if(nextEp <= parseInt(anime['totalEp'])){
                    return '<a style="color: white;" href="/'+$.normalUrl().split('/')[4]+'-episode-'+nextEp+'">Ep '+nextEp+'</a>';
                }
            }
            return truelink;
        };

        $.urlEpisodePart = function(url) {
            return url.split("/")[3].split("?")[0].split('episode-')[1];
        };
        $.urlAnimeIdent = function(url) {
            if(url.split('/')[3] === 'category'){
                return url.split('/').slice(0,5).join('/');
            }else{
                return url.split('/').slice(0,3).join('/') + '/category/' + url.split("/")[3].split("?")[0].split('-episode')[0];
            }
        };
        $.urlAnimeTitle = function(url) {
            return url.split("/")[4].split("?")[0];
        };

        $.EpisodePartToEpisode = function(string) {
            return string;
        };

        $.fn.uiPos = function() {
            this.prependTo($(".anime_info_body").first());
        };
        $.fn.uiWrongPos = function() {//TODO
            this.css('margin-top','5px').appendTo($(".ui.info.list").first());
        };
        $.fn.uiHeadPos = function() {//TODO
            this.appendTo($("h1").first());
        };

        $.docReady = function(data) {
            return $( document).ready(data);
        };

        $.normalUrl = function(){
            return $.urlAnimeIdent(window.location.href);
        };

        $.fn.epListReset = function() {
            this.css("background-color","#363636");
        };
        $.fn.epListActive = function() {
            this.css("background-color","#002966");
        };

        $.bookmarkEntrySelector = function() {
        };

        $.nextEpLink = function(url) {
            var url = domain + 's..' + $('.anime_video_body_episodes_r a').last().attr('href');
            return url.replace('/s..','');
        };

        $.fn.classicBookmarkButton = function(checkfix) {
        };
        $.fn.bookmarkButton = function(check) {
        };

        $.BookmarksStyleAfterLoad = function() {
        };
        //###########################
    }
    //#######Anime or Manga######
    if(listType == 'anime'){
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
        if(!url.startsWith("http")) { url = domain + url;}
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

    function handleanime(anime){
        $('.MalLogin').css("display","initial");
        $('#AddMalDiv').remove();

        miniMalButton(anime['malurl']);

        if(GM_getValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.urlAnimeIdent($.normalUrl())))+'/image' , null) == null ){
            try{
                GM_setValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.urlAnimeIdent($.normalUrl())))+'/image', $().imageCache() );
            }catch(e){}
        }
        if(anime['login'] === 0){
            $('.MalLogin').css("display","none");
            $("#MalData").css("display","flex");
            $("#MalInfo").text("");
            $("#malRating").attr("href", anime['malurl']);
            $("#malRating").after("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please log in on <a target='_blank' href='https://myanimelist.net/login.php'>MyAnimeList!<a>");
            getcommondata(anime['malurl']);
            return;
        }
        if($.isOverviewPage()){
            $("#flash").attr("anime", anime['.'+listType+'_id']);
            $("#malRating").attr("href", anime['malurl']);
            if(isNaN(anime['.add_'+listType+'[status]'])){
                $('.MalLogin').css("display","none");
                $("#malRating").after("<span id='AddMalDiv'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' id='AddMal' onclick='return false;'>Add to Mal</a></span>")
                $('#AddMal').click(function() {
                    var anime = {};
                    anime['.add_'+listType+'[status]'] = 6;
                    anime['forceUpdate'] = 1;
                    setanime($.normalUrl(),anime);
                });
            }else{
                $("#malTotal").text(anime['totalEp']);
                if(anime['totalEp'] == 0){
                   $("#malTotal").text('?');
                }
                if(anime['forceUpdate'] != 2){
                    $("#malStatus").val(anime['.add_'+listType+'[status]']);
                    $("#malEpisodes").val(anime['.add_anime[num_watched_episodes]']);
                    $("#malUserRating").val(anime['.add_'+listType+'[score]']);

                    //####Manga####
                    $("#malVolumes").val(anime['.add_manga[num_read_volumes]']);
                    $("#malChapters").val(anime['.add_manga[num_read_chapters]']);
                }
                $("#malTotalVol").text(anime['totalVol']);
                if(anime['totalVol'] == 0){
                   $("#malTotalVol").text('?');
                }
                $("#malTotalCha").text(anime['totalChap']);
                if(anime['totalChap'] == 0){
                   $("#malTotalCha").text('?');
                }
                //#############
            }
            $("#MalData").css("display","flex");
            $("#MalInfo").text("");

            getcommondata(anime['malurl']);

            var episodelink;
            var linkbackup = null;
            var truelink = null;
            $('.lastOpen').remove();
            $.episodeListSelector().each(function( index ) {
                if(listType == 'anime'){
                    if(con == console){
                        $(this).after('  Episode: '+urlToEpisode($(this).episodeListElementHref()));
                    }
                    try{
                        episodelink = urlToEpisode($(this).episodeListElementHref());
                    }catch(e) {
                        episodelink = 1;
                    }
                    $(this).epListReset();
                    if(episodelink == parseInt(anime['.add_anime[num_watched_episodes]'])){
                        $(this).epListActive();
                        if(typeof $(this).episodeListNextElement( index ).episodeListElementHref() !== "undefined"){
                            truelink = '<a style="color: white;" href="'+$(this).episodeListNextElement( index ).episodeListElementHref()+'">'+$(this).episodeListNextElement( index ).episodeListElementTitle()+'</a>';
                        }
                    }
                }else{
                    if(con == console){
                        $(this).after('   Chapter: '+urlToChapter($(this).episodeListElementHref()));
                        $(this).after('Volume: '+urlToVolume($(this).episodeListElementHref()));
                    }
                    episodelink = urlToChapter($(this).episodeListElementHref());
                    $(this).epListReset();
                    if($(this).attr('href') == commentToUrl(anime['.add_manga[comments]'])){
                        $(this).parent().parent().css("background-color","#861515");
                        linkbackup = '<a style="color: red;" href="'+$(this).episodeListNextElement( index ).episodeListElementHref()+'">'+$(this).episodeListNextElement( index ).episodeListElementTitle()+'</a>';
                        $(this).prepend('<span class="lastOpen">[Last opened]</span>');
                    }
                    if(episodelink == parseInt(anime['.add_manga[num_read_chapters]']) && parseInt(anime['.add_manga[num_read_chapters]']) != 0){
                        $(this).parent().parent().css("background-color","#002966");
                        truelink = '<a style="color: white;" href="'+$(this).episodeListNextElement( index ).episodeListElementHref()+'">'+$(this).episodeListNextElement( index ).episodeListElementTitle()+'</a>';
                    }
                }
            });
            truelink = $.handleNextLink(truelink, anime);
            if(listType == 'anime'){
                $(".headui").html(truelink);
            }else{
                if(truelink == null){
                    if(linkbackup != null){
                        $(".headui").html(linkbackup);
                    }
                }else{
                    $(".headui").html(truelink);
                }
            }
        }else{
            if(listType == 'anime'){
                //update
                try{
                    var curEpisode = urlToEpisode(window.location.href);
                }catch(e) {
                    var curEpisode = 1;
                }
                //if(curEpisode > anime['.add_anime[num_watched_episodes]']){
                var animechange = {};
                animechange['.add_anime[num_watched_episodes]'] = curEpisode;
            }else{
                //update
                var curChapter = urlToChapter(window.location.href);
                var curVolume = urlToVolume(window.location.href);
                //if(curChapter > anime['.add_manga[num_read_volumes]']){
                var animechange = {};
                animechange['.add_manga[num_read_chapters]'] = curChapter;
                animechange['.add_manga[num_read_volumes]'] = curVolume;
                animechange['.add_manga[comments]'] = handleComment(window.location.href, anime['.add_manga[comments]']);
            }
            animechange['checkIncrease'] = 1;
            setTimeout(function() {
                setanime( $.normalUrl(),animechange);
            }, delay * 1000);
        }
    }

    function urlToEpisode(url){
        var string = $.urlEpisodePart(url);
        string = $.EpisodePartToEpisode(string);
        var Offset = GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.urlAnimeIdent(url)))+'/Offset' , null);
        if( Offset != null){
            string = parseInt(string)+parseInt(Offset);
        }
        return parseInt(string);
    }

    function urlToChapter(url){
        return urlToEpisode(url);
    }

    function urlToVolume(string){
        try{
            string = string.match(/[V,v][o,O][l,L]\D?\d{3}/)[0];
            string = string.match(/\d+/)[0].slice(-3);
        }catch(e){
            string = 1;
        }
        return parseInt(string);
    }

    function commentToUrl(comment){
        if(comment.indexOf("last:^") > -1){
            try{
                comment = comment.split("last:^")[1].split("^")[0];
                comment = comment.split("http://kissmanga.com")[1];
                comment = comment.split("#")[0];
            }catch(e){}
        }
        return comment;
    }

    function handleComment(update, current){
        var addition = 'last:^'+update+'^';
        if(current.indexOf("last:^") > -1){
            current = current.replace(/last:\^[^\^]*\^/,addition);
        }else{
            current = current+addition;
        }
        return current;
    }

    function handleTag(update, current, nextEp){
        if(tagLinks == 0){return current;}
        var addition = "last::"+ btoa(update) +"::";
        if(current.indexOf("last::") > -1){
            current = current.replace(/last::[^\^]*\:\:/,addition);
        }else{
            current = current+','+addition;
        }

        if(update.indexOf("masterani.me") > -1 && update.indexOf("/watch/") > -1){
            update = update.replace('/watch/','/info/');
        }
        GM_setValue( update+'/next', nextEp);
        GM_setValue( update+'/nextEp', $.nextEpLink(update));
        return current;
    }

    function handleanimeupdate( anime, current){
        if(anime['checkIncrease'] === 1 && autoTracking === 0){
            episodeInfo(anime['.add_anime[num_watched_episodes]'], current['malurl']);
            delete anime[".add_anime[num_watched_episodes]"];
            delete anime[".add_anime[score]"];
            delete anime[".add_anime[status]"];
            delete anime[".add_manga[num_read_chapters]"];
            delete anime[".add_manga[num_read_volumes]"];
            delete anime[".add_manga[score]"];
            delete anime[".add_manga[status]"];
            anime['no_flash'] = 1;
            anime['.add_anime[tags]'] = handleTag($.urlAnimeIdent(window.location.href), current['.add_anime[tags]'], anime['.add_anime[num_watched_episodes]']+1);
            return anime;
        }
        if(listType == 'anime'){
            if(anime['checkIncrease'] === 1){
                anime['.add_anime[tags]'] = handleTag($.urlAnimeIdent(window.location.href), current['.add_anime[tags]'], anime['.add_anime[num_watched_episodes]']+1);
                if(current['.add_anime[num_watched_episodes]'] >= anime['.add_anime[num_watched_episodes]']){
                    if((anime['.add_anime[status]'] === 2 || current['.add_anime[status]'] === 2) && anime['.add_anime[num_watched_episodes]'] === 1){
                        if (confirm('Rewatch anime?')) {
                            anime['.add_anime[is_rewatching]'] = 1;
                        }else{
                            return null;
                        }
                    }else{
                        return null;
                    }
                }
            }
            if(current['.add_anime[status]'] !== 2 && parseInt(anime['.add_anime[num_watched_episodes]']) === current['totalEp'] && parseInt(anime['.add_anime[num_watched_episodes]']) != 0 ){
                if (confirm('Set as completed?')) {
                    anime['.add_anime[status]'] = 2;
                    if(current['.add_anime[finish_date][day]'] === ''){
                        var Datec = new Date();
                        anime['.add_anime[finish_date][year]'] = Datec.getFullYear();
                        anime['.add_anime[finish_date][month]'] = Datec.getMonth()+1;
                        anime['.add_anime[finish_date][day]'] = Datec.getDate();
                    }
                }
            }
            if(anime['checkIncrease'] === 1){
                if(current['.add_anime[status]'] === 2 && anime['.add_anime[num_watched_episodes]'] === current['totalEp'] && current['.add_anime[is_rewatching]'] === 1){
                    if (confirm('Finish rewatching?')) {
                        anime['.add_anime[is_rewatching]'] = 0;
                        if(current['.add_anime[num_watched_times]'] === ''){
                            anime ['.add_anime[num_watched_times]'] = 1;
                        }else{
                            anime ['.add_anime[num_watched_times]'] = parseInt(current['.add_anime[num_watched_times]'])+1;
                        }
                    }
                }
                if(current['.add_anime[status]'] !== 1 && current['.add_anime[status]'] !== 2 && anime['.add_anime[status]'] !== 2){
                    if (confirm('Start watching?')) {
                        anime['.add_anime[status]'] = 1;
                    }else{
                        return null;
                    }
                }
                if(current['.add_anime[start_date][day]'] === ''){
                    var Datec = new Date();
                    anime['.add_anime[start_date][year]'] = Datec.getFullYear();
                    anime['.add_anime[start_date][month]'] = Datec.getMonth()+1;
                    anime['.add_anime[start_date][day]'] = Datec.getDate();
                }
            }
            if(current['.add_anime[status]'] !== 2 && anime['.add_anime[status]'] == 2 && parseInt(anime['.add_anime[num_watched_episodes]']) !== current['totalEp']){
                anime['.add_anime[num_watched_episodes]'] = current['totalEp'];
            }
            return anime;
        }else{
            if(anime['checkIncrease'] === 1){
                current['checkIncrease'] = 1;
                if(current['.add_manga[num_read_chapters]'] >= anime['.add_manga[num_read_chapters]']){
                    if((anime['.add_manga[status]'] === 2 || current['.add_manga[status]'] === 2) && anime['.add_manga[num_read_chapters]'] === 1){
                        if (confirm('Reread Manga?')) {
                            anime['.add_manga[is_rereading]'] = 1;
                        }else{
                            current['.add_manga[comments]'] = anime['.add_manga[comments]'];
                            current['no_flash'] = 1;
                            anime = current;
                        }
                    }else{
                        current['.add_manga[comments]'] = anime['.add_manga[comments]'];
                        current['no_flash'] = 1;
                        anime = current;
                    }
                }
            }
            if(current['.add_manga[status]'] !== 2 && parseInt(anime['.add_manga[num_read_chapters]']) === current['totalChap'] && parseInt(anime['.add_manga[num_read_chapters]']) != 0){
                if (confirm('Set as completed?')) {
                    anime['.add_manga[status]'] = 2;
                    if(current['.add_manga[finish_date][day]'] === ''){
                        var Datec = new Date();
                        anime['.add_manga[finish_date][year]'] = Datec.getFullYear();
                        anime['.add_manga[finish_date][month]'] = Datec.getMonth()+1;
                        anime['.add_manga[finish_date][day]'] = Datec.getDate();
                    }
                }
            }
            if(anime['checkIncrease'] === 1){
                if(current['.add_manga[status]'] === 2 && anime['.add_manga[num_read_chapters]'] === current['totalChap'] && current['.add_manga[is_rereading]'] === 1){
                    if (confirm('Finish rereading?')) {
                        anime['.add_manga[is_rereading]'] = 0;
                        if(current['.add_manga[num_read_times]'] === ''){
                            anime ['.add_manga[num_read_times]'] = 1;
                        }else{
                            anime ['.add_manga[num_read_times]'] = parseInt(current['.add_manga[num_read_times]'])+1;
                        }
                    }
                }
                if(current['.add_manga[status]'] !== 1 && current['.add_manga[status]'] !== 2 && anime['.add_manga[status]'] !== 2){
                    if (confirm('Start reading?')) {
                        anime['.add_manga[status]'] = 1;
                    }else{
                        return null;
                    }
                }
                if(current['.add_manga[start_date][day]'] === ''){
                    var Datec = new Date();
                    anime['.add_manga[start_date][year]'] = Datec.getFullYear();
                    anime['.add_manga[start_date][month]'] = Datec.getMonth()+1;
                    anime['.add_manga[start_date][day]'] = Datec.getDate();
                }
            }
            if(current['.add_manga[status]'] !== 2 && anime['.add_manga[status]'] == 2 && parseInt(anime['.add_manga[num_read_chapters]']) !== current['totalChap']){
                anime['.add_manga[num_read_chapters]'] = current['totalChap'];
                anime['.add_manga[num_read_volumes]'] = current['totalVol'];
            }
            return anime;
        }
    }

    function getcommondata(url){
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: false,
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            onload: function(response) {
                var data = response.responseText;
                currentMalData = data;
                var rating = data.split('class="dark_text">Score')[1].split('<span')[1].split('>')[1].split('<')[0];
                $("#malRating").attr("href", url).text(rating);
                try{//TODO: Play button and optional lightbox
                    var video = data.split('class="video-promotion">')[1].split('href="')[1].split('"')[0];
                    con.log("video", video);
                    $("#rightside .rightBox .barContent img").wrap("<a target='_blank' href='"+video+"'></a>");
                }catch(e){
                    con.log('video', 'NoN');
                }

                if($('#info-popup').css('display') == 'block' && $("#info-iframe").contents().find('#backbutton').css('display') == 'none'){
                    fillIframe(url, currentMalData);
                }
            }
        });
    }
    function getanime(thisUrl , callback, absolute = false, localListType = listType) {
        var thisUrl = thisUrl;
        var url = '';
        var malurl = '';
        var title = $.urlAnimeTitle(thisUrl);
        if(absolute === false){
            //url = "http://myanimelist.net/anime.php?q=" + encodeURI(formattitle(title));
            //url = "http://www.google.com/search?btnI&q=site:myanimelist.net/Anime/+-site:myanimelist.net/Anime/genre/+-site:myanimelist.net/anime/season/+"+encodeURI(formattitle(title));
            url = 'https://kissanimelist.firebaseio.com/Data/'+dbSelector+'/'+encodeURIComponent($.titleToDbKey($.urlAnimeTitle(thisUrl))).toLowerCase()+'/Mal.json';
            if(GM_getValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(thisUrl))+'/Mal' , null) !== null ){
                //if(con != console){
                    url = GM_getValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(thisUrl))+'/Mal' , null);
                //}
                con.log('[GET] Cache:', url);
            }

        }else{
            url = absolute;
        }

        if(url == '' || url == null){
            loadingText = "No Mal Entry!";
            $("#MalInfo").text("No Mal Entry!");
            return;
        }

        if(url.indexOf("myanimelist.net/"+localListType+"/") > -1 && url.indexOf("google") === -1) {
            con.log("[GET] MyAnimeList: ", url);
            if(googleover === 0){
                local_setValue( thisUrl, url );
            }
            malurl = url;
            url = 'https://myanimelist.net/ownlist/'+localListType+'/'+url.split('/')[4]+'/edit?hideLayout';//TODOsplit4 ersetzten
        }
        con.log("[GET] Request:",url);

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: false,
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            onload: function(response) {
                if(response.finalUrl != null){
                    url = response.finalUrl;
                }
                url = firefoxUrl(url, response.responseText);
                if(url.split("/").length > 6 && url.indexOf("myanimelist.net/"+localListType) > -1 && url.indexOf("google") === -1){
                    var partes = url.split("/");
                    url = partes[0]+"/"+partes[1]+"/"+partes[2]+"/"+partes[3]+"/"+partes[4]+"/"+partes[5];
                    getanime(thisUrl, callback, url);
                    return;
                }

                if(url.indexOf("kissanimelist.firebaseio.com") > -1) {
                    con.log("[GET] Firebase:",response.response);
                    if(response.response !== 'null' && !(response.response.indexOf("error") > -1)){
                        //url = response.response.replace('"', '').replace('"', '');
                        url = 'https://myanimelist.net/'+localListType+'/'+response.response.split('"')[1]+'/'+response.response.split('"')[3];
                        if(response.response.split('"')[1] == 'Not-Found'){
                            $("#MalInfo").text("Not Found!");
                            miniMalButton(null);
                            return;
                        }
                    }else{
                        url = "http://www.google.com/search?btnI&q="+googleMalUrl+encodeURI(formattitle(title));
                    }
                    getanime(thisUrl, callback, url);
                    return;
                }

                if(url.indexOf("ipv4.google.com") > -1) {
                    googleover = 1;
                    $.docReady(function() {
                        flashm( "Google Overloaded <br> <a target='_blank' href='"+url+"'>Solve captcha<a>" , true);
                        url = "http://myanimelist.net/"+localListType+".php?q=" + encodeURI(formattitle(title));
                        getanime(thisUrl, callback, url);
                    });
                    return;
                }

                if(url.indexOf(localListType+".php") > -1) {
                    var data = response.responseText;
                    var link = data.split(' <a class="hoverinfo_trigger" href="')[1].split('"')[0];
                    getanime(thisUrl, callback, link);
                    return;
                }

                if(url.indexOf("google.") > -1) {
                    googleover = 0;
                    var data = response.responseText;
                    if(data.indexOf("getElementById('captcha')") > -1){ //Firefox no absolute url workaround TODO:
                        googleover = 1;
                        $.docReady(function() {
                            flashm( "Google Overloaded", true);// <br> <a target='_blank' href='"+url+"'>Solve captcha<a>" , true);
                            url = "http://myanimelist.net/"+localListType+".php?q=" + encodeURI(formattitle(title));
                            getanime(thisUrl, callback, url);
                        });
                        return;
                    }
                    try{
                        var link = data.split('class="g"')[1].split('a href="')[1].split('"')[0];
                        if(link.indexOf("/url?") > -1){
                            link = link.split("?q=")[1].split("&")[0];
                        }
                        getanime(thisUrl, callback, link);
                    }catch(e){
                        url = "http://myanimelist.net/"+localListType+".php?q=" + encodeURI(formattitle(title));
                        getanime(thisUrl, callback, url);
                    }
                } else {
                    if(url.indexOf("myanimelist.net/"+localListType+"/") > -1) {
                        con.log("[GET] Mal: ",url);
                        if(googleover === 0){
                            local_setValue( thisUrl, url );
                        }
                        getanime(thisUrl, callback, url);
                    }else{
                        if(url.indexOf("myanimelist.net/login.php") > -1) {
                            flashm( "Please log in on <a target='_blank' href='https://myanimelist.net/login.php'>MyAnimeList!<a>" , true);
                            var anime = {};
                            anime['login'] = 0;
                            anime['malurl'] = malurl;
                            $.docReady(function() {
                                callback(anime);
                            });
                        }else{
                            if(url.indexOf("myanimelist.net/"+localListType+".php") > -1) {
                                $("#MalInfo").text("Not Found!");
                                flashm( "Anime not found" , true);
                                miniMalButton(null);
                                return;
                            }
                            var anime = getObject(response.responseText,malurl,localListType);
                            $.docReady(function() {
                                callback(anime);
                            });
                        }
                    }
                }
            }
        });
    }



    function getObject(data,url,localListType){
        if(localListType == 'anime'){
            var anime = {};
            anime['malurl'] = url;
            anime['.csrf_token'] =  data.split('\'csrf_token\'')[1].split('\'')[1].split('\'')[0];
            if(data.indexOf('Add Anime') > -1) {
                anime['addanime'] = 1;
            }
            data = data.split('<form name="')[1].split('</form>')[0];

            anime['totalEp'] = parseInt(data.split('id="totalEpisodes">')[1].split('<')[0]);
            anime['name'] = data.split('<a href="')[1].split('">')[1].split('<')[0];
            anime['.anime_id'] = parseInt(data.split('name="anime_id"')[1].split('value="')[1].split('"')[0]); //input
            anime['.aeps'] = parseInt(data.split('name="aeps"')[1].split('value="')[1].split('"')[0]);
            anime['.astatus'] = parseInt(data.split('name="astatus"')[1].split('value="')[1].split('"')[0]);
            anime['.add_anime[status]'] = parseInt(getselect(data,'add_anime[status]'));
            //Rewatching
            if(data.split('name="add_anime[is_rewatching]"')[1].split('>')[0].indexOf('checked="checked"') >= 0){
                anime['.add_anime[is_rewatching]'] = 1;
            }
            //
            anime['.add_anime[num_watched_episodes]'] = parseInt(data.split('name="add_anime[num_watched_episodes]"')[1].split('value="')[1].split('"')[0]);
            if( isNaN(anime['.add_anime[num_watched_episodes]']) ){ anime['.add_anime[num_watched_episodes]'] = ''; }
            anime['.add_anime[score]'] = getselect(data,'add_anime[score]');
            anime['.add_anime[start_date][month]'] = getselect(data,'add_anime[start_date][month]');
            anime['.add_anime[start_date][day]'] = getselect(data,'add_anime[start_date][day]');
            anime['.add_anime[start_date][year]'] = getselect(data,'add_anime[start_date][year]');
            anime['.add_anime[finish_date][month]'] = getselect(data,'add_anime[finish_date][month]');
            anime['.add_anime[finish_date][day]'] = getselect(data,'add_anime[finish_date][day]');
            anime['.add_anime[finish_date][year]'] = getselect(data,'add_anime[finish_date][year]');
            anime['.add_anime[tags]'] = data.split('name="add_anime[tags]"')[1].split('>')[1].split('<')[0];//textarea
            anime['.add_anime[priority]'] = getselect(data,'add_anime[priority]');
            anime['.add_anime[storage_type]'] = getselect(data,'add_anime[storage_type]');
            anime['.add_anime[storage_value]'] = data.split('name="add_anime[storage_value]"')[1].split('value="')[1].split('"')[0];
            anime['.add_anime[num_watched_times]'] = data.split('name="add_anime[num_watched_times]"')[1].split('value="')[1].split('"')[0];
            anime['.add_anime[rewatch_value]'] = getselect(data,'add_anime[rewatch_value]');
            anime['.add_anime[comments]'] = data.split('name="add_anime[comments]"')[1].split('>')[1].split('<')[0];
            anime['.add_anime[is_asked_to_discuss]'] = getselect(data,'add_anime[is_asked_to_discuss]');
            anime['.add_anime[sns_post_type]'] = getselect(data,'add_anime[sns_post_type]');
            anime['.submitIt'] = data.split('name="submitIt"')[1].split('value="')[1].split('"')[0];
            con.log('[GET] Object:',anime);
            return anime;
        }else{
            var anime = {};
            anime['malurl'] = url;
            anime['.csrf_token'] =  data.split('\'csrf_token\'')[1].split('\'')[1].split('\'')[0];
            if(data.indexOf('Add Manga') > -1) {
                anime['addmanga'] = 1;
            }
            data = data.split('<form name="')[1].split('</form>')[0];

            anime['totalVol'] = parseInt(data.split('id="totalVol">')[1].split('<')[0]);
            anime['totalChap'] = parseInt(data.split('id="totalChap">')[1].split('<')[0]);
            anime['name'] = data.split('<a href="')[1].split('">')[1].split('<')[0];
            anime['.entry_id'] = parseInt(data.split('name="entry_id"')[1].split('value="')[1].split('"')[0]);
            anime['.manga_id'] = parseInt(data.split('name="manga_id"')[1].split('value="')[1].split('"')[0]); //input
            anime['volumes'] = parseInt(data.split('id="volumes"')[1].split('value="')[1].split('"')[0]);
            anime['mstatus'] = parseInt(data.split('id="mstatus"')[1].split('value="')[1].split('"')[0]);
            anime['.add_manga[status]'] = parseInt(getselect(data,'add_manga[status]'));
            //Rewatching
            if(data.split('name="add_manga[is_rereading]"')[1].split('>')[0].indexOf('checked="checked"') >= 0){
                anime['.add_manga[is_rereading]'] = 1;
            }
            //
            anime['.add_manga[num_read_volumes]'] = parseInt(data.split('name="add_manga[num_read_volumes]"')[1].split('value="')[1].split('"')[0]);
            if( isNaN(anime['.add_manga[num_read_volumes]']) ){ anime['.add_manga[num_read_volumes]'] = ''; }
            anime['.add_manga[num_read_chapters]'] = parseInt(data.split('name="add_manga[num_read_chapters]"')[1].split('value="')[1].split('"')[0]);
            if( isNaN(anime['.add_manga[num_read_chapters]']) ){ anime['.add_manga[num_read_chapters]'] = ''; }
            anime['.add_manga[score]'] = getselect(data,'add_manga[score]');
            anime['.add_manga[start_date][month]'] = getselect(data,'add_manga[start_date][month]');
            anime['.add_manga[start_date][day]'] = getselect(data,'add_manga[start_date][day]');
            anime['.add_manga[start_date][year]'] = getselect(data,'add_manga[start_date][year]');
            anime['.add_manga[finish_date][month]'] = getselect(data,'add_manga[finish_date][month]');
            anime['.add_manga[finish_date][day]'] = getselect(data,'add_manga[finish_date][day]');
            anime['.add_manga[finish_date][year]'] = getselect(data,'add_manga[finish_date][year]');
            anime['.add_manga[tags]'] = data.split('name="add_manga[tags]"')[1].split('>')[1].split('<')[0];//textarea
            anime['.add_manga[priority]'] = getselect(data,'add_manga[priority]');
            anime['.add_manga[storage_type]'] = getselect(data,'add_manga[storage_type]');
            anime['.add_manga[num_retail_volumes]'] = data.split('name="add_manga[num_retail_volumes]"')[1].split('value="')[1].split('"')[0];
            anime['.add_manga[num_read_times]'] = data.split('name="add_manga[num_read_times]"')[1].split('value="')[1].split('"')[0];
            anime['.add_manga[reread_value]'] = getselect(data,'add_manga[reread_value]');
            anime['.add_manga[comments]'] = data.split('name="add_manga[comments]"')[1].split('>')[1].split('<')[0];
            anime['.add_manga[is_asked_to_discuss]'] = getselect(data,'add_manga[is_asked_to_discuss]');
            anime['.add_manga[sns_post_type]'] = getselect(data,'add_manga[sns_post_type]');
            anime['.submitIt'] = data.split('name="submitIt"')[1].split('value="')[1].split('"')[0];
            con.log('[GET] Object:', anime);
            return anime;
        }
    }

    function setanime(thisUrl ,anime, actual = null, localListType = listType) {
        var undoAnime = $.extend({}, actual);
        if(actual === null){
            var absolute = false;
            if(anime['malurl'] != null){
                absolute = anime['malurl'];
            }
            getanime(thisUrl, function(actual){setanime(thisUrl , anime, actual);}, absolute, localListType);
            return;
        }

        var change = $.extend({},anime);
        if(localListType == 'anime'){
            var url = "https://myanimelist.net/editlist.php?type=anime&id="+actual['.anime_id'];
            if(actual['addanime'] === 1){
                url = "https://myanimelist.net/ownlist/anime/add?selected_series_id="+actual['.anime_id'];
                if(change['checkIncrease'] == 1 && autoTracking == 0){
                    episodeInfo(change['.add_anime[num_watched_episodes]'], actual['malurl']);
                    return;
                }
                flashConfirm('Add "'+actual['name']+'" to MAL?', function(){continueCall();}, function(){
                    if(change['checkIncrease'] == 1){
                        episodeInfo(change['.add_anime[num_watched_episodes]'], actual['malurl']);
                    }
                });
                return;
            }
        }else{
            var url = "https://myanimelist.net/panel.php?go=editmanga&id="+actual['.manga_id'];
            if(actual['addmanga'] === 1){
                url = "https://myanimelist.net/ownlist/manga/add?selected_manga_id="+actual['.manga_id'];
                if(change['checkIncrease'] == 1 && autoTracking == 0){
                    return;
                }
                flashConfirm('Add "'+actual['name']+'" to MAL?', function(){continueCall();}, function(){});
                return;
            }
        }

        continueCall();

        function continueCall(){
            anime = handleanimeupdate( anime, actual );
            if(anime === null){
                if(change['checkIncrease'] == 1 && localListType == 'anime'){
                    episodeInfo(change['.add_anime[num_watched_episodes]'], actual['malurl']);
                }
                return;
            }
            $.each( anime, function( index, value ){
                actual[index] = value;
            });
            anime = actual;
            var parameter = "";


            $.each( anime, function( index, value ){
                if(index.charAt(0) == "."){
                    if(!( (index === '.add_anime[is_rewatching]' || index === '.add_manga[is_rereading]') && parseInt(anime[index]) === 0)){
                        parameter += encodeURIComponent (index.substring(1))+"="+encodeURIComponent (value)+"&";
                    }
                }
            });

            con.log('[SET] URL:', url);
            con.log('[SET] Object:', anime);

            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                synchronous: false,
                data: parameter,
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
                },
                onload: function(response) {
                    //con.log(response);//.responseText);
                    if(anime['no_flash'] !== 1){
                        if(response.responseText.indexOf('Successfully') >= 0){
                            if(localListType == 'anime'){
                                var message = anime['name'];
                                var split = '<br>';
                                var totalEp = anime['totalEp'];
                                if (totalEp == 0) totalEp = '?';
                                if(typeof change['.add_anime[status]'] != 'undefined'){
                                    var statusString = "";
                                    switch (parseInt(anime['.add_anime[status]'])) {
                                        case 1:
                                            statusString = watching;
                                            break;
                                        case 2:
                                            statusString = 'Completed';
                                            break;
                                        case 3:
                                            statusString = 'On-Hold';
                                            break;
                                        case 4:
                                            statusString = 'Dropped';
                                            break;
                                        case 6:
                                            statusString = planTo;
                                            break;
                                    }
                                    message += split + statusString;
                                    split = ' | '
                                }
                                if(typeof change['.add_anime[num_watched_episodes]'] != 'undefined'){
                                    message += split + 'Episode: ' + anime['.add_anime[num_watched_episodes]']+"/"+totalEp;
                                    split = ' | '
                                }
                                if(typeof change['.add_anime[score]'] != 'undefined' && anime['.add_anime[score]'] != ''){
                                    message += split + 'Rating: ' + anime['.add_anime[score]'];
                                    split = ' | '
                                }
                                if(anime['checkIncrease'] == 1){
                                    message += '<br><button class="undoButton" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px;cursor: pointer;">Undo</button>';
                                    if(!episodeInfoBox){
                                        flashm( message , false);
                                        $('.undoButton').click(function(){
                                            undoAnime['checkIncrease'] = 0;
                                            setanime(thisUrl, undoAnime, null, localListType);
                                        });
                                    }else{
                                        episodeInfo(change['.add_anime[num_watched_episodes]'], actual['malurl'], message, function(){
                                            undoAnime['checkIncrease'] = 0;
                                            setanime(thisUrl, undoAnime, null, localListType);
                                            $('.info-Mal-undo').remove();
                                            if($('.flashinfo>div').html() == ''){
                                                $('.flashinfo').remove();
                                            }
                                        });
                                    }
                                }else{
                                    flashm( message , false);
                                }
                            }else{
                                var message = anime['name'];
                                var split = '<br>';
                                var totalVol = anime['totalVol'];
                                if (totalVol == 0) totalVol = '?';
                                var totalChap = anime['totalChap'];
                                if (totalChap == 0) totalChap = '?';
                                if(typeof change['.add_manga[status]'] != 'undefined'){
                                    var statusString = "";
                                    switch (parseInt(anime['.add_manga[status]'])) {
                                        case 1:
                                            statusString = watching;
                                            break;
                                        case 2:
                                            statusString = 'Completed';
                                            break;
                                        case 3:
                                            statusString = 'On-Hold';
                                            break;
                                        case 4:
                                            statusString = 'Dropped';
                                            break;
                                        case 6:
                                            statusString = planTo;
                                            break;
                                    }
                                    message += split + statusString;
                                    split = ' | '
                                }
                                if(typeof change['.add_manga[num_read_volumes]'] != 'undefined'){
                                    message += split + 'Volume: ' + anime['.add_manga[num_read_volumes]']+"/"+totalVol;
                                    split = ' | '
                                }
                                if(typeof change['.add_manga[num_read_chapters]'] != 'undefined'){
                                    message += split + 'Chapter: ' + anime['.add_manga[num_read_chapters]']+"/"+totalChap;
                                    split = ' | '
                                }
                                if(typeof change['.add_manga[score]'] != 'undefined' && anime['.add_manga[score]'] != ''){
                                    message += split + 'Rating: ' + anime['.add_manga[score]'];
                                    split = ' | '
                                }
                                if(anime['checkIncrease'] == 1){
                                    message += '<br><button class="undoButton" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px;cursor: pointer;">Undo</button>';
                                    flashm( message , false);
                                    $('.undoButton').click(function(){
                                        undoAnime['checkIncrease'] = 0;
                                        setanime(thisUrl, undoAnime, null, localListType);
                                    });
                                }else{
                                    flashm( message , false);
                                }
                            }
                        }else{
                            flashm( "Anime update failed" , true);
                            if(anime['checkIncrease'] !== 1){
                                try{
                                    checkdata();
                                }catch(e){}
                            }
                        }
                        if(anime['forceUpdate'] == 1 || anime['forceUpdate'] == 2){
                            try{
                                checkdata();
                            }catch(e){}
                        }
                    }
                }
            });
        }

    }
    function firefoxUrl(url, html){
        if(html.indexOf('property="og:url"') > -1){
            url = html.split('<meta property="og:url"')[1].split('content="')[1].split('"')[0];
        }
        return url;
    }

    function local_setValue( thisUrl, malurl ){
        if( (!(thisUrl.indexOf("myAnimeList.net/") >= 0)) && ( GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(thisUrl))+'/Mal' , null) == null || thisUrl.indexOf("#newCorrection") >= 0 || GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(thisUrl))+'/Crunch' , null) == 'no')){
            var param = { Kiss: thisUrl, Mal: malurl};
            if(dbSelector == 'Crunchyroll'){
                param = { Kiss: window.location.href+'?..'+$.titleToDbKey($.urlAnimeTitle()), Mal: malurl};
                if($.isOverviewPage()){
                    param = null;
                    if(GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(thisUrl))+'/Crunch' , null) == null){
                        GM_setValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(thisUrl))+'/Crunch', 'no' );
                    }
                }else{
                    GM_setValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(thisUrl))+'/Crunch', 'yes' );
                }
            }

            var toDB = 1;
            if(thisUrl.indexOf("#newCorrection") >= 0){
                toDB = 0;
                if (confirm('Submit database correction request? \n If it does not exist on MAL, please leave empty.')) {
                    toDB = 1;
                }
            }


            if(toDB == 1){
                GM_xmlhttpRequest({
                    url: 'https://kissanimelist.firebaseio.com/Data/Request/'+dbSelector+'Request.json',
                    method: "POST",
                    data: JSON.stringify(param),
                    onload: function () {
                        con.log("[DB] Send to database:",param);
                    },
                    onerror: function(error) {
                        con.log("[DB] Send to database:",error);
                    }
                });
            }
        }
        GM_setValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(thisUrl))+'/Mal', malurl );
    }

    function getselect(data, name){
        var temp = data.split('name="'+name+'"')[1].split('</select>')[0];
        if(temp.indexOf('selected="selected"') > -1){
            temp = temp.split('<option');
            for (var i = 0; i < temp.length; ++i) {
                if(temp[i].indexOf('selected="selected"') > -1){
                    return temp[i].split('value="')[1].split('"')[0];
                }
            }
        }else{
            return '';
        }
    }

    function flashm(text,error = true, info = false, permanent = false){
        con.log("[Flash] Message:",text);
        $('#flash-div').css('z-index', '2147483647');
        if(permanent){
            if(error === true){
                var colorF = "#3e0808";
            }else{
                var colorF = "#323232";
            }
            $('#flash-div-top').prepend('<div class="flashPerm" style="display:none;"><div style="display:table; pointer-events: all; background-color: red;padding: 14px 24px 14px 24px; margin: 0 auto; margin-top: -2px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:'+colorF+'; ">'+text+'</div></div>');
            $('.flashPerm').delay(2000).slideDown(800);
        }else{
            if(info){
                $('.flashinfo').removeClass('flashinfo').delay(2000).fadeOut({
                    duration: 400,
                    queue: false,
                    complete: function() { $(this).remove(); }});
                if(error === true){
                    var colorF = "#3e0808";
                }else{
                    var colorF = "#323232";
                }
                $('#flash-div').append('<div class="flashinfo" style="display:none; max-height: 5000px; margin-top: -8px;"><div style="display:table; pointer-events: all; background-color: red;padding: 14px 24px 14px 24px; margin: 0 auto; margin-top: -2px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:'+colorF+'; ">'+text+'</div></div>');
                $('.flashinfo').slideDown(800).delay(4000).queue(function() { $(this).css('transition','max-height 2s').css('max-height', '8px'); setTimeout(function() {$('#flash-div').css('z-index', '2');}, 2000);});
            }else{
                $('.flash').removeClass('flash').fadeOut({
                    duration: 400,
                    queue: false,
                    complete: function() { $(this).remove(); }});
                if(error === true){
                    var colorF = "#3e0808";
                }else{
                    var colorF = "#323232";
                }
                var mess ='<div class="flash" style="display:none;"><div style="display:table; pointer-events: all; background-color: red;padding: 14px 24px 14px 24px; margin: 0 auto; margin-top: 20px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:'+colorF+'; ">'+text+'</div></div>';
                if($('.flashinfo').length){
                    $('.flashinfo').before(mess);
                }else{
                    $('#flash-div').append(mess);
                }
                $('.flash').slideDown(800).delay(4000).slideUp(800, function() { $(this).remove(); $('#flash-div').css('z-index', '2'); });
            }
        }
    }

    function flashConfirm(message, yesCall, cancelCall){
        var rNumber = Math.floor((Math.random() * 1000) + 1);
        message = '<div style="text-align: left;">' + message + '</div><div style="display: flex; justify-content: space-around;"><button class="Yes'+rNumber+'" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px; cursor:pointer;">OK</button><button class="Cancel'+rNumber+'" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px; cursor:pointer;">CANCEL</button></div>';
        flashm(message, false, false, true);
        $( '.Yes'+rNumber ).click(function(){
            $('.flashPerm').remove();
            yesCall();
        });
        $( '.Cancel'+rNumber ).click(function(){
            $('.flashPerm').remove();
            cancelCall();
        });
    }

    function updatebutton(){
        buttonclick();
    }

    function buttonclick(){
        var anime = {};
        if(listType == 'anime'){
            anime['.add_anime[num_watched_episodes]'] = $("#malEpisodes").val();
        }else{
            anime['.add_manga[num_read_volumes]'] = $("#malVolumes").val();
            anime['.add_manga[num_read_chapters]'] = $("#malChapters").val();
        }
        anime['.add_'+listType+'[score]'] = $("#malUserRating").val();
        anime['.add_'+listType+'[status]'] = $("#malStatus").val();
        anime['forceUpdate'] = 2;

        setanime($.normalUrl(), anime);
    }

    function formattitle(title) {
        con.log("[TITLE] Title:",title);

        if(title.substr(title.length - 4)=="-Dub"){
            title=title.slice(0,-4);
        }
        if(title.substr(title.length - 4)=="-Sub"){
            title=title.slice(0,-4);
        }

        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(" s2"," 2nd season");
        title = title.replace(" s3"," 3nd season");
        title = title.replace(" s4"," 4nd season");
        title = title.replace(" s5"," 5nd season");
        title = title.replace(" s6"," 6nd season");
        title = title.replace(" s7"," 7nd season");
        title = title.replace(" s8"," 8nd season");
        title = title.replace(" s9"," 9nd season");
        //title = title.replace(/[-,.?:'"\\!@#$%^&\-_=+`~;]/g,"");
        con.log("[TITLE] Formated:",title);
        return title;
    }

    function episodeInfo(episode, malUrl, message = '', clickCallback = function(){}){
        //message = '';
        if(episodeInfoBox){
            con.log('[Hover] Episode:',malUrl+'/episode/'+episode);
            GM_xmlhttpRequest({
                url: malUrl+'/episode/'+episode,
                method: "GET",
                onload: function (response) {
                    if(response.response != null){
                        if( response.response.indexOf("Sorry, this anime doesn't seem to have any episode information yet.") > -1 ){
                            if(message == ''){
                                return;

                            }
                        }
                        if(message != ''){
                            message = "<div class='info-Mal-undo' style='white-space: nowrap; margin-top: 15px; /*margin-left: 15px;*/'> "+ message +"</div>";
                        }
                        var data = response.response;
                        var synopsis = '';
                        var epTitle = '';
                        var epSubTitle = '';
                        var imgUrl = "";
                        try{
                            epTitle = data.split('class="fs18 lh11"')[1].split('</h2>')[0].split('</span>')[1];
                            if(epTitle.trim() != '<span class="ml8 icon-episode-type-bg">'){
                                epTitle = '#'+episode+" - "+epTitle+'<br>';
                            }else{
                                epTitle = '';
                            }
                        }catch(e){}

                        if(episodeInfoSubtitle){
                            try{
                                epSubTitle = data.split('<p class="fn-grey2"')[1].split('</p>')[0].split('>')[1].replace(/^\s+/g, "");
                                epSubTitle = " <small>"+epSubTitle+'</small><br>';
                            }catch(e){}
                        }

                        if(episodeInfoSynopsis){
                            try{
                                synopsis = data.split('Synopsis</h2>')[1].split('</div>')[0].replace(/^\s+/g, "");
                                if( synopsis.indexOf("badresult") > -1 || synopsis == ""){
                                    synopsis = "";
                                }else{
                                    synopsis = '<div style="border: 1px solid; margin-top: 15px; padding: 8px;">'+synopsis+'</div>';
                                }
                            }catch(e){}
                        }

                        var imgHtml = '';
                        if(episodeInfoImage){
                            try{
                                imgUrl = data.split('"isCurrent":true')[0].split('{').slice(-1)[0].split('"thumbnail":"')[1].split('"')[0].replace(/\\\//g, '/');
                            }catch(e){}


                            if(imgUrl != ''){
                                imgHtml = '<img style = "margin-top: 15px; height: 100px;" src="'+imgUrl+'"/>';
                            }
                        }
                        var synopsisHtml = '<div style="overflow: hidden; text-align: left; max-width: 0; max-height: 0; transition: max-height 2s; transition: max-width 1s;" class="synopsis">'+synopsis+'</div>';

                        if(epTitle != ''){
                            flashm ( '<div class="flasm-hover" style="/*display: flex;*/ align-items: center;"><div style="white-space: nowrap;"">'+epTitle + epSubTitle + imgHtml + "</div>"+ message +" </div>" + synopsisHtml, false, true);
                        }else if( message != '' ){
                            flashm ( message , false, true);
                        }
                            $('.undoButton').click(clickCallback);

                            $('.flashinfo').mouseenter(function() {
                                $('#flash-div').css('z-index', '2147483647');
                                $(this).find('.synopsis').css('transition','max-width 0s').css('max-width', '500px').css('transition','max-height 2s').css('max-height', '9999px');
                            });
                            $('.flashinfo').mouseleave(function() {
                                var el = $(this);
                                $(this).find('.synopsis').css('transition','max-height 2s').css('max-height', '0')
                                setTimeout(function() {
                                    if(el.find('.synopsis').css('max-height') == '0px'){
                                        el.find('.synopsis').css('transition','max-width 1s').css('max-width', '0');
                                        $('#flash-div').css('z-index', '2');
                                    }
                                }, 2000);
                            });

                    }
                },
                onerror: function(error) {
                    con.log("[episodeInfo] error:",error);
                }
            });
        }
    }

    function miniMalButton(url = null){
        $(".open-info-popup").unbind('click').show().click( function(){
            if($('#info-popup').css('display') == 'none'){
                document.getElementById('info-popup').style.display = "block";
                fillIframe(url, currentMalData);
                $('.floatbutton').fadeOut();
            }else{
                document.getElementById('info-popup').style.display = "none";
                $('.floatbutton').fadeIn();
            }
        });

        $("#info-iframe").contents().keydown(function(e) {
            keys(e);
        });

        $(document).keydown(function(e) {
            keys(e);
        });

        function keys(e){
            if (e.ctrlKey && e.keyCode === 77) {
                if($('#info-popup').css('display') == 'none'){
                    document.getElementById('info-popup').style.display = "block";
                    fillIframe(url, currentMalData);
                    $('.floatbutton').fadeOut();
                }else{
                    document.getElementById('info-popup').style.display = "none";
                    $('.floatbutton').fadeIn();
                }
            }
        }
    }

    function atobURL( encoded ){
        try{
            return atob( encoded );
        }catch(e){
            return encoded;
        }
    }

    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
           return null;
        }
        else{
           return decodeURI(results[1]) || 0;
        }
    }
    function checkdata(){
        if($.normalUrl() !== ""){
            getanime($.normalUrl(), function(anime){handleanime(anime);});
        }else{
            alert(error);
        }

        $.docReady(function() {
            var wrapStart = '<span style="display: inline-block;">';
            var wrapEnd = '</span>';

            var ui = '<p id="malp">';
            ui += '<span id="MalInfo">'+loadingText+'</span>';

            ui += '<span id="MalData" style="display: none; justify-content: space-between; flex-wrap: wrap;">';

            ui += wrapStart;
            ui += '<span class="info">Mal Score: </span>';
            ui += '<a id="malRating" style="color: '+textColor+';min-width: 30px;display: inline-block;" target="_blank" href="">____</a>';
            ui += wrapEnd;

            //ui += '<span id="MalLogin">';
            wrapStart = '<span style="display: inline-block; display: none;" class="MalLogin">';

            ui += wrapStart;
            ui += '<span class="info">Status: </span>';
            ui += '<select id="malStatus" style="font-size: 12px;background: transparent; border-width: 1px; border-color: grey; color: '+textColor+'; text-decoration: none; outline: medium none;">';
            //ui += '<option value="0" style="background: #111111;color: '+textColor+';"></option>';
            ui += '<option value="1" style="background: #111111;color: '+textColor+';">'+watching+'</option>';
            ui += '<option value="2" style="background: #111111;color: '+textColor+';">Completed</option>';
            ui += '<option value="3" style="background: #111111;color: '+textColor+';">On-Hold</option>';
            ui += '<option value="4" style="background: #111111;color: '+textColor+';">Dropped</option>';
            ui += '<option value="6" style="background: #111111;color: '+textColor+';">'+planTo+'</option>';
            ui += '</select>';
            ui += wrapEnd;

            if(listType == 'anime'){
                var middle = '';
                middle += wrapStart;
                middle += '<span class="info">Episodes: </span>';
                middle += '<span style="color: '+textColor+'; text-decoration: none; outline: medium none;">';
                middle += '<input id="malEpisodes" value="0" style="background: transparent; border-width: 1px; border-color: grey; text-align: right; color: '+textColor+'; text-decoration: none; outline: medium none;" type="text" size="1" maxlength="4">';
                middle += '/<span id="malTotal">0</span>';
                middle += '</span>';
                middle += wrapEnd;

            }else{
                var middle = '';
                middle += wrapStart;
                middle += '<span class="info">Volumes: </span>';
                middle += '<span style="color: '+textColor+'; text-decoration: none; outline: medium none;">';
                middle += '<input id="malVolumes" value="0" style="background: transparent; border-width: 1px; border-color: grey; text-align: right; color: '+textColor+'; text-decoration: none; outline: medium none;" type="text" size="1" maxlength="4">';
                middle += '/<span id="malTotalVol">0</span>';
                middle += '</span>';
                middle += wrapEnd;


                middle += wrapStart;
                middle += '<span class="info">Chapters: </span>';
                middle += '<span style="color: '+textColor+'; text-decoration: none; outline: medium none;">';
                middle += '<input id="malChapters" value="0" style="background: transparent; border-width: 1px; border-color: grey; text-align: right; color: '+textColor+'; text-decoration: none; outline: medium none;" type="text" size="1" maxlength="4">';
                middle += '/<span id="malTotalCha">0</span>';
                middle += '</span>';
                middle += wrapEnd;
            }

            ui += middle;


            ui += wrapStart;
            ui += '<span class="info">Your Score: </span>';
            ui += '<select id="malUserRating" style="font-size: 12px;background: transparent; border-width: 1px; border-color: grey; color: '+textColor+'; text-decoration: none; outline: medium none;"><option value="" style="background: #111111;color: '+textColor+';">Select</option>';
            ui += '<option value="10" style="background: #111111;color: '+textColor+';">(10) Masterpiece</option>';
            ui += '<option value="9" style="background: #111111;color: '+textColor+';">(9) Great</option>';
            ui += '<option value="8" style="background: #111111;color: '+textColor+';">(8) Very Good</option>';
            ui += '<option value="7" style="background: #111111;color: '+textColor+';">(7) Good</option>';
            ui += '<option value="6" style="background: #111111;color: '+textColor+';">(6) Fine</option>';
            ui += '<option value="5" style="background: #111111;color: '+textColor+';">(5) Average</option>';
            ui += '<option value="4" style="background: #111111;color: '+textColor+';">(4) Bad</option>';
            ui += '<option value="3" style="background: #111111;color: '+textColor+';">(3) Very Bad</option>';
            ui += '<option value="2" style="background: #111111;color: '+textColor+';">(2) Horrible</option>';
            ui += '<option value="1" style="background: #111111;color: '+textColor+';">(1) Appalling</option>';
            ui += '</select>';
            ui += wrapEnd;

            //ui += '</span>';
            ui += '</span>';
            ui += '</p>';

            var uihead ='';
            uihead += '<p class="headui" style="float: right; margin: 0; margin-right: 10px">';
            uihead += '';
            uihead += '<p>';

            var uiwrong ='';

            uiwrong += '<button class="open-info-popup mdl-button" style="display:none; margin-left: 6px;">MAL</button>';


            if($("#flash").width() === null){
                $(ui).uiPos();
                $(uiwrong).uiWrongPos();
                $(uihead).uiHeadPos();

                $( "#malEpisodes" ).change(function() {
                    updatebutton();
                });
                //####Manga####
                $( "#malVolumes" ).change(function() {
                    updatebutton();
                });
                $( "#malChapters" ).change(function() {
                    updatebutton();
                });
                //#############
                $( "#malUserRating" ).change(function() {
                    updatebutton();
                });
                $( "#malStatus" ).change(function() {
                    updatebutton();
                });

                var flashpos = $('body');
                //if($('#my_video_1').width() !== null){
                    //flashpos = $('#my_video_1');
                //}
                flashpos.after('<div id="flash-div-top" style="text-align: center;pointer-events: none;position: fixed;top:0px;width:100%;z-index: 2147483647;left: 0;"></div><div id="flash-div" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;z-index: 2147483647;left: 0;"><div id="flash" style="display:none;  background-color: red;padding: 20px; margin: 0 auto;max-width: 60%;          -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 20px;background:rgba(227,0,0,0.6);                       "></div></div>');

                changelog();

                createIframe();
                //#######Kissanime#######
                $("#btnRemoveBookmark").click(function() {
                    var anime = {};
                    anime['.add_'+listType+'[status]'] = 4;
                    anime['forceUpdate'] = 1;
                    setanime($.normalUrl(),anime);
                });

                $("#btnAddBookmark").click(function() {
                    var anime = {};
                    anime['.add_'+listType+'[status]'] = 6;
                    anime['forceUpdate'] = 1;
                    setanime($.normalUrl(),anime);
                });
                //#######################
            }
        });


    }
    var xml ="";
    var foundAnime = [];

    //var imageBackup = "Mal-img";
    var image = "image";

    function getMalXml(user = "", callback = null){
        var url = "https://myanimelist.net/editprofile.php?go=privacy";
        if(user !== ""){
            url = "https://myanimelist.net/malappinfo.php?u="+user+"&status=all&type="+listType;
            con.log("XML Url:", url);
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: false,
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            onload: function(response) {
                if(url ===  "https://myanimelist.net/editprofile.php?go=privacy"){
                    try{
                        user = response.responseText.split('<a href="https://myanimelist.net/profile/')[1].split('"')[0];
                    }catch(e){
                        flashm( "Please log in on <a target='_blank' href='https://myanimelist.net/login.php'>MyAnimeList!<a>" , true);
                        $('.listing tr td:nth-child(1)').css('height', 'initial');
                        $('.listing tr td:nth-child(1)').css('padding-left', '0');
                        return;
                    }
                    con.log("User:" ,user);
                    getMalXml(user, callback);
                    return;
                }
                if(callback == null){
                    xml = $(response.responseXML);
                    setAll();
                }else{
                    callback( $(response.responseXML) );
                }
            }
        });
    }

    function encodeurl(string){
        return encodeURIComponent(encodeURIComponent(string).replace('.', '%2E'));
    }

    function setBookmarkAnime(value, baseurl, target, last = 0){
        var id = value.split("/")[4];
        con.log(id);
        foundAnime.push(id);
        var xmlAnime = xml.find('series_'+listType+'db_id:contains('+id+')').parent();

        getdata(baseurl, function(value) { setimage(value, xmlAnime, target, baseurl); }, image);

        if(xmlAnime.length === 0){
            if(id == 'Not-Found'){
                target.find(".MalData").first().append("No Mal");
            }else{
                target.find(".MalData").first().append("<a href='#' onclick='return false;'>Add to Mal</a>").find("a").click(function() {
                    var anime = {};
                    anime['.add_'+listType+'[status]'] = 6;
                    setanime(baseurl,anime);
                });
            }
        }else{
            var totalEp = xmlAnime.find("series_"+middleType).first().text();
            if(totalEp === '0'){
                totalEp = "?";
            }

            setepisode (xmlAnime.find("my_"+middleVerb+"_"+middleType).first().text(), totalEp , target, baseurl);
            setstatus (xmlAnime.find("my_status").first().text() , target, baseurl);
            setscore (xmlAnime.find("my_score").first().text() , target, baseurl);
        }
        if(last === 1){ //TODO:
            con.log(foundAnime);
            //MalExistsOnKiss(foundAnime);
        }
    }

    function setimage(value, xmlAnime, target, baseurl){
        if(classicBookmarks == 0){
            if(typeof value === "undefined" || value === null){
                if(baseurl === ""){
                    return;
                }
                //getdata(baseurl, function(value) { setimage(value, xmlAnime, target, ""); }, imageBackup);
                return;
            }
            target.find("td").first().html("<img src='"+value+"' width='120px' height='150px'></img>");
            /*target.find("td").first().find("img").error(function() {
                //TODO: Send to Database and only execute one time so no loop
                getdata(baseurl, function(value) { setimage(value, xmlAnime, target, ""); }, imageBackup);
            });*/
        }
    }

    function setepisode(episode, totalEp, target, baseurl){
        target.find(".MalData").first().append('<div class="malEpisode"><input class="input" type="number" min="0" max="'+totalEp+'" value="'+episode+'" size="1" maxlength="4" style="display: none;background: transparent; border-width: 1px; border-color: grey; text-align: right; color: '+textColor+'; text-decoration: none; outline: medium none; max-width: 50px;"/><span class="normal">'+episode+'</span> / '+totalEp+'</div>');

        target.find(".MalData").first().find('.malEpisode').click(
          function() {
            $( this ).find('.input').css('display', 'initial');
            $( this ).find('.normal').css('display', 'none');
          }).change(function() {
            var anime = {};
            anime['.add_'+listType+'[num_'+middleVerb+'_'+middleType+']'] = $(this).parent().find('.malEpisode').find('.input').val();
            anime['.add_'+listType+'[status]'] = $(this).parent().find('.malStatus').val();
            anime['.add_'+listType+'[score]'] = $(this).parent().find('.malUserRating').val();
            setanime(baseurl,anime);
          });
    }

    function setstatus(value, target, baseurl){
        if(target.find(".malStatus").first().height() === null){
            var ui = "";
            ui += '<select class="malStatus" style="width: 100%; font-size: 12px; background: transparent; border-width: 0px; border-color: grey; color: '+textColor+'; text-decoration: none; outline: medium none;">';
            //ui += '<option value="0" style="background: #111111;color: #d5f406;"></option>';
            ui += '<option value="1" style="background: #111111;color: '+textColor+';">'+watching+'</option>';
            ui += '<option value="2" style="background: #111111;color: '+textColor+';">Completed</option>';
            ui += '<option value="3" style="background: #111111;color: '+textColor+';">On-Hold</option>';
            ui += '<option value="4" style="background: #111111;color: '+textColor+';">Dropped</option>';
            ui += '<option value="6" style="background: #111111;color: '+textColor+';">'+planTo+'</option>';
            ui += '</select>';
            target.find(".MalData").first().append(""+ui).find('.malStatus').change(function() {
                var anime = {};
                anime['.add_'+listType+'[num_'+middleVerb+'_'+middleType+']'] = $(this).parent().find('.malEpisode').find('.input').val();
                anime['.add_'+listType+'[status]'] = $(this).parent().find('.malStatus').val();
                anime['.add_'+listType+'[score]'] = $(this).parent().find('.malUserRating').val();
                setanime(baseurl,anime);
            });
        }
        target.find(".malStatus").first().val(value);
    }

    function setscore(value, target, baseurl){
        if(target.find(".malUserRating").first().height() === null){
            var ui = "";
            ui += '<select class="malUserRating" style="width: 100%; font-size: 12px; background: transparent; border-width: 0px; border-color: grey; color: '+textColor+'; text-decoration: none; outline: medium none;"><option value="" style="background: #111111;color: '+textColor+';">Select</option>';
            ui += '<option value="10" style="background: #111111;color: '+textColor+';">(10) Masterpiece</option>';
            ui += '<option value="9" style="background: #111111;color: '+textColor+';">(9) Great</option>';
            ui += '<option value="8" style="background: #111111;color: '+textColor+';">(8) Very Good</option>';
            ui += '<option value="7" style="background: #111111;color: '+textColor+';">(7) Good</option>';
            ui += '<option value="6" style="background: #111111;color: '+textColor+';">(6) Fine</option>';
            ui += '<option value="5" style="background: #111111;color: '+textColor+';">(5) Average</option>';
            ui += '<option value="4" style="background: #111111;color: '+textColor+';">(4) Bad</option>';
            ui += '<option value="3" style="background: #111111;color: '+textColor+';">(3) Very Bad</option>';
            ui += '<option value="2" style="background: #111111;color: '+textColor+';">(2) Horrible</option>';
            ui += '<option value="1" style="background: #111111;color: '+textColor+';">(1) Appalling</option>';
            ui += '</select>';
            target.find(".MalData").first().append("</br>"+ui).find('.malUserRating').change(function() {
                var anime = {};
                anime['.add_'+listType+'[num_'+middleVerb+'_'+middleType+']'] = $(this).parent().find('.malEpisode').find('.input').val();
                anime['.add_'+listType+'[status]'] = $(this).parent().find('.malStatus').val();
                anime['.add_'+listType+'[score]'] = $(this).parent().find('.malUserRating').val();
                setanime(baseurl,anime);
            });
        }
        target.find(".malUserRating").first().val(value);
    }

    function clearCache(){
        con.log('Before',GM_listValues());
        var cacheArray = GM_listValues();
        $.each( cacheArray, function( index, cache){
            if(/^[^/]+\/[^/]+\/Mal$/.test(cache)){
                GM_deleteValue(cache);
            }
            if(/^[^/]+\/[^/]+\/MalToKiss$/.test(cache)){
                GM_deleteValue(cache);
            }
            if(/^[^/]+\/[^/]+\/bdid$/.test(cache)){
                GM_deleteValue(cache);
            }
            if(/^[^/]+\/[^/]+\/image$/.test(cache)){
                GM_deleteValue(cache);
            }
        });
        con.log('After',GM_listValues());
        flashm( "Cache Cleared" , false);
    }

    function MalExistsOnKiss(animelist){
        var row = "";
        var xmlEntry = "";
        $(".listing").html("");//TODO remove;
        xml.find('series_'+listType+'db_id').each(function(index){
            if((jQuery.inArray( $(this).text(), animelist ) ) < 0){
                con.log($(this).text());
                xmlEntry = $(this).parent();
                row = "";
                row += '<tr class="trAnime">';
                row += '<td class="Timage" style="padding-left: 0px; height: 150px; vertical-align: top;">';
                row += '<img src="'+xmlEntry.find("series_image").first().text()+'" width="120px" height="150px">';
                row += '</td>';
                row += '<td style="vertical-align: top;">';
                row += '<div class="title" style="padding-bottom: 10px;">';
                row += '<a class="aAnime" href="https://myanimelist.net/'+listType+'/'+xmlEntry.find("series_"+listType+"db_id").first().text()+'">'+xmlEntry.find("series_title").first().text()+'</a>';
                row += '</div>';
                row += '</td>';
                row += '</tr>';

                $(".listing").before(row);
            }
        });


    }

    function getdata(baseurl, callback, parth = ""){
        if(GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(baseurl))+'/'+parth , null) !== null ){
            con.log("cache:", dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(baseurl))+'/'+parth);
            var value = GM_getValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(baseurl))+'/'+parth , null);
            callback(value);
        }else{
            con.log("db:", dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(baseurl))+'/'+parth);
            var url = 'https://kissanimelist.firebaseio.com/Data/'+dbSelector+'/'+encodeURIComponent(encodeURIComponent($.titleToDbKey($.urlAnimeTitle(baseurl)))).toLowerCase()+'/'+parth+'.json';
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                synchronous: false,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                },
                onload: function(response) {
                    //con.log(response);
                    if( response.responseText != null  && response.responseText != 'null'){
                        var newResponse = response.responseText.slice(1, -1);
                        if(parth == 'Mal'){
                            newResponse = 'https://myanimelist.net/'+listType+'/'+response.responseText.split('"')[1]+'/'+response.responseText.split('"')[3];
                        }
                        GM_setValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(baseurl))+'/'+parth , newResponse);
                        callback(newResponse);
                    }
                }
            });
        }
    }

    function setAll(){
        $.docReady(function() {

            $.bookmarkEntrySelector().each(function() {
                var thistd = $(this).find("td").first();
                $(this).find("td").first().children().first().wrap('<div class="title" style="padding-bottom: 10px;"></div>');
                var append = '<div style="width: 50%; float: left;" class="kissData"></div><div style="width: 50%; float: left;" class="MalData"></div>';
                $(this).find("td").first().append(append);


                $(this).find("td").each(function(index){

                    if(index > 0){
                        $(this).appendTo(thistd.find(".kissData"));
                        //text += $(this).html()+"<br/>";
                        //$(this).remove();
                    }else{
                        //text += '<div class="title" style="padding-bottom: 10px;">'+$(this).html()+'</div><div style="width: 50%; float: left;" class="kiss">';
                    }
                });
                $(this).find("td").first().find("td").append("<br />").contents().unwrap();
            });
            if($("#cssTableSet").height() === null){
                $.BookmarksStyleAfterLoad();
            }else{
                return;
            }

            var len = $.bookmarkEntrySelector().length;
            $.bookmarkEntrySelector().bind('inview', function (event, visible) {
                if (visible === true) {
                    var baseurl = $.absoluteLink($(this).find("a").first().attr('href'));
                    var target = $(this);
                    getdata(baseurl,function(value) { setBookmarkAnime(value, baseurl, target); }, "Mal");
                    $(this).unbind('inview');
                }
            });
            $(window).scroll();
        });
    }
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
            var uid = malUrl.split('/')[4].split("?")[0];
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
                        con.log("[setKissToMal] error:",error);
                    }
                });
            });
       });
    }

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
                                url = atobURL( $(this).text().split("last::")[1].split("::")[0] );
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
            con.log('[BOOK] Modern Tags');
            var data = $.parseJSON($('.list-table').attr('data-items'));
            $.each(data,function(index, el) {
                if(el['tags'].indexOf("last::") > -1 ){
                    var url = atobURL( el['tags'].split("last::")[1].split("::")[0] );
                    setStreamLinks(url, $('.list-item a[href^="'+el['anime_url']+'"]').parent().parent('.list-table-data'));
                }
            });
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
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
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
    if(dbSelector == 'Kissanime'){
        $( document).ready( function(){
            if( window.location.href.indexOf("BookmarkList") > -1 ){
                var catOptions = '';
                catOptions +='<option value="">Select</option>';
                $.each(lstCats, function( index, value ) {
                  catOptions +='<option value="'+value+'">'+value+'</option>';
                });
                catOptions = '<select class="selectCats" style="width: 200px; font-size: 14px;">'+catOptions+'</select>';
                con.log(catOptions);
                GM_setValue(dbSelector+'catOptions',catOptions);
                $('.trAnime').each(function(){
                    var aurl = $.absoluteLink($(this).find('.aAnime').attr('href'));
                    con.log(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.urlAnimeIdent(aurl)))+'/bdid',$(this).find('.aCategory').attr('bdid'));
                    GM_setValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.urlAnimeIdent(aurl)))+'/bdid',$(this).find('.aCategory').attr('bdid'));
                });
            }else{
                var bdid = GM_getValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.urlAnimeIdent($.normalUrl())))+'/bdid', null);
                if(bdid != null){
                    $('#spanBookmarkManager').before('<a class="aCategory" href="#" onclick="return false;" title="Move to other folder"><img border="0" style="vertical-align:middle" src="/Content/Images/folder.png"> Folder</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    $('.aCategory').click(function () {
                        $(this).hide();
                        var aCat= $(this);
                        $(this).after(GM_getValue(dbSelector+'catOptions',""));
                        $('body').on('change', '.selectCats', function() {
                            var element  = $(this);
                            var strUncate = ' Uncategorized';
                            var categoryName = $(this).val();
                            if (categoryName == ''){return;}
                            if (categoryName == strUncate)
                                categoryName = "";
                            $.ajax({
                                type: "POST",
                                url: "/ChangeBookmarkCategory",
                                data: "bdid=" + bdid + "&category=" + categoryName,
                                success: function (message) {
                                    if (message != "!error!") {
                                        element.remove();
                                        aCat.show();
                                        flashm( "Successfull" , false);
                                    }
                                    else {
                                        flashm( "Failed");
                                    }
                                }
                            });
                        });
                    });
                }
            }
        });
    }
    function createIframe(){
        if( !($('#info-popup').height()) ){
            //var position = 'width: 80%; height: 70%; position: absolute; top: 15%; left: 10%';
            var position = 'max-width: 100%; max-height: 100%; min-width: 500px; min-height: 300px; width: '+miniMalWidth+'; height: '+miniMalHeight+'; position: absolute; bottom: 0%; '+( posLeft ? 'left':'right')+': 0%';//phone
            if($(window).width() < 500){
              position = 'width: 100vw; height: 100%; position: absolute; top: 0%; '+( posLeft ? 'left':'right')+': 0%';
            }
            var material = '<dialog class="modal" id="info-popup" style="pointer-events: none;display: none; position: fixed;z-index: 999;left: 0;top: 0;bottom: 0;width: 100%; height: 100%; background-color: transparent; padding: 0; margin: 0;">';
            material += '<div id="modal-content" class="modal-content" Style="pointer-events: all;background-color: #fefefe; margin: 0; '+position+'">';
            //material += '<iframe id="info-iframe" style="height:100%;width:100%;border:0;"></iframe>';
            material += '</div>';
            material += '</dialog>';
            $('body').after(material);

            GM_addStyle('.modal-content.fullscreen{width: 100% !important;height: 100% !important; bottom: 0 !important;'+( posLeft ? 'left':'right')+': 0 !important;}\
                         .modal-content{-webkit-transition: all 0.5s ease; -moz-transition: all 0.5s ease; -o-transition: all 0.5s ease; transition: all 0.5s ease;}\
                         .floatbutton:hover {background-color:rgb(255,64,129);}\
                         .floatbutton:hover div {background-color:white;}\
                         .floatbutton div {background-color:black;-webkit-transition: all 0.5s ease;-moz-transition: all 0.5s ease;-o-transition: all 0.5s ease;transition: all 0.5s ease;}\
                         .floatbutton {\
                            z-index: 999;display: none; position:fixed; bottom:40px; right:40px; border-radius: 50%; font-size: 24px; height: 56px; margin: auto; min-width: 56px; width: 56px; padding: 0; overflow: hidden; background: rgba(158,158,158,.2); box-shadow: 0 1px 1.5px 0 rgba(0,0,0,.12), 0 1px 1px 0 rgba(0,0,0,.24); line-height: normal; border: none;\
                            font-weight: 500; text-transform: uppercase; letter-spacing: 0; will-change: box-shadow; transition: box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1); outline: none; cursor: pointer; text-decoration: none; text-align: center; vertical-align: middle; padding: 16px;\
                         }\
                         .mdl-button{\
                            background: #3f51b5; color: #fff;box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);\
                            border: none; border-radius: 2px;\
                         }\
                         .flashinfo:hover{\
                            max-height:5000px !important;\
                         }');

            var iframe = document.createElement('iframe');
            iframe.setAttribute("id", "info-iframe");
            iframe.setAttribute("style", "height:100%;width:100%;border:0;");
            iframe.onload = function() {
                executejs(GM_getResourceText("materialjs"));
                var head = $("#info-iframe").contents().find("head");
                head.append('<style>#material .mdl-card__supporting-text{width: initial} .mdl-layout__header .mdl-textfield__label:after{background-color: red !important;}</style>');
                head.append('<style>'+GM_getResourceText("materialCSS")+'</style>');
                head.append('<style>'+GM_getResourceText("materialFont")+'</style>');
                //templateIframe(url, data);
                if(displayFloatButton == 1){
                    var floatbutton = '<button class="open-info-popup floatbutton" style="">';
                    floatbutton += '<i class="my-float" style="margin-top:22px;"><div style="width: 100%; height: 4px; margin-bottom: 15%;"></div><div style="width: 100%; height: 4px; margin-bottom: 15%;"></div><div style="width: 100%; height: 4px"></div></i></button>';
                    $('#info-popup').after(floatbutton);
                    /*$('.open-info-popup').click(function() {
                        if($('#info-popup').css('display') == 'none'){
                            $('.floatbutton').fadeOut();
                        }
                    });*/
                }
            };
            document.getElementById("modal-content").appendChild(iframe);
        }
    }

    function templateIframe(url, data){
        var material = '\
        <div id="material" style="height: 100%;"><div class="mdl-layout mdl-js-layout mdl-layout--fixed-header\
                    mdl-layout--fixed-tabs">\
          <header class="mdl-layout__header" style="min-height: 0;">\
            <button class="mdl-layout__drawer-button" id="backbutton" style="display: none;"><i class="material-icons">arrow_back</i></button>\
            <div class="mdl-layout__header-row">\
                <!--<span class="mdl-layout-title malTitle malClear"></span>--!>\
                <button class="mdl-button mdl-js-button mdl-button--icon mdl-layout__drawer-button" id="book" style="">\
                  <i class="material-icons" class="material-icons md-48">book</i>\
                </button>\
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable" id="SearchButton" style="margin-left: -57px; margin-top: 3px; padding-left: 40px;">\
                  <label class="mdl-button mdl-js-button mdl-button--icon" for="headMalSearch">\
                    <i class="material-icons">search</i>\
                  </label>\
                  <div class="mdl-textfield__expandable-holder">\
                    <input class="mdl-textfield__input" type="text" id="headMalSearch">\
                    <label class="mdl-textfield__label" for="headMalSearch"></label>\
                  </div>\
                </div>\
                <button class="mdl-button mdl-js-button mdl-button--icon mdl-layout__drawer-button" id="material-fullscreen" style="left: initial; right: 40px;">\
                  <i class="material-icons" class="material-icons md-48">fullscreen</i>\
                </button>\
                <button class="mdl-button mdl-js-button mdl-button--icon mdl-layout__drawer-button" id="close-info-popup" style="left: initial; right: 0;">\
                    <i class="material-icons close">close</i>\
                </button>\
            </div>\
            <!-- Tabs -->\
            <div class="mdl-layout__tab-bar mdl-js-ripple-effect">';
            material += '\
            <a href="#fixed-tab-1" class="mdl-layout__tab is-active mal-exists">Overview</a>\
            <a href="#fixed-tab-2" class="mdl-layout__tab reviewsTab mal-exists">Reviews</a>\
            <a href="#fixed-tab-3" class="mdl-layout__tab recommendationTab mal-exists">Recommendations</a>\
            <!--<a href="#fixed-tab-4" class="mdl-layout__tab">Episodes</a>-->\
            <a href="#fixed-tab-5" class="mdl-layout__tab settingsTab">Settings</a>';
            material += '\
            </div>\
          </header>\
          <main class="mdl-layout__content">';
            material += '\
            <section class="mdl-layout__tab-panel is-active" id="fixed-tab-1">\
              <div id="loadOverview" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>\
              <div class="page-content">\
              <div class="mdl-grid">\
                <div class="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--6-col-phone mdl-shadow--4dp stats-block malClear" style="min-width: 120px;">\
                    \
                </div>\
                <div class="mdl-grid mdl-cell mdl-shadow--4dp coverinfo malClear" style="display:block; flex-grow: 100; min-width: 70%;">\
                  <div class="mdl-card__media mdl-cell mdl-cell--2-col" style="background-color: transparent; float:left; padding-right: 16px;">\
                      <img class="malImage malClear" style="width: 100%; height: auto;"></img>\
                  </div>\
                  <div class="mdl-cell mdl-cell--12-col">\
                      <a class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect malClear malLink" href="" style="float: right;" target="_blank"><i class="material-icons">open_in_new</i></a>\
                      <h1 class="malTitle mdl-card__title-text malClear" style="padding-left: 0px; overflow:visible;"></h1>\
                      <div class="malAltTitle mdl-card__supporting-text malClear" style="padding: 10px 0 0 0px; overflow:visible;"></div>\
                  </div>\
                  <div class="malDescription malClear mdl-cell mdl-cell--10-col" style="overflow: hidden;"></div>\
                </div>\
                <div class="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-shadow--4dp data-block mdl-grid mdl-grid--no-spacing malClear">\
                    \
                </div>\
                <div class="mdl-grid mdl-grid--no-spacing mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-shadow--4dp related-block mdl-grid malClear">\
                    \
                </div>\
                <div style="display: none;" class="mdl-grid mdl-grid--no-spacing mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-shadow--4dp mdl-grid stream-block malClear">\
                    <ul class="mdl-list stream-block-inner">\
                    \
                    </ul>\
                </div>\
                <div class="mdl-grid mdl-grid--no-spacing mdl-cell mdl-cell--12-col mdl-shadow--4dp info-block mdl-grid malClear">\
                    \
                </div>\
              </div>\
              </div>\
            </section>\
            <section class="mdl-layout__tab-panel" id="fixed-tab-2">\
              <div id="loadReviews" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>\
              <div class="page-content malClear" id="malReviews"></div>\
            </section>\
            <section class="mdl-layout__tab-panel" id="fixed-tab-3">\
              <div id="loadRecommendations" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>\
              <div class="page-content malClear" id="malRecommendations"></div>\
            </section>\
            <section class="mdl-layout__tab-panel" id="fixed-tab-4">\
              <div id="loadEpisode" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>\
              <div class="page-content malClear" id="malEpisodes"></div>\
            </section>';
            material +='\
            <section class="mdl-layout__tab-panel" id="fixed-tab-5">\
              <div class="page-content malClear" id="malConfig"></div>\
            </section>';
          material +='</main>\
        </div>\
        <div id="malSearchPop" style="height: calc(100% - 60px); width: 100%; position: fixed; top: 60px; z-index: 10; background-color: white; overflow-y: auto; display: none;">\
        </div>';
        //material += '</div>';
        $("#info-iframe").contents().find("body").append(material);
        var modal = document.getElementById('info-popup');

        $("#info-iframe").contents().find("#close-info-popup").click( function(){
            modal.style.display = "none";
            $('.floatbutton').fadeIn();
            //$('body').css('overflow','initial');
        });

        $("#info-iframe").contents().find("#backbutton").click( function(){
            //alert();getcommondata();
            $("#info-iframe").contents().find('.mdl-layout__tab:eq(0) span').trigger( "click" );
            $(this).hide();
            $("#info-iframe").contents().find('#SearchButton').css('margin-left', '-57px');
            $("#info-iframe").contents().find('#book').css('left', '0px');
            if(currentMalData == null){
                fillIframe(url, data);
            }
            fillIframe(url, currentMalData);
        });

        $("#info-iframe").contents().find("#material-fullscreen").click( function(){
            if($('.modal-content.fullscreen').height()){
                $(".modal-content").removeClass('fullscreen');
                $(this).find('i').text('fullscreen');
            }else{
                $(".modal-content").addClass('fullscreen');
                $(this).find('i').text('fullscreen_exit');
            }
        });

        var timer;
        $("#info-iframe").contents().find("#headMalSearch").on("input", function(){
          clearTimeout(timer);
          timer = setTimeout(function(){
            if($("#info-iframe").contents().find("#headMalSearch").val() == ''){
              $("#info-iframe").contents().find('#malSearchPop').hide();
            }else{
              $("#info-iframe").contents().find('#malSearchPop').show();
              searchMal($("#info-iframe").contents().find("#headMalSearch").val(), listType, '#malSearchPop', function(){
                $("#info-iframe").contents().find("#malSearchPop .searchItem").unbind('click').click(function(event) {
                  $("#info-iframe").contents().find("#headMalSearch").val('').trigger("input").parent().parent().removeClass('is-dirty');
                  $("#info-iframe").contents().find('.malClear').hide();
                  $("#info-iframe").contents().find('.mdl-progress__indeterminate').show();
                  $("#info-iframe").contents().find("#backbutton").show();
                  $("#info-iframe").contents().find('#SearchButton').css('margin-left', '-17px');
                  $("#info-iframe").contents().find('#book').css('left', '40px');
                  $("#info-iframe").contents().find('.mdl-layout__tab:eq(0) span').trigger( "click" );
                  fillIframe($(this).attr('malhref'));
                });
              });
            }
          }, 300);
        });

        $("#info-iframe").contents().find("#book").click(function() {
          if($("#info-iframe").contents().find("#book.open").length){
            $("#info-iframe").contents().find("#book").toggleClass('open');
            $("#info-iframe").contents().find('#malSearchPop').hide();
          }else{
            $("#info-iframe").contents().find("#book").toggleClass('open');
            $("#info-iframe").contents().find('#malSearchPop').show();
            iframeBookmarks( $("#info-iframe").contents().find('#malSearchPop') );
          }
        });
    }

    function fillIframe(url, data = null){
        $("#info-iframe").contents().find('.malClear').hide();
        $("#info-iframe").contents().find('.mdl-progress__indeterminate').show();
        if(data == null && url != null){
            getAjaxData(url, function(newdata){
                fillIframe(url, newdata);
            });
            return;
        }
        if( !($("#info-iframe").contents().find('#material').height()) ){
            templateIframe(url,data);
        }
        if(url == null){
          $("#info-iframe").contents().find('.mal-exists').css('display', 'none');
          $("#info-iframe").contents().find('.mdl-layout__tab-panel.is-active').removeClass('is-active');
          $("#info-iframe").contents().find('.mdl-layout__tab-panel').last().addClass('is-active');
        }else{
          $("#info-iframe").contents().find('.mal-exists').css('display', 'block');
        }
        iframeConfig(url, data);
        iframeOverview(url, data);
        $("#info-iframe").contents().find('.reviewsTab').off('click').one('click',function(){
            iframeReview(url, data);
            fixIframeLink();
        });
        //iframeEpisode(url, data);
        $("#info-iframe").contents().find('.recommendationTab').off('click').one('click',function(){
            iframeRecommendations(url, data);
        });
        $("#info-iframe").contents().find('.mdl-layout__tab.is-active').trigger( "click" );
        executejs('componentHandler.upgradeDom();');
        fixIframeLink();
    }

    function iframeConfig(url, data){
        try{
            var settingsUI = '<ul class="demo-list-control mdl-list">\
            <div class="mdl-grid">';
            try{
              var malUrl = GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Mal' , null);
            }catch(e){
              var malUrl = null;
            }
            if(malUrl == url){
                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                                <div class="mdl-card__title mdl-card--border">\
                                    <h2 class="mdl-card__title-text">';
                                    if(data != null){
                                      settingsUI += data.split('itemprop="name">')[1].split('<')[0];
                                    }else{
                                      settingsUI += 'Not Found';
                                    }
                                    settingsUI +=
                                    '</h2>\
                                </div>\
                                  <div class="mdl-list__item">\
                                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                      <input class="mdl-textfield__input" type="number" step="1" id="malOffset" value="'+GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Offset' , '')+'">\
                                  <label class="mdl-textfield__label" for="malOffset">Episode Offset</label>\
                                  </div>\
                                </div>\
                                <div class="mdl-list__item" style="padding-bottom: 0;padding-top: 0;">\
                                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                    <input class="mdl-textfield__input" type="text" id="malUrlInput" value="'+malUrl+'">\
                                <label class="mdl-textfield__label" for="malUrlInput">MyAnimeList Url</label>\
                                </div>\
                              </div>\
                              \
                              <div class="mdl-list__item" style="padding-bottom: 0;padding-top: 0;">\
                              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                <label class="mdl-textfield__label" for="malSearch">\
                                  Search\
                                </label>\
                                  <input class="mdl-textfield__input" type="text" id="malSearch">\
                              </div>\
                              </div>\
                              <div class="mdl-list__item" style="min-height: 0; padding-bottom: 0; padding-top: 0;">\
                                <div class="malResults" id="malSearchResults"></div>\
                              </div>\
                              \
                              <div class="mdl-list__item">\
                                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="malSubmit">Update</button>\
                                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" id="malReset" style="margin-left: 5px;">Reset</button>\
                                </div>\
                              </div>';

            }
                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <div class="mdl-card__title mdl-card--border">\
                                <h2 class="mdl-card__title-text">General</h2>\
                                </div>';
                settingsUI += materialCheckbox(autoTracking,'autoTracking','Autotracking');
                settingsUI += '<li class="mdl-list__item">\
                                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                      <input class="mdl-textfield__input" type="number" step="1" id="malDelay" value="'+delay+'">\
                                  <label class="mdl-textfield__label" for="malDelay">Autotracking delay (Seconds)</label>\
                                  </div>\
                              </li>';
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <div class="mdl-card__title mdl-card--border">\
                                <h2 class="mdl-card__title-text">MAL Bookmark Page</h2>\
                                </div>';
                settingsUI += materialCheckbox(tagLinks,'tagLinks','Continue watching links');
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <div class="mdl-card__title mdl-card--border">\
                                <h2 class="mdl-card__title-text">Overview Page</h2>\
                                </div>';
                settingsUI += materialCheckbox(searchLinks,'searchLinks','Search links');
                settingsUI += materialCheckbox(kissanimeLinks,'kissanimeLinks','Kissanime links');
                settingsUI += materialCheckbox(masteraniLinks,'masteraniLinks','Masterani.me links');
                settingsUI += materialCheckbox(nineanimeLinks,'nineanimeLinks','9anime links');
                settingsUI += materialCheckbox(crunchyrollLinks,'crunchyrollLinks','Crunchyroll links');
                settingsUI += materialCheckbox(gogoanimeLinks,'gogoanimeLinks','Gogoanime links');
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                                <div class="mdl-card__title mdl-card--border">\
                                  <h2 class="mdl-card__title-text">miniMAL</h2>\
                                  <span style="margin-left: auto; color: #7f7f7f;">Shortcut: Ctrl + m</span>\
                                </div>';
                settingsUI += materialCheckbox(miniMALonMal,'miniMALonMal','Display on MyAnimeList');
                settingsUI += materialCheckbox(displayFloatButton,'displayFloatButton','Floating menu button');
                settingsUI += materialCheckbox(posLeft,'posLeft','Left-sided');
                settingsUI += '<li class="mdl-list__item" style="display: inline-block; width: 50%;">\
                                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                      <input class="mdl-textfield__input" type="text" step="1" id="miniMalHeight" value="'+miniMalHeight+'">\
                                  <label class="mdl-textfield__label" for="miniMalHeight">Height (px / %)</label>\
                                  </div>\
                              </li>';
                settingsUI += '<li class="mdl-list__item" style="display: inline-block; width: 50%;">\
                                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                      <input class="mdl-textfield__input" type="text" step="1" id="miniMalWidth" value="'+miniMalWidth+'">\
                                  <label class="mdl-textfield__label" for="miniMalWidth">Width (px / %)</label>\
                                  </div>\
                              </li>';
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp hoverinfoDeact">';
                settingsUI += materialCheckbox(episodeInfoBox,'episodeInfoBox','Episode Hoverinfo', true);
                settingsUI += '<div class="mdl-card__title mdl-card--border" style="padding: 0;"></div>';
                settingsUI += materialCheckbox(episodeInfoSynopsis,'episodeInfoSynopsis','Synopsis');
                settingsUI += materialCheckbox(episodeInfoImage,'episodeInfoImage','Image');
                settingsUI += materialCheckbox(episodeInfoSubtitle,'episodeInfoSubtitle','Subtitle');
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <div class="mdl-card__title mdl-card--border">\
                                <h2 class="mdl-card__title-text">ETC</h2>\
                                </div>';
                settingsUI += '<li class="mdl-list__item"><button type="button" id="clearCache" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Clear Cache</button></li>';
                settingsUI += '</div>';

            $("#info-iframe").contents().find('#malConfig').html(settingsUI);

            $("#info-iframe").contents().find("#malReset").click( function(){
                GM_deleteValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Mal' );
                flashm( "MyAnimeList url reset" , false);
                checkdata();
            });

            $("#info-iframe").contents().find("#malSubmit").click( function(){
                var murl = $("#info-iframe").contents().find("#malUrlInput").val();
                local_setValue($.normalUrl()+'#newCorrection', murl);
                flashm( "new url '"+murl+"' set." , false);
                checkdata();
            });

            $("#info-iframe").contents().find("#malDelay").on("input", function(){
                var tempDelay = $("#info-iframe").contents().find("#malDelay").val();
                if(tempDelay !== null){
                    if(tempDelay !== ''){
                        delay = tempDelay;
                        GM_setValue( 'delay', tempDelay );
                        flashm( "New delay ("+delay+") set." , false);
                    }else{
                        delay = 3;
                        GM_deleteValue( 'delay' );
                        flashm( "Delay reset" , false);
                    }
                }
            });

            $("#info-iframe").contents().find("#miniMalWidth").on("input", function(){
                var miniMalWidth = $("#info-iframe").contents().find("#miniMalWidth").val();
                if(miniMalWidth !== null){
                    if(miniMalWidth !== ''){
                        GM_setValue( 'miniMalWidth', miniMalWidth );
                        flashm( "New Width ("+miniMalWidth+") set." , false);
                    }else{
                        miniMalWidth = '30%';
                        GM_deleteValue( 'miniMalWidth' );
                        flashm( "Width reset" , false);
                    }
                }
                $("#modal-content").css('width', miniMalWidth);
            });

            $("#info-iframe").contents().find("#miniMalHeight").on("input", function(){
                var miniMalHeight = $("#info-iframe").contents().find("#miniMalHeight").val();
                if(miniMalHeight !== null){
                    if(miniMalHeight !== ''){
                        GM_setValue( 'miniMalHeight', miniMalHeight );
                        flashm( "New Height ("+miniMalHeight+") set." , false);
                    }else{
                        miniMalHeight = '90%';
                        GM_deleteValue( 'miniMalHeight' );
                        flashm( "Height reset" , false);
                    }
                }
                $("#modal-content").css('height', miniMalHeight);
            });

            $("#info-iframe").contents().find("#malOffset").on("input", function(){
                var Offset = $("#info-iframe").contents().find("#malOffset").val();
                if(Offset !== null){
                    if(Offset !== ''){
                        GM_setValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Offset', Offset );
                        flashm( "New Offset ("+Offset+") set." , false);
                    }else{
                        GM_deleteValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Offset' );
                        flashm( "Offset reset" , false);
                    }
                }
            });

            var timer;
            $("#info-iframe").contents().find("#malSearch").on("input", function(){
              clearTimeout(timer);
              timer = setTimeout(function(){
                searchMal( $("#info-iframe").contents().find("#malSearch").val(), listType, '.malResults', function(){
                  $("#info-iframe").contents().find("#malSearchResults .searchItem").unbind('click').click(function(event) {
                    $("#info-iframe").contents().find('#malUrlInput').val($(this).attr('malhref'));
                    $("#info-iframe").contents().find('#malSearch').val('');
                    $("#info-iframe").contents().find('#malSearchResults').html('');
                  });
                });
              }, 300);
            });

            $("#info-iframe").contents().find("#clearCache").click( function(){
                clearCache();
            });

            $("#info-iframe").contents().find('#autoTracking').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('autoTracking', 1);
                    autoTracking = 1;
                }else{
                    GM_setValue('autoTracking', 0);
                    autoTracking = 0;
                }
            });
            $("#info-iframe").contents().find('#tagLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('tagLinks', 1);
                    tagLinks = 1;
                }else{
                    GM_setValue('tagLinks', 0);
                    tagLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#searchLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('searchLinks', 1);
                    searchLinks = 1;
                }else{
                    GM_setValue('searchLinks', 0);
                    searchLinks = 0;
                }
            });

            $("#info-iframe").contents().find('#kissanimeLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('kissanimeLinks', 1);
                    kissanimeLinks = 1;
                }else{
                    GM_setValue('kissanimeLinks', 0);
                    kissanimeLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#masteraniLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('masteraniLinks', 1);
                    masteraniLinks = 1;
                }else{
                    GM_setValue('masteraniLinks', 0);
                    masteraniLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#nineanimeLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('nineanimeLinks', 1);
                    nineanimeLinks = 1;
                }else{
                    GM_setValue('nineanimeLinks', 0);
                    nineanimeLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#crunchyrollLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('crunchyrollLinks', 1);
                    crunchyrollLinks = 1;
                }else{
                    GM_setValue('crunchyrollLinks', 0);
                    crunchyrollLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#gogoanimeLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('gogoanimeLinks', 1);
                    gogoanimeLinks = 1;
                }else{
                    GM_setValue('gogoanimeLinks', 0);
                    gogoanimeLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#posLeft').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('posLeft', 1);
                    posLeft = 1;
                }else{
                    GM_setValue('posLeft', 0);
                    posLeft = 0;
                }
            });
            $("#info-iframe").contents().find('#displayFloatButton').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('displayFloatButton', 1);
                    displayFloatButton = 1;
                }else{
                    GM_setValue('displayFloatButton', 0);
                    displayFloatButton = 0;
                }
            });
            $("#info-iframe").contents().find('#episodeInfoBox').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('episodeInfoBox', 1);
                    episodeInfoBox = 1;
                }else{
                    GM_setValue('episodeInfoBox', 0);
                    episodeInfoBox = 0;
                }
            });
            $("#info-iframe").contents().find('#episodeInfoSynopsis').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('episodeInfoSynopsis', 1);
                    episodeInfoSynopsis = 1;
                }else{
                    GM_setValue('episodeInfoSynopsis', 0);
                    episodeInfoSynopsis = 0;
                }
            });
            $("#info-iframe").contents().find('#episodeInfoImage').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('episodeInfoImage', 1);
                    episodeInfoImage = 1;
                }else{
                    GM_setValue('episodeInfoImage', 0);
                    episodeInfoImage = 0;
                }
            });
            $("#info-iframe").contents().find('#episodeInfoSubtitle').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('episodeInfoSubtitle', 1);
                    episodeInfoSubtitle = 1;
                }else{
                    GM_setValue('episodeInfoSubtitle', 0);
                    episodeInfoSubtitle = 0;
                }
            });

            $("#info-iframe").contents().find('#miniMALonMal').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('miniMALonMal', 1);
                    miniMALonMal = 1;
                }else{
                    GM_setValue('miniMALonMal', 0);
                    miniMALonMal = 0;
                }
            });
            $("#info-iframe").contents().find('#malConfig').show();
        }catch(e) {console.log('[iframeConfig] Error:',e);}
    }

    function iframeOverview(url, data){
        $("#info-iframe").contents().find('#loadOverview').hide();
        try{
            var image = data.split('js-scrollfix-bottom')[1].split('<img src="')[1].split('"')[0];
            $("#info-iframe").contents().find('.malImage').attr("src",image).show();
            $("#info-iframe").contents().find('.coverinfo').show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var title = data.split('itemprop="name">')[1].split('<')[0];
            $("#info-iframe").contents().find('.malTitle').html(title).show();
            $("#info-iframe").contents().find('.coverinfo').show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            $("#info-iframe").contents().find('.malLink').attr('href',url).show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var description = data.split('itemprop="description">')[1].split('</span')[0];
            $("#info-iframe").contents().find('.malDescription').html('<p style="color: black;">'+description+'</p>').show();
            $("#info-iframe").contents().find('.coverinfo').show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var statsBlock = data.split('<h2>Statistics</h2>')[1].split('<h2>')[0];
            var html = $.parseHTML( statsBlock );
            var statsHtml = '<ul class="mdl-list mdl-grid mdl-grid--no-spacing mdl-cell mdl-cell--12-col" style="display: flex; justify-content: space-around;">';
            $.each($(html).filter('div').slice(0,5), function( index, value ) {
                statsHtml += '<li class="mdl-list__item mdl-list__item--two-line" style="padding: 0; padding-left: 10px; padding-right: 3px; min-width: 18%;">';
                    statsHtml += '<span class="mdl-list__item-primary-content">';
                        statsHtml += '<span>';
                            statsHtml += $(this).find('.dark_text').text();
                        statsHtml += '</span>';
                        statsHtml += '<span class="mdl-list__item-sub-title">';
                            statsHtml += $(this).find('span[itemprop=ratingValue]').height() != null ? $(this).find('span[itemprop=ratingValue]').text() : $(this).clone().children().remove().end().text();
                        statsHtml += '</span>';
                    statsHtml += '</span>';
                statsHtml += '</li>';
            });
            statsHtml += '</ul>';
            $("#info-iframe").contents().find('.stats-block').html(statsHtml).show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var altTitle = data.split('<h2>Alternative Titles</h2>')[1].split('<h2>')[0];
            altTitle = altTitle.replace(/spaceit_pad/g,'mdl-chip" style="margin-right: 5px;');
            $("#info-iframe").contents().find('.malAltTitle').html(altTitle);
            $("#info-iframe").contents().find('.malAltTitle .mdl-chip').contents().filter(function() {
                return this.nodeType == 3 && $.trim(this.textContent) != '';
            }).wrap('<span class="mdl-chip__text" />');
            $("#info-iframe").contents().find('.malAltTitle').show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var infoBlock = data.split('<h2>Information</h2>')[1].split('<h2>')[0];
            var html = $.parseHTML( infoBlock );
            var infoHtml = '<ul class="mdl-grid mdl-grid--no-spacing mdl-list mdl-cell mdl-cell--12-col">';
            $.each($(html).filter('div'), function( index, value ) {
                if((index + 4) % 4 == 0 && index != 0){
                    //infoHtml +='</ul><ul class="mdl-list mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet">';
                }
                infoHtml += '<li class="mdl-list__item mdl-list__item--three-line mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet">';
                    infoHtml += '<span class="mdl-list__item-primary-content">';
                        infoHtml += '<span>';
                            infoHtml += $(this).find('.dark_text').text();
                        infoHtml += '</span>';
                        infoHtml += '<span class="mdl-list__item-text-body">';
                            $(this).find('.dark_text').remove();
                            infoHtml += $(this).html();
                            //$(this).find('*').each(function(){infoHtml += $(this)[0].outerHTML});
                            //infoHtml += $(this).find('span[itemprop=ratingValue]').height() != null ? $(this).find('span[itemprop=ratingValue]').text() : $(this).clone().children().remove().end().text();
                        infoHtml += '</span>';
                    infoHtml += '</span>';
                infoHtml += '</li>';
            });
            infoHtml += '</ul>';
            $("#info-iframe").contents().find('.info-block').html(infoHtml).show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var relatedBlock = data.split('Related ')[1].split('</h2>')[1].split('<h2>')[0];
            var related = $.parseHTML( relatedBlock );
            var relatedHtml = '<ul class="mdl-list">';
            $.each($(related).filter('table').find('tr'), function( index, value ) {
                relatedHtml += '<li class="mdl-list__item mdl-list__item--two-line">';
                    relatedHtml += '<span class="mdl-list__item-primary-content">';
                        relatedHtml += '<span>';
                            relatedHtml += $(this).find('.borderClass').first().text();
                        relatedHtml += '</span>';
                        relatedHtml += '<span class="mdl-list__item-sub-title">';
                            relatedHtml += $(this).find('.borderClass').last().html();
                        relatedHtml += '</span>';
                    relatedHtml += '</span>';
                relatedHtml += '</li>';
            });
            relatedHtml += '</ul>';
            $("#info-iframe").contents().find('.related-block').html(relatedHtml).show();
            $("#info-iframe").contents().find('#material .related-block a').each(function() {
              $(this).click(function(e) {
                $("#info-iframe").contents().find('.malClear').hide();
                $("#info-iframe").contents().find('.mdl-progress__indeterminate').show();
                $("#info-iframe").contents().find("#backbutton").show();
                $("#info-iframe").contents().find('#SearchButton').css('margin-left', '-17px');
                $("#info-iframe").contents().find('#book').css('left', '40px');
                fillIframe($(this).attr('href'));
              }).attr('onclick','return false;');
            });
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            if( !(window.location.href.indexOf("myanimelist.net") > -1) ){
              var localListType = url.split('/')[3];
              var dataBlock = data.split('id="addtolist"')[1].split('<div id="myinfoDisplay"')[0];
              if (~data.indexOf("header-menu-login")){
                  dataBlock = "Please log in on <a target='_blank' href='https://myanimelist.net/login.php'>MyAnimeList!<a>";
              }else{
                  dataBlock = dataBlock.substring(dataBlock.indexOf(">") + 1);
              }
              $("#info-iframe").contents().find('.data-block').html(dataBlock).show();
              $("#info-iframe").contents().find('.data-block tr:not(:last-child)').each(function(){
                  var label = $(this).find('.spaceit').first().text();
                  //$(this).find('.spaceit').first().html('<span>'+label+'</span>');
                  $(this).replaceWith($('<li class="mdl-list__item mdl-list__item--three-line">\
                      <span class="mdl-list__item-primary-content">\
                          <span>'+label+'</span>\
                          <span class="mdl-list__item-text-body">'+$(this).find('.spaceit').last().html()+'</span>\
                      </span>\
                      \</li>'));
              });
              $("#info-iframe").contents().find('#myinfo_status,#myinfo_score').addClass('mdl-textfield__input').css('outline', 'none');
              $("#info-iframe").contents().find('#myinfo_watchedeps,#myinfo_chapters,#myinfo_volumes').addClass('mdl-textfield__input').css('width','35px').css('display','inline-block');
              $("#info-iframe").contents().find('.inputButton').addClass('mdl-button mdl-js-button mdl-button--raised mdl-button--colored').css('margin-right','5px');
              $("#info-iframe").contents().find('.data-block li').last().after('<li class="mdl-list__item">'+$("#info-iframe").contents().find('.inputButton').first().parent().html()+'</li>');
              $("#info-iframe").contents().find('.data-block tr').remove();
              $("#info-iframe").contents().find('.js-'+localListType+'-update-button, .js-'+localListType+'-add-button').click(function (){
                  var anime = {};
                  if(localListType == 'anime'){
                      anime['.add_anime[num_watched_episodes]'] = parseInt($("#info-iframe").contents().find('#myinfo_watchedeps').val() );
                      if(isNaN(anime['.add_anime[num_watched_episodes]'])){
                          anime['.add_anime[num_watched_episodes]'] = 0;
                      }
                  }else{
                      anime['.add_manga[num_read_volumes]'] = parseInt($("#info-iframe").contents().find('#myinfo_volumes').val() );
                      if(isNaN(anime['.add_manga[num_read_volumes]'])){
                          anime['.add_manga[num_read_volumes]'] = 0;
                      }
                      anime['.add_manga[num_read_chapters]'] = parseInt($("#info-iframe").contents().find('#myinfo_chapters').val() );
                      if(isNaN(anime['.add_manga[num_read_chapters]'])){
                          anime['.add_manga[num_read_chapters]'] = 0;
                      }
                  }
                  anime['.add_'+listType+'[score]'] = parseInt($("#info-iframe").contents().find('#myinfo_score').val() );
                  if(anime['.add_'+listType+'[score]'] == 0){
                      anime['.add_'+listType+'[score]'] = '';
                  }
                  anime['.add_'+listType+'[status]'] = parseInt($("#info-iframe").contents().find('#myinfo_status').val() );
                  if($.isOverviewPage()){
                    anime['forceUpdate'] = 2;
                  }
                  anime['malurl'] = url;

                  setanime(url, anime, null, localListType);
              });
            }
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            $("#info-iframe").contents().find('.stream-block-inner').html('');
            setKissToMal(url);
        }catch(e) {console.log('[iframeOverview] Error:',e);}
    }

    function iframeReview(url, data){
        $("#info-iframe").contents().find('#loadReviews').hide();
        try{
            var reviews = data.split('Reviews</h2>')[1].split('<h2>')[0];
            var html = $.parseHTML( reviews );
            var reviewsHtml = '<div class="mdl-grid">';
            $.each($(html).filter('.borderDark'), function( index, value ) {
                reviewsHtml += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">';
                    reviewsHtml += '<div class="mdl-card__supporting-text mdl-card--border" style="color: black;">';
                        $(this).find('.spaceit > div').css('max-width','60%');
                        reviewsHtml += $(this).find('.spaceit').first().html();
                    reviewsHtml += '</div>';

                    reviewsHtml += '<div class="mdl-card__supporting-text" style="color: black;">';
                        $(this).find('.textReadability, .textReadability > span').contents().filter(function(){
                            return this.nodeType == 3 && $.trim(this.nodeValue).length;
                        }).wrap('<p style="margin:0;padding=0;"/>');
                        $(this).find('br').css('line-height','10px');
                        reviewsHtml += $(this).find('.textReadability').html();
                    reviewsHtml += '</div>';
                reviewsHtml += '</div>';
            });
            reviewsHtml += '</div>';
            if(reviewsHtml == '<div class="mdl-grid"></div>'){
                reviewsHtml = '<span class="mdl-chip" style="margin: auto; margin-top: 16px; display: table;"><span class="mdl-chip__text">Nothing Found</span></span>';
            }
            $("#info-iframe").contents().find('#malReviews').html(reviewsHtml).show();
            $("#info-iframe").contents().find('.js-toggle-review-button').addClass('nojs').click(function(){
                var revID = $(this).attr('data-id');
                $("#info-iframe").contents().find('#review'+revID).css('display','initial');
                $("#info-iframe").contents().find('#revhelp_output_'+revID).remove();
                $(this).remove();
            });
            $("#info-iframe").contents().find('.mb8 a').addClass('nojs').click(function(){
                var revID = $(this).attr('onclick').split("$('")[1].split("'")[0];
                $("#info-iframe").contents().find(revID).toggle();
            });
        }catch(e) {console.log('[iframeReview] Error:',e);}
    }

    function iframeEpisode(url, data){
        getAjaxData(url+'/episode', function(data){
            try{
                $("#info-iframe").contents().find('#loadEpisode').hide();
                var episodesBlock = data.split('mt8 episode_list js-watch-episode-list ascend">')[1].split('</table>')[0];
                var episodesHtml = '<div class="mdl-grid">\
                        <div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">'+episodesBlock+'</table>\
                        </div>\
                    </div>';
                $("#info-iframe").contents().find('#malEpisodes').html(episodesHtml).show();
                $("#info-iframe").contents().find('#malEpisodes .episode-video, #malEpisodes .episode-forum').remove();
            }catch(e) {console.log('[iframeEpisode] Error:',e);}
        });

    }

    function iframeRecommendations(url, data){
        getAjaxData(url+'/userrecs', function(data){
            try{
                $("#info-iframe").contents().find('#loadRecommendations').hide();
                var recommendationsBlock = data.split('Make a recommendation</a>')[1].split('</h2>')[1].split('<div class="mauto')[0];
                var html = $.parseHTML( recommendationsBlock );
                var recommendationsHtml = '<div class="mdl-grid">';
                $.each($(html).filter('.borderClass'), function( index, value ) {
                    recommendationsHtml += '<div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-shadow--4dp mdl-grid">';
                        recommendationsHtml += '<div class="mdl-card__media" style="background-color: transparent; margin: 8px;">';
                            recommendationsHtml += $(this).find('.picSurround').html();
                        recommendationsHtml += '</div>';
                        recommendationsHtml += '<div class="mdl-cell" style="flex-grow: 100;">';
                            recommendationsHtml += '<div class="">';
                                $(this).find('.button_edit, .button_add, td:eq(1) > div:eq(1) span').remove();
                                recommendationsHtml += $(this).find('td:eq(1) > div:eq(1)').html();
                            recommendationsHtml += '</div>';
                            recommendationsHtml += '<div class="">';
                                $(this).find('a[href^="/dbchanges.php?go=report"]').remove();
                                recommendationsHtml += $(this).find('.borderClass').html();
                            recommendationsHtml += '</div>';
                            recommendationsHtml += '<div class="">';
                                recommendationsHtml += (typeof $(this).find('.spaceit').html() != 'undefined') ? $(this).find('.spaceit').html() : '';
                                recommendationsHtml += '<div class="more" style="display: none;">';
                                    recommendationsHtml += $(this).find('td:eq(1) > div').last().html();
                                recommendationsHtml += '</div>';
                            recommendationsHtml += '</div>';
                        recommendationsHtml += '</div>';
                        /*recommendationsHtml += '<div class="mdl-card__supporting-text mdl-card--border" style="color: black;">';
                            $(this).find('.spaceit > div').css('max-width','60%');
                            recommendationsHtml += $(this).find('.spaceit').first().html();
                        recommendationsHtml += '</div>';
                        recommendationsHtml += '<div class="mdl-card__supporting-text" style="color: black;">';
                            $(this).find('.textReadability, .textReadability > span').contents().filter(function(){
                                return this.nodeType == 3 && $.trim(this.nodeValue).length;
                            }).wrap('<p style="margin:0;padding=0;"/>');
                            $(this).find('br').css('line-height','10px');
                            recommendationsHtml += $(this).find('.textReadability').html();
                        recommendationsHtml += '</div>';*/
                        //recommendationsHtml += $(this).html();
                    recommendationsHtml += '</div>';
                });
                recommendationsHtml += '</div>';

                if(recommendationsHtml == '<div class="mdl-grid"></div>'){
                    recommendationsHtml = '<span class="mdl-chip" style="margin: auto; margin-top: 16px; display: table;"><span class="mdl-chip__text">Nothing Found</span></span>';
                }
                $("#info-iframe").contents().find('#malRecommendations').html(recommendationsHtml).show();
                $("#info-iframe").contents().find('.js-similar-recommendations-button').addClass('nojs').click(function(){$(this).parent().find('.more').toggle();});
                $("#info-iframe").contents().find('.js-toggle-recommendation-button').addClass('nojs').click(function(){
                    var revID = $(this).attr('data-id');
                    $("#info-iframe").contents().find('#recommend'+revID).css('display','initial');
                    $(this).remove();
                });
                fixIframeLink();
                $("#info-iframe").contents().find('#malRecommendations a[href^="https://myanimelist.net/anime/"],#malRecommendations a[href^="https://myanimelist.net/manga/"]').each(function() {
                    $(this).click(function(e) {
                        $("#info-iframe").contents().find('.malClear').hide();
                        $("#info-iframe").contents().find('.mdl-progress__indeterminate').show();
                        $("#info-iframe").contents().find("#backbutton").show();
                        $("#info-iframe").contents().find('#SearchButton').css('margin-left', '-17px');
                        $("#info-iframe").contents().find('#book').css('left', '40px');
                        $("#info-iframe").contents().find('.mdl-layout__tab:eq(0) span').trigger( "click" );
                        fillIframe($(this).attr('href'));
                    }).attr('onclick','return false;');
                });
                $("#info-iframe").contents().find('#malRecommendations .more .borderClass').addClass('mdl-shadow--2dp').css('padding','10px');
                $("#info-iframe").contents().find('.lazyload').each(function() { $(this).attr('src', $(this).attr('data-src'));});//TODO: use lazyloading
            }catch(e) {console.log('[iframeRecommendations] Error:',e);}
        });

    }

    function executejs(string){
        var rawframe = document.getElementById('info-iframe');
        var framedoc = rawframe.contentDocument;
        if (!framedoc && rawframe.contentWindow) {
            framedoc = rawframe.contentWindow.document;
        }
        var script = document.createElement('script');
        script.type = "text/javascript";
        //script.src = "https://code.getmdl.io/1.3.0/material.min.js";
        script.text  = string;
        framedoc.body.appendChild(script);
    }

    function materialCheckbox(option, string, text, header = false){
        var check = '';
        var sty = '';
        if(option == 1) check = 'checked';
        if(header) sty = 'font-size: 24px; font-weight: 300; line-height: normal;';
        var item =  '<li class="mdl-list__item">\
                        <span class="mdl-list__item-primary-content" style="'+sty+'">\
                            '+text+'\
                        </span>\
                        <span class="mdl-list__item-secondary-action">\
                            <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="'+string+'">\
                                <input type="checkbox" id="'+string+'" class="mdl-switch__input" '+check+' />\
                            </label>\
                        </span>\
                    </li>';
        return item;
    }

    function getAjaxData(url, callback){
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: false,
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            onload: function(response) {
                callback(response.responseText);
            }
        });
    }

    function fixIframeLink(){
        $("#info-iframe").contents().find('#material a').not('[href^="http"],[href^="https"],[href^="mailto:"],[href^="#"],[href^="javascript"]').each(function() {
            $(this).attr('href', function(index, value) {
                if (value.substr(0,1) !== "/") {
                    value = window.location.pathname + value;
                }
                return "https://myanimelist.net" + value;
            });
        });
        $("#info-iframe").contents().find('a').not(".nojs").attr('target','_blank');
    }

    function searchMal(keyword, type = 'all', selector, callback){
        $("#info-iframe").contents().find(selector).html('');
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://myanimelist.net/search/prefix.json?type='+type+'&keyword='+keyword+'&v=1',
            synchronous: false,
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            onload: function(response) {
                var searchResults = $.parseJSON(response.response);
                $("#info-iframe").contents().find(selector).append('<div class="mdl-grid"></div>');
                $.each(searchResults, function() {
                    $.each(this, function() {
                        $.each(this, function() {
                            $.each(this, function() {
                                if(typeof this['name'] != 'undefined'){
                                    $("#info-iframe").contents().find(selector+' > div').append('<div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-shadow--2dp mdl-grid searchItem" malhref="'+this['url']+'" style="cursor: pointer;">\
                                        <img src="'+this['thumbnail_url']+'" style=""></img>\
                                        <div style="flex-grow: 100; cursor: pointer; margin-top: 0; margin-bottom: 0;" class="mdl-cell">\
                                          <span style="font-size: 20px; font-weight: 400; line-height: 1;">'+this['name']+'</span>\
                                          <p style="margin-bottom: 0;">'+this['payload']['score']+'</p>\
                                          <p style="margin-bottom: 0;">'+this['payload']['start_year']+'</p>\
                                        </div>\
                                      </div>');
                                }
                            });
                        });
                    });
                });
                callback();
            }
        });
    }

    function iframeBookmarks(element){
        element.html('<div id="loadRecommendations" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>');
        executejs('componentHandler.upgradeDom();');

        getMalXml("", function(bookXML){
          var bookmarkHtml = '<div class="mdl-grid" style="justify-content: center;">';
          bookXML.find('my_status:contains(1)').parent().each(function(){
            var malUrl = 'https://myanimelist.net/anime/'+$(this).find('series_animedb_id').first().text()+'/'+$(this).find('series_title').first().text();
            var progressProcent = ( $(this).find('my_watched_episodes').first().text() / $(this).find('series_episodes').first().text() ) * 100;
            bookmarkHtml +='<div class="mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone mdl-shadow--2dp mdl-grid bookEntry" malhref="'+malUrl+'" style="cursor: pointer; height: 250px; padding: 0; width: 210px; height: 293px;">';
              bookmarkHtml +='<div class="data title" style="background-image: url('+$(this).find('series_image').first().text()+'); background-size: cover; background-position: center center; background-repeat: no-repeat; width: 100%; position: relative; padding-top: 5px;">';
                bookmarkHtml +='<span class="mdl-shadow--2dp" style="position: absolute; bottom: 0; display: block; background-color: rgba(255, 255, 255, 0.9); padding-top: 5px; display: inline-flex; align-items: center; justify-content: space-between; left: 0; right: 0; padding-right: 8px; padding-left: 8px; padding-bottom: 8px;">'+$(this).find('series_title').first().text();
                  bookmarkHtml +='<div id="p1" class="mdl-progress" style="position: absolute; top: -4px; left: 0;"><div class="progressbar bar bar1" style="width: '+progressProcent+'%;"></div><div class="bufferbar bar bar2" style="width: 100%;"></div><div class="auxbar bar bar3" style="width: 0%;"></div></div>';
                  bookmarkHtml +='<div class="data progress mdl-chip mdl-chip--contact mdl-color--indigo-100" style="float: right; line-height: 20px; height: 20px; padding-right: 4px; margin-left: 5px;">';
                    bookmarkHtml +='<div class="link mdl-chip__contact mdl-color--primary mdl-color-text--white" style="line-height: 20px; height: 20px; margin-right: 0;">'+$(this).find('my_watched_episodes').first().text()+'</div>';
                  bookmarkHtml +='</div>';
                bookmarkHtml +='</span>';
                bookmarkHtml +='<div class="tags" style="display: none;">'+$(this).find('my_tags').first().text()+'</div>';
              bookmarkHtml +='</div>';
            bookmarkHtml +='</div>';
          });

          //flexbox placeholder
          for(var i=0; i < 10; i++){
              bookmarkHtml +='<div class="mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone mdl-shadow--2dp mdl-grid "  style="cursor: pointer; height: 250px; padding: 0; width: 210px; height: 0px; margin-top:0; margin-bottom:0; visibility: hidden;"></div>';
          }

          bookmarkHtml += '</div>'
          element.html( bookmarkHtml );

          $("#info-iframe").contents().find('.bookEntry').each(function() {
            if($(this).find('.tags').text().indexOf("last::") > -1 ){
              var url = atobURL( $(this).find('.tags').text().split("last::")[1].split("::")[0] );
              setStreamLinks(url, $(this));
            }
          });

          $("#info-iframe").contents().find("#malSearchPop .bookEntry").unbind('click').click(function(event) {
            $("#info-iframe").contents().find('#book').click();
            $("#info-iframe").contents().find('.malClear').hide();
            $("#info-iframe").contents().find('.mdl-progress__indeterminate').show();
            $("#info-iframe").contents().find("#backbutton").show();
            $("#info-iframe").contents().find('#SearchButton').css('margin-left', '-17px');
            $("#info-iframe").contents().find('#book').css('left', '40px');
            $("#info-iframe").contents().find('.mdl-layout__tab:eq(0) span').trigger( "click" );
            fillIframe($(this).attr('malhref'));
          });

        });
    }
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
            var flashpos = $('body');
            flashpos.prepend('<div id="flash-div" style="text-align: center;position: fixed;bottom:10px;width:100%;z-index: 100000;left: 0;"><div id="flash" style="display:none;  background-color: red;padding: 20px; margin: 0 auto;max-width: 60%;          -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 20px;background:rgba(227,0,0,0.6);                       "></div></div>');
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
})();

/**
 * External Script
 * author Remy Sharp
 * url http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 */
(function ($) {
    function getViewportHeight() {
        var height = window.innerHeight; // Safari, Opera
        var mode = document.compatMode;

        if ( (mode || !$.support.boxModel) ) { // IE, Gecko
            height = (mode == 'CSS1Compat') ?
            document.documentElement.clientHeight : // Standards
            document.body.clientHeight; // Quirks
        }

        return height;
    }

    $(window).scroll(function () {
        var vpH = getViewportHeight() + 500,
            scrolltop = (document.documentElement.scrollTop ?
                document.documentElement.scrollTop :
                document.body.scrollTop),
            elems = [];
        
        $.each($.cache, function () {
            if (this.events && this.events.inview) {
                elems.push(this.handle.elem);
            }
        });

        if (elems.length) {
            $(elems).each(function () {
                if ($(this).css("display") != "none") {
                    var $el = $(this),
                        top = $el.offset().top,
                        height = $el.height(),
                        inview = $el.data('inview') || false;

                    if (scrolltop > (top + height) || scrolltop + vpH < top) {
                        if (inview) {
                            $el.data('inview', false);
                            $el.trigger('inview', [ false ]);                        
                        }
                    } else if (scrolltop < (top + height)) {
                        if (!inview) {
                            $el.data('inview', true);
                            $el.trigger('inview', [ true ]);
                        }
                    }
                }
            });
        }
    });
    
    $(function () {
        $(window).scroll();
    });
})(jQuery);
