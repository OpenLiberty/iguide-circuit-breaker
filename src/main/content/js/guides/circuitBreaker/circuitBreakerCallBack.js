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
                                "<p>Oh no! The Check Balance microservice is down!  As more and more requests come into the service, the users notice that their check balance requests are taking much longer and seem to hang.   " +
                                "The user repeatedly refreshes the page stacking up the requests to the Check Balance microservice even further. " +
                                "Eventually, the web application will be so busy servicing the failed requests it will come to a crawl, " +
                                "even for those not using the Check Balance microservice." +
                                "<br/>" +
                                "<img src='../../../html/guides/circuitBreaker/images/microserviceDown.png' alt='microservice down'>"
                            )
                        }, 5000);

                        break;
                    case 'ConfigureDelayParams':
                        __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceFailWithOpenCircuit.html");
                        contentManager.setPodContentWithRightSlide(stepName,
                            "<p>The call to the Check Balance microservice fails immediately since its circuit is in open state. The circuit will remain in open state for 3000 ms before switching to half open state.</p> " +
                            "<img src='../../../html/guides/circuitBreaker/images/openCircuitBreaker.png' alt='Check Balance microservice in open circuit'>"
                        );
                        break;
                    case 'ConfigureFailureThresholdParams':
                        if (webBrowser.failCount === 1) {
                            __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceFail.html");
                            setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(stepName,
                                    "<p>The request is routed to the Check Balance microservice but the microservice is still down. Since the circuit breaker has a , " +
                                    "policy to open the circuit once 1 failure (4 requestVolumnThreshold x 0.25 failureRatio) is reached in a rolling window of 4 requests. the circuit is now open.</p>" +
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
                    __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceSuccess.html");
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p>Success! This is the first successful calls to the Check Balance microservice since the circuit to the service is in half-open state. The circuit remains in half-open state.</p> " +
                        "<img src='../../../html/guides/circuitBreaker/images/HalfopenCircuitBreaker.png' alt='checkBalance microservices with half open circuit'>"
                    );
                } else if (webBrowser.count === 2) {
                    __refreshWebBrowserContent(webBrowser, "../../../html/guides/circuitBreaker/CheckBalanceSuccess.html");
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p>Success! This is the second consecutive successful calls to the Check Balance microservice since the circuit is in half-open state. With a successThreshold of 2, the circuit to the microservice is now closed.</p> " +
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
                /*
                "<p>A CircuitBreaker policy is added to the Check Balance microservice, which is to open the circuit " +
                    "when 1 (2 requestVolumeThreshold x 0.50 failureRatio) failure occurs among the rolling window of 2 " +
                    " consecutive invocations. The circuit will stay open for 2000ms. Any call made to the service will fail " +
                    " immediately when the circuit is opened. After the delay, the circuit transitions to half open." +
                    " After 2 consecutive successful invocations, the circuit will be back to close again.<br/>" +
                */
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
        var __showCircuitBreakerInPod = function(){
            if(!cb){
              cb = circuitBreaker.create(this.getStepName(), 4, 4, .5, 3000);
              $(".circuitBreaker").show();

              $("#circuitBreakerSuccessRequest").on("click", function(){
                  cb.sendSuccessfulRequest();
              });
              $("#circuitBreakerFailureRequest").on("click", function(){
                  cb.sendFailureRequest();
              });
            }

            // Get the parameters from the editor and send to the circuitBreaker
            var content = editor.getEditorContent();
            try{
              var annotation = content.match(/@CircuitBreaker(.|\n)*\)/g)[0];
              annotation = annotation.substring(0,annotation.indexOf("public")).trim(); // Get rid of the public Service...
              var params = annotation.substring(16,annotation.length-1);
              // params = params.replace('\n','');
              params = params.replace(/\s/g, ''); // Remove whitespace
              params = params.split(',');
              params.forEach(function(element, index){
                params[index] = element.trim().substring(element.indexOf('=')+1);
              });
              console.log(params);
              cb.updateParameters.apply(cb, params);
            }
            catch(e){
              console.log("Annotation does not match the format: @CircuitBreaker (requestVolumeThreshold=#, failureRatio=#, delay=#, successThreshold=#)")
            }
        }
        editor.addSaveListener(__showCircuitBreakerInPod);
    };

    var __populateURLForBalance = function(stepName) {
        console.log("set url to ", checkBalanceURL);
        contentManager.setBrowserURL(stepName, checkBalanceURL);
    };

    var __addCircuitBreakerAnnotation = function(stepName) {
        console.log("add @CircuitBreaker");
        var content = contentManager.getEditorContents(stepName);
        var circuitBreakerAnnotation = "    @CircuitBreaker()";
        if (content.indexOf(circuitBreakerAnnotation) === -1) {
             contentManager.insertEditorContents(stepName, 7, circuitBreakerAnnotation, 0);
        } else {
            console.log("content already has circuit breaker annotation");
        }
    };

    var __addFallBackAnnotation = function(stepName) {
        console.log("add @Fallback ");
        var content = contentManager.getEditorContents(stepName);
        var fallbackAnnotation = "    @Fallback (fallbackMethod = \"fallbackService\")";
        if (content.indexOf(fallbackAnnotation) === -1) {
            contentManager.insertEditorContents(stepName, 7, fallbackAnnotation, 0);  
        } else {
            console.log("content already has fallback annotation");
        }
    };

    var __addFallBackMethod = function(stepName) {
        console.log("add @Fallback method ");
        var content = contentManager.getEditorContents(stepName);
        var fallbackMethod = "\n    private Service fallbackService() {\n" +
                             "        return lastKnownBalance();\n" +
                             "    }";
        if (content.indexOf("private Service fallbackService()") === -1) {
            contentManager.insertEditorContents(stepName, 13, fallbackMethod, 0);  
        } else {
            console.log("content already has fallback method");
        }
    };


    return {
        listenToBrowserForFailBalance: __listenToBrowserForFailBalance,
        listenToBrowserForSuccessBalance: __listenToBrowserForSuccessBalance,
        listenToBrowserForFallbackSuccessBalance: __listenToBrowserForFallbackSuccessBalance,
        listenToBrowserFromHalfOpenCircuit: __listenToBrowserFromHalfOpenCircuit,
        listenToEditorForCircuitBreakerAnnotation: __listenToEditorForCircuitBreakerAnnotation,
        listenToEditorForFallbackAnnotation: __listenToEditorForFallbackAnnotation,
        listenToEditorForCircuitBreakerAnnotationChanges: __listenToEditorForCircuitBreakerAnnotationChanges,
        populate_url: __populateURLForBalance,
        addCircuitBreakerAnnotation: __addCircuitBreakerAnnotation,
        addFallbackAnnotation: __addFallBackAnnotation,
        addFallbackMethod: __addFallBackMethod 
    }
})();
