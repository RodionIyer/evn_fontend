package com.evnit.ttpm.khcn.models.kehoach;

import lombok.Data;

import java.util.Date;

@Data
public class KeHoachChiTietReq {
    public String maDonVi;
    public String maKeHoachChiTiet;
    public String maKeHoach;
    public String maNhom;
    public String noiDungDangKy;
    public String nguonKinhPhi;
    public String duToan;
    public String donViChuTri;
    public String chuNhiemNhiemVu;
    public String noiDungHoatDong;
    public String thoiGianDuKien;
    public String yKienNguoiPheDuyet;
    public String nguoiThucHien;
    public String nguoiTao;
    public Date ngayTao;
    public String nguoiSua;
    public String capTao;
}
