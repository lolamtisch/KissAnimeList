    function tagToContinue(){
        if(tagLinks == 0){
            return false;
        }
        $(window).load(function(){
            var checkExist = setInterval(function() {
                if ($('.list-item').first().length){
                    clearInterval(checkExist);
                    var url = '';
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
                            $(this).parent().remove();
                        }
                    });
                    return true;
                }
            }, 300);
        });
    }
