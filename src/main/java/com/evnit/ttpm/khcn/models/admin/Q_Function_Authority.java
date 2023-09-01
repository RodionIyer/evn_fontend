/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.evnit.ttpm.khcn.models.admin;

import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author Admin
 */

public class Q_Function_Authority implements Serializable {


    private String authorityid;
    private String functionid;
    private String authorityName;
    private Integer authorityOrd;
    private boolean enable;
    private String userCrId;
    private Date userCrDtime;
    private String userMdfId;
    private Date userMdfDtime;
    private Boolean daXoa;

    public Q_Function_Authority() {
    }

    public Q_Function_Authority(String authorityid) {
        this.authorityid = authorityid;
    }

    public Q_Function_Authority(String authorityid, String functionid, boolean enable) {
        this.authorityid = authorityid;
        this.functionid = functionid;
        this.enable = enable;
    }

    public String getAuthorityid() {
        return authorityid;
    }

    public void setAuthorityid(String authorityid) {
        this.authorityid = authorityid;
    }

    public String getFunctionid() {
        return functionid;
    }

    public void setFunctionid(String functionid) {
        this.functionid = functionid;
    }

    public String getAuthorityName() {
        return authorityName;
    }

    public void setAuthorityName(String authorityName) {
        this.authorityName = authorityName;
    }

    public Integer getAuthorityOrd() {
        return authorityOrd;
    }

    public void setAuthorityOrd(Integer authorityOrd) {
        this.authorityOrd = authorityOrd;
    }

    public boolean getEnable() {
        return enable;
    }

    public void setEnable(boolean enable) {
        this.enable = enable;
    }

    public String getUserCrId() {
        return userCrId;
    }

    public void setUserCrId(String userCrId) {
        this.userCrId = userCrId;
    }

    public Date getUserCrDtime() {
        return userCrDtime;
    }

    public void setUserCrDtime(Date userCrDtime) {
        this.userCrDtime = userCrDtime;
    }

    public String getUserMdfId() {
        return userMdfId;
    }

    public void setUserMdfId(String userMdfId) {
        this.userMdfId = userMdfId;
    }

    public Date getUserMdfDtime() {
        return userMdfDtime;
    }

    public void setUserMdfDtime(Date userMdfDtime) {
        this.userMdfDtime = userMdfDtime;
    }

    public Boolean getDaXoa() {
        return daXoa;
    }

    public void setDaXoa(Boolean daXoa) {
        this.daXoa = daXoa;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (authorityid != null ? authorityid.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Q_Function_Authority)) {
            return false;
        }
        Q_Function_Authority other = (Q_Function_Authority) object;
        if ((this.authorityid == null && other.authorityid != null) || (this.authorityid != null && !this.authorityid.equals(other.authorityid))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.evnit.ttpm.khcn.models.admin.Q_Function_Authority[ authorityid=" + authorityid + " ]";
    }
    
}
