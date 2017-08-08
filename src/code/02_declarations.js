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
        con = console;
      }
    });
    console.log('%cKissAnimeList', element);

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

    var displayFloatButton = GM_getValue( 'displayFloatButton', 1 );

    var currentMalData = null;

    var curVersion = GM_info.script.version;
    if(curVersion != GM_getValue( 'Version', null ) && GM_getValue( 'Version', null ) != null){
        switch(curVersion) {
            case '0.86.4':
                alert('Kissanimelist (v0.86)\n- 9anime Support\n- Link to last streaming page on Myanimelist\'s Animelist (Tags have to be activated)');
                break;
            case '0.86.5':
                alert('Kissanimelist (v0.86.5)\n- add config Page (Can be found in Mal profile settings)');
                break;
            case '0.87.1':
                alert('Kissanimelist (v0.87.1)\n- Materialize UI\n- Add miniMAL popup');
                break;
            case '0.87.3':
                alert('Kissanimelist (v0.87.3)\n- Crunchyroll Support (Video page only)\n- Added MAL classic bookmark support\n- Added next episode links in MAL bookmarks');
                break;
        }
    }
    GM_setValue( 'Version', curVersion );

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
            return url.split("/")[4];
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
            return url.split("/")[4];
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
            return url.split("/")[5].replace(/^\d+[-]?/, '');
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
    }else if( window.location.href.indexOf("9anime.to") > -1 ){
        //#########9anime#########
        var domain = 'https://9anime.to';
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
            return url.split("/")[4].replace(/.[^\.]*$/, '');
        };

        $.EpisodePartToEpisode = function(string) {
            return string;
        };

        $.fn.uiPos = function() {
            this.prependTo($("#info").first());
        };
        $.fn.uiWrongPos = function() {
            this.css('font-size','14px').appendTo($(".title").first());
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
            this.css("border-style","none");
        };
        $.fn.epListActive = function() {
            this.css("border-color","#002966").css("border-width","2px").css("border-style","solid");
        };

        $.bookmarkEntrySelector = function() {
            return $(".trAnime");
        };

        $.nextEpLink = function(url) {
            return 'https://9anime.to'+$("#servers .episodes a.active").parent('li').next().find('a').attr('href');
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
                checkdata();
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
                //console.log(script);
                return encodeURIComponent(script);
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
        return title.toLowerCase().split('#')[0];
    };

    //ignore loading
    if(document.title == "Please wait 5 seconds..."){
        con.log("loading");
        return;
    }

