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
            ASSUMING_CIRCUIT: messages.ASSUMING_CIRCUIT
        };
    };
  
    return {
      returnMessages: __returnMessages
    };
  })();