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
                    $('#list_surround table td[class^="td"]:last-child').addClass("tags");  //.css('background-color','red');
                    $('#list_surround table').addClass("list-table-data");
                    $('#list_surround table td[class^="td"]:first-child').addClass("title").addClass("data");
                    $('#list_surround table .animetitle').addClass("link");
                    $('#list_surround table td[class^="td"]:nth-last-child(2)').addClass("progress").addClass("data").find('span a').addClass('link');
                    //
                    $('.tags span a').each(function( index ) {
                        if($(this).text().indexOf("last::") > -1 ){
                            url = $(this).text().split("last::")[1].split("::")[0];
                            if(url.indexOf("masterani.me") > -1 && url.indexOf("/watch/") > -1){
                                url = url.replace('/watch/','/info/');
                            }
                            var icon = '<img src="https://www.google.com/s2/favicons?domain='+url.split('/')[2]+'">'
                            $(this).closest('.list-table-data').find('.data.title .link').after('<a class="stream" title="'+url.split('/')[2]+'" target="_blank" style="margin: 0 5px;" href="'+url+'">'+icon+'</a>');


                            if(parseInt($(this).closest('.list-table-data').find('.data.progress .link').text())+1 == GM_getValue( url+'/next')){
                                if(typeof GM_getValue( url+'/nextEp') != 'undefined'){
                                    $(this).closest('.list-table-data').find('.stream').after('<span class="content-status"><a class="nextStream" title="Next Episode" target="_blank" style="margin: 0 5px; color: #BABABA;" href="'+ GM_getValue( url+'/nextEp')+'">'+'Next Episode'+'</a></span>');
                                }
                            }
                            if($('#list_surround').length){
                                $(this).remove();
                            }else{
                                $(this).parent().remove();
                            }
                        }
                    });
                    return true;
                }
            }, 300);
        });
    }
