    function firefoxUrl(url, html){
        if(html.indexOf('property="og:url"') > -1){
            url = html.split('<meta property="og:url"')[1].split('content="')[1].split('"')[0];
        }
        return url;
    }

    function staticUrl(title){
        switch(title) {
            case 'Blood': return 'https://myanimelist.net/anime/150/Blood_';
            case 'K': return 'https://myanimelist.net/anime/14467/K';
            case 'Morita-san-wa-Mukuchi': return 'https://myanimelist.net/anime/10671/Morita-san_wa_Mukuchi';
            default:  return null;
        }
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
                    url: 'https://kissanimelist.firebaseio.com/Request/'+dbSelector+'Request.json',
                    method: "POST",
                    data: JSON.stringify(param),
                    onload: function () {
                        con.log("Send to database: ",param);
                    },
                    onerror: function(error) {
                        con.log("Send to database: ",error);
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
        con.log("Flash Message: ",text);
        if(permanent){
            if(error === true){
                var colorF = "#3e0808";
            }else{
                var colorF = "#323232";
            }
            $('#flash-div').append('<div class="flashPerm" style="display:none;"><div style="display:table; pointer-events: all; background-color: red;padding: 14px 24px 14px 24px; margin: 0 auto; margin-top: -2px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:'+colorF+'; ">'+text+'</div></div>');
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
                $('#flash-div').append('<div class="flashinfo" style="display:none; max-height: 5000px;"><div style="display:table; pointer-events: all; background-color: red;padding: 14px 24px 14px 24px; margin: 0 auto; margin-top: -2px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:'+colorF+'; ">'+text+'</div></div>');
                $('.flashinfo').delay(2000).slideDown(800).delay(6000).queue(function() { $(this).css('max-height', '8px'); });
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
                $('.flash').slideDown(800).delay(4000).slideUp(800, function() { $(this).remove(); });
            }
        }
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
        con.log("Title: ",title);

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
        con.log("Formated: ",title);
        return title;
    }

    function episodeInfo(episode, malUrl, message = ''){
        message = '';
        if(episodeInfoBox){
            con.log('Episode Info',malUrl+'/episode/'+episode);
            GM_xmlhttpRequest({
                url: malUrl+'/episode/'+episode,
                method: "GET",
                onload: function (response) {
                    if(response.response != null){
                        if(message != ''){
                            message = "<div style='white-space: nowrap; margin-left: 15px;'> "+ message +"</div>";
                        }
                        var data = response.response;
                        var synopsis = '';
                        var epTitle = '';
                        var epSubTitle = '';
                        var imgUrl = "";
                        try{
                            epTitle = data.split('class="fs18 lh11"')[1].split('</h2>')[0].split('</span>')[1];
                        }catch(e){}

                        try{
                            epSubTitle = data.split('<p class="fn-grey2"')[1].split('</p>')[0].split('>')[1].replace(/^\s+/g, "");
                        }catch(e){}

                        try{
                            synopsis = data.split('Synopsis</h2>')[1].split('</div>')[0].replace(/^\s+/g, "");
                        }catch(e){}

                        try{
                            imgUrl = data.split('"isCurrent":true')[0].split('{').slice(-1)[0].split('"thumbnail":"')[1].split('"')[0].replace(/\\\//g, '/');
                        }catch(e){}

                        var imgHtml = '';
                        if(imgUrl != ''){
                            imgHtml = '<img style = "margin-top: 15px; height: 100px;" src="'+imgUrl+'"/>';
                        }
                        var synopsisHtml = '<div style="display: none; text-align: left; border: 1px solid; margin-top: 15px; padding: 8px; max-width: 500px;" class="synopsis">'+synopsis+'</div>';

                        if(epTitle != ''){
                            flashm ( '<div class="flasm-hover" style="/*display: flex;*/ align-items: center;"><div style="white-space: nowrap;"">#'+episode+" - "+epTitle+"<br> <small>"+epSubTitle+'</small><br>' + imgHtml + "</div>"+ message +" </div>" + synopsisHtml, false, true);
                        }
                    }
                },
                onerror: function(error) {
                    con.log("error: "+error);
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
    }
