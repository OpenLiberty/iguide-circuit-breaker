var editor = (function() {
    var __editors = {}; // ToDo: __editors is no longer needed with the new changes

    var editorType = function(container, stepName, content) {
        this.stepName = stepName;
        this.content = content;
        this.container = container;
        __loadAndCreate(this, container, stepName, content);
    }

    editorType.prototype = {
        getEditor: function() {
            return this.editor;
        },
        getEditorContent: function() {
            return this.editor.getValue();
        },
        setEditorContent: function(value) {
            this.editor.setValue(value);
        },
        addSaveListener: function(callback) {
            console.log("saveListener callback", callback);
            this.saveListenerCallback = callback;
        }
    }

    var __loadAndCreate = function(thisEditor, container, stepName, content) {
            console.log("loading editor.html", container);
            container.load("../html/guides/editor.html", function () {
                var editor = container.find('.codeeditor');
                console.log("container id", container[0].id);
                var id = container[0].id + "-codeeditor";
                editor.attr("id", id);
                __createEditor(thisEditor, id, stepName, content);
            });
    };

    var __createEditor = function(thisEditor, id, stepName, content) {
        thisEditor.editor = CodeMirror(document.getElementById(id), {
            lineNumbers: true,
            theme: 'elegant',
            extraKeys: {Tab: false, "Shift-Tab": false} // disable tab and shift-tab to indent or unindent inside the 
                                                        // editor, instead allow accessibility for tab and shift-tab to 
                                                        // advance to the next and previous tabbable element.
        });
        
        if (content.preload) {
            console.log("step.content.preload", content.preload);
            thisEditor.editor.setValue(content.preload);
        }
        if (content.callback) {
            var callback = eval(content.callback);
            callback(thisEditor);
        }
        console.log($('#' + id.substring(0, id.indexOf('-codeeditor')) + ' .editorSaveButton'));
        __addOnClickListener($('#' + id.substring(0, id.indexOf('-codeeditor')) + ' .editorSaveButton'));

        console.log("thisEditor.editor", thisEditor.editor);
        __editors[stepName] = thisEditor.editor;
        console.log("__editors", __editors);
        //return editor;
    };

    /*
    var __getEditor = function(container, stepName, content) {
        var editor = __editors[stepName];
        if (editor) {
            console.log("found existing editor", editor);
            $(editor.getWrapperElement()).show();
        } else {
            __loadAndCreate(container, stepName, content);  
        }   
    };
    */

    var __addOnClickListener = function($elem) {
        $elem.on("keydown", function (event) {
            event.stopPropagation();
            if (event.which === 13 || event.which === 32) { // Enter key, Space key
                __handleClick($elem);
            }
        });
        $elem.on("click", function (event) {
            event.stopPropagation();
            __handleClick($elem);
        });
    };

    var __handleClick = function($elem) {
        console.log("save is clicked");
        // ToDo: add call to callback listening to save
        //this.saveListenerCallback;
    }

    var __create = function(container, stepName, content) {
        return new editorType(container, stepName, content);
    }

    return {
        //getEditor: __getEditor
        create: __create
    }

})();