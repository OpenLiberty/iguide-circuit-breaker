var webBrowser = (function(){

  var contentRootElement = null;

  var noContentFiller = "<div> NO CONTENT </div>";

  var __create = function(container, stepName, content) {
    // Set defaults
    var webURL = "";
    var webContent = noContentFiller;

    if (content.url) {
      webURL = content.url;
    } 

    if (content.browserContent) {
      webContent = content.browserContent;
    }

    $.ajax({
      context: container,
      url: "../html/guides/webBrowser.html",
      async: false,
      success: function(result) {
        $(this).append($(result));
        contentRootElement = $(this).find('.wb');
        // set aria labels
        contentRootElement.attr('aria-label', messages.browserSample);
        contentRootElement.find('.wbNavURL').attr('aria-label', messages.browserAddressBar);
        contentRootElement.find('.wbContent').attr('aria-label', messages.browserContentIdentifier);
        contentRootElement.find('.wbRefreshButton').attr('aria-label', messages.browserRefreshButton);
        // fill in contents
        __setURL(webURL);        
        __setBrowserContent(webContent);
      },
      error: function(result) {
        console.error("Could not load webBrowser.html");
      }
    });
  };

  var __setURL = function(URLvalue) {
      contentRootElement.find('.wbNavURL').val(URLvalue);
  };

  var __setBrowserContent = function(content) {
 //   $('#browserIframe').attr('src', content);
    var webContentElement = contentRootElement.find('.wbContent');
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


  };

  /*
    Find the specified name within the file browser JSON.
    Inputs: {String} name: Name of the file/directory to find.
            {Object} dir: Directory
  */

  /*
    Gets the jQuery DOM element using the data-name attribute.
  */
  var __getDomElement = function(name) {
    return $("[data-name='" + name + "']");
  };


  return {
    create: __create,
    setURL: __setURL,
    setBrowserContent: __setBrowserContent
  }
})();
