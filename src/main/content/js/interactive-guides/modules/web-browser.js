var webBrowser = (function(){

  var webBrowserType = function(container, stepName, content) {
    this.stepName = stepName;
    this.contentRootElement = null;
    this.updatedURLCallback = null;    // User-defined callback function
                                       // invoked when the URL is updated

    if (content.url) {
      this.webURL = content.url;
    } else {
      this.webURL = "";
    }

    if (content.browserContent) {
      this.webContent = content.browserContent;
    } else {
      this.webContent = "";
    }
    
    __loadAndCreate(this, container, stepName, content);
  };

  webBrowserType.prototype = {
    noContentFiller: "<div> NO CONTENT </div>",

    setURL:  function(URLvalue) {
      if (!URLvalue) {
        URLvalue = "";
      }
      this.contentRootElement.find('.wbNavURL').val(URLvalue);
    },
    getURL:  function() {
      return this.contentRootElement.find('.wbNavURL').val();
    },

    setBrowserContent: function(content) {
      var $webContentElement = this.contentRootElement.find('.wbContent');
      var $iframe = $webContentElement.find('iframe');

      if (!content) {
        $iframe.attr('src', "about:blank");
        return;
      }

      var extension = content.substring(content.length - 4).toLowerCase();
      var file =  extension === 'html' || extension === 'htm' ? true: false;
      if (file) {
        var fileLocation = '../html/interactive-guides/' + content;
        var $iframe = $webContentElement.find('iframe');
        $iframe.attr('src', fileLocation);

        /* Do we need to try to see if the file is available? 
           We should know 'content' is available as an author of the guide.
           This basically fetches the same data twice....a waste?  
        $(function(){
          $.ajax({
            type: "HEAD",
            async: false,
            url: fileLocation
          })
          .success(function() {
            $iframe.attr('src', fileLocation);
          })
          .error(function() {
            // Handle error ... show 404 or 500 message?
          })
        });  */
      } else {
        $iframe.attr('src', "about:blank");
      }
    },
    getIframeDOM: function() {
      var $iframe = this.contentRootElement.find('.wbContent').find('iframe');
      var iFrameDOM = $iframe.contents();
      return iFrameDOM;
    },

    simulateBrowserRefresh: function() {
      if (this.updatedURLCallback) {
        this.updatedURLCallback(this.getURL());
      } else {   // This webBrowser does not support URL changes.  Redisplay current HTML.
        this.setURL(this.webURL);
        this.setBrowserContent(this.webContent);
      }      
    },

    getStepName: function() {
      return this.stepName;
    },

    // Registers a callback method with this webBrowser
    // instance.  It will be invoked when the URL is updated
    // or the Refresh button is selected and will receive the 
    // navbar URL value as a parameter.  The function can 
    // then identify the browser contents associated with the
    // URL value.
    addUpdatedURLListener: function(callback) {
       this.updatedURLCallback = callback;
    },

    setURLFocus: function() {
      this.contentRootElement.find('.wbNavURL').focus();
    }

  };


  var __loadAndCreate = function(thisWebBrowser, container, stepName, content) {
      $.ajax({
        context: thisWebBrowser,
        url: "../html/interactive-guides/webBrowser.html",
        async: false,
        success: function(result) {
          container.append($(result));
          this.contentRootElement = container.find('.wb');
          var $wbNavURL = this.contentRootElement.find('.wbNavURL');
          var $wbContent = this.contentRootElement.find('.wbContent');

          // set aria labels
          this.contentRootElement.attr('aria-label', messages.browserSample);
          $wbNavURL.attr('aria-label', messages.browserAddressBar);
          $wbContent.attr('aria-label', messages.browserContentIdentifier);
          this.contentRootElement.find('.wbRefreshButton').attr('aria-label', messages.browserRefreshButton);

          // Select URL text when in focus
          $wbNavURL.focus(function() {
              $(this).select();
          });

          if (content.callback) {
            var callback = eval(content.callback);
            // Identify this webBrowser with the updatedURLCallback
            // function specified by the user.
            callback(thisWebBrowser);
          }

          __addBrowserListeners(thisWebBrowser);

          // fill in contents
          this.setURL(this.webURL);        
          this.setBrowserContent(this.webContent);
        },
        error: function(result) {
          console.error("Could not load webBrowser.html");
        }
      });
  };

  var __addBrowserListeners = function(thisWebBrowser) {
    var urlField = thisWebBrowser.contentRootElement.find('.wbNavURL');
    urlField.on("keydown", function(event) {
      if (event.which === 13) {  // Enter key
        if (thisWebBrowser.updatedURLCallback) {
          thisWebBrowser.updatedURLCallback(thisWebBrowser.getURL());
        }  else {
          // else, reset to original.  This webBrowser instance does
          // not support URL changes.
          thisWebBrowser.setURL(thisWebBrowser.webURL);
          thisWebBrowser.setBrowserContent(thisWebBrowser.webContent);
        }
      }
    });

    var refreshButton = thisWebBrowser.contentRootElement.find('.wbRefreshButton');
    if (thisWebBrowser.updatedURLCallback) {
      refreshButton.on("click", function(event) {
        event.stopPropagation();
        thisWebBrowser.updatedURLCallback(thisWebBrowser.getURL());
      });
    } else {   // This webBrowser does not support URL changes.  Redisplay current HTML.
      console.log(thisWebBrowser.webURL);
      console.log(thisWebBrowser.webContent);
      refreshButton.on("click", function(event) {
        thisWebBrowser.setURL(thisWebBrowser.webURL);
        thisWebBrowser.setBrowserContent(thisWebBrowser.webContent);
      });
    }
  };

  var __create = function(container, stepName, content) {
    return new webBrowserType(container, stepName, content);
  };

  return {
    create: __create
  };
})();
