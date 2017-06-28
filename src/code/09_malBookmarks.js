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
                            $(this).parent().parent('div').prepend('<a target="_blank" href="'+url+'">[Continue watching]</a><br/>');
                            $(this).parent().remove();
                        }
                    });
                    return true;
                }
            }, 300);
        });
    }
