    function handleanime(anime){
        $('.MalLogin').css("display","initial");
        $('#AddMalDiv').remove();

        $(".open-info-popup").unbind('click').show().click( function(){
            if($('#info-popup').css('display') == 'none'){
                document.getElementById('info-popup').style.display = "block";
                fillIframe(anime['malurl'], currentMalData);
                $('.floatbutton').fadeOut();
            }else{
                document.getElementById('info-popup').style.display = "none";
                $('.floatbutton').fadeIn();
            }
        });

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
        var addition = "last::"+update+"::";
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
            if(current['.add_anime[status]'] !== 2 && parseInt(anime['.add_anime[num_watched_episodes]']) === current['totalEp']){
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
            if(current['.add_manga[status]'] !== 2 && parseInt(anime['.add_manga[num_read_chapters]']) === current['totalChap']){
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
