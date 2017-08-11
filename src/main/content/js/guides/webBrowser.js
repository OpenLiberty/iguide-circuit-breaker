var webBrowser = (function(){

  var webURL = "";
  var webContent = "";         // HTML content of the web browser widget
  var webContentSource = "";   // File or Inline

  var __create = function(container, content) {
    if (content.url) {
      webURL = content.url;
    } else {
      webURL = "";
    }

    if (content.browserFileContent) {
      webContentSource = 'File';
      webContent = content.browserFileContent;
    } else  if (content.browserContent) {
      webContentSource = 'Inline';
      webContent = content.browserContent;
    } else {
      webContentSource = 'Inline';
      webContent = "<div> NO CONTENT </div>";
    }

    container.load('../html/guides/webBrowser.html', function(responseText, statusText, xhr) {
      if (statusText === 'success') {
        __setURL(webURL);        
        __setBrowserContent(webContentSource, webContent);
      } else {
        // if (statusText === 'error') 
        console.log(responseText);
        console.log(statusText);
        console.log(xhr);
      }

    });

  };

  var __setURL = function(URLvalue) {
    $('#browserURL').val(webURL);
  };

  var __setBrowserContent = function(contentType, content) {
 //   $('#browserIframe').attr('src', content);
    if (contentType === 'Inline') {
      $('#browserContent').append(content);
    } else {
      var fileLocation = '../js/guides/wbFiles/' + content;
      $('#browserContent').load(fileLocation);
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
