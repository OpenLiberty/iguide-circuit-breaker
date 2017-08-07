var fileBrowser = (function(){

  var _fileStructure = []; // JSON of the file browser structure
  var _fileBrowserRoot;

  var __create = function(container, fileTree) {
      _fileBrowserRoot = $("<div class='fileBrowser'></div>");
      container.append(_fileBrowserRoot);
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
              found = __findElement(name, children[j]);
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
  var __addFileElement = function(elem, parent, isDirectory){
    var $domElem = $("<div></div");
    var name = isDirectory ? elem.name : elem;
    $domElem.text(name);
    $domElem.attr('aria-label', name);
    $domElem.attr('tabindex', '0');
    $domElem.attr('data-name', name);
    $domElem.addClass('fileBrowserElement');

    var elemStructure;
    if(isDirectory){
      elemStructure = {};
      elemStructure.name = elem.name;
      elemStructure.files = [];
      $domElem.addClass('fileBrowserDirectory');
    }
    else{
      elemStructure = elem;
      $domElem.addClass('fileBrowserFile');
    }

    // If no parent is specified then create the element under the root level
    if(!parent){
      $domElem.attr('data-treeLevel', 1);
      _fileStructure.push(elemStructure);
      _fileBrowserRoot.append($domElem);
    }
    else{
      // Find the parent element in the fileBrowser object
      var parentDir = __findElement(parent, _fileStructure);
      var $parentDomElem = __getDomElement(parent);
      var treeLevel = $parentDomElem.attr('data-treeLevel');
      $domElem.attr('data-treeLevel', treeLevel + 1);
      $parentDomElem.append($domElem);

      // Only if the parent is a directory, add the file under it. If the parent is not a directory,
      // then we can't add the new file to it so add it to the root level directory.
      if(typeof(parentDir) === 'object'){
        parentDir.files.push(elemStructure);
      }
      else{
        _fileStructure.push(elemStructure);
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
