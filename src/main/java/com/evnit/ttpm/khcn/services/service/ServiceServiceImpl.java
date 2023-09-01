package com.evnit.ttpm.khcn.services.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Object> getServiceInfo(String serviceId) {
        String queryString = "SELECT * FROM [API_SERVICE] A LEFT JOIN [API_LST_OUTPUT] B ON (A.API_SERVICE_OUTPUTID=B.API_SERVICE_OUTPUTID)\n" + "WHERE A.API_SERVICEID=:serviceid";
        try {
            MapSqlParameterSource parameters = new MapSqlParameterSource().addValue("serviceid", serviceId);
            Map<String, Object> obj = jdbcTemplate.queryForMap(queryString, parameters);
            return obj;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<Map<String, Object>> getServiceInputInfo(String serviceId) {
        String queryString = "SELECT * FROM [API_SERVICE_INPUT] A LEFT JOIN [API_LST_INPUT] B ON (A.API_SERVICE_INPUTID = B.API_SERVICE_INPUTID)\n" + "WHERE A.API_SERVICEID=:serviceid";
        try {
            MapSqlParameterSource parameters = new MapSqlParameterSource().addValue("serviceid", serviceId);
            List<Map<String, Object>> obj = jdbcTemplate.queryForList(queryString, parameters);
            return obj;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Boolean checkAuthServiceInfo(String serviceId, String userId) {
        String queryString = "SELECT A.FUNCTIONID,B.API_SERVICEID,C.AUTHORITYID FROM Q_FUNCTION A LEFT JOIN Q_FUNCTION_SERVICE B ON (A.FUNCTIONID=B.FUNCTIONID) \n"
                + "LEFT JOIN Q_FUNCTION_SERVICE_AUTHORITY C ON (B.API_SERVICEID=C.API_SERVICEID)\n"
                + "WHERE B.API_SERVICEID=:serviceid AND A.[ENABLE]=1\n"
                + "AND (C.AUTHORITYID IS NULL OR C.AUTHORITYID IN (SELECT A.AUTHORITYID FROM Q_PQFUNCTION_ROLE_AUTHORITY A \n"
                + "WHERE A.ROLEID IN (SELECT ROLEID FROM Q_USER_ROLE WHERE USERID=:userId)))";
        try {
            MapSqlParameterSource parameters = new MapSqlParameterSource().addValue("serviceid", serviceId).addValue("userId", userId);
            List<Map<String, Object>> obj = jdbcTemplate.queryForList(queryString, parameters);
            if (obj == null || obj.isEmpty()) {
                return false;
            } else {
                if (!obj.isEmpty()) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * * * @param service * @param parameter * @return
     */
    @Override
    public Map<String, Object> execService(Map<String, Object> service, MapSqlParameterSource parameter) {
        Map<String, Object> mapResult = new HashMap<String, Object>();
        Object dataResult = null;
        String callProcedure = "";
        switch (service.get("API_SERVICE_TYPEID").toString()) {
            case "PROCEDURE":
                callProcedure = "execute ";
                break;
            case "FUNCTION":
                callProcedure = "SELECT ";
                break;
            case "SQL":
                callProcedure = "";
                break;
        }
        try {
            switch (service.get("API_SERVICE_OUTPUTID").toString()) {
                case "EXEC_NORESULT":
                    dataResult = jdbcTemplate.update(callProcedure + service.get("API_SERVICE_DATA").toString(), parameter);
                    break;
                case "JSON":
                    dataResult = jdbcTemplate.queryForMap(callProcedure + service.get("API_SERVICE_DATA").toString(), parameter);
                    break;
                case "JSON_LIST":
                    dataResult = jdbcTemplate.queryForList(callProcedure + service.get("API_SERVICE_DATA").toString(), parameter);
                    break;
                case "OBJECT":
                    dataResult = jdbcTemplate.queryForObject(callProcedure + service.get("API_SERVICE_DATA").toString(), parameter, Object.class);
                    break;
                case "OBJECT_LIST":
                    dataResult = jdbcTemplate.queryForList(callProcedure + service.get("API_SERVICE_DATA").toString(), parameter, Object.class);
                    break;
            }
            mapResult.put("Status", 1);
            mapResult.put("Message", "Thực thi lệnh thành công");
            mapResult.put("data", dataResult);
        } catch (Exception e) {
            mapResult.put("Status", 0);
            mapResult.put("Message", "Xảy ra lỗi khi thực thi câu lệnh");
        }
        return mapResult;
    }

    ;    @Override
    public Map<String, Object> getConnectInfoByTable(String MA_BANG) {
        String queryString = "SELECT * FROM [dbo].[BCTM_CAU_HINH_KET_NOI]\n" + "WHERE MA_KETNOI IN (\n" + "select MA_KETNOI from [dbo].[BCTM_BANG_DULIEU] WHERE MA_BANG=:MA_BANG)";
        try {
            MapSqlParameterSource parameters = new MapSqlParameterSource().addValue("MA_BANG", MA_BANG);
            Map<String, Object> obj = jdbcTemplate.queryForMap(queryString, parameters);
            return obj;
        } catch (Exception e) {
            return null;
        }
    }
;
}
