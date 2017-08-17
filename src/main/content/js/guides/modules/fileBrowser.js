var fileBrowser = (function(){
  var fb = function(container, contents, stepName){
    var newFileBrowser = _fileBrowser.create(container, contents, stepName);
    return {
      addFile: newFileBrowser.__addFileElement,
      mkDir: newFileBrowser.__mkdir,
      mv: newFileBrowser.__mv
    }
  };

  var __create = function(container, contents, stepName){
    var newFB = new fb(container, contents, stepName);
    console.log("break");
    return newFB;
  };

  return {
    create: __create
  }
})();
