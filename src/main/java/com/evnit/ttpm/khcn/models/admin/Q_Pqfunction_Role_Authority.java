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

public class Q_Pqfunction_Role_Authority implements Serializable {

    protected Q_Pqfunction_Role_AuthorityPK q_Pqfunction_Role_AuthorityPK;
    private String userCrId;
    private Date userCrDtime;
    private String userMdfId;
    private Date userMdfDtime;

    public Q_Pqfunction_Role_Authority() {
    }

    public Q_Pqfunction_Role_Authority(Q_Pqfunction_Role_AuthorityPK q_Pqfunction_Role_AuthorityPK) {
        this.q_Pqfunction_Role_AuthorityPK = q_Pqfunction_Role_AuthorityPK;
    }

    public Q_Pqfunction_Role_Authority(String roleid, String authorityid) {
        this.q_Pqfunction_Role_AuthorityPK = new Q_Pqfunction_Role_AuthorityPK(roleid, authorityid);
    }

    public Q_Pqfunction_Role_AuthorityPK getQ_Pqfunction_Role_AuthorityPK() {
        return q_Pqfunction_Role_AuthorityPK;
    }

    public void setQ_Pqfunction_Role_AuthorityPK(Q_Pqfunction_Role_AuthorityPK q_Pqfunction_Role_AuthorityPK) {
        this.q_Pqfunction_Role_AuthorityPK = q_Pqfunction_Role_AuthorityPK;
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
        hash += (q_Pqfunction_Role_AuthorityPK != null ? q_Pqfunction_Role_AuthorityPK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Q_Pqfunction_Role_Authority)) {
            return false;
        }
        Q_Pqfunction_Role_Authority other = (Q_Pqfunction_Role_Authority) object;
        if ((this.q_Pqfunction_Role_AuthorityPK == null && other.q_Pqfunction_Role_AuthorityPK != null) || (this.q_Pqfunction_Role_AuthorityPK != null && !this.q_Pqfunction_Role_AuthorityPK.equals(other.q_Pqfunction_Role_AuthorityPK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.evnit.ttpm.khcn.models.admin.Q_Pqfunction_Role_Authority[ q_Pqfunction_Role_AuthorityPK=" + q_Pqfunction_Role_AuthorityPK + " ]";
    }
    
}
