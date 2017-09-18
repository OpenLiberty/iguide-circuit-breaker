var stepContent = (function() {
  "use strict";

  var currentStepName;
  var _steps;

  var setSteps = function(steps) {
    _steps = steps;
  };

  var getCurrentStepName = function() {
    return currentStepName;
  };

  // Hide the previous selected step content by looking for data-step attribute with the step name in it
  var __hideContents = function() {
    var stepToBeHidden = $("[data-step=" + currentStepName + "]");
    stepToBeHidden.addClass("hidden");
  };

  var __updateTitle = function(title) {
    $(ID.blueprintTitle).html(title);
    $(ID.blueprintTitle).attr('aria-label', title);
  };

  // Update the step description text
  var __updateDescription = function(description) {
    var jointDescription = description;
    if ($.isArray(description)) {
      jointDescription = description.join("<br/>");
    }
    $(ID.blueprintDescription).html(jointDescription);
    $(ID.blueprintDescription).attr('tabindex', '0');
  };

  // Update the step instruction text
  var __updateInstructions = function(stepName) {
    $(ID.blueprintInstruction).hide();
    $(ID.blueprintInstruction).empty();
    var index = 0;
    var lastLoadedInstruction = contentManager.getCurrentInstructionIndex(stepName);
    if(lastLoadedInstruction === -1){
      lastLoadedInstruction = contentManager.getInstructionsLastIndex(stepName);
    }
    do {
      var instruction = contentManager.getInstructionAtIndex(index, stepName);

      //__parseAction(instruction);
      //console.log("instruction after parse ", instruction);

      var instr = __addInstructionTag(stepName, instruction, index);

      $(ID.blueprintInstruction).append(instr);
      $(ID.blueprintInstruction).attr('tabindex', '0');
      $(ID.blueprintInstruction).show();
      contentManager.addCheckmarkToInstruction(stepName, index);
      index++;
    } while (index <= lastLoadedInstruction);
  };

  var __parseAction = function(instruction) {
    console.log("AAA __parseAction ");
    console.log("instruction ", instruction);
    if (instruction) {
      if ($.isArray(instruction)) {
        for (var instr in instruction) {
          var instrStr = instruction[instr];
          //console.log("descStr ", instrStr);
          var parseStringAction = utils.parseActionTag(instrStr);
          console.log("parseStringAction ", parseStringAction);
          if (parseStringAction) {
            console.log("string not empty (array) - contains action tag, replace string");
            instruction[instr] = parseStringAction;
          }
        }
      } else {
        var parseStringAction = utils.parseActionTag(instruction);
        console.log("parseStringAction ", parseStringAction);
        if (parseStringAction) {
          console.log("string not empty - contains action tag, replace string");
          instruction = parseStringAction;
          //console.log("instruction - ", instruction);
        }
      }
    }
  };

  var __addInstructionTag = function (stepName, instruction, index) {
    if (instruction != null) { //some 'steps' don't have instructions
      var instructionTag = $('<instruction>', {id: stepName + '-instruction-' + index});
      var instrCompleteMark = $('<span>', {class: 'instrCompleteMark glyphicon glyphicon-check'});
      var instructionContentDiv = $('<div>', {class: 'instructionContent'});
        instructionContentDiv.html(instruction);
        instructionTag.append(instrCompleteMark).append(instructionContentDiv);
      return instructionTag;
    }
  };

  var createInstructionBlock = function(stepName){
    var currentInstruction = contentManager.getCurrentInstruction(stepName);
    var instructionNumber = contentManager.getCurrentInstructionIndex(stepName);    
    if(currentInstruction){
      currentInstruction = __addInstructionTag(stepName, currentInstruction, instructionNumber);
      //append current instruction to previous instructions
      $("#blueprint_instruction").append(currentInstruction);
    }
  };

  /*
    Before create content for the selected step,
    - hide the content of the previous selected step
    - check whether the content of the selected step has been created before
      - if it has, show the existing content
      - otherwise create the new content
      Inputs: {JSON} step
              {Boolean} navButtonClick: True if they clicked on prev/next buttons and false otherwise
  */
  var createContents = function(step, navButtonClick) {
    contentManager.setInstructions(step.name, step.instruction);

    tableofcontents.selectStep(step, navButtonClick);
    contentManager.setInstructions(step.name, step.instruction);

    __updateTitle(step.title);
    __updateDescription(step.description);
    __updateInstructions(step.name);

    __hideContents();
    currentStepName = step.name;

    //__parseDescriptionForButton(step);

    if (!__lookForExistingContents(step)) {
      if (step.content) {
        var content = step.content;
        var displayTypeNum = 1;
        var defaultBootstrapColSize = "col-sm-12";
        // two contents will be side by side. Otherwise, it will be stack on top of each other.
        if (step.content.length == 2) {
          defaultBootstrapColSize = "col-sm-6";
        }
        $.each(step.content, function(index, content) {
          if (content.displayType) {
            var contentBootstrapColSize = defaultBootstrapColSize;
            if (content.size === "100%") {
              contentBootstrapColSize = "col-sm-12";
            } else if (content.size === "75%") {
              contentBootstrapColSize = "col-sm-9";
            } else if (content.size === "50%") {
              contentBootstrapColSize = "col-sm-6";
            } else if (content.size === "40%") {
              contentBootstrapColSize = "col-sm-5";
            } else if (content.size === "10%") {
              contentBootstrapColSize = "col-sm-1";
            }
            // create a new div under the main contentContainer to load the content of each display type
            var subContainerDivId = step.name + '-' + content.displayType + '-' + displayTypeNum;
            // data-step attribute is used to look for content of an existing step in __hideContents
            // and __lookForExistingContents.
            var subContainerDiv = '<div id="' + subContainerDivId + '" data-step="' + step.name + '" class="subContainerDiv ' + contentBootstrapColSize + '"></div>';
            var mainContainer = $('#contentContainer');
            console.log(mainContainer);
            mainContainer.append(subContainerDiv);
            var subContainer = $("#" + subContainerDivId);
            displayTypeNum++;

            console.log("displayType: ", content.displayType);
            switch (content.displayType) {
              case 'fileEditor':
                var newEditor = editor.create(subContainer, step.name, content);
                console.log(newEditor);
                contentManager.setEditor(step.name, newEditor);
                break;
              case 'commandPrompt':
                console.log("commandPrompt detected");
                var newCmdPrompt = cmdPrompt.create(subContainer, step.name, content);
                contentManager.setCommandPrompt(step.name, newCmdPrompt);
                break;
              case 'webBrowser':
                var newWebBrowser = webBrowser.create(subContainer, step.name, content);
                contentManager.setWebBrowser(step.name, newWebBrowser);
                break;
              case 'fileBrowser':
                console.log("fileBrowser type found.");
                var newFileBrowser = fileBrowser.create(subContainer, content, step.name);
                contentManager.setFileBrowser(step.name, newFileBrowser);
                break;
              case 'pod':
                var newPod = pod.create(subContainer, step.name, content);
                contentManager.setPod(step.name, newPod);
                break;
            }
          }
        });
      }
    }
  };

  // Look for step content using data-step attribute with the step name in it
  var __lookForExistingContents = function(step) {
    var existingStep = $("[data-step=" + step.name + "]");
    if (existingStep.length > 0) {
      existingStep.removeClass("hidden");
      return true;
    }
    return false;
  };

  var __createButton = function(buttonId, buttonName, callbackMethod) {
    return $('<button/>', {
      type: 'button',
      text: buttonName,
      id: buttonId,
      click: eval(callbackMethod)
    });
  };

  var __parseDescriptionForButton = function(step) {
    var description = step.description;
    console.log("description: ", description);
    console.log("step.name ", step.name);
    if (description) {
      var buttonArray = [];
      if ($.isArray(description)) {
        for (var desc in description) {
          //console.log("str ", desc);
          var descStr = description[desc];
          //console.log("descStr ", descStr);
          var parseStringButton = utils.parseString(descStr);
          if (parseStringButton) {
            //console.log("string not empty");
            buttonArray.push(parseStringButton);
          } //else {
          //console.log("string is empty");
          //}
        }
      } else {
        var parseStringButton = utils.parseString(description);
        if (parseStringButton) {
          //console.log("string is not empty");
          buttonArray.push(parseStringButton);
        }
      }

      //subContainer.append("<div class=\"buttonContainer\">");
      $(ID.blueprintDescription).append("<br>");
      $(ID.blueprintDescription).append("<div class=\"buttonContainer\">");
      for (var i = 0; i < buttonArray.length; i++) {
        console.log("button ", buttonArray[i]);
        //var buttonId = subContainer[0].id + "-button-" + i;
        var buttonId = utils.replaceString(buttonArray[i], " ");
        console.log("id ", buttonId);
        var callbackMethod = "(function test(currentStepName) {circuitBreakerCallBack." + buttonId + "(\"" + currentStepName + "\")})";
        console.log("callbackMethod ", callbackMethod);

        var button = __createButton(buttonId, buttonArray[i], callbackMethod);
        $(".buttonContainer").append(button);
      }
      //subContainer.append("</div>");
      $(ID.blueprintDescription).append("</div>");
    }
  };

  return {
    setSteps: setSteps,
    createContents: createContents,
    getCurrentStepName: getCurrentStepName,
    createInstructionBlock: createInstructionBlock
  };
})();
