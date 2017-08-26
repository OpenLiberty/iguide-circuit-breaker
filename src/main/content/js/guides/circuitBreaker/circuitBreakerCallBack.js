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
                        contentManager.setPodContent(stepName, 
                            "(pod sliding in after url is entered to show the checkBalance microservice is down)");
                        break;
                    case 'OpenCircuit':
                        contentManager.setPodContent(stepName,
                            "(pod sliding in after refreshing URL to show an open circuit and system is still down.)");
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
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToEditorForCircuitBreakerAnnotation = function(editor) {
        var __showPodWithCircuitBreaker = function() {
            contentManager.setPodContent(this.getStepName(), 
                "(pod sliding in to show checkBalance microservice with circuitBreaker in it after save is clicked)");
        };
        editor.addSaveListener(__showPodWithCircuitBreaker);    
    };

    var __listenToEditorForFallbackAnnotation = function(editor) {
        var __showPodWithCircuitBreakerAndFallback = function() {
            contentManager.setPodContent(this.getStepName(), 
                "(pod sliding in to show checkBalance microservice with circuitBreaker and Fallback in it after save is clicked)");
        };
        editor.addSaveListener(__showPodWithCircuitBreakerAndFallback);    
    };


    return {
        listenToBrowserForFailBalance: __listenToBrowserForFailBalance,
        listenToBrowserForSuccessBalance: __listenToBrowserForSuccessBalance,
        listenToBrowserForFallbackSuccessBalance: __listenToBrowserForFallbackSuccessBalance,
        listenToEditorForCircuitBreakerAnnotation: __listenToEditorForCircuitBreakerAnnotation,
        listenToEditorForFallbackAnnotation: __listenToEditorForFallbackAnnotation
    }
})();
