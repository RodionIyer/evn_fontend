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
public class Q_Function implements Serializable {
    private String functionid;
    private String functionname;
    private String functionnameSub;
    private String functionType;
    private String link;
    private String icon;
    private Boolean functionExternal;
    private String functionExternalTarget;
    private String functionParentId;
    private boolean enable;
    private Boolean ispuplic;
    private Integer functionord;
    private Boolean authLocal;
    private Boolean authInternet;
    private String appid;
    private String userCrId;
    private Date userCrDtime;
    private String userMdfId;
    private Date userMdfDtime;
    private Boolean daXoa;

    public Q_Function() {
    }

    public Q_Function(String functionid) {
        this.functionid = functionid;
    }

    public Q_Function(String functionid, boolean enable) {
        this.functionid = functionid;
        this.enable = enable;
    }

    public String getFunctionid() {
        return functionid;
    }

    public void setFunctionid(String functionid) {
        this.functionid = functionid;
    }

    public String getFunctionname() {
        return functionname;
    }

    public void setFunctionname(String functionname) {
        this.functionname = functionname;
    }

    public String getFunctionnameSub() {
        return functionnameSub;
    }

    public void setFunctionnameSub(String functionnameSub) {
        this.functionnameSub = functionnameSub;
    }

    public String getFunctionType() {
        return functionType;
    }

    public void setFunctionType(String functionType) {
        this.functionType = functionType;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Boolean getFunctionExternal() {
        return functionExternal;
    }

    public void setFunctionExternal(Boolean functionExternal) {
        this.functionExternal = functionExternal;
    }

    public String getFunctionExternalTarget() {
        return functionExternalTarget;
    }

    public void setFunctionExternalTarget(String functionExternalTarget) {
        this.functionExternalTarget = functionExternalTarget;
    }

    public String getFunctionParentId() {
        return functionParentId;
    }

    public void setFunctionParentId(String functionParentId) {
        this.functionParentId = functionParentId;
    }

    public boolean getEnable() {
        return enable;
    }

    public void setEnable(boolean enable) {
        this.enable = enable;
    }

    public Boolean getIspuplic() {
        return ispuplic;
    }

    public void setIspuplic(Boolean ispuplic) {
        this.ispuplic = ispuplic;
    }

    public Integer getFunctionord() {
        return functionord;
    }

    public void setFunctionord(Integer functionord) {
        this.functionord = functionord;
    }

    public Boolean getAuthLocal() {
        return authLocal;
    }

    public void setAuthLocal(Boolean authLocal) {
        this.authLocal = authLocal;
    }

    public Boolean getAuthInternet() {
        return authInternet;
    }

    public void setAuthInternet(Boolean authInternet) {
        this.authInternet = authInternet;
    }

    public String getAppid() {
        return appid;
    }

    public void setAppid(String appid) {
        this.appid = appid;
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
        hash += (functionid != null ? functionid.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Q_Function)) {
            return false;
        }
        Q_Function other = (Q_Function) object;
        if ((this.functionid == null && other.functionid != null) || (this.functionid != null && !this.functionid.equals(other.functionid))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.evnit.ttpm.khcn.models.admin.Q_Function[ functionid=" + functionid + " ]";
    }
    
}
