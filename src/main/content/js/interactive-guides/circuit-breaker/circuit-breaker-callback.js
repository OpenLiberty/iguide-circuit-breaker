var circuitBreakerCallBack = (function() {
    var checkBalanceURL = "https://global-ebank.com/checkBalance";

    var __refreshWebBrowserContent = function(webBrowser, htmlToLoad) {
        webBrowser.setBrowserContent(htmlToLoad);
    };

    var __listenToBrowserForFailBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (webBrowser.count === undefined) {
                webBrowser.count = 0;
            }
            webBrowser.count++;
            if (currentURL.trim() === checkBalanceURL) {

                var stepName = this.getStepName();
                switch (stepName) {
                    case 'CheckBalance':
                        __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fail.html");
                        contentManager.markCurrentInstructionComplete(stepName);
                        setTimeout(function () {
                            contentManager.setPodContentWithRightSlide(stepName,
                                "<p>Oh no! The Check Balance microservice is down!  As more and more requests come into the service, the users notice that their check balance requests are taking much longer and seem to hang.   " +
                                "The user repeatedly refreshes the page stacking up the requests to the Check Balance microservice even further. " +
                                "Eventually, the web application will be so busy servicing the failed requests it will come to a crawl, " +
                                "even for those not using the Check Balance microservice." +
                                "<br/>" +
                                "<img src='../../../html/interactive-guides/circuit-breaker/images/microserviceDown.png' alt='microservice down'>"
                            );
                        }, 5000);

                        break;
                    case 'ConfigureDelayParams':
                        __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fail-with-open-circuit.html");
                        contentManager.markCurrentInstructionComplete(stepName);
                        contentManager.setPodContentWithRightSlide(stepName,
                            "<p>The call to the Check Balance microservice fails immediately since its circuit is in an open state. The circuit will remain in an open state for 3000 ms before switching to a half open state.</p> " +
                            "<img src='../../../html/interactive-guides/circuit-breaker/images/openCircuitBreaker.png' alt='Check Balance microservice in open circuit'>",
                            1
                        );
                        break;
                    case 'ConfigureFailureThresholdParams':
                        var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                        if (currentStepIndex === 1) {
                           __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fail.html");
                           __updateWithNewInstruction(stepName);
                           setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                                    "<p>The request is routed to the Check Balance microservice but the microservice is down. Since the circuit breaker has a " +
                                    "policy to open the circuit after 2 failures (8 requestVolumeThreshold x 0.25 failureRatio) occur in a rolling window of 4 requests, the circuit is still <b>closed</b>.</p> " +
                                    "<p><br/>(image of closed circuit)</p>",
                                    1
                                );
                            }, 5000);
                        } if (currentStepIndex === 2) {
                            contentManager.setPodContentWithRightSlide(webBrowser.getStepName(), "", 1);
                            __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fail.html");
                            contentManager.markCurrentInstructionComplete(stepName);
                            setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(stepName,
                                    "<p>The request is routed to the Check Balance microservice but the microservice is still down. Since this is the second failure " +
                                    "in a rolling window of 8 requests, the circuit is now <b>opened</b>.  " +
                                    "The next request to the Check Balance microservice will immediately fail.</p>" +
                                    "<img src='../../../html/interactive-guides/circuit-breaker/images/openCircuitBreaker.png' alt='Check Balance microservice resulting in open circuit'>",
                                    1
                                );
                            }, 5000);
                        } else {
                            // do nothing as we're not honoring any further request
                        }
/*                        if (webBrowser.count === 1) {
                            __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fail.html");
                            setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                                    "<p>The request is routed to the Check Balance microservice but the microservice is down. Since the circuit breaker has a " +
                                    "policy to open the circuit after 2 failures (8 requestVolumeThreshold x 0.25 failureRatio) occur in a rolling window of 4 requests, the circuit is still <b>closed</b>.</p> " +
                                    "<p><br/>(image of closed circuit)</p>",
                                    1
                                );
                            }, 5000);
                        } else if (webBrowser.count === 2) {
                            contentManager.setPodContentWithRightSlide(webBrowser.getStepName(), "", 1);
                            __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fail.html");
                            setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(stepName,
                                    "<p>The request is routed to the Check Balance microservice but the microservice is still down. Since this is the second failure " +
                                    "in a rolling window of 8 requests, the circuit is now <b>opened</b>.  " +
                                    "The next request to the Check Balance microservice will immediately fail.</p>" +
                                    "<img src='../../../html/interactive-guides/circuit-breaker/images/openCircuitBreaker.png' alt='Check Balance microservice resulting in open circuit'>",
                                    1
                                );
                            }, 5000);
                        } else {
                            // do nothing as we're not honoring any further request
                        } */
                        break;
                }
            } else {
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/PageNotFound.html");
            }
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
        if (webBrowser.getStepName() === "ConfigureFailureThresholdParams" ||
            webBrowser.getStepName() === "ConfigureDelayParams") {
            webBrowser.contentRootElement.addClass("contentHidden");
        }
    };

    var __listenToBrowserFromHalfOpenCircuit = function (webBrowser) {
        var setBrowserContent = function (currentURL) {
            if (webBrowser.count === undefined) {
                webBrowser.count = 0;
            }
            webBrowser.count++;
            if (currentURL.trim() === checkBalanceURL) {

                var stepName = this.getStepName();
                var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                if (currentStepIndex === 1) {
                    __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-success.html");
                    __updateWithNewInstruction(stepName);
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p>Success! This is the first successful call to the Check Balance microservice since the circuit to the service entered a half-open state. The circuit remains in a <b>half-open</b> state until the successThreshold has been reached.</p> " +
                        "<img src='../../../html/interactive-guides/circuit-breaker/images/HalfopenCircuitBreaker.png' alt='Check Balance microservice with half open circuit'>",
                        1
                    );
                }  else if (currentStepIndex === 2) {
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(), "", 1);
                    __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-success.html");
                    contentManager.markCurrentInstructionComplete(stepName);
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p>Success! This is the second consecutive successful call to the Check Balance microservice since the circuit entered a half-open state. With a successThreshold value of 2, the circuit to the microservice is now <b>closed</b>.</p> " +
                        "<img src='../../../html/interactive-guides/circuit-breaker/images/closedCircuitBreaker.png' alt='Check Balance microservice with closed circuit'>",
                        1
                    );
                }  else {
                    // do nothing
                }




/*                if (webBrowser.count === 1) {
                    __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-success.html");
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p>Success! This is the first successful call to the Check Balance microservice since the circuit to the service entered a half-open state. The circuit remains in a <b>half-open</b> state until the successThreshold has been reached.</p> " +
                        "<img src='../../../html/interactive-guides/circuit-breaker/images/HalfopenCircuitBreaker.png' alt='Check Balance microservice with half open circuit'>",
                        1
                    );
                } else if (webBrowser.count === 2) {
                    __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-success.html");
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p>Success! This is the second consecutive successful call to the Check Balance microservice since the circuit entered a half-open state. With a successThreshold value of 2, the circuit to the microservice is now <b>closed</b>.</p> " +
                        "<img src='../../../html/interactive-guides/circuit-breaker/images/closedCircuitBreaker.png' alt='Check Balance microservice with closed circuit'>",
                        1
                    );
                } else {
                    // do nothing
                } */
            } else {
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/PageNotFound.html");
            }
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
        if (webBrowser.getStepName() === "ConfigureSuccessThresholdParams") {
            webBrowser.contentRootElement.addClass("contentHidden");
        }
    };

    var __listenToBrowserForSuccessBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (currentURL === checkBalanceURL) {
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-success.html");
            } else {
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/PageNotFound.html");
            }
            //setTimeout(function () {
                contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                    "<p>Success! This is the fourth consecutive successful calls to the Check Balance microservice while the circuit is in half-open state. The circuit is back to closed and healthy state.</p> " +
                    "<img src='../../../html/interactive-guides/circuit-breaker/images/closedCircuitBreaker.png' alt='checkBalance microservices with closed circuit'>"
                );
            //}, 100);
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToBrowserForFallbackSuccessBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (currentURL === checkBalanceURL) {
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fallback-success.html");
            } else {
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/PageNotFound.html");
            }
            setTimeout(function () {
                contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                     "<p>(pod sliding in to show a half-open circuit breaker with fallback after refresh is returned showing the balance)</p> " +
                    "<img src='../../../html/interactive-guides/circuit-breaker/images/halfOpenCircuitBreaker.png' alt='checkBalance microservices with half-open circuit'>"
                );
            }, 200);
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToEditorForCircuitBreakerAnnotation = function(editor) {
        var __showPodWithCircuitBreaker = function() {
            var stepName = this.getStepName();
            var content = contentManager.getEditorContents(stepName);
            var circuitBreakerAnnotation = "@CircuitBreaker()";
            if (content.indexOf(circuitBreakerAnnotation) !== -1) {
                console.log(circuitBreakerAnnotation + " exists - mark complete");
                contentManager.markCurrentInstructionComplete(stepName);
                contentManager.setPodContentWithRightSlide(stepName,
                  /*
                    "<p>A CircuitBreaker policy is added to the Check Balance microservice, which is to open the circuit " +
                    "when 1 (2 requestVolumeThreshold x 0.50 failureRatio) failure occurs among the rolling window of 2 " +
                    " consecutive invocations. The circuit will stay open for 2000ms. Any call made to the service will fail " +
                    " immediately when the circuit is opened. After the delay, the circuit transitions to half open." +
                    " After 2 consecutive successful invocations, the circuit will be back to close again.<br/>" +
                  */
                  "<img src='../../../html/interactive-guides/circuit-breaker/images/check_balance_service_with_circuit_breaker.png' alt='check balance microservice with circuit breaker'>"
                );
            }
        };
        editor.addSaveListener(__showPodWithCircuitBreaker);
    };

    var __showNextAction = function(stepName, action) {
        $("#contentContainer").attr("style", "overflow:hidden;");

        if (action === "slideOut") {
            $("#" + stepName + "-fileEditor-1").animate({ "margin-left": "-50%" }, 1000, "linear",
                function () {
                    $(this).addClass("contentHidden");
                    $("#" + stepName + "-webBrowser-3").find(".wb").removeClass("contentHidden");
                    $("#" + stepName + "-pod-4").find(".podContainer").removeClass("contentHidden");
                    $("#" + stepName + "-pod-2").find(".podContainer").removeClass("contentHidden");
                    $("#" + stepName + "-arrow").removeClass("arrowRight");
                    $("#" + stepName + "-arrow").addClass("arrowLeft");
                    $("#" + stepName + "-arrow").find(".glyphicon-chevron-right").addClass("glyphicon-chevron-left");
                    $("#" + stepName + "-arrow").find(".glyphicon-chevron-right").removeClass("glyphicon-chevron-right");
                    $("#" + stepName + "-arrow").attr("aria-label", "Previous");
                    $("#contentContainer").removeAttr("style");
                });
        } else {
            $("#" + stepName + "-fileEditor-1").removeClass("contentHidden");
            $("#" + stepName + "-pod-4").find(".podContainer").addClass("contentHidden");
            $("#" + stepName + "-webBrowser-3").find(".wb").addClass("contentHidden");
            // for desktop
            $("#" + stepName + "-fileEditor-1").animate({ "margin-left": "0%" }, 500, "linear",
                function () {
                    //$("#editorInstruction").removeClass("semiTransparent");
                    //$("#browserInstruction").addClass("semiTransparent");
                    $("#" + stepName + "-arrow").removeClass("arrowLeft");
                    $("#" + stepName + "-arrow").addClass("arrowRight");
                    $("#" + stepName + "-arrow").find(".glyphicon-chevron-left").addClass("glyphicon-chevron-right");
                    $("#" + stepName + "-arrow").find(".glyphicon-chevron-left").removeClass("glyphicon-chevron-left");
                    $("#" + stepName + "-arrow").attr("aria-label", "Next");
                    $("#contentContainer").removeAttr("style");
                });
        }
    };

    var __updateWithNewInstruction = function(stepName) {
        contentManager.markCurrentInstructionComplete(stepName);
        stepContent.instructionWithTag(stepName);
    };

    var __listenToEditorForAnnotationParamChange = function(editor) {
        var __hideEditor = function() {
            var updateSuccess = false;
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            if (stepName === "ConfigureFailureThresholdParams") {
                var circuitBreakerAnnotationFailure = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25)";
                if (content.indexOf(circuitBreakerAnnotationFailure) !== -1) {
                    console.log(circuitBreakerAnnotationFailure + " exists - mark complete");
                    updateSuccess = true;
                }
            } else if (stepName === "ConfigureDelayParams") {
               var circuitBreakerAnnotationDelay = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25, delay=3000)";
                if (content.indexOf(circuitBreakerAnnotationDelay) !== -1) {
                    console.log(circuitBreakerAnnotationDelay + " exists - mark complete");
                    updateSuccess = true;
                }
            } else if (stepName === "ConfigureSuccessThresholdParams") {
                var circuitBreakerAnnotationSuccess = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25, delay=3000, successThreshold=2)";
                if (content.indexOf(circuitBreakerAnnotationSuccess) !== -1) {
                    console.log(circuitBreakerAnnotationSuccess + " exists - mark complete");
                    updateSuccess = true;
                }
            }
 
            if (updateSuccess) {
                __showNextAction(stepName, "slideOut");

                var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                if (currentStepIndex === 0) {
                    __updateWithNewInstruction(stepName);
                }
            }
        }
        editor.addSaveListener(__hideEditor);
    };

    var __listenToEditorForFallbackAnnotation = function(editor) {
        var __showPodWithCircuitBreakerAndFallback = function() {
             contentManager.setPodContentWithRightSlide(this.getStepName(),
                "<p>(pod sliding in to show checkBalance microservice with circuitBreaker and Fallback in it after save is clicked)</p> " +
                "<img src='../../../html/interactive-guides/circuit-breaker/images/circuitBreakerWithfallback.png' alt='checkBalance microservices with circuitBreaker and Fallback'>"
            );
        };
        editor.addSaveListener(__showPodWithCircuitBreakerAndFallback);
    };

    var __listenToEditorForCircuitBreakerAnnotationChanges = function(editor){

        var __showCircuitBreakerInPod = function(){
            // Get pod from contentManager
            var pod = contentManager.getPod(editor.getStepName());
            var cb = pod.circuitBreaker;

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
              console.log("Annotation does not match the format: @CircuitBreaker (requestVolumeThreshold=#, failureRatio=#, delay=#, successThreshold=#)");
            }
        };
        editor.addSaveListener(__showCircuitBreakerInPod);
    };

    var __populateURLForBalance = function(stepName) {
        console.log("set url to ", checkBalanceURL);
        contentManager.setBrowserURL(stepName, checkBalanceURL);
        contentManager.setBrowserURLFocus(stepName);
    };

    var __addCircuitBreakerAnnotation = function(stepName) {
        console.log("add @CircuitBreaker");
        var content = contentManager.getEditorContents(stepName);
        var circuitBreakerAnnotation = "    @CircuitBreaker()";
        if (stepName === "AfterAddCircuitBreakerAnnotation") {
            if (content.indexOf(circuitBreakerAnnotation) === -1) {
                contentManager.insertEditorContents(stepName, 7, circuitBreakerAnnotation, 0);
            } else {
                console.log("content already has circuit breaker annotation");
            }
        } else if (stepName === "ConfigureFailureThresholdParams") {
            circuitBreakerAnnotation = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25)";
            var previousAnnotation = "@CircuitBreaker()";
            var indexOfCircuitBreakerAnnotation = content.indexOf(circuitBreakerAnnotation);
            if (indexOfCircuitBreakerAnnotation === -1) {
                indexOfCircuitBreakerAnnotation = content.indexOf(previousAnnotation);
                var beforeAnnotationContent = content.substring(0, indexOfCircuitBreakerAnnotation);
                var afterAnnotationContent = content.substring(indexOfCircuitBreakerAnnotation + previousAnnotation.length);
                var newContent = beforeAnnotationContent + circuitBreakerAnnotation + afterAnnotationContent;
                contentManager.setEditorContents(stepName, newContent);
            }
        } else if (stepName === "ConfigureDelayParams") {
            circuitBreakerAnnotation = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25, delay=3000)";
            var previousAnnotation = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25)";
            var indexOfCircuitBreakerAnnotation = content.indexOf(circuitBreakerAnnotation);
            if (indexOfCircuitBreakerAnnotation === -1) {
                indexOfCircuitBreakerAnnotation = content.indexOf(previousAnnotation);
                var beforeAnnotationContent = content.substring(0, indexOfCircuitBreakerAnnotation);
                var afterAnnotationContent = content.substring(indexOfCircuitBreakerAnnotation + previousAnnotation.length);
                var newContent = beforeAnnotationContent + circuitBreakerAnnotation + afterAnnotationContent;
                contentManager.setEditorContents(stepName, newContent);
            }
        } else if (stepName === "ConfigureSuccessThresholdParams") {
            circuitBreakerAnnotation = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25, delay=3000, successThreshold=2)";
            var previousAnnotation = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25, delay=3000)";
            var indexOfCircuitBreakerAnnotation = content.indexOf(circuitBreakerAnnotation);
            if (indexOfCircuitBreakerAnnotation === -1) {
                indexOfCircuitBreakerAnnotation = content.indexOf(previousAnnotation);
                var beforeAnnotationContent = content.substring(0, indexOfCircuitBreakerAnnotation);
                var afterAnnotationContent = content.substring(indexOfCircuitBreakerAnnotation + previousAnnotation.length);
                var newContent = beforeAnnotationContent + circuitBreakerAnnotation + afterAnnotationContent;
                contentManager.setEditorContents(stepName, newContent);
            }
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
                             "        return balanceSnapshotService();\n" +
                             "    }";
        if (content.indexOf("private Service fallbackService()") === -1) {
            contentManager.insertEditorContents(stepName, 13, fallbackMethod, 0);
        } else {
            console.log("content already has fallback method");
        }
    };

    var __createCircuitBreaker = function(pod) {
      var root = pod.contentRootElement;

      var cb = circuitBreaker.create(root, 4, 0.5, 3000, 4); // Default values
      pod.circuitBreaker = cb;

      root.find(".circuitBreakerSuccessRequest").on("click", function(){
          cb.sendSuccessfulRequest();
      });
      root.find(".circuitBreakerFailureRequest").on("click", function(){
          cb.sendFailureRequest();
      });
    };

    var __enterButtonURLCheckBalance = function(stepName) {
        console.log("enter button for url check balance");
        contentManager.refreshBrowser(stepName);
/*        var currentUrl = contentManager.getBrowserURL(stepName);
        console.log("enter - currenturl ", currentUrl);
        if (currentUrl === checkBalanceURL) {
            console.log("mark complete");
            contentManager.markCurrentInstructionComplete(stepName);
        } */
    };

    var __saveButtonEditor = function(stepName) {
        console.log("save button editor");
        contentManager.saveEditor(stepName); 
 
 
        var content = contentManager.getEditorContents(stepName);
 /**       if (stepName === "AfterAddCircuitBreakerAnnotation") {
            var circuitBreakerAnnotation = "@CircuitBreaker()";
            if (content.indexOf(circuitBreakerAnnotation) !== -1) {
                console.log(circuitBreakerAnnotation + " exists - mark complete");
                contentManager.markCurrentInstructionComplete(stepName);
            }
        } else 
        if (stepName === "ConfigureFailureThresholdParams") {
            var circuitBreakerAnnotationFailure = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25)";
            if (content.indexOf(circuitBreakerAnnotationFailure) !== -1) {
                console.log(circuitBreakerAnnotationFailure + " exists - mark complete");
                contentManager.markCurrentInstructionComplete(stepName);
            }
        } else  
        if (stepName === "ConfigureDelayParams") {
            var circuitBreakerAnnotationDelay = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25, delay=3000)";
            if (content.indexOf(circuitBreakerAnnotationDelay) !== -1) {
                console.log(circuitBreakerAnnotationDelay + " exists - mark complete");
                contentManager.markCurrentInstructionComplete(stepName);
            }
        } else if (stepName === "ConfigureSuccessThresholdParams") {
            var circuitBreakerAnnotationSuccess = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25, delay=3000, successThreshold=2)";
            if (content.indexOf(circuitBreakerAnnotationSuccess) !== -1) {
                console.log(circuitBreakerAnnotationSuccess + " exists - mark complete");
                contentManager.markCurrentInstructionComplete(stepName);
            }
        } else **/
        if (stepName === "AddFallBack") {
            var fallbackAnnotation = "@Fallback (fallbackMethod = \"fallbackService\")";
            var fallbackMethod = "private Service fallbackService()";
            if (content.indexOf(fallbackAnnotation) !== -1 &&
                content.indexOf(fallbackMethod) !== -1) {
                console.log(fallbackAnnotation + " and " + fallbackMethod + " exists - mark complete");
            }
        }
    };

    var __refreshButtonBrowser = function(stepName) {
        console.log("refresh button");
        contentManager.refreshBrowser(stepName);
        //var content = contentManager.getBrowserURL(stepName);
        if (stepName == "fallbackService") {
            // check content of webbrowser????
            // mark complete?
            //contentManager.markCurrentInstructionComplete(stepName);
        }
    };

    var __listenToSlideArrow = function(pod) {
        var __handleClick = function(element) {
            if (element.hasClass("arrowLeft")) {
                // slide in file editor
                __showNextAction(pod.getStepName(), "slideIn");
            } else {
                // slide out file editor
                __showNextAction(pod.getStepName(), "slideOut");
            }
        }
        var arrowElement = $("#" + pod.getStepName() + "-arrow");
        if (arrowElement.length === 1) {
            arrowElement.on("keydown", function (event) {
                event.stopPropagation();
                if (event.which === 13 || event.which === 32) { // Enter key, Space key
                    __handleClick(arrowElement);
                }
            });
            arrowElement.on("click", function (event) {
                event.stopPropagation();
                __handleClick(arrowElement);
            });
        }
        __hidePod(pod); // not showing the arrow initially
    };

    var __hidePod = function(pod) {
        pod.accessPodContent().addClass("contentHidden");
    }


    return {
        listenToBrowserForFailBalance: __listenToBrowserForFailBalance,
        listenToBrowserForSuccessBalance: __listenToBrowserForSuccessBalance,
        listenToBrowserForFallbackSuccessBalance: __listenToBrowserForFallbackSuccessBalance,
        listenToBrowserFromHalfOpenCircuit: __listenToBrowserFromHalfOpenCircuit,
        listenToEditorForCircuitBreakerAnnotation: __listenToEditorForCircuitBreakerAnnotation,
        listenToEditorForFallbackAnnotation: __listenToEditorForFallbackAnnotation,
        listenToEditorForCircuitBreakerAnnotationChanges: __listenToEditorForCircuitBreakerAnnotationChanges,
        listenToEditorForAnnotationParamChange: __listenToEditorForAnnotationParamChange,
        listenToSlideArrow: __listenToSlideArrow,
        createCircuitBreaker: __createCircuitBreaker,
        populate_url: __populateURLForBalance,
        addCircuitBreakerAnnotation: __addCircuitBreakerAnnotation,
        addFallbackAnnotation: __addFallBackAnnotation,
        addFallbackMethod: __addFallBackMethod,
        enterButtonURLCheckBalance: __enterButtonURLCheckBalance,
        saveButtonEditor: __saveButtonEditor,
        refreshButtonBrowser: __refreshButtonBrowser,
        hidePod: __hidePod
    };
})();
