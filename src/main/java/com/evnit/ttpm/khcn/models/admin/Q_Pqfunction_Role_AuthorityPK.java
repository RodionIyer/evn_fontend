/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.evnit.ttpm.khcn.models.admin;

import java.io.Serializable;

/**
 *
 * @author Admin
 */
public class Q_Pqfunction_Role_AuthorityPK implements Serializable {

    private String roleid;
    private String authorityid;

    public Q_Pqfunction_Role_AuthorityPK() {
    }

    public Q_Pqfunction_Role_AuthorityPK(String roleid, String authorityid) {
        this.roleid = roleid;
        this.authorityid = authorityid;
    }

    public String getRoleid() {
        return roleid;
    }

    public void setRoleid(String roleid) {
        this.roleid = roleid;
    }

    public String getAuthorityid() {
        return authorityid;
    }

    public void setAuthorityid(String authorityid) {
        this.authorityid = authorityid;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (roleid != null ? roleid.hashCode() : 0);
        hash += (authorityid != null ? authorityid.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Q_Pqfunction_Role_AuthorityPK)) {
            return false;
        }
        Q_Pqfunction_Role_AuthorityPK other = (Q_Pqfunction_Role_AuthorityPK) object;
        if ((this.roleid == null && other.roleid != null) || (this.roleid != null && !this.roleid.equals(other.roleid))) {
            return false;
        }
        if ((this.authorityid == null && other.authorityid != null) || (this.authorityid != null && !this.authorityid.equals(other.authorityid))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.evnit.ttpm.khcn.models.admin.Q_Pqfunction_Role_AuthorityPK[ roleid=" + roleid + ", authorityid=" + authorityid + " ]";
    }
    
}
