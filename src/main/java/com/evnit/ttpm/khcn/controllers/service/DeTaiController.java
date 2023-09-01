package com.evnit.ttpm.khcn.controllers.service;

import com.evnit.ttpm.khcn.models.detai.*;
import com.evnit.ttpm.khcn.models.kehoach.*;
import com.evnit.ttpm.khcn.models.service.Api_Service_Input;
import com.evnit.ttpm.khcn.models.thongke.ThongKeReq;
import com.evnit.ttpm.khcn.payload.request.service.ExecServiceRequest;
import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;
import com.evnit.ttpm.khcn.security.services.SecurityUtils;
import com.evnit.ttpm.khcn.services.detai.DeTaiService;
import com.evnit.ttpm.khcn.services.kehoach.KeHoachService;
import com.evnit.ttpm.khcn.services.storage.FileService;
import com.evnit.ttpm.khcn.util.Util;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Transient;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class DeTaiController {
    @Autowired
    DeTaiService deTaiService;
    @Autowired
    FileService fileService;
    @Autowired
    KeHoachService keHoachService;

    @Transactional
    public ExecServiceResponse ThemSua(ExecServiceRequest execServiceRequest) {
        String msg = "Thêm mới thành công";
        String userId = SecurityUtils.getPrincipal().getUserId();
        String orgId = SecurityUtils.getPrincipal().getORGID();
        String token = "";
        try {
            DeTaiReq detai = new DeTaiReq();
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("DE_TAI".equals(obj.getName())) {
                    Gson gsons = new GsonBuilder().serializeNulls().create();
                    String objectJson = obj.getValue().toString().replace("\"thuKyDeTaiInfo\":\"\"", "\"thuKyDeTaiInfo\":{}");
                    detai = gsons.fromJson(objectJson, DeTaiReq.class);
                    if (detai.getKeHoach() != null && detai.getKeHoach().getMaKeHoach() != null) {
                        detai.setMaKeHoach(detai.getKeHoach().getMaKeHoach());
                    }
                    detai.setNguoiTao(userId);
                    detai.setNguoiSua(userId);
                    detai.setNgayTao(new Date());
                    //break;
                } else if ("TOKEN_LINK".equals(obj.getName())) {
                    token = obj.getValue().toString();
                }
            }
            if (detai.getMethod() != null && detai.getMethod().equals("HDNGHIEMTHU")) {
                msg = HoiDongNghiemThu(detai, userId, orgId, token);
            } else
            if (detai.getMethod() != null && detai.getMethod().equals("GIAHAN")) {
                msg = GiaHan(detai, userId, orgId, token);
            } else
            if (detai.getMethod() != null && detai.getMethod().equals("THANHLAPHD")) {
                msg = ThanhLapHD(detai, userId, orgId, token);
            } else
            if (detai.getMethod() != null && detai.getMethod().equals("HOIDONG")) {
                msg = HoiDong(detai, userId, orgId, token);
            } else if (detai.getMethod() != null && detai.getMethod().equals("RASOAT")) {
                msg = RaSoat(detai, userId, orgId, token);
            } else if (detai.getMethod() != null && detai.getMethod().equals("CAPNHATHSTHUCHIEN")) {
                msg = CapNhatHSThucHien(detai, userId, orgId, token);
            } else if (detai.getMethod() != null && detai.getMethod().equals("BAOCAOTIENDO")) {
                msg = BaoCaoTienDo(detai, userId, orgId, token);
            } else if (detai.getMethod() != null && detai.getMethod().equals("HSNHIEMTHU")) {
                msg = HoSoNhiemThu(detai, userId, orgId, token);
            } else if (detai.getMethod() != null && detai.getMethod().equals("HSQTOAN")) {
                msg = HoSoQuyetToan(detai, userId, orgId, token);
            } else {
                msg = ThemAndSua(detai, userId, orgId, token, msg);
            }

            return new ExecServiceResponse(1, msg);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public String HoSoNhiemThu(DeTaiReq detai, String userId, String orgId, String token) throws Exception {
        String msg = "";
        List<FileReq> listFileThucHien = new ArrayList<>();
        List<String> listFolderThucHien = new ArrayList<>();
        if (detai != null && detai.getListFolderFileThucHien() != null && detai.getListFolderFileThucHien().size() > 0) {
            listFolderThucHien = detai.getListFolderFileThucHien().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFileThucHien()) {
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
                        listFileThucHien.add(item2);
                    }
                }
            }
        }
        deTaiService.insertFileDeTai(listFileThucHien, detai.getMaDeTai(), userId, userId, listFolderThucHien);
        List<FileReq> listFileTamUng = new ArrayList<>();
        List<String> listFolderTamUng = new ArrayList<>();
        if (detai != null && detai.getListFolderFileTamUng() != null && detai.getListFolderFileTamUng().size() > 0) {
            listFolderTamUng = detai.getListFolderFileTamUng().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFileTamUng()) {
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
                        listFileTamUng.add(item2);
                    }
                }
            }
        }

        deTaiService.insertFileDeTai(listFileTamUng, detai.getMaDeTai(), userId, userId, listFolderTamUng);
        DeTaiResp deTaiResp = deTaiService.ChiTietDeTai(detai.getMaDeTai());

        deTaiService.updateTrangThai(detai.getMaDeTai(), detai.getMaTrangThai());
        if (deTaiResp != null && !deTaiResp.getMaTrangThai().equals(detai.getMaTrangThai())) {
            deTaiService.insertLichSu(detai.getMaDeTai(), deTaiResp.getMaTrangThai(), detai.getMaTrangThai(), detai.getNoiDungGuiMail(),userId);
        }
        if (detai.getIsEmail() != null && detai.getIsEmail() == true) {
            List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
            String tieude = "";
            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(detai.getMaTrangThai())).collect(Collectors.toList());
            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
                tieude = listTrangThaiTen.get(0).getName() + " " + detai.getTenDeTai();
            }
            String nhomNguoiGui = deTaiService.GetMailNguoiThucHien(detai.getMaDeTai());
            deTaiService.insertSendMail(userId, nhomNguoiGui, detai.getNoiDungGuiMail(), "DETAI", tieude);
        }
        return msg;
    }
    public String GiaHan(DeTaiReq detai, String userId, String orgId, String token) throws Exception {
        String msg = "";
        deTaiService.insertGiaHan(detai,detai.getMaDeTai(),userId,userId);
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (detai != null && detai.getListFolderFile() != null && detai.getListFolderFile().size() > 0) {
            listFolder = detai.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFile()) {
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
        deTaiService.insertFileDeTai(listFile, detai.getMaDeTai(), userId, userId, listFolder);
        if (detai.getIsEmail() != null && detai.getIsEmail() == true) {
            List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
            String tieude = "";
            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(detai.getMaTrangThai())).collect(Collectors.toList());
            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
                tieude = listTrangThaiTen.get(0).getName() + " " + detai.getTenDeTai();
            }
            String nhomNguoiGui = deTaiService.GetMailNguoiThucHien(detai.getMaDeTai());
            deTaiService.insertSendMail(userId, nhomNguoiGui, detai.getYKien(), "DETAI", tieude);
        }
        return msg;
    }

    public String BaoCaoTienDo(DeTaiReq detai, String userId, String orgId, String token) throws Exception {
        String msg = "Thêm mới thành công";
        deTaiService.updateTrangThai(detai.getMaDeTai(), detai.getMaTrangThai());
        deTaiService.insertTienDo(detai.getMaDeTai(),detai,userId);
        DeTaiResp deTaiResp = deTaiService.ChiTietDeTai(detai.getMaDeTai());
        if (deTaiResp != null && !deTaiResp.getMaTrangThai().equals(detai.getMaTrangThai())) {
            deTaiService.insertLichSu(detai.getMaDeTai(), deTaiResp.getMaTrangThai(), detai.getMaTrangThai(), detai.getNoiDungGuiMail(),userId);
        }
        return msg;
    }
    public String ThanhLapHD(DeTaiReq detai, String userId, String orgId, String token) throws Exception {
        String msg = "";
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (detai != null && detai.getListFolderFile() != null && detai.getListFolderFile().size() > 0) {
            listFolder = detai.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFile()) {
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
        deTaiService.insertFileDeTai(listFile, detai.getMaDeTai(), userId, userId, listFolder);

        DeTaiResp deTaiResp = deTaiService.ChiTietDeTai(detai.getMaDeTai());

        deTaiService.updateTrangThai(detai.getMaDeTai(), detai.getMaTrangThai());
        if (deTaiResp != null && !deTaiResp.getMaTrangThai().equals(detai.getMaTrangThai())) {
            deTaiService.insertLichSu(detai.getMaDeTai(), deTaiResp.getMaTrangThai(), detai.getMaTrangThai(), detai.getNoiDungGuiMail(),userId);
        }
        deTaiService.insertNguoiThucHienHD(detai.getDanhSachThanhVien(), detai.getMaDeTai(), userId, userId);

//        if (detai.getIsEmail() != null && detai.getIsEmail() == true) {
//            List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
//            String tieude = "";
//            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(detai.getMaTrangThai())).collect(Collectors.toList());
//            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
//                tieude = listTrangThaiTen.get(0).getName() + " " + detai.getTenDeTai();
//            }
//            String nhomNguoiGui = deTaiService.GetMailNguoiThucHien(detai.getMaDeTai());
//            deTaiService.insertSendMail(userId, nhomNguoiGui, detai.getYKien(), "DETAI", tieude);
//        }
        return msg;
    }
    public String HoiDong(DeTaiReq detai, String userId, String orgId, String token) throws Exception {
        String msg = "Thêm mới thành công";
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (detai != null && detai.getListFolderFile() != null && detai.getListFolderFile().size() > 0) {
            listFolder = detai.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFile()) {
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
        deTaiService.insertFileDeTai(listFile, detai.getMaDeTai(), userId, userId, listFolder);

        DeTaiResp deTaiResp = deTaiService.ChiTietDeTai(detai.getMaDeTai());

        deTaiService.updateTrangThai(detai.getMaDeTai(), detai.getMaTrangThai());
        if (deTaiResp != null && !deTaiResp.getMaTrangThai().equals(detai.getMaTrangThai())) {
            deTaiService.insertLichSu(detai.getMaDeTai(), deTaiResp.getMaTrangThai(), detai.getMaTrangThai(), detai.getNoiDungGuiMail(),userId);
        }
        deTaiService.insertHoiDong(detai.getDanhSachThanhVienHD(), detai.getMaDeTai(), userId, userId);

//        if (detai.getIsEmail() != null && detai.getIsEmail() == true) {
//            List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
//            String tieude = "";
//            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(detai.getMaTrangThai())).collect(Collectors.toList());
//            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
//                tieude = listTrangThaiTen.get(0).getName() + " " + detai.getTenDeTai();
//            }
//            String nhomNguoiGui = deTaiService.GetMailNguoiThucHien(detai.getMaDeTai());
//            deTaiService.insertSendMail(userId, nhomNguoiGui, detai.getYKien(), "DETAI", tieude);
//        }
        return msg;
    }

    public String RaSoat(DeTaiReq detai, String userId, String orgId, String token) throws Exception {
        String msg = "";
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (detai != null && detai.getListFolderFile() != null && detai.getListFolderFile().size() > 0) {
            listFolder = detai.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFile()) {
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
        deTaiService.insertFileDeTai(listFile, detai.getMaDeTai(), userId, userId, listFolder);

        DeTaiResp deTaiResp = deTaiService.ChiTietDeTai(detai.getMaDeTai());

        deTaiService.updateTrangThai(detai.getMaDeTai(), detai.getMaTrangThai());
        if (deTaiResp != null && !deTaiResp.getMaTrangThai().equals(detai.getMaTrangThai())) {
            deTaiService.insertLichSu(detai.getMaDeTai(), deTaiResp.getMaTrangThai(), detai.getMaTrangThai(), detai.getNoiDungGuiMail(),userId);
        }
        if (detai.getIsEmail() != null && detai.getIsEmail() == true) {
            List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
            String tieude = "";
            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(detai.getMaTrangThai())).collect(Collectors.toList());
            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
                tieude = listTrangThaiTen.get(0).getName() + " " + detai.getTenDeTai();
            }
            String nhomNguoiGui = deTaiService.GetMailNguoiThucHien(detai.getMaDeTai());
            deTaiService.insertSendMail(userId, nhomNguoiGui, detai.getYKien(), "DETAI", tieude);
        }
        return msg;
    }


    public String HoiDongNghiemThu(DeTaiReq detai, String userId, String orgId, String token) throws Exception {
        String msg = "";
        List<FileReq> listFileThucHien = new ArrayList<>();
        List<String> listFolderThucHien = new ArrayList<>();
        if (detai != null && detai.getListFolderFileThucHien() != null && detai.getListFolderFileThucHien().size() > 0) {
            listFolderThucHien = detai.getListFolderFileThucHien().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFileThucHien()) {
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
                        listFileThucHien.add(item2);
                    }
                }
            }
        }
        deTaiService.insertFileDeTai(listFileThucHien, detai.getMaDeTai(), userId, userId, listFolderThucHien);
        List<FileReq> listFileTamUng = new ArrayList<>();
        List<String> listFolderTamUng = new ArrayList<>();
        if (detai != null && detai.getListFolderFileTamUng() != null && detai.getListFolderFileTamUng().size() > 0) {
            listFolderTamUng = detai.getListFolderFileTamUng().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFileTamUng()) {
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
                        listFileTamUng.add(item2);
                    }
                }
            }
        }

        deTaiService.insertFileDeTai(listFileTamUng, detai.getMaDeTai(), userId, userId, listFolderTamUng);
        DeTaiResp deTaiResp = deTaiService.ChiTietDeTai(detai.getMaDeTai());

        deTaiService.updateTrangThai(detai.getMaDeTai(), detai.getMaTrangThai());
        if (deTaiResp != null && !deTaiResp.getMaTrangThai().equals(detai.getMaTrangThai())) {
            deTaiService.insertLichSu(detai.getMaDeTai(), deTaiResp.getMaTrangThai(), detai.getMaTrangThai(), detai.getNoiDungGuiMail(),userId);
        }
//        if (detai.getIsEmail() != null && detai.getIsEmail() == true) {
//            List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
//            String tieude = "";
//            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(detai.getMaTrangThai())).collect(Collectors.toList());
//            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
//                tieude = listTrangThaiTen.get(0).getName() + " " + detai.getTenDeTai();
//            }
//            String nhomNguoiGui = deTaiService.GetMailNguoiThucHien(detai.getMaDeTai());
//            deTaiService.insertSendMail(userId, nhomNguoiGui, detai.getNoiDungGuiMail(), "DETAI", tieude);
//        }
        return msg;
    }

    public String HoSoQuyetToan(DeTaiReq detai, String userId, String orgId, String token) throws Exception {
        String msg = "";
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (detai != null && detai.getListFolderFile() != null && detai.getListFolderFile().size() > 0) {
            listFolder = detai.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFile()) {
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
        deTaiService.insertFileDeTai(listFile, detai.getMaDeTai(), userId, userId, listFolder);

        DeTaiResp deTaiResp = deTaiService.ChiTietDeTai(detai.getMaDeTai());

        deTaiService.updateTrangThai(detai.getMaDeTai(), detai.getMaTrangThai());
        if (deTaiResp != null && !deTaiResp.getMaTrangThai().equals(detai.getMaTrangThai())) {
            deTaiService.insertLichSu(detai.getMaDeTai(), deTaiResp.getMaTrangThai(), detai.getMaTrangThai(), detai.getNoiDungGuiMail(),userId);
        }
        if (detai.getIsEmail() != null && detai.getIsEmail() == true) {
            List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
            String tieude = "";
            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(detai.getMaTrangThai())).collect(Collectors.toList());
            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
                tieude = listTrangThaiTen.get(0).getName() + " " + detai.getTenDeTai();
            }
            String nhomNguoiGui = deTaiService.GetMailNguoiThucHien(detai.getMaDeTai());
            deTaiService.insertSendMail(userId, nhomNguoiGui, detai.getNoiDungGuiMail(), "DETAI", tieude);
        }
        return msg;
    }

    public String CapNhatHSThucHien(DeTaiReq detai, String userId, String orgId, String token) throws Exception {
        String msg = "";
        List<FileReq> listFileThucHien = new ArrayList<>();
        List<String> listFolderThucHien = new ArrayList<>();
        if (detai != null && detai.getListFolderFileThucHien() != null && detai.getListFolderFileThucHien().size() > 0) {
            listFolderThucHien = detai.getListFolderFileThucHien().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFileThucHien()) {
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
                        listFileThucHien.add(item2);
                    }
                }
            }
        }
        deTaiService.insertFileDeTai(listFileThucHien, detai.getMaDeTai(), userId, userId, listFolderThucHien);
        List<FileReq> listFileTamUng = new ArrayList<>();
        List<String> listFolderTamUng = new ArrayList<>();
        if (detai != null && detai.getListFolderFileTamUng() != null && detai.getListFolderFileTamUng().size() > 0) {
            listFolderTamUng = detai.getListFolderFileTamUng().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFileTamUng()) {
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
                        listFileTamUng.add(item2);
                    }
                }
            }
        }

        deTaiService.insertFileDeTai(listFileTamUng, detai.getMaDeTai(), userId, userId, listFolderTamUng);

        DeTaiResp deTaiResp = deTaiService.ChiTietDeTai(detai.getMaDeTai());

        deTaiService.updateTrangThai(detai.getMaDeTai(), detai.getMaTrangThai());
        if (deTaiResp != null && !deTaiResp.getMaTrangThai().equals(detai.getMaTrangThai())) {
            deTaiService.insertLichSu(detai.getMaDeTai(), deTaiResp.getMaTrangThai(), detai.getMaTrangThai(), detai.getNoiDungGuiMail(),userId);
        }
        if (detai.getIsEmail() != null && detai.getIsEmail() == true) {
            List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
            String tieude = "";
            List<DanhSachChung> listTrangThaiTen = listTrangThai.stream().filter(c -> c.getId().equals(detai.getMaTrangThai())).collect(Collectors.toList());
            if (listTrangThaiTen != null && listTrangThaiTen.size() > 0) {
                tieude = listTrangThaiTen.get(0).getName() + " " + detai.getTenDeTai();
            }
            String nhomNguoiGui = deTaiService.GetMailNguoiThucHien(detai.getMaDeTai());
            deTaiService.insertSendMail(userId, nhomNguoiGui, detai.getNoiDungGuiMail(), "DETAI", tieude);
        }
        return msg;
    }

    public String ThemAndSua(DeTaiReq detai, String userId, String orgId, String token, String msg) throws Exception {
        UUID uuid = UUID.randomUUID();
        String maDetai = uuid.toString().toUpperCase();
        detai.setNgayTao(new Date());
        if (detai != null && detai.getMaDeTai() != null && !detai.getMaDeTai().equals("")) {
            maDetai = detai.getMaDeTai();
            deTaiService.update(detai, maDetai);
            msg = "Cập nhật thành công";
        } else {
            deTaiService.insert(detai, maDetai);
            deTaiService.insertLichSu(maDetai,"",detai.getMaTrangThai(),detai.getNoiDungGuiMail(),userId);
        }
        List<DanhSachThanhVien> listThanhVien = new ArrayList();
        //chu nhiem
        if (Util.isNotEmpty(detai.getChuNhiemDeTai())) {
            DanhSachThanhVien thanhVien = new DanhSachThanhVien();
            if (detai.getChuNhiemDeTaiInfo() != null && detai.getChuNhiemDeTaiInfo().getUserId() != null) {
                thanhVien.setMaThanhVien(detai.getChuNhiemDeTaiInfo().getUserId());
                thanhVien.setNsId(detai.getChuNhiemDeTaiInfo().getNsId());
            }

            thanhVien.setTen(detai.getChuNhiemDeTai());
            thanhVien.setChucDanh("CNHIEM");
            thanhVien.setSoDienThoai(detai.getSoDienThoaiChuNhiemDeTai());
            thanhVien.setDonViCongTac(detai.getDonViCongTac());
            thanhVien.setStt(1);
            thanhVien.setMaHocHam(detai.getHocHam());
            thanhVien.setMaHocVi(detai.getHocVi());
            thanhVien.setGioiTinh(detai.getGioiTinh());
            thanhVien.setNguoiTao(userId);
            thanhVien.setNguoiSua(userId);
            //thanhVien
            listThanhVien.add(thanhVien);
        }
        //dong chu nhiem
        if (Util.isNotEmpty(detai.getDongChuNhiemDeTai())) {
            DanhSachThanhVien thanhVien = new DanhSachThanhVien();
            if (detai.getDongChuNhiemDeTaiInfo() != null && detai.getDongChuNhiemDeTaiInfo().getUserId() != null) {
                thanhVien.setMaThanhVien(detai.getDongChuNhiemDeTaiInfo().getUserId());
                thanhVien.setNsId(detai.getDongChuNhiemDeTaiInfo().getNsId());
            }

            thanhVien.setTen(detai.getDongChuNhiemDeTai());
            thanhVien.setChucDanh("DCNHIEM");
            thanhVien.setSoDienThoai(detai.getSoDienThoaiDongChuNhiemDeTai());
            thanhVien.setDonViCongTac(detai.getDonViCongTacDongChuNhiem());
            thanhVien.setStt(2);
            thanhVien.setMaHocHam(detai.getHocHamDongChuNhiem());
            thanhVien.setMaHocVi(detai.getHocViDongChuNhiem());
            thanhVien.setGioiTinh(detai.getGioiTinhDongChuNhiem());
            thanhVien.setNguoiTao(userId);
            thanhVien.setNguoiSua(userId);
            //thanhVien
            listThanhVien.add(thanhVien);
        }
        //thu ky
        if (Util.isNotEmpty(detai.getThuKyDeTai())) {
            DanhSachThanhVien thanhVien = new DanhSachThanhVien();
            if (detai.getThuKyDeTaiInfo() != null && detai.getThuKyDeTaiInfo().getUserId() != null) {
                thanhVien.setMaThanhVien(detai.getThuKyDeTaiInfo().getUserId());
                thanhVien.setNsId(detai.getThuKyDeTaiInfo().getNsId());
            }

            thanhVien.setTen(detai.getThuKyDeTai());
            thanhVien.setChucDanh("TKY");
            thanhVien.setSoDienThoai(detai.getSoDienThoaiThuKy());
            thanhVien.setDonViCongTac(detai.getDonViCongTacThuKy());
            thanhVien.setStt(3);
            thanhVien.setMaHocHam(detai.getHocHamThuKy());
            thanhVien.setMaHocVi(detai.getHocViThuKy());
            thanhVien.setGioiTinh(detai.getGioiTinhThuKy());
            thanhVien.setNguoiTao(userId);
            thanhVien.setNguoiSua(userId);
            //thanhVien
            listThanhVien.add(thanhVien);
        }
        if (detai != null && detai.getDanhSachThanhVien() != null && detai.getDanhSachThanhVien().size() > 0) {
            listThanhVien.addAll(detai.getDanhSachThanhVien());
        }
        List<FileReq> listFile = new ArrayList<>();
        List<String> listFolder = new ArrayList<>();
        if (detai != null && detai.getListFolderFile() != null && detai.getListFolderFile().size() > 0) {
            listFolder = detai.getListFolderFile().stream().map(Folder::getMaFolder).collect(Collectors.toList());
            for (Folder item : detai.getListFolderFile()) {
                if (item != null && item.getListFile() != null && item.getListFile().size() > 0) {
                    for (FileReq item2 : item.getListFile()) {
                        if (Util.isNotEmpty(item2.getBase64())) {
                            item2.setMaLoaiFile(item.getMaFolder());
                            SimpleDateFormat sdf = new SimpleDateFormat("ddMMYYYYhhmmss");
                            String dateString = sdf.format(new Date());
                            String path = "/khcn/" + orgId + "/" + userId + "/" + dateString;
                            FileUpload file = uploadFileToServer(path, item2.getFileName(), item2.getBase64(), token);
                            //UUID uuid2 = UUID.randomUUID();
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


        deTaiService.insertNguoiThucHien(listThanhVien, maDetai, userId, userId);
        deTaiService.insertFileDeTai(listFile, maDetai, userId, userId, listFolder);
        deTaiService.insertLinhVucNC(detai.getLinhVucNghienCuu(),maDetai,userId,userId);
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


    public ExecServiceResponse ListDanhSachDeTai(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();

            String tenDeTai = "";
            String page = "0";
            String pagezise = "20";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("TEN_DETAI".equals(obj.getName())) {
                    tenDeTai = obj.getValue().toString();
                    //break;
                } else if ("PAGE_NUM".equals(obj.getName())) {
                    page = obj.getValue().toString();
                    //break;
                } else if ("PAGE_ROW_NUM".equals(obj.getName())) {
                    pagezise = obj.getValue().toString();
                    //break;
                }
            }

            List<DeTaiResp> listDeTai = deTaiService.ListDeTai(tenDeTai, userId, page, pagezise,orgId);
            List<DeTaiResp> listDeTaiNew = new ArrayList<>();
            if (listDeTai != null && listDeTai.size() > 0) {
                List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
                List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
                List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
                for (DeTaiResp item : listDeTai) {
                    if (item.getCapQuanLy() != null && listCapdo != null && listCapdo.size() > 0) {
                        List<DanhSachChung> listCapDo2 = listCapdo.stream().filter(c -> c.getId().equals(item.getCapQuanLy())).collect(Collectors.toList());
                        if (listCapDo2 != null && listCapDo2.size() > 0) {
                            item.setTenCapQuanLy(listCapDo2.get(0).getName());
                        }
                    }
                    if (item.getDonViChuTri() != null && listDonViChuTri != null && listDonViChuTri.size() > 0) {
                        List<DanhSachChung> list = listDonViChuTri.stream().filter(c -> c.getId().equals(item.getDonViChuTri())).collect(Collectors.toList());
                        if (list != null && list.size() > 0) {
                            item.setTenDonViChuTri(list.get(0).getName());
                        }
                    }
                    if (item.getMaTrangThai() != null && listTrangThai != null && listTrangThai.size() > 0) {
                        List<DanhSachChung> list = listTrangThai.stream().filter(c -> c.getId().equals(item.getMaTrangThai())).collect(Collectors.toList());
                        if (list != null && list.size() > 0) {
                            item.setTenTrangThai(list.get(0).getName());
                        }
                    }
//                    List<DanhSachThanhVien>  listThanhVien =  deTaiService.ListNguoiThucHienByMaDeTai(item.getMaDeTai());
//                    item.setDanhSachThanhVien(listThanhVien);
//                    List<KeHoachChiTietReq> listChiTiet = keHoachService.ListChiTietbyMaKeHoach(item.getMaKeHoach());
//                    item.setListKeHoach(listChiTiet);
//
//                    List<FileReq> listFile = keHoachService.ListFilebyMaKeHoach(item.getMaKeHoach());
//                    item.setListFile(listFile);
                    listDeTaiNew.add(item);
                }
            }


            return new ExecServiceResponse(listDeTaiNew, 1, "Danh sách thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public ExecServiceResponse ListDanhSachDeTaiChung(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();

            String tenDeTai = "";
            String page = "0";
            String pagezise = "20";
            TimKiemReq timKiemReq = new TimKiemReq();
            String loaiTimKiem ="";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("LOAI_TIM_KIEM".equals(obj.getName())) {
                    loaiTimKiem = obj.getValue().toString();
                    //break;
                } else
                if ("TIM_KIEM".equals(obj.getName())) {
                    Gson gsons = new GsonBuilder().serializeNulls().create();
                    timKiemReq = gsons.fromJson(obj.getValue().toString(), TimKiemReq.class);
                    //break;
                } else if ("PAGE_NUM".equals(obj.getName())) {
                    page = obj.getValue().toString();
                    //break;
                } else if ("PAGE_ROW_NUM".equals(obj.getName())) {
                    pagezise = obj.getValue().toString();
                    //break;
                }
            }
            List<DeTaiResp> listDeTai = deTaiService.ListDeTaiChung(loaiTimKiem,timKiemReq, userId, page, pagezise,orgId);
            List<DeTaiResp> listDeTaiNew = new ArrayList<>();
            if (listDeTai != null && listDeTai.size() > 0) {
                List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
                List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
                List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
                for (DeTaiResp item : listDeTai) {
                    if (item.getCapQuanLy() != null && listCapdo != null && listCapdo.size() > 0) {
                        List<DanhSachChung> listCapDo2 = listCapdo.stream().filter(c -> c.getId().equals(item.getCapQuanLy())).collect(Collectors.toList());
                        if (listCapDo2 != null && listCapDo2.size() > 0) {
                            item.setTenCapQuanLy(listCapDo2.get(0).getName());
                        }
                    }
                    if (item.getDonViChuTri() != null && listDonViChuTri != null && listDonViChuTri.size() > 0) {
                        List<DanhSachChung> list = listDonViChuTri.stream().filter(c -> c.getId().equals(item.getDonViChuTri())).collect(Collectors.toList());
                        if (list != null && list.size() > 0) {
                            item.setTenDonViChuTri(list.get(0).getName());
                        }
                    }
                    if (item.getMaTrangThai() != null && listTrangThai != null && listTrangThai.size() > 0) {
                        List<DanhSachChung> list = listTrangThai.stream().filter(c -> c.getId().equals(item.getMaTrangThai())).collect(Collectors.toList());
                        if (list != null && list.size() > 0) {
                            item.setTenTrangThai(list.get(0).getName());
                        }
                    }
//                    List<DanhSachThanhVien>  listThanhVien =  deTaiService.ListNguoiThucHienByMaDeTai(item.getMaDeTai());
//                    item.setDanhSachThanhVien(listThanhVien);
//                    List<KeHoachChiTietReq> listChiTiet = keHoachService.ListChiTietbyMaKeHoach(item.getMaKeHoach());
//                    item.setListKeHoach(listChiTiet);
//
//                    List<FileReq> listFile = keHoachService.ListFilebyMaKeHoach(item.getMaKeHoach());
//                    item.setListFile(listFile);
                    listDeTaiNew.add(item);
                }
            }


            return new ExecServiceResponse(listDeTaiNew, 1, "Danh sách thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public ExecServiceResponse ChiTietDanhSachDeTai(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();

            String maDeTai = "";
            String method = "";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("MA_DE_TAI".equals(obj.getName())) {
                    maDeTai = obj.getValue().toString();
                    //break;
                }
                if ("METHOD_BUTTON".equals(obj.getName())) {
                    method = obj.getValue().toString();
                    //break;
                }
            }
            DeTaiResp listDeTai = new DeTaiResp();
            if(method != null && method.equals("GIAHAN")){
                listDeTai =chiTietGiaHan(maDeTai);
            }else
            if(method != null && method.equals("THANHLAPHD")){
                listDeTai =chiTietThanhLapHD(maDeTai);
            }else
            if(method != null && method.equals("HOIDONG")){
                listDeTai =chiTietHoiDong(maDeTai);
            } else if (method.equals("RASOAT")) {
                listDeTai =chiTietRaSoat(maDeTai);
            }else
            if(method != null && method.equals("HSQTOAN")){
                listDeTai =chiTietHoSoQuyetToan(maDeTai);
            }else
            if(method != null && method.equals("HSNHIEMTHU")){
                listDeTai =chiTietHoSoNhiemThu(maDeTai);
            }else
            if(method != null && method.equals("BAOCAOTIENDO")){
                listDeTai =chiTietBaoCaoTienDo(maDeTai);
            }else
            if(method != null && method.equals("CAPNHATHSTHUCHIEN")){
                listDeTai =chiTietCapNhatHSThucHien(maDeTai);
            }else  if(method != null && method.equals("DETAIL")){
                listDeTai =chiTietAll(maDeTai);
            }else{
                listDeTai =chiTietSua(maDeTai);
            }

            return new ExecServiceResponse(listDeTai, 1, "Chi Tiết thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }
    public DeTaiResp chiTietGiaHan(String maDeTai) throws Exception{
        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());

        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
            listDeTai.setTenCapQuanLy("");
            listDeTai.setChuNhiemDeTai("");
            if(listCapdoNew != null && listCapdoNew.size() >0){
                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
            }
            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));

            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
            List<String> listChucDanh = new ArrayList<>();
            listChucDanh.add("CNHIEM");
            listChucDanh.add("DCNHIEM");
            listChucDanh.add("TKY");

            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
            if (listChuNhiem != null && listChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setChuNhiemDeTaiInfo(userResp);
                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
                }

                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
            if (listThuKy != null && listThuKy.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setThuKyDeTaiInfo(userResp);
                    listDeTai.setThuKyDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
            }

            listDeTai.setDanhSachThanhVien(listThanhVien3);

        }

        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);

        List<Folder> listFolderFile = deTaiService.ListFolderFileGiaHan();
        List<Folder> listFolderFileNew = new ArrayList<>();
        if (listFile != null && listFile.size() > 0) {
            for (Folder folder : listFolderFile) {
                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                if (listFile2 != null && listFile2.size() > 0) {
                    folder.setListFile(listFile2);
                }
                listFolderFileNew.add(folder);
            }
        }else{
            listFolderFileNew = listFolderFile;
        }
        listDeTai.setListFolderFile(listFolderFileNew);


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


        return listDeTai;
    }
    public DeTaiResp chiTietThanhLapHD(String maDeTai) throws Exception{
        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());

        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
            listDeTai.setTenCapQuanLy("");
            listDeTai.setChuNhiemDeTai("");
            if(listCapdoNew != null && listCapdoNew.size() >0){
                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
            }
            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));

            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
            List<String> listChucDanh = new ArrayList<>();
            listChucDanh.add("CNHIEM");
            listChucDanh.add("DCNHIEM");
            listChucDanh.add("TKY");

            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
            if (listChuNhiem != null && listChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setChuNhiemDeTaiInfo(userResp);
                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
                }

                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
            if (listThuKy != null && listThuKy.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setThuKyDeTaiInfo(userResp);
                    listDeTai.setThuKyDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
            }

            listDeTai.setDanhSachThanhVien(listThanhVien3);

        }

        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);

        List<Folder> listFolderFile = deTaiService.ListFolderFileThanhLapHD();
        List<Folder> listFolderFileNew = new ArrayList<>();
        if (listFile != null && listFile.size() > 0) {
            for (Folder folder : listFolderFile) {
                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                if (listFile2 != null && listFile2.size() > 0) {
                    folder.setListFile(listFile2);
                }
                listFolderFileNew.add(folder);
            }
        }else{
            listFolderFileNew = listFolderFile;
        }
        listDeTai.setListFolderFile(listFolderFileNew);
        List<Folder> listFolderFileHD = deTaiService.ListFolderFileHOIDONG();
        List<Folder> listFolderFileHDNew = listFolderFileHD.stream().filter(c -> c.getMaFolder().equals("NGHIEM_THU_QDINHHOIDONG")).collect(Collectors.toList());
        List<Folder> listFolderFileTLHD = new ArrayList<>();
        if(listFolderFileHDNew != null && listFolderFileHDNew.size() >0){
            for(Folder folder : listFolderFileHDNew){
                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                if (listFile2 != null && listFile2.size() > 0) {
                    folder.setListFile(listFile2);
                }
                listFolderFileTLHD.add(folder);
            }
        }
        listDeTai.setListFolderFileHD(listFolderFileTLHD);
        return listDeTai;
    }
    public DeTaiResp chiTietHoiDong(String maDeTai) throws Exception{
        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());

        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
            listDeTai.setTenCapQuanLy("");
            listDeTai.setChuNhiemDeTai("");
            if(listCapdoNew != null && listCapdoNew.size() >0){
                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
            }
            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));

            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
            List<String> listChucDanh = new ArrayList<>();
            listChucDanh.add("CNHIEM");
            listChucDanh.add("DCNHIEM");
            listChucDanh.add("TKY");

            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
            if (listChuNhiem != null && listChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setChuNhiemDeTaiInfo(userResp);
                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
                }

                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
            if (listThuKy != null && listThuKy.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setThuKyDeTaiInfo(userResp);
                    listDeTai.setThuKyDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
            }

            listDeTai.setDanhSachThanhVien(listThanhVien3);

        }

        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);

        List<Folder> listFolderFile = deTaiService.ListFolderFileHOIDONG();
        List<Folder> listFolderFileNew = new ArrayList<>();
        if (listFile != null && listFile.size() > 0) {
            for (Folder folder : listFolderFile) {
                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                if (listFile2 != null && listFile2.size() > 0) {
                    folder.setListFile(listFile2);
                }
                listFolderFileNew.add(folder);
            }
        }else{
            listFolderFileNew = listFolderFile;
        }
        listDeTai.setListFolderFile(listFolderFileNew);
        List<DanhSachThanhVien> listHD = deTaiService.ListHDByMaDeTai(maDeTai);
        listDeTai.setDanhSachThanhVienHD(listHD);
        return listDeTai;
    }

    public DeTaiResp chiTietRaSoat(String maDeTai) throws Exception{
        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());

        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
            listDeTai.setTenCapQuanLy("");
            listDeTai.setChuNhiemDeTai("");
            if(listCapdoNew != null && listCapdoNew.size() >0){
                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
            }
            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));

            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
            List<String> listChucDanh = new ArrayList<>();
            listChucDanh.add("CNHIEM");
            listChucDanh.add("DCNHIEM");
            listChucDanh.add("TKY");

            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
            if (listChuNhiem != null && listChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setChuNhiemDeTaiInfo(userResp);
                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
                }

                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
            if (listThuKy != null && listThuKy.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setThuKyDeTaiInfo(userResp);
                    listDeTai.setThuKyDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
            }

            listDeTai.setDanhSachThanhVien(listThanhVien3);

        }

        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);

        List<Folder> listFolderFile = deTaiService.ListFolderFileRaSoat();
        List<Folder> listFolderFileNew = new ArrayList<>();
        if (listFile != null && listFile.size() > 0) {
            for (Folder folder : listFolderFile) {
                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                if (listFile2 != null && listFile2.size() > 0) {
                    folder.setListFile(listFile2);
                }
                listFolderFileNew.add(folder);
            }
        }else{
            listFolderFileNew = listFolderFile;
        }
        listDeTai.setListFolderFile(listFolderFileNew);


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


        return listDeTai;
    }

    public DeTaiResp chiTietHoSoQuyetToan(String maDeTai) throws Exception{
        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());

        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
            listDeTai.setTenCapQuanLy("");
            listDeTai.setChuNhiemDeTai("");
            if(listCapdoNew != null && listCapdoNew.size() >0){
                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
            }
            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));

            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
            List<String> listChucDanh = new ArrayList<>();
            listChucDanh.add("CNHIEM");
            listChucDanh.add("DCNHIEM");
            listChucDanh.add("TKY");

            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
            if (listChuNhiem != null && listChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setChuNhiemDeTaiInfo(userResp);
                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
                }

                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
            if (listThuKy != null && listThuKy.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setThuKyDeTaiInfo(userResp);
                    listDeTai.setThuKyDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
            }

            listDeTai.setDanhSachThanhVien(listThanhVien3);

        }

        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);

        List<Folder> listFolderFile = deTaiService.ListFolderFileHSQuyetToan();
        List<Folder> listFolderFileNew = new ArrayList<>();
        if (listFile != null && listFile.size() > 0) {
            for (Folder folder : listFolderFile) {
                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                if (listFile2 != null && listFile2.size() > 0) {
                    folder.setListFile(listFile2);
                }
                listFolderFileNew.add(folder);
            }
        }else{
            listFolderFileNew = listFolderFile;
        }
        listDeTai.setListFolderFile(listFolderFileNew);


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


        return listDeTai;
    }

    public DeTaiResp chiTietHoSoNhiemThu(String maDeTai) throws Exception{
        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());

        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
            listDeTai.setTenCapQuanLy("");
            listDeTai.setChuNhiemDeTai("");
            if(listCapdoNew != null && listCapdoNew.size() >0){
                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
            }
            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));

            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
            List<String> listChucDanh = new ArrayList<>();
            listChucDanh.add("CNHIEM");
            listChucDanh.add("DCNHIEM");
            listChucDanh.add("TKY");

            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
            if (listChuNhiem != null && listChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setChuNhiemDeTaiInfo(userResp);
                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
                }

                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
            if (listThuKy != null && listThuKy.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setThuKyDeTaiInfo(userResp);
                    listDeTai.setThuKyDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
            }

            listDeTai.setDanhSachThanhVien(listThanhVien3);

        }

        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);

        List<Folder> listFolderFileTamUng = deTaiService.ListFolderFileHSNT();
        List<Folder> listFolderFileNewTamUng = new ArrayList<>();
        if (listFile != null && listFile.size() > 0) {
            for (Folder folder : listFolderFileTamUng) {
                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                if (listFile2 != null && listFile2.size() > 0) {
                    folder.setListFile(listFile2);
                }
                listFolderFileNewTamUng.add(folder);
            }
        }else{
            listFolderFileNewTamUng = listFolderFileTamUng;
        }
        listDeTai.setListFolderFileTamUng(listFolderFileNewTamUng);


        List<Folder> listFolderFileGiaoHD = deTaiService.ListFolderFileBanGiaoLuuTruKQ();
        List<Folder> listFolderFileNewGiaoHD = new ArrayList<>();
        if (listFile != null && listFile.size() > 0) {
            for (Folder folder : listFolderFileGiaoHD) {
                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                if (listFile2 != null && listFile2.size() > 0) {
                    folder.setListFile(listFile2);
                }
                listFolderFileNewGiaoHD.add(folder);
            }
        }else{
            listFolderFileNewGiaoHD = listFolderFileGiaoHD;
        }
        listDeTai.setListFolderFileThucHien(listFolderFileNewGiaoHD);


        return listDeTai;
    }
    public DeTaiResp chiTietCapNhatHSThucHien(String maDeTai) throws Exception{
        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());

        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
            listDeTai.setTenCapQuanLy("");
            listDeTai.setChuNhiemDeTai("");
            if(listCapdoNew != null && listCapdoNew.size() >0){
                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
            }
            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));

            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
            List<String> listChucDanh = new ArrayList<>();
            listChucDanh.add("CNHIEM");
            listChucDanh.add("DCNHIEM");
            listChucDanh.add("TKY");

            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
            if (listChuNhiem != null && listChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setChuNhiemDeTaiInfo(userResp);
                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
                }

                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
            if (listThuKy != null && listThuKy.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setThuKyDeTaiInfo(userResp);
                    listDeTai.setThuKyDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
            }

            listDeTai.setDanhSachThanhVien(listThanhVien3);

        }

        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);

        List<Folder> listFolderFileTamUng = deTaiService.ListFolderFileTamUng();
        List<Folder> listFolderFileNewTamUng = new ArrayList<>();
        if (listFile != null && listFile.size() > 0) {
            for (Folder folder : listFolderFileTamUng) {
                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                if (listFile2 != null && listFile2.size() > 0) {
                    folder.setListFile(listFile2);
                }
                listFolderFileNewTamUng.add(folder);
            }
        }else{
            listFolderFileNewTamUng = listFolderFileTamUng;
        }
        listDeTai.setListFolderFileTamUng(listFolderFileNewTamUng);


        List<Folder> listFolderFileGiaoHD = deTaiService.ListFolderFileGiaoHD();
        List<Folder> listFolderFileNewGiaoHD = new ArrayList<>();
        if (listFile != null && listFile.size() > 0) {
            for (Folder folder : listFolderFileGiaoHD) {
                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
                if (listFile2 != null && listFile2.size() > 0) {
                    folder.setListFile(listFile2);
                }
                listFolderFileNewGiaoHD.add(folder);
            }
        }else{
            listFolderFileNewGiaoHD = listFolderFileGiaoHD;
        }
        listDeTai.setListFolderFileThucHien(listFolderFileNewGiaoHD);


        return listDeTai;
    }

    public DeTaiResp chiTietBaoCaoTienDo(String maDeTai) throws Exception{
        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
//        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
//        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());

        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
            listDeTai.setTenCapQuanLy("");
            listDeTai.setChuNhiemDeTai("");
            if(listCapdoNew != null && listCapdoNew.size() >0){
                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
            }
            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));

            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
            List<String> listChucDanh = new ArrayList<>();
            listChucDanh.add("CNHIEM");
            listChucDanh.add("DCNHIEM");
            listChucDanh.add("TKY");

            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
            if (listChuNhiem != null && listChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setChuNhiemDeTaiInfo(userResp);
                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
                }

                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
            if (listThuKy != null && listThuKy.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setThuKyDeTaiInfo(userResp);
                    listDeTai.setThuKyDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
            }

            listDeTai.setDanhSachThanhVien(listThanhVien3);

        }


//        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);
//
//        List<Folder> listFolderFileTamUng = deTaiService.ListFolderFileTamUng();
//        List<Folder> listFolderFileNewTamUng = new ArrayList<>();
//        if (listFile != null && listFile.size() > 0) {
//            for (Folder folder : listFolderFileTamUng) {
//                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
//                if (listFile2 != null && listFile2.size() > 0) {
//                    folder.setListFile(listFile2);
//                }
//                listFolderFileNewTamUng.add(folder);
//            }
//        }else{
//            listFolderFileNewTamUng = listFolderFileTamUng;
//        }
//        listDeTai.setListFolderFileTamUng(listFolderFileNewTamUng);
//
//
//        List<Folder> listFolderFileGiaoHD = deTaiService.ListFolderFileGiaoHD();
//        List<Folder> listFolderFileNewGiaoHD = new ArrayList<>();
//        if (listFile != null && listFile.size() > 0) {
//            for (Folder folder : listFolderFileGiaoHD) {
//                List<FileReq> listFile2 = listFile.stream().filter(c -> c.getMaLoaiFile().equals(folder.getMaFolder())).collect(Collectors.toList());
//                if (listFile2 != null && listFile2.size() > 0) {
//                    folder.setListFile(listFile2);
//                }
//                listFolderFileNewGiaoHD.add(folder);
//            }
//        }else{
//            listFolderFileNewGiaoHD = listFolderFileGiaoHD;
//        }
//        listDeTai.setListFolderFileThucHien(listFolderFileNewGiaoHD);


        return listDeTai;
    }

    public DeTaiResp chiTietAll(String maDeTai) throws Exception{
        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());

        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
            listDeTai.setTenCapQuanLy("");
            listDeTai.setChuNhiemDeTai("");
            if(listCapdoNew != null && listCapdoNew.size() >0){
                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
            }
            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));

            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
            List<String> listChucDanh = new ArrayList<>();
            listChucDanh.add("CNHIEM");
            listChucDanh.add("DCNHIEM");
            listChucDanh.add("TKY");

            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
            if (listChuNhiem != null && listChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setChuNhiemDeTaiInfo(userResp);
                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
                }

                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
            if (listThuKy != null && listThuKy.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setThuKyDeTaiInfo(userResp);
                    listDeTai.setThuKyDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
            }

            listDeTai.setDanhSachThanhVien(listThanhVien3);

        }

        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);
        List<Folder> listFolderFile = deTaiService.ListFolderFile();
        listDeTai.setListFolderAll(listFolderFile);
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
        listDeTai.setListFolderFile(listFolderFileNew);
        listDeTai.setListFile(listFile);
        listDeTai.setListFolderAll(deTaiService.ListFolderFileAll());

        String linhVucNghienCuu = deTaiService.ListLinhVucNghienCuu(maDeTai);
        listDeTai.setTenLinhVucNghienCuu(linhVucNghienCuu);
        listDeTai.setTenNguonKinhPhi(deTaiService.TenNguonKinhPhi(maDeTai));
        listDeTai.setListTienDoCongViec(deTaiService.ListTienDoThucHien(maDeTai));
        return listDeTai;
    }

    public DeTaiResp chiTietSua(String maDeTai) throws Exception{
        DeTaiResp listDeTai = deTaiService.ChiTietDeTai(maDeTai);
        List<DanhSachChung> listCapdo = deTaiService.ListDanhSachCapDo();
        List<DanhSachChung> listDonViChuTri = deTaiService.ListDanhSachDonViChuTri();
        List<DanhSachChung> listTrangThai = deTaiService.ListDanhSachTrangThai();
        List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());

        if (listDeTai != null && listDeTai.getMaDeTai() != null) {
            List<DanhSachChung> listCapdoNew = listCapdo.stream().filter(c -> c.getId().equals(listDeTai.getCapQuanLy())).collect(Collectors.toList());
            listDeTai.setTenCapQuanLy("");
            listDeTai.setChuNhiemDeTai("");
            if(listCapdoNew != null && listCapdoNew.size() >0){
                listDeTai.setTenCapQuanLy(listCapdoNew.get(0).getName());
            }
            //List<DanhSachThanhVien> listThanhVienNew = listThanhVien.stream().filter(c -> c.getMaThanhVien().equals("CNHIEM"));

            //List<DanhSachThanhVien> listThanhVien = deTaiService.ListNguoiThucHienByMaDeTai(listDeTai.getMaDeTai());
            List<String> listChucDanh = new ArrayList<>();
            listChucDanh.add("CNHIEM");
            listChucDanh.add("DCNHIEM");
            listChucDanh.add("TKY");

            //List<DanhSachThanhVien>  listThanhVien2 = listThanhVien.stream().filter(c -> listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listThanhVien3 = listThanhVien.stream().filter(c -> !listChucDanh.contains(c.getChucDanh())).collect(Collectors.toList());
            List<DanhSachThanhVien> listChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("CNHIEM")).collect(Collectors.toList());
            if (listChuNhiem != null && listChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setChuNhiemDeTaiInfo(userResp);
                    listDeTai.setChuNhiemDeTai(userResp.getUsername());
                }

                listDeTai.setSoDienThoaiChuNhiemDeTai(listChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTac(listChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHam(listChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocVi(listChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinh(listChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listDongChuNhiem = listThanhVien.stream().filter(c -> c.getChucDanh().equals("DCNHIEM")).collect(Collectors.toList());
            if (listDongChuNhiem != null && listDongChuNhiem.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listDongChuNhiem.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setDongChuNhiemDeTaiInfo(userResp);
                    listDeTai.setDongChuNhiemDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiDongChuNhiemDeTai(listDongChuNhiem.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacDongChuNhiem(listDongChuNhiem.get(0).getDonViCongTac());
                listDeTai.setHocHamDongChuNhiem(listDongChuNhiem.get(0).getMaHocHam());
                listDeTai.setHocViDongChuNhiem(listDongChuNhiem.get(0).getMaHocVi());
                listDeTai.setGioiTinhDongChuNhiem(listDongChuNhiem.get(0).getGioiTinh());
            }
            List<DanhSachThanhVien> listThuKy = listThanhVien.stream().filter(c -> c.getChucDanh().equals("TKY")).collect(Collectors.toList());
            if (listThuKy != null && listThuKy.size() > 0) {
                UserResp userResp = deTaiService.UserByUserId(listThuKy.get(0).getMaThanhVien());
                if (userResp != null) {
                    listDeTai.setThuKyDeTaiInfo(userResp);
                    listDeTai.setThuKyDeTai(userResp.getUsername());
                }
                listDeTai.setSoDienThoaiThuKy(listThuKy.get(0).getSoDienThoai());
                listDeTai.setDonViCongTacThuKy(listThuKy.get(0).getDonViCongTac());
                listDeTai.setHocHamThuKy(listThuKy.get(0).getMaHocHam());
                listDeTai.setHocViThuKy(listThuKy.get(0).getMaHocVi());
                listDeTai.setGioiTinhThuKy(listThuKy.get(0).getGioiTinh());
            }

            listDeTai.setDanhSachThanhVien(listThanhVien3);

        }

        List<FileReq> listFile = deTaiService.ListFileByMaDeTai(maDeTai);
        List<Folder> listFolderFile = deTaiService.ListFolderFile();
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

        listDeTai.setListFolderFile(listFolderFileNew);
        List<String> linhVucNC = deTaiService.ListLinhVucNghienCuuMa(maDeTai);
        listDeTai.setLinhVucNghienCuu(linhVucNC);
        if(Util.isNotEmpty(listDeTai.getMaKeHoach())){
            KeHoachResp keHoachResp = keHoachService.KeHoachByMa(listDeTai.getMaKeHoach());
            if(keHoachResp != null){
                listDeTai.setKeHoach(keHoachResp);
                listDeTai.setCanCuThucHien(keHoachResp.getName());
                //listDeTai.setMaKeHoach(keHoachResp.getMaKeHoach());
            }
        }
        List<DanhSachThanhVien> listHD = deTaiService.ListHDByMaDeTai(maDeTai);
        listDeTai.setDanhSachThanhVienHD(listHD);
        return listDeTai;
    }

    public ExecServiceResponse DanhSachKehoach(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();
            String tenKh = "";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("TEN_KE_HOACH".equals(obj.getName())) {
                    tenKh = obj.getValue().toString();
                    //break;
                }
            }
            List<KeHoachResp> listTenKh = deTaiService.ListKeHoachDeTai(tenKh);


            return new ExecServiceResponse(listTenKh, 1, "Danh Sách thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public ExecServiceResponse DanhSachUser(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();
            String ten = "";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("TEN_NGUOI_THUC_HIEN".equals(obj.getName())) {
                    ten = obj.getValue().toString();
                    //break;
                }
            }
            List<UserResp> listUser = deTaiService.ListUser(ten);


            return new ExecServiceResponse(listUser, 1, "Danh Sách thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public ExecServiceResponse DanhSachHoiDong(ExecServiceRequest execServiceRequest) {
        try {

            String orgId = SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();
            String ten = "";
            String maDonVi = "";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("TEN_NGUOI_THUC_HIEN".equals(obj.getName())) {
                    ten = obj.getValue().toString();
                    //break;
                }
                if ("MA_DON_VI".equals(obj.getName())) {
                    maDonVi = obj.getValue().toString();
                    //break;
                }
            }
            if(!Util.isNotEmpty(maDonVi)){
                maDonVi =orgId;
            }
            List<UserResp> listUser = deTaiService.ListHoiDong(ten,maDonVi);


            return new ExecServiceResponse(listUser, 1, "Danh Sách thành công.");

        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

    public ExecServiceResponse ListLichSu(ExecServiceRequest execServiceRequest) {
        try{

            String orgId= SecurityUtils.getPrincipal().getORGID();
            String userId = SecurityUtils.getPrincipal().getUserId();
            String maKeHoach="";
//            String nam="";
//            String page="";
//            String pagezise="";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                if ("MA_DETAI".equals(obj.getName())) {
                    maKeHoach = obj.getValue().toString();
                    //break;
                }
            }

            List<LichSuKeHoach> listLichSu =  deTaiService.ListLichsu(maKeHoach);

            return new ExecServiceResponse(listLichSu,1, "Chi tiết thành công.");

        }catch (Exception ex){
            System.out.println(ex.getMessage());
        }

        return new ExecServiceResponse(-1, "Thực hiện thất bại");
    }

}
