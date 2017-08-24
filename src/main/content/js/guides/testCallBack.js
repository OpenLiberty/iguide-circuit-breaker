var testCallBack = (function() {
    var previousStepEditor;

    var __setEditor = function(editor) {
        console.log("----------in editorCallback and using instance method to set new content");
        //editor.setEditorContent("This is my brand new content");
        var addFileToBrowser = function() {
            console.log("in addFileToBrowser");
            editor.insertContent(5, "/* GreetingResource with annotation */");
        }
        previousStepEditor = editor;
        editor.addSaveListener(addFileToBrowser);
    };

    var __modifyEditor = function(editor) {
        var content = editor.getEditorContent();
        content = "@Fallback(StringFallbackHandler.class)\n" + content
        console.log("new content ", content);
        editor.setEditorContent(content);
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
            if (editor.getStepName() === "SaveChanges") {
                editor.appendContent(6, "/* GetMessage */");
            }
            contentManager.addFileToBrowserFromEditor(editor);
        };
        // if (previousStepEditor && editor.getStepName() === "SaveChanges") {
        //     var previousEditor = contentManager.getEditors(previousStepEditor.getStepName());
        //     if (previousEditor) {
        //         editor.setEditorContent(previousEditor[0].getEditorContent());
        //     }
        // }
        editor.addSaveListener(__addFileToBrowser);    
    };

    var __setWebBrowserContent = function(webBrowser) {
        var updateContentPerURL = function(currentURL) {
            console.log("in TEST updateContentPerURL with '" + currentURL + "'");

            if (currentURL.endsWith('getMySide')) {
                this.setBrowserContent('Example1.html');
            } else if (currentURL.endsWith('getMySide2')) {
                // leave the content, but update a field within
                var iframeDOM = this.getIframeDOM();
                var y = iframeDOM.find("#ord");
                if (iframeDOM.find("#ord").length) {
                    y.css("background-color", "blue");
                    y[0].innerHTML = "Don't Know";
                }
            } else if (currentURL.endsWith('getMyOrder')) {
                this.setBrowserContent('Example3.html');
            } else {
                this.setBrowserContent('');
            }
        };
        // Tell the browser about the callback to be invoked
        // when the URL is updated.
        webBrowser.addUpdatedURLListener(updateContentPerURL);

    };

    var __insertCode = function(currentStepName) {
        console.log("call back insert code is here");
        var editor = contentManager.getEditors(currentStepName)[0];
        var content = editor.getEditorContent();
        content = "@Fallback(StringFallbackHandler.class)\n" + content
        console.log("new content ", content);
        editor.setEditorContent(content);
    };

    var __runServer = function(currentStepName) {
        console.log("execute cmd server run servr1 ", currentStepName);
        var cmd1 = "server run server1";
        
        //var cmdPrompt = contentManager.getDefaultCmds(currentStepName)[0];
        //console.log("runCmdPrompt for ", cmdPrompt);
        //console.log("cmdPrompt.getId() ", cmdPrompt.getId());
        //console.log("cmdPrompt.getStepName() ", cmdPrompt.getStepName());
        //console.log("cmdPromp.getDefaultCmds() ", cmdPrompt.getDefaultCmds());
        //cmdPrompt.runCmdPrompt(cmd1);
    };

    return {
        setEditor: __setEditor,
        setCommandPrompt: __setCommandPrompt,
        refreshFileBrowser: __refreshFileBrowser,
        modifyEditor: __modifyEditor,
        insert_code: __insertCode,
        run_server: __runServer,
        setWebBrowserContent: __setWebBrowserContent
    }
})();
