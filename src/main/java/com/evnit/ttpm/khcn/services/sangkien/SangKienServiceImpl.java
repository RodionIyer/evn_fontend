package com.evnit.ttpm.khcn.services.sangkien;

import com.evnit.ttpm.khcn.models.detai.*;
import com.evnit.ttpm.khcn.models.kehoach.*;
import com.evnit.ttpm.khcn.models.sangkien.SangKienReq;
import com.evnit.ttpm.khcn.models.sangkien.SangKienResp;
import com.evnit.ttpm.khcn.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SangKienServiceImpl implements SangKienService {
    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    @Override
    public int insertSangKien(SangKienReq sangKienReq, String maSangKien) throws Exception{
        String queryString = "INSERT INTO [dbo].[SK_SANGKIEN]([MA_SANGKIEN],[TEN_SANGKIEN],[MA_CAPDO],[MA_DON_VI_DAU_TU],[NAM],[LA_THU_TRUONG],[U_NHUOC_DIEM],[NOI_DUNG_GPHAP],[QTRINH_APDUNG],[HIEU_QUA_THUC_TIEN]," +
                " [TOM_TAT_GIAI_PHAP],[NGUOI_THAM_GIA_ADUNG],[SO_TIEN_HIEU_QUA],[NGAY_XET_DUYET],[KET_QUA_DANH_GIA_XET_DUYET],[KIEN_NGHI_HOI_DONG_XET_DUYET],[THU_LAO],[MA_TRANG_THAI],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA],[DA_XOA])" +
                " VALUES(:MA_SANGKIEN,:TEN_SANGKIEN,:MA_CAPDO,:MA_DON_VI_DAU_TU,:NAM,:LA_THU_TRUONG,:U_NHUOC_DIEM,:NOI_DUNG_GPHAP,:QTRINH_APDUNG,:HIEU_QUA_THUC_TIEN," +
                " :TOM_TAT_GIAI_PHAP,:NGUOI_THAM_GIA_ADUNG,:SO_TIEN_HIEU_QUA,:NGAY_XET_DUYET,:KET_QUA_DANH_GIA_XET_DUYET,:KIEN_NGHI_HOI_DONG_XET_DUYET,:THU_LAO,:MA_TRANG_THAI,:NGUOI_TAO,GETDATE(),:NGUOI_SUA,GETDATE(),0)";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("MA_SANGKIEN",maSangKien);
            parameters.addValue("TEN_SANGKIEN",sangKienReq.getTenGiaiPhap());
            parameters.addValue("MA_CAPDO",sangKienReq.getCapDoSangKien());
            parameters.addValue("MA_DON_VI_DAU_TU",sangKienReq.getDonViChuDauTu());
            parameters.addValue("NAM",sangKienReq.getNam());
            parameters.addValue("LA_THU_TRUONG",sangKienReq.getThuTruongDonVi());
            parameters.addValue("U_NHUOC_DIEM",sangKienReq.getUuNhuocDiem());
            parameters.addValue("NOI_DUNG_GPHAP",sangKienReq.getNoiDungGiaiPhap());
            parameters.addValue("QTRINH_APDUNG",sangKienReq.getQuaTrinhApDung());
            parameters.addValue("HIEU_QUA_THUC_TIEN",sangKienReq.getHieuQuaThucTe());
            parameters.addValue("TOM_TAT_GIAI_PHAP",sangKienReq.getTomTat());
            parameters.addValue("NGUOI_THAM_GIA_ADUNG",sangKienReq.getThamGiaToChuc());
            parameters.addValue("SO_TIEN_HIEU_QUA",sangKienReq.getSoTienLamLoi());
            parameters.addValue("NGAY_XET_DUYET",sangKienReq.getNgayApDung());
            parameters.addValue("KET_QUA_DANH_GIA_XET_DUYET",sangKienReq.getKetQuaDanhGiaXetDuyet());
            parameters.addValue("KIEN_NGHI_HOI_DONG_XET_DUYET",sangKienReq.getKienNghiHoiDongXetDuyet());
            parameters.addValue("THU_LAO",sangKienReq.getThuLao());
            parameters.addValue("MA_TRANG_THAI",sangKienReq.getMaTrangThai());
            parameters.addValue("NGUOI_TAO",sangKienReq.getNguoiTao());
            parameters.addValue("NGUOI_SUA",sangKienReq.getNguoiSua());
            int result = jdbcTemplate.update(queryString, parameters);

//        KeHoachResp keHoachResp =KeHoachByMa(maKeHoach);
//        if(keHoachResp != null){
//            InsertKeHoachLichSu(maKeHoach,null,keHoachReq.getMaTrangThai(),keHoachReq.getYKienNguoiPheDuyet(),keHoachReq.getNguoiTao());
//        }
        return result;
    }

    @Override
    public int updateSangKien(SangKienReq sangKienReq,String maSangKien) throws Exception{
        String queryString = "UPDATE [dbo].[SK_SANGKIEN] SET [TEN_SANGKIEN] = :TEN_SANGKIEN,[MA_CAPDO] = :MA_CAPDO,[MA_DON_VI_DAU_TU] = :MA_DON_VI_DAU_TU,[NAM] = :NAM,[LA_THU_TRUONG] = :LA_THU_TRUONG,[U_NHUOC_DIEM] = :U_NHUOC_DIEM,[NOI_DUNG_GPHAP] = :NOI_DUNG_GPHAP,[QTRINH_APDUNG] = :QTRINH_APDUNG,[HIEU_QUA_THUC_TIEN] = :HIEU_QUA_THUC_TIEN," +
                    " [TOM_TAT_GIAI_PHAP] = :TOM_TAT_GIAI_PHAP,[NGUOI_THAM_GIA_ADUNG] = :NGUOI_THAM_GIA_ADUNG,[SO_TIEN_HIEU_QUA] = :SO_TIEN_HIEU_QUA,[NGAY_XET_DUYET] = :NGAY_XET_DUYET,[KET_QUA_DANH_GIA_XET_DUYET] = :KET_QUA_DANH_GIA_XET_DUYET,[KIEN_NGHI_HOI_DONG_XET_DUYET] = :KIEN_NGHI_HOI_DONG_XET_DUYET,[THU_LAO] = :THU_LAO,[MA_TRANG_THAI] = :MA_TRANG_THAI,[NGUOI_SUA] =:NGUOI_SUA,[NGAY_SUA] = GETDATE()" +
                " WHERE  [MA_SANGKIEN] =:MA_SANGKIEN ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_SANGKIEN",maSangKien);
        parameters.addValue("TEN_SANGKIEN",sangKienReq.getTenGiaiPhap());
        parameters.addValue("MA_CAPDO",sangKienReq.getCapDoSangKien());
        parameters.addValue("MA_DON_VI_DAU_TU",sangKienReq.getDonViChuDauTu());
        parameters.addValue("NAM",sangKienReq.getNam());
        parameters.addValue("LA_THU_TRUONG",sangKienReq.getThuTruongDonVi());
        parameters.addValue("U_NHUOC_DIEM",sangKienReq.getUuNhuocDiem());
        parameters.addValue("NOI_DUNG_GPHAP",sangKienReq.getNoiDungGiaiPhap());
        parameters.addValue("QTRINH_APDUNG",sangKienReq.getQuaTrinhApDung());
        parameters.addValue("HIEU_QUA_THUC_TIEN",sangKienReq.getHieuQuaThucTe());
        parameters.addValue("TOM_TAT_GIAI_PHAP",sangKienReq.getTomTat());
        parameters.addValue("NGUOI_THAM_GIA_ADUNG",sangKienReq.getThamGiaToChuc());
        parameters.addValue("SO_TIEN_HIEU_QUA",sangKienReq.getSoTienLamLoi());
        parameters.addValue("NGAY_XET_DUYET",sangKienReq.getNgayApDung());
        parameters.addValue("KET_QUA_DANH_GIA_XET_DUYET",sangKienReq.getKetQuaDanhGiaXetDuyet());
        parameters.addValue("KIEN_NGHI_HOI_DONG_XET_DUYET",sangKienReq.getKienNghiHoiDongXetDuyet());
        parameters.addValue("THU_LAO",sangKienReq.getThuLao());
        parameters.addValue("MA_TRANG_THAI",sangKienReq.getMaTrangThai());
        parameters.addValue("NGUOI_SUA",sangKienReq.getNguoiSua());
        int result = jdbcTemplate.update(queryString, parameters);
        return result;
    }


    @Override
    public int updateSangKienKetQua(SangKienReq sangKienReq,String maSangKien) throws Exception{
//        String queryString = "UPDATE [dbo].[SK_SANGKIEN] SET [TEN_SANGKIEN] = :TEN_SANGKIEN,[MA_CAPDO] = :MA_CAPDO,[MA_DON_VI_DAU_TU] = :MA_DON_VI_DAU_TU,[NAM] = :NAM,[LA_THU_TRUONG] = :LA_THU_TRUONG,[U_NHUOC_DIEM] = :U_NHUOC_DIEM,[NOI_DUNG_GPHAP] = :NOI_DUNG_GPHAP,[QTRINH_APDUNG] = :QTRINH_APDUNG,[HIEU_QUA_THUC_TIEN] = :HIEU_QUA_THUC_TIEN," +
//                " [TOM_TAT_GIAI_PHAP] = :TOM_TAT_GIAI_PHAP,[NGUOI_THAM_GIA_ADUNG] = :NGUOI_THAM_GIA_ADUNG,[SO_TIEN_HIEU_QUA] = :SO_TIEN_HIEU_QUA,[NGAY_XET_DUYET] = :NGAY_XET_DUYET,[KET_QUA_DANH_GIA_XET_DUYET] = :KET_QUA_DANH_GIA_XET_DUYET,[KIEN_NGHI_HOI_DONG_XET_DUYET] = :KIEN_NGHI_HOI_DONG_XET_DUYET,[THU_LAO] = :THU_LAO,[MA_TRANG_THAI] = :MA_TRANG_THAI,[NGUOI_SUA] =:NGUOI_SUA,[NGAY_SUA] = GETDATE()" +
//                " WHERE  [MA_SANGKIEN] =:MA_SANGKIEN ";
//        MapSqlParameterSource parameters = new MapSqlParameterSource();
//        parameters.addValue("MA_SANGKIEN",maSangKien);
//        parameters.addValue("NAM",sangKienReq.getNam());
//        parameters.addValue("LA_THU_TRUONG",sangKienReq.getThuTruongDonVi());
//        parameters.addValue("U_NHUOC_DIEM",sangKienReq.getUuNhuocDiem());
//        parameters.addValue("NOI_DUNG_GPHAP",sangKienReq.getNoiDungGiaiPhap());
//        parameters.addValue("QTRINH_APDUNG",sangKienReq.getQuaTrinhApDung());
//        parameters.addValue("HIEU_QUA_THUC_TIEN",sangKienReq.getHieuQuaThucTe());
//        parameters.addValue("TOM_TAT_GIAI_PHAP",sangKienReq.getTomTat());
//        parameters.addValue("NGUOI_THAM_GIA_ADUNG",sangKienReq.getThamGiaToChuc());
//        parameters.addValue("SO_TIEN_HIEU_QUA",sangKienReq.getSoTienLamLoi());
//        parameters.addValue("NGAY_XET_DUYET",sangKienReq.getNgayApDung());
//        parameters.addValue("KET_QUA_DANH_GIA_XET_DUYET",sangKienReq.getKetQuaDanhGiaXetDuyet());
//        parameters.addValue("KIEN_NGHI_HOI_DONG_XET_DUYET",sangKienReq.getKienNghiHoiDongXetDuyet());
//        parameters.addValue("THU_LAO",sangKienReq.getThuLao());
//        parameters.addValue("MA_TRANG_THAI",sangKienReq.getMaTrangThai());
//        parameters.addValue("NGUOI_SUA",sangKienReq.getNguoiSua());
//        int result = jdbcTemplate.update(queryString, parameters);
//        return result;
        return 1;
    }
    @Override
    public int InsertSangKienLichSu(String maSangKien,String trangThaiCu,String trangThaiMoi,String ghiChu,String nguoiTao) throws Exception{

        String queryString = "INSERT INTO [dbo].[SK_SANGKIEN_LICH_SU]([MA_TRANG_THAI_LICH_SU],[MA_SANGKIEN],[MA_TRANG_THAI_CU],[MA_TRANG_THAI_MOI],[GHI_CHU],[NGUOI_TAO],[NGAY_TAO]) " +
                " VALUES(newid(),:MA_SANGKIEN,:MA_TRANG_THAI_CU,:MA_TRANG_THAI_MOI,:GHI_CHU, :NGUOI_TAO,GETDATE()) ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_SANGKIEN",maSangKien);
        parameters.addValue("MA_TRANG_THAI_CU",trangThaiCu);
        parameters.addValue("MA_TRANG_THAI_MOI",trangThaiMoi);
        parameters.addValue("GHI_CHU",ghiChu);
        parameters.addValue("NGUOI_TAO",nguoiTao);
        int result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public int InsertListFile(List<FileReq> listFile,String maSangKien,String nguoiTao, String nguoiSua, List<String> listFolder) throws Exception{
        int result =0;
        if(listFolder != null && listFolder.size() >0){
            String queryStringDelete = "DELETE FROM [SK_SANGKIEN_FILE] WHERE MA_SANGKIEN = :MA_SANGKIEN AND MA_LOAI_FILE IN(:LIST_FOLDER)";
            MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
            parametersDelete.addValue("MA_SANGKIEN", maSangKien);
            parametersDelete.addValue("LIST_FOLDER", listFolder);
            result = jdbcTemplate.update(queryStringDelete, parametersDelete);
        }
        if(listFile != null && listFile.size() >0) {
            String queryString = "INSERT INTO [dbo].[SK_SANGKIEN_FILE]([MA_FILE],[MA_SANGKIEN],[MA_LOAI_FILE],[SO_KY_HIEU],[NGAY_VAN_BAN],[TEN_FILE],[KICH_THUOC],[KIEU_FILE],[LOAI_FILE],[DUONG_DAN],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA],[DA_XOA],[ROWID],[FILE_BASE64])  " +
                    " VALUES(newid(),:MA_SANGKIEN, :MA_LOAI_FILE, :SO_KY_HIEU, :NGAY_VAN_BAN,:TEN_FILE,:KICH_THUOC,:KIEU_FILE,:LOAI_FILE,:DUONG_DAN,:NGUOI_TAO, GETDATE(),:NGUOI_SUA,GETDATE(),0,:ROWID,:FILE_BASE64) ";
                SqlParameterSource[] paramArr = new SqlParameterSource[listFile.size()];
                int i = 0;
                for (FileReq item : listFile) {
                    MapSqlParameterSource parameters = new MapSqlParameterSource();
                    parameters.addValue("MA_SANGKIEN", maSangKien);
                    parameters.addValue("MA_LOAI_FILE", item.getMaLoaiFile());
                    parameters.addValue("SO_KY_HIEU", item.getSovanban());
                    parameters.addValue("NGAY_VAN_BAN", item.getNgayVanBan());
                    parameters.addValue("TEN_FILE", item.getFileName());
                    parameters.addValue("KICH_THUOC", item.getSize());
                    parameters.addValue("KIEU_FILE", item.getKieuFile());
                    parameters.addValue("LOAI_FILE", item.getLoaiFile());
                    parameters.addValue("DUONG_DAN", item.getDuongDan());
                    parameters.addValue("NGUOI_TAO", nguoiTao);
                    parameters.addValue("NGUOI_SUA", nguoiSua);
                    parameters.addValue("ROWID", item.getRowid());
                    parameters.addValue("FILE_BASE64", item.getBase64());
                    paramArr[i] = parameters;
                    i++;
                }
                jdbcTemplate.batchUpdate(queryString, paramArr);
        }
        return 1;
    }

    @Override
    public int InsertThanhVien(List<DanhSachThanhVien> listThanhVien, String maSangKien,String nguoiTao,String nguoiSua) throws Exception{
        String queryStringDelete = "DELETE FROM SK_SANGKIEN_NGUOI_THUC_HIEN WHERE MA_SANGKIEN = :MA_SANGKIEN";
        MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
        parametersDelete.addValue("MA_SANGKIEN",maSangKien);
        int result = jdbcTemplate.update(queryStringDelete, parametersDelete);
        if(listThanhVien != null && listThanhVien.size() >0) {
            String queryString = "INSERT INTO [dbo].[SK_SANGKIEN_NGUOI_THUC_HIEN]([MA_SANGKIEN_NGUOI_THUC_HIEN],[STT],[MA_NGUOI_THUC_HIEN],[TEN_NGUOI_THUC_HIEN],[NS_ID],[NAM_SINH],[DIA_CHI_NOI_LAM_VIEC],[CHUYEN_MON],  " +
                    " [NOI_DUNG_THAM_GIA],[MA_SANGKIEN],[MA_CHUC_DANH],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA])  " +
                    " VALUES(newid(),:STT,:MA_NGUOI_THUC_HIEN,:TEN_NGUOI_THUC_HIEN,:NS_ID,:NAM_SINH,:DIA_CHI_NOI_LAM_VIEC,:CHUYEN_MON," +
                    " :NOI_DUNG_THAM_GIA,:MA_SANGKIEN,:MA_CHUC_DANH,:NGUOI_TAO,GETDATE(),:NGUOI_SUA,GETDATE()) ";
            SqlParameterSource[] paramArr = new SqlParameterSource[listThanhVien.size()];
            int i = 0;
            for (DanhSachThanhVien item : listThanhVien) {
                MapSqlParameterSource parameters = new MapSqlParameterSource();
                parameters.addValue("STT", item.getStt());
                parameters.addValue("MA_NGUOI_THUC_HIEN", item.getMaThanhVien());
                parameters.addValue("TEN_NGUOI_THUC_HIEN", item.getTen());
                parameters.addValue("NS_ID", item.getNsId());
                parameters.addValue("NAM_SINH", item.getNamSinh());
                parameters.addValue("DIA_CHI_NOI_LAM_VIEC", item.getDiaChiNoiLamViec());
                parameters.addValue("CHUYEN_MON", item.getThanhTuu());
                parameters.addValue("NOI_DUNG_THAM_GIA", item.getNoiDungThamGia());
                parameters.addValue("MA_SANGKIEN", maSangKien);
                parameters.addValue("MA_CHUC_DANH", item.getChucDanh());
                parameters.addValue("NGUOI_TAO", nguoiTao);
                parameters.addValue("NGUOI_SUA", nguoiSua);
                paramArr[i] = parameters;
                i++;
            }
            jdbcTemplate.batchUpdate(queryString, paramArr);
        }
        return 1;
    }
    @Override
    public List<SangKienResp> ListSangKien(String userId, String page, String pageSize,String orgId) throws Exception {
        String queryString = "SELECT [MA_SANGKIEN] maSangKien,[TEN_SANGKIEN] tenGiaiPhap,[MA_CAPDO] capDoSangKien,[MA_DON_VI_DAU_TU] donViChuDauTu,[NAM] nam," +
                "[LA_THU_TRUONG] thuTruongDonVi,[U_NHUOC_DIEM] uuNhuocDiem,[NOI_DUNG_GPHAP] noiDungGiaiPhap,[QTRINH_APDUNG] quaTrinhApDung,[HIEU_QUA_THUC_TIEN] hieuQuaThucTe," +
                "[TOM_TAT_GIAI_PHAP] tomTat,[NGUOI_THAM_GIA_ADUNG] thamGiaToChuc,[SO_TIEN_HIEU_QUA] soTienLamLoi,[NGAY_XET_DUYET] ngayApDung,[KET_QUA_DANH_GIA_XET_DUYET] ketQuaDanhGiaXetDuyet,[KIEN_NGHI_HOI_DONG_XET_DUYET] kienNghiHoiDongXetDuyet,[THU_LAO] thuLao,[MA_TRANG_THAI] maTrangThai,[NGUOI_TAO] nguoiTao " +
               "  FROM [dbo].[SK_SANGKIEN] sk WHERE 1=1";

        RoleResp role = CheckQuyen(userId);
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(role != null && role.roleCode.equals("KHCN_ROLE_CANBO_KHCN")){
            queryString +=" AND sk.MA_DON_VI_DAU_TU =:ORGID";
            parameters.addValue("ORGID", orgId);
        }else{
            queryString += " AND (sk.MA_SANGKIEN IN(SELECT MA_SANGKIEN FROM SK_SANGKIEN_HOIDONG hd, DM_NGUOI_THUC_HIEN th \n" +
                    "WHERE hd.MA_NGUOI_THUC_HIEN = th.MA_NGUOI_THUC_HIEN \n" +
                    "AND th.NS_ID IN (SELECT MA_NHAN_VIEN FROM Q_USER WHERE USERID=:USERID)) " +
                    "OR sk.MA_SANGKIEN IN(SELECT MA_SANGKIEN FROM SK_SANGKIEN_NGUOI_THUC_HIEN tt WHERE  tt.NS_ID IN (SELECT MA_NHAN_VIEN FROM Q_USER WHERE USERID=:USERID)))" +
                    " OR sk.NGUOI_TAO = :USERID OR sk.NGUOI_SUA = :USERID";
            parameters.addValue("USERID", userId);
        }

        queryString += " ORDER BY sk.NGAY_TAO DESC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
        List<SangKienResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(SangKienResp.class));
        return listObj;
    }

    @Override
    public RoleResp CheckQuyen(String userId) throws Exception{
        String queryString = "SELECT r.[ROLEID] roleId,r.[ROLEDESC] roleDesc,r.[ROLECODE] roleCode FROM Q_ROLE r, Q_USER_ROLE ur  WHERE r.ROLEID =ur.ROLEID AND ur.USERID=:USERID ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();

        parameters.addValue("USERID",userId);

        List<RoleResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(RoleResp.class));
        if(listObj != null && listObj.size() >0){
            return listObj.get(0);
        }
        return null;
    }
    @Override
    public SangKienResp ChiTietSangKien(String maSangKien) throws Exception {
        String queryString = "SELECT [MA_SANGKIEN] maSangKien,[TEN_SANGKIEN] tenGiaiPhap,[MA_CAPDO] capDoSangKien,[MA_DON_VI_DAU_TU] donViChuDauTu,[NAM] nam," +
                "[LA_THU_TRUONG] thuTruongDonVi,[U_NHUOC_DIEM] uuNhuocDiem,[NOI_DUNG_GPHAP] noiDungGiaiPhap,[QTRINH_APDUNG] quaTrinhApDung,[HIEU_QUA_THUC_TIEN] hieuQuaThucTe," +
                "[TOM_TAT_GIAI_PHAP] tomTat,[NGUOI_THAM_GIA_ADUNG] thamGiaToChuc,[SO_TIEN_HIEU_QUA] soTienLamLoi,[NGAY_XET_DUYET] ngayApDung,[KET_QUA_DANH_GIA_XET_DUYET] ketQuaDanhGiaXetDuyet,[KIEN_NGHI_HOI_DONG_XET_DUYET] kienNghiHoiDongXetDuyet,[THU_LAO] thuLao,[MA_TRANG_THAI] maTrangThai,[NGUOI_TAO] nguoiTao " +
                "  FROM [dbo].[SK_SANGKIEN] sk WHERE sk.MA_SANGKIEN = :MA_SANGKIEN";


        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_SANGKIEN",maSangKien);
        List<SangKienResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(SangKienResp.class));
        if(listObj !=null && listObj.size() >0){
            return listObj.get(0);
        }
        return null;
    }

    @Override
    public int updateTrangThai(String maSangKien,String maTrangThai) throws Exception {
        int result = 0;
        String queryString = "UPDATE [SK_SANGKIEN] SET  MA_TRANG_THAI = :MA_TRANG_THAI WHERE MA_SANGKIEN = :MA_SANGKIEN";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_SANGKIEN", maSangKien);
        parameters.addValue("MA_TRANG_THAI", maTrangThai);
        result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public int insertLichSu(String maSangKien,String maTrangThaiCu,String maTrangThaiMoi,String ghiChu,String nguoiTao) throws Exception {
        int result = 0;
        String queryString = "INSERT INTO [dbo].[SK_SANGKIEN_LICH_SU]([MA_TRANG_THAI_LICH_SU],[MA_SANGKIEN],[MA_TRANG_THAI_CU],[MA_TRANG_THAI_MOI],[GHI_CHU],[NGUOI_TAO],[NGAY_TAO]) ";
        queryString += "VALUES(newid(),:MA_SANGKIEN,:MA_TRANG_THAI_CU,:MA_TRANG_THAI_MOI, :GHI_CHU, :NGUOI_TAO,GETDATE())";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_SANGKIEN", maSangKien);
        parameters.addValue("MA_TRANG_THAI_CU", maTrangThaiCu);
        parameters.addValue("MA_TRANG_THAI_MOI", maTrangThaiMoi);
        parameters.addValue("GHI_CHU", ghiChu);
        parameters.addValue("NGUOI_TAO", nguoiTao);
        result = jdbcTemplate.update(queryString, parameters);
        return result;
    }


    @Override
    public List<DanhSachChung> ListDanhSachTrangThai() throws Exception {
        String queryString = "SELECT MA_TRANG_THAI id, TEN_TRANG_THAI name FROM SK_DM_TRANG_THAI";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<DanhSachChung> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachChung.class));
        return listObj;
    }

    @Override
    public String GetMailNguoiThucHien(String maSangKien) throws Exception {
        int result = 0;
        String queryString = "SELECT STRING_AGG(EMAL,',') FROM DM_NGUOI_THUC_HIEN WHERE MA_NGUOI_THUC_HIEN IN(SELECT MA_NGUOI_THUC_HIEN FROM SK_SANGKIEN_NGUOI_THUC_HIEN WHERE MA_SANGKIEN = :MA_SANGKIEN)";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_SANGKIEN", maSangKien);
        List<String> obj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(String.class));
        if(obj != null && obj.size() >0){
            return obj.get(0);
        }
        return "";
    }

    @Override
    public int insertSendMail(String nguoiGui,String nhomNguoiNhan,String noiDung,String loai,String tieuDe) throws Exception {
        int result = 0;
        String queryString = "INSERT INTO [dbo].[API_GUI_EMAIL]([MA_EMAIL],[NGUOI_GUI],[NHOM_NGUOI_NHAN],[NOI_DUNG],[LOAI],[DA_GUI],[DA_XOA],[DANG_XU_LY],[TIEU_DE],[NGAY_TAO])";
        queryString += " VALUES(newid(),:NGUOI_GUI,:NHOM_NGUOI_NHAN,:NOI_DUNG,:LOAI,0,0,0,:TIEU_DE,GETDATE())";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("NGUOI_GUI", nguoiGui);
        parameters.addValue("NHOM_NGUOI_NHAN", nhomNguoiNhan);
        parameters.addValue("NOI_DUNG", noiDung);
        parameters.addValue("LOAI", loai);
        parameters.addValue("TIEU_DE", tieuDe);
        result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public List<LichSuKeHoach> ListLichsu(String maSangKien) throws Exception {
        String queryString="SELECT [MA_TRANG_THAI_LICH_SU],[MA_SANGKIEN] maKeHoach,[MA_TRANG_THAI_CU] maTrangThaiCu	,[MA_TRANG_THAI_MOI] maTrangThaiMoi	  ,tt2.TEN_TRANG_THAI tenTrangThaiMoi,[GHI_CHU] ghiChu,[NGUOI_TAO] nguoiTao	  ,u.USERNAME tenNguoiTao,[NGAY_TAO] ngayTao ,o.ORGDESC tenDonVi";
        queryString +="  FROM [dbo].[SK_SANGKIEN_LICH_SU] ls";
        //queryString +="  LEFT JOIN KH_DM_TRANG_THAI tt ON ls.MA_TRANG_THAI_CU = tt.MA_TRANG_THAI";
        queryString +="  LEFT JOIN SK_DM_TRANG_THAI tt2 ON ls.MA_TRANG_THAI_MOI = tt2.MA_TRANG_THAI";
        queryString +="  LEFT JOIN Q_USER u ON u.USERID = ls.NGUOI_TAO";
        queryString +="  LEFT JOIN S_ORGANIZATION o ON u.ORGID = o.ORGID";
        queryString +=" WHERE MA_SANGKIEN = :MA_SANGKIEN";
        queryString +="  ORDER BY NGAY_TAO DESC";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_SANGKIEN",maSangKien);
        List<LichSuKeHoach> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(LichSuKeHoach.class));
        return listObj;
    }

    @Override
    public List<DanhSachChung> ListCapDo() throws Exception {
        String queryString = "SELECT MA_CAPDO id, TEN_CAPDO name FROM SK_DM_CAPDO_SANG_KIEN";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<DanhSachChung> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachChung.class));
        return listObj;
    }

    @Override
    public List<DanhSachChung> ListDonVi() throws Exception {
        String queryString = "SELECT ORGID id, ORGDESC name FROM S_ORGANIZATION";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<DanhSachChung> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachChung.class));
        return listObj;
    }

    @Override
    public List<FileReq> ListFileByMa(String maSangKien) throws Exception {
        String queryString = "SELECT [MA_FILE] mafile,[MA_SANGKIEN] maSangKien,[MA_LOAI_FILE] maLoaiFile,[SO_KY_HIEU] sovanban,[NGAY_VAN_BAN] ngayVanBan," +
                " [TEN_FILE] fileName,[KICH_THUOC] size,[KIEU_FILE] kieuFile,[LOAI_FILE] loaiFile,[DUONG_DAN] duongDan,[NGUOI_TAO] nguoiTao,[NGAY_TAO] ngayTao,[NGUOI_SUA] nguoiSua  FROM [dbo].[SK_SANGKIEN_FILE] WHERE MA_SANGKIEN = :MA_SANGKIEN AND DA_XOA=0";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_SANGKIEN",maSangKien);

        List<FileReq> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(FileReq.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileRaSoat() throws Exception {
        String queryString = "  SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName   FROM SK_DM_LOAI_FILE WHERE RA_SOAT =1 AND TRANG_THAI=1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileHDXD() throws Exception {
        String queryString = "  SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName FROM SK_DM_LOAI_FILE WHERE HOI_DONG =1 AND TRANG_THAI =1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileKetQuaXD() throws Exception {
        String queryString = "  SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM SK_DM_LOAI_FILE WHERE XET_DUYET =1 AND TRANG_THAI =1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileThuLao() throws Exception {
        String queryString = "  SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM SK_DM_LOAI_FILE WHERE THU_LAO =1 AND TRANG_THAI =1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFile() throws Exception {
        String queryString = "  SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM SK_DM_LOAI_FILE WHERE DANG_KY =1 AND TRANG_THAI =1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<DanhSachThanhVien> ListNguoiThucHienByMa(String maSangKien) throws Exception {
        String queryString = "SELECT dt.[MA_SANGKIEN_NGUOI_THUC_HIEN] maDanhSachThanhVien,dt.[STT] stt,dt.[MA_NGUOI_THUC_HIEN] maThanhVien,dt.[TEN_NGUOI_THUC_HIEN] ten," +
                " dt.[MA_SANGKIEN] maSangKien,dt.[NS_ID] nsId, dt.NAM_SINH namSinh, dt.DIA_CHI_NOI_LAM_VIEC diaChiNoiLamViec, dt.CHUYEN_MON thanhTuu, dt.NOI_DUNG_THAM_GIA noiDungThamGia," +
                " dt.[MA_CHUC_DANH] chucDanh,dt.[NGUOI_TAO] nguoiTao,dt.[NGAY_TAO] ,dt.[NGUOI_SUA] nguoiSua,dt.[NGAY_SUA], cd.TEN_CHUC_DANH tenChucDanh FROM [dbo].SK_SANGKIEN_NGUOI_THUC_HIEN dt" +
                " LEFT JOIN SK_DM_CHUC_DANH cd ON dt.MA_CHUC_DANH = cd.MA_CHUC_DANH " +
                " WHERE MA_SANGKIEN = :MA_SANGKIEN";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_SANGKIEN",maSangKien);

        List<DanhSachThanhVien> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachThanhVien.class));
        return listObj;
    }
}
