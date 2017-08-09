var Terminal = (function() {
    var initialize = false;

    var history = (localStorage.getItem("history") ? localStorage.getItem("history").split(",") : []),
        historyIndex = history.length;
        self = {};

    var KEY_UP   = 38,
        KEY_DOWN = 40,
        KEY_TAB  = 9;

    // Auxiliary functions

    var resetPrompt = function(terminal, prompt) {
        var newPrompt = prompt.parentNode.cloneNode(true);
        prompt.setAttribute("contenteditable", false);
        if(self.prompt) {
            newPrompt.querySelector(".prompt").textContent = self.prompt;
        }
        terminal.appendChild(newPrompt);
        newPrompt.querySelector(".input").innerHTML = " ";
        newPrompt.querySelector(".input").focus();
    };

    var runCommand = function(terminal, cmd, args) {
        terminal.innerHTML += (self.commands[cmd](args));
    };

    var updateHistory = function(cmd) {
        history.push(cmd);
        localStorage.setItem("history", history);
        historyIndex = history.length;
    };

    var browseHistory = function(prompt, direction) {
        var changedPrompt = false;
        if(direction == KEY_UP && historyIndex > 0) {
            prompt.textContent = history[--historyIndex];
            changedPrompt = true;
        } else if(direction == KEY_DOWN) {
            if(historyIndex < history.length) ++historyIndex;
            if(historyIndex < history.length) prompt.textContent = history[historyIndex];
            else prompt.textContent = " ";
            changedPrompt = true;
        }

        if(changedPrompt) {
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(prompt.childNodes[0], prompt.textContent.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    var autoCompleteInput = function(input) {
        var cmds        = self.commands,
            re          = new RegExp("^" + input, "ig"),
            suggestions = [];
        for(var cmd in cmds) {
            if(cmds.hasOwnProperty(cmd) && cmd.match(re)) {
                suggestions.push(cmd);
            }
        }
        return suggestions;
    };

    // Terminal functions

    self.init = function(elem, commands) {    
        console.log("initialize ", initialize);
        
        if (!initialize) {
            self.commands = commands;
            
            elem.addEventListener("keydown", function(event) {
                if(event.keyCode == KEY_TAB) {
                    var prompt = event.target;
                    var suggestions = autoCompleteInput(prompt.textContent.replace(/\s+/g, ""));

                    if(suggestions.length == 1) {
                        prompt.textContent = suggestions[0];
                        var range = document.createRange();
                        var sel = window.getSelection();
                        range.setStart(prompt.childNodes[0], suggestions[0].length);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }

                    event.preventDefault(true);
                    return false;
                }
            });
        
            elem.addEventListener("keyup", function(event) {
                if(historyIndex < 0) return;
                browseHistory(event.target, event.keyCode);
            });

            elem.addEventListener("keypress", function(event) {
                var prompt = event.target;
                if(event.keyCode != 13) return false;

                updateHistory(prompt.textContent);

                var input = prompt.textContent.split(" ");
                if(input[0] && input[0] in self.commands) {
                    runCommand(elem, input[0], input);
                }

                resetPrompt(elem, prompt);
                event.preventDefault();
            });

            elem.querySelector(".input").focus(); 
            initialize = true;
        } else {
            // focus on last input
            var nodes = elem.querySelectorAll('.input');
            var last = nodes[nodes.length- 1];
            last.focus();
        }           
        return self;
    };
    
    return self;
})();