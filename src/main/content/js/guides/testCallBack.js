var testCallBack = (function() {
    var __setEditor = function(editor) {
        console.log("----------in editorCallback and using instance method to set new content");
        editor.setEditorContent("This is my brand new content");
        var addFileToBrowser = function() {
            console.log("in addFileToBrowser");
        }
        editor.addSaveListener(addFileToBrowser);
    };

    var __setCommandPrompt = function(cmdPrompt) {        
        console.log(" cmdPrompt callback ", cmdPrompt);        
        var cmds = {};
        
        cmds.help = function () {
            var output = "<div>" +
            "<ul>" +
            "<li><strong>help</strong> - display this help.</li>" +
            "<li><strong>test1</strong> - displays a cmd test1.</li>" +
            "<li><strong>test2</strong> - displays a cmd test2.</li>" +
            "</ul></div>";
            return output;
        };

        cmds.test1 = function (args) {          
            return "cmd test1";        
        };        
        
        cmds.test2 = function (args) {          
            return "cmd test2";        
        };        
        console.log("setCmdPrompt for ", cmds);
        console.log("cmdPrompt.getId() ", cmdPrompt.getId());
        console.log("cmdPrompt.getStepName() ", cmdPrompt.getStepName());
        console.log("cmdPromp.getDefaultCmds() ", cmdPrompt.getDefaultCmds());
        cmdPrompt.setCmdPrompt(cmds);        
    };

    return {
        setEditor: __setEditor,
        setCommandPrompt: __setCommandPrompt
    }
})();