package com.evnit.ttpm.khcn.services.detai;

import com.evnit.ttpm.khcn.models.detai.*;
import com.evnit.ttpm.khcn.models.kehoach.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DeTaiService {
    int insert(DeTaiReq deTaiReq,String maDeTai) throws Exception;
    int insertLinhVucNC(List<String> linhVucNghienCuu,String maDeTai,String nguoiTao,String nguoiSua) throws Exception;
    int update(DeTaiReq deTaiReq,String maDeTai) throws Exception;
    List<DeTaiResp> ListDeTai(String tenDeTai, String userId, String page, String pageSize,String orgId) throws Exception;
    int insertHoiDong(List<DanhSachThanhVien> listDanhSachThanhVien, String maDeTai, String NguoiTao, String NguoiSua) throws Exception;
    int insertNguoiThucHien(List<DanhSachThanhVien> listDanhSachThanhVien, String maDeTai, String nguoiTao,String nguoiSua) throws Exception;
    List<DanhSachThanhVien> ListNguoiThucHienByMaDeTai(String maDeTai) throws Exception;
    DeTaiResp ChiTietDeTai(String maDeTai) throws Exception;
    List<KeHoachResp> ListKeHoachDeTai(String ten) throws Exception;
    List<UserResp> ListUser(String ten) throws Exception;
    int insertFileDeTai(List<FileReq> listFile, String maDeTai, String nguoiTao, String nguoiSua,List<String> folder) throws Exception;
    List<FileReq> ListFileByMaDeTai(String maDeTai) throws Exception;
    List<Folder> ListFolderFile() throws Exception;
    UserResp UserByUserId(String userId) throws Exception;
    List<DanhSachChung> ListDanhSachCapDo() throws Exception;
    List<DanhSachChung> ListDanhSachDonViChuTri() throws Exception;
    List<DanhSachChung> ListDanhSachTrangThai() throws Exception;
    int updateTrangThai(String maDeTai,String maTrangThai) throws Exception;
    int insertSendMail(String nguoiGui,String nhomNguoiNhan,String noiDung,String loai,String tieuDe) throws Exception;
    String GetMailNguoiThucHien(String maDeTai) throws Exception;
    int insertLichSu(String maDeTai,String maTrangThaiCu,String maTrangThaiMoi,String ghiChu,String nguoiTao) throws Exception;
    int insertNguoiThucHienHD(List<DanhSachThanhVien> listDanhSachThanhVien, String maDeTai, String nguoiTao, String nguoiSua) throws Exception;
    int insertGiaHan(DeTaiReq detai, String maDeTai, String nguoiTao, String nguoiSua) throws Exception;
    List<Folder> ListFolderFileGiaoHD() throws Exception;
    List<Folder> ListFolderFileTamUng() throws Exception;
    List<Folder> ListFolderFileHSNT() throws Exception;
    List<Folder> ListFolderFileBanGiaoLuuTruKQ() throws Exception;
    List<Folder> ListFolderFileHSQuyetToan() throws Exception;
    List<Folder> ListFolderFileHOIDONG() throws Exception;
    List<Folder> ListFolderFileThanhLapHD() throws Exception;
    List<Folder> ListFolderFileRaSoat() throws Exception;
    List<Folder> ListFolderFileGiaHan() throws Exception;
    int insertTienDo(String maDeTai,DeTaiReq detai,String nguoiTao) throws Exception;
    String ListLinhVucNghienCuu(String maDeTai) throws Exception;
    List<String> ListLinhVucNghienCuuMa(String maDeTai) throws Exception;
    String TenNguonKinhPhi(String maDeTai) throws Exception;
    List<TienDoThucHien> ListTienDoThucHien(String maDeTai) throws Exception;
    List<LichSuKeHoach> ListLichsu(String maDeTai) throws Exception;
    List<DanhSachThanhVien> ListHDByMaDeTai(String maDeTai) throws Exception;
    List<DeTaiResp> ListDeTaiChung(String loaiTimKiem, TimKiemReq timKiemReq, String nguoiTao, String page, String pageSize,String orgId) throws Exception;
    List<Folder> ListFolderFileAll() throws Exception;
    RoleResp CheckQuyen(String userId) throws Exception;
    List<UserResp> ListHoiDong(String ten,String capDonVi) throws Exception;
}
