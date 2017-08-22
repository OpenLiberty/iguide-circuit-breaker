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

    var __refreshFileBrowser2 = function(editor) {
        var __addFileToBrowser2 = function() {
            var stepName = editor.getStepName();
            console.log("in addFileToBrowser");
            var fileBrowsers = contentManager.getFileBrowsers(editor.getStepName());
            if (fileBrowsers) {
                var fileBrowser = fileBrowsers[0];
                console.log("fileBrowser", fileBrowser);
                //var file = {name: editor.getFileName()};
                var parentDir = "";
                var fileName = editor.getFileName();
                if (fileName === "BankingApplication.java" || fileName === "GreetingResource.java") {
                    parentDir = "RestServicesSample";
                }
                fileBrowser.addFileElement(fileName, parentDir, false, true);
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
        editor.addSaveListener(__addFileToBrowser2);
    };

    var __refreshFileBrowser = function(editor) {
        var __addFileToBrowser = function() {
            console.log(contentManager);
            contentManager.addFileToBrowser(editor);
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
        setCommandPrompt: __setCommandPrompt,
        refreshFileBrowser: __refreshFileBrowser
    }
})();
