var cmdPrompt = (function(){

  var cmdPromptType = function(container, stepName, content) {
      this.stepName = stepName;
      this.id = "";
      __loadAndCreate(this, container, stepName, content);
  }

  cmdPromptType.prototype = {        
      getStepName: function() {
          return this.stepName;
      },
      getId: function() {
          return this.id;
      },
      setCmdPrompt: function(cmds) {
          __setCmdPrompt(cmds, this.getId());
      },
      getDefaultCmds: function() {
          return __defaultCmds();
      }
  }

  var __loadAndCreate = function(thisCmdPrompt, container, stepName, content) {
      console.log("using ajax to load cmdPrompt.html", container);
      $.ajax({
          context: thisCmdPrompt,
          url: "../html/guides/cmdPrompt.html",
          async: false,
          success: function (result) {
              container.append($(result));
              var cmdP = container.find('.terminal');
              //console.log("cmdP ", cmdP);
              //console.log("container id", container[0].id);
              var id = container[0].id + "-cmdPrompt";
              console.log("id ", id);
              this.id = id;
              cmdP.attr("id", id);
              //console.log("this.id ", this.id);
              if (content.callback) {
                  __createCmdPromptCallBack(thisCmdPrompt, id, stepName, content);
              } else {
                  __createCmdPrompt(thisCmdPrompt, id, stepName, content);
            }
          },
          error: function (result) {
              console.error("Could not load the cmdPrompt.html");
          }
      });
  };

  var __createCmdPrompt = function(thisCmdPrompt, id, stepName, content) {

      var cmds = __defaultCmds();
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

  var __createCmdPromptCallBack = function(thisCmdPrompt, id, stepName, content) {
      console.log(" createCmdPromptCallBack");
      var callback = eval(content.callback);
      callback(thisCmdPrompt); //pass in instance of this class
  }

  var __setCmdPrompt = function(cmds, id) {
      console.log("cmds ", cmds);
      console.log("initialize terminal via callback ", id);
      var elem = document.getElementById(id);
      Terminal.init(elem, cmds);
  }

  var __defaultCmds = function() {
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

      return cmds;
  }

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

  var __create = function(container, stepName, content) {
      return new cmdPromptType(container, stepName, content);
  }

  return {
    create: __create
  }
})();