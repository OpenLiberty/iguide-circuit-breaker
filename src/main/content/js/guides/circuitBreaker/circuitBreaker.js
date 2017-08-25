var circuitBreaker = function(){

    var circuitState = {
      'closed': '0',
      'open': '1',
      'halfopen': '2'
    }

    // TODO: stepNum will be used for telling contentManager what pod to update with the correct image
    var _circuitBreaker = function(stepNum, successThreshold, requestVolumeThreshold, failureRatio, delay){
        this.stepNum = stepNum;
        this.successThreshold = successThreshold;
        this.requestVolumeThreshold = requestVolumeThreshold;
        this.failureRatio = failureRatio;
        this.delay = delay;
    };

    _circuitBreaker.prototype = {
      changeParameters: function(successThreshold, requestVolumeThreshold, failureRatio, delay){
        this.successThreshold = successThreshold;
        this.requestVolumeThreshold = requestVolumeThreshold;
        this.failureRatio = failureRatio;
        this.delay = delay;
      },

      setFallback: function(callbackFunction){
        this.fallbackFunction = fallbackFunction;
      },

      updateBrowserContent: function(state){
        switch(state){
          case circuitState.closed:
            //TODO
            break;
          case circuitState.open:
            //TODO
            break;
          case circuitState.halfopen:
            //TODO
            break;
        }
        contentManager.loadContentInBrowser();
      },

      /*
          Set the circuit to an open state.
          Any requests will be diverted to the fallback during this time.
          After the circuit delay, the circuit switches into half-open state.
      */
      openCircuit: function(){
        this.updateBrowserContent(circuitState.open);
        setTimeout(function(){
            this.setHalfOpenCircuit();
        }, this.delay);
      },

      /*
          Set the circuit to a closed state.
          The circuit will remain closed unless the microservice fails failureRatio * requestVolumeThreshold times
          during the requestVolumeThreshold window.
      */
      closeCircuit: function(){
        // Update the pod to the closed circuit image by calling contentManager
        this.updateBrowserContent(circuitState.closed);
      },

      /*
          Set the circuit to a half-open state.

      */
      setHalfOpenCircuit: function(){
        this.updateBrowserContent(circuitState.halfopen);
      }
    }

    var _create = function(stepNum, successThreshold, requestVolumeThreshold, failureRatio, delay){
      return new _circuitBreaker(stepNum, successThreshold, requestVolumeThreshold, failureRatio, delay);
    };

    return {
        create: _create
    }
}();
