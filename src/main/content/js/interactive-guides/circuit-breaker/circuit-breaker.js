var circuitBreaker = function(){

    var circuitState = {
      'closed': '0',
      'open': '1',
      'halfopen': '2'
    };

    var _circuitBreaker = function(root, requestVolumeThreshold, failureRatio, delay, successThreshold){
        this.root = root; // Root element that this circuitBreaker is in
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
        this.pastRequests = [];
        this.rollingWindow = [];

        this.updateDiagramAndCounters();
      },

      addSuccessFailureSquares: function(container, array) {
        for(var i = 0; i < array.length; i++){
          var div = $("<div>");
          if(array[i] === "Success"){
            div.addClass('box greenBox');
          }
          else{
            div.addClass('box redBox');
          }
          container.append(div);
        }
      },

      /*
        Update the counters in the HTML page
      */
      updateCounters: function(){
          this.root.find(".successThreshold").text("Success Threshold: " + this.successThreshold);
          this.root.find(".requestVolumeThreshold").text("Request Volume Threshold: " + this.requestVolumeThreshold);
          this.root.find(".failureRatio").text("Failure Ratio: " + this.failureRatio);
          this.root.find(".delay").text("Delay: " + this.delay + " ms");
          this.root.find(".successCount").text("Success Count: " + this.successCount);
          this.root.find(".failureCount").text("Failure Count: " + this.failureCount);

          // Display rolling window
          var rollingWindow = this.root.find(".circuitBreakerRollingWindow");
          rollingWindow.empty();
          if(this.pastRequests.length > 0 || this.rollingWindow.length > 0){
            rollingWindow.append("[");
            this.addSuccessFailureSquares(rollingWindow, this.rollingWindow);
            rollingWindow.append("]");
            this.addSuccessFailureSquares(rollingWindow, this.pastRequests);
          }
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
              this.pastRequests.unshift(this.rollingWindow[this.rollingWindow.length-1]);
              this.rollingWindow.splice(this.rollingWindow.length-1, 1);
            }
            this.rollingWindow.unshift("Success");
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
              this.pastRequests.unshift(this.rollingWindow[this.rollingWindow.length-1]);
              this.rollingWindow.splice(this.rollingWindow.length-1, 1);
            }
            this.rollingWindow.unshift("Failure");
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
        this.root.find(".circuitBreakerStates").find('img').hide();
        switch(this.state){
          case circuitState.closed:
            this.root.find('.circuitBreakerButton').prop('disabled', false);
            this.root.find(".closedCircuit").show();
            this.root.find(".circuitBreakerRollingWindowDiv").css('opacity','1');
            break;
          case circuitState.open:
            this.root.find('.circuitBreakerButton').prop('disabled', true);
            this.root.find(".OpenCircuit").show();
            this.root.find(".circuitBreakerRollingWindowDiv").css('opacity','.5');
            break;
          case circuitState.halfopen:
            this.root.find('.circuitBreakerButton').prop('disabled', false);
            this.root.find(".halfOpenCircuit").show();
            this.root.find(".circuitBreakerRollingWindowDiv").css('opacity','.5');
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
        this.updateDiagramAndCounters(circuitState.open);

        var secondsLeft = this.delay;
        var delayCounter = this.root.find('.delayCounter');

        delayCounter.css('opacity', '1');
        delayCounter.text("Delay: " + secondsLeft + " ms");
        var interval = setInterval(function(){
          secondsLeft -= 100;
          delayCounter.text("Delay: " + secondsLeft + " ms");
          if(secondsLeft <= 0){
            delayCounter.css('opacity', '0.5');
            me.halfOpenCircuit();
            clearInterval(interval);
          }
        }, 100);
      },

      /*
          Set the circuit to a closed state.
          The circuit will remain closed unless the microservice fails failureRatio * requestVolumeThreshold times
          during the requestVolumeThreshold window.
      */
      closeCircuit: function(){
        this.state = circuitState.closed;
        this.successCount = 0;
        this.pastRequests = [];
        this.rollingWindow = [];
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