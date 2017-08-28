var circuitBreakerCallBack = (function() {
    var checkBalanceURL = "http://localhost:9080/RestServicesSamples/banking/checkBalance";

    var __refreshWebBrowserContent = function(webBrowser, htmlToLoad) {
        webBrowser.setBrowserContent(htmlToLoad);
    };

    var __listenToBrowserForFailBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (currentURL.trim() === checkBalanceURL) {
                __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceFail.html");
                var stepName = this.getStepName();
                switch (stepName) {
                    case 'CheckBalance':
                        setTimeout(function () {
                            contentManager.setPodContentWithRightSlide(stepName,
                                "<p>(pod sliding in after url is entered to show the checkBalance microservice is down)</p> " +
                                "<img src='../../../html/guides/circuitBreaker/images/microserviceDown.png' alt='microservice down'>"
                            )
                        }, 5000);

                        break;
                    case 'OpenCircuit':
                        text = "(pod sliding in after refreshing URL to show an open circuit and system is still down.)";

                        setTimeout(function () {
                            contentManager.setPodContentWithRightSlide(stepName,
                                "<p>(pod sliding in after refreshing URL to show an open circuit and system is still down.)</p> " +
                                "<img src='../../../html/guides/circuitBreaker/images/openCircuitBreaker.png' alt='checkBalance microservice with open circuit'>"
                            )
                        }, 5000);

                        break;
                }
            } else {
                __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/PageNotFound.html");
            }
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToBrowserForSuccessBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (currentURL === checkBalanceURL) {
                __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceSuccess.html");
            } else {
                __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/PageNotFound.html");
            }
            //setTimeout(function () {
                contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                    "<p>(pod sliding in to show a closed circuit breaker with fallback after refresh is returned showing the balance)</p> " +
                    "<img src='../../../html/guides/circuitBreaker/images/closedCircuitBreaker.png' alt='checkBalance microservices with closed circuit'>"
                );
            //}, 100);
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToBrowserForFallbackSuccessBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (currentURL === checkBalanceURL) {
                __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceFallbackSuccess.html");
            } else {
                __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/PageNotFound.html");
            }
            setTimeout(function () {
                contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                    "<p>(pod sliding in to show a half-open circuit breaker with fallback after refresh is returned showing the balance)</p> " +
                    "<img src='../../../html/guides/circuitBreaker/images/halfOpenCircuitBreaker.png' alt='checkBalance microservices with half-open circuit'>"
                );
            }, 200);
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToEditorForCircuitBreakerAnnotation = function(editor) {
        var __showPodWithCircuitBreaker = function() {
            contentManager.setPodContentWithRightSlide(this.getStepName(),
                "<p>(pod sliding in to show checkBalance microservice with circuitBreaker in it after save is clicked)</p> " +
                "<img src='../../../html/guides/circuitBreaker/images/microserviceWithCircuitBreaker.png' alt='checkBalance microservices with circuitBreaker'>"
            );
        };
        editor.addSaveListener(__showPodWithCircuitBreaker);
    };

    var __listenToEditorForFallbackAnnotation = function(editor) {
        var __showPodWithCircuitBreakerAndFallback = function() {
             contentManager.setPodContentWithRightSlide(this.getStepName(),
                "<p>(pod sliding in to show checkBalance microservice with circuitBreaker and Fallback in it after save is clicked)</p> " +
                "<img src='../../../html/guides/circuitBreaker/images/circuitBreakerWithfallback.png' alt='checkBalance microservices with circuitBreaker and Fallback'>"
            );
        };
        editor.addSaveListener(__showPodWithCircuitBreakerAndFallback);
    };

    var __listenToEditorForCircuitBreakerAnnotationChanges = function(editor){
        var cb;
        var listenersAdded = false;
        var __showCircuitBreakerInPod = function(){
            if(!cb){
              cb = circuitBreaker.create(this.getStepName(), 4, 4, .5, 1000);
            }
            if(!listenersAdded){
              $("#circuitBreakerSuccessRequest").on("click", function(){
                  cb.sendSuccessfulRequest();
              });
              $("#circuitBreakerFailureRequest").on("click", function(){
                  cb.sendFailureRequest();
              });
              listenersAdded = true;
            }
            console.log("Editor save");
            // Get the parameters from the editor and send to the circuitBreaker
        }
        editor.addSaveListener(__showCircuitBreakerInPod);
    };


    return {
        listenToBrowserForFailBalance: __listenToBrowserForFailBalance,
        listenToBrowserForSuccessBalance: __listenToBrowserForSuccessBalance,
        listenToBrowserForFallbackSuccessBalance: __listenToBrowserForFallbackSuccessBalance,
        listenToEditorForCircuitBreakerAnnotation: __listenToEditorForCircuitBreakerAnnotation,
        listenToEditorForFallbackAnnotation: __listenToEditorForFallbackAnnotation,
        listenToEditorForCircuitBreakerAnnotationChanges: __listenToEditorForCircuitBreakerAnnotationChanges
    }
})();
