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
            OH_NO: messages.OH_NO,
            CIRCUIT_REMAINS: messages.CIRCUIT_REMAINS,
            ASSUMING_CIRCUIT: messages.ASSUMING_CIRCUIT,
            DELAYJS: messages.DELAYJS,
            DELAY: messages.DELAY,
            CIRCUIT_STATE: messages.CIRCUIT_STATE,
            OPEN: messages.OPEN,
            THRESHOLD_1: messages.THRESHOLD_1,
            THRESHOLD_2: messages.THRESHOLD_2,
            HALF_OPEN: messages.HALF_OPEN,
            SUCCESSFUL_CALL1: messages.SUCCESSFUL_CALL1,
            SUCCESSFUL_CALL2: messages.SUCCESSFUL_CALL2,
            SUCCESS: messages.SUCCESS,
            FAILURE: messages.FAILURE,
            SUCCESS_COUNT: messages.SUCCESS_COUNT,
            NUM_SUCCESSFUL: messages.NUM_SUCCESSFUL,
            NUM_FAILED: messages.NUM_FAILED,
            SIM_SUCCESS_CLOSED: messages.SIM_SUCCESS_CLOSED,
            SIM_FAILED_CLOSED: messages.SIM_FAILED_CLOSED,
            SIM_SUCCESS_OPEN: messages.SIM_SUCCESS_OPEN,
            SIM_FAILED_OPEN: messages.SIM_FAILED_OPEN,
            SIM_SUCCESS_HALF: messages.SIM_SUCCESS_HALF,
            SIM_FAILED_HALF: messages.SIM_FAILED_HALF,
            RESET_CLOSED: messages.RESET_CLOSED,
            RESET_OPEN: messages.RESET_OPEN,
            RESET_HALF: messages.RESET_HALF
        };
    };
  
    return {
      returnMessages: __returnMessages
    };
  })();