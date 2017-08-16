var tableofcontents = (function() {
    "use strict";

    //orderedStepArray: populated with the guide steps in order in which whey will be followed
    //orderedStepNamesArray: will used to map guide step name to the index(step number)
    var orderedStepArray = [];
    var orderedStepNamesArray = [];


    var __getNextStepFromName = function(name) {
      var stepIdx = orderedStepNamesArray.indexOf(name);
      return orderedStepArray[stepIdx+1];
    };

    var __getPrevStepFromName = function(name) {
      var stepIdx = orderedStepNamesArray.indexOf(name);
      return orderedStepArray[stepIdx-1];
    };
    /*
        Creates the table of contents for the BluePrint based on the JSON representation.
        Input: The steps of the BluePrint represented as JSON
    */
    var __create = function(steps){
        var container = $("<div id='tableOfContents'>");

        // Loop through the steps and append each one to the table of contents.
        for(var i = 0; i < steps.length; i++){
          var step = steps[i];
          __handleStep(container, step, 0);
        }

        $(id.tableOfContentsTitle).after(container);
    };

    /*
       Parses a given step and adds it to the container
       Depth is the given depth of the tree so that it can recursively create steps. The depth determines
       how much left-padding the step has in the table of contents.
       Input: {div} container, {JSON} step, {number} depth
    */
    var __handleStep = function(container, step, depth){
      var span = $("<span class='tableOfContentsStep'>");
      span.text(step.title);
      span.attr('title', step.title);
      span.attr('aria-label', step.title);
      span.attr('data-toc', step.name);
      span.attr('role', 'presentation');
      span.attr('tabindex', '0');

      // Indent the text based on depth
      if(depth > 0){
        span.css('text-indent', depth * 10 + 'px');
      }

      __addOnClickListener(span, step);
      container.append(span);
      orderedStepArray.push(step); //TODO: may need to remove
      orderedStepNamesArray.push(step.name);

      console.log("Added: " + step.name);
      // Handle children steps recursively if the step has sub-steps.
      if(step.steps !== undefined && step.steps !== null){
        for(var i = 0; i < step.steps.length; i++){
          var child = step.steps[i];
          __handleStep(container, child, depth + 1);
        }
      }
    };

    /*
        Handler for clicking on a step in the table of contents.
        @param - `span` is the span of the step in the table of contents
        @param - `step` is the JSON containing information for the step
    */
    var __addOnClickListener = function(span, step) {
        span.on("click", function(event){
            event.preventDefault();
            event.stopPropagation();

            // Todo: Link the span click to the BluePrint step
            console.log("Clicked step: " + step.name);
            stepContent.createContents(step);
        });

        span.on("keydown", function(event){
          // Enter key and space key
          if(event.which === 13 || event.which === 32){
            span.click();
          }
        });
    };

    var __selectStep = function(name){
      // Clear previously selected step and highlight step
      $('.selectedStep').removeClass('selectedStep');
      var step = $("[data-toc='" + name + "']");
      step.addClass('selectedStep');

      //Hide the previous and next buttons when not needed
      var stepIndex = orderedStepNamesArray.indexOf(name);
      var last = orderedStepNamesArray.length - 1;

      if (stepIndex == 0) {
        $(id.prevButton).hide();
      } else {
        $(id.prevButton).show();
      }
      if (stepIndex == last) {
        $(id.nextButton).hide();
      } else {
        $(id.nextButton).show();
      }
    };

    return {
      create: __create,
      selectStep: __selectStep,
      nextStepFromName: __getNextStepFromName,
      prevStepFromName: __getPrevStepFromName
    };

})();

$(document).ready(function() {
  var blueprintName = document.URL.replace(new RegExp(".*blueprint/"), "");
  console.log(blueprintName);
  jsonGuide.getGuides().done(function() {

    var steps = jsonGuide.getSteps(blueprintName);
    tableofcontents.create(steps);

    tableofcontents.selectStep(steps[0].name);
    stepContent.createContents(steps[0]);

    //TODO: May need to move
    //On click listener functions for Previous and Next buttons
    $(id.prevButton).on('click', function(){
      var prevStep = tableofcontents.prevStepFromName(stepContent.currentStepName());
      stepContent.createContents(prevStep);
    });

    $(id.nextButton).on('click', function(){
      var nextStep = tableofcontents.nextStepFromName(stepContent.currentStepName());
      stepContent.createContents(nextStep);
    });

    // Todo move these
    $(id.tableOfContentsTitle).text(messages.tableOfContentsTitle);

    var displayTitle = jsonGuide.getGuideDisplayTitle(blueprintName);
    $(id.blueprintTitle).html("<span>" + displayTitle + "</span>");

    var description = jsonGuide.getGuideDescription(blueprintName);
    $(id.blueprintDescription).html("<span>" + description + "</span>");
  });
});
