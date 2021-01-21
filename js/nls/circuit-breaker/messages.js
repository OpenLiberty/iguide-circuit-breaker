/*** To the translator: please do not translate the string "Global eBank" ***/
var circuit_breaker_messages = {
    ABOUT: "About",
    USER: "User",
    YOUR_ACCOUNT: "Global eBank - Your Account",
    SYSTEM_DOWN: "The system is down.",
    LAST_KNOWN_BALANCE: "Last known balance&#58",
    CURRENT_BALANCE: "Current balance&#58",
    MORE_ACTIONS: "More actions",
    VIEW_STMT: "View statement",
    TRANSFER_MONEY: "Transfer money",
    APPLY_LOANS: "Apply loans",
    SUCCESS: "Success",
    FAILURE: "Failure",
    RESET: "Reset",
    DELAY: "Delay&#58",
    DELAYJS: "Delay:",
    CHOOSE_NEXT_REQUEST: "Choose whether the next request to the microservice succeeds or fails. Connection attempts are shown from most recent to oldest.  The brackets represent the rolling window when the circuit is closed.",
    PAGENOTFOUND: "404 Page not found error",
    OH_NO: "Oh no! The Check Balance microservice is down! As more requests come into the service&#44 the users notice that their check balance requests are taking much longer and seem to hang. The users repeatedly refresh the page&#44 stacking up the requests to the Check Balance microservice even further. Eventually&#44 the web application is so busy servicing the failed requests that it comes to a crawl&#44 even for those not using the Check Balance microservice.",
    CIRCUIT_REMAINS: "The circuit remains in an open state for <code>5000 ms</code> before switching to a <b>half-open</b> state.",
    ASSUMING_CIRCUIT: "Assuming the circuit is in an <b>open</b> state&#44 the request to the Check Balance microservice fails immediately.  You are instantly notified of the problem and no longer must wait for the time-out period to occur to receive the notification.",
    CIRCUIT_STATE: "Circuit State&#58",
    OPEN: "Open",
    THRESHOLD_1: "The request is routed to the Check Balance microservice&#44 but the microservice is down. The circuit breaker policy opens the circuit after 1 failure&#44 which comes from multiplying the requestVolumeThreshold (2) by the failureRatio (0.5). However&#44 the circuit remains <b>closed</b> because the number of requests is fewer than the size of the rolling window (2).",
    THRESHOLD_2: "The request is routed to the Check Balance microservice&#44 but the microservice is still down. Since this failure is the second one in a rolling window of 2 requests&#44 the circuit is now <b>opened</b>. The next request to the Check Balance microservice will immediately fail.",
    HALF_OPEN: "Half-Open",
    SUCCESSFUL_CALL1: "Success! This call is the first successful call to the Check Balance microservice since the circuit to the service entered a half-open state. The circuit remains in a <b>half-open</b> state until the value of the successThreshold parameter is reached.",
    SUCCESSFUL_CALL2: "Success! This call is the second consecutive successful call to the Check Balance microservice since the circuit entered a half-open state. With a successThreshold value of 2&#44 the circuit to the microservice is now <b>closed</b>.",
    SUCCESS_COUNT: "Success Count:",
    NUM_SUCCESSFUL: "Number of successful attempts: ",
    NUM_FAILED: ". Number of failed attempts:",
    SIM_SUCCESS_CLOSED: "Simulate a successful request to the closed circuit",
    SIM_FAILED_CLOSED: "Simulate a failed request to the closed circuit",
    SIM_SUCCESS_OPEN: "Simulate a successful request to the open circuit",
    SIM_FAILED_OPEN: "Simulate a failed request to the open circuit",
    SIM_SUCCESS_HALF: "Simulate a successful request to the half open circuit",
    SIM_FAILED_HALF: "Simulate a failed request to the half open circuit",
    RESET_CLOSED: "Reset the closed circuit",
    RESET_OPEN: "Reset the open circuit",
    RESET_HALF: "Reset the half open circuit",
    OPEN_CIRCUIT: "Open Circuit",
    CLOSED_CIRCUIT: "Closed Circuit",
    HALF_OPEN_CIRCUIT: "Half Open Circuit",
    MICROSERVICE_DOWN: "Microservice is down",
    CHECK_BALANCE_OPEN: "Check Balance microservice in open circuit",
    CHECK_BALANCE_CLOSED: "Check Balance microservice in closed circuit",
    CHECK_BALANCE_HALF_OPEN: "Check Balance microservice in half open circuit",
    CHECK_BALANCE_RESULT_OPEN: "Check Balance microservice fails resulting in open circuit",
    CHECK_BALANCE_RESULT_CLOSED: "Check Balance microservice fails but remains closed until requestVolumeThreshold is met",
    CHECK_BALANCE_RESULT_HALF_OPEN: "Check Balance microservice in half open circuit",
    SYNTAX_ERROR: "Syntax error",
    UNSUPPORTED_CB_PARAM: "Unsupported @CircuitBreaker parameter",
    FAILON_SKIPON_UNSUPPORTED: "failOn and skipOn are unsupported for the playground"
  } ;
