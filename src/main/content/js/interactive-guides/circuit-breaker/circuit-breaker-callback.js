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
                                "<img src='/guides/openliberty/src/main/content/html/interactive-guides/circuit-breaker/images/microserviceDown.png' alt='microservice down' class='sizable'>"
                            );
                        }, 5000);

                        break;
                    case 'ConfigureDelayParams':
                        clearInterval(delayCountdownInterval);
                        __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fail-with-open-circuit.html");
                        contentManager.markCurrentInstructionComplete(stepName);
                        contentManager.setPodContentWithRightSlide(stepName,
                            "<p class='maxspace'>Assuming the circuit is in an <b>open</b> state, the request to the Check Balance microservice fails immediately.  You are instantly notified of the problem, no longer having to wait for the time out period to occur to receive the notification.</p>" +
                            "<p style='margin-top: 10px;'>The circuit will remain in an open state for 5000 ms before switching to a <b>half-open</b> state.</p> " +
                            "<div style='font-size: 16px;'><b>Delay:&nbsp;&nbsp;</b><span class='delayCountdown'>5000 ms</span></div>" +
                            "<div style='font-size: 16px; margin-bottom: 20px;'><b>Circuit State:&nbsp;&nbsp;</b><span class='delayState'> Open</span></div>" +
                            "<div class='delayCountdownImg'><img src='/guides/openliberty/src/main/content/html/interactive-guides/circuit-breaker/images/openCircuitBreaker.png' alt='Check Balance microservice in open circuit' class='sizable'></div>",
                            0
                        );
                        var secondsLeft = 9000;
                        var $delayCountdown = $('.delayCountdown');
                        var delayCountdownInterval = setInterval(function(){
                            secondsLeft -= 100;
                            if (secondsLeft <= 5000) {
                                $delayCountdown.text(secondsLeft + " ms");
                            }
                            if(secondsLeft <= 0){
                                $('.delayState').text("Half-Open");
                                console.log("Show new pic");
                                clearInterval(delayCountdownInterval);   // Stop interval
                                // Slide in new pic
//                                var newPic = "<div class='pod-animation-slide-from-right'><b>blah</b></div>";
                                var newPic = "<div class='pod-animation-slide-from-right'><img src='/guides/openliberty/src/main/content/html/interactive-guides/circuit-breaker/images/halfopenCircuitBreaker.png' alt='Check Balance microservice in half-open circuit' class='sizable'></div>";
                                $('.delayCountdownImg').html( newPic );
                            }
                        }, 100);
                        var stepPod = contentManager.getPod("ConfigureDelayParams", 2).accessPodContent();
                        var breadcrumbElement = stepPod.find('.delaySteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                        breadcrumbElement.find('a[href="#delay-playground"]').parent('li').addClass('enabled');
                        stepPod.find("#delay-action .nextTabButton").css("display", "block");
                        break;
                    case 'ConfigureFailureThresholdParams':
                        var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                        if (currentStepIndex === 1) {
                           __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fail.html");
                           setTimeout(function () {
                                contentManager.updateWithNewInstruction(stepName);
                                contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                                    "<p class='maxspace'>The request is routed to the Check Balance microservice but the microservice is down. Since the circuit breaker has a " +
                                    "policy to open the circuit after 1 failure (2 requestVolumeThreshold x 0.5 failureRatio) occurs in a rolling window of 2 requests, the circuit is still <b>closed</b>.</p> " +
                                    "<p><br/>(image of closed circuit)</p>"+
                                    "<img src='/guides/openliberty/src/main/content/html/interactive-guides/circuit-breaker/images/openCircuitBreaker.png' alt='Check Balance microservice resulting in open circuit' class='sizable'>",
                                    0
                                );
                            }, 5000);
                        } if (currentStepIndex === 2) {
                            contentManager.setPodContentWithRightSlide(webBrowser.getStepName(), "", 0);
                            __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-fail.html");
                            contentManager.markCurrentInstructionComplete(stepName);
                            setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(stepName,
                                    "<p class='maxspace'>The request is routed to the Check Balance microservice but the microservice is still down. Since this is the second failure " +
                                    "in a rolling window of 2 requests, the circuit is now <b>opened</b>.  " +
                                    "The next request to the Check Balance microservice will immediately fail.</p>" +
                                    "<img src='/guides/openliberty/src/main/content/html/interactive-guides/circuit-breaker/images/openCircuitBreaker.png' alt='Check Balance microservice resulting in open circuit' class='sizable'>",
                                    0
                                );
                                stepPod.find(".nextTabButton").css("display", "block");
                            }, 5000);
                            var stepPod = contentManager.getPod("ConfigureFailureThresholdParams", 2).accessPodContent();
                            var breadcrumbElement = stepPod.find('.failureThresholdSteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                            breadcrumbElement.find('a[href="#failureThreshold-playground"]').parent('li').addClass('enabled');
                        } else {
                            // do nothing as we're not honoring any further request
                        }
                        break;
                }
            } else {
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/page-not-found.html");
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
                var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                if (currentStepIndex === 1) {
                    __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-success.html");
                    contentManager.updateWithNewInstruction(stepName);
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p class='maxspace'>Success! This is the first successful call to the Check Balance microservice since the circuit to the service entered a half-open state. The circuit remains in a <b>half-open</b> state until the successThreshold has been reached.</p> " +
                        "<img src='/guides/openliberty/src/main/content/html/interactive-guides/circuit-breaker/images/HalfopenCircuitBreaker.png' alt='Check Balance microservice with half open circuit' class='sizable'>",
                        0
                    );
                }  else if (currentStepIndex === 2) {
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(), "", 0);
                    __refreshWebBrowserContent(webBrowser, "circuit-breaker/check-balance-success.html");
                    contentManager.markCurrentInstructionComplete(stepName);
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p class='maxspace'>Success! This is the second consecutive successful call to the Check Balance microservice since the circuit entered a half-open state. With a successThreshold value of 2, the circuit to the microservice is now <b>closed</b>.</p> " +
                        "<img src='/guides/openliberty/src/main/content/html/interactive-guides/circuit-breaker/images/closedCircuitBreaker.png' alt='Check Balance microservice with closed circuit' class='sizable'>",
                        0
                    );
                    var stepPod = contentManager.getPod("ConfigureSuccessThresholdParams", 2).accessPodContent();
                    var breadcrumbElement = stepPod.find('.successThresholdSteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                    breadcrumbElement.find('a[href="#successThreshold-playground"]').parent('li').addClass('enabled');
                    stepPod.find("#successThreshold-action .nextTabButton").css("display", "block");
                }  else {
                    // do nothing
                }
            } else {
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/page-not-found.html");
            }
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
        if (webBrowser.getStepName() === "ConfigureSuccessThresholdParams") {
            webBrowser.contentRootElement.addClass("");
        }
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
                        "<img src='/guides/openliberty/src/main/content/html/interactive-guides/circuit-breaker/images/halfOpenCircuitBreaker.png' alt='checkBalance microservices with half-open circuit' class='sizable'>"
                    );
                }, 200);
            } else {
                __refreshWebBrowserContent(webBrowser, "circuit-breaker/page-not-found.html");
            }
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToEditorForCircuitBreakerAnnotation = function(editor) {
        var __showPodWithCircuitBreaker = function() {
            var stepName = this.getStepName();
            var content = contentManager.getEditorContents(stepName);
            var paramsToCheck = [];
            if (__checkCircuitBreakerAnnotationInContent(content, paramsToCheck, stepName) === true) {
                //console.log(circuitBreakerAnnotation + " exists - mark complete");
                contentManager.markCurrentInstructionComplete(stepName);
                contentManager.setPodContentWithRightSlide(stepName,
                  /*
                    "<p>A CircuitBreaker policy is added to the Check Balance microservice, which is to open the circuit " +
                    "when 1 (2 requestVolumeThreshold x 0.50 failureRatio) failure occurs among the rolling window of 2 " +
                    " consecutive invocations. The circuit will stay open for 2000ms. Any call made to the service will fail " +
                    " immediately when the circuit is opened. After the delay, the circuit transitions to half open." +
                    " After 2 consecutive successful invocations, the circuit will be back to close again.<br/>" +
                  */
                  "<img src='/guides/openliberty/src/main/content/html/interactive-guides/circuit-breaker/images/check_balance_service_with_circuit_breaker.png' alt='check balance microservice with circuit breaker' class='sizable'>"
                );
            } //else {
                // display error
            //    console.log("display error");
            //    __createErrorLinkForCallBack(stepName, true);
            //}
        };
        editor.addSaveListener(__showPodWithCircuitBreaker);
    };

    var __listenToEditorForAnnotationParamChange = function(editor) {
        var __hideEditor = function() {
            var updateSuccess = false;
            var stepName = editor.getStepName();
            var content = contentManager.getEditorContents(stepName);
            var paramsToCheck = [];
            if (stepName === "ConfigureFailureThresholdParams") {
                paramsToCheck[0] = "requestVolumeThreshold=2";
                paramsToCheck[1] = "failureRatio=0.5";
                var circuitBreakerAnnotationFailure = "@CircuitBreaker(requestVolumeThreshold=2, failureRatio=0.5)";
                //if (content.indexOf(circuitBreakerAnnotationFailure) !== -1) {
                if (__checkCircuitBreakerAnnotationInContent(content, paramsToCheck, stepName) === true) {
                    console.log(circuitBreakerAnnotationFailure + " exists - mark complete");
                    updateSuccess = true;
                }
            } else if (stepName === "ConfigureDelayParams") {
                paramsToCheck[0] = "requestVolumeThreshold=2";
                paramsToCheck[1] = "failureRatio=0.5";
                paramsToCheck[2] = "delay=5000";
                var circuitBreakerAnnotationDelay = "@CircuitBreaker(requestVolumeThreshold=2, failureRatio=0.5, delay=5000)";
                //if (content.indexOf(circuitBreakerAnnotationDelay) !== -1) {
                if (__checkCircuitBreakerAnnotationInContent(content, paramsToCheck, stepName) === true) {
                    console.log(circuitBreakerAnnotationDelay + " exists - mark complete");
                    updateSuccess = true;
                }
            } else if (stepName === "ConfigureSuccessThresholdParams") {
                paramsToCheck[0] = "requestVolumeThreshold=2";
                paramsToCheck[1] = "failureRatio=0.5";
                paramsToCheck[2] = "delay=5000";
                paramsToCheck[3] = "successThreshold=2";
                var circuitBreakerAnnotationSuccess = "@CircuitBreaker(requestVolumeThreshold=2, failureRatio=0.5, delay=5000, successThreshold=2)";
                //if (content.indexOf(circuitBreakerAnnotationSuccess) !== -1) {
                if (__checkCircuitBreakerAnnotationInContent(content, paramsToCheck, stepName) === true) {
                    console.log(circuitBreakerAnnotationSuccess + " exists - mark complete");
                    updateSuccess = true;
                }
            }

            if (updateSuccess) {
                if (stepName === "ConfigureFailureThresholdParams") {
                    var stepPod = contentManager.getPod("ConfigureFailureThresholdParams", 2).accessPodContent();
                    var breadcrumbElement = stepPod.find('.failureThresholdSteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                    breadcrumbElement.find('a[href="#failureThreshold-edit"]').parent('li').addClass('enabled');
                    breadcrumbElement.find('a[href="#failureThreshold-action"]').parent('li').addClass('enabled active');
                    breadcrumbElement.find('a[href="#failureThreshold-action"]').click();
                } else if (stepName === "ConfigureDelayParams") {
                    var stepPod = contentManager.getPod("ConfigureDelayParams", 2).accessPodContent();
                    var breadcrumbElement = stepPod.find('.delaySteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                    breadcrumbElement.find('a[href="#delay-edit"]').parent('li').addClass('enabled');
                    breadcrumbElement.find('a[href="#delay-action"]').parent('li').addClass('enabled active');
                    breadcrumbElement.find('a[href="#delay-action"]').click();
                } else if (stepName === "ConfigureSuccessThresholdParams") {
                    var stepPod = contentManager.getPod("ConfigureSuccessThresholdParams", 2).accessPodContent();
                    var breadcrumbElement = stepPod.find('.successThresholdSteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                    breadcrumbElement.find('a[href="#successThreshold-edit"]').parent('li').addClass('enabled');
                    breadcrumbElement.find('a[href="#successThreshold-action"]').parent('li').addClass('enabled active');
                    breadcrumbElement.find('a[href="#successThreshold-action"]').click();
                }

                var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                if (currentStepIndex === 0) {
                    contentManager.updateWithNewInstruction(stepName);
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
            if (__checkFallbackAnnotationContent(content) === true &&
                __checkFallbackMethodContent(content) === true) {
                console.log(fallbackAnnotation + " and " + fallbackMethod + " exists - mark complete");
                contentManager.markCurrentInstructionComplete(stepName);
                contentManager.setPodContentWithRightSlide(stepName,
                    "<p>(pod sliding in to show checkBalance microservice with circuitBreaker and Fallback in it after save is clicked)</p> " +
                    "<img src='/guides/openliberty/src/main/content/html/interactive-guides/circuit-breaker/images/circuitBreakerWithfallback.png' alt='checkBalance microservices with circuitBreaker and Fallback' class='sizable'>"
                );
            } else {
                // display error and provide link to fix it
                __createErrorLinkForCallBack(stepName, true);
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

    var __createButton = function(buttonId, buttonName, className, method) {
        return $('<button/>', {
            type: 'button',
            text: buttonName,
            id: buttonId,
            class: className,
            click: method
        });
    };

    var __closeErrorBoxEditor = function(stepName) {
        var step = $("[data-step=" + stepName + "]");
        var editorError = step.find(".alertFrame").first();
        console.log("editorError ", editorError);
        if (editorError.length) {
            editorError.addClass("hidden");
        }
    }

    var __createErrorLinkForCallBack = function(stepName, isSave, fallback) {
        var idHere = "here_button_error_editor_" + stepName;
        var idClose = "close_button_error_editor_" + stepName;
        var idError = "error_" + stepName;

        var thisStepName = stepName;
        var thisIsSave = isSave;
        var thisFallback = fallback;

        var handleOnClickAnnotation = function() {
            __correctEditorError(thisStepName, thisIsSave, thisFallback);
        }

        var handleOnClickClose = function() {
            __closeErrorBoxEditor(thisStepName);
        }

        var step = $("[data-step=" + stepName + "]");
        var editorError = step.find(".alertFrame").first();
        if (editorError.length) {
            editorError.removeClass("hidden");

            var errorLink = editorError.find("#" + idError).first();
            if (errorLink.length) {
                // button exists
                // unbind the previous click of this button id
                // before bind it to a new onclick
                $("#" + idHere).unbind("click");
                $("#" + idHere).bind("click", handleOnClickAnnotation);
            } else {
                console.log("create error link");
                var hereButton = __createButton(idHere, messages.hereButton, "here_button_error_editor", handleOnClickAnnotation);
                var closeButton = __createButton(idClose, "", "glyphicon glyphicon-remove-circle close_button_error_editor", handleOnClickClose);
                var strMsg = "Error detected. To fix the error click ";
                //var strMsg = utils.formatString(messages.editorErrorLink, [hereButton]);
                //console.log("AAA msg " + strMsg);
                var spanStr = '<span id=\"' + idError + '\">' + strMsg;
                editorError.append(spanStr);
                editorError.append(hereButton);
                editorError.append(closeButton);
                editorError.append('</span>');
            }
        }
    };

    var __correctEditorError = function(stepName, isSave, fallback) {
        // correct annotation/method
        if (stepName === "AddFallBack") {
            if (isSave === false) {
                var content = contentManager.getEditorContents(stepName);
                // correct fallback annotation
                if (fallback === "fallbackAnnotation") {
                    var hasFBMethod = __checkFallbackMethodContent(content);
                    contentManager.resetEditorContents(stepName);
                    __addFallBackAnnotation(stepName);
                    if (hasFBMethod === true) {
                        __addFallBackMethod(stepName);
                    }
                // correct fallback method
                } else if (fallback === "fallbackMethod") {
                    var hasFBAnnotation = __checkFallbackAnnotationContent(content);
                    contentManager.resetEditorContents(stepName);
                    __addFallBackMethod(stepName);
                    if (hasFBAnnotation === true) {
                        __addFallBackAnnotation(stepName);
                    }
                }
            } else {
                // reset content
                contentManager.resetEditorContents(stepName);
                __addFallBackAnnotation(stepName);
                __addFallBackMethod(stepName);
            }
        } else if (stepName === "AddLibertyMPFaultTolerance") {
               // reset content
               contentManager.resetEditorContents(stepName);
               __addMicroProfileFaultToleranceFeature();
        } else {
            // reset content
            contentManager.resetEditorContents(stepName);
            __addCircuitBreakerAnnotation(stepName);
        }
        // hide the error box
        __closeErrorBoxEditor(stepName);
        // call save editor
        if (isSave === true) {
           __saveButtonEditor(stepName);
        }
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
            // match @CircuitBreaker(...) and capturing groups to get content before annotation, the annotation
            // params, and after annotation content.
            // Syntax:
            //  \s to match all whitespace characters
            //  \S to match non whitespace characters
            //  \d to match digits
            //  () capturing group
            //  (?:) noncapturing group
            var annotationToMatch = "([\\s\\S]*)(@CircuitBreaker" + "\\s*" + "\\(" + "\\s*" +
                "((?:\\s*(?:requestVolumeThreshold|failureRatio|delay|successThreshold)\\s*=\\s*[\\d.,]*)*)" +
                "\\s*" + "\\))" + "(\\s*public\\s*Service\\s*checkBalance[\\s\\S]*)";
            var regExpToMatch = new RegExp(annotationToMatch, "g");
            var groups = regExpToMatch.exec(content);
            editorContents.beforeAnnotationContent = groups[1];

            var params = groups[3];
            params = params.replace('\n','');
            params = params.replace(/\s/g, ''); // Remove whitespace
            if (params.trim() !== "") {
                params = params.split(',');
                console.log(params);
            } else {
                params = [];
            }
            editorContents.annotationParams = params;
            editorContents.afterAnnotationContent = groups[4];
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
            var checkBalanceMethodMatch = content.match(/public\s*Service\s*checkBalance/g);
            if (checkBalanceMethodMatch != null) {
                indexOfCheckMethod = content.indexOf(checkBalanceMethodMatch[0]);
                var beforeCheckMethodContent = content.substring(0, indexOfCheckMethod);
                var afterCheckMethodContent = content.substring(indexOfCheckMethod);
                var newContent = beforeCheckMethodContent + circuitBreakerAnnotation + "\n    " + afterCheckMethodContent;
                contentManager.setEditorContents(stepName, newContent);
            } else {
                // display error
                console.log("the content is screwed ... display error");
                __createErrorLinkForCallBack(stepName, false);
            }
        }
    };

    var __checkCircuitBreakerAnnotationInContent = function(content, paramsToCheck, stepName) {
        var annotationIsThere = true;
        var editorContentBreakdown = __getCircuitBreakerAnnotationContent(content);
        if (editorContentBreakdown.hasOwnProperty("annotationParams")) {
            var isParamInAnnotation = __isParamInAnnotation(editorContentBreakdown.annotationParams, paramsToCheck);
            if (isParamInAnnotation !== 1) {
                annotationIsThere = false;
                // display error
                console.log("save is not preformed ... display error");
                __createErrorLinkForCallBack(stepName, true);
            }
        } else {
            annotationIsThere = false;
            // display error
            console.log("save is not preformed ... display error");
            __createErrorLinkForCallBack(stepName, true);
        }
        return annotationIsThere;
    };

    /*
      Parse for @Fallback annotation in the content. Returns true if the annotation is there, otherwise false.
    */
    var __checkFallbackAnnotationContent = function(content) {
        var match = false;
        //var editorContentBreakdown = {};
        try {
            // match
            // @Fallback(fallbackMethod="fallbackService")
            // <space or newline here>
            // public Service checkBalance
            var annotationToMatch = "([\\s\\S]*)" +
                "(@Fallback" + "\\s*" + "\\(" + "\\s*" + "fallbackMethod\\s*=\\s*" +
                "\"\\s*fallbackService\\s*\"\\s*\\))" +
                "([\\s\\S]*public\\s*Service\\s*checkBalance[\\s\\S]*)";
            var regExpToMatch = new RegExp(annotationToMatch, "g");
            //content.match(/@Fallback(.|\n)*?\((.|\n)*?fallbackMethod(.|\n)*=(.|\n)*"(.|\n)*fallbackService(.|\n)*"\)/g)[0];
            content.match(regExpToMatch)[0];
            match = true;
        }
        catch (e) {
            console.log("Annotation does not match the format: @Fallback (fallbackMethod = \"fallbackService\")");
        }
        return match;
    };

    var __checkFallbackMethodContent = function(content) {
        var match = false;
        try {
            // match
            //   public Service checkBalance () {
            //     <anything here>
            //   }
            //   <space or newline here>
            //   private Service fallbackService () {
            //     return balanceSnapshotService;
            //   }
            //   <space or newline here>
            // }
            var contentToMatch = "([\\s\\S]*)" + "([\\s\\S]*public\\s*Service\\s*checkBalance\\s*\\(\\s*\\)\\s*{[\\s\\S]*})" +
            "(\\s*private\\s*Service\\s*fallbackService\\s*\\(\\s*\\)\\s*{\\s*return\\s*balanceSnapshotService\\s*\\(\\s*\\)\\s*;\\s*}\\s*})"
            var regExpToMatch = new RegExp(contentToMatch, "g");
            content.match(regExpToMatch)[0];
            match = true;
        } catch (e) {
            console.log("Fallback method does not match the format");
        }
        return match;
    };

    var __getMicroProfileFaultToleranceFeatureContent = function(content) {
        var editorContents = {};
        try {
            // match
            // <featureManager>
            //    <anything here>
            // </featureManager>
            // and capturing groups to get content before featureManager, the feature, and after
            // featureManager content.
            var featureManagerToMatch = "([\\s\\S]*)<featureManager>([\\s\\S]*)<\\/featureManager>([\\s\\S]*)";
            var regExpToMatch = new RegExp(featureManagerToMatch, "g");
            var groups = regExpToMatch.exec(content);
            editorContents.beforeFeature = groups[1];
            editorContents.features = groups[2];
            editorContents.afterFeature = groups[3]
        }
        catch (e) {
            console.log("Matching featureManager is not found");
        }
        return editorContents;
    };

    var __isFaultToleranceInFeatures = function(features) {
        var match = false;
        var features = features.replace('\n', '');
        features = features.replace(/\s/g, ''); // Remove whitespace
        try {
            var featureMatches = features.match(/<feature>[\s\S]*?<\/feature>/g);
            $(featureMatches).each(function (index, feature) {
                if (feature.indexOf("<feature>mpFaultTolerance-1.0</feature>") !== -1) {
                    match = true;
                    return false; // break out of each loop
                }

            })
        }
        catch (e) {
            console.log("Matching <feature> ... </feature> is not found");
        }
        return match;
    };

    var __isFaultToleranceInFeatures = function(features) {
        var match = false;
        var features = features.replace('\n', '');
        features = features.replace(/\s/g, ''); // Remove whitespace
        try {
            var featureMatches = features.match(/<feature>[\s\S]*?<\/feature>/g);
            $(featureMatches).each(function (index, feature) {
                if (feature.indexOf("<feature>mpFaultTolerance-1.0</feature>") !== -1) {
                    match = true;
                    return false; // break out of each loop
                }

            })
        }
        catch (e) {
            console.log("Matching <feature>mpFaultTolerance-1.0</feature> is not found");
        }
        return match;
    };

    var __isCDIInFeatures = function(features) {
        var match = false;
        var features = features.replace('\n', '');
        features = features.replace(/\s/g, ''); // Remove whitespace
        try {
            var featureMatches = features.match(/<feature>[\s\S]*?<\/feature>/g);
            $(featureMatches).each(function (index, feature) {
                if (feature.indexOf("<feature>cdi-1.2</feature>") !== -1) {
                    match = true;
                    return false; // break out of each loop
                }

            })
        }
        catch (e) {
            console.log("Matching <feature>cdi-1.2</feature> is not found");
        }
        return match;
    };

    var __checkMicroProfileFaultToleranceFeatureContent = function(content) {
        var isFTFeatureThere = true;
        var editorContentBreakdown = __getMicroProfileFaultToleranceFeatureContent(content);
        if (editorContentBreakdown.hasOwnProperty("features")) {
            isFTFeatureThere = __isFaultToleranceInFeatures(editorContentBreakdown.features) &&
                                __isCDIInFeatures(editorContentBreakdown.features);
        } else {
            isFTFeatureThere = false;
        }
        return isFTFeatureThere;
    };

    var __setMicroProfileFaultToleranceFeatureContent = function(stepName, content) {
        var FTFeature = "   <feature>mpFaultTolerance-1.0</feature>\n   ";
        var editorContentBreakdown = __getMicroProfileFaultToleranceFeatureContent(content);
        if (editorContentBreakdown.hasOwnProperty("features")) {
            var isFTFeatureThere = __isFaultToleranceInFeatures(editorContentBreakdown.features);
            if (isFTFeatureThere === false) { // attempt to fix it
                var newContent = editorContentBreakdown.beforeFeature + "<featureManager>" + editorContentBreakdown.features + FTFeature + "</featureManager>" + editorContentBreakdown.afterFeature;
                contentManager.setEditorContents(stepName, newContent);
            }
        } else {
            indexOfFeatureMgr = content.indexOf("featureManager");
            indexOfFeature = content.indexOf("feature");
            indexOfEndpoint = content.indexOf("<httpEndpoint");
            if (indexOfFeatureMgr === -1 && indexOfFeature === -1 && indexOfEndpoint !== -1) {
                var beforeEndpointContent = content.substring(0, indexOfEndpoint);
                var afterEndpointContent = content.substring(indexOfEndpoint);
                var newContent = beforeEndpointContent.trim() + "\n   <featureManager>\n   " + FTFeature + "</featureManager>\n   " + afterEndpointContent;
                contentManager.setEditorContents(stepName, newContent);
            } else {
                // display error
                console.log("the content is screwed ... display error");
                __createErrorLinkForCallBack(stepName);
            }
        }
    };

    var __addMicroProfileFaultToleranceFeature = function() {
        console.log("add mpFaultTolerance-1.0 feature");
        var stepName = stepContent.getCurrentStepName();
        var content = contentManager.getEditorContents(stepName);
        __setMicroProfileFaultToleranceFeatureContent(stepName, content);
        /*
        var featureAnnotation = "   <feature>mpFaultTolerance-1.0</feature>\n    ";
        // Put the new feature in server.xml
        var endOfFeatureIndex = content.indexOf("</featureManager", 0);
        var toInsertionPtContent = content.substring(0, endOfFeatureIndex);
        var afterInsertionPtContent = content.substring(endOfFeatureIndex);
        contentManager.setEditorContents(stepName, toInsertionPtContent + featureAnnotation + afterInsertionPtContent);
        */
    }

    var __addCircuitBreakerAnnotation = function(stepName) {
        console.log("add @CircuitBreaker");
        var content = contentManager.getEditorContents(stepName);
        var paramsToCheck = [];
        if (stepName === "ConfigureFailureThresholdParams") {
            paramsToCheck[0] = "requestVolumeThreshold=2";
            paramsToCheck[1] = "failureRatio=0.5";
        } else if (stepName === "ConfigureDelayParams") {
            paramsToCheck[0] = "requestVolumeThreshold=2";
            paramsToCheck[1] = "failureRatio=0.5";
            paramsToCheck[2] = "delay=5000";
        } else if (stepName === "ConfigureSuccessThresholdParams") {
            paramsToCheck[0] = "requestVolumeThreshold=2";
            paramsToCheck[1] = "failureRatio=0.5";
            paramsToCheck[2] = "delay=5000";
            paramsToCheck[3] = "successThreshold=2";
        }
        __setAnnotationInContent(content, paramsToCheck, stepName);
    };

    var __addFallBackAnnotation = function(stepName) {
        console.log("add @Fallback ");
        var content = contentManager.getEditorContents(stepName);
        var fallbackAnnotation = "@Fallback (fallbackMethod = \"fallbackService\")\n    ";
        //if (content.indexOf(fallbackAnnotation) === -1) {
        if (__checkFallbackAnnotationContent(content) === false) {
            var circuitBreakerAnnotationIndex = content.indexOf("@CircuitBreaker");
            if (circuitBreakerAnnotationIndex !== -1) {
                var beforeCircuitBreakerAnnotationContent = content.substring(0, circuitBreakerAnnotationIndex);
                var afterContent = content.substring(circuitBreakerAnnotationIndex);
                contentManager.setEditorContents(stepName, beforeCircuitBreakerAnnotationContent + fallbackAnnotation + afterContent);
            } else {
                // display error to fix it
                __createErrorLinkForCallBack(stepName, false, "fallbackAnnotation");
            }
        } else {
            console.log("content already has fallback annotation");
        }
    };

    var __addFallBackMethod = function(stepName) {
        console.log("add @Fallback method ");
        var content = contentManager.getEditorContents(stepName);
        var fallbackMethod = "\n    private Service fallbackService() {\n" +
                             "        return balanceSnapshotService();\n" +
                             "    }\n";
        if (__checkFallbackMethodContent(content) === false) {
            var lastCurlyBraceIndex = content.lastIndexOf("}");
            if (lastCurlyBraceIndex !== -1) {
                var beforeMethodContent = content.substring(0, lastCurlyBraceIndex);
                var afterContent = content.substring(lastCurlyBraceIndex);
                contentManager.setEditorContents(stepName, beforeMethodContent + fallbackMethod + afterContent);
            } else {
                // display error to fix it
                __createErrorLinkForCallBack(stepName, false, "fallbackMethod");
            }
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

    var __saveServerXML = function() {
        var stepName = stepContent.getCurrentStepName();
        var content = contentManager.getEditorContents(stepName);
        if (__checkMicroProfileFaultToleranceFeatureContent(content)) {
            var stepName = stepContent.getCurrentStepName();
            contentManager.markCurrentInstructionComplete(stepName);
        } else {
            // display error to fix it
            __createErrorLinkForCallBack(stepName, true);
        }
    }

    var __listenToEditorForFeatureInServerXML = function(editor) {
        var saveServerXML = function() {
            __saveServerXML();
        }
        editor.addSaveListener(saveServerXML);
    }

    return {
        listenToBrowserForFailBalance: __listenToBrowserForFailBalance,
        listenToBrowserForFallbackSuccessBalance: __listenToBrowserForFallbackSuccessBalance,
        listenToBrowserFromHalfOpenCircuit: __listenToBrowserFromHalfOpenCircuit,
        listenToEditorForCircuitBreakerAnnotation: __listenToEditorForCircuitBreakerAnnotation,
        listenToEditorForFallbackAnnotation: __listenToEditorForFallbackAnnotation,
        listenToEditorForCircuitBreakerAnnotationChanges: __listenToEditorForCircuitBreakerAnnotationChanges,
        listenToEditorForAnnotationParamChange: __listenToEditorForAnnotationParamChange,
        createCircuitBreaker: __createCircuitBreaker,
        populate_url: __populateURLForBalance,
        addMicroProfileFaultToleranceFeature: __addMicroProfileFaultToleranceFeature,
        addCircuitBreakerAnnotation: __addCircuitBreakerAnnotation,
        addFallbackAnnotation: __addFallBackAnnotation,
        addFallbackMethod: __addFallBackMethod,
        enterButtonURLCheckBalance: __enterButtonURLCheckBalance,
        saveButtonEditor: __saveButtonEditor,
        refreshButtonBrowser: __refreshButtonBrowser,
        correctEditorError: __correctEditorError,
        closeErrorBoxEditor: __closeErrorBoxEditor,
        saveServerXML: __saveServerXML,
        listenToEditorForFeatureInServerXML: __listenToEditorForFeatureInServerXML
    };
})();
