package com.evnit.ttpm.khcn.models.detai;

import com.evnit.ttpm.khcn.models.kehoach.FileReq;
import com.evnit.ttpm.khcn.models.kehoach.KeHoachReq;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class DeTaiReq {

        public String method;
        public Integer thang;
        public Integer nam;
        public String lyDo;
        public String soLanGiaHan;
        public String lanGiaHanThu;
        public String noiDungGuiMail;
        public String noiDung;
        public String keHoachTiepTheo;
        public String dexuatKienNghi;
        public String maDeTai;
        public String tenDeTai;
        public String yKien;
        public String maKeHoach;
        public String canCuThucHien;
        public KeHoachReq keHoach;
        public List<String> linhVucNghienCuu;
        public String capQuanLy;
        public String vanBanChiDaoSo;
        public String donViChuTri;
        public Date thoiGianThucHienTu;
        public Date thoiGianThucHienDen;
        public Boolean isEmail;

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
        public List<Folder> listFolderFile;
        public List<Folder> listFolderFileThucHien;
        public List<Folder> listFolderFileTamUng;
       public List<FileReq> listFile;
//        public List<FileReq> listFile2;
//        public List<FileReq> listFile3;
//        public List<FileReq> listFile4;
//        public List<FileReq> listFile5;
//        public List<FileReq> listFile6;
        public String ketLuanHoiDongXetDuyet;
        public String maKetQuaNhiemThu;
        public String ketQuaThucTeNghiemThu;
        public String tonTaiKhacPhucNghiemThu;
        public String diemNghiemThu;
        public String maTrangThai;
        public String nguoiTao;
        public Date ngayTao;
        public String nguoiSua;
        public List<TienDoThucHien> TienDoThucHien;
}
