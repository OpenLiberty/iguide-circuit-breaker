var stepContent = (function() {
    "use strict"

    var __createContents = function (step) {
      if (step.content) {
        var content = step.content;
        if (content.displayType) {
          switch (content.displayType) {
            case 'fileEditor':
              if ($('.CodeMirror')[0]) {
                var cm = $('.CodeMirror')[0].CodeMirror;
                if (cm) {
                  // show
                  $(cm.getWrapperElement()).show();
                }
              } else {
                var editor = CodeMirror(document.getElementById("codeeditor"), {
                  lineNumbers: true,
                  theme: 'elegant'
                });
                if (content.preload) {
                  editor.setValue(content.preload);
                }
                //editor.setValue('Initial text in the editor\nwith two lines.');
                console.log("editor", editor);
                editor.on("change", function (editor, change) {
                  console.log("change", change);
                  console.log("value", editor.getValue());
                })
              }
              break;
            case 'webBrowser':
              webBrowser.create($('#codeeditor'), content);
              break;
          }
        }
      } else {
        console.log('.CodeMirror', $('.CodeMirror')[0]);
        if ($('.CodeMirror')[0]) {
          var cm = $('.CodeMirror')[0].CodeMirror;
          console.log("cm", cm);
          if (cm) {
            //Hide
            $(cm.getWrapperElement()).hide();
          }
        }   
      }
    }

    return {
      createContents: __createContents
    }
})();