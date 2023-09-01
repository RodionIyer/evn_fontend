package com.evnit.ttpm.khcn.models.detai;

import com.evnit.ttpm.khcn.models.BaseModel;
import com.evnit.ttpm.khcn.models.kehoach.FileReq;
import com.evnit.ttpm.khcn.models.kehoach.KeHoachResp;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class DeTaiResp extends BaseModel {
    public String maDeTai;
    public String tenDeTai;
    public String canCuThucHien;
    public String maKeHoach;
    public KeHoachResp keHoach;
    public List<String> linhVucNghienCuu;
    public String tenLinhVucNghienCuu;
    public String tenCapQuanLy;
    public String capQuanLy;
    public String vanBanChiDaoSo;
    public String tenDonViChuTri;
    public String donViChuTri;
    public Date thoiGianThucHienTu;
    public Date thoiGianThucHienDen;

    public UserResp chuNhiemDeTaiInfo;
    public String chuNhiemDeTai;
    public Integer gioiTinh;
    public String hocHam;
    public String hocVi;
    public String donViCongTac;
    public String soDienThoaiChuNhiemDeTai;

    public UserResp dongChuNhiemDeTaiInfo;
    public String dongChuNhiemDeTai;
    public Integer gioiTinhDongChuNhiem;
    public String hocHamDongChuNhiem;
    public String hocViDongChuNhiem;
    public String donViCongTacDongChuNhiem;
    public String soDienThoaiDongChuNhiemDeTai;
    public UserResp thuKyDeTaiInfo;
    public String thuKyDeTai;
    public Integer gioiTinhThuKy;
    public String hocHamThuKy;
    public String hocViThuKy;
    public String donViCongTacThuKy;
    public String soDienThoaiThuKy;
    public List<DanhSachThanhVien> danhSachThanhVien;
    public List<DanhSachThanhVien> danhSachThanhVienHD;
    public String tenNguonKinhPhi;
    public String nguonKinhPhi;
    public String tongKinhPhi;
    public String phuongThucKhoanChi;
    public String kinhPhiKhoan;
    public String kinhPhiKhongKhoan;
    public String tinhCapThietCuaDeTaiNhiemVu;
    public String mucTieu;
    public String nhiemVuVaPhamViNghienCuu;
    public String ketQuaDuKien;
    public String kienNghiDeXuat;
    public String soLanGiaHan;
    public List<Folder> listFolderFile;
    public List<Folder> listFolderFileThucHien;
    public List<Folder> listFolderFileTamUng;
    public List<FileReq> listFile;
    public List<Folder> listFolderFileHD;
    public List<Folder> listFolderAll;
//    public List<FileReq> listFile1;
//    public List<FileReq> listFile2;
//    public List<FileReq> listFile3;
//    public List<FileReq> listFile4;
//    public List<FileReq> listFile5;
    public List<FileReq> listFile6;
    public String ketLuanHoiDongXetDuyet;
    public String maKetQuaNhiemThu;
    public String ketQuaThucTeNghiemThu;
    public String tonTaiKhacPhucNghiemThu;
    public String diemNghiemThu;
    public String maTrangThai;
    public String tenTrangThai;
    public String nguoiTao;
    public Date ngayTao;
    public String nguoiSua;
    public List<TienDoThucHien> listTienDoCongViec;
}
