To use the sample application, extract the sampleapp_circuitbreaker.zip file to your local directory. The application contains a checkBalance service.  

Use the Maven command 'mvn install' from the directory containing the extracted .zip files to build the project and install it to your local repository.  This will create the 
'sampleapp_circuitbreaker/target/liberty' directory containing your liberty server, circuitBreakerSampleServer.

The <extract-directory>\sampleapp_circuitbreaker\src directory contains the BankService.java and BankServiceWithFallback.java files as shown throughout this guide. These files are where the @CircuitBreaker annotation 
injected into the code. For this sample app, the default values for these properties are requestVolumeThreshold=2, failureRatio=0.50, delay=5000, successThreshold=2. The BankServiceWithFallback.java also contain @Fallback annotation.

To start and stop the server, issue the following commands from 
<extract-directory>/sampleapp_circuitbreaker/target/liberty/wlp/bin:
      server start circuitBreakerSampleServer
      server stop circuitBreakerSampleServer

To execute the sample application with checkBalance service, visit the following URL from your browser:
      http://localhost:9080/circuitBreakerSample/checkBalance
Initially this will show "The system is down. Try again later". Click on refresh button in the browser the second time will show "Your account current balance is $10,293".

To execute the sample application with checkBalance service with Fallback, visit the following URL from your browser:
      http://localhost:9080/circuitBreakerSample/checkBalanceWithSnapshot
Initially this will show "The last known balance of your account is $10,293". Click on refresh button in the browser the second time will show "Your account current balance is $10,293".

You can edit the java file to change the properties values of the @CircuitBreaker annotation. The changes will only take effect at application startup. 

If the circuitBreakerSampleServer is running, run the Maven command 'mvn package' to rebuild the application and the changes will take effect without restarting the server.

Restarting the circuitBreakerSampleServer as indicate above will restart the application.

