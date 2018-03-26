/*******************************************************************************
 * Copyright (c) 2017 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
package io.openliberty.guides.circuitbreaker.global.eBank.microservices;

import java.io.IOException;
import java.net.MalformedURLException;
import javax.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.faulttolerance.CircuitBreaker;
import org.eclipse.microprofile.faulttolerance.Fallback;

import io.openliberty.guides.circuitbreaker.global.eBank.exceptions.ConnectException;

@ApplicationScoped
public class BankService {

    public static final int requestVolumeThresholdValue = 2;
    private int counterForInvokingCheckBalance = 0;
    
    /*
     * Fallback is called whenever a request fails and when the circuit is in open state.
     */
    @Fallback(fallbackMethod="fallbackBalance")
    /*
     * If one request fails in a rolling window of 2 requests, the circuit will be opened. 
     * The circuit will remain in the open state for 5 seconds and then switch to half-open state.
     * During the half-open state, if a request fails, the circuit will switch back to open state. 
     * Otherwise 2 successful requests will switch the circuit back to closed state.
     */
    @CircuitBreaker(requestVolumeThreshold=requestVolumeThresholdValue, failureRatio=0.50, delay=5000, successThreshold=2)
    public Service checkBalance() throws ConnectException, MalformedURLException, IOException {
        counterForInvokingCheckBalance++;       
        return checkBalanceService();
    }

    public Service checkBalanceService() throws ConnectException, MalformedURLException, IOException {
        // Simulating 2 failures to trip the circuit 
        if (counterForInvokingCheckBalance <= requestVolumeThresholdValue) {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException ie) {
                throw new ConnectException("The system is down. Try again later.");
            }
            // The exception will trigger fallback to be called.
            throw new ConnectException("The system is down. Try again later.");
        }
        return new BalanceService();
        
    }

    public Service fallbackBalance() throws ConnectException, MalformedURLException, IOException {
        return new SnapshotBalanceService();
    }
    
}
