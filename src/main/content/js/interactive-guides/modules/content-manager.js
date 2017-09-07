var contentManager = (function() {
    //when passed an instance of an object, has to know which object instance to update/replace.

    var __stepContents = [];
    var __instructions = {};

// ==== SET FUNCTIONS ====
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
    var setPod = function(stepName, pod) {
        __setModule(stepName, pod, 'pod');
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
            case 'pod':
                moduleList = stepContent.pods;
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
                case 'pod':
                    stepContent.pods = [];
                    stepContent.pods.push(module);
                    break;
            }
        }
        console.log("stepContent for " + stepName, __stepContents);
    };

// ==== GET FUNCTIONS ====
    var __getFileBrowsers = function(stepName) {
        return __getModules(stepName, 'fileBrowser');
    };
    var __getFileEditors = function(stepName) {
        return __getModules(stepName, 'fileEditor');
    };
    var __getWebBrowsers = function(stepName) {
        return __getModules(stepName, 'webBrowser');
    };
    var __getCommandPrompts = function(stepName) {
        return __getModules(stepName, 'commandPrompt');
    };
    var __getPods = function(stepName) {
        return __getModules(stepName, 'pod');
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
                case 'pod':
                    moduleList = stepContent.pods;
                    break;
            }
        }
        return moduleList;
    };

     /** Returns a specific instance of FileBrowser
     * @param {*} stepName
     * @param {*} instanceNumber
     *
     * @returns - FileBrowser instance, or FALSY (null or undefined) if nothing found.
     */
    var __getFileBrowserInstance = function(stepName, instanceNumber) {
        return __getModuleInstance(stepName, 'fileBrowser', instanceNumber);
    };
    var __getEditorInstance = function(stepName, instanceNumber) {
        return __getModuleInstance(stepName, 'fileEditor', instanceNumber);
    };
    var __getWebBrowserInstance = function(stepName, instanceNumber) {
        return __getModuleInstance(stepName, 'webBrowser', instanceNumber);
    };
    var __getCommandPromptInstance = function(stepName, instanceNumber) {
        return __getModuleInstance(stepName, 'commandPrompt', instanceNumber);
    };
    var __getPodInstance = function(stepName, instanceNumber) {
        return __getModuleInstance(stepName, 'pod', instanceNumber);
    };
    /** Returns specific instance of given module type
     * @param {String} stepName - name of step to get module from
     * @param {String} moduleType - 'webBrowser', 'fileBrowser', 'fileEditor', or 'commandPrompt'
     * @param {Integer} instanceNumber - instance of module type in given step
     *
     * @returns - instance of given module tpe, or FALSY (null or undefined) if nothing found.
     */
    var __getModuleInstance = function(stepName, moduleType, instanceNumber) {
        var moduleList = __getModules(stepName, moduleType);
        var module = null;
        if (moduleList) {
            module = moduleList[0];
            if (instanceNumber) {
                module = moduleList[instanceNumber];
            }
            console.log("Found " + moduleType + " " + module);
        } else {
            console.log("Not able to locate any " + moduleType + " in " + stepName);
        }
        return module;
    };

// ==== FileBrowser Functions ====
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

// ==== WebBrowser Functions ====
    /** Returns the URL from a specified Browser instance
     * @param {String} stepName - name of step where WebBrowser is located
     * @param {Integer} instanceNumber - (optional) zero-indexed instance number of Browser
     */
    var getBrowserURL = function(stepName, instanceNumber) {
        var browser = __getWebBrowserInstance(stepName, instanceNumber);
        if (browser) {
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
        var browser = __getWebBrowserInstance(stepName, instanceNumber);
        if (browser) {
            console.log("Setting URL for Web Browser ", browser);
            browser.setURL(URL);
        }
    };

    /** Loads content in a specified Browser instance
     * @param {String} stepName - step name containing the target Browser
     * @param {*} content - the content //TODO: in progress, fix once finished. HTML file for now
     * @param {Integer} instanceNumber - (optional) zero-indexed instance number of Browser
     */
    var setBrowserContent = function(stepName, content, instanceNumber) {
        var browser = __getWebBrowserInstance(stepName, instanceNumber);
        if (browser) {
            browser.setBrowserContent(content);
        }
    };

    var setBrowserURLFocus = function(stepName, instanceNumber) {
        var browser = __getWebBrowserInstance(stepName, instanceNumber);
        if (browser) {
            browser.setURLFocus();
        }
    };

    var refreshBrowser = function(stepName, instanceNumber) {
        var browser = __getWebBrowserInstance(stepName, instanceNumber);
        if (browser) {
            //TODO: refactor this into a function in webBrowser.js
            browser.simulateBrowserRefresh();
        }
    };

// ==== Pod Functions ====
    var setPodContent = function(stepName, content, instanceNumber) {
        var pod = __getPodInstance(stepName, instanceNumber);
        if (pod) {
            pod.setContent(content);
        }
    };

    var setPodContentWithRightSlide = function(stepName, content, instanceNumber) {
        var pod = __getPodInstance(stepName, instanceNumber);
        if (pod) {
            var podContent = "<div class=\"pod-animation-slide-from-right\">" +
                content +
                "</div>";
            pod.setContent(podContent);
        }
    };

// ==== File Editor Functions ====

    /** Returns the content from a specified FileEditor instance
     * @param {String} stepName - name of step where FileEditor is located
     * @param {Integer} instanceNumber - (optional) zero-indexed instance number of FileEditor
     */
    var getEditorContents = function(stepName, instanceNumber) {
        var editor = __getEditorInstance(stepName, instanceNumber);
        if (editor) {
            return editor.getEditorContent();
        }
    };

    /** Set (replace) the content in a specified FileEditor instance
     * @param {String} stepName - name of step where FileEditor is located
     * @param {String?} content - the content to put into the FileEditor
     * @param {Integer} instanceNumber - (optional) zero-indexed instance number of FileEditor
     */
    var setEditorContents = function(stepName, content, instanceNumber) {
        var editor = __getEditorInstance(stepName, instanceNumber);
        if (editor) {
            editor.setEditorContent(content);
        }
    };

    /** Insert content before a certain line in a specified FileEditor instance
     * @param {String} stepName - name of step where FileEditor is located
     * @param {Integer} lineNumber - line number to insert content above
     * @param {String?} content - the content to put into the FileEditor
     * @param {Integer} instanceNumber - (optional) zero-indexed instance number of FileEditor
     */
    var insertEditorContents = function(stepName, lineNumber, content, instanceNumber) {
        var editor = __getEditorInstance(stepName, instanceNumber);
        if (editor) {
            editor.insertContent(lineNumber, content);
        }
    };

    /** Append content after a certain line in a specified FileEditor instance
     * @param {String} stepName - name of step where FileEditor is located
     * @param {Integer} lineNumber - line number to append content below
     * @param {String?} content - the content to put into the FileEditor
     * @param {Integer} instanceNumber - (optional) zero-indexed instance number of FileEditor
     */
    var appendEditorContents = function(stepName, lineNumber, content, instanceNumber) {
        var editor = __getEditorInstance(stepName, instanceNumber);
        if (editor) {
            editor.appendContent(lineNumber, content);
        }
    };

    var saveEditor = function(stepName, instanceNumber) {
        var editor = __getEditorInstance(stepName, instanceNumber);
        if (editor) {
            editor.saveEditor();
        }
    };

    var sendCommandToTerminal = function() {

    };

// ==== Instruction Functions ====
    /** Store the instructions for the given step
     * @param {String} stepName
     * @param {*} instructions
     */
    var setInstructions = function(stepName, instructionsFromStep){
      if(!stepName){
        stepName = stepContent.currentStepName();
      }
      // Check if instructions are already set
      if(__instructions[stepName]){
        return;
      }

      var stepInstruction = {}; // Instructions for this step
      stepInstruction.currentInstructionIndex = 0; // Index of the current instruction
      stepInstruction.instructions = [];

      if(instructionsFromStep){
        // Loop through the instructions and set them
        for(var i = 0; i < instructionsFromStep.length; i++){
          var instruction = {};
          instruction.name = instructionsFromStep[i];
          instruction.complete = false;
          stepInstruction.instructions.push(instruction);
        }
      }

      __instructions[stepName] = stepInstruction;
    };

    /*
      Internal method to get the stepInstruction structure for a given step
      that has the current instruction index and the list of instructions for that step
    */
    var __getStepInstruction = function(stepName){
      if(!stepName){
        stepName = stepContent.currentStepName();
      }
      var stepInstruction = __instructions[stepName];
      return stepInstruction;
    };

    var markCurrentInstructionComplete = function(stepName){
      var stepInstruction = __getStepInstruction(stepName);
      var currentInstructionIndex = stepInstruction.currentInstructionIndex;
      var instruction = stepInstruction.instructions[currentInstructionIndex];

      if(instruction && instruction.complete === false){
        instruction.complete = true;
        stepInstruction.currentInstructionIndex++;
      }
    };

    var getCurrentInstruction = function(stepName) {
      var stepInstruction = __getStepInstruction(stepName);
      var currentInstructionIndex = stepInstruction.currentInstructionIndex;
      var currentInstruction = stepInstruction.instructions[currentInstructionIndex];
      if(currentInstruction){
        instruction = currentInstruction.name;
      }
      return instruction;
    };

    var getCurrentInstructionIndex = function(stepName) {
      var stepInstruction = __getStepInstruction(stepName);
      return stepInstruction.currentInstructionIndex;
    };

    return {
        setFileBrowser: setFileBrowser,
        setEditor: setEditor,
        setWebBrowser: setWebBrowser,
        setCommandPrompt: setCommandPrompt,
        setPod: setPod,

        addFileToBrowserFromEditor: addFileToBrowserFromEditor,
        addFileToBrowser: addFileToBrowser,
        addFolderToBrowser: addFolderToBrowser,

        setBrowserURL: setBrowserURL,
        getBrowserURL: getBrowserURL,
        setBrowserURLFocus: setBrowserURLFocus,
        refreshBrowser: refreshBrowser,

        setPodContent: setPodContent,
        setPodContentWithRightSlide: setPodContentWithRightSlide,
        getPod: __getPodInstance,

        getEditorContents: getEditorContents,
        setEditorContents: setEditorContents,
        insertEditorContents: insertEditorContents,
        appendEditorContents: appendEditorContents,
        saveEditor: saveEditor,

        setInstructions: setInstructions,
        markCurrentInstructionComplete: markCurrentInstructionComplete,
        getCurrentInstruction: getCurrentInstruction,
        getCurrentInstructionIndex: getCurrentInstructionIndex
    };
})();
