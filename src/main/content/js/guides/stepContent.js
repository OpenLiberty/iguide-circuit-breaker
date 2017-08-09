var stepContent = (function() {
    "use strict"

    var __createContents = function (step) {
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
                console.log("commandPrompt");
                console.log("#terminal ", $('#commandPrompt .hidden'));
                if ($('#commandPrompt .hidden')) {
                  console.log("show");
                  // remove the left position for editor
                  $('#codeeditor').removeClass("col-sm-6");
                  // show the command prompt
                  $('#commandPrompt').removeClass("hidden");

                  var cmds = {};
                  cmds.help = function () {
                    var output = "<div>" +
                      "<ul>" +
                      "<li><strong>help</strong> - display this help.</li>" +
                      "<li><strong>hello NAME</strong> - displays a greeting for NAME.</li>" +
                      "</ul></div>";
                    return output;
                  };
                  cmds.hello = function (args) {
                    console.log("args.length ", args.length);
                    if (args.length < 3) return "<p>Hello. Why don't you tell me your name?</p>";
                    return "Hello " + args[1];
                  };
                  console.log("initialize terminal");
                  Terminal.init(document.getElementById("terminal"), cmds);
                }
                break;
              case 'fileBrowser':
                  console.log("file browser content detected");
                  console.log("fileBrowser", content.fileBrowser);
                  $("#moduleContainer").load("/fileBrowser.html", function(){
                      var container = $("#moduleContainer").find('.fileBrowserContainer');
                      fileBrowser.create(container, content.fileBrowser);
                  });
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
          $('#commandPrompt').addClass( "hidden");
        }
      }
    }

    return {
      createContents: __createContents
    }
})();
