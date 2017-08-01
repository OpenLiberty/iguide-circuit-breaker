var tableofcontents = (function() {
    "use strict";

    /*
        Creates the table of contents for the BluePrint based on the JSON representation.
        Input: The steps of the BluePrint represented as JSON
    */
    var __create = function(steps){
        var container = $("<div class='tableOfContents'>");

        // Loop through the steps and append each one to the table of contents.
        for(var i = 0; i < steps.length; i++){
          var step = steps[i];
          __handleStep(container, step, 0);
        }

        console.log(container[0]);
        $("#leftPane").append(container);
    };

    /*
       Parses a given step and adds it to the container
       Depth is the given depth of the tree so that it can recursively create steps. The depth determines
       how much left-padding the step has in the table of contents.
       Input: {div} container, {JSON} step, {number} height
    */
    var __handleStep = function(container, step, depth){
      var span = $("<span class='tableOfContentsStep'>");
      span.text(step.title);
      span.attr('title', step.title);
      span.attr('aria-label', step.title);

      // Indent the text based on depth
      if(depth > 0){
        span.css('text-indent', depth * 10 + 'px');
      }

      __addOnClickListener(span, step);
      container.append(span);

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
    */
    var __addOnClickListener = function(span, step) {
        span.on("click", function(event){
            event.preventDefault();
            event.stopPropagation();

            // Todo: Link the span click to the BluePrint step
            console.log("Clicked step: " + step.name);
        });

        span.on("keydown", function(event){
          event.preventDefault();
          // Enter key and space key
          if(event.which === "13" || event.which === "32"){
            span.click();
          }
        });
    };



    return {
      create: __create
    }

})();

$(document).ready(function() {
  var steps = [];
  var step = {};
  step.name = "Step1";
  step.title = "Step1";

  var a = {};
  a.name = "SubA";
  a.title = "SubA";

  var b = {};
  b.name = "SubB";
  b.title = "SubB";

  var step2 = {};
  step2.name = "Step2";
  step2.title = "Step2";

  step.steps = [a,b];

  steps.push(step);
  steps.push(step2);

  tableofcontents.create(steps);
});
