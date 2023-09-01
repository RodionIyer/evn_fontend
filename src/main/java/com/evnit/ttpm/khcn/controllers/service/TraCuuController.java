package com.evnit.ttpm.khcn.controllers.service;

import com.evnit.ttpm.khcn.models.detai.DanhSachChung;
import com.evnit.ttpm.khcn.models.detai.DeTaiResp;
import com.evnit.ttpm.khcn.models.service.Api_Service_Input;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuReq;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuResp;
import com.evnit.ttpm.khcn.payload.request.service.ExecServiceRequest;
import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;
import com.evnit.ttpm.khcn.security.services.SecurityUtils;
import com.evnit.ttpm.khcn.services.detai.DeTaiService;
import com.evnit.ttpm.khcn.services.tracuu.TraCuuService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Component
public class TraCuuController {
    @Autowired
    TraCuuService traCuuService;
    public ExecServiceResponse ListDanhSachTraCuu(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();

            String tenDeTai = "";
            String page = "";
            String pagezise = "";
            TraCuuReq traCuuReq = new TraCuuReq();
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("TIM_KIEM".equals(obj.getName())) {
                    Gson gsons = new GsonBuilder().serializeNulls().create();
                    traCuuReq = gsons.fromJson(obj.getValue().toString(), TraCuuReq.class);
                    //break;
                } else if ("PAGE_NUM".equals(obj.getName())) {
                    page = obj.getValue().toString();
                    //break;
                } else if ("PAGE_ROW_NUM".equals(obj.getName())) {
                    pagezise = obj.getValue().toString();
                    //break;
                }
            }
            List<TraCuuResp> listDeTai = traCuuService.ListTraCuu(traCuuReq, page, pagezise,userId,orgId);


            return new ExecServiceResponse(listDeTai, 1, "Danh sách thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }
}
