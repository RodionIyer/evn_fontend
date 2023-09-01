package com.evnit.ttpm.khcn.services.custom;

import com.evnit.ttpm.khcn.models.admin.Q_Lst_Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;
import java.util.Random;

@Component
public class CustomServiceImpl implements CustomService {

    @Autowired
    JdbcTemplate jdbcTemplate;
    @Override
    public String generatingRandomAlphabeticString(int length) {
        int leftLimit = 97; // letter 'a'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = length;
        Random random = new Random();

        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        return generatedString;
    }
    @Override
    public boolean taoKhoaCapNhatNguoiThucHien(String maNguoiThucHien, String tokenLink, String tokenAccept) {
        String queryString = "SELECT * FROM DM_NGUOI_THUC_HIEN WHERE MA_NGUOI_THUC_HIEN=?";

        try {
            Map<String, Object> objResult = jdbcTemplate.queryForMap(queryString, maNguoiThucHien);
            if (objResult != null) {
                String queryStringUpdate = "UPDATE DM_NGUOI_THUC_HIEN SET TOKEN_LINK=?,TOKEN_ACCEPT=? WHERE MA_NGUOI_THUC_HIEN=?";
                if (jdbcTemplate.update(queryStringUpdate, tokenLink, tokenAccept, maNguoiThucHien) > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }


        } catch (Exception e) {
            return false;
        }
    }

    /*@Override
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
;*/
}
