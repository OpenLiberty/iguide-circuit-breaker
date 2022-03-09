# Setup

To use the sample application, download and extract the [sampleapp_circuitbreaker.zip](https://github.com/OpenLiberty/iguide-circuit-breaker/raw/prod/finish/sampleapp_circuitbreaker.zip) file to your local directory.

Use the `mvn install` Maven command from the directory that contains the extracted .zip files
to build the project and install it in your local repository. The command creates the
`target/liberty` directory that contains your Liberty server, circuitBreakerSampleServer, and starts the server in the background.

To stop the running server, run the Maven command `mvn liberty:stop-server`. To start
the circuitBreakerSampleServer, run the Maven command `mvn liberty:start-server`.

To access the sample application, visit the http://localhost:9080/circuitBreakerSample/checkBalance URL.

The checkBalance service simulates access failures in order to demonstrate the circuit breaker in action by throwing a **ConnectException**. The first attempt to access the service will fail. The fallback is invoked. The output from the fallback shows the following message:\
    "Last known balance: $1,029.00".

Refresh the browser. This second invocation fails in the same manner. The circuit has now reached its failure threshold and enters into an open state. If a request to the checkBalance service occurs while the circuit is in an open state, it is immediately returned with a CircuitBreakerOpenException and is not allowed to go through to the checkBalance service. The output displays the same message from the fallback method because the @Fallback annotation applies to both ConnectExceptions and CircuitBreakerOpenExceptions.

However, if you wait 5 seconds before refreshing the browser or if 5 seconds have elapsed since the circuit is opened when you refresh the browser, then the circuit will be in a half-open state and the request is allowed to process. The code in BankService.java simulates a failure for the first two requests processed by the checkBalance service. This is controlled by a variable, **numberOfFailedRequestAttempts**, in BankService.java and can be changed. Afterwards, it will be successful and show the following message:\
    "Current balance: $1,029.00".

To restart the application in order to simulate the 2 failing requests again you can stop and restart the circuitBreakerSampleServer as indicated.

Edit the Java file to change the parameter values of the @CircuitBreaker or @Fallback annotation or the variable **numberOfFailedRequestAttempts**. If the circuitBreakerSampleServer server is running, run the `mvn package` Maven command from the directory that contains the extracted .zip file to rebuild the application. The changes take effect without restarting the server. Otherwise, stop the circuitBreakerSampleServer server as indicated and run the `mvn install` Maven command which will restart the server.

To view the console log, run the following or other alternative way to view the file:

    tail -f <extract-directory>/target/liberty/wlp/usr/servers/circuitBreakerSampleServer/logs/console.log

Statements have been added to the code to indicate in the log when a ConnectException was thrown or when a successful service request was made. It will also indicate when the fallback method ran.  Remember that the initial @Fallback annotation is configured to invoke the fallback method whenever a ConnectException or a CircuitBreakerOpenException is thrown.


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
* **failOn** and **skipOn** restrict which exceptions are considered failures in determining if the circuit breaker should open.  The default is that `all exceptions` are considered failures.

In this sample application, the values for the circuit breaker parameters are **requestVolumeThreshold**=2, **failureRatio**=0.50, **delay**=5000, **successThreshold**=2, and **failOn**=ConnectException.class. The **skipOn** parameter is not set.  This means that if 1 request fails with a ConnectException in a rolling window of 2 requests, the circuit will be opened. The circuit remains in the open state for 5 seconds and then switches to a half-open state. During the half-open state, if a request fails with a ConnectException, the circuit switches back to an open state. Otherwise, 2 successful requests switches the circuit back to a closed state. The BankService.java file contains code that automatically fails the first 2 requests that are made to the checkBalance service with a ConnectException so as to demonstrate the states of a circuit breaker.  This is just an arbitrary number of failures set by the variable **numberOfFailedRequestAttempts**.

### @Fallback Parameters
The Fallback is invoked any time the method invocation fails with the configured exceptions. The `@Fallback` annotation accepts the following parameters.
* **fallbackMethod** which specifies the method to run if a Fallback is required.  The method must have the same parameter types and return type as the annotated method.
* **applyOn** and **skipOn** restrict which exceptions should invoke the fallback method.  The default is that all exceptions returned by the annotated method will invoke the fallback method.

The @Fallback annotation and the fallback method are also in BankService.java. As initially configured, the fallback method is invoked whenever a request to the service fails with a ConnectException or when the circuit is open. When the circuit is open, the request is not allowed to go through to the service, a CircuitBreakerOpenException is issued, and the fallback runs.

* * *

Try commenting out the @Fallback annotation completely to gain a better understanding of how the @CircuitBreaker annotation works.  Without the @Fallback annotation, errors are returned to `<extract-directory>/src/main/java/io/openliberty/guides/circuitbreaker/global/eBank/servlets/CircuitBreakerServlet.java` where the request is initiated.  There, when a ConnectException occurs, the message displayed is\
'The system is down'.\
When a CircuitBreakerOpenException occurs, the message displayed is\
'The system is experiencing a problem'.\
Look in the server's `console.log` to see additional trace messages on when an Exception is thrown. Try changing the **failOn** and **skipOn** parameters of the @CircuitBreaker annotation to see how you can control when the Circuit Breaker policy will run.  Remember that ConnectException is a subclass of IOException in case you want to test how that works. For example, change the annotation to 'skipOn=IOException.class' to see that the the simulated ConnectExceptions will have no affect on the Circuit Breaker policy.  If you remove the the **failOn** and **skipOn** parameters, all errors thrown by the service request will be considered an error that applies to the circuit breaker policy.

With the @Fallback annotation enabled, change the **applyOn** and **skipOn** parameters to test how you can control when the fallback method runs.  For example, set **applyOn** only to ConnectException.class. Then, when a CircuitBreakerOpenException is thrown because the circuit is open, you will see the servlet print out\
'The system is experiencing a problem'\
instead of running the fallback method.  Or, change the parameter value ConnectException.class to IOException.class to see how the policy applies to all subclasses of the specified exception class.