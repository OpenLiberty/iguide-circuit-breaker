var stepContent = (function() {
  "use strict";

  var currentStepName;
  var _steps;

  var __setSteps = function(steps){
    _steps = steps;
  };

  var __getCurrentStepName = function() {
    return currentStepName;
  };

  // Hide the previous selected step content by looking for data-step attribute with the step name in it
  var __hideContents = function() {
    var stepToBeHidden = $("[data-step=" + currentStepName + "]");
    stepToBeHidden.addClass("hidden");
  };

   var __updateTitle = function(title){
      $(ID.blueprintTitle).html(title);
   };

  // Update the step description text
  var __updateDescription = function(description, instruction){
    var jointDescription = description;
    if ($.isArray(description)) {
      jointDescription = description.join("<br/>");
    }
    $(ID.blueprintDescription).html(jointDescription);
    if (instruction) {
      $(ID.blueprintDescription).append("<div class=\"instruction\">" + instruction + "</div>");
    }
  };

  /*
    Before create content for the selected step,
    - hide the content of the previous selected step
    - check whether the content of the selected step has been created before
      - if it has, show the existing content
      - otherwise create the new content
  */
  var __createContents = function(step) {

    tableofcontents.selectStep(step);
    __updateTitle(step.name);
    __updateDescription(step.description, step.instruction);

    __hideContents();
    currentStepName = step.name;

    if (!__lookForExistingContents(step)) {
      if (step.content) {
        var content = step.content;
        var displayTypeNum = 1;
        $.each(step.content, function(index, content) {
          if (content.displayType) {
            // create a new div under the main contentContainer to load the content of each display type
            var subContainerDivId = step.name + '-' + content.displayType + '-' + displayTypeNum;
            // data-step attribute is used to look for content of an existing step in __hideContents
            // and __lookForExistingContents.
            var subContainerDiv = '<div id="' + subContainerDivId + '" data-step="' + step.name + '" class="subContainerDiv col-sm-6"></div>';
            var mainContainer = $('#contentContainer');
            console.log(mainContainer);
            mainContainer.append(subContainerDiv);
            var subContainer = $("#" + subContainerDivId);
            displayTypeNum++;

            console.log("displayType: ", content.displayType);
            switch (content.displayType) {
              case 'fileEditor':
                //editor.getEditor(subContainer, step.name, content);
                var newEditor = editor.create(subContainer, step.name, content);
                console.log(newEditor);
                contentManager.setEditor(step.name, newEditor);
                break;
              case 'commandPrompt':
                console.log("commandPrompt detected");
                var newCmdPrompt = cmdPrompt.create(subContainer, step.name, content);
                break;
              case 'webBrowser':
                var newWebBrowser = webBrowser.create(subContainer, step.name, content);
                break;
              case 'fileBrowser':
                console.log("fileBrowser type found.");
                var newFileBrowser = fileBrowser.create(subContainer, content, step.name);
                contentManager.setFileBrowser(step.name, newFileBrowser);
                break;
            }
          }
        });
      }
    }

    //TODO: add buttons here based off of step

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

  return {
    setSteps: __setSteps,
    createContents: __createContents,
    currentStepName: __getCurrentStepName
  };
})();
