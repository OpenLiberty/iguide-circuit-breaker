/*******************************************************************************
 * Copyright (c) 2018 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
var circuitBreakerMessages = (function() {
    var __returnMessages = function() {
        
        return { 
            OH_NO: circuit_breaker_messages.OH_NO,
            CIRCUIT_REMAINS: circuit_breaker_messages.CIRCUIT_REMAINS,
            ASSUMING_CIRCUIT: circuit_breaker_messages.ASSUMING_CIRCUIT,
            DELAYJS: circuit_breaker_messages.DELAYJS,
            DELAY: circuit_breaker_messages.DELAY,
            CIRCUIT_STATE: circuit_breaker_messages.CIRCUIT_STATE,
            OPEN: circuit_breaker_messages.OPEN,
            THRESHOLD_1: circuit_breaker_messages.THRESHOLD_1,
            THRESHOLD_2: circuit_breaker_messages.THRESHOLD_2,
            HALF_OPEN: circuit_breaker_messages.HALF_OPEN,
            SUCCESSFUL_CALL1: circuit_breaker_messages.SUCCESSFUL_CALL1,
            SUCCESSFUL_CALL2: circuit_breaker_messages.SUCCESSFUL_CALL2,
            SUCCESS: circuit_breaker_messages.SUCCESS,
            FAILURE: circuit_breaker_messages.FAILURE,
            SUCCESS_COUNT: circuit_breaker_messages.SUCCESS_COUNT ,
            NUM_SUCCESSFUL: circuit_breaker_messages.NUM_SUCCESSFUL,
            NUM_FAILED: circuit_breaker_messages.NUM_FAILED,
            SIM_SUCCESS_CLOSED: circuit_breaker_messages.SIM_SUCCESS_CLOSED,
            SIM_FAILED_CLOSED: circuit_breaker_messages.SIM_FAILED_CLOSED,
            SIM_SUCCESS_OPEN: circuit_breaker_messages.SIM_SUCCESS_OPEN,
            SIM_FAILED_OPEN: circuit_breaker_messages.SIM_FAILED_OPEN,
            SIM_SUCCESS_HALF: circuit_breaker_messages.SIM_SUCCESS_HALF,
            SIM_FAILED_HALF: circuit_breaker_messages.SIM_FAILED_HALF,
            RESET_CLOSED: circuit_breaker_messages.RESET_CLOSED,
            RESET_OPEN: circuit_breaker_messages.RESET_OPEN,
            RESET_HALF: circuit_breaker_messages.RESET_HALF,
            MICROSERVICE_DOWN: circuit_breaker_messages.MICROSERVICE_DOWN,
            CHECK_BALANCE_OPEN: circuit_breaker_messages.CHECK_BALANCE_OPEN,
            CHECK_BALANCE_CLOSED: circuit_breaker_messages.CHECK_BALANCE_CLOSED,
            CHECK_BALANCE_HALF_OPEN: circuit_breaker_messages.CHECK_BALANCE_HALF_OPEN,
            CHECK_BALANCE_RESULT_OPEN: circuit_breaker_messages.CHECK_BALANCE_RESULT_OPEN,
            CHECK_BALANCE_RESULT_HALF_OPEN: circuit_breaker_messages.CHECK_BALANCE_RESULT_HALF_OPEN
        };
    };
  
    return {
      returnMessages: __returnMessages
    };
  })();