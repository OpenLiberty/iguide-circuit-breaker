var jsonGuide = (function() {
    "use strict";

   var _guides = [{
        name: 'LibertySetupGuide',
        title: 'Setup Liberty',
        description: 'You can use this guide to perform ...',
        duration: '5 minutes',
        audience: 'develper',
        steps: [
            {
                name: 'Intro',
                title: 'Introduction',
                description: 'It is quick and easy to set up ...',
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
                title: 'What is Next',
                description: 'Congratulations, you have setup Liberty'
            }
        ]
    }];

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
