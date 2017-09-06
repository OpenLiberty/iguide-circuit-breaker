$(document).ready(function() {
  var blueprintName = document.URL.replace(new RegExp(".*blueprint/"), "");
  console.log(blueprintName);
  jsonGuide.getGuides().done(function() {

    var steps = jsonGuide.getSteps(blueprintName);
    stepContent.setSteps(steps);
    tableofcontents.create(steps);

    tableofcontents.selectStep(steps[0].name);
    stepContent.createContents(steps[0]);

    //TODO: May need to move
    //On click listener functions for Previous and Next buttons
    $(ID.prevButton).on('click', function(){
      var prevStep = tableofcontents.prevStepFromName(stepContent.currentStepName());
      stepContent.createContents(prevStep, true);
    });

    $(ID.nextButton).on('click', function(){
      var nextStep = tableofcontents.nextStepFromName(stepContent.currentStepName());
      stepContent.createContents(nextStep, true);
    });

    //adding aria-labels to previous/next buttons and using messages file for button text
    $(ID.navButtons).attr('aria-label', messages.navigationButtons);
    $(ID.prevButton).attr('aria-label', messages.prevButton);
    $(ID.prevButton).html("<span id='prev_button_icon' class='glyphicon glyphicon-circle-arrow-left'></span> " + messages.prevButton);
    $(ID.nextButton).attr('aria-label', messages.nextButton);
    $(ID.nextButton).html("<span id='next_button_icon' class='glyphicon glyphicon-circle-arrow-right'></span> " + messages.nextButton);

    // Todo move these
    var guideName = jsonGuide.getGuideDisplayTitle(blueprintName);
    $(ID.tableOfContentsTitle).text(guideName);
  });
});
