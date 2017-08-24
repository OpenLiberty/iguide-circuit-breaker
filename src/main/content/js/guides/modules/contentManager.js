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
     * @param {*} instanceNumber - (optional) zero-indexed instance number of FileBrowser
     *
     * TODO: may want to refactor this to be more generic, instead of taking in an Editor
     */
    var addFileToBrowser = function(editor, instanceNumber) {
        //TODO: check instance of editor or cmdPrompt, etc. to do different actions
        var stepName = editor.getStepName();
        var fileBrowser = __getFileBrowserInstance(stepName, instanceNumber);
        if (fileBrowser) {
            var parentDir = ""; //TODO: this should have an (optional?) parentDir passed in
            var fileName = editor.getFileName();
            fileBrowser.addFileElement(fileName, parentDir, false, true);
        }
    };

    /**
     * 
     * @param {*} stepName - name of step
     * @param {*} folderName - Name of folder to create
     * @param {*} parentDir - Name of parent directory to put new folder in
     * @param {*} instanceNumber - (optional) zero-indexed instance number of FileBrowser
     */
    var addFolderToBrowser = function(stepName, folderName, parentDir, instanceNumber) {
        var fileBrowser = __getFileBrowserInstance(stepName, instanceNumber);
        if (fileBrowser) {
            fileBrowser.mkdir(folderName, parentDir);
        }
    };

    var __getFileBrowserInstance = function(stepName, instanceNumber) {
        var fileBrowsers = __getFileBrowsers(stepName);
        var fileBrowser = null;
        if (fileBrowsers) {
            fileBrowser = fileBrowsers[0];
            if (instanceNumber) { //TODO: should check if integer
                fileBrowser = fileBrowsers[instanceNumber];
            }
            console.log("Found FileBrowser ", fileBrowser);
        } else {
            console.log("Not able to locate any FileBrowsers");
        }
        return fileBrowser;
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
            return browser.getURL();
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
            browser.setURL(URL);
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
            browser.setBrowserContent(content);
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

        addFileToBrowser: addFileToBrowser,

        setBrowserURL: __setBrowserURL,
        getBrowserURL: __getBrowserURL
    };
})();
