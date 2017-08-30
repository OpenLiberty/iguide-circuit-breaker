var circuitBreaker = function(){

    var circuitState = {
      'closed': '0',
      'open': '1',
      'halfopen': '2'
    };

    var _circuitBreaker = function(root, requestVolumeThreshold, failureRatio, delay, successThreshold){
        this.rootElement = root;
        this.updateParameters(requestVolumeThreshold, failureRatio, delay, successThreshold);
    };

    _circuitBreaker.prototype = {
      // Reset the circuit back to a closed state and update the parameters
      updateParameters: function(requestVolumeThreshold, failureRatio, delay, successThreshold){
        this.state = circuitState.closed;
        this.requestVolumeThreshold = requestVolumeThreshold;
        this.failureRatio = failureRatio;
        this.delay = delay;
        this.successThreshold = successThreshold;

        // Additional counters needed
        this.successCount = 0;
        this.failureCount = 0;
        this.failureLimit = requestVolumeThreshold * failureRatio;
        this.rollingWindow = [];

        this.updateDiagramAndCounters();
      },

      /*
        Update the counters in the HTML page
      */
      updateCounters: function(){
          this.rootElement.find(".successThreshold").text("Success Threshold: " + this.successThreshold);
          this.rootElement.find(".requestVolumeThreshold").text("Request Volume Threshold: " + this.requestVolumeThreshold);
          this.rootElement.find(".failureRatio").text("Failure Ratio: " + this.failureRatio);
          this.rootElement.find(".delay").text("Delay: " + this.delay + " ms");
          this.rootElement.find(".successCount").text("Success Count: " + this.successCount);
          this.rootElement.find(".failureCount").text("Failure Count: " + this.failureCount);
          this.rootElement.find(".circuitBreakerFailureWindow").text("Rolling Window: " + this.rollingWindow.join(", "));
      },

      setFallback: function(callbackFunction){
        this.fallbackFunction = fallbackFunction;
      },

      // Handles a successful request to the microservice
      sendSuccessfulRequest: function(){
        switch(this.state){
          case circuitState.closed:
            // Nothing happens because the circuit is already in a healthy state.
            if(this.rollingWindow.length >= this.requestVolumeThreshold){
              this.rollingWindow.splice(0, 1);
            }
            this.rollingWindow.push("Success");
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
        this.updateDiagramAndCounters();
      },

      // Handles a failed request to the microservice
      sendFailureRequest: function(){
        this.successCount = 0;
        switch(this.state){
          case circuitState.closed:
            // Increase the failure count in the rolling window. If the total failures over the threshold, then the circuit changes to open.
            if(this.rollingWindow.length >= this.requestVolumeThreshold){
              this.rollingWindow.splice(0, 1);
            }
            this.rollingWindow.push("Failure");
            var numFail = 0;
            for(var i = 0; i < this.rollingWindow.length; i++){
              if(this.rollingWindow[i] === "Failure"){
                numFail++;
              }
            }
            if(numFail >= this.failureLimit){
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
        this.updateDiagramAndCounters();
      },

      updateDiagramAndCounters: function(){
        // Hide images
        this.rootElement.find(".circuitBreakerStates").find('img').hide();
        switch(this.state){
          case circuitState.closed:
            this.rootElement.find(".closedCircuit").show();
            break;
          case circuitState.open:
            this.rootElement.find(".OpenCircuit").show();
            break;
          case circuitState.halfopen:
            this.rootElement.find(".halfOpenCircuit").show();
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
        this.rollingWindow = [];
        this.state = circuitState.open;
        this.updateDiagramAndCounters(circuitState.open);
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
        this.updateDiagramAndCounters(circuitState.closed);
      },

      /*
          Set the circuit to a half-open state.

      */
      halfOpenCircuit: function(){
        this.state = circuitState.halfopen;
        this.updateDiagramAndCounters(circuitState.halfopen);
      }
    };

    var _create = function(root, requestVolumeThreshold, failureRatio, delay, successThreshold){
      return new _circuitBreaker(root, requestVolumeThreshold, failureRatio, delay, successThreshold);
    };

    return {
        create: _create
    };
}();
