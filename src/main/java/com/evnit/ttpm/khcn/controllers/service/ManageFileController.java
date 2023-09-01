package com.evnit.ttpm.khcn.controllers.service;


import com.evnit.ttpm.khcn.models.kehoach.FileUpload;
import com.evnit.ttpm.khcn.models.service.Api_Service_Input;
import com.evnit.ttpm.khcn.payload.request.service.ExecServiceRequest;
import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;
import com.evnit.ttpm.khcn.security.services.SecurityUtils;
import com.evnit.ttpm.khcn.services.storage.FileService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.Iterator;

//import com.aspose.words.*;
@Component
public class ManageFileController {
    @Autowired
    FileService fileService;

    public ExecServiceResponse exec_2120F73B_854B_408E_B5AD_257E7F184922(ExecServiceRequest execServiceRequest) {


//        try{
//
//            Document doc = new Document("D:/Bieu mau dang ky ke hoach KHCN.html");
//            doc.save("D:/Output.docx");
//        }catch (Exception ex){}

        String fileName="";
        String orgId=SecurityUtils.getPrincipal().getORGID();
        String userId = SecurityUtils.getPrincipal().getUserId().replace("\\","/");
        String token = "";
        String fileUpload="";
        for (Api_Service_Input obj : execServiceRequest.getParameters()) {
            if ("FILE_UPLOAD".equals(obj.getName())) {
                fileUpload = obj.getValue().toString();
                //break;
            }else
            if ("FILE_NAME".equals(obj.getName())) {
                fileName = obj.getValue().toString();
                //break;
            }else
            if ("TOKEN_LINK".equals(obj.getName())) {
                token = obj.getValue().toString();
                //break;
            }
        }
        if(fileName==null || fileName.equals(""))
        {
            return new ExecServiceResponse(-1, "Tên file chưa được nhập");
        }else
        {
            try{
            SimpleDateFormat sdf=new SimpleDateFormat("ddMMYYYYhhmmss");
            String dateString=sdf.format(new Date());
            String path = "/khcn/"+orgId+"/"+userId+"/"+dateString+"/"+fileName;///khcn/<mã đơn vị>/<userid>/<20221201101013: ngày upload>/test.pdf
            byte[] decodedBytes = Base64.getDecoder().decode(fileUpload);
              //  String token=this.customService.generatingRandomAlphabeticString(50);
           Object obj =  fileService.callPostFile(fileName,path,decodedBytes,token);
           if(obj != null) {
               return new ExecServiceResponse(obj, 1, "Upload file thành công");
            }else
            {
                FileUpload objFix =new FileUpload();
                objFix.setId(37886);
                objFix.setKey("876f4aa21d5b29ee748bf297606d4be399b7b86fbe6983a527d1435617e25329");
                objFix.setName("2022-06-02-templatenhiemvu.xlsx");
                objFix.setMimeType("application/octet-stream");
                objFix.setSize(10262);
                objFix.setFile(true);
                objFix.setPath("/khcn/125/evnit/anhht/15072023092820/2022-06-02-templatenhiemvu.xlsx");
                objFix.setLevel(6);
                objFix.setRowId("f85c91e4-1b09-42b9-82cd-fb33c4dd72a7");
                objFix.setCreatedAt(new Date());
                return new ExecServiceResponse(objFix,-1, "Lỗi thực hiện");
            }
            }catch (Exception ex){
                FileUpload obj =new FileUpload();
                obj.setId(37886);
                obj.setKey("876f4aa21d5b29ee748bf297606d4be399b7b86fbe6983a527d1435617e25329");
                obj.setName("2022-06-02-templatenhiemvu.xlsx");
                obj.setMimeType("application/octet-stream");
                obj.setSize(10262);
                obj.setFile(true);
                obj.setPath("/khcn/125/evnit/anhht/15072023092820/2022-06-02-templatenhiemvu.xlsx");
                obj.setLevel(6);
                obj.setRowId("f85c91e4-1b09-42b9-82cd-fb33c4dd72a7");
                obj.setCreatedAt(new Date());
                return new ExecServiceResponse(obj,-1, "Lỗi convert file");
            }
        }
    }

    public ExecServiceResponse exec_2269B72D_1A44_4DBB_8699_AF9EE6878F89(ExecServiceRequest execServiceRequest) {

//        try{
//
//            Document doc = new Document("D:/Bieu mau dang ky ke hoach KHCN.html");
//            doc.save("D:/Output.docx");
//        }catch (Exception ex){
//            ex.getMessage();
//        }
        String fileName="";
        //String orgId=SecurityUtils.getPrincipal().getORGID();
        //String userId = SecurityUtils.getPrincipal().getUserId().replace("\\","/");
        String token = "";
        String duongdan="";
        for (Api_Service_Input obj : execServiceRequest.getParameters()) {
            if ("DUONG_DAN".equals(obj.getName())) {
                duongdan = obj.getValue().toString();
                //break;
            }else
            if ("TOKEN_LINK".equals(obj.getName())) {
                token = obj.getValue().toString();
                //break;
            }
        }
        if(duongdan==null || duongdan.equals(""))
        {
            return new ExecServiceResponse(-1, "Đường dẫn không tồn tại");
        }else
        {
            try{
                Object obj =  fileService.downloadFileBase64(duongdan,token);
                if(obj != null) {
                    return new ExecServiceResponse(obj, 1, "Upload file thành công");
                }else
                {
                    return new ExecServiceResponse(-1, "Lỗi thực hiện");
                }
            }catch (Exception ex){
                return new ExecServiceResponse(-1, "Lỗi convert file");
            }
        }
    }


}
