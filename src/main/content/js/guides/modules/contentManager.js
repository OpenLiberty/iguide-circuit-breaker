var contentManager = (function() {
    //when passed an instance of an object, has to know which object instance to update/replace.

    var __stepContents = [];

    var __setFileBrowser = function(stepName, fileBrowser) {
        var stepContent = __stepContents[stepName];
        if (!stepContent) {
            __stepContents[stepName] = {};
            stepContent = __stepContents[stepName];
        }
        var saveFileBrowsers = __stepContents[stepName].fileBrowsers;
        if (saveFileBrowsers) {
            saveFileBrowsers.push(fileBrowser);
        } else {
            __stepContents[stepName].fileBrowsers = [];
            __stepContents[stepName].fileBrowsers.push(fileBrowser);
        }
        console.log("stepContent for " + stepName, __stepContents);
    };

    var __getFileBrowsers = function(stepName) {
        var fileBrowsers = null;
        var stepContent = __stepContents[stepName];
        if (stepContent) {
             var saveFileBrowsers = stepContent.fileBrowsers;
             if (saveFileBrowsers) {
                 fileBrowsers = saveFileBrowsers;
             }
        }
        return fileBrowsers;
    };

    var __setEditor = function(stepName, editor) {
        var stepContent = __stepContents[stepName];
        if (!stepContent) {
            __stepContents[stepName] = {};
            stepContent = __stepContents[stepName];
        }
        var saveEditors = __stepContents[stepName].editors;
        if (saveEditors) {
            saveEditors.push(editor);
        } else {
            __stepContents[stepName].editors = [];
            __stepContents[stepName].editors.push(editor);
        }
        console.log("stepContent for " + stepName, __stepContents);
    };

    var __getEditors = function(stepName) {
        var editors = null;
        var stepContent = __stepContents[stepName];
        if (stepContent) {
             var saveEditors = stepContent.editors;
             if (saveEditors) {
                 editors = saveEditors;
             }
        }
        return editors;
    };

    var __getBrowsers = function(stepName) {
        var browsers = null;
        var stepContent = __stepContents[stepName];
        if (stepContent) {
            browsers = stepContent.browsers;
        }
        return browsers;
    };

    /**
     * Takes in an Editor object to add appropriate file to the FileBrowser
     * @param {*} editor - the Editor instance, which contains StepName and FileName
     * @param {*} instanceNumber - (optional) zero-indexed instance number of FileBrowser, if there are multiple FileBrowsers in one step
     */
    var __addFileToBrowser = function(editor, instanceNumber) {
        //TODO: check instance of editor or cmdPrompt, etc. to do different actions
        var stepName = editor.getStepName();
        var fileBrowsers = __getFileBrowsers(stepName);
        if (fileBrowsers) {
            var fileBrowser = fileBrowsers[0];
            if (instanceNumber) { //TODO: should check if integer
                fileBrowser = fileBrowsers[instanceNumber];
            }
            console.log("fileBrowser", fileBrowser);
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

    var __addFolderToBrowser = function() {
        
    };

    /**
     * 
     * @param {*} stepName - step to identify which Browser
     * @param {*} instanceNumber - (optional) zero-indexed instance number of Browser
     */
    var __getBrowserURL = function(stepName, instanceNumber) {
        var browsers = __getBrowsers(stepName);
        if (browsers) {
            var browser = browsers[0];
            if (instanceNumber) {
                browser = browsers[instanceNumber];
            }
            console.log("Getting URL from Web Browser ", browser);
            return browser.__getURL();
        }
    };

    /**
     * 
     * @param {*} stepName - step name containing the target Browser
     * @param {*} URL - URL to set
     * @param {*} instanceNumber - (optional) zero-indexed instance number of Browser
     */
    var __setBrowserURL = function(stepName, URL, instanceNumber) {
        var browsers = __getBrowsers(stepName);
        if (browsers) {
            var browser = browsers[0];
            if (instanceNumber) {
                browser = browsers[instanceNumber];
            }
            console.log("Setting URL for Web Browser ", browser);
            browser.__setURL(URL);
        }
    };

    /**
     * 
     * @param {*} stepName - step name containing the target Browser
     * @param {*} content - the content
     * @param {*} instanceNumber - (optional) zero-indexed instance number of Browser
     */
    var __loadContentInBrowser = function(stepName, content, instanceNumber) {
        var browsers = __getBrowsers(stepName);
        if (browsers) {
            var browser = browsers[0];
            if (instanceNumber) {
                browser = browsers[instanceNumber];
            }
            console.log("Setting content for Web Browser ", browser);
            browser.__setBrowserContent(content);
        }
    };

    var __sendCommandToTerminal = function() {

    };

    return {
        getFileBrowsers: __getFileBrowsers,
        setFileBrowser: __setFileBrowser,
        getEditors: __getEditors,
        setEditor: __setEditor,
        getBrowsers: __getBrowsers,

        addFileToBrowser: __addFileToBrowser,

        setBrowserURL: __setBrowserURL,
        getBrowserURL: __getBrowserURL
    };
})();
