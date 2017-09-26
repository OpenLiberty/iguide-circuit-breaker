var blueprint = (function(){
  var create = function(blueprintName) {
    var steps = jsonGuide.getSteps(blueprintName);

    //TODO: do some smart checking to make sure it's Github link, and append paths better
    var repo = jsonGuide.getGithubRepo(blueprintName);
    if (repo) {
      var repoIssues = repo + "/issues";
      var repoPR = repo + "/pulls";
  
      var contributeStep = {
        "name": "Contribute",
        "title": "Contribute to this guide",
        "description": [ "Is something missing or needs to be fixed? Raise an <a href='" + repoIssues + "'>issue</a>, or send us a <a href='" + repoPR + "'>pull request</a>.",
                          "<br><a href='" + repo + "'>View this guide on github.</a>"]
      };
      steps.push(contributeStep);
    }
    
    stepContent.setSteps(steps);
    var toc_title = jsonGuide.getGuideDisplayTitle(blueprintName);
    tableofcontents.create(toc_title, steps);

    tableofcontents.selectStep(steps[0].name);
    stepContent.createContents(steps[0]);

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
    $(ID.prevButton).append(messages.prevButton);
    $(ID.nextButton).attr('aria-label', messages.nextButton);
    $(ID.nextButton).prepend(messages.nextButton);

    // Todo move these
    var guideName = jsonGuide.getGuideDisplayTitle(blueprintName);
    $(ID.tableOfContentsTitle).text(guideName);

    calculateBackgroundContainer();    

    $(window).resize(function(){
      calculateBackgroundContainer();
    });
  };

  calculateBackgroundContainer = function(){
    // Calculate the bottom of the table of contents
    var tocParent = $("#toc_container").parent();
    var backgroundMargin = parseInt($("#background_container").css('margin-top')) + parseInt($("#background_container").css('margin-bottom'));
    var backgroundPadding = parseInt($("#background_container").css('padding-top')) + parseInt($("#background_container").css('padding-bottom'));
    var minHeight = tocParent.offset().top + tocParent.height() + backgroundMargin + backgroundPadding;

    // Extend the background container's min-height to cover the table of contents
    $("#background_container").css('min-height', minHeight);
  }

  return {
    create: create
  };
})();

$(document).ready(function() {
  var iguideJsonName = "circuit-breaker.json";
  var iguideContextRoot = "CircuitBreaker"

  jsonGuide.getAGuide(iguideJsonName).done(function() {
    blueprint.create(iguideContextRoot);    
  });
});
