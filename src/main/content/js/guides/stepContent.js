var stepContent = (function () {
  "use strict"

  var terminalInit = false;
  var currentStepName;

  // Hide the previous selected step content by looking for step-data attribute with the step name in it
  var __hideContents = function () {
    //console.log($("[step-data=" + currentStepName + "]"));
    var stepToBeHidden = $("[step-data=" + currentStepName + "]");
    stepToBeHidden.addClass("hidden");
  }

  // Update the step description text
  var __updateDescription = function(description){
    $("#blueprint_description").text(description);
  };

  /*
    Before create content for the selected step,
    - hide the content of the previous selected step
    - check whether the content of the selected step has been created before
      - if it has, show the existing content
      - otherwise create the new content
  */
  var __createContents = function (step) {

    tableofcontents.selectStep(step.name);
    __updateDescription(step.description);

    __hideContents();
    currentStepName = step.name;

    if (!__lookForExistingContents(step)) {
      if (step.content) {
        var content = step.content;
        var displayTypeNum = 1;
        $.each(step.content, function (index, content) {
          if (content.displayType) {
            // create a new div under the main contentContainer to load the content of each display type
            var subContainerDivId = step.name + '-' + content.displayType + '-' + displayTypeNum;
            // step-data attribute is used to look for content of an existing step in __hideContents
            // and __lookForExistingContents.
            var subContainerDiv = '<div id="' + subContainerDivId + '" step-data="' + step.name + '"></div>';
            var mainContainer = $('#contentContainer');
            console.log(mainContainer);
            mainContainer.append(subContainerDiv);
            var subContainer = $("#" + subContainerDivId);
            displayTypeNum++;

            console.log("displayType: ", content.displayType);
            switch (content.displayType) {
              case 'fileEditor':
                editor.getEditor(subContainer, step.name, content);
                break;
              case 'commandPrompt':
                console.log("commandPrompt detected");

                if (!terminalInit) {
                  subContainer.load("../html/guides/cmdPrompt.html", function () {
                    console.log("load cmdPrompt.html");
                    var container = subContainer.find(".shell-wrap");
                    cmdPrompt.create(container);
                  });
                  terminalInit = true;
                } else {
                  // Annie: this path will not be necessary anymore with the changes
                  console.log("terminal already initialize");
                  // focus cursor on last input
                  var container = subContainer.find(".shell-wrap");
                  cmdPrompt.focus(container);
                }
                break;
            case 'webBrowser':
                webBrowser.create(subContainer, content);
                break;
            case 'fileBrowser':
                console.log("fileBrowser type: ", content.fileBrowser);
                var container = $("#moduleContainer");
                fileBrowser.create(subContainer, content);
                break;
            }
          }
        });
      }
    }
  };

  // Look for step content using step-data attribute with the step name in it
  var __lookForExistingContents = function (step) {
    var existingStep = $("[step-data=" + step.name + "]");
    if (existingStep.length > 0) {
      existingStep.removeClass("hidden");
      return true;
    }
    return false;
  }

  return {
    createContents: __createContents
  }
})();
