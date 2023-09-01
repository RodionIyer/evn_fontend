package com.evnit.ttpm.khcn.controllers.service;

import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;

public class ToolCallNgoaiController {

    public ExecServiceResponse toolAutoUpload(){

        return new ExecServiceResponse(1, "Thực hiện thành công");
    }

    public ExecServiceResponse toolAutoEmail(){
        return new ExecServiceResponse(-1, "Thực hiện thành công");
    }
}
