package com.ibm.openliberty.rest;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Application;

@ApplicationPath("api")
@Path("/")
public class OpenLibertyEndpoint extends Application {

    @GET
    @Path("/")
    public String handle() {
        return "Open Liberty REST API test";
    }

}