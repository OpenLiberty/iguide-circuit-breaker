var circuitBreakerCallBack = (function() {
    var checkBalanceURL = "http://localhost:9080/RestServicesSamples/banking/checkBalance";

    var __showPodWithCircuitBreaker = function(editor, htmlToLoad) {
        /* has to wait until Denise finishes her pod implementation 
        var pod = contentManager.getPods(editor.getStepName());
        pod.setContent(htmlToLoad);
        pod.slide();
        */
    };

    var __refreshWebBrowserContent = function(webBrowser, htmlToLoad) {
        webBrowser.setBrowserContent(htmlToLoad);
    };

    var __listenToBrowserForFailBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (currentURL === checkBalanceURL) {
                __refreshWebBrowserContent(webBrowser, "../circuitBreaker/html/CheckBalanceFail.html");
            } else {
                __refreshWebBrowserContent(webBrowser, "../circuitBreaker/html/PageNotFound.html");
            }
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToBrowserForSuccessBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (currentURL === checkBalanceURL) {
                __refreshWebBrowserContent(webBrowser, "../circuitBreaker/html/CheckBalanceSuccess.html");
            } else {
                __refreshWebBrowserContent(webBrowser, "../circuitBreaker/html/PageNotFound.html");
            }
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToBrowserForFallbackSuccessBalance = function(webBrowser) {
        var setBrowserContent = function(currentURL) {
            if (currentURL === checkBalanceURL) {
                __refreshWebBrowserContent(webBrowser, "../circuitBreaker/html/CheckBalanceFallbackSuccess.html");
            } else {
                __refreshWebBrowserContent(webBrowser, "../circuitBreaker/html/PageNotFound.html");
            }
        };
        webBrowser.addUpdatedURLListener(setBrowserContent);
    };

    var __listenToEditorForCircuitBreakerAnnotation = function(editor) {
        editor.addSaveListener(__showPodWithCircuitBreaker);    
    };

    return {
        listenToBrowserForFailBalance: __listenToBrowserForFailBalance,
        listenToBrowserForSuccessBalance: __listenToBrowserForSuccessBalance,
        listenToBrowserForFallbackSuccessBalance: __listenToBrowserForFallbacklSuccessBalance,
        listenToEditorForCircuitBreakerAnnotation: __listenToEditorForCircuitBreakerAnnotation
    }
})();
