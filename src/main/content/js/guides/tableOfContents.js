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
        var container = $("<ol id='tableOfContents'>");
        $(ID.tableOfContentsTitle).after(container);

        // Loop through the steps and append each one to the table of contents.
        for(var i = 0; i < steps.length; i++){
          var step = steps[i];
          __buildStep(container, step, 0);
        }
    };

    /*
       Parses a given step and adds it to the container
       Depth is the given depth of the tree so that it can recursively create steps. The depth determines
       how much left-padding the step list item has in the table of contents.
       Input: {div} container, {JSON} step, {number} depth
    */
    var __buildStep = function(container, step, depth, parentName){
      var listItem = $("<li class='tableOfContentsStep'></li>");
      listItem.attr('title', step.title);
      listItem.attr('aria-label', step.title);
      listItem.attr('data-toc', step.name);
      listItem.attr('role', 'presentation');
      listItem.attr('tabindex', '0');
      if(parent){
        listItem.attr('data-parent', parentName);
      }

      // Indent based on depth
      listItem.css('padding-left', depth * 30 + 'px');

      if(step.steps){
        var toggleButton = $("<span class='tableOfContentsToggleButton'></span>");
        toggleButton.addClass('glyphicon glyphicon-triangle-right');
        listItem.append(toggleButton);
        __addToggleButtonListener(listItem, step, toggleButton);
      }

      if(depth > 0){
        listItem.hide();
      }

      // Set text for the step
      var span = $("<span class='tableOfContentsSpan'>");
      span.text(step.title);
      listItem.append(span);

      __addOnClickListener(listItem, step);
      container.append(listItem);

      //used for previous/next button functionality
      orderedStepArray.push(step);
      orderedStepNamesArray.push(step.name);

      console.log("Added: " + step.name);
      // Handle children steps recursively if the step has sub-steps.
      if(step.steps !== undefined && step.steps !== null){
        for(var i = 0; i < step.steps.length; i++){
          var child = step.steps[i];
          __buildStep(container, child, depth + 1, step.name);
        }
      }
    };

    /*
        Hides or shows this step's substeps.
        Input: {Object} step: The step JSON
               {Boolean} expand: True to expand substeps, False to collapse substeps
    */
    var __toggleChildren = function(step, expand) {
      var childSteps = step.steps;
      if(childSteps){
        for(var i = 0; i < childSteps.length; i++){
          var childStep = childSteps[i];
          var $childDomElem = $("[data-toc='" + childStep.name + "']");
          expand ? $childDomElem.show() : $childDomElem.hide();
        }
      }
    };

    /*
        Handler for clicking on a step in the table of contents.
        @param - `span` is the span of the step in the table of contents
        @param - `step` is the JSON containing information for the step
    */
    var __addOnClickListener = function(listItem, step) {
        var span = listItem.find('span');
        span.on("click", function(event){
            event.preventDefault();
            event.stopPropagation();

            console.log("Clicked step: " + step.name);
            stepContent.createContents(step);
        });

        listItem.on("keydown", function(event){
          // Enter key and space key
          if(event.which === 13 || event.which === 32){
            span.click();
          }
        });
    };

    var __addToggleButtonListener = function(listItem, step, toggleButton){
      toggleButton.on("click", function(event){
          event.preventDefault();
          event.stopPropagation();
          console.log("Clicked toggle button for step: " + step.name);
          __toggleExpandButton(step, listItem);
      });

      toggleButton.on("keydown", function(event){
        // Enter key and space key
        if(event.which === 13 || event.which === 32){
          toggleButton.click();
        }
      });
    };

    var __toggleExpandButton = function(stepObj, $step, navButtonClick){
      if(stepObj.steps){
        // Expand arrow if it is closed
        var toggleButton = $step.find('.tableOfContentsToggleButton');
        if(toggleButton.length > 0){
          if(toggleButton.hasClass('glyphicon-triangle-right')){
            toggleButton.removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
            __toggleChildren(stepObj, true);
          }
          // Collapse
          else if(!navButtonClick){
            toggleButton.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
            __toggleChildren(stepObj, false);
          }
        }
      }
      // Expand parents if selecting a hidden step
      if(!$step.is(":visible")){
        var parentName = $step.attr('data-parent');
        if(parentName){
          var $parentStep = $("[data-toc='" + parentName + "']");
          var parentStepIndex = orderedStepNamesArray.indexOf(parentName);
          var parentObj = orderedStepArray[parentStepIndex];
          __toggleExpandButton(parentObj, $parentStep);
          $parentStep.show(); // Show parent after expanding its children and toggling its own parents toggle buttons
        }
      }
    };

    /*
        Handles 1. table of content steps clicks and 2. Prev/Next step button clicks
        Select the step in the table of contents.
    */
    var __selectStep = function(stepObj, navButtonClick){
      // Clear previously selected step and highlight step
      $('.selectedStep').removeClass('selectedStep');
      var $step = $("[data-toc='" + stepObj.name + "']");
      $step.addClass('selectedStep');

      // Collapse / Expand toggle button
      if(navButtonClick){
        __toggleExpandButton(stepObj, $step, true);
      }

      //Hide the previous and next buttons when not needed
      var stepIndex = orderedStepNamesArray.indexOf(stepObj.name);
      var last = orderedStepNamesArray.length - 1;

      if (stepIndex == 0) {
        $(ID.prevButton).hide();
      } else {
        $(ID.prevButton).show();
      }
      if (stepIndex == last) {
        $(ID.nextButton).hide();
      } else {
        $(ID.nextButton).show();
      }
    };

    return {
      create: __create,
      selectStep: __selectStep,
      nextStepFromName: __getNextStepFromName,
      prevStepFromName: __getPrevStepFromName
    };

})();
