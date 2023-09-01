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
public class Q_Pqfunction_Role implements Serializable {

    protected Q_Pqfunction_RolePK q_Pqfunction_RolePK;
    private Boolean rInsert;
    private Boolean rEdit;
    private Boolean rDelete;
    private Boolean authLocal;
    private Boolean authInternet;
    private String userCrId;
    private Date userCrDtime;
    private String userMdfId;
    private Date userMdfDtime;

    public Q_Pqfunction_Role() {
    }

    public Q_Pqfunction_Role(Q_Pqfunction_RolePK q_Pqfunction_RolePK) {
        this.q_Pqfunction_RolePK = q_Pqfunction_RolePK;
    }

    public Q_Pqfunction_Role(String functionid, String roleid) {
        this.q_Pqfunction_RolePK = new Q_Pqfunction_RolePK(functionid, roleid);
    }

    public Q_Pqfunction_RolePK getQ_Pqfunction_RolePK() {
        return q_Pqfunction_RolePK;
    }

    public void setQ_Pqfunction_RolePK(Q_Pqfunction_RolePK q_Pqfunction_RolePK) {
        this.q_Pqfunction_RolePK = q_Pqfunction_RolePK;
    }

    public Boolean getRInsert() {
        return rInsert;
    }

    public void setRInsert(Boolean rInsert) {
        this.rInsert = rInsert;
    }

    public Boolean getREdit() {
        return rEdit;
    }

    public void setREdit(Boolean rEdit) {
        this.rEdit = rEdit;
    }

    public Boolean getRDelete() {
        return rDelete;
    }

    public void setRDelete(Boolean rDelete) {
        this.rDelete = rDelete;
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

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (q_Pqfunction_RolePK != null ? q_Pqfunction_RolePK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Q_Pqfunction_Role)) {
            return false;
        }
        Q_Pqfunction_Role other = (Q_Pqfunction_Role) object;
        if ((this.q_Pqfunction_RolePK == null && other.q_Pqfunction_RolePK != null) || (this.q_Pqfunction_RolePK != null && !this.q_Pqfunction_RolePK.equals(other.q_Pqfunction_RolePK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.evnit.ttpm.khcn.models.admin.Q_Pqfunction_Role[ q_Pqfunction_RolePK=" + q_Pqfunction_RolePK + " ]";
    }
    
}
