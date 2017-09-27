$(document).ready(function() {
    var iguideJsonName = "/guides/iguide-circuit-breaker/json-guides/circuit-breaker.json";
    var iguideContextRoot = "CircuitBreaker"
  
    jsonGuide.getAGuide(iguideJsonName).done(function() {
      blueprint.create(iguideContextRoot);
    });
  });