package com.evnit.ttpm.khcn.services.kehoach;

import com.evnit.ttpm.khcn.models.detai.DeTaiResp;
import com.evnit.ttpm.khcn.models.kehoach.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface KeHoachService {
    int insertKeHoach(KeHoachReq keHoachReq,String maKeHoach)throws Exception;
    int updateKeHoach(KeHoachReq keHoachReq,String maKeHoach)throws Exception;
    int InsertListFile(List<FileReq> listFile,String maKeHoach)throws Exception;
    int InsertKeHoachChiTiet(List<KeHoachChiTietReq> listKeHoach,String maKeHoach,String nguoiTao,String orgId,String capTao) throws Exception;
    int InsertFile(FileReq item,String maKeHoach) throws Exception;
    int DeleteFilebyMaKeHoach(String maKeHoach) throws Exception;
    List<FileReq> ListFilebyMaKeHoach(String maKeHoach) throws Exception;
    List<KeHoachChiTietReq> ListChiTietbyMaKeHoach(String maKeHoach) throws Exception;
    KeHoachResp KeHoachByMa(String maKeHoach) throws Exception;
    List<KeHoachResp> ListKeHoach(String nam,String maTrangThai,String page,String pageSize,String orgId) throws Exception;
    int UpdateTongHop(List<String> listMaKeHoachChiTiet) throws Exception;
    List<KeHoachResp> ListKeHoachPheDuyet(List<String> nam,String maTrangThai,String page,String pageSize,String orgId) throws Exception;
    List<KeHoachResp> ListKeHoachGiaoViec(String nam,String maTrangThai,String page,String pageSize,String orgId) throws Exception;
    int InsertKeHoachLichSu(String maKeHoach,String trangThaiCu,String trangThaiMoi,String ghiChu,String nguoiTao) throws Exception;
    int EmailSend(String maKeHoach,String ghiChu,Integer nam,String maTrangThai,String nguoiTao) throws Exception;
    List<LichSuKeHoach> ListLichsuKeHoach(String maKeHoach) throws Exception;
    List<DanhSachMau> ListMauByMaCha(String maCha) throws Exception;
    List<KeHoachResp> KeHoachByListMa(List<String> maKeHoach) throws Exception;
}
