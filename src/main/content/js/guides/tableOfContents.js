var tableofcontents = (function() {
    "use strict";

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

        $("#table_of_contents_title").after(container);
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
      span.attr('role', 'presentation');
      span.attr('tabindex', '0');

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
            stepContent.createContents(step);
        });

        span.on("keydown", function(event){
          // Enter key and space key
          if(event.which === 13 || event.which === 32){
            span.click();
          }
        });
    }

    return {
      create: __create
    }

})();

$(document).ready(function() {
  var index = document.URL.indexOf('blueprint');
  var blueprintName = document.URL.substring(index+10);
  console.log(blueprintName);
  jsonGuide.getGuides().done(function() {
    var steps = jsonGuide.getSteps(blueprintName);
    tableofcontents.create(steps);


    // Todo move these
    $("#table_of_contents_title").text(messages.tableOfContentsTitle);

    var displayTitle = jsonGuide.getGuideDisplayTitle(blueprintName);
    $("#blueprint_title").html("<span>" + displayTitle + "</span>");

    var description = jsonGuide.getGuideDescription(blueprintName);
    $("#blueprint_description").html("<span>" + description + "</span>");

    var fileStructure = [];
    var file1 = "file1";
    var file2 = "file2";

    var file3 = "file3";
    var file4 = "file4";
    var dir1 = {};
    dir1.name = "dir1";
    dir1.files = [file3, file4];

    var dir2 = JSON.parse(JSON.stringify(dir1));
    var dir3 = JSON.parse(JSON.stringify(dir1));
    dir1.files = [dir2, dir3];

    fileStructure.push(file1);
    fileStructure.push(file2);
    fileStructure.push(dir1);

    var codeEdit = $("#codeeditor");

    fileBrowser.create(codeEdit);
    fileBrowser.addFileElement(file1, null, false);
    fileBrowser.addFileElement(file2, null, false);
    fileBrowser.addFileElement(dir1, null, true);
    fileBrowser.addFileElement(file3, "dir1", false);
    fileBrowser.addFileElement(file4, "dir1", false);
  });

});
