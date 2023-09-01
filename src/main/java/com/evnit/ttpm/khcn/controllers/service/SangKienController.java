package com.evnit.ttpm.khcn.controllers.service;

import com.evnit.ttpm.khcn.models.detai.*;
import com.evnit.ttpm.khcn.models.kehoach.FileReq;
import com.evnit.ttpm.khcn.models.kehoach.FileUpload;
import com.evnit.ttpm.khcn.models.kehoach.LichSuKeHoach;
import com.evnit.ttpm.khcn.models.sangkien.SangKienReq;
import com.evnit.ttpm.khcn.models.sangkien.SangKienResp;
import com.evnit.ttpm.khcn.models.service.Api_Service_Input;
import com.evnit.ttpm.khcn.payload.request.service.ExecServiceRequest;
import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;
import com.evnit.ttpm.khcn.security.services.SecurityUtils;
import com.evnit.ttpm.khcn.services.detai.DeTaiService;
import com.evnit.ttpm.khcn.services.sangkien.SangKienService;
import com.evnit.ttpm.khcn.services.storage.FileService;
import com.evnit.ttpm.khcn.util.Util;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class SangKienController {
    @Autowired
    SangKienService sangKienService;
    @Autowired
    FileService fileService;

    @Transactional
    public ExecServiceResponse ThemSua(ExecServiceRequest execServiceRequest) {
        String msg = "Thêm mới thành công";
        String userId = SecurityUtils.getPrincipal().getUserId();
        String orgId = SecurityUtils.getPrincipal().getORGID();
        String token = "";
        try {
            SangKienReq sangKien = new SangKienReq();
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("SANG_KIEN".equals(obj.getName())) {
                    Gson gsons = new GsonBuilder().serializeNulls().create();
                    sangKien = gsons.fromJson(obj.getValue().toString(), SangKienReq.class);
//                    if (sangKien.getMaSangKien() != null) {
//                        detai.setMaKeHoach(detai.getKeHoach().getMaKeHoach());
//                    }
//                    detai.setNguoiTao(userId);
//                    detai.setNguoiSua(userId);
//                    detai.setNgayTao(new Date());
                    //break;
                } else if ("TOKEN_LINK".equals(obj.getName())) {
                    token = obj.getValue().toString();
                }
            }
            if (sangKien.getMethod() != null && sangKien.getMethod().equals("RASOAT")) {
                msg = RaSoat(sangKien, userId, orgId, token, msg);
            } else if (sangKien.getMethod() != null && sangKien.getMethod().equals("HOIDONGXD")) {
                msg = HOIDONGXD(sangKien, userId, orgId, token, msg);
            } else if (sangKien.getMethod() != null && sangKien.getMethod().equals("KETQUAXD")) {
                msg = KETQUAXD(sangKien, userId, orgId, token, msg);
            } else if (sangKien.getMethod() != null && sangKien.getMethod().equals("CHUNGNHANSK")) {
                msg = CHUNGNHANSK(sangKien, userId, orgId, token, msg);
            } else {
                msg = ThemAndSua(sangKien, userId, orgId, token, msg);
            }
            return new ExecServiceResponse(1, msg);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public String ThemAndSua(SangKienReq sangKien, String userId, String orgId, String token, String msg) throws Exception {
        UUID uuid = UUID.randomUUID();
        String maSangKien = uuid.toString().toUpperCase();
        if (sangKien != null && sangKien.getMaSangKien() != null && !sangKien.getMaSangKien().equals("")) {
            sangKien.setNguoiSua(userId);
            sangKien.setNguoiTao(userId);
            maSangKien = sangKien.getMaSangKien();
            sangKienService.updateSangKien(sangKien, maSangKien);
            msg = "Cập nhật thành công";
        } else {
            sangKien.setNguoiSua(userId);
            sangKien.setNguoiTao(userId);
            sangKienService.insertSangKien(sangKien, maSangKien);
            sangKienService.InsertSangKienLichSu(maSangKien, "", sangKien.getMaTrangThai(), "", userId);
        }
        sangKienService.InsertThanhVien(sangKien.getDanhSachThanhVien(), maSangKien, userId, userId);
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (sangKien != null && sangKien.getListFolderFile() != null && sangKien.getListFolderFile().size() > 0) {
            listFolder = sangKien.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : sangKien.getListFolderFile()) {
                if (item != null && item.getListFile() != null && item.getListFile().size() > 0) {
                    for (FileReq item2 : item.getListFile()) {
                        item2.setMaLoaiFile(item.getMaFolder());
                        if (Util.isNotEmpty(item2.getBase64())) {
                            SimpleDateFormat sdf = new SimpleDateFormat("ddMMYYYYhhmmss");
                            String dateString = sdf.format(new Date());
                            String path = "/khcn/" + orgId + "/" + userId + "/" + dateString;
                            FileUpload file = uploadFileToServer(path, item2.getFileName(), item2.getBase64(), token);
                            if (file != null) {
                                item2.setDuongDan(file.getPath());
                                item2.setBase64(null);
                                item2.setFileName(file.getName());
                                item2.setRowid(file.getRowId());
                                item2.setNguoiTao(userId);
                                item2.setNguoiSua(userId);
                                item2.setNgayTao(new Date());
                            }
                        }
                        listFile.add(item2);
                    }
                }
            }
        }
        sangKienService.InsertListFile(sangKien.getListFile(), maSangKien, userId, userId, listFolder);
        return msg;
    }

    public String RaSoat(SangKienReq sangKien, String userId, String orgId, String token, String msg) throws Exception {
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (sangKien != null && sangKien.getListFolderFile() != null && sangKien.getListFolderFile().size() > 0) {
            listFolder = sangKien.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : sangKien.getListFolderFile()) {
                if (item != null && item.getListFile() != null && item.getListFile().size() > 0) {
                    for (FileReq item2 : item.getListFile()) {
                        item2.setMaLoaiFile(item.getMaFolder());
                        if (Util.isNotEmpty(item2.getBase64())) {
                            SimpleDateFormat sdf = new SimpleDateFormat("ddMMYYYYhhmmss");
                            String dateString = sdf.format(new Date());
                            String path = "/khcn/" + orgId + "/" + userId + "/" + dateString;
                            FileUpload file = uploadFileToServer(path, item2.getFileName(), item2.getBase64(), token);
                            if (file != null) {
                                item2.setDuongDan(file.getPath());
                                item2.setBase64(null);
                                item2.setFileName(file.getName());
                                item2.setRowid(file.getRowId());
                                item2.setNguoiTao(userId);
                                item2.setNguoiSua(userId);
                                item2.setNgayTao(new Date());
                            }
                        }
                        listFile.add(item2);
                    }
                }
            }
        }
        sangKienService.InsertListFile(listFile, sangKien.getMaSangKien(), userId, userId, listFolder);

        SangKienResp sangKienResp = sangKienService.ChiTietSangKien(sangKien.getMaSangKien());

        sangKienService.updateTrangThai(sangKien.getMaSangKien(), sangKien.getMaTrangThai());
        if (sangKienResp != null && !sangKienResp.getMaTrangThai().equals(sangKien.getMaTrangThai())) {
            sangKienService.insertLichSu(sangKien.getMaSangKien(), sangKienResp.getMaTrangThai(), sangKien.getMaTrangThai(), sangKien.getNoiDungGuiMail(), userId);
        }
        if (sangKien.getIsEmail() != null && sangKien.getIsEmail() == true) {
            List<DanhSachChung> listTrangThai = sangKienService.ListDanhSachTrangThai();
            String tieude = "";
            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(sangKien.getMaTrangThai())).collect(Collectors.toList());
            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
                tieude = listTrangThaiTen.get(0).getName() + " " + sangKien.getTenGiaiPhap();
            }
            String nhomNguoiGui = sangKienService.GetMailNguoiThucHien(sangKien.getMaSangKien());
            if(Util.isNotEmpty(nhomNguoiGui)){
                sangKienService.insertSendMail(userId, nhomNguoiGui, sangKien.getNoiDungGuiMail(), "SANGKIEN", tieude);
            }
        }
        return msg;
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

    public String HOIDONGXD(SangKienReq sangKien, String userId, String orgId, String token, String msg) throws Exception {
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (sangKien != null && sangKien.getListFolderFile() != null && sangKien.getListFolderFile().size() > 0) {
            listFolder = sangKien.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : sangKien.getListFolderFile()) {
                if (item != null && item.getListFile() != null && item.getListFile().size() > 0) {
                    for (FileReq item2 : item.getListFile()) {
                        item2.setMaLoaiFile(item.getMaFolder());
                        if (Util.isNotEmpty(item2.getBase64())) {
                            SimpleDateFormat sdf = new SimpleDateFormat("ddMMYYYYhhmmss");
                            String dateString = sdf.format(new Date());
                            String path = "/khcn/" + orgId + "/" + userId + "/" + dateString;
                            FileUpload file = uploadFileToServer(path, item2.getFileName(), item2.getBase64(), token);
                            if (file != null) {
                                item2.setDuongDan(file.getPath());
                                item2.setBase64(null);
                                item2.setFileName(file.getName());
                                item2.setRowid(file.getRowId());
                                item2.setNguoiTao(userId);
                                item2.setNguoiSua(userId);
                                item2.setNgayTao(new Date());
                            }
                        }
                        listFile.add(item2);
                    }
                }
            }
        }
        List<DanhSachThanhVien> listThanhVien = new ArrayList<>();
        listThanhVien = sangKien.getDanhSachThanhVien();
        sangKienService.InsertThanhVien(listThanhVien, sangKien.getMaSangKien(), userId, userId);
        sangKienService.InsertListFile(listFile, sangKien.getMaSangKien(), userId, userId, listFolder);

        SangKienResp sangKienResp = sangKienService.ChiTietSangKien(sangKien.getMaSangKien());

        sangKienService.updateTrangThai(sangKien.getMaSangKien(), sangKien.getMaTrangThai());
        if (sangKienResp != null && !sangKienResp.getMaTrangThai().equals(sangKien.getMaTrangThai())) {
            sangKienService.insertLichSu(sangKien.getMaSangKien(), sangKienResp.getMaTrangThai(), sangKien.getMaTrangThai(), sangKien.getNoiDungGuiMail(), userId);
        }
        if (sangKien.getIsEmail() != null && sangKien.getIsEmail() == true) {
            List<DanhSachChung> listTrangThai = sangKienService.ListDanhSachTrangThai();
            String tieude = "";
            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(sangKien.getMaTrangThai())).collect(Collectors.toList());
            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
                tieude = listTrangThaiTen.get(0).getName() + " " + sangKien.getTenGiaiPhap();
            }
            String nhomNguoiGui = sangKienService.GetMailNguoiThucHien(sangKien.getMaSangKien());
            sangKienService.insertSendMail(userId, nhomNguoiGui, sangKien.getNoiDungGuiMail(), "SANGKIEN", tieude);
        }
        return msg;
    }

    public String KETQUAXD(SangKienReq sangKien, String userId, String orgId, String token, String msg) throws Exception {
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (sangKien != null && sangKien.getListFolderFile() != null && sangKien.getListFolderFile().size() > 0) {
            listFolder = sangKien.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : sangKien.getListFolderFile()) {
                if (item != null && item.getListFile() != null && item.getListFile().size() > 0) {
                    for (FileReq item2 : item.getListFile()) {
                        item2.setMaLoaiFile(item.getMaFolder());
                        if (Util.isNotEmpty(item2.getBase64())) {
                            SimpleDateFormat sdf = new SimpleDateFormat("ddMMYYYYhhmmss");
                            String dateString = sdf.format(new Date());
                            String path = "/khcn/" + orgId + "/" + userId + "/" + dateString;
                            FileUpload file = uploadFileToServer(path, item2.getFileName(), item2.getBase64(), token);
                            if (file != null) {
                                item2.setDuongDan(file.getPath());
                                item2.setBase64(null);
                                item2.setFileName(file.getName());
                                item2.setRowid(file.getRowId());
                                item2.setNguoiTao(userId);
                                item2.setNguoiSua(userId);
                                item2.setNgayTao(new Date());
                            }
                        }
                        listFile.add(item2);
                    }
                }
            }
        }
        sangKienService.InsertListFile(listFile, sangKien.getMaSangKien(), userId, userId, listFolder);

        SangKienResp sangKienResp = sangKienService.ChiTietSangKien(sangKien.getMaSangKien());

        sangKienService.updateTrangThai(sangKien.getMaSangKien(), sangKien.getMaTrangThai());
        if (sangKienResp != null && !sangKienResp.getMaTrangThai().equals(sangKien.getMaTrangThai())) {
            sangKienService.insertLichSu(sangKien.getMaSangKien(), sangKienResp.getMaTrangThai(), sangKien.getMaTrangThai(), sangKien.getNoiDungGuiMail(), userId);
        }
        if (sangKien.getIsEmail() != null && sangKien.getIsEmail() == true) {
            List<DanhSachChung> listTrangThai = sangKienService.ListDanhSachTrangThai();
            String tieude = "";
            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(sangKien.getMaTrangThai())).collect(Collectors.toList());
            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
                tieude = listTrangThaiTen.get(0).getName() + " " + sangKien.getTenGiaiPhap();
            }
            String nhomNguoiGui = sangKienService.GetMailNguoiThucHien(sangKien.getMaSangKien());
            sangKienService.insertSendMail(userId, nhomNguoiGui, sangKien.getNoiDungGuiMail(), "SANGKIEN", tieude);
        }
        return msg;
    }

    public String CHUNGNHANSK(SangKienReq sangKien, String userId, String orgId, String token, String msg) throws Exception {
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (sangKien != null && sangKien.getListFolderFile() != null && sangKien.getListFolderFile().size() > 0) {
            listFolder = sangKien.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : sangKien.getListFolderFile()) {
                if (item != null && item.getListFile() != null && item.getListFile().size() > 0) {
                    for (FileReq item2 : item.getListFile()) {
                        item2.setMaLoaiFile(item.getMaFolder());
                        if (Util.isNotEmpty(item2.getBase64())) {
                            SimpleDateFormat sdf = new SimpleDateFormat("ddMMYYYYhhmmss");
                            String dateString = sdf.format(new Date());
                            String path = "/khcn/" + orgId + "/" + userId + "/" + dateString;
                            FileUpload file = uploadFileToServer(path, item2.getFileName(), item2.getBase64(), token);
                            if (file != null) {
                                item2.setDuongDan(file.getPath());
                                item2.setBase64(null);
                                item2.setFileName(file.getName());
                                item2.setRowid(file.getRowId());
                                item2.setNguoiTao(userId);
                                item2.setNguoiSua(userId);
                                item2.setNgayTao(new Date());
                            }
                        }
                        listFile.add(item2);
                    }
                }
            }
        }
        sangKienService.InsertListFile(listFile, sangKien.getMaSangKien(), userId, userId, listFolder);

        SangKienResp sangKienResp = sangKienService.ChiTietSangKien(sangKien.getMaSangKien());

        sangKienService.updateTrangThai(sangKien.getMaSangKien(), sangKien.getMaTrangThai());
        if (sangKienResp != null && !sangKienResp.getMaTrangThai().equals(sangKien.getMaTrangThai())) {
            sangKienService.insertLichSu(sangKien.getMaSangKien(), sangKienResp.getMaTrangThai(), sangKien.getMaTrangThai(), sangKien.getNoiDungGuiMail(), userId);
        }
        if (sangKien.getIsEmail() != null && sangKien.getIsEmail() == true) {
            List<DanhSachChung> listTrangThai = sangKienService.ListDanhSachTrangThai();
            String tieude = "";
            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(sangKien.getMaTrangThai())).collect(Collectors.toList());
            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
                tieude = listTrangThaiTen.get(0).getName() + " " + sangKien.getTenGiaiPhap();
            }
            String nhomNguoiGui = sangKienService.GetMailNguoiThucHien(sangKien.getMaSangKien());
            sangKienService.insertSendMail(userId, nhomNguoiGui, sangKien.getNoiDungGuiMail(), "SANGKIEN", tieude);
        }
        return msg;
    }

    public ExecServiceResponse DanhSach(ExecServiceRequest execServiceRequest) {
        String msg = "Thêm mới thành công";
        String userId = SecurityUtils.getPrincipal().getUserId();
        String orgId = SecurityUtils.getPrincipal().getORGID();
        String page = "";
        String pagezise = "";
        try {
            SangKienReq sangKien = new SangKienReq();
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("PAGE_NUM".equals(obj.getName())) {
                    page = obj.getValue().toString();
                    //break;
                } else if ("PAGE_ROW_NUM".equals(obj.getName())) {
                    pagezise = obj.getValue().toString();
                    //break;
                }
            }
            List<SangKienResp> listSangKien = sangKienService.ListSangKien(userId, page, pagezise,orgId);
            List<SangKienResp> listSangKienNew = new ArrayList<>();
            if (listSangKien != null && listSangKien.size() > 0) {
                List<DanhSachChung> listCapDo = sangKienService.ListCapDo();
                List<DanhSachChung> listDonVi = sangKienService.ListDonVi();
                List<DanhSachChung> listtrangThai = sangKienService.ListDanhSachTrangThai();
                for (SangKienResp item : listSangKien) {
                    List<DanhSachChung> listCapDoNew = listCapDo.stream().filter(c -> c.getId().equals(item.getCapDoSangKien())).collect(Collectors.toList());
                    if (listCapDoNew != null && listCapDoNew.size() > 0) {
                        item.setTenCapDoSangKien(listCapDoNew.get(0).getName());
                    }
                    List<DanhSachChung> listDonViNew = listDonVi.stream().filter(c -> c.getId().equals(item.getDonViChuDauTu())).collect(Collectors.toList());
                    if (listDonViNew != null && listDonViNew.size() > 0) {
                        item.setTenDonViChuDauTu(listDonViNew.get(0).getName());
                    }
                    List<DanhSachChung> listtrangThaiNew = listCapDo.stream().filter(c -> c.getId().equals(item.getMaTrangThai())).collect(Collectors.toList());
                    if (listtrangThaiNew != null && listtrangThaiNew.size() > 0) {
                        item.setTenTrangThai(listtrangThaiNew.get(0).getName());
                    }
                    listSangKienNew.add(item);
                }
            }
            return new ExecServiceResponse(listSangKienNew, 1, msg);
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
                if ("MA_DETAI".equals(obj.getName())) {
                    maKeHoach = obj.getValue().toString();
                    //break;
                }
            }

            List<LichSuKeHoach> listLichSu = sangKienService.ListLichsu(maKeHoach);

            return new ExecServiceResponse(listLichSu, 1, "Chi tiết thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public ExecServiceResponse ChiTiet(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();

            String maSangKien = "";
            String method = "";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("MA_SANGKIEN".equals(obj.getName())) {
                    maSangKien = obj.getValue().toString();
                    //break;
                }
                if ("METHOD_BUTTON".equals(obj.getName())) {
                    method = obj.getValue().toString();
                    //break;
                }
            }
            SangKienResp obj = new SangKienResp();

            if (method != null && method.equals("HOIDONGXD")) {
                obj = chiTietHoiDong(maSangKien);
            } else if (method.equals("RASOAT")) {
                obj = chiTietRaSoat(maSangKien);
            } else if (method != null && method.equals("KETQUAXD")) {
                obj = chiTietKetQuaXD(maSangKien);
            } else if (method != null && method.equals("CHUNGNHANSK")) {
                obj = chiTietThuLao(maSangKien);
            } else if (method != null && method.equals("DETAIL")) {
                obj = chiTietAll(maSangKien);
            } else {
                obj = chiTietSua(maSangKien);
            }

            return new ExecServiceResponse(obj, 1, "Chi Tiết thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public SangKienResp chiTietThuLao(String maSangKien) throws Exception {
        SangKienResp obj = sangKienService.ChiTietSangKien(maSangKien);

        if (obj != null && obj.getMaSangKien() != null) {

            List<FileReq> listFile = sangKienService.ListFileByMa(maSangKien);

            List<Folder> listFolderFile = sangKienService.ListFolderFileThuLao();
            List<Folder> listFolderFileNew = new ArrayList<>();
            if (listFile != null && listFile.size() > 0) {
                for (Folder folder : listFolderFile) {
                    List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                    if (listFile2 != null && listFile2.size() > 0) {
                        folder.setListFile(listFile2);
                    }
                    listFolderFileNew.add(folder);
                }
            } else {
                listFolderFileNew = listFolderFile;
            }
            obj.setListFolderFile(listFolderFileNew);
        }

        return obj;
    }

    public SangKienResp chiTietKetQuaXD(String maSangKien) throws Exception {
        SangKienResp obj = sangKienService.ChiTietSangKien(maSangKien);

        if (obj != null && obj.getMaSangKien() != null) {

            List<FileReq> listFile = sangKienService.ListFileByMa(maSangKien);

            List<Folder> listFolderFile = sangKienService.ListFolderFileKetQuaXD();
            List<Folder> listFolderFileNew = new ArrayList<>();
            if (listFile != null && listFile.size() > 0) {
                for (Folder folder : listFolderFile) {
                    List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                    if (listFile2 != null && listFile2.size() > 0) {
                        folder.setListFile(listFile2);
                    }
                    listFolderFileNew.add(folder);
                }
            } else {
                listFolderFileNew = listFolderFile;
            }
            obj.setListFolderFile(listFolderFileNew);
        }

        return obj;
    }

    public SangKienResp chiTietRaSoat(String maSangKien) throws Exception {
        SangKienResp obj = sangKienService.ChiTietSangKien(maSangKien);

        if (obj != null && obj.getMaSangKien() != null) {

            List<FileReq> listFile = sangKienService.ListFileByMa(maSangKien);

            List<Folder> listFolderFile = sangKienService.ListFolderFileRaSoat();
            List<Folder> listFolderFileNew = new ArrayList<>();
            if (listFile != null && listFile.size() > 0) {
                for (Folder folder : listFolderFile) {
                    List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                    if (listFile2 != null && listFile2.size() > 0) {
                        folder.setListFile(listFile2);
                    }
                    listFolderFileNew.add(folder);
                }
            } else {
                listFolderFileNew = listFolderFile;
            }
            obj.setListFolderFile(listFolderFileNew);
        }

        return obj;
    }

    public SangKienResp chiTietHoiDong(String maSangKien) throws Exception {
        SangKienResp obj = sangKienService.ChiTietSangKien(maSangKien);

        if (obj != null && obj.getMaSangKien() != null) {

            List<FileReq> listFile = sangKienService.ListFileByMa(maSangKien);

            List<Folder> listFolderFile = sangKienService.ListFolderFileHDXD();
            List<Folder> listFolderFileNew = new ArrayList<>();
            if (listFile != null && listFile.size() > 0) {
                for (Folder folder : listFolderFile) {
                    List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                    if (listFile2 != null && listFile2.size() > 0) {
                        folder.setListFile(listFile2);
                    }
                    listFolderFileNew.add(folder);
                }
            } else {
                listFolderFileNew = listFolderFile;
            }
            obj.setListFolderFile(listFolderFileNew);

            List<DanhSachThanhVien> listThanhVien = sangKienService.ListNguoiThucHienByMa(maSangKien);
            obj.setDanhSachThanhVien(listThanhVien);
        }

        return obj;
//        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
//        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
//        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
//        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
//        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
//
//        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
//            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
//            listDeTai.setTenCapQuanLy("");
//            listDeTai.setChuNhiemDeTai("");
//            if(listCapdoNew != null && listCapdoNew.size() >0){
//                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
//            }
//            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));
//
//            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
//            List<String> listChucDanh = new ArrayList<>();
//            listChucDanh.add("CNHIEM");
//            listChucDanh.add("DCNHIEM");
//            listChucDanh.add("TKY");
//
//            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
//            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
//            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
//            if (listChuNhiem != null && listChuNhiem.size() > 0) {
//                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
//                if (userResp != null) {
//                    listDeTai.setChuNhiemDeTaiInfo(userResp);
//                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
//                }
//
//                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
//                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
//                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
//                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
//                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
//            }
//            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
//            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
//                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
//                if (userResp != null) {
//                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
//                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
//                }
//                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
//                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
//                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
//                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
//                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
//            }
//            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
//            if (listThuKy != null && listThuKy.size() > 0) {
//                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
//                if (userResp != null) {
//                    listDeTai.setThuKyDeTaiInfo(userResp);
//                    listDeTai.setThuKyDeTai(userResp.getUsername());
//                }
//                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
//                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
//                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
//                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
//                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
//            }
//
//            listDeTai.setDanhSachThanhVien(listThanhVien3);
//
//        }
//
//        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);
//
//        List<Folder> listFolderFile = deTaiService.ListFolderFileHOIDONG();
//        List<Folder> listFolderFileNew = new ArrayList<>();
//        if (listFile != null && listFile.size() > 0) {
//            for (Folder folder : listFolderFile) {
//                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
//                if (listFile2 != null && listFile2.size() > 0) {
//                    folder.setListFile(listFile2);
//                }
//                listFolderFileNew.add(folder);
//            }
//        }else{
//            listFolderFileNew = listFolderFile;
//        }
//        listDeTai.setListFolderFile(listFolderFileNew);


//        List<Folder> listFolderFileGiaoHD = deTaiService.ListFolderFileBanGiaoLuuTruKQ();
//        List<Folder> listFolderFileNewGiaoHD = new ArrayList<>();
//        if (listFile != null && listFile.size() > 0) {
//            for (Folder folder : listFolderFileGiaoHD) {
//                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
//                if (listFile2 != null && listFile2.size() > 0) {
//                    folder.setListFile(listFile2);
//                }
//                listFolderFileNewGiaoHD.add(folder);
//            }
//        }
//        listDeTai.setListFolderFileThucHien(listFolderFileNewGiaoHD);


        // return listDeTai;
    }

    public SangKienResp chiTietAll(String maSangKien) throws Exception {
        SangKienResp obj = sangKienService.ChiTietSangKien(maSangKien);

        if (obj != null && obj.getMaSangKien() != null) {
            List<DanhSachThanhVien> listThanhVien = sangKienService.ListNguoiThucHienByMa(maSangKien);
            obj.setDanhSachThanhVien(listThanhVien);

            List<FileReq> listFile = sangKienService.ListFileByMa(maSangKien);
            List<Folder> listFolderFile = sangKienService.ListFolderFile();
            List<Folder> listFolderFileNew = new ArrayList<>();
            if (listFile != null && listFile.size() > 0) {
                for (Folder folder : listFolderFile) {
                    List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                    if (listFile2 != null && listFile2.size() > 0) {
                        folder.setListFile(listFile2);
                    }
                    listFolderFileNew.add(folder);
                }
            }

            obj.setListFolderFile(listFolderFileNew);
        }
        return obj;
    }

    public SangKienResp chiTietSua(String maSangKien) throws Exception {
        SangKienResp obj = sangKienService.ChiTietSangKien(maSangKien);

        if (obj != null && obj.getMaSangKien() != null) {
            List<DanhSachThanhVien> listThanhVien = sangKienService.ListNguoiThucHienByMa(maSangKien);
            obj.setDanhSachThanhVien(listThanhVien);

            List<FileReq> listFile = sangKienService.ListFileByMa(maSangKien);
            List<Folder> listFolderFile = sangKienService.ListFolderFile();
            List<Folder> listFolderFileNew = new ArrayList<>();
            if (listFile != null && listFile.size() > 0) {
                for (Folder folder : listFolderFile) {
                    List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                    if (listFile2 != null && listFile2.size() > 0) {
                        folder.setListFile(listFile2);
                    }
                    listFolderFileNew.add(folder);
                }
            }

            obj.setListFolderFile(listFolderFileNew);
        }
        return obj;
    }
}
