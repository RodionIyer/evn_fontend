package com.evnit.ttpm.khcn.services.sangkien;

import com.evnit.ttpm.khcn.models.detai.*;
import com.evnit.ttpm.khcn.models.kehoach.*;
import com.evnit.ttpm.khcn.models.sangkien.SangKienReq;
import com.evnit.ttpm.khcn.models.sangkien.SangKienResp;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SangKienService {
    int insertSangKien(SangKienReq sangKienReq, String maSangKien) throws Exception;
    int updateSangKien(SangKienReq sangKienReq,String maSangKien) throws Exception;
    int InsertSangKienLichSu(String maSangKien,String trangThaiCu,String trangThaiMoi,String ghiChu,String nguoiTao) throws Exception;
    int InsertListFile(List<FileReq> listFile,String maSangKien,String nguoiTao, String nguoiSua, List<String> listFolder) throws Exception;
    int InsertThanhVien(List<DanhSachThanhVien> listThanhVien, String maSangKien,String nguoiTao,String nguoiSua) throws Exception;
    List<SangKienResp> ListSangKien(String nguoiTao, String page, String pageSize,String orgId) throws Exception;
    SangKienResp ChiTietSangKien(String maSangKien) throws Exception;
    int updateTrangThai(String maSangKien,String maTrangThai) throws Exception;
    int insertLichSu(String maSangKien,String maTrangThaiCu,String maTrangThaiMoi,String ghiChu,String nguoiTao) throws Exception;
    List<DanhSachChung> ListDanhSachTrangThai() throws Exception;
    String GetMailNguoiThucHien(String maSangKien) throws Exception;
    int insertSendMail(String nguoiGui,String nhomNguoiNhan,String noiDung,String loai,String tieuDe) throws Exception;
    int updateSangKienKetQua(SangKienReq sangKienReq,String maSangKien) throws Exception;
    List<LichSuKeHoach> ListLichsu(String maSangKien) throws Exception;
    List<DanhSachChung> ListCapDo() throws Exception;
    List<DanhSachChung> ListDonVi() throws Exception;
    List<FileReq> ListFileByMa(String maSangKien) throws Exception;
    List<Folder> ListFolderFileRaSoat() throws Exception;
    List<Folder> ListFolderFileHDXD() throws Exception;
    List<DanhSachThanhVien> ListNguoiThucHienByMa(String maSangKien) throws Exception;
    List<Folder> ListFolderFileKetQuaXD() throws Exception;
    List<Folder> ListFolderFileThuLao() throws Exception;
    List<Folder> ListFolderFile() throws Exception;
    RoleResp CheckQuyen(String userId) throws Exception;
}
