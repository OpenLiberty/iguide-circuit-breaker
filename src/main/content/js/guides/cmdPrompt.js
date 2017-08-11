var cmdPrompt = (function(){

  //var _cmdPromptRoot;

  var __create = function(container) {
      container.show();   
      //_cmdPromptRoot = container.find('.cmdPrompt');
      //container.append(_cmdPromptRoot);
    
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
      terminalInit = true;
      var elem = document.getElementById("terminal");
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
      var elem = document.getElementById("terminal");      
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
    focus: __focusOnLastInput
  }
})();