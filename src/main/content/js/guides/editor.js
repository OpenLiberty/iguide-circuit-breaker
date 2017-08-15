var editor = (function() {
    var __editors = {}; // ToDo: __editors is no longer needed with the new changes

    var __loadAndCreate = function(container, stepName, content) {
            console.log("loading editor.html", container);
            container.load("../html/guides/editor.html", function () {
                var editor = container.find('.codeeditor');
                console.log("container id", container[0].id);
                var id = container[0].id + "-codeeditor";
                editor.attr("id", id);
                __createEditor(id, stepName, content);
            });
    };

    var __createEditor = function(id, stepName, content) {
        var editor = CodeMirror(document.getElementById(id), {
            lineNumbers: true,
            theme: 'elegant'
        });
        if (content.preload) {
            console.log("step.content.preload", content.preload);
            editor.setValue(content.preload);
        }
        if (content.callback) {
            var callback = eval(content.callback);
            callback(editor);
        }
        console.log($('#' + id.substring(0, id.indexOf('-codeeditor')) + ' .editorSaveButton'));
        __addOnClickListener($('#' + id.substring(0, id.indexOf('-codeeditor')) + ' .editorSaveButton'));

        console.log("editor", editor);
        __editors[stepName] = editor;
        console.log("__editors", __editors);
    };

    var __getEditor = function(container, stepName, content) {
        var editor = __editors[stepName];
        if (editor) {
            console.log("found existing editor", editor);
            $(editor.getWrapperElement()).show();
        } else {
            __loadAndCreate(container, stepName, content);  
        }
    };

    /*
    var __hideEditor = function(stepName) {
        var editor = __editors[stepName];
        if (editor) {
            $(editor.getWrapperElement()).hide();
        }
    };

    var __hideAll = function() {
        console.log("all editors", __editors);
        $.each(__editors, function(key, editor) {
            console.log("editor to hide", editor);
            $(editor.getWrapperElement()).hide();
        });
    }
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
    }

    return {
        getEditor: __getEditor
    }

})();