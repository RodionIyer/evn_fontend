package com.evnit.ttpm.khcn.models.detai;

import com.evnit.ttpm.khcn.models.kehoach.FileReq;
import lombok.Data;

import java.util.List;

@Data
public class Folder {
    public String maFolder;
    public String fileName;
    List<FileReq> listFile;
    public Integer sapXep;
    public Boolean dangKy;
    public Boolean raSoatDangKy;
    public Boolean hoiDongXetDuyet;
    public Boolean ketQuaXetDuyet;
    public Boolean thucHienHopDong;
    public Boolean thucHienTamUng;
    public Boolean thucHienGiaHan;
    public Boolean nghiemThuHso;
    public Boolean nghiemThuBgiaoKetQua;
    public Boolean hoiDongNghiemThu;
    public Boolean ketQuaNghiemThu;
    public Boolean quyetToan;
    public Boolean trangThai;
    public String quyenCapNhat;
}
