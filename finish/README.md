# Setup

To use the sample application, download and extract the [sampleapp_circuitbreaker.zip](https://github.com/OpenLiberty/iguide-circuit-breaker/raw/master/finish/sampleapp_circuitbreaker.zip) file to your local directory.

Use the `mvn install` Maven command from the directory that contains the extracted .zip files 
to build the project and install it in your local repository. The command creates the 
`target/liberty` directory that contains your Liberty server, circuitBreakerSampleServer, and starts the server in the background.

To stop the running server, run the Maven command `mvn liberty:stop-server`. To start
the circuitBreakerSampleServer, run the Maven command `mvn liberty:start-server`.

To access the sample application, visit the http://localhost:9080/circuitBreakerSample/checkBalance URL.

The checkBalance service simulates access failures in order to demostrate the circuit breaker in action. The first 2 attempts to access the service will fail. Therefore, the fallback is called after the first request fails. The output from the fallback shows the following message:
    "Last known balance: $1,029.00". 

Refresh the browser. This second invocation fails in the same manner. The circuit has now reached its failure threshold and enters into an open state. It remains in an open state for 5 seconds before switching to a half-open state. If a request to the checkBalance service occurs while the circuit is in an open state, the output immediately displays the same message from the fallback method because requests are not allowed to go through to the checkBalance service.

However, if you wait 5 seconds before refreshing the browser or if 5 seconds have elapsed since the circuit is opened when you refresh the browser, then the circuit will be in a half-open state and the request is allowed to process. The code in BankService.java only simulates a failure for the first two requests to the checkBalance service, so this request will be successful and shows the following message: 
	"Current balance: $1,029.00". 

To restart the application in order to simulate the 2 failing requests again you can stop and restart the circuitBreakerSampleServer as indicated. 

Edit the Java files to change the parameter values of the @CircuitBreaker annotation. If the circuitBreakerSampleServer server is running, run the `mvn package` Maven command from the directory that contains the extracted .zip file to rebuild the application. The changes take effect without restarting the server. Otherwise, stop the circuitBreakerSampleServer server as indicated and run the `mvn install` Maven command which will restart the server.

To view the console log, run the following or other alternative way to view the file:

    tail -f <extract-directory>/target/liberty/wlp/usr/servers/circuitBreakerSampleServer/logs/console.log


# Configuration
## BankService.java
The `<extract-directory>/src` directory contains the BankService.java file that is shown throughout the guide. 
The `@CircuitBreaker` and `@Fallback` annotations that are injected into the code are located in the BankService.java file.

### @CircuitBreaker Parameters
The `@CircuitBreaker` annotation has many parameters to configure its usage.
* **requestVolumeThreshold** specifies the minimum number of requests that must be made to the service before the circuit breaker policy determines whether the circuit should trip. The parameter also specifies the size of the rolling window. The default is `20` requests.
* **failureRatio** specifies the minimum failure ratio in the rolling window that triggers the circuit breaker. The default ratio is `0.5`.
* **maxDuration** specifies the maximum amount of time to perform retries. The default value is `180000`.
* **delay** specifies the delay in milliseconds after the circuit opens until the circuit breaker policy checks the availability of the main service. The default is `5000` ms.
* **successThreshold** specifies the number of consecutive successful invocations of the service that are required before the circuit is closed. The default is `1` request.

In this sample application, the values for the circuit breaker parameters are **requestVolumeThreshold**=2, **failureRatio**=0.50, **delay**=5000, and **successThreshold**=2. This means that if 1 request fails in a rolling window of 2 requests, the circuit will be opened. The circuit remains in the open state for 5 seconds and then switches to a half-open state. During the half-open state, if a request fails, the circuit switches back to an open state. Otherwise, 2 successful requests switches the circuit back to a closed state. The BankService.java file also contains code that automatically fails the first 2 requests that are made to the checkBalance service so as to demonstrate the states of a circuit breaker. 

The `@Fallback` annotation and the fallback method are also in BankService.java. The fallback method is called whenever a request to the service fails or when the circuit is open. When the circuit is open, the request is not allowed to go through to the service and the fallback is immediately called.