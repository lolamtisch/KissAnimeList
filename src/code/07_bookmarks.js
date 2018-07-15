    var xml ="";
    var foundAnime = [];

    //var imageBackup = "Mal-img";
    var image = "image";

    function getMalXml(user = "", callback = null){
        var url = "https://myanimelist.net/editprofile.php?go=privacy";
        if(user !== ""){
            url = "https://myanimelist.net/malappinfo.php?u="+user+"&status=all&type="+K.listType;
            con.log("XML Url:", url);
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: false,
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
        var xmlAnime = xml.find('series_'+K.listType+'db_id:contains('+id+')').parent();

        getdata(baseurl, function(value) { setimage(value, xmlAnime, target, baseurl); }, image);

        if(xmlAnime.length === 0){
            if(id == 'Not-Found'){
                target.find(".MalData").first().append("No Mal");
            }else{
                target.find(".MalData").first().append("<a href='#' onclick='return false;'>Add to Mal</a>").find("a").click(function() {
                    var anime = {};
                    anime['.add_'+K.listType+'[status]'] = 6;
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
        target.find(".MalData").first().append('<div class="malEpisode"><input class="input" type="number" min="0" max="'+totalEp+'" value="'+episode+'" size="1" maxlength="4" style="display: none;background: transparent; border-width: 1px; border-color: grey; text-align: right; color: '+K.textColor+'; text-decoration: none; outline: medium none; max-width: 50px;"/><span class="normal">'+episode+'</span> / '+totalEp+'</div>');

        target.find(".MalData").first().find('.malEpisode').click(
          function() {
            $( this ).find('.input').css('display', 'initial');
            $( this ).find('.normal').css('display', 'none');
          }).change(function() {
            var anime = {};
            anime['.add_'+K.listType+'[num_'+middleVerb+'_'+middleType+']'] = $(this).parent().find('.malEpisode').find('.input').val();
            anime['.add_'+K.listType+'[status]'] = $(this).parent().find('.malStatus').val();
            anime['.add_'+K.listType+'[score]'] = $(this).parent().find('.malUserRating').val();
            setanime(baseurl,anime);
          });
    }

    function setstatus(value, target, baseurl){
        if(target.find(".malStatus").first().height() === null){
            var ui = "";
            ui += '<select class="malStatus" style="width: 100%; font-size: 12px; background: transparent; border-width: 0px; border-color: grey; color: '+K.textColor+'; text-decoration: none; outline: medium none;">';
            //ui += '<option value="0" style="background: #111111;color: #d5f406;"></option>';
            ui += '<option value="1" style="background: #111111;color: '+K.textColor+';">'+watching+'</option>';
            ui += '<option value="2" style="background: #111111;color: '+K.textColor+';">Completed</option>';
            ui += '<option value="3" style="background: #111111;color: '+K.textColor+';">On-Hold</option>';
            ui += '<option value="4" style="background: #111111;color: '+K.textColor+';">Dropped</option>';
            ui += '<option value="6" style="background: #111111;color: '+K.textColor+';">'+planTo+'</option>';
            ui += '</select>';
            target.find(".MalData").first().append(""+ui).find('.malStatus').change(function() {
                var anime = {};
                anime['.add_'+K.listType+'[num_'+middleVerb+'_'+middleType+']'] = $(this).parent().find('.malEpisode').find('.input').val();
                anime['.add_'+K.listType+'[status]'] = $(this).parent().find('.malStatus').val();
                anime['.add_'+K.listType+'[score]'] = $(this).parent().find('.malUserRating').val();
                setanime(baseurl,anime);
            });
        }
        target.find(".malStatus").first().val(value);
    }

    function setscore(value, target, baseurl){
        if(target.find(".malUserRating").first().height() === null){
            var ui = "";
            ui += '<select class="malUserRating" style="width: 100%; font-size: 12px; background: transparent; border-width: 0px; border-color: grey; color: '+K.textColor+'; text-decoration: none; outline: medium none;"><option value="" style="background: #111111;color: '+K.textColor+';">Select</option>';
            ui += '<option value="10" style="background: #111111;color: '+K.textColor+';">(10) Masterpiece</option>';
            ui += '<option value="9" style="background: #111111;color: '+K.textColor+';">(9) Great</option>';
            ui += '<option value="8" style="background: #111111;color: '+K.textColor+';">(8) Very Good</option>';
            ui += '<option value="7" style="background: #111111;color: '+K.textColor+';">(7) Good</option>';
            ui += '<option value="6" style="background: #111111;color: '+K.textColor+';">(6) Fine</option>';
            ui += '<option value="5" style="background: #111111;color: '+K.textColor+';">(5) Average</option>';
            ui += '<option value="4" style="background: #111111;color: '+K.textColor+';">(4) Bad</option>';
            ui += '<option value="3" style="background: #111111;color: '+K.textColor+';">(3) Very Bad</option>';
            ui += '<option value="2" style="background: #111111;color: '+K.textColor+';">(2) Horrible</option>';
            ui += '<option value="1" style="background: #111111;color: '+K.textColor+';">(1) Appalling</option>';
            ui += '</select>';
            target.find(".MalData").first().append("</br>"+ui).find('.malUserRating').change(function() {
                var anime = {};
                anime['.add_'+K.listType+'[num_'+middleVerb+'_'+middleType+']'] = $(this).parent().find('.malEpisode').find('.input').val();
                anime['.add_'+K.listType+'[status]'] = $(this).parent().find('.malStatus').val();
                anime['.add_'+K.listType+'[score]'] = $(this).parent().find('.malUserRating').val();
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
            if(/^newEp_.*/.test(cache)){
                GM_deleteValue(cache);
            }
            if('timestampUpdate/release' == cache){
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
        xml.find('series_'+K.listType+'db_id').each(function(index){
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
                row += '<a class="aAnime" href="https://myanimelist.net/'+K.listType+'/'+xmlEntry.find("series_"+K.listType+"db_id").first().text()+'">'+xmlEntry.find("series_title").first().text()+'</a>';
                row += '</div>';
                row += '</td>';
                row += '</tr>';

                $(".listing").before(row);
            }
        });


    }

    function getdata(baseurl, callback, parth = ""){
        if(GM_getValue(K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(baseurl))+'/'+parth , null) !== null ){
            con.log("cache:", K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(baseurl))+'/'+parth);
            var value = GM_getValue( K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(baseurl))+'/'+parth , null);
            callback(value);
        }else{
            con.log("db:", K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(baseurl))+'/'+parth);
            var url = 'https://kissanimelist.firebaseio.com/Data2/'+K.dbSelector+'/'+encodeURIComponent(encodeURIComponent($.titleToDbKey(K.urlAnimeSelector(baseurl)))).toLowerCase()+'/'+parth+'.json';
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                synchronous: false,
                onload: function(response) {
                    //con.log(response);
                    if( response.responseText != null  && response.responseText != 'null'){
                        var newResponse = response.responseText.slice(1, -1);
                        if(parth == 'Mal'){
                            newResponse = 'https://myanimelist.net/'+K.listType+'/'+response.responseText.split('"')[1]+'/'+response.responseText.split('"')[3];
                        }
                        GM_setValue(K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(baseurl))+'/'+parth , newResponse);
                        callback(newResponse);
                    }
                }
            });
        }
    }

    function setAll(){
        K.docReady(function() {

            K.bookmarkEntrySelector().each(function() {
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
                K.BookmarksStyleAfterLoad();
            }else{
                return;
            }

            var len = K.bookmarkEntrySelector().length;
            K.bookmarkEntrySelector().bind('inview', function (event, visible) {
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
