var testCallBack = (function() {
    var __setEditor = function(editor) {
        console.log("----------in editorCallback and set new content");
        editor.setValue("This is my brand new content");
    };

    return {
        setEditor: __setEditor
    }
})();