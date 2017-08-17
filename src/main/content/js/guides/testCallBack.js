var testCallBack = (function() {
    var previousStepEditor;
    var __setEditor = function(editor) {
        console.log("----------in editorCallback and using instance method to set new content");
        //editor.setEditorContent("This is my brand new content");
        var addFileToBrowser = function() {
            console.log("in addFileToBrowser");
        }
        previousStepEditor = editor;
        editor.addSaveListener(addFileToBrowser);
    };

    var __refreshFileBrowser = function(editor) {
        var __addFileToBrowser = function() {
            var stepName = editor.getStepName();
            console.log("in addFileToBrowser");
            var fileBrowsers = contentManager.getFileBrowsers(editor.getStepName());
            if (fileBrowsers) {
                var fileBrowser = fileBrowsers[0];
                console.log("fileBrowser", fileBrowser);
                //var file = {name: editor.getFileName()};
                fileBrowser.__addFileElement(editor.getFileName(), "RestServicesSample", false, true);
            } else {
                console.log("not able to locate a file browser");
            }
        };
        if (previousStepEditor && editor.getStepName() === "SaveChanges") {
            var previousEditor = contentManager.getEditors(previousStepEditor.getStepName());
            if (previousEditor) {
                editor.setEditorContent(previousEditor[0].getEditorContent());
            }

        }
        editor.addSaveListener(__addFileToBrowser);
    };

    return {
        setEditor: __setEditor,
        refreshFileBrowser: __refreshFileBrowser
    }
})();