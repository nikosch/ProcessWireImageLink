

/*

Image modal Interface

Would be nice to see something like this native in image tool

*/

function ModalImageManager (pageId) {
  
  this.pageId = pageId;

  this.jIframe;
  this.iframeContent;
  this.iframeModus; // select | image

  this.config = {

      uri       : ProcessWire.config.urls.admin + 'page/image/'
    , selectors : {
          image           : '#selected_image'
        , captionWrapper  : '#wrap_caption'
        , linkWrapper     : '#wrap_link_original'
        , cbLink          : '#selected_image_link'
        , cbHiDpi         : '#selected_image_hidpi'
        , cbCaption       : '#selected_image_caption'
        , inDescription   : '#selected_image_description'
        , inRotation      : '#selected_image_rotate'
        , inPageId        : '#page_id'
      }

    , titles : {
          select : '<i class="fa fa-fw fa-folder-open"></i> '     + ProcessWire.config.InputfieldImageLink.pwimage.selectLabel // 'Select Image'
        , saving : '<i class="fa fa-fw fa-spin fa-spinner"></i> ' + ProcessWire.config.InputfieldImageLink.pwimage.savingNote  // Saving Image
        , image  : '<i class="fa fa-fw fa-picture-o"></i> ' 
      }

    , buttons : {
          insert : '<i class="fa fa-camera"></i> '       + ProcessWire.config.InputfieldImageLink.pwimage.insertBtn  // 'Insert This Image'
        , select : '<i class="fa fa-folder-open"></i> '  + ProcessWire.config.InputfieldImageLink.pwimage.selectBtn  // 'Select Another Image'
        , cancel : '<i class="fa fa-times-circle"></i> ' + ProcessWire.config.InputfieldImageLink.pwimage.cancelBtn  // 'Cancel'
      }
  };
}

ModalImageManager.prototype = {

    init : function (imageProperties) {

      if (imageProperties) {
        this.pageId = imageProperties.pageId;
      }

      var that       = this;
      var editPageId = this.pageId;
      
      var modalSettings = {
          title  : this.config.titles.select
        , open   : function() {}
      };


      var modalUri = this.config.uri + '?modal=1' + '&id=' + this.pageId + '&edit_page_id=' + editPageId;

      if (imageProperties) {

        if (imageProperties.file.length) modalUri += '&file='   + imageProperties.file; 
        if (imageProperties.width)       modalUri += '&width='  + imageProperties.width; 
        if (imageProperties.height)      modalUri += '&height=' + imageProperties.height; 
        if (imageProperties['class'] && imageProperties['class'].length) modalUri += '&class=' + encodeURIComponent(imageProperties['class']); 
        modalUri += '&hidpi=' + (imageProperties.hidpi ? '1' : '0'); 
        /*
        if(imgDescription && imgDescription.length) {
          modalUri += "&description=" + encodeURIComponent(imgDescription);
        }
        if($figureCaption) modalUri += "&caption=1";
        if(imgLink && imgLink.length) modalUri += "&link=" + encodeURIComponent(imgLink);
        */
        modalUri += ('&winwidth=' + (jQuery (window).width () - 30)); 
      }


      this.jIframe = pwModalWindow (modalUri , modalSettings , 'large');

      this.jIframe.load (function () {

        that.iframeContent = that.jIframe.contents ();
      
        if (that.iframeContent.find (that.config.selectors.image).size () > 0) {
          that.iframeModus = 'image';
          that.prepareIframeImage ();
        } else {
          that.iframeModus = 'select';
          that.prepareIframeSelect ();
        }
      });
    }


  , prepareIframeImage : function () {

        var that = this;

        that.iframeContent.find (this.config.selectors.captionWrapper).hide ();
        that.iframeContent.find (this.config.selectors.linkWrapper).hide ();

        var buttonInsert =  {

                'html'  : that.config.buttons.insert
              , 'click' :  function () {

                             var jImage = jQuery (that.config.selectors.image , that.iframeContent); 

                             that.jIframe.dialog ('disable');
                             that.jIframe.setTitle (that.config.titles.saving); 
                             
                             jImage.removeClass ('resized'); 

                             var imageProperties = that.getImageProperties (jImage , that.iframeContent);
                             var resizeURL       = that.getResizeQuery (imageProperties);
                             
                             jQuery.get (resizeURL , function (data) {
                               var jDiv = jQuery ('<div></div>').html (data); 
                               var src  = jDiv.find (that.config.selectors.image).attr ('src');
                               // that.responseData (src); 
                               if (true == that.responseData (imageProperties)) {
                                 that.jIframe.dialog ("close"); 
                               } 
                             }); 
                           }
            };


        var buttonSelect = {

                'html'  : that.config.buttons.select
              , 'class' : 'ui-priority-secondary'
              , 'click' : function () {
                            var iframeContent = that.jIframe.contents ();
                            var pageId = jQuery (that.config.selectors.inPageId , iframeContent).val ();
                            that.jIframe.attr ('src' , that.config.uri + '?id=' + pageId + '&modal=1'); 
                            that.jIframe.setButtons ({}); 
                          }
            };


        var buttonCancel = {

                'html'  : this.config.buttons.cancel
              , 'class' : 'ui-priority-secondary'
              , 'click' : function () { that.jIframe.dialog ('close'); }
            };

        this.jIframe.setButtons ([ buttonInsert , buttonSelect , buttonCancel ]); 
        this.jIframe.setTitle (this.config.titles.image + this.iframeContent.find ('title').html ());
    }


  , prepareIframeSelect : function () {

        var that    = this;
        var buttons = [];
        
        // copy existing buttons 
        
        jQuery ('button.pw-modal-button , button[type=submit]:visible' , this.iframeContent).each (function () {
          var jButton = jQuery(this);
          var button = {
                  'html'  : jButton.html ()
                , 'click' : function () {
                              jButton.click ();
                            }
              };

          if (! jButton.hasClass ('pw-modal-button-visible')) {
            jButton.hide ();
          }

          buttons.push (button);
        });

        var cancelButton = {
                'html'  : this.config.buttons.cancel
              , 'class' : 'ui-priority-secondary'
              , 'click' : function () { that.jIframe.dialog ('close'); }
            };

        buttons.push (cancelButton);
        this.jIframe.setButtons (buttons);
    }


  , open : function (jInput) {
    }


  , close : function () {
      this.jIframe.dialog ('close'); 
    }

  , disable : function () {
      this.jIframe.dialog ('disable'); 
    }

  , responseData : function (imageProperties) {
      // do your stuff here
      console.log (imageProperties);
      // return true to submit and close window
      return true;
    }


  , getResizeQuery : function (imageProperties) {

        var resizeURL = this.config.uri + 'resize' +
                        '?id='     + imageProperties.pageId + 
                        '&file='   + imageProperties.file   + 
                        '&width='  + imageProperties.width  + 
                        '&height=' + imageProperties.height + 
                        '&hidpi='  + (imageProperties.hidpi ? 1 : 0) ;

        if (imageProperties.editing['rotate']) {
          resizeURL += '&rotate=' + imageProperties.editing.rotate; 
        }

        if (imageProperties.editing['flip-h']) {
          resizeURL += '&flip=h'; 
        } else {
          if (imageProperties.editing['flip-v']) {
            resizeURL += '&flip=v';
          }
        }

        return resizeURL;
    }


  ,  parseCropping : function (fileName) {
       var expression = /\.(\d+)x(\d+).*?-crop[xy](\d+)[xy](\d+)[-.]/;
       var isCropped = null !== expression.exec (fileName);
       return {
          'crop'   : isCropped
        , 'crop-x' : RegExp.$3
        , 'crop-y' : RegExp.$4
        , 'crop-w' : RegExp.$1
        , 'crop-h' : RegExp.$2
       };
    }
    
  , getImageProperties : function (jImage , jIframeContent) {

        var that    = this;

        var jImage                = jQuery (that.config.selectors.image         , jIframeContent);
        var jCheckboxLinkToLarger = jQuery (that.config.selectors.cbLink        , jIframeContent); 
        var jCheckboxHiDpi        = jQuery (that.config.selectors.cbHiDpi       , jIframeContent); 
        var jCheckboxCaption      = jQuery (that.config.selectors.cbCaption     , jIframeContent); 
        var jInputDescription     = jQuery (that.config.selectors.inDescription , jIframeContent); 
        var jInputRotation        = jQuery (that.config.selectors.inRotation    , jIframeContent); 
        var jInputPageId          = jQuery (that.config.selectors.inPageId      , jIframeContent); 

        var flipHorizontal = jImage.hasClass ('flip_horizontal');
        var flipVertical   = jImage.hasClass ('flip_vertical');

        var src = jImage.attr ('src');
        var cls = jImage
                    .removeClass ('ui-resizable No Alignment resizable_setup') 
                    .removeClass ('rotate90 rotate180 rotate270 rotate-90 rotate-180 rotate-270')
                    .removeClass ('flip_vertical flip_horizontal')
                    .attr ('class')
                  ;

        var imageProperties = {
                'identifier' : jImage.data ('idname')
              , 'pageId'     : jInputPageId.val ()
              , 'src'        : src
              , 'file'       : src.substring (src.lastIndexOf ('/') + 1)
              , 'origin'     : jCheckboxLinkToLarger.val ()
              , 'width'      : jImage.attr ('width')
              , 'height'     : jImage.attr ('height')
              , 'widthAuto'  : jImage.attr ('width') == 0
              , 'linkOrigin' : jCheckboxLinkToLarger.is (':checked')
              , 'alt'        : jInputDescription.val ()
              , 'caption'    : jCheckboxCaption.is (':checked')
              , 'hidpi'      : jCheckboxHiDpi.is (':checked')
              , 'editing' : {
                    'rotate' : parseInt (jInputRotation.val ())
                  , 'flip-h' : flipHorizontal
                  , 'flip-v' : flipVertical
                  , 'crop'   : false
                  , 'crop-x' : 0
                  , 'crop-y' : 0
                  , 'crop-w' : 0
                  , 'crop-h' : 0
                }
              , 'class'      : cls
            };

        if (! imageProperties.width) {
          imageProperties.width  = jImage.width ();
        }

        if (! imageProperties.height) {
          imageProperties.height = jImage.height ();
        }

        if (imageProperties.file) {
          var cropping = this.parseCropping (imageProperties.file);
          
          if (cropping.crop) {
            imageProperties.editing['crop-x'] = cropping['crop-x'];
            imageProperties.editing['crop-y'] = cropping['crop-y'];
            imageProperties.editing['crop-w'] = cropping['crop-w'];
            imageProperties.editing['crop-h'] = cropping['crop-h'];
          }
        }

        return imageProperties;
  }


};


(function ($) {

    function InputfieldImageLinkProcessor (jInput) {

        var that = this;

        this.getUIElements (jInput);
        this.preparePreviewContainer ();
        this.init ();

        var pageId = jInput.data ('page-id');


        var magnificOptions = {
            type                : 'image'
          , closeOnContentClick : true
          , closeBtnInside      : true
          , image               : {
              titleSrc: 'title'
            }
          /*
          , callbacks           : {
              open: function() {
              }
            }
          */
        };  

        var imageManager = new ModalImageManager (pageId);

        imageManager.responseData = function (imageProperties) {

          that.jInput
            .val (JSON.stringify (imageProperties))
            .data ('page-id'    , imageProperties.pageId)
            .data ('image-data' , imageProperties)
          ;

          that.updatePreview (imageProperties);
          return true;
        };

        this.jButtonEdit
        //.add (this.jPreviewContainer)
        .click (function () {
          imageManager.init (jInput.data ('image-data'));
        });


        this.jPreviewContainer.click (function() {
          var options = magnificOptions;
          var imageProperties = jInput.data ('image-data');
          options['items'] = { 
              src   : imageProperties.src 
            , title : '' 
          };
          $.magnificPopup.open (options, 0);
          return false;
        });
 
 
        this.jButtonErase.click (function () {

          that.jInput
            .val ('')
            .data ('page-id'    , pageId) // the id of to edit page
            .data ('image-data' , null)
          ;

          that.updatePreview ();
        });


        this.updatePreview (jInput.data ('image-data'));
    }


    InputfieldImageLinkProcessor.prototype = {

        getUIElements : function (jInput) {

          this.jContainer   = jInput.parent ();
          this.jInput       = jInput;
          this.jButtonErase = this.jContainer.find ('.ImageLinkButtonErase').first ();
          this.jButtonEdit  = this.jContainer.find ('.ImageLinkButtonEdit').first ();
        }

      , init : function () {

          var value = this.jInput.val ();
          if (value) {
            this.jInput.data ('image-data' , jQuery.parseJSON (value));
          }
        }

      , preparePreviewContainer : function () {

            // alright, this is messy
            
            this.jPreviewContainer = $(
                    '<div class="InputfieldImageGrid" style="cursor:pointer;display:inline-block;vertical-align: bottom;">'
                    +  '<ul class="InputfieldFileList ui-helper-clearfix ui-sortable">' 
                    +     '<li class="InputfieldFileItem InputfieldImage ui-widget InputfieldFileItemExisting">'
                    +       '<div class="InputfieldImagePreview" style="background: no-repeat scroll center center / cover rgb(255, 255, 255); width: 100px; height: 100px;">'
                    +         '<img style="max-width:100%;display:none;" src="">'
                    +         '<span style="color:#888;padding:2px;background:rgba(255,255,255,.6)"></span>'
                    +       '</div>'
                    +     '</li>'
                    +  '</ul>'
                    + '</div>'
                 );
            
            this.jInput.after (this.jPreviewContainer);

            this.jPreviewImage  = this.jPreviewContainer.find ('img:first');
            this.jImageCropping = this.jPreviewContainer.find ('.InputfieldImagePreview:first');
            this.jImageInfo     = this.jPreviewContainer.find ('span');
        }


      , updatePreview : function (imageProperties) {

          if (imageProperties && imageProperties.src) {
          
            this.jPreviewImage.attr ('src' , imageProperties.src);
            this.jImageCropping.css ('background-image' , 'url(' + imageProperties.src + ')');
            this.jImageInfo.html (' ' + imageProperties.width + 'x' + imageProperties.height);

            this.jPreviewContainer.show ();
            this.jButtonErase.show ();

          } else {
          
            this.jPreviewImage.attr ('src' , '');
            this.jImageCropping.css ('background-image' , '');
            this.jImageInfo.html ('');

            this.jPreviewContainer.hide ();
            this.jButtonErase.hide ();
          }
        }
    }



  jQuery (document).ready (function ($) {

    jQuery("input.FieldtypeImageLink").each (function (n) {
      new InputfieldImageLinkProcessor ($(this));
    });

  }); 

})(jQuery);
