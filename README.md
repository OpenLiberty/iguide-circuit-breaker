# iguide-circuit-breaker

Link to the guide on Openliberty.io: https://openliberty.io/guides/circuit-breaker.html

This repo provides an interactive guide on the Openliberty.io website that users can interact with
and learn more about different concepts related to Open Liberty.


## What you'll learn:

Explore how to build fault-tolerant microservices so that you can reduce the impact from failure and ensure continued operation of services. MicroProfile makes building fault-tolerant microservices easy with its Fault Tolerance feature.

You'll start with a sample bank scenario and see how it fails when no Fault Tolerance feature is in the example code. You'll then add the mpFaultTolerance feature to the server.xml file to to use the MicroProfile Fault Tolerance feature. Next, you'll include the @CircuitBreaker annotation so that your microservice fails immediately to prevent repeated calls that are likely to fail. You will explore and modify the parameters in the @CircuitBreaker annotation and simulate successful or failed requests to the microservice to see how the circuit state changes. Finally, you will add a fallback service so you can see how to invoke an alternate method for a failing service.
