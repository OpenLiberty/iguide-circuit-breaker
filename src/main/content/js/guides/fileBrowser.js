var fileBrowser = (function(){

  var _fileStructure = []; // JSON of the file browser structure
  var _fileBrowserRoot;

  var __create = function(container, fileTree) {
      _fileBrowserRoot = container.find('.fileBrowser');
      container.append(_fileBrowserRoot);
      container.show();
      __parseTree(fileTree, null);
  };

  var __parseTree = function(fileTree, parent){
      if(!fileTree){
        return;
      }
      for(var i = 0; i < fileTree.length; i++){
        var elem = fileTree[i];
        var isDirectory = elem.type === 'directory';
        __addFileElement(elem, parent ? parent.name : null, isDirectory);
        if(elem.files){
          __parseTree(elem.files, elem, elem.isDirectory)
        }
      }
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
      if(elem.type === 'directory'){
        if(elem.name === name){
          return elem;
        }
        else{
          // Check the files/directories under the directory
          if(elem.files){
            found = __findElement(name, elem.files);
            if(found){
              return found;
            }
          }
        }
      }
      // Elem is a file
      else{
        if(elem.name === name){
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
    Insert the file or directory alphabetically into the container array
  */
  var __insertSorted = function($elem, container) {
      var index = 0;
      var val = $elem.text();
      var siblings = container.children();

      // Empty container
      if(siblings.length === 0){
        container.append($elem);
      }
      else{
        while(index < siblings.length && val.localeCompare($(siblings.get(index)).find('.fileBrowseSpan').text()) === 1){
          index++;
        }
        // If reached the end of the siblings then append at the end
        if(index === siblings.length){
          container.append($elem);
        }
        // Otherwise, append the $elem before the first sibling with a greater value
        else{
          var $sibling = $(siblings.get(index));
          $sibling.before($elem);
        }
        // Initially close the added directory
        if($elem.hasClass('fileBrowserDirectory')){
          __closeDirectory($elem);
        }
      }
  };

  /*
    Creates a file or directory and adds it to the file browser.
    Inputs: {String} parent: Name of the parent DOM element.
            {String} name: Name of the new file/directory to be created.
            {Boolean} isDirectory: true if the element will be a directory / false if it is just a file
  */
  var __addFileElement = function(elem, parent, isDirectory){
    var $domElem = $("<div></div");
    var name = elem.name;

    $domElem.attr('aria-label', name);
    $domElem.attr('tabindex', '0');
    $domElem.attr('data-name', name);
    $domElem.addClass('fileBrowserElement');

    var img = $("<span class='fileBrowseIcon'/>");
    if(isDirectory){
      img.addClass('glyphicon glyphicon-folder-close');
    }
    else{
      img.addClass('glyphicon glyphicon-file');
    }
    $domElem.append(img);

    var span = $("<span class='fileBrowseSpan'></span>");
    span.text(name);
    $domElem.append(span);

    var elemStructure = {};
    elemStructure.name = name;
    if(isDirectory){
      elemStructure.type = 'directory';
      elemStructure.files = [];
      $domElem.addClass('fileBrowserDirectory');
    }
    else{
      elemStructure.type = 'file';
      $domElem.addClass('fileBrowserFile');
    }

    __addOnClickListener($domElem);

    // If no parent is specified then create the element under the root level
    if(!parent){
      $domElem.attr('data-treeLevel', 0);
      _fileStructure.push(elemStructure);
      __insertSorted($domElem, _fileBrowserRoot);
    }
    else{
      // Find the parent element in the fileBrowser object
      var parentDir = __findElement(parent, _fileStructure);
      var $parentDomElem = __getDomElement(parent);
      var treeLevel = $parentDomElem.attr('data-treeLevel');
      $domElem.attr('data-treeLevel', treeLevel + 1);
      __insertSorted($domElem, $parentDomElem);

      // Hide the element to start if it is not top-level
      $domElem.hide();

      // Only if the parent is a directory, add the file under it. If the parent is not a directory,
      // then we can't add the new file to it so add it to the root level directory.
      if(parentDir.type === 'directory'){
        parentDir.files.push(elemStructure);
      }
      else{
        _fileStructure.push(elemStructure);
      }
    }
  };

  var __addOnClickListener = function($elem) {
    $elem.on("keydown", function(event){
        event.stopPropagation();
        if(event.which === "13" || event.which === "32"){ // Enter key, Space key
          __handleClick($elem);
        }
    });
    $elem.on("dblclick", function(event){
        event.stopPropagation();
        __handleClick($elem);
    });
  };

  var __openDirectory = function($elem){
    $elem.removeClass('directory_collapsed');
    $elem.addClass('directory_expanded');
    $elem.children('.fileBrowserElement').attr('tabindex', '0'); // Using filter selector to only affect the first generation of children
    $elem.children('div').show();

    // Change the directory image to open
    $elem.find('.fileBrowseIcon').first().removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');
  };

  var __closeDirectory = function($elem){
    // Collapse directory and its children
    $elem.removeClass('directory_expanded');
    $elem.addClass('directory_collapsed');
    $elem.children('.fileBrowserElement').attr('tabindex', '-1'); // Using filter selector to only affect the first generation of children
    $elem.children('div').hide();

    // Change the directory image to closed
    $elem.find('.fileBrowseIcon').first().removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');
  };

  var __handleClick = function($elem){
    if($elem.hasClass('fileBrowserDirectory')){
      if($elem.hasClass('directory_collapsed')){
        __openDirectory($elem);
      }
      else{
        __closeDirectory($elem);
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
