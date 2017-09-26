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
package io.openliberty.guides.circuitBreaker.servlets;

import java.io.IOException;
import java.nio.charset.Charset;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.microprofile.faulttolerance.exceptions.CircuitBreakerOpenException;
import org.eclipse.microprofile.faulttolerance.exceptions.TimeoutException;

import io.openliberty.guides.circuitBreaker.servlets.beans.CircuitBreakerBean;
import io.openliberty.guides.circuitBreaker.servlets.exceptions.ConnectException;

/**
 * Servlet implementation class 
 */
@WebServlet("/checkBalance")
public class CircuitBreakerServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Inject
    CircuitBreakerBean bean;

    /**
     * @throws InterruptedException
     * @throws ConnectException
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    public String checkBalance(HttpServletRequest request, HttpServletResponse response) 
        throws ServletException, IOException, InterruptedException, ConnectException {
        String returnMsg;
        try {
            returnMsg = bean.checkBalance();
        } catch (ConnectException e) {
            returnMsg = e.getMessage();
        } catch (CircuitBreakerOpenException cboe) {
            returnMsg = "The system is still down. Try again later.";
        }
        return returnMsg;
    }
    
    protected void doGet(HttpServletRequest request,
        HttpServletResponse response) throws ServletException, IOException {

        String responseMsg = "";

        response.setContentType("text/html");    

        responseMsg += "<html><body><center><h1>Global eBank</h1></center><hr>";

        try {
            responseMsg += "<center>";
            responseMsg += checkBalance(request, response);
            responseMsg += "</center>";
        } catch (InterruptedException | TimeoutException | ConnectException e1) {
            e1.printStackTrace();
        }
            
        responseMsg += "</body></html>";

        try {
            response.getOutputStream().write(responseMsg.getBytes(Charset.forName("UTF-8")));
        } catch (Exception e) {
            response.getOutputStream().print("Something went wrong! : " + e.getMessage());
            return;
        }    
        
    }

    public void destroy() {    

    }
}
