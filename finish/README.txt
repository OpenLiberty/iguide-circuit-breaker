To use the sample application, extract the sampleapp_circuitbreaker.zip file to 
your local directory. The application contains two servlets, CircuitBreakerServlet 
and CircuitBreakerWithFallbackServlet, which call the checkBalance service.  

Run the Maven command 'mvn install' from the directory that contains the extracted 
.zip file to build the project and install it to your local directory. This 
creates the 'target/liberty' directory that contains your Liberty server, 
circuitBreakerSampleServer.

Start the Liberty server to run the application. To start and stop the server, 
run the following commands from <extract-directory>/target/liberty/wlp/bin>:
      server start circuitBreakerSampleServer
      server stop circuitBreakerSampleServer      

The <extract-directory>/src directory contains the BankService.java file, as shown 
throughout this guide. This file is where the @CircuitBreaker annotation is
injected into the code. For this sample app, the values for the circuit breaker
parameters are requestVolumeThreshold=2, failureRatio=0.50, delay=5000, 
and successThreshold=2. This means that if one request fails in a rolling window
of 2 requests, the circuit will be opened. The circuit remains in the open state
for 5 seconds and then switches to a half-open state. During the half-open state,
if a request fails, the circuit switches back to an open state. Otherwise, two
successful requests switches the circuit back to a closed state. The 
BankService.java file also contains code that automatically fails the first
two requests that are made to the checkBalance service to demonstrate the states of a
circuit breaker.

The @Fallback annotation and the fallback method are in a separate file, 
BankServiceWithFallback.java. The fallback method is invoked whenever a request 
to the service fails or when the circuit is open. When the fallback is running 
the method immediately returns  the following message:
	  "The last known balance of your account is $10,293."

To access the sample application with the checkBalance service, visit the 
following URL from your browser:
      http://localhost:9080/circuitBreakerSample/checkBalance
      
The checkBalance service simulates access failures in order to demostrate the
circuit breaker in action. The first two attempts to access the service will fail.  
Therefore, after the initial invocation of the checkBalance service the output
will show the following message: 
      "The system is down. Try again later" 
      
Refresh the browser. This second invocation fails in the same manner. The
circuit has now reached its failure threshold and enters into an open state.
It remains in an open state for five seconds before switching to a half-open state.

If a request to the checkBalance service occurs while the circuit is in an open
state the output immediately displays a slightly different response that displays the follwoign message:
      "The system is still down. Try again later."
      
However, if you wait five seconds before refreshing the browser, then the circuit
will be in a half-open state and the request is allowed to process.  The code
in BankService.java only simulates a failure for the first two requests to the 
checkBalance service, so this request will be successful and shows the following message:  
	  "Your account current balance is $10,293".

To access the sample application with the checkBalance service that includes 
a fallback method, visit the following URL from your browser:
      http://localhost:9080/circuitBreakerSample/checkBalanceWithSnapshot
      
The checkBalance service in BankServiceWithFallback.java also simulates two
failures. The state changes are the same as previously described, except there is now a fallback method assigned so the output immediately displays the output of the fallback whenever a request fails, or if the circuit is in an open
state. The output from the fallback shows the following message:
	  "The last known balance of your account is $10,293"

To restart the application in order to simulate the 2 failing requests again
you can stop and restart the circuitBreakerSampleServer as indicated.
	  
You can edit the java files to change the parameter values of the @CircuitBreaker
annotation. If the circuitBreakerSampleServer is running, run the Maven command 
'mvn package' from the directory that contains the extracted .zip file to rebuild
the application and the changes will take effect without restarting the server.  
Otherwise, stop the circuitBreakerSampleServer as indicated, run the Maven 
command 'mvn install', and restart circuitBreakerSampleServer.
