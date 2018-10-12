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
    var bankServiceFileName = "BankService.java";
    var checkBalanceURL = "https://global-ebank.openliberty.io/checkBalance";
    var isRefreshing = false;
    var cbmessages = circuitBreakerMessages.returnMessages();
   
    var __refreshWebBrowserContent = function(webBrowser, htmlToLoad) {
        webBrowser.setBrowserContent(htmlToLoad);
    };

    var __listenToBrowserForFailBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            // Check if the browser is currently handling a keypress for the browser URL by waiting on a timeout.
            if (isRefreshing){
                return;
            }
            if (currentURL.trim() === checkBalanceURL) {

                var stepName = this.getStepName();
                switch (stepName) {
                    case 'BankScenario':
                        __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-fail.html");
                        contentManager.markCurrentInstructionComplete(stepName);
                        isRefreshing = true;
                        setTimeout(function () {
                            var stepWidgets = stepContent.getStepWidgets(stepName);
                            stepContent.resizeStepWidgets(stepWidgets, "pod", true);
                            contentManager.setPodContentWithSlideDown(stepName,
                                "<div class='flexWithPic'>" +
                                "<p>" + cbmessages.OH_NO + 
                                "</p>" + 
                                "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/no-circuit-breaker-service-fail.svg' alt=" + cbmessages.MICROSERVICE_DOWN + " class='picInPod'>" +
                                "</div>",
                                0
                                );
                            isRefreshing = false;
                        }, 5000);

                        break;
                    case 'ConfigureDelayParams':
                            // Put the browser into focus.
                            webBrowser.contentRootElement.trigger("click");

                            clearInterval(delayCountdownInterval);
                             __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-fail-with-open-circuit.html");
                            contentManager.setPodContentWithRightSlide(stepName,
                                "<div class='flexWithPic'>" +
                                "<div class='leftDelayPodText'><p>" + cbmessages.ASSUMING_CIRCUIT  + "</p>" +
                                "<p style='padding-top: 0;'> " + cbmessages.CIRCUIT_REMAINS +  "</p>" +
                                "<div class='delayCountdownText'><b>" + cbmessages.DELAY + "&nbsp;&nbsp;</b><span class='delayCountdown'>5000 ms</span></div>" +
                                "<div class='delayStateChangeText'><b>" + cbmessages.CIRCUIT_STATE + "&nbsp;&nbsp;</b><span class='delayState'>" + cbmessages.OPEN + "</span></div>" +
                                "</div>" +
                                "<div class='delayCountdownImgDiv'><div class='pod-animation-slide-from-right'><img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/open.svg' alt=" + cbmessages.CHECK_BALANCE_OPEN + " class='picInPod playgroundImg'></div></div>" +
                                "</div>",
                                0
                            );
                            var secondsLeft = 9000;
                            var $delayCountdown = $('.delayCountdown');
                            isRefreshing = true;
                            var delayCountdownInterval = setInterval(function () {
                                secondsLeft -= 100;
                                if (secondsLeft <= 5000) {
                                    $delayCountdown.text(secondsLeft + " ms");
                                }
                                if (secondsLeft <= 0) {
                                    $('.delayState').text(cbmessages.HALF_OPEN);

                                    clearInterval(delayCountdownInterval);   // Stop interval
                                    // Slide in new pic
                                    var newPic = "<div class='pod-animation-slide-from-right'><img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/halfopen.svg' alt=" + cbmessages.CHECK_BALANCE_HALF_OPEN + " class='picInPod playgroundImg'></div>";
                                    $('.delayCountdownImgDiv').html(newPic);
                                    isRefreshing = false;
                                    contentManager.markCurrentInstructionComplete(stepName);                                }
                            }, 100);
                        break;
                    case 'ConfigureFailureThresholdParams':
                        // Put the browser into focus.
                        webBrowser.contentRootElement.trigger("click");

                        var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                        if (currentStepIndex === 1) {
                           __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-fail.html");
                           webBrowser.enableRefreshButton(false);
                           isRefreshing = true;
                           setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                                    "<div class='flexWithPic'>" +
                                    "<p>" + cbmessages.THRESHOLD_1 + "</p>" +
                                    "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/closed-fail.svg' alt=" + cbmessages.CHECK_BALANCE_RESULT_OPEN + " class='picInPod'>" +
                                    "</div>",
                                    0
                                );
                                webBrowser.enableRefreshButton(true);
                                isRefreshing = false;
                                contentManager.markCurrentInstructionComplete(stepName);
                            }, 5000);
                        } if (currentStepIndex >= 2 || currentStepIndex === -1) {
                            contentManager.setPodContentWithRightSlide(webBrowser.getStepName(), "", 0);
                            __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-fail.html");
                            isRefreshing = true;
                            setTimeout(function () {
                                contentManager.setPodContentWithRightSlide(stepName,
                                    "<div class='flexWithPic'>" +
                                    "<p>" + cbmessages.THRESHOLD_2 + "</p>" +
                                    "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/open.svg' alt=" + cbmessages.CHECK_BALANCE_RESULT_OPEN  + " class='picInPod'>" +
                                    "</div>",
                                    0
                                );
                                isRefreshing = false;
                                contentManager.markCurrentInstructionComplete(stepName);
                            }, 5000);
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
            // Put the browser into focus.
            webBrowser.contentRootElement.trigger("click");

            if (currentURL.trim() === checkBalanceURL) {

                var stepName = this.getStepName();
                var currentStepIndex = contentManager.getCurrentInstructionIndex(stepName);
                if (currentStepIndex === 1) {
                    __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-success.html");
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<div class='flexWithPic'>" +
                        "<p>" + cbmessages.SUCCESSFUL_CALL1 + "</p> " +
                        "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/halfopen.svg' alt='" + cbmessages.CHECK_BALANCE_RESULT_HALF_OPEN + "' class='picInPod'>" +
                        "</div>",
                        0
                    );
                }  else if (currentStepIndex >= 2 || currentStepIndex === -1) {
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(), "", 1);
                    __refreshWebBrowserContent(webBrowser, "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/check-balance-success.html");
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<div class='flexWithPic'>" +
                        "<p>" + cbmessages.SUCCESSFUL_CALL2 + "</p> " +
                        "<img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/closed.svg' alt=" +  cbmessages.CHECK_BALANCE_CLOSED + " class='picInPod'>" +
                        "</div>",
                        0
                    );
                }

                contentManager.markCurrentInstructionComplete(stepName);
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
                isRefreshing = true;
                setTimeout(function () {
                    contentManager.setPodContentWithRightSlide(webBrowser.getStepName(),
                        "<div class='centerPicInPod'><img src='/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/images/open-fallback.svg' alt=" + cbmessages.CHECK_BALANCE_HALF_OPEN + " class='picInPod'></div>"
                    );
                    isRefreshing = false;
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
            var content = contentManager.getTabbedEditorContents(stepName, bankServiceFileName);
            var paramsToCheck = [];
            if (__checkCircuitBreakerAnnotationInContent(content, paramsToCheck, stepName) === true) {
                contentManager.markCurrentInstructionComplete(stepName);
                // Find images to transition from circuit to circuit with Circuit Breaker.   
                _transitionToNextImage(stepName);
            } else {
                // display error
                editor.createErrorLinkForCallBack(true, __correctEditorError);
            }
        };
        editor.addSaveListener(__showPodWithCircuitBreaker);
    };

    var __listenToEditorForAnnotationParamChange = function(editor) {
        var __validateConfigureParamsInEditor = function() {
            var updateSuccess = false;
            var stepName = editor.getStepName();
            var content = contentManager.getTabbedEditorContents(stepName, bankServiceFileName);
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
                // Mark this editor as Read Only until the playground appears.
//                contentManager.markTabbedEditorReadOnly(stepName, "BankService.java");
                // Put the browser into focus.
                var stepBrowser = contentManager.getBrowser(stepName);
                stepBrowser.contentRootElement.trigger("click");
                
                contentManager.markCurrentInstructionComplete(stepName);
            } else {
                // display error
                editor.createErrorLinkForCallBack(true, __correctEditorError);
            }
        };
        editor.addSaveListener(__validateConfigureParamsInEditor);
    };

    var __listenToEditorForFallbackAnnotation = function(editor) {
        var __showPodWithCircuitBreakerAndFallback = function() {
            var stepName = this.getStepName();
            var content = contentManager.getTabbedEditorContents(stepName, bankServiceFileName);
            var fallbackAnnotation = "@Fallback (fallbackMethod = \"fallbackService\")";
            var fallbackMethod = "private Service fallbackService()";
            if (__checkFallbackAnnotationContent(content) === true &&
                __checkFallbackMethodContent(content) === true) {
                contentManager.markCurrentInstructionComplete(stepName);
                // Find images to transition from circuit breaker to circuit breaker with fallback.
                _transitionToNextImage(stepName);
            } else {
                // display error and provide link to fix it
                editor.createErrorLinkForCallBack(true, __correctEditorError);
            }
        };
        editor.addSaveListener(__showPodWithCircuitBreakerAndFallback);
    };

    var __listenToEditorForCircuitBreakerAnnotationChanges = function(editor){
        var __listenToContentChanges = function(editorInstance, changes) {
            var stepName = editor.getStepName();
            // Get pod from contentManager
            var cb = contentManager.getPlayground(stepName);
            // Get the parameters from the editor and send to the circuitBreaker
            var content = contentManager.getTabbedEditorContents(stepName, bankServiceFileName, 0);

            try{
                var matchPattern = "public class BankService\\s*{\\s*@CircuitBreaker\\s*\\((([^\\(\\)])*?)\\)\\s*public Service checkBalance";
                var regexToMatch = new RegExp(matchPattern, "g");
                var groups = regexToMatch.exec(content);
                var annotation = groups[1];

                var params = annotation.replace(/[{\s()}]/g, ''); // Remove whitespace and parenthesis
                params = params.split(',');

                var requestVolumeThreshold;
                var failureThreshold;
                var delay;
                var successThreshold;

                // Parse their annotation for values
                params.forEach(function(param, index){
                if (param.indexOf('requestVolumeThreshold=') > -1){
                    requestVolumeThreshold = param.substring(param.indexOf('requestVolumeThreshold=') + 23);
                }
                if (param.indexOf('failureRatio=') > -1){
                    failureThreshold = param.substring(param.indexOf('failureRatio=') + 13);
                }
                if (param.indexOf('delay=') > -1){
                    delay = param.substring(param.indexOf('delay=') + 6);
                }
                if (param.indexOf('successThreshold=') > -1){
                    successThreshold = param.substring(param.indexOf('successThreshold=') + 17);
                }
                });
                // Prevent the user from setting the delay and success threshold in the failure step, since they are not introduced yet.
                if('ConfigureFailureThresholdParams' === editor.stepName){
                    delay = 5000;
                    successThreshold = -1;
                }
                // Prevent the user from setting the success threshold in the failure step, since it is not introduced yet.
                else if('ConfigureDelayParams' === editor.stepName){
                    successThreshold = -1;
                }
                // Apply the annotation values to the circuit breaker. If one is not specified, the value will be undefined and circuit breaker will use its default value
                cb.updateParameters.apply(cb, [requestVolumeThreshold, failureThreshold, delay, successThreshold]);
            }
            catch(e){

            }
        }
        var stepName = editor.getStepName();
        editor.contentValue = contentManager.getTabbedEditorContents(stepName, "BankService.java"); // Reset the contentValue for undo and reset to work.
        editor.addSaveListener(__listenToContentChanges);
        editor.addContentChangeListener(__listenToContentChanges);
    };

    var _transitionToNextImage = function(stepName, imageNum) {
        // Find images to transition
        var stepPod = contentManager.getPod(stepName);
        var stepImages = stepPod.contentRootElement.find('img');
        // Fade out the top image to reveal the new changed state image
        if (imageNum === undefined) {
            imageNum = 1;
        }
        $(stepImages[imageNum]).css("opacity", 0);
    }

    var __populateURLForBalance = function(event, stepName) {
        if (utils.isElementActivated(event)) {
               // Click or 'Enter' or 'Space' key event...

               contentManager.setBrowserURL(stepName, checkBalanceURL);
        }
    };

    var __correctEditorError = function(stepName) {
        // correct annotation/method
        if (stepName === "AddFallBack") {
            var content = contentManager.getTabbedEditorContents(stepName, bankServiceFileName);
            var hasFBMethod = __checkFallbackMethodContent(content);
            __addFallBackAnnotation(stepName);
            if (hasFBMethod === false) {
                __addFallBackMethod(stepName, false);
            }
        } else if (stepName === "AddLibertyMPFaultTolerance") {
            __addMicroProfileFaultToleranceFeature();
        } else {
            __addCircuitBreakerAnnotation(stepName);
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
                contentManager.setTabbedEditorContents(stepName, bankServiceFileName, newContent);
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

    var __addMicroProfileFaultToleranceFeatureButton = function(event, stepName) {
        if (utils.isElementActivated(event)) {
            // Click or 'Enter' or 'Space' key event...
            __addMicroProfileFaultToleranceFeature(stepName);
        }
    };

    var __addMicroProfileFaultToleranceFeature = function(stepName) {
        var FTFeature = "      <feature>mpFaultTolerance-1.0</feature>";
        var serverFileName = "server.xml";
        // reset content every time annotation is added through the button so as to clear out any
        // manual editing
        contentManager.resetTabbedEditorContents(stepName, serverFileName);
        var content = contentManager.getTabbedEditorContents(stepName, serverFileName);

        contentManager.insertTabbedEditorContents(stepName, serverFileName, 5, FTFeature);
        var readOnlyLines = [];
        // mark cdi feature line readonly
        readOnlyLines.push({
            from: 4,
            to: 4
        });
        contentManager.markTabbedEditorReadOnlyLines(stepName, serverFileName, readOnlyLines);
    };

    var __addCircuitBreakerAnnotation = function(stepName) {
        // reset content every time annotation is added through the button so as to clear out any
        // manual editing
        contentManager.resetTabbedEditorContents(stepName, bankServiceFileName);
        var content = contentManager.getTabbedEditorContents(stepName, bankServiceFileName);
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
            contentManager.insertTabbedEditorContents(stepName, bankServiceFileName, 13, "    @CircuitBreaker()");
        } else if (stepName === "ConfigureFailureThresholdParams") {
            params[0] = "requestVolumeThreshold=2";
            params[1] = "failureRatio=0.5";
            contentManager.replaceTabbedEditorContents(stepName, bankServiceFileName, 13, 13, constructAnnotation(params), 2);
        } else if (stepName === "ConfigureDelayParams") {
            params[0] = "requestVolumeThreshold=2";
            params[1] = "failureRatio=0.5";
            params[2] = "delay=5000";
            contentManager.replaceTabbedEditorContents(stepName, bankServiceFileName, 13, 14, constructAnnotation(params), 3);
        } else if (stepName === "ConfigureSuccessThresholdParams") {
            params[0] = "requestVolumeThreshold=2";
            params[1] = "failureRatio=0.5";
            params[2] = "delay=5000";
            params[3] = "successThreshold=2";
            contentManager.replaceTabbedEditorContents(stepName, bankServiceFileName, 13, 15, constructAnnotation(params), 4);
        }
    };

    var __addCircuitBreakerAnnotationButton = function(event, stepName) {
        if (utils.isElementActivated(event)) {
            // Click or 'Enter' or 'Space' key event...
            __addCircuitBreakerAnnotation(stepName);
        }
    };

    // This is called when the 'Configure it' button is clicked in an instruction.
    // The playgroud for the corresponding configure step appears in the result 
    // pod for the current step.
    var __configureIt = function(stepName) {
      var stepPod = contentManager.getPod(stepName, 0);
      var breadcrumbElement;
      var activeStep;

      // Create the Circuit Breaker playground for the step.
      if (stepName === "ConfigureFailureThresholdParams") {
        contentManager.setPodContent(stepName,
            "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/circuit-breaker-configure-failure-threshold.html",
            0, __createCircuitBreaker);
      } else if (stepName === "ConfigureDelayParams") {
        contentManager.setPodContent(stepName,
            "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/circuit-breaker-configure-delay.html",
            0, __createCircuitBreaker);
      } else if (stepName === "ConfigureSuccessThresholdParams") {
        contentManager.setPodContent(stepName,
            "/guides/iguide-circuit-breaker/html/interactive-guides/circuit-breaker/circuit-breaker-configure-success-threshold.html",
            0, __createCircuitBreaker);
      }
      
      // Convert the step's editor to now update the playground created when changed.
      var editor = contentManager.getEditorInstanceFromTabbedEditor(stepName, "BankService.java");
      if (editor) {
          // Enable the editor again for updates to be used in the playground.
//          editor.markEditorEditEnabled();
          __listenToEditorForCircuitBreakerAnnotationChanges(editor);
      }

      // Put the tabbedEditor into focus with  "BankService.java" file selected.
      contentManager.focusTabbedEditorByName(stepName, "BankService.java");
    };

    //The 'Configure it' button to bring up a playground for each configure step.
    var __configureItButton = function(event, stepName){
      event.preventDefault();
      event.stopPropagation();
      if (utils.isElementActivated(event)) {
          // Click or 'Enter' or 'Space' key event...
          __configureIt(stepName);
      }
    };

    var __addFallBackAnnotation = function(stepName, performReset) {
        var hasFBMethod;
        if (performReset === undefined || performReset) {
            var content = contentManager.getTabbedEditorContents(stepName, bankServiceFileName);
            hasFBMethod = __checkFallbackMethodContent(content);
            // reset content every time annotation is added through the button so as to clear out any
            // manual editing
            contentManager.resetTabbedEditorContents(stepName, bankServiceFileName);
        }

        var fallbackAnnotation = "    @Fallback (fallbackMethod = \"fallbackService\")";
        contentManager.replaceTabbedEditorContents(stepName, bankServiceFileName, 12, 12, fallbackAnnotation);
        if (hasFBMethod === true) {
            __addFallBackMethod(stepName, false);
        }
    };

    var __addFallBackAnnotationButton = function(event, stepName) {
        if (utils.isElementActivated(event)) {
            // Click or 'Enter' or 'Space' key event...
            __addFallBackAnnotation(stepName);
        }
    };

    var __addFallBackMethod = function(stepName, performReset) {
        var hasFBAnnotation;
        if (performReset === undefined || performReset) {
            var content = contentManager.getTabbedEditorContents(stepName, bankServiceFileName);
            hasFBAnnotation = __checkFallbackAnnotationContent(content);
            // reset content every time annotation is added through the button so as to clear out any
            // manual editing
            contentManager.resetTabbedEditorContents(stepName, bankServiceFileName);
        }
        var fallbackMethod = "    private Service fallbackService() {\n" +
                             "        return balanceSnapshotService();\n" +
                             "    }\n";
        contentManager.insertTabbedEditorContents(stepName, bankServiceFileName, 21, fallbackMethod, 3);

        if (hasFBAnnotation === true) {
            __addFallBackAnnotation(stepName, false);
        }
    };

    var __addFallBackMethodButton = function(event, stepName) {
        if (utils.isElementActivated(event)) {
            // Click or 'Enter' or 'Space' key event...
            __addFallBackMethod(stepName);
        }
    };

    var __enterButtonURLCheckBalance = function(event, stepName) {
        if (utils.isElementActivated(event)) {
            // Click or 'Enter' or 'Space' key event...
            contentManager.refreshBrowser(stepName);
        }
    };

    var __saveButtonEditor = function(stepName) {
        contentManager.saveTabbedEditor(stepName, bankServiceFileName);
    };

    var __saveButtonEditorButton = function(event, stepName) {
        if (utils.isElementActivated(event)) {
            // Click or 'Enter' or 'Space' key event...
            __saveButtonEditor(stepName);
        }
    };

    var __refreshButtonBrowser = function(event, stepName) {
        if (utils.isElementActivated(event)) {
            // Click or 'Enter' or 'Space' key event...
            contentManager.refreshBrowser(stepName);
        }
    };

    var __createCircuitBreaker = function(circuitBreakerPod, stepName, requestVolumeThreshold, failureRatio, delay, successThreshold, visibleCounters) {
        var root = circuitBreakerPod.contentRootElement;
        var stepName = circuitBreakerPod.stepName;
        var requestVolumeThreshold = 2, 
            failureRatio = 0.5, 
            delay = 5000, 
            successThreshold = -1, 
            visibleCounters;

        if (stepName === "ConfigureSuccessThresholdParams") {
            successThreshold = 2;
        }

        var cb = circuitBreaker.create(root, stepName, requestVolumeThreshold, failureRatio, delay, successThreshold, visibleCounters); // Default values
        root.circuitBreaker = cb;

        root.find(".circuitBreakerSuccessRequest").on("click", function(){
            cb.sendSuccessfulRequest();
            var stepNameHash = stepContent.getCurrentStepName();
            var stepName = stepContent.getStepNameFromHash(stepNameHash);
            contentManager.markCurrentInstructionComplete(stepName);
        });
        root.find(".circuitBreakerFailureRequest").on("click", function(){
            cb.sendFailureRequest();
            var stepNameHash = stepContent.getCurrentStepName();
            var stepName = stepContent.getStepNameFromHash(stepNameHash);
            contentManager.markCurrentInstructionComplete(stepName);
        });
        root.find(".circuitBreakerReset").on("click", function(){
            cb.closeCircuit();
        });
        contentManager.setPlayground(stepName, cb, 0);

        root.find('.circuitBreakerSuccessRequest').focus();
    };

    var __listenToEditorForFeatureInServerXML = function(editor) {
        var __saveServerXML = function() {
          // var __saveServerXML = function(editor) {
          var stepName = this.getStepName();
          var serverFileName = "server.xml";

          var content = contentManager.getTabbedEditorContents(stepName, serverFileName);
          if (__checkMicroProfileFaultToleranceFeatureContent(content)) {
              editor.closeEditorErrorBox(stepName);
              contentManager.markCurrentInstructionComplete(stepName);
          } else {
              // display error to fix it
              editor.createErrorLinkForCallBack(true, __correctEditorError);
          }
          // };
        };
        editor.addSaveListener(__saveServerXML);
    };

    var __saveServerXMLButton = function(event, stepName) {
        if (utils.isElementActivated(event)) {
            // Click or 'Enter' or 'Space' key event...
            contentManager.saveTabbedEditor(stepName, "server.xml");
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
        saveServerXMLButton: __saveServerXMLButton,
        listenToEditorForFeatureInServerXML: __listenToEditorForFeatureInServerXML,
        configureItButton: __configureItButton
    };
})();
