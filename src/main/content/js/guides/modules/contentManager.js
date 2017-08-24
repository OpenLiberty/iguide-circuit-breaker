var contentManager = (function() {
    //when passed an instance of an object, has to know which object instance to update/replace.

    var __stepContents = [];

    var setFileBrowser = function(stepName, fileBrowser) {
        __setModule(stepName, fileBrowser, 'fileBrowser');
    };

    var setEditor = function(stepName, editor) {
        __setModule(stepName, editor, 'fileEditor');
    };

    var setCommandPrompt = function(stepName, cmdPrompt) {
        __setModule(stepName, cmdPrompt, 'commandPrompt');
    };

    var setWebBrowser = function(stepName, webBrowser) {
        __setModule(stepName, webBrowser, 'webBrowser');
    };

    /** Generic method to add modules to their respective step
     * @param {String} stepName - stepName where module is located
     * @param {Module Object} module - the module object
     * @param {String} moduleType - 'webBrowser', 'fileBrowser', 'fileEditor', or 'commandPrompt'
     */
    var __setModule = function(stepName, module, moduleType) {
        var stepContent = __stepContents[stepName];
        if (!stepContent) {
            __stepContents[stepName] = {};
            stepContent = __stepContents[stepName];
        }
        var moduleList = null;
        switch(moduleType) {
            case 'webBrowser':
                moduleList = stepContent.browsers;
                break;
            case 'fileBrowser':
                moduleList = stepContent.fileBrowsers;
                break;
            case 'fileEditor':
                moduleList = stepContent.editors;
                break;
            case 'commandPrompt':
                moduleList = stepContent.terminals;
                break;
        }
        if (moduleList) {
            moduleList.push(module);
        } else {
            switch(moduleType) {
                case 'webBrowser':
                stepContent.browsers = [];
                stepContent.browsers.push(module);
                    break;
            case 'fileBrowser':
                    stepContent.fileBrowsers = [];
                    stepContent.fileBrowsers.push(module);
                    break;
            case 'fileEditor':
                    stepContent.editors = [];
                    stepContent.editors.push(module);
                    break;
            case 'commandPrompt':
                    stepContent.terminals = [];
                    stepContent.terminals.push(module);
                    break;
            }
        }
        console.log("stepContent for " + stepName, __stepContents);
    };
    
    var __getFileBrowsers = function(stepName) {
        return __getModules(stepName, 'fileBrowser');
    };

    var __getEditors = function(stepName) {
        return __getModules(stepName, 'fileEditor');
    };

    var __getBrowsers = function(stepName) {
        return __getModules(stepName, 'webBrowser');
    };

    var __getCommandPrompts = function(stepName) {
        return __getModules(stepName, 'commandPrompt');
    };

    /** Generic method to get Array of a single module type in a given step
     * @param {String} stepName - step name to get modules from
     * @param {String} moduleType - 'webBrowser', 'fileBrowser', 'fileEditor', or 'commandPrompt'
     */
    var __getModules = function(stepName, moduleType) {
        var moduleList = null;
        var stepContent = __stepContents[stepName];
        if (stepContent) {
            switch(moduleType) {
                case 'webBrowser':
                    moduleList = stepContent.browsers;
                    break;
                case 'fileBrowser':
                    moduleList = stepContent.fileBrowsers;
                    break;
                case 'fileEditor':
                    moduleList = stepContent.editors;
                    break;
                case 'commandPrompt':
                    moduleList = stepContent.terminals;
                    break;
            }
        }
        return moduleList;
    };

    /** Takes in an Editor object to add appropriate file to the FileBrowser
     * @param {Editor} editor - the Editor instance, which contains StepName and FileName
     * @param {Integer} browserInstanceNumber - (optional) zero-indexed instance number of FileBrowser
     *
     * TODO: may want to refactor this to be more generic, instead of taking in an Editor
     */
    var addFileToBrowserFromEditor = function(editor, browserInstanceNumber) {
        //TODO: check instance of editor or cmdPrompt, etc. to do different actions
        var stepName = editor.getStepName();
        var fileName = editor.getFileName();
        
        addFileToBrowser(stepName, fileName, browserInstanceNumber);
    };

    /** Adds a file to a specified FileBrowser instance
     * @param {String} stepName - name of step where FileBrowser is located
     * @param {String} fileName - name of file to add
     * @param {Integer} browserInstanceNumber - (optional) zero-indexed instance number of FileBrowser
     */
    var addFileToBrowser = function(stepName, fileName, browserInstanceNumber) {
        var fileBrowser = __getFileBrowserInstance(stepName, browserInstanceNumber);
        if (fileBrowser) {
            var parentDir = "";  //TODO: make this parentDir customizable
            fileBrowser.addFile(fileName, parentDir);
        }        
    };

    /** Adds a folder to a specified FileBrowser instance
     * @param {String} stepName - name of step where FileBrowser is located
     * @param {String} folderName - Name of folder to create
     * @param {String} parentDir - Name of parent directory to put new folder in
     * @param {Integer} instanceNumber - (optional) zero-indexed instance number of FileBrowser
     */
    var addFolderToBrowser = function(stepName, folderName, parentDir, instanceNumber) {
        var fileBrowser = __getFileBrowserInstance(stepName, instanceNumber);
        if (fileBrowser) {
            fileBrowser.mkdir(folderName, parentDir);
        }
    };

    /** INTERNAL FUNCTION - returns a specific instance of FileBrowser
     * @param {*} stepName 
     * @param {*} instanceNumber 
     * 
     * @returns - FileBrowser instance, or FALSY (null or undefined) if nothing found.
     */
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

    /** Returns the URL from a specified Browser instance
     * @param {String} stepName - name of step where WebBrowser is located
     * @param {Integer} instanceNumber - (optional) zero-indexed instance number of Browser
     */
    var getBrowserURL = function(stepName, instanceNumber) {
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

    /** Sets the URL of a specified Browser instance
     * @param {String} stepName - step name containing the target Browser
     * @param {String} URL - URL to set
     * @param {Integer} instanceNumber - (optional) zero-indexed instance number of Browser
     */
    var setBrowserURL = function(stepName, URL, instanceNumber) {
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

    /** Loads content in a specified Browser instance
     * @param {String} stepName - step name containing the target Browser
     * @param {*} content - the content //TODO: in progress, fix once finished. HTML file for now
     * @param {Integer} instanceNumber - (optional) zero-indexed instance number of Browser
     */
    var loadContentInBrowser = function(stepName, content, instanceNumber) {
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
        setFileBrowser: setFileBrowser,
        setEditor: setEditor,
        setWebBrowser: setWebBrowser,
        setCommandPrompt: setCommandPrompt,

        getFileBrowsers: __getFileBrowsers,
        getEditors: __getEditors,
        getBrowsers: __getBrowsers,
        getCommandPrompts: __getCommandPrompts,

        addFileToBrowserFromEditor: addFileToBrowserFromEditor,
        addFileToBrowser: addFileToBrowser,

        setBrowserURL: setBrowserURL,
        getBrowserURL: getBrowserURL
    };
})();
