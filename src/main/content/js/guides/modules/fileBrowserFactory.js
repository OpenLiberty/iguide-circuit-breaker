var fileBrowserFactory = (function(){

  var __create = function(container, contents, stepName){
    var newFileBrowser = fileBrowser.create(container, contents, stepName);
    return {
      addFile: newFileBrowser.__addFileElement,
      mkDir: newFileBrowser.__mkdir,
      mv: newFileBrowser.__mv
    }
  };

  return {
    create: __create
  }
})();
