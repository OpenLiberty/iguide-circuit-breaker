var testCallBack = (function() {
    var __setEditor = function(editor) {
        console.log("----------in editorCallback and using instance method to set new content");
        editor.setEditorContent("This is my brand new content");
        var addFileToBrowser = function() {
            console.log("in addFileToBrowser");
        }
        editor.addSaveListener(addFileToBrowser);
    };

    return {
        setEditor: __setEditor
    }
})();