    function handleanime(anime){
        $('.MalLogin').css("display","initial");
        $('#AddMalDiv').remove();

        miniMalButton(anime['malurl']);

        if(GM_getValue( K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(K.urlAnimeIdent(K.normalUrl())))+'/image' , null) == null ){
            try{
                GM_setValue( K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(K.urlAnimeIdent(K.normalUrl())))+'/image', K.imageCache('') );
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
        if(K.isOverviewPage()){
            $("#flash").attr("anime", anime['.'+K.listType+'_id']);
            $("#malRating").attr("href", anime['malurl']);
            if(isNaN(anime['.add_'+K.listType+'[status]'])){
                $('.MalLogin').css("display","none");
                $("#malRating").after("<span id='AddMalDiv'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' id='AddMal' onclick='return false;'>Add to MAL</a></span>")
                $('#AddMal').click(function() {
                    var anime = {};
                    anime['.add_'+K.listType+'[status]'] = 6;
                    anime['forceUpdate'] = 1;
                    setanime(K.normalUrl(),anime);
                });
            }else{
                $("#malTotal").text(anime['totalEp']);
                if(anime['totalEp'] == 0){
                   $("#malTotal").text('?');
                }
                if(anime['forceUpdate'] != 2){
                    $("#malStatus").val(anime['.add_'+K.listType+'[status]']);
                    $("#malEpisodes").val(anime['.add_anime[num_watched_episodes]']);
                    $("#malUserRating").val(anime['.add_'+K.listType+'[score]']);

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
            K.episodeListSelector().each(function( index ) {
                if(K.listType == 'anime'){
                    if(debug){
                        $(this).after('  Episode: '+urlToEpisode(K.episodeListElementHref($(this))));
                    }
                    try{
                        episodelink = urlToEpisode(K.episodeListElementHref($(this)));
                    }catch(e) {
                        episodelink = 1;
                    }
                    K.epListReset($(this));
                    if(episodelink == parseInt(anime['.add_anime[num_watched_episodes]'])){
                        K.epListActive($(this));
                        if(typeof K.episodeListElementHref(K.episodeListNextElement($(this), index)) !== "undefined"){
                            truelink = '<a style="color: white;" href="'+K.episodeListElementHref(K.episodeListNextElement($(this), index))+'">'+K.episodeListElementTitle(K.episodeListNextElement($(this), index))+'</a>';
                        }
                    }
                }else{
                    if(debug){
                        $(this).after('   Chapter: '+urlToChapter(K.episodeListElementHref($(this))));
                        $(this).after('Volume: '+urlToVolume(K.episodeListElementHref($(this))));
                    }
                    episodelink = urlToChapter(K.episodeListElementHref($(this)));
                    K.epListReset($(this));
                    if($(this).attr('href') == commentToUrl(anime['.add_manga[comments]'])){
                        $(this).parent().parent().css("background-color","#861515");
                        linkbackup = '<a style="color: red;" href="'+K.episodeListElementHref(K.episodeListNextElement($(this), index))+'">'+K.episodeListElementTitle(K.episodeListNextElement($(this), index))+'</a>';
                        $(this).prepend('<span class="lastOpen">[Last opened]</span>');
                    }
                    if(episodelink == parseInt(anime['.add_manga[num_read_chapters]']) && parseInt(anime['.add_manga[num_read_chapters]']) != 0){
                        K.epListActive($(this));
                        truelink = '<a style="color: white;" href="'+K.episodeListElementHref(K.episodeListNextElement($(this), index))+'">'+K.episodeListElementTitle(K.episodeListNextElement($(this), index))+'</a>';
                    }
                }
            });
            truelink = K.handleNextLink(truelink, anime);
            if(K.listType == 'anime'){
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
            if(K.listType == 'anime'){
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
            }
            animechange['checkIncrease'] = 1;
            setTimeout(function() {
                setanime( K.normalUrl(),animechange);
            }, delay * 1000);
        }
    }

    function urlToEpisode(url){
        var string = K.urlEpisodePart(url);
        string = K.EpisodePartToEpisode(string);
        var Offset = GM_getValue(K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(K.urlAnimeIdent(url)))+'/Offset' , null);
        if( Offset != null){
            string = parseInt(string)+parseInt(Offset);
        }
        if(parseInt(string) == 0){
            string = 1;
        }
        return parseInt(string);
    }

    function urlToChapter(url){
        return urlToEpisode(url);
    }

    function urlToVolume(url){
        var string = K.urlVolumePart(url);
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
        if(K.listType == 'anime'){
            GM_setValue( update+'/next', nextEp);
        }else{
            GM_setValue( update+'/next', 'manga');
        }

        GM_setValue( update+'/nextEp', K.nextEpLink(update));
        return current;
    }

    function handleanimeupdate( anime, current){
        if(K.listType == 'anime'){
            if(anime['checkIncrease'] === 1){
                anime['.add_anime[tags]'] = handleTag(K.urlAnimeIdent(window.location.href), current['.add_anime[tags]'], anime['.add_anime[num_watched_episodes]']+1);
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
                anime['.add_manga[tags]'] = handleTag(K.urlAnimeIdent(window.location.href), current['.add_manga[tags]'], anime['.add_manga[num_read_chapters]']+1);
                if(current['.add_manga[num_read_chapters]'] >= anime['.add_manga[num_read_chapters]']){
                    if((anime['.add_manga[status]'] === 2 || current['.add_manga[status]'] === 2) && anime['.add_manga[num_read_chapters]'] === 1){
                        if (confirm('Reread Manga?')) {
                            anime['.add_manga[is_rereading]'] = 1;
                        }else{
                            return null;
                        }
                    }else{
                        return null;
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
        var requestUrl = url
        var id = requestUrl.split('/')[4];
        if(requestUrl.split('/')[3].toLowerCase() == 'anime'){
            requestUrl = 'https://myanimelist.net/includes/ajax.inc.php?t=64&id='+id;
        }else{
            requestUrl = 'https://myanimelist.net/includes/ajax.inc.php?t=65&id='+id;
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: requestUrl,
            synchronous: false,
            onload: function(response) {
                var data = response.responseText;
                //currentMalData = data;
                var rating = data.split('Score:</span>')[1].split('<')[0];
                $("#malRating").attr("href", url).text(rating);
                if($('#info-popup').css('display') == 'block' && $("#info-iframe").contents().find('#backbutton').css('display') == 'none'){
                    fillIframe(url, currentMalData);
                }
            }
        });
    }
