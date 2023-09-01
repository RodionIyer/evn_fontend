package com.evnit.ttpm.khcn.services.kehoach;

import com.evnit.ttpm.khcn.models.kehoach.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class ExcelServiceImpl  implements ExcelService {
    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    @Override
    public List<DonVi> getListDonVi(String orgId) {
        String queryString = "SELECT *,ORGID AS MA_NHOM,ORGDESC AS TEN_NHOM FROM S_ORGANIZATION WHERE [ENABLE] = 1 AND ORGID_PARENT = :ORGID ORDER BY ORGDESC ASC";
        try {
            MapSqlParameterSource parameters = new MapSqlParameterSource().addValue("ORGID", orgId);
            List<DonVi> obj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DonVi.class));
            return obj;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public DonVi getFirstDonVi(String orgId) {
        String queryString = "SELECT * FROM S_ORGANIZATION WHERE [ENABLE] = 1 AND ORGID = :ORGID";
        try {
            MapSqlParameterSource parameters = new MapSqlParameterSource().addValue("ORGID", orgId);
            List<DonVi> obj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DonVi.class));
            if(obj != null && obj.size() >0){
                return obj.get(0);
            }
        } catch (Exception e) {

        }
        return null;
    }

    @Override
    public List<DanhSachMau> getListDanhsachMau() {
        String queryString = "SELECT * FROM KH_KE_HOACH_MAU WHERE TRANG_THAI =1  ORDER BY STT ASC";
        try {
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            List<DanhSachMau> obj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachMau.class));
            return obj;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<NguonKinhPhi> getListNguonKinhPhi() {
        String queryString = "SELECT * FROM KH_DM_NGUON_KINH_PHI WHERE TRANG_THAI=1 ORDER BY SAP_XEP ASC";
        try {
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            List<NguonKinhPhi> obj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(NguonKinhPhi.class));
            return obj;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public KeHoach getFirstMaKeHoach(String maKeHoach) {
        String queryString = "SELECT * FROM KH_KE_HOACH WHERE MA_KE_HOACH = :maKeHoach";
        try {
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("maKeHoach",maKeHoach);
            List<KeHoach> obj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(KeHoach.class));
            if(obj  != null && obj.size() >0){
                return obj.get(0);
            }

        } catch (Exception e) {
            return null;
        }
        return null;
    }

    @Override
    public List<KeHoachChiTiet> getListKeHoachChiTiet(String maKeHoach) {
        String queryString = "SELECT * FROM KH_KE_HOACH_CHI_TIET WHERE MA_KE_HOACH= :maKeHoach";
        try {
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("maKeHoach",maKeHoach);
            List<KeHoachChiTiet> obj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(KeHoachChiTiet.class));
            return obj;
        } catch (Exception e) {
            return null;
        }
    }

}
