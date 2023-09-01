package com.evnit.ttpm.khcn.payload.response.admin;

import com.evnit.ttpm.khcn.models.system.FunctionGrant;
import com.evnit.ttpm.khcn.payload.response.AppResponse;

import java.util.List;

public class UserInfoResponse extends AppResponse {

    private String userId;
    private String userName;
    private String descript;
    private String userIdhrms;
    private String ORGID;
    private String ORGDESC;
    private List<String> roles;
    private List<FunctionGrant> fgrant;

    public UserInfoResponse(int status, String message) {
        super(status, message);
    }

    public UserInfoResponse(String userId, String userName, String descript, String userIdhrms, String ORGID, String ORGDESC, List<String> roles, List<FunctionGrant> fgrant, int status, String message) {
        super(status, message);
        this.userId = userId;
        this.userName = userName;
        this.descript = descript;
        this.userIdhrms = userIdhrms;
        this.ORGID = ORGID;
        this.ORGDESC = ORGDESC;
        this.roles = roles;
        this.fgrant = fgrant;

    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDescript() {
        return descript;
    }

    public void setDescript(String descript) {
        this.descript = descript;
    }

    public String getUserIdhrms() {
        return userIdhrms;
    }

    public void setUserIdhrms(String userIdhrms) {
        this.userIdhrms = userIdhrms;
    }

    public String getORGID() {
        return ORGID;
    }

    public void setORGID(String ORGID) {
        this.ORGID = ORGID;
    }

    public String getORGDESC() {
        return ORGDESC;
    }

    public void setORGDESC(String ORGDESC) {
        this.ORGDESC = ORGDESC;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public List<FunctionGrant> getFgrant() {
        return fgrant;
    }

    public void setFgrant(List<FunctionGrant> fgrant) {
        this.fgrant = fgrant;
    }

}
