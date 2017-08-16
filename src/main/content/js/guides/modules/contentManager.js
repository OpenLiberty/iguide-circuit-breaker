var contentManager = (function() {
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
             var saveFileBrowsers = __stepContents[stepName].fileBrowsers;
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
             var saveEditors = __stepContents[stepName].editors;
             if (saveEditors) {
                 editors = saveEditors;
             }
        }
        return editors;
    };

    return {
        getFileBrowsers: __getFileBrowsers,
        setFileBrowser: __setFileBrowser,
        getEditors: __getEditors,
        setEditor: __setEditor
    }
})();