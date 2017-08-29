var circuitBreakerCallBack = (function() {
    var checkBalanceURL = "http://localhost:9080/RestServicesSamples/banking/checkBalance";

    var __refreshWebBrowserContent = function(webBrowser, htmlToLoad) {
        webBrowser.setBrowserContent(htmlToLoad);
    };

    var __listenToBrowserForFailBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (webBrowser.failCount === undefined) {
                webBrowser.failCount = 0;
            }
            webBrowser.failCount++;
            if (currentURL.trim() === checkBalanceURL) {
                
                var stepName = this.getStepName();
                switch (stepName) {
                    case 'CheckBalance':
                        __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceFail.html");
                        setTimeout(function () {
                            contentManager.setPodContentWithRightSlide(stepName,
                                "<p>Oh no! The Check Balance microservice is down!  As more and more requests come into the service the users notice that their check balance requests are taking much longer and seem to hang.   " +
                                "The user repeatedly refreshes the page stacking up the requests to the Check Balance microservice even further. " +
                                "Eventually, the web application will be so busy servicing the failed requests it will come to a crawl, " +
                                "even for those not using the Check Balance microservice." +
                                "<br>" +
                                "<img src='../../../html/guides/circuitBreaker/images/microserviceDown.png' alt='microservice down'>"
                            )
                        }, 5000);

                        break;
                    case 'OpenCircuit':
                        __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceFailWithOpenCircuit.html");
                        contentManager.setPodContentWithRightSlide(stepName,
                            "<p>Any call to the Check Balance microservice fails immediately once its circuit is in open state.</p> " +
                            "<img src='../../../html/guides/circuitBreaker/images/openCircuitBreaker.png' alt='Check Balance microservice in open circuit'>"
                        );
                        break;
                    case 'ClosedCircuit':
                        if (webBrowser.failCount === 1) {
                            __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceFail.html");
                            setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(stepName,
                                    "<p>The request is routed to the Check Balance microservice but the microservice is still down. Since a CircuitBreaker policy is in place, " +
                                    "after one failure, the circuit to the Check Balance microservice is open.</p>" +
                                    "<img src='../../../html/guides/circuitBreaker/images/openCircuitBreaker.png' alt='Check Balance microservice resulting in open circuit'>"
                                );
                            }, 5000);
                        } else {
                            // do nothing as we're not honoring any further request
                        }
                        break;
                }
            } else {
                __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/PageNotFound.html");
            }
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToBrowserFromHalfOpenCircuit = function (webBrowser) {
        var setBrowserContent = function (currentURL) {
            if (webBrowser.count === undefined) {
                webBrowser.count = 0;
            }
            webBrowser.count++;
            if (currentURL.trim() === checkBalanceURL) {

                var stepName = this.getStepName();   
                if (webBrowser.count === 1) {
                    __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceFail.html");
                    setTimeout(function () {
                        contentManager.setPodContentWithRightSlide(stepName,
                            "<p>The circuit to Check Balance microservice is half open and the request is routed to microservice but the microservice is still down. " +
                            "With the failure, the circuit to the Check Balance microservice goes back to open and remains there for 2000 ms.</p>" +
                            "<p>(image to be added later)</p>"
                            //"<img src='../../../html/guides/circuitBreaker/images/openCircuitBreaker.png' alt='Check Balance microservice going back to open circuit'>"
                        );
                    }, 5000);
                } else if (webBrowser.count === 2) {
                    __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceSuccess.html");
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p>Success! This is the first successful calls to the Check Balance microservice when the circuit is in half-open state. The circuit remains in half-open state.</p> " +
                        "<img src='../../../html/guides/circuitBreaker/images/HalfopenCircuitBreaker.png' alt='checkBalance microservices with half open circuit'>"
                    );
                } else if (webBrowser.count === 3) {
                    __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceSuccess.html");
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p>Success! This is the second consecutive successful calls to the Check Balance microservice when the circuit is in half-open state. The circuit is now in closed state.</p> " +
                        "<img src='../../../html/guides/circuitBreaker/images/closedCircuitBreaker.png' alt='checkBalance microservices with closed circuit'>"
                    );
                } else {
                    // do nothing
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
                    "<p>Success! This is the fourth consecutive successful calls to the Check Balance microservice while the circuit is in half-open state. The circuit is back to closed and healthy state.</p> " +
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
                "<p>A CircuitBreaker policy is added to the Check Balance microservice, which is to open the circuit " +
                    "when 1 (2 requestVolumeThreshold x 0.50 failureRatio) failure occurs among the rolling window of 2 " +
                    " consecutive invocations. The circuit will stay open for 2000ms. Any call made to the service will fail " +
                    " immediately when the circuit is opened. After the delay, the circuit transitions to half open." +
                    " After 2 consecutive successful invocations, the circuit will be back to close again.<br/>" +
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
              cb = circuitBreaker.create(this.getStepName(), 4, 4, .5, 3000);
              $(".circuitBreaker").show();
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
        listenToBrowserFromHalfOpenCircuit: __listenToBrowserFromHalfOpenCircuit,
        listenToEditorForCircuitBreakerAnnotation: __listenToEditorForCircuitBreakerAnnotation,
        listenToEditorForFallbackAnnotation: __listenToEditorForFallbackAnnotation,
        listenToEditorForCircuitBreakerAnnotationChanges: __listenToEditorForCircuitBreakerAnnotationChanges
    }
})();
