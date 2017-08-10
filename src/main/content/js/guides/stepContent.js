var stepContent = (function() {
    "use strict"
    
    var terminalInit = false;

    var __createContents = function (step) {
      tableofcontents.selectStep(step.name);
      if (step.content) {
        //var content = step.content;
        $.each(step.content, function(index, content) {
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
              case 'commandPrompt':
                console.log("commandPrompt detected");
                
                if ($('#commandPrompt')) {
                  // remove the left position for editor
                  $('#codeeditor').removeClass("col-sm-6");
                  $('#commandPrompt').css('display','block');     
                }

                if (!terminalInit) {
                  $("#commandPrompt").load("../html/guides/cmdPrompt.html", function() {
                    console.log("load cmdPrompt.html");
                    var container = $("commandPrompt").find(".shell-wrap");
                    cmdPrompt.create(container);
                  });
                  terminalInit = true;  
                } else {
                  console.log("terminal already initialize");
                  // focus cursor on last input                 
                  var container = $("commandPrompt").find(".shell-wrap");
                  cmdPrompt.focus(container);                  
                }           
                break;
              case 'fileBrowser':
                  console.log("fileBrowser type: ", content.fileBrowser);
                  var container = $("#moduleContainer");
                  fileBrowser.create(container, content);
                  break;
            }
          }
        });

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
        if ($('#commandPrompt')) {
          console.log("hide commandprompt if it's there");
          $('#commandPrompt').hide();
        }
        if($(".fileBrowserContainer:visible")){
          $(".fileBrowserContainer").hide();
        }
      }
    }

    return {
      createContents: __createContents
    }
})();
