var pod = (function(){

  var podType = function(container, stepName, content) {
    this.stepName = stepName;
    this.contentRootElement = null;
    this.updateCallback = null;

    __loadAndCreate(this, container, stepName, content);
  };

  podType.prototype = {

    setContent: function(content) {
       if (!content) {
         content = "";
         this.contentRootElement.html(content);
         return;
       }
       var extension = content.substring(content.length - 4).toLowerCase();
       var file =  extension === 'html' || extension === 'htm' ? true: false;
       if (file) {
         var fileLocation = '/guides/openliberty/src/main/content/html/interactive-guides/' + content;
         $.ajax({
           context: this.contentRootElement,
           url: fileLocation,
           async: false,
           success: function(result) {
            this.html($(result));
           },
           error: function(result) {
             console.error("Could not load content for file " + file);
             this.html("");
           }
         });
       } else {
         this.contentRootElement.html(content);
       }

    },

    accessPodContent: function() {
      return this.contentRootElement;
    },

    getStepName: function() {
      return this.stepName;
    },

    // Registers a callback method with this pod instance.
    addUpdateListener: function(callback) {
       this.updateCallback = callback;
    }

  };


  var __loadAndCreate = function(thisPod, container, stepName, content) {
      $.ajax({
        context: thisPod,
        url: "/guides/openliberty/src/main/content/html/interactive-guides/pod.html",
        async: false,
        success: function(result) {
          container.append($(result));
          this.contentRootElement = container.find('.podContainer').first();          

          // fill in contents
          this.setContent(content.content);

          if (content.callback) {
            var callback = eval(content.callback);
            // Identify this pod instance with the updateCallback
            // function specified by the user.
            callback(thisPod);
          }
        },
        error: function(result) {
          console.error("Could not load pod.html");
        }
      });
  };

  var __create = function(container, stepName, content) {
    return new podType(container, stepName, content);
  };

  return {
    create: __create
  };
})();
