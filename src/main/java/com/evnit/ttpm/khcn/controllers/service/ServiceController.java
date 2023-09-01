package com.evnit.ttpm.khcn.controllers.service;

import com.evnit.ttpm.khcn.models.service.Api_Service_Input;
import com.evnit.ttpm.khcn.payload.request.service.ExecServiceRequest;
import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;
import com.evnit.ttpm.khcn.security.jwt.JwtUtils;
import com.evnit.ttpm.khcn.security.services.SecurityUtils;
import com.evnit.ttpm.khcn.services.custom.CustomService;
import com.evnit.ttpm.khcn.services.service.ServiceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 36000)
@RestController
@RequestMapping("/api/service")
public class ServiceController {

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ServiceService serviceService;

    @Autowired
    CustomService customService;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    ManageFileController manageFileController;
    @Autowired
    MailController mailController;
    @Autowired
	ExcelController excelController;

    @Autowired
    KeHoachController keHoachController;

    @Autowired
    DeTaiController deTaiController;
    @Autowired
    SangKienController sangKienController;

    @Autowired
    TraCuuController traCuuController;
    @Autowired
    ThongKeController thongKeController;

    @RequestMapping(value = "/execServiceNoLogin", method = RequestMethod.POST, produces = "application/json")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> execServiceNoLogin(@Valid @RequestBody ExecServiceRequest execServiceRequest) {
        try {
            Map<String, Object> objService = serviceService.getServiceInfo(execServiceRequest.getServiceId());
            if (objService == null || !objService.containsKey("ENABLE") || objService.get("ENABLE") == null || !(Boolean) objService.get("ENABLE")) {
                return ResponseEntity.ok().body(new ExecServiceResponse(null, 0, "Dịch vụ không tồn tại"));
            }
            if (objService.get("API_SERVICE_TYPEID").equals("CUSTOM_NOLOGIN")) {
                List<Map<String, Object>> objServiceInput = serviceService.getServiceInputInfo(execServiceRequest.getServiceId());
                if (!checkParameterInput(objServiceInput, execServiceRequest.getParameters())) {
                    return ResponseEntity.ok().body(new ExecServiceResponse(null, 0, "Tham số đầu vào không đúng"));
                } else {
                    return ResponseEntity.ok().body(APICustomNoLogin(execServiceRequest));
                }

            } else {
                //Map<String, Object> objService = serviceService.getServiceInfo(execServiceRequest.getServiceId());
                if (objService != null && objService.containsKey("IS_PUBLIC") && (Boolean) objService.get("IS_PUBLIC")) {
                    List<Map<String, Object>> objServiceInput = serviceService.getServiceInputInfo(execServiceRequest.getServiceId());
                    if (!checkParameterInput(objServiceInput, execServiceRequest.getParameters())) {
                        return ResponseEntity.ok().body(new ExecServiceResponse(null, 0, "Tham số đầu vào không đúng"));
                    } else {
                        Map<String, Object> dataServiceResult = serviceService.execService(objService, buildParameterNoLogin(objServiceInput, execServiceRequest.getParameters()));
                        if ((Integer) dataServiceResult.get("Status") == 1) {
                            return ResponseEntity.ok().body(new ExecServiceResponse(dataServiceResult.get("data"), 1, "Xử lý thành công"));
                        } else {
                            return ResponseEntity.ok().body(new ExecServiceResponse(dataServiceResult.get("data"), 0, dataServiceResult.get("Message").toString()));
                        }
                    }
                } else {
                    return ResponseEntity.ok().body(new ExecServiceResponse(null, 409, "Không có quyền thực hiện"));
                }
            }
        } catch (Exception e) {
            return ResponseEntity.ok().body(new ExecServiceResponse(null, 0, "Xảy ra lỗi hệ thống"));
        }

    }

    private ExecServiceResponse APICustomNoLogin(ExecServiceRequest execServiceRequest) {
        ServiceCustomController serviceCustomController = new ServiceCustomController(serviceService,customService,jwtUtils,userDetailsService);
        switch (execServiceRequest.getServiceId()) {
            default:
                return new ExecServiceResponse(null, 0, "Dịch vụ không tồn tại");
        }

    }

    private ExecServiceResponse APICustomLogin(ExecServiceRequest execServiceRequest) {
        ServiceCustomController serviceCustomController = new ServiceCustomController(serviceService,customService,jwtUtils,userDetailsService);
        switch (execServiceRequest.getServiceId()) {
            case "BE98CBC1-D3C3-46B6-91A6-BDF6F227D40C":
                return serviceCustomController.exec_BE98CBC1_D3C3_46B6_91A6_BDF6F227D40C(execServiceRequest);
            case "2120F73B-854B-408E-B5AD-257E7F184922"://uploadfile
                return manageFileController.exec_2120F73B_854B_408E_B5AD_257E7F184922(execServiceRequest);
            case "2269B72D-1A44-4DBB-8699-AF9EE6878F89": //download file
                return manageFileController.exec_2269B72D_1A44_4DBB_8699_AF9EE6878F89(execServiceRequest);
            case "69409147-B0DC-4D1D-B355-8E794F7C9B44": //email
                return mailController.exec_69409147_B0DC_4D1D_B355_8E794F7C9B44(execServiceRequest);
			case "B186CEDA-876B-4511-96D1-E199926A6913": //xuat file template
                return excelController.exec_B186CEDA_876B_4511_96D1_E199926A6913(execServiceRequest);
            case "1E707636-93B5-43EA-97BC-2F850C14D1E3": //import
                return excelController.exec_1E707636_93B5_43EA_97BC_2F850C14D1E3(execServiceRequest);
            case "030A9A96-90D5-4AD0-80E4-C596AED63EE7": //danh sach don vi con
               // String orgId= SecurityUtils.getPrincipal().getORGID();
                return excelController.exec_030A9A96_90D5_4AD0_80E4_C596AED63EE7(execServiceRequest);
            case "FC95C3F7-942F-4C7E-88D7-46E12BFE9185": //xuat bao cao
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return excelController.exec_FC95C3F7_942F_4C7E_88D7_46E12BFE9185(execServiceRequest);

                //Insert Ke hoach

            case "8033B6AB-4918-42DD-8A0B-CDA6D22ACAAE": // list mã Kế hoạch
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return keHoachController.ChiTietKeHoachNhieuMaKeHoach(execServiceRequest);
            case "404ABE65-3B92-448F-A8F0-9543503AE1E3": //them ke hoach
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return keHoachController.ThemSua(execServiceRequest);
            case "DC2F3F51-09CC-4237-9284-13EBB85C83C1": //chi tiết ke hoach
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return keHoachController.ChiTiet(execServiceRequest);
            case "DEA672A5-4533-4C16-8D99-7E6D4D277941": //danh sach ke hoach
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return keHoachController.ListDanhSachKeHoach(execServiceRequest);
            case "038D4EB5-55D0-49C4-8FDB-C242E6759955": //danh sach ke hoach phe duyet
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return keHoachController.ListDanhSachKeHoachPheDuyet(execServiceRequest);
            case "CA665A17-3450-4C70-8CCE-6F1FD44E0999": //danh sach ke hoach giao viec
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return keHoachController.ListDanhSachKeHoachGiaoViec(execServiceRequest);
            case "90B27610-123D-4EEE-9A41-10F9DBB43281": //danh sach lịch sử
                return keHoachController.ListLichSu(execServiceRequest);
            //de tai
            case "8565DAF2-842B-438E-B518-79A47096E2B5": //them moi de tai
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return deTaiController.ThemSua(execServiceRequest);
            case "00249219-4EE7-466D-BD84-269064AC9D9B": //danh sách de tai
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return deTaiController.ListDanhSachDeTai(execServiceRequest);
            case "F2F9604E-336C-47FB-BA0B-53A4D3869795": //danh sách de tai chung
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return deTaiController.ListDanhSachDeTaiChung(execServiceRequest);
            case "F360054F-7458-443A-B90E-50DB237B5642": //chi tiet de tai
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return deTaiController.ChiTietDanhSachDeTai(execServiceRequest);
            case "34A59664-4613-482F-95CA-CCF346E2140A": //danh sách kế hoạch boi ten
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return deTaiController.DanhSachKehoach(execServiceRequest);
				
			 case "395A68D9-587F-4603-9E1D-DCF1987517B4": //danh sách user
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return deTaiController.DanhSachUser(execServiceRequest);
            case "D5738375-3591-4986-94FC-E523F645A858": //danh sách Hôi Đồng
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return deTaiController.DanhSachHoiDong(execServiceRequest);

            case "BDA6825F-9CAB-4363-A093-5A2C7D906AE5": //danh sách lich su
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return deTaiController.ListLichSu(execServiceRequest);



            //Sang kien
            case "09E301E6-9C2E-424C-A3C3-FD46CE8CB18C": //them moi sang kien
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return sangKienController.ThemSua(execServiceRequest);

            case "45283A19-1068-4FEF-8357-89924E2A5D47": //danh sach sang kien
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return sangKienController.DanhSach(execServiceRequest);
            case "0CCBA90A-07BA-482E-85AA-A129FD4B7EE5": //Chi tiết sáng kiến
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return sangKienController.ChiTiet(execServiceRequest);

            case "6CB00DBC-A70D-41E1-956E-0C67E2A24342": //danh sách lich su
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return sangKienController.ListLichSu(execServiceRequest);


                //tra cuu

            case "63912FAF-0865-4E94-BDBB-6048F2D720C9": //danh sach tra cuu
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return traCuuController.ListDanhSachTraCuu(execServiceRequest);

            //thống kê
            case "8EA6E3A8-860D-46A9-98B6-AD215E62FE45": //danh sach thống kê
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return thongKeController.ListDanhSach(execServiceRequest);

            case "812E1113-7206-43DA-B3FA-71509FEF209C": //Xuất báo cáo thống kê
                // String orgId= SecurityUtils.getPrincipal().getORGID();
                return thongKeController.Export(execServiceRequest);

            default:
                return new ExecServiceResponse(null, 0, "Dịch vụ không tồn tại");
        }
    }

    @RequestMapping(value = "/execServiceLogin", method = RequestMethod.POST, produces = "application/json")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> execServiceLogin(@Valid @RequestBody ExecServiceRequest execServiceRequest) {
        try {
            Map<String, Object> objService = serviceService.getServiceInfo(execServiceRequest.getServiceId());
            if (objService == null || !objService.containsKey("ENABLE") || objService.get("ENABLE") == null || !(Boolean) objService.get("ENABLE")) {
                return ResponseEntity.ok().body(new ExecServiceResponse(null, 0, "Dịch vụ không tồn tại"));
            }
            if (objService.get("API_SERVICE_TYPEID").equals("CUSTOM_LOGIN")) {
                boolean bCheckGrant = false;
                if (objService != null && objService.containsKey("IS_PUBLIC") && (Boolean) objService.get("IS_PUBLIC")) {
                    bCheckGrant = true;
                } else {
                    bCheckGrant = serviceService.checkAuthServiceInfo(objService.get("API_SERVICEID").toString(), SecurityUtils.getPrincipal().getUserId());
                }
                if (bCheckGrant) {
                    List<Map<String, Object>> objServiceInput = serviceService.getServiceInputInfo(execServiceRequest.getServiceId());
                    if (!checkParameterInput(objServiceInput, execServiceRequest.getParameters())) {
                        return ResponseEntity.ok().body(new ExecServiceResponse(null, 0, "Tham số đầu vào không đúng"));
                    } else {
                        return ResponseEntity.ok().body(APICustomLogin(execServiceRequest));
                    }
                } else {
                    return ResponseEntity.ok().body(new ExecServiceResponse(null, 409, "Không có quyền thực hiện"));
                }

            } else {
                //Map<String, Object> objService = serviceService.getServiceInfo(execServiceRequest.getServiceId());
                boolean bCheckGrant = false;
                if (objService != null && objService.containsKey("IS_PUBLIC") && (Boolean) objService.get("IS_PUBLIC")) {
                    bCheckGrant = true;
                } else {
                    bCheckGrant = serviceService.checkAuthServiceInfo(objService.get("API_SERVICEID").toString(), SecurityUtils.getPrincipal().getUserId());
                }
                if (bCheckGrant) {
                    List<Map<String, Object>> objServiceInput = serviceService.getServiceInputInfo(execServiceRequest.getServiceId());
                    if (!checkParameterInput(objServiceInput, execServiceRequest.getParameters())) {
                        return ResponseEntity.ok().body(new ExecServiceResponse(null, 0, "Tham số đầu vào không đúng"));
                    } else {
                        Map<String, Object> dataServiceResult = serviceService.execService(objService, buildParameterLogin(objServiceInput, execServiceRequest.getParameters()));
                        if ((Integer) dataServiceResult.get("Status") == 1) {
                            return ResponseEntity.ok().body(new ExecServiceResponse(dataServiceResult.get("data"), 1, "Xử lý thành công"));
                        } else {
                            return ResponseEntity.ok().body(new ExecServiceResponse(dataServiceResult.get("data"), 0, dataServiceResult.get("Message").toString()));
                        }
                    }
                } else {
                    return ResponseEntity.ok().body(new ExecServiceResponse(null, 409, "Không có quyền thực hiện"));
                }
            }
        } catch (Exception e) {
            return ResponseEntity.ok().body(new ExecServiceResponse(null, 0, "Xảy ra lỗi hệ thống"));
        }
    }

    MapSqlParameterSource buildParameterLogin(List<Map<String, Object>> configParameter, List<Api_Service_Input> userParameter
    ) {
        MapSqlParameterSource parametersResult = new MapSqlParameterSource();
        String userId = SecurityUtils.getPrincipal().getUserId();
        String orgId = SecurityUtils.getPrincipal().getORGID();
        for (Map<String, Object> obj : configParameter) {
            if (obj.containsKey("DEFAULT_VALUE_SYSTEM") && (Boolean) obj.get("DEFAULT_VALUE_SYSTEM")) {
                switch (obj.get("DEFAULT_VALUE_NAME").toString()) {
                    case "USERID":
                        parametersResult.addValue(obj.get("API_SERVICE_INPUTNAME").toString(), userId);
                        break;
                    case "ORGID":
                        parametersResult.addValue(obj.get("API_SERVICE_INPUTNAME").toString(), orgId);
                        break;
                }
            } else {
                for (Api_Service_Input userObj : userParameter) {
                    if (obj.get("API_SERVICE_INPUTNAME").equals(userObj.getName())) {
                        switch (obj.get("API_SERVICE_INPUT_TYPEID").toString()) {
                            case "STR_PASS":
                                parametersResult.addValue(obj.get("API_SERVICE_INPUTNAME").toString(), userObj.getValue() != null ? passwordEncoder.encode(userObj.getValue().toString()) : "");
                                break;
                            case "JSON_STR":
                                try {
                                parametersResult.addValue(obj.get("API_SERVICE_INPUTNAME").toString(), new ObjectMapper().writeValueAsString(userObj.getValue()));
                            } catch (Exception e) {

                            }
                            break;
                            default:
                                parametersResult.addValue(obj.get("API_SERVICE_INPUTNAME").toString(), userObj.getValue());
                                break;
                        }

                    }
                }

            }
        }
        return parametersResult;
    }

    MapSqlParameterSource buildParameterNoLogin(List<Map<String, Object>> configParameter, List<Api_Service_Input> userParameter
    ) {
        MapSqlParameterSource parametersResult = new MapSqlParameterSource();
        for (Map<String, Object> obj : configParameter) {
            if (obj.containsKey("DEFAULT_VALUE_SYSTEM") && (Boolean) obj.get("DEFAULT_VALUE_SYSTEM")) {
                switch (obj.get("DEFAULT_VALUE_NAME").toString()) {
                    case "USERID":
                        parametersResult.addValue("USERID", null);
                        break;
                }
            } else {
                for (Api_Service_Input userObj : userParameter) {
                    if (obj.get("API_SERVICE_INPUTNAME").equals(userObj.getName())) {
                        switch (obj.get("API_SERVICE_INPUT_TYPEID").toString()) {
                            case "STR_PASS":
                                parametersResult.addValue(obj.get("API_SERVICE_INPUTNAME").toString(), userObj.getValue() != null ? passwordEncoder.encode(userObj.getValue().toString()) : "");
                                break;
                            case "JSON_STR":
                                try {
                                parametersResult.addValue(obj.get("API_SERVICE_INPUTNAME").toString(), new ObjectMapper().writeValueAsString(userObj.getValue()));
                            } catch (Exception e) {

                            }
                            break;
                            default:
                                parametersResult.addValue(obj.get("API_SERVICE_INPUTNAME").toString(), userObj.getValue());
                                break;
                        }

                    }
                }

            }
        }
        return parametersResult;
    }

    Map<String, String> getLstParamSystem() {
        Map<String, String> mResult = new HashMap<String, String>();
        mResult.put("USERID", "Mã người dùng đăng nhập service");
        mResult.put("ORGID", "Mã đơn vị đăng nhập service");
        return mResult;
    }

    Boolean checkParameterInput(List<Map<String, Object>> configParameter, List<Api_Service_Input> userParameter
    ) {
        Boolean bCheck = false;
        try {
            for (Map<String, Object> obj : configParameter) {
                if (obj.containsKey("DEFAULT_VALUE_SYSTEM") && (Boolean) obj.get("DEFAULT_VALUE_SYSTEM")) {
                    if (obj.containsKey("DEFAULT_VALUE_NAME") && getLstParamSystem().containsKey(obj.get("DEFAULT_VALUE_NAME"))) {

                    } else {
                        return false;
                    }
                } else {
                    bCheck = false;
                    for (Api_Service_Input userObj : userParameter) {
                        if (obj.get("API_SERVICE_INPUTNAME").equals(userObj.getName())) {
                            bCheck = true;
                            break;
                        }
                    }
                    if (!bCheck) {
                        return false;
                    }

                }
            }
        } catch (Exception e) {
            return false;
        }

        return true;
    }

}
