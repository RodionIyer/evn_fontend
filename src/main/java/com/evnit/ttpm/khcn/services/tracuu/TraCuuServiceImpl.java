package com.evnit.ttpm.khcn.services.tracuu;

import com.evnit.ttpm.khcn.models.detai.DanhSachChung;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuReq;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuResp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TraCuuServiceImpl implements TraCuuService {
    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;


    @Override
    public List<TraCuuResp> ListTraCuu(TraCuuReq traCuuReq, String page, String pageSize,String userId,String orgId) throws Exception {
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
                " ) c ORDER BY tenDeTaiSK ASC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<TraCuuResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(TraCuuResp.class));
        return listObj;
    }


}
