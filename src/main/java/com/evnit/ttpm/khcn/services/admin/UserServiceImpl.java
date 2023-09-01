package com.evnit.ttpm.khcn.services.admin;

import com.evnit.ttpm.khcn.models.admin.ERole;
import com.evnit.ttpm.khcn.models.admin.Q_Role;
import com.evnit.ttpm.khcn.models.admin.Q_User;
import com.evnit.ttpm.khcn.models.system.FunctionGrant;
import com.evnit.ttpm.khcn.services.system.SystemCommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class UserServiceImpl implements UserService {

    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    SystemCommonService systemCommonService;

    @Override
    public Q_User findQ_UserById(String userId) {
        Q_User sQ_User = null;
        // if (keyControlInfo!=null)

        // Optional<S_Key_Control> optional = repository.findById(keyControlInfo.getTable().toUpperCase());
        String queryStringUser = "SELECT [USERID]\n"
                + "      ,[USERNAME]\n"
                + "      ,[PASSWORD]\n"
                + "      ,[DESCRIPT]\n"
                + "      ,[MA_NHAN_VIEN]\n"
                + "      ,A.[ORGID]\n"
                + "      ,B.[ORGDESC]\n"
                + "      ,[LOCAL]\n"
                + "      ,[MOBILE]\n"
                + "      ,[EMAIL]\n"
                + "      ,[OFFICEID]\n"
                + "      ,[USERID_DOMAIN]\n"
                + "      ,[DOMAINID]\n"
                + "      ,A.[ENABLE]\n"
                + "      ,A.[USER_CR_ID]\n"
                + "      ,A.[USER_CR_DTIME]\n"
                + "      ,A.[USER_MDF_ID]\n"
                + "      ,A.[USER_MDF_DTIME]\n"
                + " FROM Q_USER A LEFT JOIN S_ORGANIZATION B ON (A.ORGID=B.ORGID) WHERE USERID=?";

        try {
            Map<String, Object> obj = jdbcTemplate.queryForMap(queryStringUser, userId);
            if (obj != null) {
                sQ_User = new Q_User(
                        (String) obj.get("USERID"),
                        (String) obj.get("USERNAME"),
                        (String) obj.get("PASSWORD"),
                        (String) obj.get("DESCRIPT"),
                        (String) obj.get("MA_NHAN_VIEN"),
                        (String) obj.get("ORGID"),
                        (String) obj.get("ORGDESC"),
                        (Boolean) obj.get("LOCAL"),
                        (String) obj.get("MOBILE"),
                        (String) obj.get("EMAIL"),
                        (String) obj.get("OFFICEID"),
                        (String) obj.get("USERID_DOMAIN"),
                        (String) obj.get("DOMAINID"),
                        (Boolean) obj.get("ENABLE"),
                        (String) obj.get("USER_CR_ID"),
                        (Date) obj.get("USER_CR_DTIME"),
                        (String) obj.get("USER_MDF_ID"),
                        (Date) obj.get("USER_MDF_DTIME"),
                        null);
                List<Q_Role> lstRole = new ArrayList<Q_Role>();
                if (userId.equals("admin")) {
                    Q_Role role = new Q_Role(ERole.ROLE_ADMIN.name(), "Nhóm quyền quản trị");
                    lstRole.add(role);
                    role = new Q_Role(ERole.ROLE_API.name(), "Nhóm quyền người dùng");
                    lstRole.add(role);
                    sQ_User.setRoles(lstRole);
                } else {
                    Q_Role role = new Q_Role(ERole.ROLE_API.name(), "Nhóm quyền người dùng");
                    lstRole.add(role);
                    sQ_User.setRoles(lstRole);
                }
                /*String queryStringRole = "SELECT [ROLEID]\n"
                        + "      ,[ROLEDESC]\n"
                        + "      ,[ENABLE]\n"
                        + "      ,[ISFIX]\n"
                        + "      ,[ROLECODE]\n"
                        + "      ,[ROLEORD]\n"
                        + "      ,[USER_CR_ID]\n"
                        + "      ,[USER_CR_DTIME]\n"
                        + "      ,[USER_MDF_ID]\n"
                        + "      ,[USER_MDF_DTIME]\n"
                        + "  FROM [dbo].[Q_ROLES] WHERE ROLEID IN (SELECT ROLEID FROM Q_USER_ROLE WHERE USERID=?)";

                try {
                    List<Map<String, Object>> objResultRole = jdbcTemplate.queryForList(queryStringRole, userId);

                    if (objResultRole != null) {
                        List<Q_Roles> lstQ_Roles = new ArrayList<Q_Roles>();
                        Q_Role sRole = null;
                        for (Map<String, Object> obj : objResultRole) {
                            sRole = new Q_Role((String) obj.get("ROLEID"),
                                    (String) obj.get("ROLEDESC"),
                                    (Boolean) obj.get("ENABLE"),
                                    (Boolean) obj.get("ISFIX"),
                                    (String) obj.get("ROLECODE"),
                                    (Integer) obj.get("ROLEORD"),
                                    (String) obj.get("USER_CR_ID"),
                                    (Date) obj.get("USER_CR_DTIME"),
                                    (String) obj.get("USER_MDF_ID"),
                                    (Date) obj.get("USER_MDF_DTIME"));
                            lstQ_Roles.add(sRole);
                        }
                        sQ_User.setRoles(lstQ_Roles);

                    }
                } catch (Exception e) {
                    return null;
                }
                 */
            }
        } catch (Exception e) {
            return null;
        }
        return sQ_User;
    }

    @Override
    public List<FunctionGrant> getListFunctionGrantByUser(String userId) {
        List<FunctionGrant> lstResult = new ArrayList<>();
        FunctionGrant objResult;
        String queryString = "SELECT [FUNCTIONID]\n"
                + "      ,[FUNCTIONNAME],[LINK]\n"
                + "	,MAX(R_INSERT) R_INSERT,MAX(R_EDIT) R_EDIT,MAX(R_DELETE) R_DELETE FROM (SELECT A.[FUNCTIONID]\n"
                + "      ,[FUNCTIONNAME],[LINK]\n"
                + "	,1 R_INSERT,1 R_EDIT,1 R_DELETE\n"
                + "  FROM [dbo].[Q_FUNCTION] A WHERE A.ENABLE=1 AND A.ISPUPLIC=1\n"
                + "UNION ALL\n"
                + "SELECT A.[FUNCTIONID]\n"
                + "      ,[FUNCTIONNAME],[LINK]\n"
                + "	,ISNULL(B.R_INSERT,0) R_INSERT,ISNULL(B.R_EDIT,0) R_EDIT,ISNULL(B.R_DELETE,0) R_DELETE\n"
                + "  FROM [dbo].[Q_FUNCTION] A LEFT JOIN [dbo].[Q_PQFUNCTION_USER] B ON (A.FUNCTIONID=B.FUNCTIONID)\n"
                + "  WHERE B.USERID=? AND A.ENABLE=1\n"
                + "UNION ALL\n"
                + "SELECT A.[FUNCTIONID]\n"
                + "      ,[FUNCTIONNAME],[LINK]\n"
                + "	,ISNULL(B.R_INSERT,0) R_INSERT,ISNULL(B.R_EDIT,0) R_EDIT,ISNULL(B.R_DELETE,0) R_DELETE\n"
                + "  FROM [dbo].[Q_FUNCTION] A LEFT JOIN [dbo].[Q_PQFUNCTION_ROLE] B ON (A.FUNCTIONID=B.FUNCTIONID)\n"
                + "  WHERE B.ROLEID IN (SELECT ROLEID FROM Q_USER_ROLE WHERE USERID=?) AND A.ENABLE=1) A\n"
                + "  GROUP BY [FUNCTIONID]\n"
                + "      ,[FUNCTIONNAME],[LINK]";

        try {
            List<Map<String, Object>> objResultFunction = jdbcTemplate.queryForList(queryString, userId, userId);
            if (objResultFunction != null) {

                for (Map<String, Object> obj : objResultFunction) {
                    objResult = new FunctionGrant((String) obj.get("FUNCTIONID"),
                            (String) obj.get("FUNCTIONNAME"),
                            (String) obj.get("LINK"),
                            (((Integer) obj.get("R_INSERT")) > 0),
                            (((Integer) obj.get("R_EDIT")) > 0),
                            (((Integer) obj.get("R_DELETE")) > 0), null);
                    lstResult.add(objResult);
                }

            }
        } catch (Exception e) {
            return null;
        }
        return lstResult;
    }

    ;
    @Override
    public Boolean existsQ_UserById(String userId) {
        String s;
        s = "SELECT 1 FROM Q_USER WHERE USERID=?";
        int i = jdbcTemplate.update(s, userId);
        if (i <= 0) {
            return false;
        }
        return true;
    }

}
