var cmdPrompt = (function(){

  var terminalInit = false;

  var __create = function(container, stepName, content) {
      console.log("loading cmdPrompt.html", container);
      console.log("content ", content);
      if (!terminalInit) {      
        container.load("../html/guides/cmdPrompt.html", function () {
            var cmdP = container.find('.terminal');
            console.log("cmdP ", cmdP);
            console.log("container id", container[0].id);
            var id = container[0].id + "-cmdPrompt";
            console.log("id ", id);
            cmdP.attr("id", id);
            __createCmdPrompt(id, stepName, content);
        });
        termialInit = true;
      } else {
        console.log("already initialize");
        __focusOnLastInput(container);
      }
  };

  var __createCmdPrompt = function(id, stepName, content) {

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

        cmds.cd = function (args) {
          console.log("args.length ", args.length); 
          //<span class="prompt">$></span>
          var elem = document.getElementById(id);      
          var nodes = elem.querySelectorAll('.prompt');
          var last = nodes[nodes.length- 1];
          last.innerHTML = args[1]  + "$>";
          return "";
        }

        cmds.mkdir = function (args) {
          return "";
        }

        cmds.unzip = function (args) {
          return "unzip successfully";
        }

        cmds.server = function (args) {
          if (args.length === 3 || (args.length === 4 && args[3] === "")) { // don't understand why an extra empty string is passed in sometimes
            if (args[1] === "create" || args[1] === "start" || args[1] === "run") {
               return args[2] + " " + args[1] + " successfully";
            } else {
              return "unrecognize servcer command - " + args[1];
            }
          } else {
            return "invalid server command syntax";
          }
        }

        console.log("initialize terminal");
        var elem = document.getElementById(id);
        Terminal.init(elem, cmds);

        //__checkSupportCmd(elem, cmds);
        /*
        elem.addEventListener("keypress", function(event) {
              var prompt = event.target;
              if(event.keyCode != 13) 
                return false;

              var input = prompt.textContent.split(" ");
              if(input[0] && input[0] in cmds) {               
                  console.log("support cmds");
              } else {
                  console.log("not support" + input);
                  elem.innerHTML += input[0]  + " not support";
              }

              //Terminal.resetPrompt(elem, prompt);
              //event.preventDefault();
        });*/  
  };

  var __checkSupportCmd = function(elem, cmds) {
    elem.addEventListener("keypress", function(event) {
          var prompt = event.target;
          if(event.keyCode != 13) 
            return false;

          var input = prompt.textContent.split(" ");
          if(input[0] && input[0] in cmds) {               
              console.log("support cmds");
          } else {
              console.log("not support" + input);
              elem.innerHTML += input[0]  + " not support";
          }
    });   
  }

  var __focusOnLastInput = function(container) {
      console.log("focus on last input");
      var cmdP = container.find('.terminal');
      var id = container[0].id + "-cmdPrompt";
      console.log("id ", id);    
      var elem = document.getElementById(id);      
      //var elem = document.getElementById("terminal");      
      var nodes = elem.querySelectorAll('.input');
      var last = nodes[nodes.length- 1];
      last.focus(); 
  }

  var __hide = function(container) {
    console.log("hide terminal");
    container.hide();
    //container.addClass("hidden");
    //if ($('#commandPrompt')) {
    //    $('#commandPrompt').addClass( "hidden");
    //}
  }

  return {
    create: __create,
    hide: __hide,
    focus: __focusOnLastInput,
  }
})();