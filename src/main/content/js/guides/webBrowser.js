var webBrowser = (function(){

  var webURL = "";
  var webContent = "";         // HTML content of the web browser widget
  var contentRootElement = null;

  var noContentFiller = "<div> NO CONTENT </div>";

  var __create = function(container, stepName, content) {
    if (content.url) {
      webURL = content.url;
    } else {
      webURL = "";
    }

    if (content.browserContent) {
      webContent = content.browserContent;
    } else  {
      webContent = noContentFiller;
    }

    container.load('../html/guides/webBrowser.html', function(responseText, statusText, xhr) {
      if (statusText === 'success') {
        contentRootElement = container.find('.wb');
        __setURL(webURL);        
        __setBrowserContent(webContent);
      } else {
        // if (statusText === 'error') 
        console.log(responseText);
        console.log(statusText);
      }

    });

  };

  var __setURL = function(URLvalue) {
      contentRootElement.find('.wbNavURL').val(webURL);
  };

  var __setBrowserContent = function(content) {
 //   $('#browserIframe').attr('src', content);
    var webContentElement = contentRootElement.find('.wbContent');
    var file = content.substring(content.length - 4).toLowerCase() === 'html' ? true: false;
    if (file) {
      var fileLocation = '../js/guides/wbFiles/' + content;
      webContentElement.load(fileLocation, function(responseText, statusText, xhr) {
        if (statusText !== 'success') {  // If we can't find HTML file, post 'No Content'
          webContentElement.html(noContentFiller);
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
