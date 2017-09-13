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
                        break;
                    case 'ConfigureFailureThreshold2':
                        var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                        if (currentStepIndex === 1) {
                           __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fail.html");
                           __updateWithNewInstruction(stepName);
                           setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                                    "<p>The request is routed to the Check Balance microservice but the microservice is down. Since the circuit breaker has a " +
                                    "policy to open the circuit after 2 failures (8 requestVolumeThreshold x 0.25 failureRatio) occur in a rolling window of 4 requests, the circuit is still <b>closed</b>.</p> " +
                                    "<p><br/>(image of closed circuit)</p>",
                                    0
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
                                    0
                                );
                            }, 5000);
                        } else {
                            // do nothing as we're not honoring any further request
                        }
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
                var stepName = this.getStepName();
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fallback-success.html");
                contentManager.markCurrentInstructionComplete(stepName);
                setTimeout(function () {
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                         "<p>(pod sliding in to show a half-open circuit breaker with fallback after refresh is returned showing the balance)</p> " +
                        "<img src='../../../html/interactive-guides/circuit-breaker/images/halfOpenCircuitBreaker.png' alt='checkBalance microservices with half-open circuit'>"
                    );
                }, 200);
            } else {
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/PageNotFound.html");
            }
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToEditorForCircuitBreakerAnnotation = function(editor) {
        var __showPodWithCircuitBreaker = function() {
            var stepName = this.getStepName();
            var content = contentManager.getEditorContents(stepName);
            var paramsToCheck = [];
            if (__checkAnnotationInContent(content, paramsToCheck, stepName) === true) {
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
            } else {
                // display error
                console.log("display error");
                __createErrorLinkForCallBack(stepName);
            } 
        };
        editor.addSaveListener(__showPodWithCircuitBreaker);
    };

    var __showNextAction = function(stepName, action) {
        $("#contentContainer").attr("style", "overflow:hidden;");

        if (stepName === 'ConfigureFailureThreshold2') {
            return;
        }

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
        stepContent.createInstructionBlock(stepName);
    };

    var __listenToEditorForAnnotationParamChange = function(editor) {
        var __hideEditor = function() {
            var updateSuccess = false;
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            var paramsToCheck = [];
            if (stepName === "ConfigureFailureThresholdParams" ||
                stepName === "ConfigureFailureThreshold2") {
                paramsToCheck[0] = "requestVolumeThreshold=8";
                paramsToCheck[1] = "failureRatio=0.25";
                var circuitBreakerAnnotationFailure = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25)";
                //if (content.indexOf(circuitBreakerAnnotationFailure) !== -1) {
                if (__checkAnnotationInContent(content, paramsToCheck, stepName) === true) {
                    console.log(circuitBreakerAnnotationFailure + " exists - mark complete");
                    updateSuccess = true;
                }
            } else if (stepName === "ConfigureDelayParams") {
                paramsToCheck[0] = "requestVolumeThreshold=8";
                paramsToCheck[1] = "failureRatio=0.25";
                paramsToCheck[2] = "delay=3000";
                var circuitBreakerAnnotationDelay = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25, delay=3000)";
                //if (content.indexOf(circuitBreakerAnnotationDelay) !== -1) {
                if (__checkAnnotationInContent(content, paramsToCheck, stepName) === true) {
                    console.log(circuitBreakerAnnotationDelay + " exists - mark complete");
                    updateSuccess = true;
                }
            } else if (stepName === "ConfigureSuccessThresholdParams") {
                paramsToCheck[0] = "requestVolumeThreshold=8";
                paramsToCheck[1] = "failureRatio=0.25";
                paramsToCheck[2] = "delay=3000";
                paramsToCheck[3] = "successThreshold=2";
                var circuitBreakerAnnotationSuccess = "@CircuitBreaker(requestVolumeThreshold=8, failureRatio=0.25, delay=3000, successThreshold=2)";
                //if (content.indexOf(circuitBreakerAnnotationSuccess) !== -1) {
                if (__checkAnnotationInContent(content, paramsToCheck, stepName) === true) {
                    console.log(circuitBreakerAnnotationSuccess + " exists - mark complete");
                    updateSuccess = true;
                }
            }

            if (updateSuccess) {
                if (stepName === "ConfigureFailureThreshold2") {
                    var stepPod = contentManager.getPod("ConfigureFailureThreshold2", 2).accessPodContent();
                    stepPod.find('.failureThresholdSteps > .tabContainer-tabs > .breadcrumb > li > a[href="#failureThreshold-action"] ').click();
                } else {
                    __showNextAction(stepName, "slideOut");
                }

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
            var stepName = this.getStepName();
            var content = contentManager.getEditorContents(stepName);
            var fallbackAnnotation = "@Fallback (fallbackMethod = \"fallbackService\")";
            var fallbackMethod = "private Service fallbackService()";
            if (content.indexOf(fallbackAnnotation) !== -1 &&
                content.indexOf(fallbackMethod) !== -1) {
                console.log(fallbackAnnotation + " and " + fallbackMethod + " exists - mark complete");
                contentManager.markCurrentInstructionComplete(stepName);
                contentManager.setPodContentWithRightSlide(stepName,
                    "<p>(pod sliding in to show checkBalance microservice with circuitBreaker and Fallback in it after save is clicked)</p> " +
                    "<img src='../../../html/interactive-guides/circuit-breaker/images/circuitBreakerWithfallback.png' alt='checkBalance microservices with circuitBreaker and Fallback'>"
                );
            }
        };
        editor.addSaveListener(__showPodWithCircuitBreakerAndFallback);
    };

    var __listenToEditorForCircuitBreakerAnnotationChanges = function(editor){

        var __showCircuitBreakerInPod = function(){
            // Get pod from contentManager
            var cb = contentManager.getCircuitBreaker(editor.getStepName());

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

    var __closeErrorBoxEditor = function(stepName) {
        var step = $("[data-step=" + stepName + "]");
        var editorError = step.find("#editorError");
        editorError.addClass("hidden");
    }

    var __createErrorLinkForCallBack = function(stepName) {
        var id = "here_button_error_editor_" + stepName;
        
        var step = $("[data-step=" + stepName + "]");
        var editorError = step.find("#editorError");
        editorError.removeClass("hidden");
        var errorLink = editorError.find("#" + id);
        if (errorLink.length) {
            //console.log("id exists");
        } else {
            //console.log("create error link");
            var link = "<button type='button' class='here_button_error_editor' id=" + id + " onclick=\"circuitBreakerCallBack.correctAnnotation('" + stepName + "')\">here</button>";
            var closeButton = "<button type='button' class='glyphicon glyphicon-remove-circle close_button_error_editor' onclick=\"circuitBreakerCallBack.closeErrorBoxEditor('" + stepName +"')\"></button>";
            //var strMsg = utils.formatString(messages.editorErrorLink, link);
            var strMsg = "Error detected in annotation. Click " + link + " to fix the error.";
            //console.log("AAA msg " + strMsg);
            var spanStr = '<span class="sr-only">Error:</span>' + strMsg + closeButton;
            editorError.append(spanStr); 
        }
    };

    var editorOriginalContent = 
            "package global.eBank.mircoservices;\n" +
            "import org.eclipse.microprofile.faulttolerance.CircuitBreaker;\n" +
            "import org.eclipse.microprofile.faulttolerance.exceptions.*;\n" +
            "\n" +
            "public class BankService {\n" +
            "\n" +
            "    public Service checkBalance() {\n" +
            "        counterForInvokingBankingService++;\n" +
            "        return checkBalanceService();\n" +
            "    }\n" +
            "\n}";

    var __correctAnnotation = function(stepName) {
        var circuitBreakerAnnotation = "    @CircuitBreaker()";
        contentManager.setEditorContents(stepName, editorOriginalContent, 0);       
        if (stepName === "AfterAddCircuitBreakerAnnotation") {
            // reset editor content
            contentManager.insertEditorContents(stepName, 7, circuitBreakerAnnotation, 0);        
        } else if (stepName === "ConfigureFailureThresholdParams" ||
                   stepName === "ConfigureFailureThreshold2") { 
            circuitBreakerAnnotation = "    @CircuitBreaker(requestVolumeThreshold=8, \n" +
                                       "                    failureRatio=0.25)";
            contentManager.insertEditorContents(stepName, 7, circuitBreakerAnnotation, 0);
        } else if (stepName === "ConfigureDelayParams") {
            circuitBreakerAnnotation = "    @CircuitBreaker(requestVolumeThreshold=8, \n" +
                                       "                    failureRatio=0.25, \n" +
                                       "                    delay=3000)";
            contentManager.insertEditorContents(stepName, 7, circuitBreakerAnnotation, 0);            
        } else if (stepName === "ConfigureSuccessThresholdParams") {
            circuitBreakerAnnotation = "    @CircuitBreaker(requestVolumeThreshold=8, \n" +
                                       "                    failureRatio=0.25, \n" + 
                                       "                    delay=3000, \n" +
                                       "                    successThreshold=2)";
            contentManager.insertEditorContents(stepName, 7, circuitBreakerAnnotation, 0);       
        } else if (stepName === "AddFallBack") {
            var circuitBreakerAnnotation = "    @CircuitBreaker(requestVolumeThreshold=8, \n" +
                                           "                    failureRatio=0.25, \n" +
                                           "                    delay=3000)";
            contentManager.insertEditorContents(stepName, 7, circuitBreakerAnnotation, 0);
            var fallbackAnnotation = "    @Fallback (fallbackMethod = \"fallbackService\")";           
            var fallbackMethod = "\n    private Service fallbackService() {\n" +
                                 "        return balanceSnapshotService();\n" +
                                 "    }";
            contentManager.insertEditorContents(stepName, 7, fallbackAnnotation, 0);
            contentManager.insertEditorContents(stepName, 12, fallbackMethod, 0);
        }
        // hide the error box
        __closeErrorBoxEditor(stepName);
    }

    // functions to support validation
    /*
      Parse for @CircuitBreaker annotation in the content. If the annotation is there, then
      return the following three attributes:
         beforeAnnotationContent - content up to the annotation
         annotationParams - annotation parameters in an array with line break and extra spacing removed
         afterAnnotationContent - content after the annotation
    */
    var __getCircuitBreakerAnnotationContent = function(content) {
        var editorContents = {};
        try{
            // match @CircuitBreaker(...)
            var annotation = content.match(/@CircuitBreaker(.|\n)*?\((.|\n)*?\)/g)[0];
            editorContents.beforeAnnotationContent = content.substring(0, content.indexOf("@CircuitBreaker"));
            
            var params = annotation.substring(annotation.indexOf("(") + 1, annotation.length-1);
            params = params.replace('\n','');
            params = params.replace(/\s/g, ''); // Remove whitespace
            if (params.trim() !== "") {
                params = params.split(',');
                console.log(params);
            } else {
                params = [];
            }
            editorContents.annotationParams = params;
            if (params.length >= 0) {
                var stringToMatch = "";
                if (params.length === 0) { //if (params.length === 1 && params[0].trim() === "") {
                    stringToMatch = new RegExp("\\)(.|\n)*", "g");
                } else {
                    stringToMatch = new RegExp(params[params.length-1] + "(.|\n)*\\)(.|\n)*", "g");
                }
                var afterAnnotation = content.match(stringToMatch)[0];
                editorContents.afterAnnotationContent = afterAnnotation.substring(afterAnnotation.indexOf(')') + 1);
            }
          }
          catch(e){
            console.log("Annotation does not match the format: @CircuitBreaker (requestVolumeThreshold=#, failureRatio=#, delay=#, successThreshold=#)");
          }
          return editorContents;
    };

    /*
      Match the parameters. Returns
        0 for no match
        1 for exact match
        2 for extra parameters
    */
    var __isParamInAnnotation = function(annotationParams, paramsToCheck) {
        var params = [];
        var allMatch = 1;  // assume matching to begin with
        
        // for each parameter, break it down to name and value so as to make it easier to compare
        $(annotationParams).each(function(index, element){
            if (element.indexOf("=") !== -1) {
                params[index] = {};
                params[index].value = element.trim().substring(element.indexOf('=') + 1);
                params[index].name = element.trim().substring(0, element.indexOf('='));
            } 
        });
        // now compare with the passed in expected params
        $(paramsToCheck).each(function(index, element){
            if (element.indexOf("=") !== -1) {
                var value = element.trim().substring(element.indexOf('=') + 1);
                var name = element.trim().substring(0, element.indexOf('='));
                var eachMatch = false;
                $(params).each(function(paramsIndex, annotationInEditor) {
                    if (annotationInEditor.name === name && annotationInEditor.value === value) {
                        eachMatch = true;
                        return false;  // break out of each loop
                    } 
                });
                if (eachMatch === false) {
                    allMatch = 0;
                    return false; // break out of each loop
                }
            } 
        });

        if (allMatch === 1 && annotationParams.length > paramsToCheck.length) {
            allMatch = 2; // extra parameters
        }
        return allMatch;
    };

    var __setAnnotationInContent = function(content, paramsToCheck, stepName) {
        var checkBalanceMethod = "public Service checkBalance()";
        var circuitBreakerAnnotation = "@CircuitBreaker(";
        if ($.isArray(paramsToCheck) && paramsToCheck.length > 0) {
            circuitBreakerAnnotation += paramsToCheck.join(",\n                    ");
        }
        circuitBreakerAnnotation += ")";
        var editorContentBreakdown = __getCircuitBreakerAnnotationContent(content);
        if (editorContentBreakdown.hasOwnProperty("annotationParams")) {
            var isParamInAnnotation = __isParamInAnnotation(editorContentBreakdown.annotationParams, paramsToCheck);
            if (isParamInAnnotation !== 1) { // attempt to fix it if there is no match or extra param in it
                var newContent = editorContentBreakdown.beforeAnnotationContent + circuitBreakerAnnotation + editorContentBreakdown.afterAnnotationContent;
                contentManager.setEditorContents(stepName, newContent);
            } 
        } else {
            if (content.indexOf(checkBalanceMethod) !== -1) {
                indexOfCheckMethod = content.indexOf(checkBalanceMethod);
                var beforeCheckMethodContent = content.substring(0, indexOfCheckMethod);
                var afterCheckMethodContent = content.substring(indexOfCheckMethod);
                var newContent = beforeCheckMethodContent + circuitBreakerAnnotation + "\n    " + afterCheckMethodContent;
                contentManager.setEditorContents(stepName, newContent);
            } else {
                // display error
                console.log("the content is screwed ... display error");
                __createErrorLinkForCallBack(stepName);
            }
        }
    };

    var __checkAnnotationInContent = function(content, paramsToCheck, stepName) {
        var annotationIsThere = true;
        var editorContentBreakdown = __getCircuitBreakerAnnotationContent(content);
        if (editorContentBreakdown.hasOwnProperty("annotationParams")) {
            var isParamInAnnotation = __isParamInAnnotation(editorContentBreakdown.annotationParams, paramsToCheck);
            if (isParamInAnnotation !== 1) { 
                annotationIsThere = false;
                // display error
                console.log("save is not preformed ... display error");
                __createErrorLinkForCallBack(stepName);
            }
        } else {
            annotationIsThere = false;
            // display error
            console.log("save is not preformed ... display error");
            __createErrorLinkForCallBack(stepName);
        }
        return annotationIsThere;
    };

    var __addCircuitBreakerAnnotation = function(stepName) {
        console.log("add @CircuitBreaker");
        var content = contentManager.getEditorContents(stepName);
        var paramsToCheck = [];
        if (stepName === "ConfigureFailureThresholdParams"  || 
            stepName === "ConfigureFailureThreshold2") {
            paramsToCheck[0] = "requestVolumeThreshold=8";
            paramsToCheck[1] = "failureRatio=0.25";
        } else if (stepName === "ConfigureDelayParams") {
            paramsToCheck[0] = "requestVolumeThreshold=8";
            paramsToCheck[1] = "failureRatio=0.25";
            paramsToCheck[2] = "delay=3000";
        } else if (stepName === "ConfigureSuccessThresholdParams") {
            paramsToCheck[0] = "requestVolumeThreshold=8";
            paramsToCheck[1] = "failureRatio=0.25";
            paramsToCheck[2] = "delay=3000";
            paramsToCheck[3] = "successThreshold=2";
        }
        __setAnnotationInContent(content, paramsToCheck, stepName);
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

    var __enterButtonURLCheckBalance = function(stepName) {
        console.log("enter button for url check balance");
        contentManager.refreshBrowser(stepName);
    };

    var __saveButtonEditor = function(stepName) {
        console.log("save button editor");
        contentManager.saveEditor(stepName);
    };

    var __refreshButtonBrowser = function(stepName) {
        console.log("refresh button");
        contentManager.refreshBrowser(stepName);
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
    };

    var __createCircuitBreaker = function(root, stepName, requestVolumeThreshold, failureRatio, delay, successThreshold, visibleCounters) {
        if(!root.selector){
            root = root.contentRootElement;  
        }              
  
        var cb = circuitBreaker.create(root, requestVolumeThreshold, failureRatio, delay, successThreshold, visibleCounters); // Default values
        root.circuitBreaker = cb;
  
        root.find(".circuitBreakerSuccessRequest").on("click", function(){
            cb.sendSuccessfulRequest();
        });
        root.find(".circuitBreakerFailureRequest").on("click", function(){
            cb.sendFailureRequest();
        });
        contentManager.setCircuitBreaker(stepName, cb);
      };


    /*
        Creates a browser and a pod that holds the circuit breaker inside of the main pod
    */
    var createPlaygroundAndBrowser = function(podInstance, stepName, counters) {
        var podRoot = podInstance.accessPodContent();
        var browserRoot = podRoot.find('.frontEndSection');
        var playgroundroot = podRoot.find('.backEndSection');
        playgroundroot.hide(); // Hide backend at the start

        // Add front-end and back-end listeners
        podRoot.find('.frontEndButton').on("click", function(){
            $('.selectedButton').removeClass('selectedButton');
            $(this).addClass('selectedButton');      
            podRoot.find('.backEndSection').hide();
            podRoot.find('.frontEndSection').show();
        });
        podRoot.find('.backEndButton').on("click", function(){
            $('.selectedButton').removeClass('selectedButton');
            $(this).addClass('selectedButton');   
            podRoot.find('.frontEndSection').hide();
            podRoot.find('.backEndSection').show();
        });

        // Create the web browser and register it with the content manager.
        var newWebBrowser = webBrowser.create(browserRoot, stepName, "");
        contentManager.setWebBrowser(stepName, newWebBrowser);

        // Create the playground and register it with the content manager
        var newCircuitBreaker = __createCircuitBreaker(playgroundroot, stepName, 4, 0.5, 3000, 4, counters);
    };


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
        hidePod: __hidePod,
        correctAnnotation: __correctAnnotation,
        closeErrorBoxEditor: __closeErrorBoxEditor,
        createPlaygroundAndBrowser: createPlaygroundAndBrowser
    };
})();
