package com.evnit.ttpm.khcn.models.admin;

import java.util.Date;

public class Q_User_Role {

    private String userid;

    private String roleid;

    private Boolean enable;

    private String userCrId;

    private Date userCrDate;

    private String userMdfId;

    private String userMdfDate;

    public Q_User_Role() {
    }

    public Q_User_Role(String userid, String roleid, Boolean enable, String userCrId, Date userCrDate, String userMdfId, String userMdfDate) {
        this.userid = userid;
        this.roleid = roleid;
        this.enable = enable;
        this.userCrId = userCrId;
        this.userCrDate = userCrDate;
        this.userMdfId = userMdfId;
        this.userMdfDate = userMdfDate;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getRoleid() {
        return roleid;
    }

    public void setRoleid(String roleid) {
        this.roleid = roleid;
    }

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }

    public String getUserCrId() {
        return userCrId;
    }

    public void setUserCrId(String userCrId) {
        this.userCrId = userCrId;
    }

    public Date getUserCrDate() {
        return userCrDate;
    }

    public void setUserCrDate(Date userCrDate) {
        this.userCrDate = userCrDate;
    }

    public String getUserMdfId() {
        return userMdfId;
    }

    public void setUserMdfId(String userMdfId) {
        this.userMdfId = userMdfId;
    }

    public String getUserMdfDate() {
        return userMdfDate;
    }

    public void setUserMdfDate(String userMdfDate) {
        this.userMdfDate = userMdfDate;
    }

}
