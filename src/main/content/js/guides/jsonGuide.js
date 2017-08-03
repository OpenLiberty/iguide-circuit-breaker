var jsonGuide = (function() {
    "use strict";

   var _guides = [
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
                            description: 'Follow the steps to set up Liberty ...'
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
                            description: 'View your changes in the brwoser window.'
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

   var _getGuides = function() {
        return _guides;
    };

   var _getSteps = function(guideName) {
        for (var i = 0; i < _guides.length; i++) {
            var guide = _guides[i];
            if (guide.name === guideName) {
                return guide.steps;
            }
        }
        return [];
    };

    var _getGuideDisplayTitle = function(guideName) {
         for (var i = 0; i < _guides.length; i++) {
             var guide = _guides[i];
             if (guide.name === guideName) {
                 return guide.title;
             }
         }
         return [];
     };

     var _getGuideDescription = function(guideName) {
          for (var i = 0; i < _guides.length; i++) {
              var guide = _guides[i];
              if (guide.name === guideName) {
                  return guide.description;
              }
          }
          return [];
      };

   return {
        getGuides: _getGuides,
        getSteps: _getSteps,
        getGuideDisplayTitle: _getGuideDisplayTitle,
        getGuideDescription: _getGuideDescription
    }

})();
