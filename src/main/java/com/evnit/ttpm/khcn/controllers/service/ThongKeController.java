package com.evnit.ttpm.khcn.controllers.service;

import com.evnit.ttpm.khcn.models.detai.DanhSachChung;
import com.evnit.ttpm.khcn.models.kehoach.DanhSachMau;
import com.evnit.ttpm.khcn.models.kehoach.DonVi;
import com.evnit.ttpm.khcn.models.service.Api_Service_Input;
import com.evnit.ttpm.khcn.models.thongke.ListData;
import com.evnit.ttpm.khcn.models.thongke.ThongKeReq;
import com.evnit.ttpm.khcn.models.thongke.ThongKeResp;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuReq;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuResp;
import com.evnit.ttpm.khcn.payload.request.service.ExecServiceRequest;
import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;
import com.evnit.ttpm.khcn.security.services.SecurityUtils;
import com.evnit.ttpm.khcn.services.thongke.ThongKeService;
import com.evnit.ttpm.khcn.services.tracuu.TraCuuService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.Year;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ThongKeController {
    @Autowired
    ThongKeService thongKeService;
    @Autowired
    ExcelController excelController;

    public ExecServiceResponse ListDanhSach(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();

            String loaiTimKiem = "";
            String page = "";
            String pagezise = "";
            ThongKeReq thongKeReq = new ThongKeReq();
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("TIM_KIEM".equals(obj.getName())) {
                    Gson gsons = new GsonBuilder().serializeNulls().create();
                    thongKeReq = gsons.fromJson(obj.getValue().toString(), ThongKeReq.class);
                    //break;
                }  else if ("LOAI_TIM_KIEM".equals(obj.getName())) {
                    loaiTimKiem = obj.getValue().toString();
                    //break;
                }else if ("PAGE_NUM".equals(obj.getName())) {
                    page = obj.getValue().toString();
                    //break;
                } else if ("PAGE_ROW_NUM".equals(obj.getName())) {
                    pagezise = obj.getValue().toString();
                    //break;
                }
            }
            List<ThongKeResp> listObj = ListData(thongKeReq,loaiTimKiem,page,pagezise,userId,orgId,false);




            return new ExecServiceResponse(listObj, 1, "Danh sách thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public List<ThongKeResp> ListData(ThongKeReq thongKeReq,String loaiTimKiem,String page,String pagezise,String userId,String orgId,boolean export) throws Exception{
        List<ThongKeResp> listObj = new ArrayList<>();
        if(loaiTimKiem != null && loaiTimKiem.equals("DETAI")){
            if(thongKeReq.getLoaiThongKe() != null && thongKeReq.getLoaiThongKe().equals("KHOAHOC")){
                List<ListData> listDeTai = thongKeService.ListThongKeDeTaiKH(thongKeReq, page, pagezise,userId,orgId,export);
                List<DanhSachChung> listLinhVucNC = thongKeService.ListLinhVucNC();
                if(listLinhVucNC != null && listLinhVucNC.size() >0){
                    for(DanhSachChung item : listLinhVucNC){
                        ThongKeResp thongKe = new ThongKeResp();
                        List<ListData> listDeTaiKH = listDeTai.stream().filter(c -> c.getMaNghienCuu().equals(item.getId())).collect(Collectors.toList());
                        if(listDeTaiKH != null && listDeTaiKH.size() >0) {
                            thongKe.setTenLinhVuc(item.getName());
                            thongKe.setListData(listDeTaiKH);
                            listObj.add(thongKe);
                        }
                    }
                }
            }else if(thongKeReq.getLoaiThongKe() != null && thongKeReq.getLoaiThongKe().equals("CAPDETAI")){
                List<ListData> listDeTai = thongKeService.ListThongKeCapDo(thongKeReq, page, pagezise,userId,orgId,export);
                List<DanhSachChung> listCapDo= thongKeService.ListCapDeTai();
                if(listCapDo != null && listCapDo.size() >0){
                    for(DanhSachChung item : listCapDo){
                        ThongKeResp thongKe = new ThongKeResp();
                        List<ListData> listDeTaiKH = listDeTai.stream().filter(c -> c.getMaCapQuanLy().equals(item.getId())).collect(Collectors.toList());
                        if(listDeTaiKH != null && listDeTaiKH.size() >0) {
                            thongKe.setTenLinhVuc(item.getName());
                            thongKe.setListData(listDeTaiKH);
                            listObj.add(thongKe);
                        }
                    }
                }
            }else if(thongKeReq.getLoaiThongKe() != null && thongKeReq.getLoaiThongKe().equals("CAPDONVI")){
                List<ListData> listDeTai = thongKeService.ListThongKeDonVi(thongKeReq, page, pagezise,userId,orgId,export);
                List<DanhSachChung> listCapDonVi= thongKeService.ListCapDonVi();
                if(listCapDonVi != null && listCapDonVi.size() >0){
                    for(DanhSachChung item : listCapDonVi){
                        ThongKeResp thongKe = new ThongKeResp();
                        List<ListData> listDeTaiKH = listDeTai.stream().filter(c -> c.getMaDonViChuTri().equals(item.getId())).collect(Collectors.toList());
                        if(listDeTaiKH != null && listDeTaiKH.size() >0) {
                            thongKe.setTenLinhVuc(item.getName());
                            thongKe.setListData(listDeTaiKH);
                            listObj.add(thongKe);
                        }
                    }
                }
            }

        }else if(loaiTimKiem != null && loaiTimKiem.equals("SANGKIEN")){
            if(thongKeReq.getLoaiThongKe() != null && thongKeReq.getLoaiThongKe().equals("KHOAHOC")){
                List<ListData> listDeTai = thongKeService.ListThongKeSangKienKH(thongKeReq, page, pagezise,userId,orgId,export);
                List<DanhSachChung> listLinhVucNC = thongKeService.ListLinhVucNC();
                if(listLinhVucNC != null && listLinhVucNC.size() >0){
                    for(DanhSachChung item : listLinhVucNC){
                        ThongKeResp thongKe = new ThongKeResp();
                        List<ListData> listDeTaiKH = listDeTai.stream().filter(c -> c.getMaNghienCuu().equals(item.getId())).collect(Collectors.toList());
                        if(listDeTaiKH != null && listDeTaiKH.size() >0) {
                            thongKe.setTenLinhVuc(item.getName());
                            thongKe.setListData(listDeTaiKH);
                            listObj.add(thongKe);
                        }
                    }
                }
            }else if(thongKeReq.getLoaiThongKe() != null && thongKeReq.getLoaiThongKe().equals("CAPDETAI")){
                List<ListData> listDeTai = thongKeService.ListThongKeSangKienCapDo(thongKeReq, page, pagezise,userId,orgId,export);
                List<DanhSachChung> listCapDo= thongKeService.ListCapDeTai();
                if(listCapDo != null && listCapDo.size() >0){
                    for(DanhSachChung item : listCapDo){
                        ThongKeResp thongKe = new ThongKeResp();
                        List<ListData> listDeTaiKH = listDeTai.stream().filter(c -> c.getMaCapQuanLy().equals(item.getId())).collect(Collectors.toList());
                        if(listDeTaiKH != null && listDeTaiKH.size() >0) {
                            thongKe.setTenLinhVuc(item.getName());
                            thongKe.setListData(listDeTaiKH);
                            listObj.add(thongKe);
                        }
                    }
                }
            }else if(thongKeReq.getLoaiThongKe() != null && thongKeReq.getLoaiThongKe().equals("CAPDONVI")){
                List<ListData> listDeTai = thongKeService.ListThongKeSangKienCapDonVi(thongKeReq, page, pagezise,userId,orgId,export);
                List<DanhSachChung> listCapDonVi= thongKeService.ListCapDonVi();
                if(listCapDonVi != null && listCapDonVi.size() >0){
                    for(DanhSachChung item : listCapDonVi){
                        ThongKeResp thongKe = new ThongKeResp();
                        List<ListData> listDeTaiKH = listDeTai.stream().filter(c -> c.getMaDonViChuTri().equals(item.getId())).collect(Collectors.toList());
                        if(listDeTaiKH != null && listDeTaiKH.size() >0) {
                            thongKe.setTenLinhVuc(item.getName());
                            thongKe.setListData(listDeTaiKH);
                            listObj.add(thongKe);
                        }
                    }
                }
            }
        }
        return listObj;
    }


    public ExecServiceResponse Export(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();

            String loaiTimKiem = "";
            String page = "";
            String pagezise = "";
            ThongKeReq thongKeReq = new ThongKeReq();
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("TIM_KIEM".equals(obj.getName())) {
                    Gson gsons = new GsonBuilder().serializeNulls().create();
                    thongKeReq = gsons.fromJson(obj.getValue().toString(), ThongKeReq.class);
                    //break;
                }  else if ("LOAI_TIM_KIEM".equals(obj.getName())) {
                    loaiTimKiem = obj.getValue().toString();
                    //break;
                }
            }
            List<ThongKeResp> listObj = ListData(thongKeReq,loaiTimKiem,page,pagezise,userId,orgId,true);
            String tieuDe ="Báo cáo - Thống kê hoạt động sáng kiến";
            if(loaiTimKiem != null && loaiTimKiem.equals("DETAI")){
                tieuDe ="Báo cáo - Thống kê Đề tài/ nhiệm vụ";
            }else  if(loaiTimKiem != null && loaiTimKiem.equals("SANGKIEN")){
                tieuDe ="Báo cáo - Thống kê hoạt động sáng kiến";
            }
            ExecServiceResponse result =  excelController.exportThongKe(listObj,tieuDe,loaiTimKiem,thongKeReq.getLoaiThongKe());


            return result;

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }


}
