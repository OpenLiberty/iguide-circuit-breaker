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
    
// Need a mapping of URLs to pages?

    __loadAndCreate(this, container, stepName, content);
  }

  webBrowserType.prototype = {
    noContentFiller: "<div> NO CONTENT </div>",

    __setURL:  function(URLvalue) {
      if (!URLvalue) {
        URLvalue = "";
      }
      this.contentRootElement.find('.wbNavURL').val(URLvalue);
    },
    __getURL:  function() {
      return this.contentRootElement.find('.wbNavURL').val();
    },

    __setBrowserContent: function(content) {
      //   $('#browserIframe').attr('src', content);
      if (!content) {
        content = "";
      }
      var webContentElement = this.contentRootElement.find('.wbContent');
      var file = content.substring(content.length - 4).toLowerCase() === 'html' ? true: false;
      if (file) {
        var fileLocation = '../js/guides/wbFiles/' + content;
        $.ajax({
          context: webContentElement,
          url: fileLocation,
          async: false,
          success: function(result) {
           this.html($(result));
          },
          error: function(result) {
            console.error("Could not load content for file " + file);
            this.html("<div>Page could not be found. </div>");
          }
        });
      } else {   
        webContentElement.html(content);
      }
    },

    // Registers a callback method with this webBrowser
    // instance.  It will be invoked when the URL is updated
    // or the Refresh button is selected and will receive the 
    // navbar URL value as a parameter.  The function can 
    // then identify the browser contents associated with the
    // URL value.
    addUpdatedURLListener: function(callback) {
       this.updatedURLCallback = callback;
    }

  };


  var __loadAndCreate = function(thisWebBrowser, container, stepName, content) {
      $.ajax({
        context: thisWebBrowser,
        url: "../html/guides/webBrowser.html",
        async: false,
        success: function(result) {
          container.append($(result));
          this.contentRootElement = container.find('.wb');
          $wbNavURL = this.contentRootElement.find('.wbNavURL');
          $wbContent = this.contentRootElement.find('.wbContent');

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
          this.__setURL(this.webURL);        
          this.__setBrowserContent(this.webContent);
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
          thisWebBrowser.updatedURLCallback(thisWebBrowser.__getURL());
        }  // else, don't do anything.  This webBrowser instance does
           // not support URL changes.
      }
    });

    var refreshButton = thisWebBrowser.contentRootElement.find('.wbRefreshButton');
    if (thisWebBrowser.updatedURLCallback) {
      refreshButton.on("click", function(event) {
        event.stopPropagation();
        thisWebBrowser.updatedURLCallback(thisWebBrowser.__getURL());
      });
    } else {   // This webBrowser does not support URL changes.  Redisplay current HTML.
      console.log(thisWebBrowser.webURL);
      console.log(thisWebBrowser.webContent);
      refreshButton.on("click", function(event) {
        thisWebBrowser.__setURL(thisWebBrowser.webURL);
        thisWebBrowser.__setBrowserContent(thisWebBrowser.webContent);
      });
    }
  };

  var __create = function(container, stepName, content) {
    return new webBrowserType(container, stepName, content);
  };

  return {
    create: __create
  }
})();
