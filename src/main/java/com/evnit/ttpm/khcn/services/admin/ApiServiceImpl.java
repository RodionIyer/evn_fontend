package com.evnit.ttpm.khcn.services.admin;

import com.evnit.ttpm.khcn.models.admin.Q_Lst_Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

@Component
public class ApiServiceImpl implements ApiService {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public Q_Lst_Api findAPIById(String apiId) {
        Q_Lst_Api obj = null;
        String queryString = "SELECT [APIID]\n"
                + "      ,[ENDPOINT]\n"
                + "      ,[ENDPOINT_CLASS]\n"
                + "      ,[ENABLE]\n"
                + "      ,[ISFIX]\n"
                + "      ,[TIME_STAMP]\n"
                + "      ,[USER_CR_ID]\n"
                + "      ,[USER_CR_DTIME]\n"
                + "      ,[USER_MDF_ID]\n"
                + "      ,[USER_MDF_DTIME]\n"
                + "  FROM [dbo].[Q_LST_API] WHERE APIID=?\n";

        try {
            Map<String, Object> objResult = jdbcTemplate.queryForMap(queryString, apiId);

                obj = new Q_Lst_Api((Integer) objResult.get("APIID"),
                        (String) objResult.get("ENDPOINT"),
                        (String) objResult.get("ENDPOINT_CLASS"),
                        (Boolean) objResult.get("ENABLE"),
                        (Boolean) objResult.get("ISFIX"),
                        (Date) objResult.get("TIME_STAMP"),
                        (String) objResult.get("USER_CR_ID"),
                        (Date) objResult.get("USER_CR_DTIME"),
                        (String) objResult.get("USER_MDF_ID"),
                        (Date) objResult.get("USER_MDF_DTIME"));


        } catch (Exception e) {
            return null;
        }
        return obj;
    }

    @Override
    public Boolean existsAPIById(String apiId) {
        String s;
        s = "SELECT 1 FROM Q_LST_API WHERE APIID=?1";
        int i = jdbcTemplate.update(s, apiId);
        if (i <= 0) {
            return false;
        }
        return true;
    }

    @Override
    public Q_Lst_Api findAPIByEndPoint(String endpoint) {
        Q_Lst_Api obj = null;
        String queryString = "SELECT [APIID]\n"
                + "      ,[ENDPOINT]\n"
                + "      ,[ENDPOINT_CLASS]\n"
                + "      ,[ENABLE]\n"
                + "      ,[ISFIX]\n"
                + "      ,[TIME_STAMP]\n"
                + "      ,[USER_CR_ID]\n"
                + "      ,[USER_CR_DTIME]\n"
                + "      ,[USER_MDF_ID]\n"
                + "      ,[USER_MDF_DTIME]\n"
                + "  FROM [dbo].[Q_LST_API] WHERE ENDPOINT=?\n";

        try {
            Map<String, Object> objResult = jdbcTemplate.queryForMap(queryString, endpoint);

                obj = new Q_Lst_Api((Integer) objResult.get("APIID"),
                        (String) objResult.get("ENDPOINT"),
                        (String) objResult.get("ENDPOINT_CLASS"),
                        (Boolean) objResult.get("ENABLE"),
                        (Boolean) objResult.get("ISFIX"),
                        (Date) objResult.get("TIME_STAMP"),
                        (String) objResult.get("USER_CR_ID"),
                        (Date) objResult.get("USER_CR_DTIME"),
                        (String) objResult.get("USER_MDF_ID"),
                        (Date) objResult.get("USER_MDF_DTIME"));


        } catch (Exception e) {
            return null;
        }
        return obj;
    }

    @Override
    public Boolean insertAPI(Q_Lst_Api api) {
        String s;
        s = "INSERT INTO [dbo].[Q_LST_API]\n"
                + "           ([ENDPOINT]\n"
                + "      ,[ENDPOINT_CLASS]\n"
                + "           ,[ENABLE]\n"
                + "           ,[ISFIX]\n"
                + "           ,[TIME_STAMP]\n"
                + "           ,[USER_CR_ID]\n"
                + "           ,[USER_CR_DTIME]\n"
                + "           ,[USER_MDF_ID]\n"
                + "           ,[USER_MDF_DTIME])\n"
                + "     VALUES\n"
                + "           (?,?,?,?,?,?,?,?,?)";
        int i = jdbcTemplate.update(s, api.getEndpoint(), api.getEndpointClass(),
                api.getEnable(), api.getIsFix(),
                api.getTimeStamp(), api.getUserCrId(), api.getUserCrDate(),
                api.getUserMdfId(), api.getUserMdfDate());
        if (i <= 0) {
            return false;
        }
        return true;
    }

    ;

    @Override
    public Boolean deleteAPI(String apiId) {
        String s;
        s = "DELETE FROM Q_LST_API WHERE APIID=?1";
        int i = jdbcTemplate.update(s, apiId);
        if (i <= 0) {
            return false;
        }
        return true;
    }
;
}
