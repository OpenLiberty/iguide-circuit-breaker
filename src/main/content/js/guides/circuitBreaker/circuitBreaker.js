var circuitBreaker = function(){

    var circuitState = {
      'closed': '0',
      'open': '1',
      'halfopen': '2'
    }

    var _circuitBreaker = function(stepName, successThreshold, requestVolumeThreshold, failureRatio, delay){
        this.stepName = stepName;
        this.updateParameters(successThreshold, requestVolumeThreshold, failureRatio, delay);
        this.updateCounters();
    };

    _circuitBreaker.prototype = {
      // Reset the circuit back to a closed state and update the parameters
      updateParameters: function(successThreshold, requestVolumeThreshold, failureRatio, delay){
        this.closeCircuit();
        this.successThreshold = successThreshold;
        this.requestVolumeThreshold = requestVolumeThreshold;
        this.failureRatio = failureRatio;
        this.delay = delay;

        // Additional counters needed
        this.successCount = 0;
        this.failureCount = 0;
        this.failureLimit = requestVolumeThreshold * failureRatio;
      },

      /*
        Update the counters in the HTML page
      */
      updateCounters: function(){
          $("#successThreshold").text("Success Threshhold: " + this.successThreshold);
          $("#requestVolumeThreshold").text("Request Volume Threshold: " + this.requestVolumeThreshold);
          $("#failureRatio").text("Failure Ratio: " + this.failureRatio);
          $("#delay").text("Delay: " + this.delay + " ms");
          $("#successCount").text("Success Count: " + this.successCount);
          $("#failureCount").text("Failure Count: " + this.failureCount);
      },

      setFallback: function(callbackFunction){
        this.fallbackFunction = fallbackFunction;
      },

      // Handles a successful request to the microservice
      sendSuccessfulRequest: function(){
        switch(this.state){
          case circuitState.closed:
            // Nothing happens because the circuit is already in a healthy state.
            break;
          case circuitState.open:
            // Call the fallback if there is one. Otherwise, the service fails immediately
            if(this.fallbackFunction){
              this.fallbackFunction();
            }
            break;
          case circuitState.halfopen:
            // Update the count of successful invocations. If enough successful requests go through, the circuit switches back to closed.
            this.successCount++;
            if(this.successCount >= this.successThreshold){
              this.closeCircuit();
            }
            break;
        }
        this.updateDiagram();
      },

      // Handles a failed request to the microservice
      sendFailureRequest: function(){
        this.successCount = 0;
        switch(this.state){
          case circuitState.closed:
            // Increase the failure count. If it is over the threshhold, then the circuit changes to open.
            this.failureCount++;
            if(this.failureCount >= this.failureLimit){
              this.openCircuit();
            }
            break;
          case circuitState.open:
            // Call the fallback if there is one. Otherwise, the service fails immediately
            if(this.fallbackFunction){
              this.fallbackFunction();
            }
            break;
          case circuitState.halfopen:
            // Circuit switches back into open state
            this.openCircuit();
            break;
        }
        this.updateDiagram();
      },

      updateDiagram: function(){
        // Hide images
        $("#circuitBreakerStates").find('img').hide();
        switch(this.state){
          case circuitState.closed:
            $("#closedCircuit").show();
            break;
          case circuitState.open:
            $("#OpenCircuit").show();
            break;
          case circuitState.halfopen:
            $("#halfOpenCircuit").show();
            break;
        }
        this.updateCounters();
      },

      /*
          Set the circuit to an open state.
          Any requests will be diverted to the fallback during this time.
          After the circuit delay, the circuit switches into half-open state.
      */
      openCircuit: function(){
        var me = this;
        this.failureCount = 0;
        this.state = circuitState.open;
        this.updateDiagram(circuitState.open);
        setTimeout(function(){
            me.halfOpenCircuit();
        }, this.delay);
      },

      /*
          Set the circuit to a closed state.
          The circuit will remain closed unless the microservice fails failureRatio * requestVolumeThreshold times
          during the requestVolumeThreshold window.
      */
      closeCircuit: function(){
        this.state = circuitState.closed;
        this.successCount = 0;
        // Update the pod to the closed circuit image by calling contentManager
        this.updateDiagram(circuitState.closed);
      },

      /*
          Set the circuit to a half-open state.

      */
      halfOpenCircuit: function(){
        this.state = circuitState.halfopen;
        this.updateDiagram(circuitState.halfopen);
      }
    }

    var _create = function(stepName, successThreshold, requestVolumeThreshold, failureRatio, delay){
      return new _circuitBreaker(stepName, successThreshold, requestVolumeThreshold, failureRatio, delay);
    };

    return {
        create: _create
    }
}();
