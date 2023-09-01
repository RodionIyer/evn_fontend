package com.evnit.ttpm.khcn.controllers.service;

import com.evnit.ttpm.khcn.models.detai.DanhSachChung;
import com.evnit.ttpm.khcn.models.detai.DeTaiReq;
import com.evnit.ttpm.khcn.models.kehoach.*;
import com.evnit.ttpm.khcn.models.service.Api_Service_Input;
import com.evnit.ttpm.khcn.payload.request.service.ExecServiceRequest;
import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;
import com.evnit.ttpm.khcn.security.services.SecurityUtils;
import com.evnit.ttpm.khcn.services.detai.DeTaiService;
import com.evnit.ttpm.khcn.services.kehoach.ExcelService;
import com.evnit.ttpm.khcn.services.kehoach.KeHoachService;
import com.evnit.ttpm.khcn.services.storage.FileService;
import com.evnit.ttpm.khcn.util.Util;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class KeHoachController {
    @Autowired
    KeHoachService keHoachService;
    @Autowired
    DeTaiService deTaiService;

    @Autowired
    FileService fileService;
    @Autowired
    ExcelService excelService;

    public ExecServiceResponse ThemSua(ExecServiceRequest execServiceRequest) {
        KeHoachReq kehoach = new KeHoachReq();
        String orgId = SecurityUtils.getPrincipal().getORGID();
        String userId = SecurityUtils.getPrincipal().getUserId();
        List<KeHoachChiTietReq> listChiTiet = new ArrayList<>();
        List<FileReq> listFile = new ArrayList<>();
        UUID uuid = UUID.randomUUID();
        String maKeHoach = uuid.toString().toUpperCase();
        String token = "";
        List<DonVi> listDonVi = excelService.getListDonVi(orgId);
        String capTao = "DONVI";
        if (listDonVi != null && listDonVi.size() > 0) {
            capTao = "TCT";
        }
        for (Api_Service_Input obj : execServiceRequest.getParameters()) {
            if ("KE_HOACH".equals(obj.getName())) {
                Gson gsons = new GsonBuilder().serializeNulls().create();
                kehoach = gsons.fromJson(obj.getValue().toString(), KeHoachReq.class);
                kehoach.setMaDonVi(orgId);
                kehoach.setNguoiTao(userId);
                kehoach.setNguoiSua(userId);
                kehoach.setCapTao(capTao);
                //break;
            } else if ("LIST_KE_HOACH_CHI_TIET".equals(obj.getName())) {
                Gson gsons = new GsonBuilder().serializeNulls().create();
                Type listType = new TypeToken<ArrayList<KeHoachChiTietReq>>() {
                }.getType();
                listChiTiet = gsons.fromJson(obj.getValue().toString(), listType);
                //break;
            } else if ("LIST_FILE".equals(obj.getName())) {
                Gson gsons = new GsonBuilder().serializeNulls().create();
                Type listType = new TypeToken<ArrayList<FileReq>>() {
                }.getType();
                listFile = gsons.fromJson(obj.getValue().toString(), listType);
            } else if ("TOKEN_LINK".equals(obj.getName())) {
                token = obj.getValue().toString();
            }
        }
        String msg = "Thêm mới thành công";
        try {


            if (kehoach != null && kehoach.getMaKeHoach() != null && !kehoach.getMaKeHoach().equals("")) {

                maKeHoach = kehoach.getMaKeHoach();
                // keHoachService.EmailSend(maKeHoach,kehoach.getYKienNguoiPheDuyet(),kehoach.getNam(),kehoach.getMaTrangThai(),kehoach.getNguoiTao());
                keHoachService.updateKeHoach(kehoach, maKeHoach);
                msg = "Cập nhật thành công";

            } else {
                keHoachService.insertKeHoach(kehoach, maKeHoach);
            }
            if (kehoach.getMaTrangThai().equals("DGIAO")) {
                List<KeHoachChiTietReq> listDeTai = keHoachService.ListChiTietbyMaKeHoach(kehoach.getMaKeHoach());
                if (listDeTai != null && listDeTai.size() > 0) {
                    List<DanhSachMau> listMau = keHoachService.ListMauByMaCha("NV_KHCN");
                    List<String> listMauNV = new ArrayList<>();
                    if (listMau != null && listMau.size() > 0) {
                        listMauNV = listMau.stream().map(DanhSachMau::getMA_NHOM).collect(Collectors.toList());
                    }
                    List<String> finalListMauNV = listMauNV;
                    List<KeHoachChiTietReq> listDeTaiNew = listDeTai.stream().filter(c -> finalListMauNV.contains(c.getMaNhom())).collect(Collectors.toList());
                    if (listDeTaiNew != null && listDeTaiNew.size() > 0) {
                        String nguoiTao =userId;
                        KeHoachResp keHoachResp = keHoachService.KeHoachByMa(kehoach.getMaKeHoach());
                        if(keHoachResp != null && keHoachResp.getNguoiTao() != null){
                            nguoiTao = keHoachResp.getNguoiTao();
                        }
                        for (KeHoachChiTietReq item : listDeTaiNew) {
                            DeTaiReq deTaiReq = new DeTaiReq();
                            UUID uuid2 = UUID.randomUUID();
                            String maDetai = uuid2.toString().toUpperCase();
                            deTaiReq.setTenDeTai(item.getNoiDungDangKy());
                            deTaiReq.setMaKeHoach(item.getMaKeHoach());
                            deTaiReq.setDonViChuTri(item.getMaDonVi());
                            deTaiReq.setNguoiTao(nguoiTao);
                            deTaiReq.setNgayTao(new Date());
                            deTaiReq.setNguoiSua(userId);
                            deTaiReq.setMaTrangThai("CHUA_GUI");
                            deTaiService.insert(deTaiReq, maDetai);
                        }
                    }
                }


            }
            if (kehoach != null && kehoach.getTongHop() != null && kehoach.getTongHop() == true) {
                List<String> listChi = listChiTiet.stream().map(KeHoachChiTietReq::getMaKeHoachChiTiet).collect(Collectors.toList());
                keHoachService.UpdateTongHop(listChi);
                kehoach.setTongHop(false);
            }
            // List<DonVi> listDonVi = excelService.getListDonVi(orgId);
            keHoachService.InsertKeHoachChiTiet(listChiTiet, maKeHoach, userId, orgId, capTao);
            List<FileReq> listFileNew = new ArrayList<>();
            keHoachService.DeleteFilebyMaKeHoach(maKeHoach);
            if (listFile != null && listFile.size() > 0) {

                for (FileReq item : listFile) {
                    if (Util.isNotEmpty(item.getBase64())) {
                        SimpleDateFormat sdf = new SimpleDateFormat("ddMMYYYYhhmmss");
                        String dateString = sdf.format(new Date());
                        String path = "/khcn/" + orgId + "/" + userId + "/" + dateString;
                        FileUpload file = uploadFileToServer(path, item.getFileName(), item.getBase64(), token);
                        //UUID uuid2 = UUID.randomUUID();
                        if (file != null) {
                            item.setDuongDan(file.getPath());
                            item.setBase64(null);
                            item.setFileName(file.getName());
                            item.setRowid(file.getRowId());
                            item.setNguoiTao(userId);
                            item.setNguoiSua(userId);
                            item.setNgayTao(new Date());
                        }
                    }
                    keHoachService.InsertFile(item, maKeHoach);
                }
            }

            KeHoachResp keHoachResp = keHoachService.KeHoachByMa(maKeHoach);
            if (keHoachResp != null && !keHoachResp.getMaTrangThai().equals(kehoach.getMaTrangThai())) {
                keHoachService.EmailSend(maKeHoach, kehoach.getYKienNguoiPheDuyet(), kehoach.getNam(), kehoach.getMaTrangThai(), kehoach.getNguoiTao());
            }
            return new ExecServiceResponse(1, msg);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public FileUpload uploadFileToServer(String pathFile, String fileName, String fileUpload, String token) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("ddMMYYYYhhmmss");
            String dateString = sdf.format(new Date());
            String path = pathFile + "/" + fileName;//"/khcn/"+orgId+"/"+userId+"/"+dateString+"/"+fileName;///khcn/<mã đơn vị>/<userid>/<20221201101013: ngày upload>/test.pdf
            byte[] decodedBytes = Base64.getDecoder().decode(fileUpload);
            //  String token=this.customService.generatingRandomAlphabeticString(50);
            Object obj = fileService.callPostFile(fileName, path, decodedBytes, token);

            if (obj != null) {
                Gson gsons = new GsonBuilder().serializeNulls().create();
                String objs = gsons.toJson(obj);
                FileUpload file = gsons.fromJson(objs, FileUpload.class);
                return file;
            }
//            else
//            {
//                FileUpload objFix =new FileUpload();
//                objFix.setId(37886);
//                objFix.setKey("876f4aa21d5b29ee748bf297606d4be399b7b86fbe6983a527d1435617e25329");
//                objFix.setName("2022-06-02-templatenhiemvu.xlsx");
//                objFix.setMimeType("application/octet-stream");
//                objFix.setSize(10262);
//                objFix.setFile(true);
//                objFix.setPath("/khcn/125/evnit/anhht/15072023092820/2022-06-02-templatenhiemvu.xlsx");
//                objFix.setLevel(6);
//                objFix.setRowId("f85c91e4-1b09-42b9-82cd-fb33c4dd72a7");
//                objFix.setCreatedAt(new Date());
//               // return new ExecServiceResponse(objFix,-1, "Lỗi thực hiện");
//            }
        } catch (Exception ex) {
//            FileUpload obj =new FileUpload();
//            obj.setId(37886);
//            obj.setKey("876f4aa21d5b29ee748bf297606d4be399b7b86fbe6983a527d1435617e25329");
//            obj.setName("2022-06-02-templatenhiemvu.xlsx");
//            obj.setMimeType("application/octet-stream");
//            obj.setSize(10262);
//            obj.setFile(true);
//            obj.setPath("/khcn/125/evnit/anhht/15072023092820/2022-06-02-templatenhiemvu.xlsx");
//            obj.setLevel(6);
//            obj.setRowId("f85c91e4-1b09-42b9-82cd-fb33c4dd72a7");
//            obj.setCreatedAt(new Date());
            // return new ExecServiceResponse(obj,-1, "Lỗi convert file");
        }
        return null;
    }

    public ExecServiceResponse ChiTietKeHoachNhieuMaKeHoach(ExecServiceRequest execServiceRequest) { //danh sach định hướng ma kế hoach
        String orgId = SecurityUtils.getPrincipal().getORGID();
        String maKeHoach = "";
        for (Api_Service_Input obj : execServiceRequest.getParameters()) {
            if ("MA_KE_HOACH".equals(obj.getName())) {
                maKeHoach = obj.getValue().toString();
                //break;
            }
        }
        List<String> listMaKh = new ArrayList<>();
        try {
            if (Util.isNotEmpty(maKeHoach)) {
                listMaKh = Arrays.asList(maKeHoach.split(","));
                List<KeHoachResp> listKeHoach = keHoachService.KeHoachByListMa(listMaKh);
                List<KeHoachResp> listKeHoachnew = new ArrayList<>();
                if (listKeHoach != null && listKeHoach.size() > 0) {
                    for (KeHoachResp item : listKeHoach) {

                        List<KeHoachChiTietReq> listChiTiet = keHoachService.ListChiTietbyMaKeHoach(item.getMaKeHoach());
                        item.setListKeHoach(listChiTiet);

                        List<FileReq> listFile = keHoachService.ListFilebyMaKeHoach(item.getMaKeHoach());
                        item.setListFile(listFile);
                        listKeHoachnew.add(item);
                    }
                }
                return new ExecServiceResponse(listKeHoachnew, 1, "Thành công.");
            } else {
                return new ExecServiceResponse(listMaKh, 1, "Thành công.");
            }
        } catch (Exception ex) {
            ex.getMessage();
        }

        return new ExecServiceResponse(-1, "Không thành công.");
    }

    public ExecServiceResponse ChiTiet(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();
            String maKeHoach = "";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("MA_KE_HOACH".equals(obj.getName())) {
                    maKeHoach = obj.getValue().toString();
                    //break;
                }
            }
            KeHoachResp keHoachResp = keHoachService.KeHoachByMa(maKeHoach);
            List<KeHoachChiTietReq> listChiTiet = keHoachService.ListChiTietbyMaKeHoach(maKeHoach);
            keHoachResp.setListKeHoach(listChiTiet);

            List<FileReq> listFile = keHoachService.ListFilebyMaKeHoach(maKeHoach);
            keHoachResp.setListFile(listFile);

            return new ExecServiceResponse(keHoachResp, 1, "Chi tiết thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public ExecServiceResponse ListDanhSachKeHoach(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();
            String maTrangThai = "";
            String nam = "";
            String page = "";
            String pagezise = "";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("MA_TRANG_THAI".equals(obj.getName())) {
                    maTrangThai = obj.getValue().toString();
                    //break;
                } else if ("NAM".equals(obj.getName())) {
                    nam = obj.getValue().toString();
                    //break;
                } else if ("PAGE_NUM".equals(obj.getName())) {
                    page = obj.getValue().toString();
                    //break;
                } else if ("PAGE_ROW_NUM".equals(obj.getName())) {
                    pagezise = obj.getValue().toString();
                    //break;
                }
            }
            List<KeHoachResp> listKeHoach = keHoachService.ListKeHoach(nam, maTrangThai, page, pagezise, orgId);
//            List<KeHoachResp> listKeHoachnew = new ArrayList<>();
//            if(listKeHoach != null && listKeHoach.size() >0){
//                for(KeHoachResp item : listKeHoach){
//
//                    List<KeHoachChiTietReq> listChiTiet = keHoachService.ListChiTietbyMaKeHoach(item.getMaKeHoach());
//                    item.setListKeHoach(listChiTiet);
//
//                    List<FileReq> listFile = keHoachService.ListFilebyMaKeHoach(item.getMaKeHoach());
//                    item.setListFile(listFile);
//                    listKeHoachnew.add(item);
//                }
//            }


            return new ExecServiceResponse(listKeHoach, 1, "Danh sách thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public ExecServiceResponse ListDanhSachKeHoachPheDuyet(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();
            String maTrangThai = "";
            List<String> nam = new ArrayList<>();
            String page = "";
            String pagezise = "";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("MA_TRANG_THAI".equals(obj.getName())) {
                    maTrangThai = obj.getValue().toString();
                    //break;
                } else if ("NAM_LIST".equals(obj.getName())) {
                    String namList = obj.getValue().toString();
                    if (Util.isNotEmpty(namList)) {
                        nam = Arrays.asList(namList.split(","));
                    }

                    //break;
                } else if ("PAGE_NUM".equals(obj.getName())) {
                    page = obj.getValue().toString();
                    //break;
                } else if ("PAGE_ROW_NUM".equals(obj.getName())) {
                    pagezise = obj.getValue().toString();
                    //break;
                }
            }
            List<KeHoachResp> listKeHoach = keHoachService.ListKeHoachPheDuyet(nam, maTrangThai, page, pagezise, orgId);
            List<KeHoachResp> listKeHoachnew = new ArrayList<>();
            if (listKeHoach != null && listKeHoach.size() > 0) {
                for (KeHoachResp item : listKeHoach) {

                    List<KeHoachChiTietReq> listChiTiet = keHoachService.ListChiTietbyMaKeHoach(item.getMaKeHoach());
                    item.setListKeHoach(listChiTiet);

                    List<FileReq> listFile = keHoachService.ListFilebyMaKeHoach(item.getMaKeHoach());
                    item.setListFile(listFile);
                    listKeHoachnew.add(item);
                }
            }


            return new ExecServiceResponse(listKeHoach, 1, "Chi tiết thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public ExecServiceResponse ListDanhSachKeHoachGiaoViec(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();
            String maTrangThai = "";
            String nam = "";
            String page = "";
            String pagezise = "";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("MA_TRANG_THAI".equals(obj.getName())) {
                    maTrangThai = obj.getValue().toString();
                    //break;
                } else if ("NAM".equals(obj.getName())) {
                    nam = obj.getValue().toString();
                    //break;
                } else if ("PAGE_NUM".equals(obj.getName())) {
                    page = obj.getValue().toString();
                    //break;
                } else if ("PAGE_ROW_NUM".equals(obj.getName())) {
                    pagezise = obj.getValue().toString();
                    //break;
                }
            }
            List<KeHoachResp> listKeHoach = keHoachService.ListKeHoachGiaoViec(nam, maTrangThai, page, pagezise, orgId);
            List<KeHoachResp> listKeHoachnew = new ArrayList<>();
            if (listKeHoach != null && listKeHoach.size() > 0) {
                for (KeHoachResp item : listKeHoach) {

                    List<KeHoachChiTietReq> listChiTiet = keHoachService.ListChiTietbyMaKeHoach(item.getMaKeHoach());
                    item.setListKeHoach(listChiTiet);

                    List<FileReq> listFile = keHoachService.ListFilebyMaKeHoach(item.getMaKeHoach());
                    item.setListFile(listFile);
                    listKeHoachnew.add(item);
                }
            }


            return new ExecServiceResponse(listKeHoach, 1, "Chi tiết thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public ExecServiceResponse ListLichSu(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();
            String maKeHoach = "";
//            String nam="";
//            String page="";
//            String pagezise="";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("MA_KE_HOACH".equals(obj.getName())) {
                    maKeHoach = obj.getValue().toString();
                    //break;
                }
            }
            //else
//                if ("NAM".equals(obj.getName())) {
//                    nam =  obj.getValue().toString();
//                    //break;
//                }else
//                if ("PAGE_NUM".equals(obj.getName())) {
//                    page =  obj.getValue().toString();
//                    //break;
//                }else
//                if ("PAGE_ROW_NUM".equals(obj.getName())) {
//                    pagezise =  obj.getValue().toString();
//                    //break;
//                }
//            }
            List<LichSuKeHoach> listLichSu = keHoachService.ListLichsuKeHoach(maKeHoach);

            return new ExecServiceResponse(listLichSu, 1, "Chi tiết thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

}
