var fileBrowser = (function(){

  var fileBrowser = []; // JSON of the file browser structure
  var fileBrowserRoot;

  var __create = function(container, fileTree) {
      fileBrowserRoot = $("<div class='fileBrowser'></div>");
      container.apppend(fileBrowserRoot);
  };

  /*
    Find the specified name within the file browser JSON.
    Inputs: {String} name: Name of the file/directory to find.
            {Object} dir: Directory
  */
  var __findElement = function(name, dir){
    var found = null;
    for(var i = 0; i < dir.length; i++){
      var elem = dir[i];
      // If the elem is a directory, check its name
      if(typeof(elem) === 'object'){
        if(elem.name === name){
          return elem;
        }
        else{
          // Check the files/directories under the directory
          if(elem.files){
            var children = elem.files;
            for(var j = 0; j < children.length; j++){
              found = findElement(name, children[j]);
              if(found){
                return found;
              }
            }
          }
        }
      }
      // Elem is a file
      else{
        if(elem === name){
          return elem;
        }
      }
    }

    // If no elements are found in the directory return null
    return found;
  };

  /*
    Gets the jQuery DOM element using the data-name attribute.
  */
  var __getDomElement = function(name) {
    return $("[data-name='" + name + "']");
  };

  /*
    Creates a file or directory and adds it to the file browser.
    Inputs: {String} parent: Name of the parent DOM element.
            {String} name: Name of the new file/directory to be created.
            {Boolean} isDirectory: true if the element will be a directory / false if it is just a file
  */
  var __addFileElement = function(parent, name, isDirectory){
    var $domElem = $("<div></div");
    $domElem.val(name);
    $domElem.attr('aria-label', name);
    $domElem.attr('tabindex', '0');
    $domElem.data('name', name);
    $domElem.addClass('fileBrowserElement');

    var elem;
    if(isDirectory){
      elem = {};
      elem.name = name;
      elem.files = [];
      $domElem.addClass('fileBrowserDirectory');
    }
    else{
      elem = name;
      $domElem.addClass('fileBrowserFile');
    }

    // If no parent is specified then create the element under the root level
    if(!parent){
      fileBrowser.push(elem);
      // Update the DOM
      fileBrowserDirectory.append($domElem);
    }
    else{
      // Find the parent element in the fileBrowser object
      var parentDir = findElement(parent, fileBrowser);
      var treeLevel = parentDir.data('treeLevel');
      $domElem.data('treeLevel', treeLevel + 1);

      // Only if the parent is a directory, add the file under it. If the parent is not a directory,
      // then we can't add the new file to it so add it to the root level directory.
      if(typeof(parentDir) === 'object'){
        parentDir.push(elem);
      }
      else{
        fileBrowser.push(elem);
      }
    }
  };

  var __handleClick = function(name){
    var $elem = __getDomElement(name);
    if($elem.hasClass('fileBrowserDirectory')){
      if($elem.hasClass('directory_collapsed')){
        // Expand the directory and its children
        $elem.removeClass('directory_collapsed');
        $elem.addClass('directory_expanded');
        $elem.children().show();
      }
      else{
        // Collapse directory and its children
        $elem.removeClass('directory_expanded');
        $elem.addClass('directory_collapsed');
        $elem.children().hide();
      }
    }
    else{
      // TODO: Figure out what to do when the user clicks on a file.
    }
  };

  return {
    create: __create,
    addFileElement: __addFileElement
  }
})();
