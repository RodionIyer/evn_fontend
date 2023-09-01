package com.evnit.ttpm.khcn.models.sangkien;

import com.evnit.ttpm.khcn.models.BaseModel;
import com.evnit.ttpm.khcn.models.detai.DanhSachThanhVien;
import com.evnit.ttpm.khcn.models.detai.Folder;
import com.evnit.ttpm.khcn.models.kehoach.FileReq;
import com.evnit.ttpm.khcn.models.kehoach.KeHoachChiTietReq;
import lombok.Data;

import java.util.List;

@Data
public class SangKienResp  extends BaseModel {
    public String maSangKien;
    public String method;
    public String nam;
    public String tenCapDoSangKien;
    public String capDoSangKien;
    public String tenDonViChuDauTu;
    public String donViChuDauTu;
    public String tenGiaiPhap;
    public List<String> linhVucNghienCuu;
    public List<DanhSachThanhVien> danhSachThanhVien;
    public Boolean thuTruongDonVi;
    public String uuNhuocDiem;
    public String noiDungGiaiPhap;
    public String ngayApDung;
    public String quaTrinhApDung;
    public String hieuQuaThucTe;
    public String tomTat;
    public String thamGiaToChuc;
    public String soTienLamLoi;
    public List<FileReq> listFile;
    public List<Folder> listFolderFile;
    public String ketQuaDanhGiaXetDuyet;
    public String kienNghiHoiDongXetDuyet;
    public String  thuLao;
    public String tenTrangThai;
    public String maTrangThai;
    public String nguoiTao;
    public String nguoiSua;
    public String noiDungGuiMail;
    public Boolean isEmail;
    public String diemHop;
    public String thoiGianHop;
    public String ketQuaPhieuDanhGia;
    public String thuLaoTacGia;
    public String thuLaoChoNguoiLanDau;
}
