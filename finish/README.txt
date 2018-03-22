To use the sample application, extract the sampleapp_circuitbreaker.zip file to 
your local directory. The application contains the CircuitBreakerServlet which 
calls the checkBalance service. 

Run the Maven command 'mvn clean install' from the directory that contains the extracted 
.zip file to build the project and install it to your local directory. The command 
creates the 'target/liberty' directory that contains your circuitBreakerSampleServer 
server and starts the server in the background.

To stop the running server, run the Maven command "mvn liberty:stop-server". To start
the circuitBreakerSampleServer, run the Maven command "mvn liberty:start-server".

The <extract-directory>/src directory contains the BankService.java file, as shown 
throughout this guide. This file is where the @CircuitBreaker annotation is 
injected into the code. For this sample app, the values for the circuit breaker 
parameters are requestVolumeThreshold=2, failureRatio=0.50, delay=5000, 
and successThreshold=2. This means that if 1 request fails in a rolling window 
of 2 requests, the circuit will be opened. The circuit remains in the open state 
for 5 seconds and then switches to a half-open state. During the half-open state, 
if a request fails, the circuit switches back to an open state. Otherwise, 2 
successful requests switches the circuit back to a closed state. The 
BankService.java file also contains code that automatically fails the first 2 
requests that are made to the checkBalance service so as to demonstrate the states 
of a circuit breaker. 

The @Fallback annotation and the fallback method are also in BankService.java.
The fallback method is called whenever a request to the service fails or when 
the circuit is open. When the circuit is open, the request is not allowed to go 
through to the service and the fallback is immediately called. 

To access the sample application with the checkBalance service that includes
a fallback method, visit the following URL from your browser: 
      http://localhost:9080/circuitBreakerSample/checkBalance 
The checkBalance service simulates access failures in order to demostrate the 
circuit breaker in action. The first 2 attempts to access the service will fail. 
Therefore, the fallback is called after the first request fails. The output from 
the fallback shows the following message:
      "Your last known account balance is $10,293". 

Refresh the browser. This second invocation fails in the same manner. The 
circuit has now reached its failure threshold and enters into an open state. 
It remains in an open state for 5 seconds before switching to a half-open state. 
If a request to the checkBalance service occurs while the circuit is in an open 
state, the output immediately displays the same message from the fallback method
because requests are not allowed to go through to the checkBalance service.

However, if you wait 5 seconds before refreshing the browser or if 5 seconds have 
elapsed since the circuit is opened when you refresh the browser, then the circuit 
will be in a half-open state and the request is allowed to process. The code in 
BankService.java only simulates a failure for the first two requests to the checkBalance 
service, so this request will be successful and shows the following message: 
	"Your account current balance is $10,293". 

To restart the application in order to simulate the 2 failing requests again 
you can stop and restart the circuitBreakerSampleServer as indicated. 
 
You can edit the java files to change the parameter values of the @CircuitBreaker 
annotation. Change the value of requestVolumeThresholdValue variable on line 25 of 
BankService.java to indicate the failure threshold and simulate the number of failure
requests. If the circuitBreakerSampleServer is running, run the Maven command 
'mvn package' from the directory that contains the extracted .zip file to rebuild 
the application and the changes will take effect without restarting the server. 
Otherwise, stop the circuitBreakerSampleServer as indicated, run the Maven 
command 'mvn install' which starts circuitBreakerSampleServer as a background process.
