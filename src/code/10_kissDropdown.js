    if(K.dbSelector == 'Kissanime'){
        $( document).ready( function(){
            if( window.location.href.indexOf("BookmarkList") > -1 ){
                var catOptions = '';
                catOptions +='<option value="">Select</option>';
                $.each(lstCats, function( index, value ) {
                  catOptions +='<option value="'+value+'">'+value+'</option>';
                });
                catOptions = '<select class="selectCats" style="width: 200px; font-size: 14px;">'+catOptions+'</select>';
                con.log(catOptions);
                GM_setValue(K.dbSelector+'catOptions',catOptions);
                $('.trAnime').each(function(){
                    var aurl = $.absoluteLink($(this).find('.aAnime').attr('href'));
                    con.log(K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(K.urlAnimeIdent(aurl)))+'/bdid',$(this).find('.aCategory').attr('bdid'));
                    GM_setValue(K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(K.urlAnimeIdent(aurl)))+'/bdid',$(this).find('.aCategory').attr('bdid'));
                });
            }else{
                var bdid = GM_getValue( K.dbSelector+'/'+$.titleToDbKey(K.urlAnimeSelector(K.urlAnimeIdent(K.normalUrl())))+'/bdid', null);
                if(bdid != null){
                    $('#spanBookmarkManager').before('<a class="aCategory" href="#" onclick="return false;" title="Move to other folder"><img border="0" style="vertical-align:middle" src="/Content/Images/folder.png"> Folder</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                    $('.aCategory').click(function () {
                        $(this).hide();
                        var aCat= $(this);
                        $(this).after(GM_getValue(K.dbSelector+'catOptions',""));
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
