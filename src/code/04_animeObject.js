    function getanime(thisUrl , callback, absolute = false, localListType = listType) {
        var thisUrl = thisUrl;
        var url = '';
        var malurl = '';
        var title = $.urlAnimeTitle(thisUrl);
        if(absolute === false){
            //url = "http://myanimelist.net/anime.php?q=" + encodeURI(formattitle(title));
            //url = "http://www.google.com/search?btnI&q=site:myanimelist.net/Anime/+-site:myanimelist.net/Anime/genre/+-site:myanimelist.net/anime/season/+"+encodeURI(formattitle(title));
            url = 'https://kissanimelist.firebaseio.com/Prototyp/'+dbSelector+'/'+encodeURIComponent($.titleToDbKey($.urlAnimeTitle(thisUrl))).toLowerCase()+'/Mal.json';
            if(GM_getValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(thisUrl))+'/Mal' , null) !== null ){
                //if(con != console){
                    url = GM_getValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle(thisUrl))+'/Mal' , null);
                //}
                con.log('local Found', url);
            }

            if(staticUrl(formattitle(title)) !== null){
                url = staticUrl(formattitle(title));
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
            con.log("Mal: ", url);
            if(googleover === 0){
                local_setValue( thisUrl, url );
            }
            malurl = url;
            url = 'https://myanimelist.net/ownlist/'+localListType+'/'+url.split('/')[4]+'/edit?hideLayout';//TODOsplit4 ersetzten
        }
        con.log("url",url);

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
                        con.log("Mal: ",url);
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
                            con.log("MalEdit: ",url);
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
            //con.log(data);
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
            con.log(anime);
            return anime;
        }else{
            //con.log(data);
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
            con.log(anime);
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
                if (!confirm('Add "'+actual['name']+'" to MAL?')) {
                    if(change['checkIncrease'] == 1){
                        episodeInfo(change['.add_anime[num_watched_episodes]'], actual['malurl']);
                    }
                    return;
                }
            }
        }else{
            var url = "https://myanimelist.net/panel.php?go=editmanga&id="+actual['.manga_id'];
            if(actual['addmanga'] === 1){
                url = "https://myanimelist.net/ownlist/manga/add?selected_manga_id="+actual['.manga_id'];
                if (!confirm('Add "'+actual['name']+'" to MAL?')) {
                    return;
                }
            }
        }

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
                                message += '<br><button class="undoButton" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px;">Undo</button>';
                                flashm( message , false);
                                $('.undoButton').click(function(){
                                    undoAnime['checkIncrease'] = 0;
                                    setanime(thisUrl, undoAnime, null, localListType);
                                });
                                episodeInfo(change['.add_anime[num_watched_episodes]'], actual['malurl'], message);
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
                                message += '<br><button class="undoButton" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px;">Undo</button>';
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
