package com.evnit.ttpm.khcn.controllers.service;

import com.evnit.ttpm.khcn.models.service.Api_Service_Input;
import com.evnit.ttpm.khcn.payload.request.service.ExecServiceRequest;
import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;
import com.evnit.ttpm.khcn.security.services.SecurityUtils;
import com.evnit.ttpm.khcn.services.mail.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Controller;

import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

@Controller
public class MailController {

    @Autowired
    private MailService mailService;


    public ExecServiceResponse exec_69409147_B0DC_4D1D_B355_8E794F7C9B44(ExecServiceRequest execServiceRequest) {
            String token="";
        for (Api_Service_Input obj : execServiceRequest.getParameters()) {
            if ("TOKEN_LIST".equals(obj.getName())) {
                token = obj.getValue().toString();
                //break;
            }
        }
            try{
                mailService.GetSendMailDB(token);
            }catch (Exception ex){
                return new ExecServiceResponse(-1, "Lỗi gui mail");
            }
        return new ExecServiceResponse("", 1, "Send mail thành công");

    }
}
