package com.evnit.ttpm.khcn.services.kehoach;

import com.evnit.ttpm.khcn.models.detai.DeTaiResp;
import com.evnit.ttpm.khcn.models.kehoach.*;
import com.evnit.ttpm.khcn.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class KeHoachServiceImpl implements KeHoachService {
    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    @Override
    public int insertKeHoach(KeHoachReq keHoachReq,String maKeHoach) throws Exception{
        String queryString = "INSERT INTO [dbo].[KH_KE_HOACH]" +
                " ([MA_KE_HOACH] ,[TEN_KE_HOACH],[NAM],[MA_DON_VI],[MA_TRANG_THAI],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA],[TONG_HOP],[Y_KIEN_NGUOI_PHE_DUYET],[TEN_BANG_TONG_HOP],[KY_TONG_HOP],[CAP_TAO])" +
                " VALUES (:MA_KE_HOACH,:TEN_KE_HOACH,:NAM,:MA_DON_VI,:MA_TRANG_THAI,:NGUOI_TAO,GETDATE(),:NGUOI_SUA,GETDATE(),0,:Y_KIEN_NGUOI_PHE_DUYET,:TEN_BANG_TONG_HOP,:KY_TONG_HOP,:CAP_TAO)";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("MA_KE_HOACH",maKeHoach);
            parameters.addValue("TEN_KE_HOACH",keHoachReq.getName());
            parameters.addValue("NAM",keHoachReq.getNam());
            parameters.addValue("MA_DON_VI",keHoachReq.getMaDonVi());
            parameters.addValue("MA_TRANG_THAI",keHoachReq.getMaTrangThai());
            parameters.addValue("NGUOI_TAO",keHoachReq.getNguoiTao());
            parameters.addValue("NGUOI_SUA",keHoachReq.getNguoiSua());
            parameters.addValue("Y_KIEN_NGUOI_PHE_DUYET",keHoachReq.getYKienNguoiPheDuyet());
            parameters.addValue("TEN_BANG_TONG_HOP",keHoachReq.getTenBangTongHop());
            parameters.addValue("KY_TONG_HOP",keHoachReq.getKyTongHop());
            parameters.addValue("CAP_TAO",keHoachReq.getCapTao());
            int result = jdbcTemplate.update(queryString, parameters);

        KeHoachResp keHoachResp =KeHoachByMa(maKeHoach);
        if(keHoachResp != null){
            InsertKeHoachLichSu(maKeHoach,keHoachReq.getMaTrangThai(),keHoachReq.getMaTrangThai(),keHoachReq.getYKienNguoiPheDuyet(),keHoachReq.getNguoiTao());
        }
        return result;
    }

    @Override
    public int updateKeHoach(KeHoachReq keHoachReq,String maKeHoach) throws Exception{
        KeHoachResp keHoachResp =KeHoachByMa(maKeHoach);
        if(keHoachResp != null && !keHoachResp.getMaTrangThai().equals(keHoachReq.getMaTrangThai())){
            InsertKeHoachLichSu(maKeHoach,keHoachResp.getMaTrangThai(),keHoachReq.getMaTrangThai(),keHoachReq.getYKienNguoiPheDuyet(),keHoachReq.getNguoiTao());
        }
        String queryString = "UPDATE [KH_KE_HOACH]" +
                " SET [TEN_KE_HOACH] =:TEN_KE_HOACH,[NAM] = :NAM,[MA_DON_VI] = :MA_DON_VI,[MA_TRANG_THAI] =:MA_TRANG_THAI,[NGUOI_SUA] = :NGUOI_SUA,[NGAY_SUA] =GETDATE()" +
                " ,[Y_KIEN_NGUOI_PHE_DUYET] = :Y_KIEN_NGUOI_PHE_DUYET,[TEN_BANG_TONG_HOP] =:TEN_BANG_TONG_HOP,[KY_TONG_HOP] =:KY_TONG_HOP,[CAP_TAO] =:CAP_TAO" +
                " WHERE  [MA_KE_HOACH] =:MA_KE_HOACH ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_KE_HOACH",maKeHoach);
        parameters.addValue("TEN_KE_HOACH",keHoachReq.getName());
        parameters.addValue("NAM",keHoachReq.getNam());
        parameters.addValue("MA_DON_VI",keHoachReq.getMaDonVi());
        parameters.addValue("MA_TRANG_THAI",keHoachReq.getMaTrangThai());
        parameters.addValue("NGUOI_TAO",keHoachReq.getNguoiTao());
        parameters.addValue("NGUOI_SUA",keHoachReq.getNguoiSua());
        parameters.addValue("Y_KIEN_NGUOI_PHE_DUYET",keHoachReq.getYKienNguoiPheDuyet());
        parameters.addValue("TEN_BANG_TONG_HOP",keHoachReq.getTenBangTongHop());
        parameters.addValue("KY_TONG_HOP",keHoachReq.getKyTongHop());
        parameters.addValue("CAP_TAO",keHoachReq.getCapTao());
      //  parameters.addValue("TONG_HOP",keHoachReq.getTongHop());
        int result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public int InsertKeHoachLichSu(String maKeHoach,String trangThaiCu,String trangThaiMoi,String ghiChu,String nguoiTao) throws Exception{

        String queryString = "INSERT INTO [dbo].[KH_KE_HOACH_LICH_SU]([MA_TRANG_THAI_LICH_SU],[MA_KE_HOACH],[MA_TRANG_THAI_CU]," +
                " [MA_TRANG_THAI_MOI],[GHI_CHU],[NGUOI_TAO],[NGAY_TAO])" +
                " VALUES(newid(),:MA_KE_HOACH,:MA_TRANG_THAI_CU,:MA_TRANG_THAI_MOI,:GHI_CHU,:NGUOI_TAO,GETDATE()) ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_KE_HOACH",maKeHoach);
        parameters.addValue("MA_TRANG_THAI_CU",trangThaiCu);
        parameters.addValue("MA_TRANG_THAI_MOI",trangThaiMoi);
        parameters.addValue("GHI_CHU",ghiChu);
        parameters.addValue("NGUOI_TAO",nguoiTao);
        int result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public int InsertListFile(List<FileReq> listFile,String maKeHoach) throws Exception{
        String queryStringDelete = "DELETE FROM KH_KE_HOACH_FILE WHERE MA_KE_HOACH = :MA_KE_HOACH";
        MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
        parametersDelete.addValue("MA_KE_HOACH",maKeHoach);
        int result = jdbcTemplate.update(queryStringDelete, parametersDelete);
        if(listFile != null && listFile.size() >0) {
            String queryString = "INSERT INTO [dbo].[KH_KE_HOACH_FILE]([MA_FILE],[MA_KE_HOACH],[SO_KY_HIEU],[NGAY_VAN_BAN],[TEN_FILE],[KICH_THUOC],[KIEU_FILE],[LOAI_FILE],[DUONG_DAN],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA],[DA_XOA],[ROWID],FILE_BASE64)   " +
                    " VALUES(:MA_FILE,:MA_KE_HOACH,:SO_KY_HIEU,GETDATE(),:TEN_FILE,:KICH_THUOC,:KIEU_FILE,:LOAI_FILE,:DUONG_DAN,:NGUOI_TAO,:NGAY_TAO,:NGUOI_SUA,GETDATE(),0,:ROWID,:FILE_BASE64) ";
                SqlParameterSource[] paramArr = new SqlParameterSource[listFile.size()];
                int i = 0;
                for (FileReq item : listFile) {
                    MapSqlParameterSource parameters = new MapSqlParameterSource();
                    parameters.addValue("MA_FILE", item.getMafile());
                    parameters.addValue("MA_KE_HOACH", maKeHoach);
                    parameters.addValue("SO_KY_HIEU", item.getSovanban());
                    parameters.addValue("TEN_FILE", item.getFileName());
                    parameters.addValue("KICH_THUOC", item.getSize());
                    parameters.addValue("DUONG_DAN", item.getDuongDan());
                    parameters.addValue("NGUOI_TAO", item.getNguoiTao());
                    parameters.addValue("NGAY_TAO", item.getNgayTao());
                    parameters.addValue("NGUOI_SUA", item.getNguoiSua());
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
    public int InsertKeHoachChiTiet(List<KeHoachChiTietReq> listKeHoach,String maKeHoach,String nguoiTao,String orgId,String capTao) throws Exception{
        String queryStringDelete = "DELETE FROM KH_KE_HOACH_CHI_TIET WHERE MA_KE_HOACH = :MA_KE_HOACH";
        MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
        parametersDelete.addValue("MA_KE_HOACH",maKeHoach);
        int result = jdbcTemplate.update(queryStringDelete, parametersDelete);
        if(listKeHoach != null && listKeHoach.size() >0) {
            String queryString = "INSERT INTO [dbo].[KH_KE_HOACH_CHI_TIET]([MA_KE_HOACH_CTIET],[MA_KE_HOACH],[MA_NHOM],[MA_NGUON_KINH_PHI],[MA_DON_VI],[DU_TOAN],[NGUOI_THUC_HIEN],[NOI_DUNG],[THOI_GIAN_THUC_HIEN],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA],[NOI_DUNG_DANG_KY],[Y_KIEN_NGUOI_PHE_DUYET],[DON_VI_CHU_TRI],[CHU_NHIEM_NHIEM_VU],[CAP_TAO])  " +
                    " VALUES(newid(),:MA_KE_HOACH,:MA_NHOM,:MA_NGUON_KINH_PHI,:MA_DON_VI,:DU_TOAN,:NGUOI_THUC_HIEN,:NOI_DUNG,:THOI_GIAN_THUC_HIEN,:NGUOI_TAO,GETDATE(),:NGUOI_SUA,GETDATE(),:NOI_DUNG_DANG_KY,:Y_KIEN_NGUOI_PHE_DUYET,:DON_VI_CHU_TRI,:CHU_NHIEM_NHIEM_VU,:CAP_TAO) ";
                SqlParameterSource[] paramArr = new SqlParameterSource[listKeHoach.size()];
                int i = 0;
                for (KeHoachChiTietReq item : listKeHoach) {
                    MapSqlParameterSource parameters = new MapSqlParameterSource();
//                    if(item.getMaDonVi() ==null || item.getMaDonVi().equals("")){
//                        item.setMaDonVi(orgId);
//                    }
                    item.setCapTao(capTao);
                   // parameters.addValue("MA_KE_HOACH_CTIET", item.getMaKeHoachChiTiet());
                    parameters.addValue("MA_KE_HOACH", maKeHoach);
                    parameters.addValue("MA_NHOM", item.getMaNhom());
                    parameters.addValue("MA_NGUON_KINH_PHI", item.getNguonKinhPhi());
                    parameters.addValue("MA_DON_VI", item.getMaDonVi());
                    parameters.addValue("DU_TOAN", item.getDuToan());
                    parameters.addValue("NGUOI_THUC_HIEN", item.getNguoiThucHien());
                    parameters.addValue("NOI_DUNG", item.getNoiDungHoatDong());
                    parameters.addValue("THOI_GIAN_THUC_HIEN", item.getThoiGianDuKien());
                    parameters.addValue("NGUOI_TAO", nguoiTao);
                   // parameters.addValue("NGAY_TAO", item.getNgayTao());
                    parameters.addValue("NGUOI_SUA", nguoiTao);
                    parameters.addValue("NOI_DUNG_DANG_KY", item.getNoiDungDangKy());
                    parameters.addValue("Y_KIEN_NGUOI_PHE_DUYET", item.getYKienNguoiPheDuyet());
                    parameters.addValue("DON_VI_CHU_TRI", item.getDonViChuTri());
                    parameters.addValue("CHU_NHIEM_NHIEM_VU", item.getChuNhiemNhiemVu());
                    parameters.addValue("CAP_TAO", item.getCapTao());
                    paramArr[i] = parameters;
                    i++;
                }
                jdbcTemplate.batchUpdate(queryString, paramArr);
        }
        return 1;
    }

    @Override
    public int InsertFile(FileReq item,String maKeHoach) throws Exception{

            String queryString = "INSERT INTO [dbo].[KH_KE_HOACH_FILE]([MA_FILE],[MA_KE_HOACH],[SO_KY_HIEU],[NGAY_VAN_BAN],[TEN_FILE],[KICH_THUOC],[KIEU_FILE],[LOAI_FILE],[DUONG_DAN],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA],[DA_XOA],[ROWID],FILE_BASE64)   " +
                    " VALUES(newid(),:MA_KE_HOACH,:SO_KY_HIEU,GETDATE(),:TEN_FILE,:KICH_THUOC,:KIEU_FILE,:LOAI_FILE,:DUONG_DAN,:NGUOI_TAO,GETDATE(),:NGUOI_SUA,GETDATE(),0,:ROWID,:FILE_BASE64) ";

                MapSqlParameterSource parameters = new MapSqlParameterSource();
                //parameters.addValue("MA_FILE", item.getMafile());
                parameters.addValue("MA_KE_HOACH", maKeHoach);
                parameters.addValue("SO_KY_HIEU", item.getSovanban());
                parameters.addValue("TEN_FILE", item.getFileName());
                parameters.addValue("KICH_THUOC", item.getSize());
                parameters.addValue("KIEU_FILE", item.getKieuFile());
                parameters.addValue("LOAI_FILE", item.getLoaiFile());
                parameters.addValue("DUONG_DAN", item.getDuongDan());
                parameters.addValue("NGUOI_TAO", item.getNguoiTao());
               // parameters.addValue("NGAY_TAO", item.getNgayTao());
                parameters.addValue("NGUOI_SUA", item.getNguoiSua());
                parameters.addValue("ROWID", item.getRowid());
                parameters.addValue("FILE_BASE64", item.getBase64());

         int result =  jdbcTemplate.update(queryString, parameters);

        return result;
    }
    @Override
    public int DeleteFilebyMaKeHoach(String maKeHoach) throws Exception{
        String queryStringDelete = "DELETE FROM KH_KE_HOACH_FILE WHERE MA_KE_HOACH = :MA_KE_HOACH";
        MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
        parametersDelete.addValue("MA_KE_HOACH",maKeHoach);
        int result = jdbcTemplate.update(queryStringDelete, parametersDelete);
        return result;
    }

    @Override
    public List<FileReq> ListFilebyMaKeHoach(String maKeHoach) throws Exception{
        String queryString = "SELECT [MA_FILE] mafile,[MA_KE_HOACH] maKeHoach,[SO_KY_HIEU] sovanban,[NGAY_VAN_BAN] ngayVanBan,[TEN_FILE] fileName,[KICH_THUOC] size," +
                " [KIEU_FILE] kieuFile,[LOAI_FILE] loaiFile,[DUONG_DAN] duongDan,[NGUOI_TAO] nguoiTao,[NGAY_TAO] ngayTao,[NGUOI_SUA] nguoiSua,[ROWID] rowid,[FILE_BASE64] base64 " +
                " FROM [dbo].[KH_KE_HOACH_FILE] WHERE MA_KE_HOACH = :MA_KE_HOACH AND DA_XOA=0";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_KE_HOACH",maKeHoach);
        List<FileReq> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(FileReq.class));
        return listObj;
    }

    @Override
    public List<KeHoachChiTietReq> ListChiTietbyMaKeHoach(String maKeHoach) throws Exception{
        String queryString = "SELECT [MA_KE_HOACH_CTIET] maKeHoachChiTiet,[MA_KE_HOACH] maKeHoach,[MA_NHOM] maNhom,[MA_NGUON_KINH_PHI] nguonKinhPhi,[MA_DON_VI] maDonVi,[DU_TOAN] duToan," +
                "[NGUOI_THUC_HIEN] nguoiThucHien,[NOI_DUNG] noiDungHoatDong,[THOI_GIAN_THUC_HIEN] thoiGianDuKien,[NGUOI_TAO] nguoiTao,[NGAY_TAO] ngayTao,[NGUOI_SUA] nguoiSua" +
                " ,[NOI_DUNG_DANG_KY] noiDungDangKy,[Y_KIEN_NGUOI_PHE_DUYET] yKienNguoiPheDuyet,[DON_VI_CHU_TRI] donViChuTri,[CHU_NHIEM_NHIEM_VU] chuNhiemNhiemVu,[CAP_TAO] capTao " +
                "FROM [dbo].[KH_KE_HOACH_CHI_TIET] WHERE MA_KE_HOACH = :MA_KE_HOACH";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_KE_HOACH",maKeHoach);
        List<KeHoachChiTietReq> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(KeHoachChiTietReq.class));
        return listObj;
    }

    @Override
    public KeHoachResp KeHoachByMa(String maKeHoach) throws Exception{
        String queryString = "SELECT [MA_KE_HOACH] maKeHoach,[TEN_KE_HOACH] name,[NAM] nam,[MA_DON_VI] maDonVi,[MA_TRANG_THAI] maTrangThai,[NGUOI_TAO] nguoiTao,[NGAY_TAO] ngayTao,[NGUOI_SUA] nguoiSua,[TONG_HOP] tongHop," +
                "[Y_KIEN_NGUOI_PHE_DUYET] yKienNguoiPheDuyet,[TEN_BANG_TONG_HOP] tenBangTongHop,[KY_TONG_HOP] kyTongHop,[CAP_TAO] capTao FROM [dbo].[KH_KE_HOACH] WHERE MA_KE_HOACH = :MA_KE_HOACH";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_KE_HOACH",maKeHoach);
        List<KeHoachResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(KeHoachResp.class));
        if(listObj != null && listObj.size() >0){
            return listObj.get(0);
        }
        return null;
    }

    @Override
    public List<KeHoachResp> KeHoachByListMa(List<String> maKeHoach) throws Exception{
        String queryString = "SELECT [MA_KE_HOACH] maKeHoach,[TEN_KE_HOACH] name,[NAM] nam,[MA_DON_VI] maDonVi,[MA_TRANG_THAI] maTrangThai,[NGUOI_TAO] nguoiTao,[NGAY_TAO] ngayTao,[NGUOI_SUA] nguoiSua,[TONG_HOP] tongHop," +
                "[Y_KIEN_NGUOI_PHE_DUYET] yKienNguoiPheDuyet,[TEN_BANG_TONG_HOP] tenBangTongHop,[KY_TONG_HOP] kyTongHop,[CAP_TAO] capTao FROM [dbo].[KH_KE_HOACH] WHERE MA_KE_HOACH IN(:MA_KE_HOACH)";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_KE_HOACH",maKeHoach);
        List<KeHoachResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(KeHoachResp.class));
        return listObj;
    }

    @Override
    public List<KeHoachResp> ListKeHoach(String nam,String maTrangThai,String page,String pageSize,String orgId) throws Exception{
        String queryString = "SELECT COUNT(kh.NGAY_TAO) OVER() as TotalPage,kh.[MA_KE_HOACH] maKeHoach,kh.[TEN_KE_HOACH] name,kh.[NAM] nam,kh.[MA_DON_VI] maDonVi,kh.[MA_TRANG_THAI] maTrangThai,kh.[NGUOI_TAO] nguoiTao,kh.[NGAY_TAO] ngayTao,kh.[NGUOI_SUA] nguoiSua,kh.[TONG_HOP] tongHop," +
                "kh.[Y_KIEN_NGUOI_PHE_DUYET] yKienNguoiPheDuyet,kh.[TEN_BANG_TONG_HOP] tenBangTongHop,kh.[KY_TONG_HOP] kyTongHop,kh.[CAP_TAO] capTao  ";
        queryString +=" , tt.TEN_TRANG_THAI tenTrangThai, FORMAT (NGAY_SUA, 'dd/MM/yyyy') as ngayGui, u.USERNAME nguoiGui";
        queryString +=" FROM [dbo].[KH_KE_HOACH] kh";
        queryString +=" LEFT JOIN KH_DM_TRANG_THAI tt ON kh.MA_TRANG_THAI = tt.MA_TRANG_THAI";
        queryString +=" LEFT JOIN Q_USER u ON kh.NGUOI_SUA = u.USERID";
        queryString +=" WHERE 1 = 1 AND kh.MA_TRANG_THAI IN('SOAN','CHO_PHE_DUYET','Y_CAU_HIEU_CHINH','DA_PHE_DUYET') ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(nam)){
            queryString +=" AND kh.NAM = :NAM";
                    parameters.addValue("NAM",nam);
        }
        if(Util.isNotEmpty(maTrangThai)){
            queryString +=" AND kh.MA_TRANG_THAI = :MA_TRANG_THAI";
            parameters.addValue("MA_TRANG_THAI",maTrangThai);
        }

        queryString +=" AND kh.MA_DON_VI IN(:ORGID) ORDER BY kh.NGAY_TAO DESC OFFSET "+page+" ROWS FETCH NEXT "+pageSize+" ROWS ONLY";
        parameters.addValue("ORGID",orgId);

        List<KeHoachResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(KeHoachResp.class));
        return listObj;
    }

    @Override
    public int UpdateTongHop(List<String> listMaKeHoachChiTiet) throws Exception{
        String queryStringDelete = "UPDATE KH_KE_HOACH SET TONG_HOP =1 WHERE MA_KE_HOACH IN (SELECT MA_KE_HOACH FROM KH_KE_HOACH_CHI_TIET WHERE MA_KE_HOACH_CTIET IN(:MA_KE_HOACH_CTIET))";
        MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
        parametersDelete.addValue("MA_KE_HOACH_CTIET",listMaKeHoachChiTiet);
        int result = jdbcTemplate.update(queryStringDelete, parametersDelete);
        return result;
    }

    @Override
    public List<KeHoachResp> ListKeHoachPheDuyet(List<String> nam,String maTrangThai,String page,String pageSize,String orgId) throws Exception{
        String queryString = "SELECT COUNT(kh.NGAY_TAO) OVER() as TotalPage,kh.[MA_KE_HOACH] maKeHoach,kh.[TEN_KE_HOACH] name,kh.[NAM] nam,kh.[MA_DON_VI] maDonVi,kh.[MA_TRANG_THAI] maTrangThai,kh.[NGUOI_TAO] nguoiTao,kh.[NGAY_TAO] ngayTao,kh.[NGUOI_SUA] nguoiSua,kh.[TONG_HOP] tongHop," +
                "kh.[Y_KIEN_NGUOI_PHE_DUYET] yKienNguoiPheDuyet,kh.[TEN_BANG_TONG_HOP] tenBangTongHop,kh.[KY_TONG_HOP] kyTongHop,kh.[CAP_TAO] capTao  ";
        queryString +=" , tt.TEN_TRANG_THAI tenTrangThai, FORMAT (NGAY_SUA, 'dd/MM/yyyy') as ngayGui, u.USERNAME nguoiGui";
        queryString +=" FROM [dbo].[KH_KE_HOACH] kh";
        queryString +=" LEFT JOIN KH_DM_TRANG_THAI tt ON kh.MA_TRANG_THAI = tt.MA_TRANG_THAI";
        queryString +=" LEFT JOIN Q_USER u ON kh.NGUOI_SUA = u.USERID";
        queryString +=" WHERE 1 = 1 AND kh.MA_TRANG_THAI IN('CHO_PHE_DUYET','Y_CAU_HIEU_CHINH','DA_PHE_DUYET') ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(nam)){
            queryString +=" AND kh.NAM IN (:NAM)";
            parameters.addValue("NAM",nam);
        }
        if(Util.isNotEmpty(maTrangThai)){
            queryString +=" AND kh.MA_TRANG_THAI = :MA_TRANG_THAI";
            parameters.addValue("MA_TRANG_THAI",maTrangThai);
        }

        queryString +=" AND kh.MA_DON_VI IN(SELECT ORGID FROM S_ORGANIZATION WHERE ORGID_PARENT= :ORGID) ORDER BY kh.NGAY_TAO DESC OFFSET "+page+" ROWS FETCH NEXT "+pageSize+" ROWS ONLY";
        parameters.addValue("ORGID",orgId);

        List<KeHoachResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(KeHoachResp.class));
        return listObj;
    }

    @Override
    public List<KeHoachResp> ListKeHoachGiaoViec(String nam,String maTrangThai,String page,String pageSize,String orgId) throws Exception{
        String queryString = "SELECT COUNT(kh.NGAY_TAO) OVER() as TotalPage,kh.[MA_KE_HOACH] maKeHoach,kh.[TEN_KE_HOACH] name,kh.[NAM] nam,kh.[MA_DON_VI] maDonVi,kh.[MA_TRANG_THAI] maTrangThai,kh.[NGUOI_TAO] nguoiTao,kh.[NGAY_TAO] ngayTao,kh.[NGUOI_SUA] nguoiSua,kh.[TONG_HOP] tongHop," +
                "kh.[Y_KIEN_NGUOI_PHE_DUYET] yKienNguoiPheDuyet,kh.[TEN_BANG_TONG_HOP] tenBangTongHop,kh.[KY_TONG_HOP] kyTongHop,kh.[CAP_TAO] capTao  ";
        queryString +=" , tt.TEN_TRANG_THAI tenTrangThai, FORMAT (NGAY_SUA, 'dd/MM/yyyy') as ngayGui, u.USERNAME nguoiGui";
        queryString +=" FROM [dbo].[KH_KE_HOACH] kh";
        queryString +=" LEFT JOIN KH_DM_TRANG_THAI tt ON kh.MA_TRANG_THAI = tt.MA_TRANG_THAI";
        queryString +=" LEFT JOIN Q_USER u ON kh.NGUOI_SUA = u.USERID";
        queryString +=" WHERE 1 = 1 AND kh.MA_TRANG_THAI IN('CGIAO','DGIAO') ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(nam)){
            queryString +=" AND kh.NAM IN (:NAM)";
            parameters.addValue("NAM",nam);
        }
//        if(Util.isNotEmpty(maTrangThai)){
//            queryString +=" AND kh.MA_TRANG_THAI = :MA_TRANG_THAI";
//            parameters.addValue("MA_TRANG_THAI",maTrangThai);
//        }

        queryString +=" AND kh.MA_DON_VI IN(:ORGID) ORDER BY kh.NGAY_TAO DESC OFFSET "+page+" ROWS FETCH NEXT "+pageSize+" ROWS ONLY";
        parameters.addValue("ORGID",orgId);

        List<KeHoachResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(KeHoachResp.class));
        return listObj;
    }

    @Override
    public int EmailSend(String maKeHoach,String ghiChu,Integer nam,String maTrangThai,String nguoiTao) throws Exception{
        String queryStringDelete = "EXEC API_SEND_MAIL :MA_KE_HOACH,:GHI_CHU,:NAM,:MA_TRANG_THAI,:USERID,:IS_EMAIL";
        MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
        parametersDelete.addValue("MA_KE_HOACH",maKeHoach);
        parametersDelete.addValue("GHI_CHU",ghiChu);
        parametersDelete.addValue("NAM",nam);
        parametersDelete.addValue("MA_TRANG_THAI",maTrangThai);
        parametersDelete.addValue("USERID",nguoiTao);
        parametersDelete.addValue("IS_EMAIL",1);
        int result = jdbcTemplate.update(queryStringDelete, parametersDelete);
        return result;
    }

    @Override
    public List<LichSuKeHoach> ListLichsuKeHoach(String maKeHoach) throws Exception {
        String queryString="SELECT [MA_TRANG_THAI_LICH_SU],[MA_KE_HOACH] maKeHoach,[MA_TRANG_THAI_CU] maTrangThaiCu	,[MA_TRANG_THAI_MOI] maTrangThaiMoi	  ,tt2.TEN_TRANG_THAI tenTrangThaiMoi,[GHI_CHU] ghiChu,[NGUOI_TAO] nguoiTao	  ,u.USERNAME tenNguoiTao,[NGAY_TAO] ngayTao ,o.ORGDESC tenDonVi";
        queryString +="  FROM [dbo].[KH_KE_HOACH_LICH_SU] ls";
        //queryString +="  LEFT JOIN KH_DM_TRANG_THAI tt ON ls.MA_TRANG_THAI_CU = tt.MA_TRANG_THAI";
        queryString +="  LEFT JOIN KH_DM_TRANG_THAI tt2 ON ls.MA_TRANG_THAI_MOI = tt2.MA_TRANG_THAI";
        queryString +="  LEFT JOIN Q_USER u ON u.USERID = ls.NGUOI_TAO";
        queryString +="  LEFT JOIN S_ORGANIZATION o ON u.ORGID = o.ORGID";
        queryString +="  WHERE ls.MA_KE_HOACH = :MA_KE_HOACH";
        queryString +="  ORDER BY NGAY_TAO DESC";


        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_KE_HOACH",maKeHoach);
//        if (Util.isNotEmpty(tenDeTai)) {
//            queryString += " AND (dt.TEN_DETAI LIKE :TEN_DE_TAI OR dt.MA_DE_TAI IN (SELECT MA_DE_TAI FROM DT_DETAI_HOI_DONG WHERE TEN_NGUOI_THUC_HIEN LIKE :TEN_DE_TAI))";
//            parameters.addValue("TEN_DE_TAI", "%" + tenDeTai + "%");
//        }
       // queryString += " ORDER BY kh.NGAY_TAO DESC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
        List<LichSuKeHoach> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(LichSuKeHoach.class));
        return listObj;
    }

    @Override
    public List<DanhSachMau> ListMauByMaCha(String maCha) throws Exception{
        String queryString="SELECT * FROM KH_KE_HOACH_MAU WHERE MA_NHOM_CHA = :MA_NHOM_CHA";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_NHOM_CHA",maCha);
        List<DanhSachMau> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachMau.class));
        return listObj;
    }
}
