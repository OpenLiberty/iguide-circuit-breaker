var jsonGuide = (function () {
    "use strict";

    /*
    var _guide = [
        {
            name: 'LibertySetupGuide',
            title: 'Liberty Setup Guide',
            description: 'You can use this guide to perform ...',
            duration: '5 minutes',
            audience: 'develper',
            steps: [
                {
                    name: 'Intro',
                    title: 'Introduction',
                    description: 'It is quick and easy to set up Liberty. This guide will walk you through the experience in a matter of minutes.',
                    displayType: 'none'
                },
                {
                    name: 'GetLiberty',
                    title: 'Get Liberty',
                    description: 'This step will guide you to download and setup Liberty',
                    steps: [
                        {
                            name: 'DownloadLiberty',
                            title: 'Download Liberty',
                            description: 'Download the latest Liberty from ...'
                        },
                        {
                            name: 'SetupLiberty',
                            title: 'Setup Liberty',
                            description: 'Follow the steps to set up Liberty ...',
                            steps: [
                                {
                                    name: 'CreateServer',
                                    title: 'Create a server ',
                                    description: 'Create a server via command prompt ...',
                                    content: {
                                        displayType: 'commandPrompt',
                                        preload: 'Type \'help\' to get started.\n' +
                                                 '$>',
                                        callback: "none"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'WhatNext',
                    title: "What's Next",
                    description: 'Congratulations, you have setup Liberty'
                }
            ]
        },
        {
            name: 'BuildRestfulService',
            title: 'Building a Restful Service Guide',
            description: 'Enable other services to interact with your service',
            duration: '5 minutes',
            audience: 'develper',
            steps: [
                {
                    name: 'Intro',
                    title: 'Introduction',
                    description: 'Why should you build a restful service? So other applications can interact with your service.',
                    displayType: 'none'
                },
                {
                    name: 'ModifyCode',
                    title: 'Modify Java code',
                    description: 'Modify RestfulService.java',
                    steps: [
                        {
                            name: 'ModifyParams',
                            title: 'Modify parameters',
                            description: 'Change the highlighted parameters in the getMyName handler in RestfulService.java',
                            content: {
                                displayType: 'fileEditor',
                                preload: '@GET\n' + '@Path("/getMyName")\n' +
                                '@Produces("application/json")\n' +
                                'public String getMyName() {\n' +
                                '   return first + last\n' +
                                '}',
                                callback: "none"
                            }

                        },
                        {
                            name: 'ViewChanges',
                            title: 'View Changes in the browser',
                            description: 'View your changes in the browser window.',
                            content: {
                                displayType: 'webBrowser',
                                url: 'http://loalhost:9443/getMyName',
//                                browserContent: 'http://espn.com',
                                 browserFileContent: "Example1.html",
                                 browserContent: 
                                    '<!DOCTYPE html>' +
                                    '<html> ' + 
                                    '<head><style>' + 
                                    ' p { color: darkgray; }' +
                                    ' .nameit { color: blue; }' +
                                    '</style></head>' +
                                    '<body>' +
                                    '<p>Click the button to show your name.</p>' +
                                    'Name: <input type="text" id="myname"><br><br>' +
                                    '<button onclick="myNameFunction()">Try it</button><br><br>' +
                                    '<p id="mynameoutput"></p>' +
                                    '<script>' +
                                    'function myNameFunction() { ' +
                                    '   console.log("hi");' +
                                    '   var mnamefld = document.getElementById("myname");' +
                                    '   console.log(mnamefld);' +
                                    '   var mnameval = mnamefld.value;' +
                                    '   console.log(mnameval);' +
                                    '   if (mnameval) { ' +
                                    '     $("#mynameoutput").html("Your Name Is:&nbsp; <span class=nameit>" + mnameval + "</span>");' +
                                    '   } else {' +
                                    '     document.getElementById("mynameoutput").innerHTML="Please enter your name"; ' +
                                    '   } }' +
                                    '</script>' +
                                    '</body> </html>'
                             }
                        }
                    ]
                },
                {
                    name: 'WhatNext',
                    title: "What's Next",
                    description: 'Download the source code to build your own Restful Service locally: www.xxx.com'
                }
            ]
        },
    ];
    */

    var __guides = [];
    var __noGuideExist = "NO$$GUIDE$$EXIST";

    var __getJson = function (fileName) {
        var deferred = new $.Deferred();
        var ajaxPromise = $.ajax({
            url: "../jsonGuides/" + fileName,
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
        __getJson('allGuides.toc').done(function(guidesToReadInString) {
            if (guidesToReadInString === __noGuideExist) {
                console.log("Not table to read allGuides.toc");
            } else {
                var guidesToRead = JSON.parse(guidesToReadInString);
                //var guidesToRead = ["buildRestfulServiceGuide.json", "custom.json", "libertySetupGuide.json"];
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
                    });;
                }

                $.when.apply($, promises).done(function () {
                    console.log("------- all done");
                    deferred.resolve();
                })
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
    }

})();
