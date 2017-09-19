var blueprint = (function(){
  var create = function(blueprintName) {
    var steps = jsonGuide.getSteps(blueprintName);

    //TODO: do some smart checking to make sure it's Github link, and append paths better
    var repo = jsonGuide.getGithubRepo(blueprintName);
    var repoIssues = repo + "/issues";
    var repoPR = repo + "/pulls";

    var contributeStep = {
      "name": "Contribute",
      "title": "Contribute to this guide",
      "description": [ "Is something missing or needs to be fixed? Raise an <a href='" + repoIssues + "'>issue</a>, or send us a <a href='" + repoPR + "'>pull request</a>.",
                        "<br><a href='" + repo + "'>View this guide on github.</a>"]
    };
    steps.push(contributeStep);
    stepContent.setSteps(steps);
    var toc_title = jsonGuide.getGuideDisplayTitle(blueprintName);
    tableofcontents.create(toc_title, steps);

    tableofcontents.selectStep(steps[0].name);
    stepContent.createContents(steps[0]);

    //TODO: May need to move
    //On click listener functions for Previous and Next buttons
    $(ID.prevButton).on('click', function(){
      var prevStep = tableofcontents.prevStepFromName(stepContent.getCurrentStepName());
      stepContent.createContents(prevStep, true);
    });

    $(ID.nextButton).on('click', function(){
      var nextStep = tableofcontents.nextStepFromName(stepContent.getCurrentStepName());
      stepContent.createContents(nextStep, true);
    });

    //adding aria-labels to previous/next buttons and using messages file for button text
    $(ID.navButtons).attr('aria-label', messages.navigationButtons);
    $(ID.prevButton).attr('aria-label', messages.prevButton);
    // $(ID.prevButton).html("<span id='prev_button_icon' class='glyphicon glyphicon-circle-arrow-left'></span> " + messages.prevButton);
    $(ID.prevButton).append(messages.prevButton);
    $(ID.nextButton).attr('aria-label', messages.nextButton);
    // $(ID.nextButton).html("<span id='next_button_icon' class='glyphicon glyphicon-circle-arrow-right'></span> " + messages.nextButton);
    $(ID.nextButton).append(messages.nextButton);

    // Todo move these
    var guideName = jsonGuide.getGuideDisplayTitle(blueprintName);
    $(ID.tableOfContentsTitle).text(guideName);
  };

  return {
    create: create
  }
})();


$(document).ready(function() {
  var blueprintName = "CircuitBreaker";
  console.log(blueprintName);
  jsonGuide.getGuides().done(function() {
    blueprint.create(blueprintName);    
  });
});
