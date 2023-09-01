package com.evnit.ttpm.khcn.payload.request.service;

import com.evnit.ttpm.khcn.models.service.Api_Service_Input;

import javax.validation.constraints.NotBlank;
import java.util.List;

public class ExecServiceRequest {

    @NotBlank
    private String serviceId;

    private List<Api_Service_Input> parameters;

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public List<Api_Service_Input> getParameters() {
        return parameters;
    }

    public void setParameters(List<Api_Service_Input> parameters) {
        this.parameters = parameters;
    }

}
