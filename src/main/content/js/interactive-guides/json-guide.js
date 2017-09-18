var jsonGuide = (function () {
    "use strict";

    var __guides = [];
    var __noGuideExist = "NO$$GUIDE$$EXIST";

    var __getJson = function (fileName) {
        var deferred = new $.Deferred();
        var ajaxPromise = $.ajax({
            dataType: 'json',
            url: "/guides/openliberty/src/main/content/jsonGuides/" + fileName,
            success: function(response) {
                console.log("response", response);
                deferred.resolve(response);
            },
            error: function(jqXHR, status) {
                console.log("not able to read " + fileName, status);
                deferred.resolve(__noGuideExist);
            }
        });
        return deferred;
    };

    var __getGuides = function () {
        var deferred = new $.Deferred();
        __getJson('allGuides.toc').done(function(guidesToRead) {
            if (guidesToRead === __noGuideExist) {
                console.log("Not table to read allGuides.toc");
            } else {
                console.log("guidesToRead in done", guidesToRead);
                var promises = [];
                var done = 0;
                for (var i = 0; i < guidesToRead.length; i++) {
                    promises[i] = new $.Deferred();
                    console.log("promises", promises);
                    __getJson(guidesToRead[i]).done(function (guide) {
                        if (guide !== __noGuideExist) {
                            __guides.push(guide);
                        }
                        console.log("---- guides", __guides);
                        promises[done++].resolve();
                    });
                }

                $.when.apply($, promises).done(function () {
                    console.log("------- all done");
                    deferred.resolve();
                });
            }
        });
        return deferred;
    };

    var __getSteps = function (guideName) {
        for (var i = 0; i < __guides.length; i++) {
            var guide = __guides[i];
            if (guide.name === guideName) {
                return guide.steps;
            }
        }
        return [];
    };

    var __getGuideDisplayTitle = function (guideName) {
        for (var i = 0; i < __guides.length; i++) {
            var guide = __guides[i];
            if (guide.name === guideName) {
                return guide.title;
            }
        }
        return [];
    };

    var __getGuideDescription = function (guideName) {
        for (var i = 0; i < __guides.length; i++) {
            var guide = __guides[i];
            if (guide.name === guideName) {
                return guide.description;
            }
        }
        return [];
    };

    return {
        getGuides: __getGuides,
        getSteps: __getSteps,
        getGuideDisplayTitle: __getGuideDisplayTitle,
        getGuideDescription: __getGuideDescription
    };

})();
