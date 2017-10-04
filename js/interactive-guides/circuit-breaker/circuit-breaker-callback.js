/*******************************************************************************
 * Copyright (c) 2017 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
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
                        __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-fail.html");
                        contentManager.markCurrentInstructionComplete(stepName);
                        setTimeout(function () {
                            contentManager.setPodContentWithRightSlide(stepName,
                                "<p class='maxspace'>Oh no! The Check Balance microservice is down!  As more requests come into the service, the users notice that their check balance requests are taking much longer and seem to hang.   " +
                                "The users repeatedly refresh the page, stacking up the requests to the Check Balance microservice even further. " +
                                "Eventually, the web application is so busy servicing the failed requests that it comes to a crawl, " +
                                "even for those not using the Check Balance microservice." +
                                "</p>" +
                                "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/no-circuit-breaker-service-fail.svg' alt='Microservice is down' class='picInPod'>"
                            );
                        }, 5000);

                        break;
                    case 'ConfigureDelayParams':
                        if (webBrowser.count === 1) {
                            clearInterval(delayCountdownInterval);
                        __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-fail-with-open-circuit.html");
                            contentManager.markCurrentInstructionComplete(stepName);
                            contentManager.setPodContentWithRightSlide(stepName,
                                "<p class='maxspace'>Assuming the circuit is in an <b>open</b> state, the request to the Check Balance microservice fails immediately.  You are instantly notified of the problem and no longer have to wait for the time out period to occur to receive the notification.</p>" +
                                "<p style='margin-top: 10px;'>The circuit remains in an open state for <code>5000 ms</code> before switching to a <b>half-open</b> state.</p> " +
                                "<div style='font-size: 16px;'><b>Delay:&nbsp;&nbsp;</b><span class='delayCountdown'>5000 ms</span></div>" +
                                "<div style='font-size: 16px; margin-bottom: 20px;'><b>Circuit State:&nbsp;&nbsp;</b><span class='delayState'> Open</span></div>" +
                            "<div class='delayCountdownImg'><img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/open.svg' alt='Check Balance microservice in open circuit' class='picInPod'></div>",
                                1
                            );
                            var secondsLeft = 9000;
                            var $delayCountdown = $('.delayCountdown');
                            var delayCountdownInterval = setInterval(function () {
                                secondsLeft -= 100;
                                if (secondsLeft <= 5000) {
                                    $delayCountdown.text(secondsLeft + " ms");
                                }
                                if (secondsLeft <= 0) {
                                    $('.delayState').text("Half-Open");

                                    clearInterval(delayCountdownInterval);   // Stop interval
                                    // Slide in new pic
                                    //                                var newPic = "<div class='pod-animation-slide-from-right'><b>blah</b></div>";
                                var newPic = "<div class='pod-animation-slide-from-right'><img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/halfopen.svg' alt='Check Balance microservice in half-open circuit' class='picInPod'></div>";
                                    $('.delayCountdownImg').html(newPic);
                                }
                            }, 100);
                            var stepPod = contentManager.getPod("ConfigureDelayParams", 0).accessPodContent();
                            var breadcrumbElement = stepPod.find('.delaySteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                            breadcrumbElement.find('a[href="#delay-playground"]').parent('li').addClass('enabled');
                            breadcrumbElement.find('a[href="#delay-playground"]').attr('aria-disabled', 'false');
                            stepPod.find("#delay-action .nextTabButton").css("display", "block");
                        } else {
                            // do nothing as we're not honoring any more request
                        }
                        break;
                    case 'ConfigureFailureThresholdParams':
                        var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                        if (currentStepIndex === 1) {
                           __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-fail.html");
                           contentManager.markCurrentInstructionComplete(stepName);
                           webBrowser.enableRefreshButton(false);
                           setTimeout(function () {
                                contentManager.updateWithNewInstructionNoMarkComplete(stepName);
                                //contentManager.updateWithNewInstruction(stepName);
                                contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                                    "<p class='maxspace'>The request is routed to the Check Balance microservice but the microservice is down. Since the circuit breaker has a " +
                                    "policy to open the circuit after 1 failure (2 requestVolumeThreshold x 0.5 failureRatio) occurs in a rolling window of 2 requests, the circuit remains <b>closed</b>.</p> " +
                                    "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/closed-fail.svg' alt='Check Balance microservice resulting in open circuit' class='picInPod'>",
                                    1
                                );
                                webBrowser.enableRefreshButton(true);
                            }, 5000);
                        } if (currentStepIndex === 2) {
                            contentManager.setPodContentWithRightSlide(webBrowser.getStepName(), "", 1);
                            __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-fail.html");
                            contentManager.markCurrentInstructionComplete(stepName);
                            setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(stepName,
                                    "<p class='maxspace'>The request is routed to the Check Balance microservice but the microservice is still down. Since this failure is the second one " +
                                    "in a rolling window of 2 requests, the circuit is now <b>opened</b>.  " +
                                    "The next request to the Check Balance microservice will immediately fail.</p>" +
                                    "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/open.svg' alt='Check Balance microservice resulting in open circuit' class='picInPod'>",
                                    1
                                );
                                stepPod.find(".nextTabButton").css("display", "block");
                            }, 5000);
                            var stepPod = contentManager.getPod("ConfigureFailureThresholdParams", 0).accessPodContent();
                            var breadcrumbElement = stepPod.find('.failureThresholdSteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                            breadcrumbElement.find('a[href="#failureThreshold-playground"]').parent('li').addClass('enabled');
                            breadcrumbElement.find('a[href="#failureThreshold-playground"]').attr('aria-disabled', 'false');
                        } else {
                            // do nothing as we're not honoring any further request
                        }
                        break;
                }
            } else {
                __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/page-not-found.html");
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
                    __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-success.html");
                    contentManager.updateWithNewInstruction(stepName);
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p class='maxspace'>Success! This is the first successful call to the Check Balance microservice since the circuit to the service entered a half-open state. The circuit remains in a <b>half-open</b> state until the successThreshold has been reached.</p> " +
                        "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/halfopen.svg' alt='Check Balance microservice in half-open circuit' class='picInPod'>",
                        1
                    );
                }  else if (currentStepIndex === 2) {
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(), "", 1);
                    __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-success.html");
                    contentManager.markCurrentInstructionComplete(stepName);
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<p class='maxspace'>Success! This is the second consecutive successful call to the Check Balance microservice since the circuit entered a half-open state. With a successThreshold value of 2, the circuit to the microservice is now <b>closed</b>.</p> " +
                        "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/closed.svg' alt='Check Balance microservice in closed circuit' class='picInPod'>",
                        1
                    );
                    var stepPod = contentManager.getPod("ConfigureSuccessThresholdParams", 0).accessPodContent();
                    var breadcrumbElement = stepPod.find('.successThresholdSteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                    breadcrumbElement.find('a[href="#successThreshold-playground"]').parent('li').addClass('enabled');
                    breadcrumbElement.find('a[href="#successThreshold-playground"]').attr('aria-disabled', 'false');
                    stepPod.find("#successThreshold-action .nextTabButton").css("display", "block");
                }  else {
                    // do nothing
                }
            } else {
                __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/page-not-found.html");
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
                __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-fallback-success.html");
                contentManager.markCurrentInstructionComplete(stepName);
                setTimeout(function () {
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/open-fallback.svg' alt='Check Balance microservice in half-open circuit' class='picInPod'>"
                    );
                }, 200);
            } else {
                __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/page-not-found.html");
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

                contentManager.markCurrentInstructionComplete(stepName);
                contentManager.setPodContentWithRightSlide(stepName,
                  /*
                    "<p>A CircuitBreaker policy is added to the Check Balance microservice, which is to open the circuit " +
                    "when 1 (2 requestVolumeThreshold x 0.50 failureRatio) failure occurs among the rolling window of 2 " +
                    " consecutive invocations. The circuit will stay open for 2000ms. Any call made to the service will fail " +
                    " immediately when the circuit is opened. After the delay, the circuit transitions to half-open." +
                    " After 2 consecutive successful invocations, the circuit will be back to close again.<br/>" +
                  */
                  "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/with-circuit-breaker.svg' alt='Check Balance microservice with circuit breaker' class='picInPod'>"
                );
            } else {
                // display error

                __createErrorLinkForCallBack(stepName, true);
            }
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

                    updateSuccess = true;
                }
            } else if (stepName === "ConfigureDelayParams") {
                paramsToCheck[0] = "requestVolumeThreshold=2";
                paramsToCheck[1] = "failureRatio=0.5";
                paramsToCheck[2] = "delay=5000";
                var circuitBreakerAnnotationDelay = "@CircuitBreaker(requestVolumeThreshold=2, failureRatio=0.5, delay=5000)";
                //if (content.indexOf(circuitBreakerAnnotationDelay) !== -1) {
                if (__checkCircuitBreakerAnnotationInContent(content, paramsToCheck, stepName) === true) {

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

                    updateSuccess = true;
                }
            }

            if (updateSuccess) {
                if (stepName === "ConfigureFailureThresholdParams") {
                    var stepPod = contentManager.getPod("ConfigureFailureThresholdParams", 0).accessPodContent();
                    var breadcrumbElement = stepPod.find('.failureThresholdSteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                    breadcrumbElement.find('a[href="#failureThreshold-edit"]').parent('li').addClass('enabled');
                    breadcrumbElement.find('a[href="#failureThreshold-action"]').parent('li').addClass('enabled active');
                    breadcrumbElement.find('a[href="#failureThreshold-action"]').attr('aria-disabled','false');
                    breadcrumbElement.find('a[href="#failureThreshold-action"]').click();
                } else if (stepName === "ConfigureDelayParams") {
                    var stepPod = contentManager.getPod("ConfigureDelayParams", 0).accessPodContent();
                    var breadcrumbElement = stepPod.find('.delaySteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                    breadcrumbElement.find('a[href="#delay-edit"]').parent('li').addClass('enabled');
                    breadcrumbElement.find('a[href="#delay-action"]').parent('li').addClass('enabled active');
                    breadcrumbElement.find('a[href="#delay-action"]').attr('aria-disabled','false');
                    breadcrumbElement.find('a[href="#delay-action"]').click();
                } else if (stepName === "ConfigureSuccessThresholdParams") {
                    var stepPod = contentManager.getPod("ConfigureSuccessThresholdParams", 0).accessPodContent();
                    var breadcrumbElement = stepPod.find('.successThresholdSteps > .stepProgression > .tabContainer-tabs > .nav-tabs');
                    breadcrumbElement.find('a[href="#successThreshold-edit"]').parent('li').addClass('enabled');
                    breadcrumbElement.find('a[href="#successThreshold-action"]').parent('li').addClass('enabled active');
                    breadcrumbElement.find('a[href="#successThreshold-action"]').attr('aria-disabled','false');
                    breadcrumbElement.find('a[href="#successThreshold-action"]').click();
                }

                var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                if (currentStepIndex === 0) {
                    contentManager.updateWithNewInstruction(stepName);
                }
            } else {
                // display error

                __createErrorLinkForCallBack(stepName, true);
            }
        };
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

                contentManager.markCurrentInstructionComplete(stepName);
                contentManager.setPodContentWithRightSlide(stepName,
                    "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/added-fallback.svg' alt='Check Balance microservice with Circuit Breaker and Fallback policies' class='picInPod'>"
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

              cb.updateParameters.apply(cb, params);
            }
            catch(e){

            }
        };
        editor.addSaveListener(__showCircuitBreakerInPod);
    };

    var __populateURLForBalance = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
               // Click or 'Enter' or 'Space' key event...

               contentManager.setBrowserURL(stepName, checkBalanceURL);
        }
    };

    var __createButton = function(buttonId, buttonName, className, method, ariaLabel) {
        return $('<button/>', {
            type: 'button',
            text: buttonName,
            id: buttonId,
            class: className,
            click: method,
            'aria-label': ariaLabel
        });
    };

    var __closeErrorBoxEditor = function(stepName) {
        var step = $("[data-step=" + stepName + "]");
        var editorError = step.find(".alertFrame").first();

        if (editorError.length) {
            editorError.addClass("hidden");
        }
    };

    var __createErrorLinkForCallBack = function(stepName, isSave, fallback) {
        var idHere = "here_button_error_editor_" + stepName;
        var idClose = "close_button_error_editor_" + stepName;
        var idError = "error_" + stepName;

        var thisStepName = stepName;
        var thisIsSave = isSave;
        var thisFallback = fallback;

        var handleOnClickAnnotation = function() {
            __correctEditorError(thisStepName, thisIsSave, thisFallback);
        };

        var handleOnClickClose = function() {
            __closeErrorBoxEditor(thisStepName);
        };

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

                var hereButton = __createButton(idHere, messages.hereButton, "here_button_error_editor", handleOnClickAnnotation, "Here");
                var closeButton = __createButton(idClose, "", "glyphicon glyphicon-remove-circle close_button_error_editor", handleOnClickClose, "Close error");
                var strMsg = "Error detected. To fix the error click ";
                //var strMsg = utils.formatString(messages.editorErrorLink, [hereButton]);

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
                    __addFallBackAnnotation(stepName);
                // correct fallback method
                } else if (fallback === "fallbackMethod") {
                    __addFallBackMethod(stepName);
                }
            } else {
                var content = contentManager.getEditorContents(stepName);
                var hasFBMethod = __checkFallbackMethodContent(content);
                __addFallBackAnnotation(stepName);
                if (hasFBMethod === false) {
                    __addFallBackMethod(stepName, false);
                }
            }
        } else if (stepName === "AddLibertyMPFaultTolerance") {
               __addMicroProfileFaultToleranceFeature();
        } else {
            __addCircuitBreakerAnnotation(stepName);
        }
        // hide the error box
        __closeErrorBoxEditor(stepName);
        // call save editor
        if (isSave === true) {
           __saveButtonEditor(stepName);
        }
    };

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
            // match
            // public class BankService {
            //   <space or newline>
            //   @CircuitBreaker(...)
            //   <space or newline>
            //   public Service checkBalance
            //
            // and capturing groups to get content before annotation, the annotation
            // params, and after annotation content.
            // Syntax:
            //  \s to match all whitespace characters
            //  \S to match non whitespace characters
            //  \d to match digits
            //  () capturing group
            //  (?:) noncapturing group
            var annotationToMatch = "([\\s\\S]*public class BankService {\\s*)(@CircuitBreaker" + "\\s*" + "\\(" + "\\s*" +
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

            } else {
                params = [];
            }
            editorContents.annotationParams = params;
            editorContents.afterAnnotationContent = groups[4];
          }
          catch(e){

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
            //var isParamInAnnotation = __isParamInAnnotation(editorContentBreakdown.annotationParams, paramsToCheck);
            //if (isParamInAnnotation !== 1) { // attempt to fix it if there is no match or extra param in it
                var newContent = editorContentBreakdown.beforeAnnotationContent + circuitBreakerAnnotation + editorContentBreakdown.afterAnnotationContent;
                contentManager.setEditorContents(stepName, newContent);
            //}
        }
    };

    var __checkCircuitBreakerAnnotationInContent = function(content, paramsToCheck, stepName) {
        var annotationIsThere = true;
        var editorContentBreakdown = __getCircuitBreakerAnnotationContent(content);
        if (editorContentBreakdown.hasOwnProperty("annotationParams")) {
            var isParamInAnnotation = __isParamInAnnotation(editorContentBreakdown.annotationParams, paramsToCheck);
            if (isParamInAnnotation !== 1) {
                annotationIsThere = false;
            }
        } else {
            annotationIsThere = false;
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
            // public class BankService {
            //   @Fallback(fallbackMethod="fallbackService")
            //   <space or newline here>
            //   @CircuitBreaker
            var annotationToMatch = "([\\s\\S]*public class BankService {\\s*)" +
                "(@Fallback" + "\\s*" + "\\(" + "\\s*" + "fallbackMethod\\s*=\\s*" +
                "\"\\s*fallbackService\\s*\"\\s*\\))" +
                "(\\s*@CircuitBreaker)";
            var regExpToMatch = new RegExp(annotationToMatch, "g");
            //content.match(/@Fallback(.|\n)*?\((.|\n)*?fallbackMethod(.|\n)*=(.|\n)*"(.|\n)*fallbackService(.|\n)*"\)/g)[0];
            content.match(regExpToMatch)[0];
            match = true;
        }
        catch (e) {

        }
        return match;
    };

    var __checkFallbackMethodContent = function(content) {
        var match = false;
        try {
            // match
            //     return checkBalanceService();
            //   }
            //   <space or newline here>
            //   private Service fallbackService () {
            //     return balanceSnapshotService;
            //   }
            //   <space or newline here>
            // }
            var contentToMatch = "([\\s\\S]*)" + "(return\\s*checkBalanceService\\s*\\(\\s*\\)\\s*;\\s*})" +
            "(\\s*private\\s*Service\\s*fallbackService\\s*\\(\\s*\\)\\s*{\\s*return\\s*balanceSnapshotService\\s*\\(\\s*\\)\\s*;\\s*}\\s*})";
            var regExpToMatch = new RegExp(contentToMatch, "g");
            content.match(regExpToMatch)[0];
            match = true;
        } catch (e) {

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
            editorContents.afterFeature = groups[3];
        }
        catch (e) {

        }
        return editorContents;
    };

     var __isFaultToleranceInFeatures = function(features) {
        var match = false;
        features = features.replace('\n', '');
        features = features.replace(/\s/g, ''); // Remove whitespace
        try {
            var featureMatches = features.match(/<feature>[\s\S]*?<\/feature>/g);
            $(featureMatches).each(function (index, feature) {
                if (feature.indexOf("<feature>mpFaultTolerance-1.0</feature>") !== -1) {
                    match = true;
                    return false; // break out of each loop
                }

            });
        }
        catch (e) {

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

            });
        }
        catch (e) {

        }
        return match;
    };

    var __checkMicroProfileFaultToleranceFeatureContent = function(content) {
        var isFTFeatureThere = true;
        var editorContentBreakdown = __getMicroProfileFaultToleranceFeatureContent(content);
        if (editorContentBreakdown.hasOwnProperty("features")) {
            isFTFeatureThere =  __isFaultToleranceInFeatures(editorContentBreakdown.features) &&
                                __isCDIInFeatures(editorContentBreakdown.features);
            if (isFTFeatureThere) {
                // check for whether other stuffs are there
                var features = editorContentBreakdown.features;
                features = features.replace('\n', '');
                features = features.replace(/\s/g, '');
                if (features.length !== "<feature>mpFaultTolerance-1.0</feature><feature>cdi-1.2</feature>".length) {
                    isFTFeatureThere = false; // contains extra text
                }
            }
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

                __createErrorLinkForCallBack(stepName);
            }
        }
    };

    var __addMicroProfileFaultToleranceFeatureButton = function(event) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addMicroProfileFaultToleranceFeature();
        }
    };

    var __addMicroProfileFaultToleranceFeature = function() {

        var FTFeature = "      <feature>mpFaultTolerance-1.0</feature>";
        var stepName = stepContent.getCurrentStepName();
        // reset content every time annotation is added through the button so as to clear out any
        // manual editing
        contentManager.resetEditorContents(stepName);
        var content = contentManager.getEditorContents(stepName);

        contentManager.insertEditorContents(stepName, 5, FTFeature);
        var readOnlyLines = [];
        // mark cdi feature line readonly
        readOnlyLines.push({
            from: 4,
            to: 4
        });
        contentManager.markEditorReadOnlyLines(stepName, readOnlyLines);
    };

    var __addCircuitBreakerAnnotation = function(stepName) {

        // reset content every time annotation is added through the button so as to clear out any
        // manual editing
        contentManager.resetEditorContents(stepName);
        var content = contentManager.getEditorContents(stepName);
        var params = [];

        var constructAnnotation = function(params) {
            var circuitBreakerAnnotation = "    @CircuitBreaker(";
            if ($.isArray(params) && params.length > 0) {
                circuitBreakerAnnotation += params.join(",\n                    ");
            }
            circuitBreakerAnnotation += ")";
            return circuitBreakerAnnotation;
        };

        if (stepName === "AfterAddCircuitBreakerAnnotation") {
            contentManager.insertEditorContents(stepName, 7, "    @CircuitBreaker()");
        } else if (stepName === "ConfigureFailureThresholdParams") {
            params[0] = "requestVolumeThreshold=2";
            params[1] = "failureRatio=0.5";
            contentManager.replaceEditorContents(stepName, 7, 7, constructAnnotation(params), 2);
        } else if (stepName === "ConfigureDelayParams") {
            params[0] = "requestVolumeThreshold=2";
            params[1] = "failureRatio=0.5";
            params[2] = "delay=5000";
            contentManager.replaceEditorContents(stepName, 7, 8, constructAnnotation(params), 3);
        } else if (stepName === "ConfigureSuccessThresholdParams") {
            params[0] = "requestVolumeThreshold=2";
            params[1] = "failureRatio=0.5";
            params[2] = "delay=5000";
            params[3] = "successThreshold=2";
            contentManager.replaceEditorContents(stepName, 7, 9, constructAnnotation(params), 4);
        }
    };

    var __addCircuitBreakerAnnotationButton = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addCircuitBreakerAnnotation(stepName);
        }
    };

    var __addFallBackAnnotation = function(stepName, performReset) {
        var hasFBMethod;
        if (performReset === undefined || performReset) {
            var content = contentManager.getEditorContents(stepName);
            hasFBMethod = __checkFallbackMethodContent(content);
            // reset content every time annotation is added through the button so as to clear out any
            // manual editing
            contentManager.resetEditorContents(stepName);
        }

        var fallbackAnnotation = "    @Fallback (fallbackMethod = \"fallbackService\")";
        contentManager.replaceEditorContents(stepName, 6, 6, fallbackAnnotation);

        if (hasFBMethod === true) {
            __addFallBackMethod(stepName, false);
        }
    };

    var __addFallBackAnnotationButton = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addFallBackAnnotation(stepName);
        }
    };

    var __addFallBackMethod = function(stepName, performReset) {
        var hasFBAnnotation;
        if (performReset === undefined || performReset) {
            var content = contentManager.getEditorContents(stepName);
            hasFBAnnotation = __checkFallbackAnnotationContent(content);
            // reset content every time annotation is added through the button so as to clear out any
            // manual editing
            contentManager.resetEditorContents(stepName);
        }
        var fallbackMethod = "    private Service fallbackService() {\n" +
                             "        return balanceSnapshotService();\n" +
                             "    }\n";
        contentManager.insertEditorContents(stepName, 15, fallbackMethod, 3);

        if (hasFBAnnotation === true) {
            __addFallBackAnnotation(stepName, false);
        }
    };

    var __addFallBackMethodButton = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __addFallBackMethod(stepName);
        }
    };

    var __enterButtonURLCheckBalance = function(event, stepName) {
        if (event.type === "click" ||
        (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            contentManager.refreshBrowser(stepName);
        }
    };

    var __saveButtonEditor = function(stepName) {
        contentManager.saveEditor(stepName);
    };

    var __saveButtonEditorButton = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __saveButtonEditor(stepName);
        }
    };

    var __refreshButtonBrowser = function(event, stepName) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            contentManager.refreshBrowser(stepName);
        }
    };

    var __createCircuitBreaker = function(root, stepName, requestVolumeThreshold, failureRatio, delay, successThreshold, visibleCounters) {
        // If root is not a jQuery element, get the jQuery element from the root object passed in
        if(!root.selector){
            root = root.contentRootElement;
        }

        var cb = circuitBreaker.create(root, stepName, requestVolumeThreshold, failureRatio, delay, successThreshold, visibleCounters); // Default values
        root.circuitBreaker = cb;

        root.find(".circuitBreakerSuccessRequest").on("click", function(){
            cb.sendSuccessfulRequest();
        });
        root.find(".circuitBreakerFailureRequest").on("click", function(){
            cb.sendFailureRequest();
        });
        root.find(".circuitBreakerReset").on("click", function(){
            cb.closeCircuit();
        });
        contentManager.setCircuitBreaker(stepName, cb, 0);
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
    };

    var __listenToEditorForFeatureInServerXML = function(editor) {
        var saveServerXML = function() {
            __saveServerXML();
        };
        editor.addSaveListener(saveServerXML);
    };

    var __saveServerXMLButton = function(event) {
        if (event.type === "click" ||
           (event.type === "keypress" && (event.which === 13 || event.which === 32))) {
            // Click or 'Enter' or 'Space' key event...
            __saveServerXML();
        }
    };

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
        addMicroProfileFaultToleranceFeatureButton: __addMicroProfileFaultToleranceFeatureButton,
        addCircuitBreakerAnnotationButton: __addCircuitBreakerAnnotationButton,
        addFallbackAnnotationButton: __addFallBackAnnotationButton,
        addFallbackMethodButton: __addFallBackMethodButton,
        enterButtonURLCheckBalance: __enterButtonURLCheckBalance,
        saveButtonEditorButton: __saveButtonEditorButton,
        refreshButtonBrowser: __refreshButtonBrowser,
        correctEditorError: __correctEditorError,
        closeErrorBoxEditor: __closeErrorBoxEditor,
        saveServerXMLButton: __saveServerXMLButton,
        listenToEditorForFeatureInServerXML: __listenToEditorForFeatureInServerXML
    };
})();
