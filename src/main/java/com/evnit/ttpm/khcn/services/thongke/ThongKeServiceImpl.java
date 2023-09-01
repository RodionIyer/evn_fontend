package com.evnit.ttpm.khcn.services.thongke;

import com.evnit.ttpm.khcn.models.detai.DanhSachChung;
import com.evnit.ttpm.khcn.models.thongke.ListData;
import com.evnit.ttpm.khcn.models.thongke.ThongKeReq;
import com.evnit.ttpm.khcn.models.thongke.ThongKeResp;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuReq;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuResp;
import com.evnit.ttpm.khcn.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ThongKeServiceImpl implements ThongKeService {
    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;


    @Override
    public List<ThongKeResp> ListThongKe(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception {
        String whereDT="";
        String whereSK ="";
        String queryString = "SELECT * FROM (" +
                " SELECT 'DETAI' loaiDeTaiSK, dt.TEN_DETAI tenDeTaiSK, cd.TEN_CAPDO capQuanLy,nth.TEN_NGUOI_THUC_HIEN tenChuNhiemTG, dv.ORGDESC donViChuTri,YEAR(dt.THOI_GIAN_BAT_DAU) nam  FROM DT_DE_TAI dt" +
                " LEFT JOIN DT_DM_CAPDO_DETAI cd ON dt.MA_CAPDO = cd.MA_CAPDO" +
                " LEFT JOIN DT_DETAI_NGUOI_THUC_HIEN nth ON dt.MA_DETAI = nth.MA_DETAI AND nth.MA_CHUC_DANH='CNHIEM'" +
                " LEFT JOIN S_ORGANIZATION dv ON dt.MA_DON_VI_CHU_TRI = dv.ORGID" +
                whereDT +
                " UNION ALL" +
                " SELECT  'SANGKIEN' AS loaiDeTaiSK,sk.TEN_SANGKIEN tenDeTaiSK, cd.TEN_CAPDO capQuanLy,nth.TEN_NGUOI_THUC_HIEN tenChuNhiemTG, dv.ORGDESC donViChuTri,sk.NAM nam FROM SK_SANGKIEN sk" +
                " LEFT JOIN SK_DM_CAPDO_SANG_KIEN cd ON sk.MA_CAPDO = cd.MA_CAPDO" +
                " LEFT JOIN SK_SANGKIEN_NGUOI_THUC_HIEN nth ON sk.MA_SANGKIEN = nth.MA_SANGKIEN AND nth.MA_CHUC_DANH='CNHIEM'" +
                " LEFT JOIN S_ORGANIZATION dv ON sk.MA_DON_VI_DAU_TU = dv.ORGID" +
                whereDT +
                " ) c ";
        if(export){

        }else{
            queryString +=" ORDER BY tenDeTaiSK ASC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
        }
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<ThongKeResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(ThongKeResp.class));
        return listObj;
    }

    @Override
    public List<ListData> ListThongKeDeTaiKH(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception {
        String whereDT="";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(thongKeReq.getDonViChuTri())){
            whereDT += " AND dt.MA_DON_VI_CHU_TRI = :MA_DON_VI_CHU_TRI";
            parameters.addValue("MA_DON_VI_CHU_TRI",thongKeReq.getDonViChuTri());
        }
        if(Util.isNotEmpty(thongKeReq.getCapQuanLy())){
            whereDT += " AND dt.MA_CAPDO = :MA_CAPDO";
            parameters.addValue("MA_CAPDO",thongKeReq.getCapQuanLy());
        }
        if(Util.isNotEmpty(thongKeReq.getLinhVucNghienCuu())){
            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getLinhVucNghienCuu());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getFromNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getToNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        String queryString = "SELECT * FROM (" +
                " SELECT 'DETAI' loaiDeTaiSK, dt.TEN_DETAI tenDeTaiSK, cd.TEN_CAPDO capQuanLy,nth.TEN_NGUOI_THUC_HIEN tenChuNhiemTG, dv.ORGDESC donViChuTri," +
                " YEAR(dt.THOI_GIAN_BAT_DAU) nam, nc.MA_LVUC_NCUU maNghienCuu,(FORMAT (dt.THOI_GIAN_BAT_DAU, 'dd/MM/yyyy') + ' - '+ FORMAT (dt.THOI_GIAN_KET_THUC, 'dd/MM/yyyy')) thoiGianThucHien, " +
                " (ISNULL(dt.KINH_PHI_KHOAN,0) + ISNULL(dt.KINH_PHI_KHONG_KHOAN,0)) kinhPhi, " +
                " TONG_KINH_PHI tongKinhPhi" +
                " FROM DT_DE_TAI dt" +
                " INNER JOIN DT_DETAI_LVUC_NCUU nc ON dt.MA_DETAI = nc.MA_DETAI " +
                " LEFT JOIN DT_DM_CAPDO_DETAI cd ON dt.MA_CAPDO = cd.MA_CAPDO" +
                " LEFT JOIN (SELECT MA_DETAI, STRING_AGG(TEN_NGUOI_THUC_HIEN,', ') TEN_NGUOI_THUC_HIEN FROM DT_DETAI_NGUOI_THUC_HIEN WHERE MA_CHUC_DANH IN('CNHIEM','DCNHIEM') GROUP BY MA_DETAI) nth ON dt.MA_DETAI = nth.MA_DETAI" +
                " LEFT JOIN S_ORGANIZATION dv ON dt.MA_DON_VI_CHU_TRI = dv.ORGID" +
                " WHERE 1=1"  +
                whereDT +
                " ) c ";
//        if(export){
//
//        }else{
//            queryString +=" ORDER BY tenDeTaiSK ASC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
//        }

        List<ListData> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(ListData.class));
        return listObj;
    }

    @Override
    public List<ListData> ListThongKeCapDo(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception {
        String whereDT=" AND dt.MA_CAPDO IS NOT NULL";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(thongKeReq.getDonViChuTri())){
            whereDT += " AND dt.MA_DON_VI_CHU_TRI = :MA_DON_VI_CHU_TRI";
            parameters.addValue("MA_DON_VI_CHU_TRI",thongKeReq.getDonViChuTri());
        }
        if(Util.isNotEmpty(thongKeReq.getCapQuanLy())){
            whereDT += " AND dt.MA_CAPDO = :MA_CAPDO";
            parameters.addValue("MA_CAPDO",thongKeReq.getCapQuanLy());
        }
        if(Util.isNotEmpty(thongKeReq.getLinhVucNghienCuu())){
            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getLinhVucNghienCuu());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getFromNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getToNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        String queryString = "SELECT * FROM (" +
                " SELECT 'DETAI' loaiDeTaiSK, dt.TEN_DETAI tenDeTaiSK, cd.TEN_CAPDO capQuanLy,nth.TEN_NGUOI_THUC_HIEN tenChuNhiemTG, dv.ORGDESC donViChuTri,YEAR(dt.THOI_GIAN_BAT_DAU) nam, dt.MA_CAPDO maCapQuanLy  ," +
                " (FORMAT (dt.THOI_GIAN_BAT_DAU, 'dd/MM/yyyy') + ' - '+ FORMAT (dt.THOI_GIAN_KET_THUC, 'dd/MM/yyyy')) thoiGianThucHien, " +
                " (ISNULL(dt.KINH_PHI_KHOAN,0) + ISNULL(dt.KINH_PHI_KHONG_KHOAN,0)) kinhPhi, " +
                " TONG_KINH_PHI tongKinhPhi" +
                " FROM DT_DE_TAI dt" +
                " LEFT JOIN DT_DM_CAPDO_DETAI cd ON dt.MA_CAPDO = cd.MA_CAPDO" +
                " LEFT JOIN (SELECT MA_DETAI, STRING_AGG(TEN_NGUOI_THUC_HIEN,', ') TEN_NGUOI_THUC_HIEN FROM DT_DETAI_NGUOI_THUC_HIEN WHERE MA_CHUC_DANH IN('CNHIEM','DCNHIEM') GROUP BY MA_DETAI) nth ON dt.MA_DETAI = nth.MA_DETAI" +
                " LEFT JOIN S_ORGANIZATION dv ON dt.MA_DON_VI_CHU_TRI = dv.ORGID WHERE 1=1"  +
                whereDT +
                " ) c ";
//        if(export){
//
//        }else{
//            queryString +=" ORDER BY tenDeTaiSK ASC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
//        }

        List<ListData> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(ListData.class));
        return listObj;
    }

    @Override
    public List<ListData> ListThongKeDonVi(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception {
        String whereDT=" AND dt.MA_DON_VI_CHU_TRI IS NOT NULL ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(thongKeReq.getDonViChuTri())){
            whereDT += " AND dt.MA_DON_VI_CHU_TRI = :MA_DON_VI_CHU_TRI";
            parameters.addValue("MA_DON_VI_CHU_TRI",thongKeReq.getDonViChuTri());
        }
        if(Util.isNotEmpty(thongKeReq.getCapQuanLy())){
            whereDT += " AND dt.MA_CAPDO = :MA_CAPDO";
            parameters.addValue("MA_CAPDO",thongKeReq.getCapQuanLy());
        }
        if(Util.isNotEmpty(thongKeReq.getLinhVucNghienCuu())){
            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getLinhVucNghienCuu());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getFromNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getToNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        String queryString = "SELECT * FROM (" +
                " SELECT 'DETAI' loaiDeTaiSK, dt.TEN_DETAI tenDeTaiSK, cd.TEN_CAPDO capQuanLy,nth.TEN_NGUOI_THUC_HIEN tenChuNhiemTG, dv.ORGDESC donViChuTri,dt.MA_DON_VI_CHU_TRI maDonViChuTri,YEAR(dt.THOI_GIAN_BAT_DAU) nam  ," +
                " (FORMAT (dt.THOI_GIAN_BAT_DAU, 'dd/MM/yyyy') + ' - '+ FORMAT (dt.THOI_GIAN_KET_THUC, 'dd/MM/yyyy')) thoiGianThucHien, " +
                " (ISNULL(dt.KINH_PHI_KHOAN,0) + ISNULL(dt.KINH_PHI_KHONG_KHOAN,0)) kinhPhi, " +
                " dt.TONG_KINH_PHI tongKinhPhi" +
                " FROM DT_DE_TAI dt" +
                " LEFT JOIN DT_DM_CAPDO_DETAI cd ON dt.MA_CAPDO = cd.MA_CAPDO" +
                " LEFT JOIN (SELECT MA_DETAI, STRING_AGG(TEN_NGUOI_THUC_HIEN,', ') TEN_NGUOI_THUC_HIEN FROM DT_DETAI_NGUOI_THUC_HIEN WHERE MA_CHUC_DANH IN('CNHIEM','DCNHIEM') GROUP BY MA_DETAI) nth ON dt.MA_DETAI = nth.MA_DETAI" +
                " LEFT JOIN S_ORGANIZATION dv ON dt.MA_DON_VI_CHU_TRI = dv.ORGID WHERE 1=1"  +
                whereDT +
                " ) c ";
//        if(export){
//
//        }else{
//            queryString +=" ORDER BY tenDeTaiSK ASC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
//        }

        List<ListData> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(ListData.class));
        return listObj;
    }


    @Override
    public List<DanhSachChung> ListLinhVucNC() throws Exception {
        String queryString = "SELECT MA_LVUC_NCUU id, TEN_LVUC_NCUU name FROM DM_LVUC_NCUU ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<DanhSachChung> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachChung.class));
        return listObj;
    }
    @Override
    public List<DanhSachChung> ListCapDeTai() throws Exception {
        String queryString = "SELECT MA_CAPDO id, TEN_CAPDO name FROM DT_DM_CAPDO_DETAI ORDER BY SAP_XEP ";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<DanhSachChung> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachChung.class));
        return listObj;
    }

    @Override
    public List<DanhSachChung> ListCapDonVi() throws Exception {
        String queryString = "SELECT ORGID id, ORGDESC name FROM S_ORGANIZATION ORDER BY ORGDESC ";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<DanhSachChung> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachChung.class));
        return listObj;
    }

    @Override
    public List<ListData> ListThongKeSangKienKH(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception {
        String whereDT="";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(thongKeReq.getDonViChuTri())){
            whereDT += " AND sk.MA_DON_VI_CHU_TRI = :MA_DON_VI_CHU_TRI";
            parameters.addValue("MA_DON_VI_CHU_TRI",thongKeReq.getDonViChuTri());
        }
        if(Util.isNotEmpty(thongKeReq.getCapQuanLy())){
            whereDT += " AND sk.MA_CAPDO = :MA_CAPDO";
            parameters.addValue("MA_CAPDO",thongKeReq.getCapQuanLy());
        }
        if(Util.isNotEmpty(thongKeReq.getLinhVucNghienCuu())){
            whereDT += " AND sk.MA_SANGKIEN IN(SELECT MA_SANGKIEN FROM SK_SANGKIEN_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getLinhVucNghienCuu());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getFromNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getToNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        String queryString = "SELECT * FROM (" +
                " SELECT  'SANGKIEN' AS loaiDeTaiSK,sk.TEN_SANGKIEN tenDeTaiSK, cd.TEN_CAPDO capQuanLy,nth.TEN_NGUOI_THUC_HIEN tenChuNhiemTG, dv.ORGDESC donViChuTri,sk.NAM nam, nc.MA_LVUC_NCUU maNghienCuu FROM SK_SANGKIEN sk" +
                " INNER JOIN SK_SANGKIEN_LVUC_NCUU nc ON sk.MA_SANGKIEN = nc.MA_SANGKIEN " +
                " LEFT JOIN SK_DM_CAPDO_SANG_KIEN cd ON sk.MA_CAPDO = cd.MA_CAPDO" +
                " LEFT JOIN (SELECT MA_SANGKIEN, STRING_AGG(TEN_NGUOI_THUC_HIEN,', ') TEN_NGUOI_THUC_HIEN FROM SK_SANGKIEN_NGUOI_THUC_HIEN WHERE MA_CHUC_DANH IN('CNHIEM','DCNHIEM') GROUP BY MA_SANGKIEN) nth ON sk.MA_SANGKIEN = nth.MA_SANGKIEN" +
                " LEFT JOIN S_ORGANIZATION dv ON sk.MA_DON_VI_DAU_TU = dv.ORGID" +
                " WHERE 1=1"  +
                whereDT +
                " ) c ";
//        if(export){
//
//        }else{
//            queryString +=" ORDER BY tenDeTaiSK ASC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
//        }

        List<ListData> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(ListData.class));
        return listObj;
    }



    @Override
    public List<ListData> ListThongKeSangKienCapDo(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception {
        String whereDT=" AND sk.MA_CAPDO IS NOT NULL";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(thongKeReq.getDonViChuTri())){
            whereDT += " AND sk.MA_DON_VI_CHU_TRI = :MA_DON_VI_CHU_TRI";
            parameters.addValue("MA_DON_VI_CHU_TRI",thongKeReq.getDonViChuTri());
        }
        if(Util.isNotEmpty(thongKeReq.getCapQuanLy())){
            whereDT += " AND sk.MA_CAPDO = :MA_CAPDO";
            parameters.addValue("MA_CAPDO",thongKeReq.getCapQuanLy());
        }
        if(Util.isNotEmpty(thongKeReq.getLinhVucNghienCuu())){
            whereDT += " AND sk.MA_SANGKIEN IN(SELECT MA_SANGKIEN FROM SK_SANGKIEN_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getLinhVucNghienCuu());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getFromNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getToNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        String queryString = "SELECT * FROM (" +
                " SELECT  'SANGKIEN' AS loaiDeTaiSK,sk.TEN_SANGKIEN tenDeTaiSK, cd.TEN_CAPDO capQuanLy,nth.TEN_NGUOI_THUC_HIEN tenChuNhiemTG, dv.ORGDESC donViChuTri,sk.NAM nam, sk.MA_CAPDO maCapQuanLy FROM SK_SANGKIEN sk" +
                " LEFT JOIN SK_DM_CAPDO_SANG_KIEN cd ON sk.MA_CAPDO = cd.MA_CAPDO" +
                " LEFT JOIN (SELECT MA_SANGKIEN, STRING_AGG(TEN_NGUOI_THUC_HIEN,', ') TEN_NGUOI_THUC_HIEN FROM SK_SANGKIEN_NGUOI_THUC_HIEN WHERE MA_CHUC_DANH IN('CNHIEM','DCNHIEM') GROUP BY MA_SANGKIEN) nth ON sk.MA_SANGKIEN = nth.MA_SANGKIEN" +
                " LEFT JOIN S_ORGANIZATION dv ON sk.MA_DON_VI_DAU_TU = dv.ORGID" +
                " WHERE 1=1"  +
                whereDT +
                " ) c ";
 //       if(export){
//
//        }else{
//            queryString +=" ORDER BY tenDeTaiSK ASC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
//        }

        List<ListData> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(ListData.class));
        return listObj;
    }

    @Override
    public List<ListData> ListThongKeSangKienCapDonVi(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception {
        String whereDT=" AND sk.MA_CAPDO IS NOT NULL";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(thongKeReq.getDonViChuTri())){
            whereDT += " AND sk.MA_DON_VI_CHU_TRI = :MA_DON_VI_CHU_TRI";
            parameters.addValue("MA_DON_VI_CHU_TRI",thongKeReq.getDonViChuTri());
        }
        if(Util.isNotEmpty(thongKeReq.getCapQuanLy())){
            whereDT += " AND sk.MA_CAPDO = :MA_CAPDO";
            parameters.addValue("MA_CAPDO",thongKeReq.getCapQuanLy());
        }
        if(Util.isNotEmpty(thongKeReq.getLinhVucNghienCuu())){
            whereDT += " AND sk.MA_SANGKIEN IN(SELECT MA_SANGKIEN FROM SK_SANGKIEN_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getLinhVucNghienCuu());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getPhanLoai())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getFromNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        if(Util.isNotEmpty(thongKeReq.getToNam())){
//            whereDT += " AND dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_LVUC_NCUU WHERE MA_LVUC_NCUU =:MA_LVUC_NCUU)";
//            parameters.addValue("MA_LVUC_NCUU",thongKeReq.getPhanLoai());
        }
        String queryString = "SELECT * FROM (" +
                " SELECT  'SANGKIEN' AS loaiDeTaiSK,sk.TEN_SANGKIEN tenDeTaiSK, cd.TEN_CAPDO capQuanLy,nth.TEN_NGUOI_THUC_HIEN tenChuNhiemTG, dv.ORGDESC donViChuTri,sk.NAM nam, sk.MA_DON_VI_DAU_TU maDonViChuTri FROM SK_SANGKIEN sk" +
                " LEFT JOIN SK_DM_CAPDO_SANG_KIEN cd ON sk.MA_CAPDO = cd.MA_CAPDO" +
                " LEFT JOIN (SELECT MA_SANGKIEN, STRING_AGG(TEN_NGUOI_THUC_HIEN,', ') TEN_NGUOI_THUC_HIEN FROM SK_SANGKIEN_NGUOI_THUC_HIEN WHERE MA_CHUC_DANH IN('CNHIEM','DCNHIEM') GROUP BY MA_SANGKIEN) nth ON sk.MA_SANGKIEN = nth.MA_SANGKIEN" +
                " LEFT JOIN S_ORGANIZATION dv ON sk.MA_DON_VI_DAU_TU = dv.ORGID" +
                " WHERE 1=1"  +
                whereDT +
                " ) c ";
//        if(export){
//
//        }else{
//            queryString +=" ORDER BY tenDeTaiSK ASC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
//        }

        List<ListData> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(ListData.class));
        return listObj;
    }

}
