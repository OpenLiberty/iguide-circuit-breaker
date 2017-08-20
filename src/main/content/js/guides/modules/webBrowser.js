var webBrowser = (function(){

  var webBrowserType = function(container, stepName, content) {
    this.stepName = stepName;
    this.contentRootElement = null;

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
      return this.contentRootElement.find('.wbNavBar').val();
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

          // Select URL text when in focus
          $wbNavURL.focus(function() {
              $(this).select();
          });

          // set aria labels
          this.contentRootElement.attr('aria-label', messages.browserSample);
          $wbNavURL.attr('aria-label', messages.browserAddressBar);
          this.contentRootElement.find('.wbContent').attr('aria-label', messages.browserContentIdentifier);
          this.contentRootElement.find('.wbRefreshButton').attr('aria-label', messages.browserRefreshButton);
          // fill in contents
          this.__setURL(this.webURL);        
          this.__setBrowserContent(this.webContent);
        },
        error: function(result) {
          console.error("Could not load webBrowser.html");
        }
      });
  };

  var __create = function(container, stepName, content) {
    return new webBrowserType(container, stepName, content);
  };

  return {
    create: __create
  }
})();
