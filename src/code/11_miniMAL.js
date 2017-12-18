    function createIframe(){
        if( !($('#info-popup').height()) ){
            //var position = 'width: 80%; height: 70%; position: absolute; top: 15%; left: 10%';
            var position = 'max-width: 100%; max-height: 100%; min-width: 500px; min-height: 300px; width: '+miniMalWidth+'; height: '+miniMalHeight+'; position: absolute; bottom: 0%; '+( posLeft ? 'left':'right')+': 0%';//phone
            if($(window).width() < 500){
              position = 'width: 100vw; height: 100%; position: absolute; top: 0%; '+( posLeft ? 'left':'right')+': 0%';
            }
            var material = '<dialog class="modal" id="info-popup" style="pointer-events: none;display: none; position: fixed;z-index: 999;left: 0;top: 0;bottom: 0;width: 100%; height: 100%; background-color: transparent; padding: 0; margin: 0; border: 0;">';
            material += '<div id="modal-content" class="modal-content" Style="pointer-events: all;background-color: #fefefe; margin: 0; '+position+'">';
            //material += '<iframe id="info-iframe" style="height:100%;width:100%;border:0;"></iframe>';
            material += '</div>';
            material += '</dialog>';
            $('body').after(material);

            GM_addStyle('.modal-content.fullscreen{width: 100% !important;height: 100% !important; bottom: 0 !important;'+( posLeft ? 'left':'right')+': 0 !important;}\
                         .modal-content{-webkit-transition: all 0.5s ease; -moz-transition: all 0.5s ease; -o-transition: all 0.5s ease; transition: all 0.5s ease;}\
                         .floatbutton:hover {background-color:rgb(255,64,129);}\
                         .floatbutton:hover div {background-color:white;}\
                         .floatbutton div {background-color:black;-webkit-transition: all 0.5s ease;-moz-transition: all 0.5s ease;-o-transition: all 0.5s ease;transition: all 0.5s ease;}\
                         .floatbutton {\
                            z-index: 999;display: none; position:fixed; bottom:40px; right:40px; border-radius: 50%; font-size: 24px; height: 56px; margin: auto; min-width: 56px; width: 56px; padding: 0; overflow: hidden; background: rgba(158,158,158,.2); box-shadow: 0 1px 1.5px 0 rgba(0,0,0,.12), 0 1px 1px 0 rgba(0,0,0,.24); line-height: normal; border: none;\
                            font-weight: 500; text-transform: uppercase; letter-spacing: 0; will-change: box-shadow; transition: box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1); outline: none; cursor: pointer; text-decoration: none; text-align: center; vertical-align: middle; padding: 16px;\
                         }\
                         .mdl-button{\
                            background: #3f51b5; color: #fff;box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);\
                            border: none; border-radius: 2px;\
                         }');

            var iframe = document.createElement('iframe');
            iframe.setAttribute("id", "info-iframe");
            iframe.setAttribute("style", "height:100%;width:100%;border:0;");
            iframe.onload = function() {
                executejs(GM_getResourceText("materialjs"));
                executejs(GM_getResourceText("simpleBarjs"));
                var head = $("#info-iframe").contents().find("head");
                head.append('<style>#material .mdl-card__supporting-text{width: initial} .mdl-layout__header .mdl-textfield__label:after{background-color: red !important;}</style>');
                head.append('<style>\
                              .alternative-list .mdl-list{\
                                max-width: 100%;\
                                margin: 0;\
                                padding: 0;\
                              }\
                              .alternative-list .mdl-list__item{\
                                height: auto;\
                              }\
                              .alternative-list .mdl-list__item-primary-content{\
                                height: auto !important;\
                              }\
                              .alternative-list .mdl-list__item-primary-content a{\
                                display: block;\
                              }\
                              .alternative-list .mdl-list__item-text-body{\
                                height: auto !important;\
                              }\
                              \
                              .coverinfo .mdl-chip{\
                                height: auto;\
                              }\
                              .coverinfo .mdl-chip .mdl-chip__text{\
                                white-space: normal;\
                                line-height: 24px;\
                              }\
                              \
                              \
                              .mdl-layout__content::-webkit-scrollbar{\
                                width: 10px !important;\
                                background-color: #F5F5F5;\
                              }\
                              .mdl-layout__content::-webkit-scrollbar-thumb{\
                                background-color: #c1c1c1 !important;\
                              }\
                              .simplebar-track{\
                                width: 10px !important;\
                                background-color: #F5F5F5;\
                              }\
                              .simplebar-scrollbar{\
                                background-color: #c1c1c1 !important;\
                              }\
                              .simplebar-track.horizontal{\
                                display: none;\
                              }\
                              \
                              .simplebar-scrollbar{\
                                border-radius: 0px !important;\
                                right: 0 !important;\
                                width: 100% !important;\
                                opacity: 1 !important;\
                              }\
                              .simplebar-content{\
                                margin-right: -7px !important;\
                              }\
                              .simplebar-track{\
                                margin-top: -2px;\
                                margin-bottom: -2px;\
                              }\
                            </style>');
                head.append('<style>'+GM_getResourceText("materialCSS")+'</style>');
                head.append('<style>'+GM_getResourceText("materialFont")+'</style>');
                head.append('<style>'+GM_getResourceText("simpleBarCSS")+'</style>');
                //templateIframe(url, data);
                if(displayFloatButton == 1){
                    var floatbutton = '<button class="open-info-popup floatbutton" style="">';
                    floatbutton += '<i class="my-float" style="margin-top:22px;"><div style="width: 100%; height: 4px; margin-bottom: 15%;"></div><div style="width: 100%; height: 4px; margin-bottom: 15%;"></div><div style="width: 100%; height: 4px"></div></i></button>';
                    $('#info-popup').after(floatbutton);
                    if(miniMalButtonLate != ''){
                      miniMalButton(miniMalButtonLate);
                    }
                    /*$('.open-info-popup').click(function() {
                        if($('#info-popup').css('display') == 'none'){
                            $('.floatbutton').fadeOut();
                        }
                    });*/
                }
            };
            document.getElementById("modal-content").appendChild(iframe);
        }
    }

    function templateIframe(url, data){
        var material = '\
        <div id="material" style="height: 100%;"><div class="mdl-layout mdl-js-layout mdl-layout--fixed-header\
                    mdl-layout--fixed-tabs">\
          <header class="mdl-layout__header" style="min-height: 0;">\
            <button class="mdl-layout__drawer-button" id="backbutton" style="display: none;"><i class="material-icons">arrow_back</i></button>\
            <div class="mdl-layout__header-row">\
                <!--<span class="mdl-layout-title malTitle malClear"></span>--!>\
                <button class="mdl-button mdl-js-button mdl-button--icon mdl-layout__drawer-button" id="book" style="">\
                  <i class="material-icons" class="material-icons md-48">book</i>\
                </button>\
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable" id="SearchButton" style="margin-left: -57px; margin-top: 3px; padding-left: 40px;">\
                  <label class="mdl-button mdl-js-button mdl-button--icon" for="headMalSearch">\
                    <i class="material-icons">search</i>\
                  </label>\
                  <div class="mdl-textfield__expandable-holder">\
                    <input class="mdl-textfield__input" type="text" id="headMalSearch">\
                    <label class="mdl-textfield__label" for="headMalSearch"></label>\
                  </div>\
                </div>\
                <button class="mdl-button mdl-js-button mdl-button--icon mdl-layout__drawer-button" id="material-fullscreen" style="left: initial; right: 40px;">\
                  <i class="material-icons" class="material-icons md-48">fullscreen</i>\
                </button>\
                <button class="mdl-button mdl-js-button mdl-button--icon mdl-layout__drawer-button" id="close-info-popup" style="left: initial; right: 0;">\
                    <i class="material-icons close">close</i>\
                </button>\
            </div>\
            <!-- Tabs -->\
            <div class="mdl-layout__tab-bar mdl-js-ripple-effect">';
            material += '\
            <a href="#fixed-tab-1" class="mdl-layout__tab is-active mal-exists">Overview</a>\
            <a href="#fixed-tab-2" class="mdl-layout__tab reviewsTab mal-exists">Reviews</a>\
            <a href="#fixed-tab-3" class="mdl-layout__tab recommendationTab mal-exists">Recommendations</a>\
            <!--<a href="#fixed-tab-4" class="mdl-layout__tab">Episodes</a>-->\
            <a href="#fixed-tab-5" class="mdl-layout__tab settingsTab">Settings</a>';
            material += '\
            </div>\
          </header>\
          <main class="mdl-layout__content" data-simplebar>';
            material += '\
            <section class="mdl-layout__tab-panel is-active" id="fixed-tab-1">\
              <div id="loadOverview" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>\
              <div class="page-content">\
              <div class="mdl-grid">\
                <div class="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--6-col-phone mdl-shadow--4dp stats-block malClear" style="min-width: 120px;">\
                    \
                </div>\
                <div class="mdl-grid mdl-cell mdl-shadow--4dp coverinfo malClear" style="display:block; flex-grow: 100; min-width: 70%;">\
                  <div class="mdl-card__media mdl-cell mdl-cell--2-col" style="background-color: transparent; float:left; padding-right: 16px;">\
                      <img class="malImage malClear" style="width: 100%; height: auto;"></img>\
                  </div>\
                  <div class="mdl-cell mdl-cell--12-col">\
                      <a class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect malClear malLink" href="" style="float: right;" target="_blank"><i class="material-icons">open_in_new</i></a>\
                      <h1 class="malTitle mdl-card__title-text malClear" style="padding-left: 0px; overflow:visible;"></h1>\
                      <div class="malAltTitle mdl-card__supporting-text malClear" style="padding: 10px 0 0 0px; overflow:visible;"></div>\
                  </div>\
                  <div class="malDescription malClear mdl-cell mdl-cell--10-col" style="overflow: hidden;"></div>\
                </div>\
                <div class="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-shadow--4dp data-block mdl-grid mdl-grid--no-spacing malClear">\
                    \
                </div>\
                <div class="mdl-grid mdl-grid--no-spacing mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-shadow--4dp related-block alternative-list mdl-grid malClear">\
                    \
                </div>\
                <div style="display: none;" class="mdl-grid mdl-grid--no-spacing mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-shadow--4dp mdl-grid alternative-list stream-block malClear">\
                    <ul class="mdl-list stream-block-inner">\
                    \
                    </ul>\
                </div>\
                <div class="mdl-grid mdl-grid--no-spacing mdl-cell mdl-cell--12-col mdl-shadow--4dp info-block mdl-grid malClear">\
                    \
                </div>\
              </div>\
              </div>\
            </section>\
            <section class="mdl-layout__tab-panel" id="fixed-tab-2">\
              <div id="loadReviews" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>\
              <div class="page-content malClear" id="malReviews"></div>\
            </section>\
            <section class="mdl-layout__tab-panel" id="fixed-tab-3">\
              <div id="loadRecommendations" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>\
              <div class="page-content malClear" id="malRecommendations"></div>\
            </section>\
            <section class="mdl-layout__tab-panel" id="fixed-tab-4">\
              <div id="loadEpisode" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>\
              <div class="page-content malClear" id="malEpisodes"></div>\
            </section>';
            material +='\
            <section class="mdl-layout__tab-panel" id="fixed-tab-5">\
              <div class="page-content malClear" id="malConfig"></div>\
            </section>';
          material +='</main>\
        </div>\
        <div data-simplebar id="malSearchPop" style="height: calc(100% - 60px); width: 100%; position: fixed; top: 60px; z-index: 10; background-color: white; display: none;">\
          <div id="malSearchPopInner"></div>\
        </div>';
        //material += '</div>';
        $("#info-iframe").contents().find("body").append(material);
        var modal = document.getElementById('info-popup');

        $("#info-iframe").contents().find("#close-info-popup").click( function(){
            modal.style.display = "none";
            $('.floatbutton').fadeIn();
            //$('body').css('overflow','initial');
        });

        $("#info-iframe").contents().find("#backbutton").click( function(){
            //alert();getcommondata();
            $("#info-iframe").contents().find('.mdl-layout__tab:eq(0) span').trigger( "click" );
            $(this).hide();
            $("#info-iframe").contents().find('#SearchButton').css('margin-left', '-57px');
            $("#info-iframe").contents().find('#book').css('left', '0px');
            if(currentMalData == null){
                fillIframe(url, data);
            }
            fillIframe(url, currentMalData);
        });

        $("#info-iframe").contents().find("#material-fullscreen").click( function(){
            if($('.modal-content.fullscreen').height()){
                $(".modal-content").removeClass('fullscreen');
                $(this).find('i').text('fullscreen');
            }else{
                $(".modal-content").addClass('fullscreen');
                $(this).find('i').text('fullscreen_exit');
            }
        });

        var timer;
        $("#info-iframe").contents().find("#headMalSearch").on("input", function(){
          clearTimeout(timer);
          timer = setTimeout(function(){
            if($("#info-iframe").contents().find("#headMalSearch").val() == ''){
              $("#info-iframe").contents().find('#malSearchPop').hide();
            }else{
              $("#info-iframe").contents().find('#malSearchPop').show();
              searchMal($("#info-iframe").contents().find("#headMalSearch").val(), listType, '#malSearchPopInner', function(){
                $("#info-iframe").contents().find("#malSearchPop .searchItem").unbind('click').click(function(event) {
                  $("#info-iframe").contents().find("#headMalSearch").val('').trigger("input").parent().parent().removeClass('is-dirty');
                  $("#info-iframe").contents().find('.malClear').hide();
                  $("#info-iframe").contents().find('.mdl-progress__indeterminate').show();
                  $("#info-iframe").contents().find("#backbutton").show();
                  $("#info-iframe").contents().find('#SearchButton').css('margin-left', '-17px');
                  $("#info-iframe").contents().find('#book').css('left', '40px');
                  $("#info-iframe").contents().find('.mdl-layout__tab:eq(0) span').trigger( "click" );
                  fillIframe($(this).attr('malhref'));
                });
              });
            }
          }, 300);
        });

        $("#info-iframe").contents().find("#book").click(function() {
          if($("#info-iframe").contents().find("#book.open").length){
            $("#info-iframe").contents().find("#book").toggleClass('open');
            $("#info-iframe").contents().find('#malSearchPop').hide();
          }else{
            $("#info-iframe").contents().find("#book").toggleClass('open');
            $("#info-iframe").contents().find('#malSearchPop').show();
            iframeBookmarks( $("#info-iframe").contents().find('#malSearchPopInner') );
          }
        });
    }

    function fillIframe(url, data = null){
        $("#info-iframe").contents().find('.malClear').hide();
        $("#info-iframe").contents().find('.mdl-progress__indeterminate').show();
        if(data == null && url != null){
            getAjaxData(url, function(newdata){
                fillIframe(url, newdata);
            });
            return;
        }
        if( !($("#info-iframe").contents().find('#material').height()) ){
            templateIframe(url,data);
        }
        if(url == null){
          $("#info-iframe").contents().find('.mal-exists').css('display', 'none');
          $("#info-iframe").contents().find('.mdl-layout__tab-panel.is-active').removeClass('is-active');
          $("#info-iframe").contents().find('.mdl-layout__tab-panel').last().addClass('is-active');
        }else{
          $("#info-iframe").contents().find('.mal-exists').css('display', 'block');
        }
        iframeConfig(url, data);
        iframeOverview(url, data);
        $("#info-iframe").contents().find('.reviewsTab').off('click').one('click',function(){
            iframeReview(url, data);
            fixIframeLink();
        });
        //iframeEpisode(url, data);
        $("#info-iframe").contents().find('.recommendationTab').off('click').one('click',function(){
            iframeRecommendations(url, data);
        });
        $("#info-iframe").contents().find('.mdl-layout__tab.is-active').trigger( "click" );
        executejs('componentHandler.upgradeDom();');
        fixIframeLink();
    }

    function iframeConfig(url, data){
        try{
            var settingsUI = '<ul class="demo-list-control mdl-list" style="margin: 0px; padding: 0px;">\
            <div class="mdl-grid">';
            try{
              var malUrl = GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Mal' , null);
            }catch(e){
              var malUrl = null;
            }
            if(malUrl == url){
                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                                <div class="mdl-card__title mdl-card--border">\
                                    <h2 class="mdl-card__title-text">';
                                    if(data != null){
                                      settingsUI += data.split('itemprop="name">')[1].split('<')[0];
                                    }else{
                                      settingsUI += 'Not Found';
                                    }
                                    settingsUI +=
                                    '</h2>\
                                </div>\
                                  <div class="mdl-list__item">\
                                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                      <input class="mdl-textfield__input" type="number" step="1" id="malOffset" value="'+GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Offset' , '')+'">\
                                  <label class="mdl-textfield__label" for="malOffset">Episode Offset</label>\
                                    '+getTooltip('Input the episode offset, if an anime has 12 episodes, but uses the numbers 0-11 rather than 1-12, you simply type " +1 " in the episode offset.')+'\
                                  </div>\
                                </div>\
                                <div class="mdl-list__item" style="padding-bottom: 0;padding-top: 0;">\
                                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                    <input class="mdl-textfield__input" type="text" id="malUrlInput" value="'+malUrl+'">\
                                <label class="mdl-textfield__label" for="malUrlInput">MyAnimeList Url</label>\
                                  '+getTooltip('Only change this URL if it points to the wrong anime page on MAL.')+'\
                                </div>\
                              </div>\
                              \
                              <div class="mdl-list__item" style="padding-bottom: 0;padding-top: 0;">\
                              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                <label class="mdl-textfield__label" for="malSearch">\
                                  '+getTooltip('To make a search, simply begin typing the name of an anime, and a list with results will automatically appear as you type.')+'\
                                  Search\
                                </label>\
                                  <input class="mdl-textfield__input" type="text" id="malSearch">\
                              </div>\
                              </div>\
                              <div class="mdl-list__item" style="min-height: 0; padding-bottom: 0; padding-top: 0;">\
                                <div class="malResults" id="malSearchResults"></div>\
                              </div>\
                              \
                              <div class="mdl-list__item">\
                                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="malSubmit">Update</button>\
                                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" id="malReset" style="margin-left: 5px;">Reset</button>\
                                </div>\
                              </div>';

            }
                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <div class="mdl-card__title mdl-card--border">\
                                <h2 class="mdl-card__title-text">General</h2>\
                                </div>';
                settingsUI += materialCheckbox(autoTracking,'autoTracking','Autotracking');
                settingsUI += getTooltip('Autotracking is the function where this script automatically updates the anime´s you watch with your MAL account.');
                settingsUI += '<li class="mdl-list__item">\
                                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                      <input class="mdl-textfield__input" type="number" step="1" id="malDelay" value="'+delay+'">\
                                  <label class="mdl-textfield__label" for="malDelay">Autotracking delay (Seconds)</label>\
                                  </div>\
                              </li>';
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <div class="mdl-card__title mdl-card--border">\
                                <h2 class="mdl-card__title-text">MAL Bookmark Page</h2>\
                                </div>';
                settingsUI += materialCheckbox(tagLinks,'tagLinks','Continue watching links');
                settingsUI += getTooltip('If enabled: On your MAL Anime List and the bookmark list in miniMAL, an icon-link will be added to the last used streaming site you were using to watch an anime.<br>Simply click the icon to continue watching the anime.');
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <div class="mdl-card__title mdl-card--border">\
                                <h2 class="mdl-card__title-text">Streaming Site Links</h2>';

                settingsUI += getTooltip('If disabled, the streaming site will no longer appear in an animes sidebar on MAL.');

                settingsUI += '</div>';


                settingsUI += materialCheckbox(kissanimeLinks,'kissanimeLinks','KissAnime');
                settingsUI += materialCheckbox(masteraniLinks,'masteraniLinks','MasterAnime');
                settingsUI += materialCheckbox(nineanimeLinks,'nineanimeLinks','9anime');
                settingsUI += materialCheckbox(crunchyrollLinks,'crunchyrollLinks','Crunchyroll');
                settingsUI += materialCheckbox(gogoanimeLinks,'gogoanimeLinks','Gogoanime');
                settingsUI += materialCheckbox(kissmangaLinks,'kissmangaLinks','KissManga');
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <div class="mdl-card__title mdl-card--border">\
                                <h2 class="mdl-card__title-text">MyAnimeList</h2>\
                                  '+getTooltip('The option below, is for resizing thumbnails on MAL.<br>Like thumbnails for characters, people, recommendations, etc.')+'\
                                    </div>';
                settingsUI += '<li class="mdl-list__item">\
                                  <span class="mdl-list__item-primary-content">\
                                      Thumbnails\
                                  </span>\
                                  <span class="mdl-list__item-secondary-action">\
                                    <select name="myinfo_score" id="malThumbnail" class="inputtext mdl-textfield__input" style="outline: none;">\
                                      <option value="144">Large</option>\
                                      <option value="100">Medium</option>\
                                      <option value="60">Small</option>\
                                      <option value="0">MAL Default</option>\
                                    </select>\
                                  </span>\
                              </li>';
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                                <div class="mdl-card__title mdl-card--border">\
                                  <h2 class="mdl-card__title-text">miniMAL</h2>\
                                  <span style="margin-left: auto; color: #7f7f7f;">Shortcut: Ctrl + m</span>\
                                </div>';
                settingsUI += materialCheckbox(miniMALonMal,'miniMALonMal','Display on MyAnimeList');
                settingsUI += materialCheckbox(displayFloatButton,'displayFloatButton','Floating menu button');
                settingsUI += materialCheckbox(posLeft,'posLeft','Left-sided');
                settingsUI += getTooltip('By default(enabled), miniMAL will be aligned to the right side of the screen.<br>If you disable this options, miniMAL will align to the left side of the screen instead.');

                settingsUI += '<li class="mdl-list__item" style="display: inline-block; width: 50%;">\
                                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                      <input class="mdl-textfield__input" type="text" step="1" id="miniMalHeight" value="'+miniMalHeight+'">\
                                  <label class="mdl-textfield__label" for="miniMalHeight">Height (px / %)</label>\
                                    '+getTooltip('Adjust the size of miniMAL to your liking.<br>There is both an upper-limit and a lower-limit in place, so it will never become larger than the visible part of the page, nor will it become so small that you won´t be able to easily change it back.')+'\
                                  </div>\
                              </li>';
                settingsUI += '<li class="mdl-list__item" style="display: inline-block; width: 50%;">\
                                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">\
                                      <input class="mdl-textfield__input" type="text" step="1" id="miniMalWidth" value="'+miniMalWidth+'">\
                                  <label class="mdl-textfield__label" for="miniMalWidth">Width (px / %)</label>\
                                  </div>\
                              </li>';
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp hoverinfoDeact">';
                settingsUI += materialCheckbox(episodeInfoBox,'episodeInfoBox','Episode Hoverinfo', true);
                settingsUI += getTooltip('<img src="https://github.com/lolamtisch/KissAnimeList/blob/miniMAL-tooltips/Screenshots/2fhq9cL.gif" alt="Episode Hoverinfo">');
                settingsUI += '<div class="mdl-card__title mdl-card--border" style="padding: 0;"></div>';
                settingsUI += materialCheckbox(episodeInfoSynopsis,'episodeInfoSynopsis','Synopsis');
                settingsUI += getTooltip('If enabled, the episode-synopsis from MAL will be displayed in the Episode Hoverinfo.');
                settingsUI += materialCheckbox(episodeInfoImage,'episodeInfoImage','Image');
                settingsUI += getTooltip('If enabled, the episode-image from MAL will be displayed in the Episode Hoverinfo.');
                settingsUI += materialCheckbox(episodeInfoSubtitle,'episodeInfoSubtitle','Subtitle');
                settingsUI += getTooltip('If enabled, the episode-subtitle from MAL will be displayed in the Episode Hoverinfo. Example using the anime "Fate/Apocrypha":<br>Title: "Apocrypha: The Great Holy Grail War"<br>Subtitle: "Gaiten: Seihai Taisen (外典:聖杯大戦)"');
                settingsUI += '</div>';

                settingsUI += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <div class="mdl-card__title mdl-card--border">\
                                <h2 class="mdl-card__title-text">ETC</h2>\
                                </div>';
                settingsUI += '<li class="mdl-list__item"><button type="button" id="clearCache" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Clear Cache</button></li>';
                settingsUI += '</div>';

            $("#info-iframe").contents().find('#malConfig').html(settingsUI);

            $("#info-iframe").contents().find("#malReset").click( function(){
                GM_deleteValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Mal' );
                flashm( "MyAnimeList url reset" , false);
                checkdata();
            });

            $("#info-iframe").contents().find("#malSubmit").click( function(){
                var murl = $("#info-iframe").contents().find("#malUrlInput").val();
                local_setValue($.normalUrl()+'#newCorrection', murl);
                flashm( "new url '"+murl+"' set." , false);
                checkdata();
            });

            $("#info-iframe").contents().find("#malDelay").on("input", function(){
                var tempDelay = $("#info-iframe").contents().find("#malDelay").val();
                if(tempDelay !== null){
                    if(tempDelay !== ''){
                        delay = tempDelay;
                        GM_setValue( 'delay', tempDelay );
                        flashm( "New delay ("+delay+") set." , false);
                    }else{
                        delay = 3;
                        GM_deleteValue( 'delay' );
                        flashm( "Delay reset" , false);
                    }
                }
            });

            $("#info-iframe").contents().find("#miniMalWidth").on("input", function(){
                var miniMalWidth = $("#info-iframe").contents().find("#miniMalWidth").val();
                if(miniMalWidth !== null){
                    if(miniMalWidth !== ''){
                        GM_setValue( 'miniMalWidth', miniMalWidth );
                        flashm( "New Width ("+miniMalWidth+") set." , false);
                    }else{
                        miniMalWidth = '30%';
                        GM_deleteValue( 'miniMalWidth' );
                        flashm( "Width reset" , false);
                    }
                }
                $("#modal-content").css('width', miniMalWidth);
            });

            $("#info-iframe").contents().find("#miniMalHeight").on("input", function(){
                var miniMalHeight = $("#info-iframe").contents().find("#miniMalHeight").val();
                if(miniMalHeight !== null){
                    if(miniMalHeight !== ''){
                        GM_setValue( 'miniMalHeight', miniMalHeight );
                        flashm( "New Height ("+miniMalHeight+") set." , false);
                    }else{
                        miniMalHeight = '90%';
                        GM_deleteValue( 'miniMalHeight' );
                        flashm( "Height reset" , false);
                    }
                }
                $("#modal-content").css('height', miniMalHeight);
            });

            $("#info-iframe").contents().find("#malOffset").on("input", function(){
                var Offset = $("#info-iframe").contents().find("#malOffset").val();
                if(Offset !== null){
                    if(Offset !== ''){
                        GM_setValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Offset', Offset );
                        flashm( "New Offset ("+Offset+") set." , false);
                    }else{
                        GM_deleteValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Offset' );
                        flashm( "Offset reset" , false);
                    }
                }
            });

            var timer;
            $("#info-iframe").contents().find("#malSearch").on("input", function(){
              clearTimeout(timer);
              timer = setTimeout(function(){
                searchMal( $("#info-iframe").contents().find("#malSearch").val(), listType, '.malResults', function(){
                  $("#info-iframe").contents().find("#malSearchResults .searchItem").unbind('click').click(function(event) {
                    $("#info-iframe").contents().find('#malUrlInput').val($(this).attr('malhref'));
                    $("#info-iframe").contents().find('#malSearch').val('');
                    $("#info-iframe").contents().find('#malSearchResults').html('');
                  });
                });
              }, 300);
            });

            $("#info-iframe").contents().find("#clearCache").click( function(){
                clearCache();
            });

            $("#info-iframe").contents().find('#autoTracking').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('autoTracking', 1);
                    autoTracking = 1;
                }else{
                    GM_setValue('autoTracking', 0);
                    autoTracking = 0;
                }
            });
            $("#info-iframe").contents().find('#tagLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('tagLinks', 1);
                    tagLinks = 1;
                }else{
                    GM_setValue('tagLinks', 0);
                    tagLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#kissmangaLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('kissmangaLinks', 1);
                    kissmangaLinks = 1;
                }else{
                    GM_setValue('kissmangaLinks', 0);
                    kissmangaLinks = 0;
                }
            });

            $("#info-iframe").contents().find('#kissanimeLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('kissanimeLinks', 1);
                    kissanimeLinks = 1;
                }else{
                    GM_setValue('kissanimeLinks', 0);
                    kissanimeLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#masteraniLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('masteraniLinks', 1);
                    masteraniLinks = 1;
                }else{
                    GM_setValue('masteraniLinks', 0);
                    masteraniLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#nineanimeLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('nineanimeLinks', 1);
                    nineanimeLinks = 1;
                }else{
                    GM_setValue('nineanimeLinks', 0);
                    nineanimeLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#crunchyrollLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('crunchyrollLinks', 1);
                    crunchyrollLinks = 1;
                }else{
                    GM_setValue('crunchyrollLinks', 0);
                    crunchyrollLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#gogoanimeLinks').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('gogoanimeLinks', 1);
                    gogoanimeLinks = 1;
                }else{
                    GM_setValue('gogoanimeLinks', 0);
                    gogoanimeLinks = 0;
                }
            });
            $("#info-iframe").contents().find('#posLeft').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('posLeft', 1);
                    posLeft = 1;
                }else{
                    GM_setValue('posLeft', 0);
                    posLeft = 0;
                }
            });
            $("#info-iframe").contents().find('#displayFloatButton').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('displayFloatButton', 1);
                    displayFloatButton = 1;
                }else{
                    GM_setValue('displayFloatButton', 0);
                    displayFloatButton = 0;
                }
            });
            $("#info-iframe").contents().find('#episodeInfoBox').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('episodeInfoBox', 1);
                    episodeInfoBox = 1;
                }else{
                    GM_setValue('episodeInfoBox', 0);
                    episodeInfoBox = 0;
                }
            });
            $("#info-iframe").contents().find('#episodeInfoSynopsis').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('episodeInfoSynopsis', 1);
                    episodeInfoSynopsis = 1;
                }else{
                    GM_setValue('episodeInfoSynopsis', 0);
                    episodeInfoSynopsis = 0;
                }
            });
            $("#info-iframe").contents().find('#episodeInfoImage').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('episodeInfoImage', 1);
                    episodeInfoImage = 1;
                }else{
                    GM_setValue('episodeInfoImage', 0);
                    episodeInfoImage = 0;
                }
            });
            $("#info-iframe").contents().find('#episodeInfoSubtitle').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('episodeInfoSubtitle', 1);
                    episodeInfoSubtitle = 1;
                }else{
                    GM_setValue('episodeInfoSubtitle', 0);
                    episodeInfoSubtitle = 0;
                }
            });

            $("#info-iframe").contents().find('#miniMALonMal').change(function(){
                if($(this).is(":checked")){
                    GM_setValue('miniMALonMal', 1);
                    miniMALonMal = 1;
                }else{
                    GM_setValue('miniMALonMal', 0);
                    miniMALonMal = 0;
                }
            });

            $("#info-iframe").contents().find("#malThumbnail").val(malThumbnail);
            $("#info-iframe").contents().find("#malThumbnail").change(function(){
              GM_setValue( 'malThumbnail', $("#info-iframe").contents().find("#malThumbnail").val() );
            });

            $("#info-iframe").contents().find('#malConfig').show();
        }catch(e) {console.log('[iframeConfig] Error:',e);}
    }

    function iframeOverview(url, data){
        $("#info-iframe").contents().find('#loadOverview').hide();
        try{
            var image = data.split('js-scrollfix-bottom')[1].split('<img src="')[1].split('"')[0];
            $("#info-iframe").contents().find('.malImage').attr("src",image).show();
            $("#info-iframe").contents().find('.coverinfo').show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var title = data.split('itemprop="name">')[1].split('<')[0];
            $("#info-iframe").contents().find('.malTitle').html(title).show();
            $("#info-iframe").contents().find('.coverinfo').show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            $("#info-iframe").contents().find('.malLink').attr('href',url).show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var description = data.split('itemprop="description">')[1].split('</span')[0];
            $("#info-iframe").contents().find('.malDescription').html('<p style="color: black;">'+description+'</p>').show();
            $("#info-iframe").contents().find('.coverinfo').show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var statsBlock = data.split('<h2>Statistics</h2>')[1].split('<h2>')[0];
            var html = $.parseHTML( statsBlock );
            var statsHtml = '<ul class="mdl-list mdl-grid mdl-grid--no-spacing mdl-cell mdl-cell--12-col" style="display: flex; justify-content: space-around;">';
            $.each($(html).filter('div').slice(0,5), function( index, value ) {
                statsHtml += '<li class="mdl-list__item mdl-list__item--two-line" style="padding: 0; padding-left: 10px; padding-right: 3px; min-width: 18%;">';
                    statsHtml += '<span class="mdl-list__item-primary-content">';
                        statsHtml += '<span>';
                            statsHtml += $(this).find('.dark_text').text();
                        statsHtml += '</span>';
                        statsHtml += '<span class="mdl-list__item-sub-title">';
                            statsHtml += $(this).find('span[itemprop=ratingValue]').height() != null ? $(this).find('span[itemprop=ratingValue]').text() : $(this).clone().children().remove().end().text();
                        statsHtml += '</span>';
                    statsHtml += '</span>';
                statsHtml += '</li>';
            });
            statsHtml += '</ul>';
            $("#info-iframe").contents().find('.stats-block').html(statsHtml).show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var altTitle = data.split('<h2>Alternative Titles</h2>')[1].split('<h2>')[0];
            altTitle = altTitle.replace(/spaceit_pad/g,'mdl-chip" style="margin-right: 5px;');
            $("#info-iframe").contents().find('.malAltTitle').html(altTitle);
            $("#info-iframe").contents().find('.malAltTitle .mdl-chip').contents().filter(function() {
                return this.nodeType == 3 && $.trim(this.textContent) != '';
            }).wrap('<span class="mdl-chip__text" />');
            $("#info-iframe").contents().find('.malAltTitle').show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var infoBlock = data.split('<h2>Information</h2>')[1].split('<h2>')[0];
            var html = $.parseHTML( infoBlock );
            var infoHtml = '<ul class="mdl-grid mdl-grid--no-spacing mdl-list mdl-cell mdl-cell--12-col">';
            $.each($(html).filter('div'), function( index, value ) {
                if((index + 4) % 4 == 0 && index != 0){
                    //infoHtml +='</ul><ul class="mdl-list mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet">';
                }
                infoHtml += '<li class="mdl-list__item mdl-list__item--three-line mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet">';
                    infoHtml += '<span class="mdl-list__item-primary-content">';
                        infoHtml += '<span>';
                            infoHtml += $(this).find('.dark_text').text();
                        infoHtml += '</span>';
                        infoHtml += '<span class="mdl-list__item-text-body">';
                            $(this).find('.dark_text').remove();
                            infoHtml += $(this).html();
                            //$(this).find('*').each(function(){infoHtml += $(this)[0].outerHTML});
                            //infoHtml += $(this).find('span[itemprop=ratingValue]').height() != null ? $(this).find('span[itemprop=ratingValue]').text() : $(this).clone().children().remove().end().text();
                        infoHtml += '</span>';
                    infoHtml += '</span>';
                infoHtml += '</li>';
            });
            infoHtml += '</ul>';
            $("#info-iframe").contents().find('.info-block').html(infoHtml).show();
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            var relatedBlock = data.split('Related ')[1].split('</h2>')[1].split('<h2>')[0];
            var related = $.parseHTML( relatedBlock );
            var relatedHtml = '<ul class="mdl-list">';
            $.each($(related).filter('table').find('tr'), function( index, value ) {
                relatedHtml += '<li class="mdl-list__item mdl-list__item--two-line">';
                    relatedHtml += '<span class="mdl-list__item-primary-content">';
                        relatedHtml += '<span>';
                            relatedHtml += $(this).find('.borderClass').first().text();
                        relatedHtml += '</span>';
                        relatedHtml += '<span class="mdl-list__item-sub-title">';
                            relatedHtml += $(this).find('.borderClass').last().html();
                        relatedHtml += '</span>';
                    relatedHtml += '</span>';
                relatedHtml += '</li>';
            });
            relatedHtml += '</ul>';
            $("#info-iframe").contents().find('.related-block').html(relatedHtml).show();
            $("#info-iframe").contents().find('.related-block .mdl-list__item-sub-title').each(function(){$(this).html($(this).children()); });
            $("#info-iframe").contents().find('#material .related-block a').each(function() {
              $(this).click(function(e) {
                $("#info-iframe").contents().find('.malClear').hide();
                $("#info-iframe").contents().find('.mdl-progress__indeterminate').show();
                $("#info-iframe").contents().find("#backbutton").show();
                $("#info-iframe").contents().find('#SearchButton').css('margin-left', '-17px');
                $("#info-iframe").contents().find('#book').css('left', '40px');
                fillIframe($(this).attr('href'));
              }).attr('onclick','return false;');
            });
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            if( !(window.location.href.indexOf("myanimelist.net") > -1) ){
              var localListType = url.split('/')[3];
              var dataBlock = data.split('id="addtolist"')[1].split('<div id="myinfoDisplay"')[0];
              if (~data.indexOf("header-menu-login")){
                  dataBlock = "Please log in on <a target='_blank' href='https://myanimelist.net/login.php'>MyAnimeList!<a>";
              }else{
                  dataBlock = dataBlock.substring(dataBlock.indexOf(">") + 1);
              }
              $("#info-iframe").contents().find('.data-block').html(dataBlock).show();
              $("#info-iframe").contents().find('.data-block tr:not(:last-child)').each(function(){
                  var label = $(this).find('.spaceit').first().text();
                  //$(this).find('.spaceit').first().html('<span>'+label+'</span>');
                  $(this).replaceWith($('<li class="mdl-list__item mdl-list__item--three-line">\
                      <span class="mdl-list__item-primary-content">\
                          <span>'+label+'</span>\
                          <span class="mdl-list__item-text-body">'+$(this).find('.spaceit').last().html()+'</span>\
                      </span>\
                      \</li>'));
              });
              $("#info-iframe").contents().find('#myinfo_status,#myinfo_score').addClass('mdl-textfield__input').css('outline', 'none');
              $("#info-iframe").contents().find('#myinfo_watchedeps,#myinfo_chapters,#myinfo_volumes').addClass('mdl-textfield__input').css('width','35px').css('display','inline-block');
              $("#info-iframe").contents().find('.inputButton').addClass('mdl-button mdl-js-button mdl-button--raised mdl-button--colored').css('margin-right','5px');
              $("#info-iframe").contents().find('.data-block li').last().after('<li class="mdl-list__item">'+$("#info-iframe").contents().find('.inputButton').first().parent().html()+'</li>');
              $("#info-iframe").contents().find('.data-block tr').remove();
              $("#info-iframe").contents().find('.js-'+localListType+'-update-button, .js-'+localListType+'-add-button').click(function (){
                  var anime = {};
                  if(localListType == 'anime'){
                      anime['.add_anime[num_watched_episodes]'] = parseInt($("#info-iframe").contents().find('#myinfo_watchedeps').val() );
                      if(isNaN(anime['.add_anime[num_watched_episodes]'])){
                          anime['.add_anime[num_watched_episodes]'] = 0;
                      }
                  }else{
                      anime['.add_manga[num_read_volumes]'] = parseInt($("#info-iframe").contents().find('#myinfo_volumes').val() );
                      if(isNaN(anime['.add_manga[num_read_volumes]'])){
                          anime['.add_manga[num_read_volumes]'] = 0;
                      }
                      anime['.add_manga[num_read_chapters]'] = parseInt($("#info-iframe").contents().find('#myinfo_chapters').val() );
                      if(isNaN(anime['.add_manga[num_read_chapters]'])){
                          anime['.add_manga[num_read_chapters]'] = 0;
                      }
                  }
                  anime['.add_'+listType+'[score]'] = parseInt($("#info-iframe").contents().find('#myinfo_score').val() );
                  if(anime['.add_'+listType+'[score]'] == 0){
                      anime['.add_'+listType+'[score]'] = '';
                  }
                  anime['.add_'+listType+'[status]'] = parseInt($("#info-iframe").contents().find('#myinfo_status').val() );
                  if($.isOverviewPage()){
                    anime['forceUpdate'] = 2;
                  }
                  anime['malurl'] = url;

                  setanime(url, anime, null, localListType);
              });
            }else{
              $("#info-iframe").contents().find('.data-block').css('display', 'none');
            }
        }catch(e) {console.log('[iframeOverview] Error:',e);}

        try{
            $("#info-iframe").contents().find('.stream-block-inner').html('');
            setKissToMal(url);
        }catch(e) {console.log('[iframeOverview] Error:',e);}
    }

    function iframeReview(url, data){
        $("#info-iframe").contents().find('#loadReviews').hide();
        try{
            var reviews = data.split('Reviews</h2>')[1].split('<h2>')[0];
            var html = $.parseHTML( reviews );
            var reviewsHtml = '<div class="mdl-grid">';
            $.each($(html).filter('.borderDark'), function( index, value ) {
                reviewsHtml += '<div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">';
                    reviewsHtml += '<div class="mdl-card__supporting-text mdl-card--border" style="color: black;">';
                        $(this).find('.spaceit > div').css('max-width','60%');
                        reviewsHtml += $(this).find('.spaceit').first().html();
                    reviewsHtml += '</div>';

                    reviewsHtml += '<div class="mdl-card__supporting-text" style="color: black;">';
                        $(this).find('.textReadability, .textReadability > span').contents().filter(function(){
                            return this.nodeType == 3 && $.trim(this.nodeValue).length;
                        }).wrap('<p style="margin:0;padding=0;"/>');
                        $(this).find('br').css('line-height','10px');
                        reviewsHtml += $(this).find('.textReadability').html();
                    reviewsHtml += '</div>';
                reviewsHtml += '</div>';
            });
            reviewsHtml += '</div>';
            if(reviewsHtml == '<div class="mdl-grid"></div>'){
                reviewsHtml = '<span class="mdl-chip" style="margin: auto; margin-top: 16px; display: table;"><span class="mdl-chip__text">Nothing Found</span></span>';
            }
            $("#info-iframe").contents().find('#malReviews').html(reviewsHtml).show();
            $("#info-iframe").contents().find('.js-toggle-review-button').addClass('nojs').click(function(){
                var revID = $(this).attr('data-id');
                $("#info-iframe").contents().find('#review'+revID).css('display','initial');
                $("#info-iframe").contents().find('#revhelp_output_'+revID).remove();
                $(this).remove();
            });
            $("#info-iframe").contents().find('.mb8 a').addClass('nojs').click(function(){
                var revID = $(this).attr('onclick').split("$('")[1].split("'")[0];
                $("#info-iframe").contents().find(revID).toggle();
            });
        }catch(e) {console.log('[iframeReview] Error:',e);}
    }

    function iframeEpisode(url, data){
        getAjaxData(url+'/episode', function(data){
            try{
                $("#info-iframe").contents().find('#loadEpisode').hide();
                var episodesBlock = data.split('mt8 episode_list js-watch-episode-list ascend">')[1].split('</table>')[0];
                var episodesHtml = '<div class="mdl-grid">\
                        <div class="mdl-cell mdl-cell--12-col mdl-shadow--4dp">\
                            <table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">'+episodesBlock+'</table>\
                        </div>\
                    </div>';
                $("#info-iframe").contents().find('#malEpisodes').html(episodesHtml).show();
                $("#info-iframe").contents().find('#malEpisodes .episode-video, #malEpisodes .episode-forum').remove();
            }catch(e) {console.log('[iframeEpisode] Error:',e);}
        });

    }

    function iframeRecommendations(url, data){
        getAjaxData(url+'/userrecs', function(data){
            try{
                $("#info-iframe").contents().find('#loadRecommendations').hide();
                var recommendationsBlock = data.split('Make a recommendation</a>')[1].split('</h2>')[1].split('<div class="mauto')[0];
                var html = $.parseHTML( recommendationsBlock );
                var recommendationsHtml = '<div class="mdl-grid">';
                $.each($(html).filter('.borderClass'), function( index, value ) {
                    recommendationsHtml += '<div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-shadow--4dp mdl-grid">';
                        recommendationsHtml += '<div class="mdl-card__media" style="background-color: transparent; margin: 8px;">';
                            recommendationsHtml += $(this).find('.picSurround').html();
                        recommendationsHtml += '</div>';
                        recommendationsHtml += '<div class="mdl-cell" style="flex-grow: 100;">';
                            recommendationsHtml += '<div class="">';
                                $(this).find('.button_edit, .button_add, td:eq(1) > div:eq(1) span').remove();
                                recommendationsHtml += $(this).find('td:eq(1) > div:eq(1)').html();
                            recommendationsHtml += '</div>';
                            recommendationsHtml += '<div class="">';
                                $(this).find('a[href^="/dbchanges.php?go=report"]').remove();
                                recommendationsHtml += $(this).find('.borderClass').html();
                            recommendationsHtml += '</div>';
                            recommendationsHtml += '<div class="">';
                                recommendationsHtml += (typeof $(this).find('.spaceit').html() != 'undefined') ? $(this).find('.spaceit').html() : '';
                                recommendationsHtml += '<div class="more" style="display: none;">';
                                    recommendationsHtml += $(this).find('td:eq(1) > div').last().html();
                                recommendationsHtml += '</div>';
                            recommendationsHtml += '</div>';
                        recommendationsHtml += '</div>';
                        /*recommendationsHtml += '<div class="mdl-card__supporting-text mdl-card--border" style="color: black;">';
                            $(this).find('.spaceit > div').css('max-width','60%');
                            recommendationsHtml += $(this).find('.spaceit').first().html();
                        recommendationsHtml += '</div>';
                        recommendationsHtml += '<div class="mdl-card__supporting-text" style="color: black;">';
                            $(this).find('.textReadability, .textReadability > span').contents().filter(function(){
                                return this.nodeType == 3 && $.trim(this.nodeValue).length;
                            }).wrap('<p style="margin:0;padding=0;"/>');
                            $(this).find('br').css('line-height','10px');
                            recommendationsHtml += $(this).find('.textReadability').html();
                        recommendationsHtml += '</div>';*/
                        //recommendationsHtml += $(this).html();
                    recommendationsHtml += '</div>';
                });
                recommendationsHtml += '</div>';

                if(recommendationsHtml == '<div class="mdl-grid"></div>'){
                    recommendationsHtml = '<span class="mdl-chip" style="margin: auto; margin-top: 16px; display: table;"><span class="mdl-chip__text">Nothing Found</span></span>';
                }
                $("#info-iframe").contents().find('#malRecommendations').html(recommendationsHtml).show();
                $("#info-iframe").contents().find('.js-similar-recommendations-button').addClass('nojs').click(function(){$(this).parent().find('.more').toggle();});
                $("#info-iframe").contents().find('.js-toggle-recommendation-button').addClass('nojs').click(function(){
                    var revID = $(this).attr('data-id');
                    $("#info-iframe").contents().find('#recommend'+revID).css('display','initial');
                    $(this).remove();
                });
                fixIframeLink();
                $("#info-iframe").contents().find('#malRecommendations a[href^="https://myanimelist.net/anime/"],#malRecommendations a[href^="https://myanimelist.net/manga/"]').each(function() {
                    $(this).click(function(e) {
                        $("#info-iframe").contents().find('.malClear').hide();
                        $("#info-iframe").contents().find('.mdl-progress__indeterminate').show();
                        $("#info-iframe").contents().find("#backbutton").show();
                        $("#info-iframe").contents().find('#SearchButton').css('margin-left', '-17px');
                        $("#info-iframe").contents().find('#book').css('left', '40px');
                        $("#info-iframe").contents().find('.mdl-layout__tab:eq(0) span').trigger( "click" );
                        fillIframe($(this).attr('href'));
                    }).attr('onclick','return false;');
                });
                $("#info-iframe").contents().find('#malRecommendations .more .borderClass').addClass('mdl-shadow--2dp').css('padding','10px');
                $("#info-iframe").contents().find('.lazyload').each(function() { $(this).attr('src', $(this).attr('data-src'));});//TODO: use lazyloading
            }catch(e) {console.log('[iframeRecommendations] Error:',e);}
        });

    }

    function executejs(string){
        var rawframe = document.getElementById('info-iframe');
        var framedoc = rawframe.contentDocument;
        if (!framedoc && rawframe.contentWindow) {
            framedoc = rawframe.contentWindow.document;
        }
        var script = document.createElement('script');
        script.type = "text/javascript";
        //script.src = "https://code.getmdl.io/1.3.0/material.min.js";
        script.text  = string;
        framedoc.body.appendChild(script);
    }

    function materialCheckbox(option, string, text, header = false){
        var check = '';
        var sty = '';
        if(option == 1) check = 'checked';
        if(header) sty = 'font-size: 24px; font-weight: 300; line-height: normal;';
        var item =  '<li class="mdl-list__item">\
                        <span class="mdl-list__item-primary-content" style="'+sty+'">\
                            '+text+'\
                        </span>\
                        <span class="mdl-list__item-secondary-action">\
                            <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="'+string+'">\
                                <input type="checkbox" id="'+string+'" class="mdl-switch__input" '+check+' />\
                            </label>\
                        </span>\
                    </li>';
        return item;
    }

    function getAjaxData(url, callback){
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: false,
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            onload: function(response) {
                callback(response.responseText);
            }
        });
    }

    function fixIframeLink(){
        $("#info-iframe").contents().find('#material a').not('[href^="http"],[href^="https"],[href^="mailto:"],[href^="#"],[href^="javascript"]').each(function() {
            $(this).attr('href', function(index, value) {
                if (value.substr(0,1) !== "/") {
                    value = window.location.pathname + value;
                }
                return "https://myanimelist.net" + value;
            });
        });
        $("#info-iframe").contents().find('a').not(".nojs").attr('target','_blank');
    }

    function searchMal(keyword, type = 'all', selector, callback){
        $("#info-iframe").contents().find(selector).html('');
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://myanimelist.net/search/prefix.json?type='+type+'&keyword='+keyword+'&v=1',
            synchronous: false,
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            onload: function(response) {
                var searchResults = $.parseJSON(response.response);
                $("#info-iframe").contents().find(selector).append('<div class="mdl-grid"></div>');
                $.each(searchResults, function() {
                    $.each(this, function() {
                        $.each(this, function() {
                            $.each(this, function() {
                                if(typeof this['name'] != 'undefined'){
                                    $("#info-iframe").contents().find(selector+' > div').append('<div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-shadow--2dp mdl-grid searchItem" malhref="'+this['url']+'" style="cursor: pointer;">\
                                        <img src="'+this['thumbnail_url']+'" style=""></img>\
                                        <div style="flex-grow: 100; cursor: pointer; margin-top: 0; margin-bottom: 0;" class="mdl-cell">\
                                          <span style="font-size: 20px; font-weight: 400; line-height: 1;">'+this['name']+'</span>\
                                          <p style="margin-bottom: 0;">'+this['payload']['score']+'</p>\
                                          <p style="margin-bottom: 0;">'+this['payload']['start_year']+'</p>\
                                        </div>\
                                      </div>');
                                }
                            });
                        });
                    });
                });
                callback();
            }
        });
    }

    function iframeBookmarks(element){
        element.html('<div id="loadRecommendations" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>');
        executejs('componentHandler.upgradeDom();');

        getMalXml("", function(bookXML){
          var bookmarkHtml = '<div class="mdl-grid" style="justify-content: center;">';
          bookXML.find('my_status:contains(1)').parent().each(function(){
            var malUrl = 'https://myanimelist.net/anime/'+$(this).find('series_animedb_id').first().text()+'/'+$(this).find('series_title').first().text();
            var progressProcent = ( $(this).find('my_watched_episodes').first().text() / $(this).find('series_episodes').first().text() ) * 100;
            bookmarkHtml +='<div class="mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone mdl-shadow--2dp mdl-grid bookEntry" malhref="'+malUrl+'" style="cursor: pointer; height: 250px; padding: 0; width: 210px; height: 293px;">';
              bookmarkHtml +='<div class="data title" style="background-image: url('+$(this).find('series_image').first().text()+'); background-size: cover; background-position: center center; background-repeat: no-repeat; width: 100%; position: relative; padding-top: 5px;">';
                bookmarkHtml +='<span class="mdl-shadow--2dp" style="position: absolute; bottom: 0; display: block; background-color: rgba(255, 255, 255, 0.9); padding-top: 5px; display: inline-flex; align-items: center; justify-content: space-between; left: 0; right: 0; padding-right: 8px; padding-left: 8px; padding-bottom: 8px;">'+$(this).find('series_title').first().text();
                  bookmarkHtml +='<div id="p1" class="mdl-progress" style="position: absolute; top: -4px; left: 0;"><div class="progressbar bar bar1" style="width: '+progressProcent+'%;"></div><div class="bufferbar bar bar2" style="width: 100%;"></div><div class="auxbar bar bar3" style="width: 0%;"></div></div>';
                  bookmarkHtml +='<div class="data progress mdl-chip mdl-chip--contact mdl-color--indigo-100" style="float: right; line-height: 20px; height: 20px; padding-right: 4px; margin-left: 5px;">';
                    bookmarkHtml +='<div class="link mdl-chip__contact mdl-color--primary mdl-color-text--white" style="line-height: 20px; height: 20px; margin-right: 0;">'+$(this).find('my_watched_episodes').first().text()+'</div>';
                  bookmarkHtml +='</div>';
                bookmarkHtml +='</span>';
                bookmarkHtml +='<div class="tags" style="display: none;">'+$(this).find('my_tags').first().text()+'</div>';
              bookmarkHtml +='</div>';
            bookmarkHtml +='</div>';
          });

          //flexbox placeholder
          for(var i=0; i < 10; i++){
              bookmarkHtml +='<div class="mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone mdl-shadow--2dp mdl-grid "  style="cursor: pointer; height: 250px; padding: 0; width: 210px; height: 0px; margin-top:0; margin-bottom:0; visibility: hidden;"></div>';
          }

          bookmarkHtml += '</div>'
          element.html( bookmarkHtml );

          $("#info-iframe").contents().find('.bookEntry').each(function() {
            if($(this).find('.tags').text().indexOf("last::") > -1 ){
              var url = atobURL( $(this).find('.tags').text().split("last::")[1].split("::")[0] );
              setStreamLinks(url, $(this));
            }
          });

          $("#info-iframe").contents().find("#malSearchPop .bookEntry").unbind('click').click(function(event) {
            $("#info-iframe").contents().find('#book').click();
            $("#info-iframe").contents().find('.malClear').hide();
            $("#info-iframe").contents().find('.mdl-progress__indeterminate').show();
            $("#info-iframe").contents().find("#backbutton").show();
            $("#info-iframe").contents().find('#SearchButton').css('margin-left', '-17px');
            $("#info-iframe").contents().find('#book').css('left', '40px');
            $("#info-iframe").contents().find('.mdl-layout__tab:eq(0) span').trigger( "click" );
            fillIframe($(this).attr('malhref'));
          });

        });
    }
