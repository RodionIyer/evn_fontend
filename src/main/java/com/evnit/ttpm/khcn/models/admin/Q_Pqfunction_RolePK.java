package com.evnit.ttpm.khcn.models.admin;

import java.io.Serializable;
/**
 *
 * @author Admin
 */
public class Q_Pqfunction_RolePK implements Serializable {
    private String functionid;
    private String roleid;

    public Q_Pqfunction_RolePK() {
    }

    public Q_Pqfunction_RolePK(String functionid, String roleid) {
        this.functionid = functionid;
        this.roleid = roleid;
    }

    public String getFunctionid() {
        return functionid;
    }

    public void setFunctionid(String functionid) {
        this.functionid = functionid;
    }

    public String getRoleid() {
        return roleid;
    }

    public void setRoleid(String roleid) {
        this.roleid = roleid;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (functionid != null ? functionid.hashCode() : 0);
        hash += (roleid != null ? roleid.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Q_Pqfunction_RolePK)) {
            return false;
        }
        Q_Pqfunction_RolePK other = (Q_Pqfunction_RolePK) object;
        if ((this.functionid == null && other.functionid != null) || (this.functionid != null && !this.functionid.equals(other.functionid))) {
            return false;
        }
        if ((this.roleid == null && other.roleid != null) || (this.roleid != null && !this.roleid.equals(other.roleid))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.evnit.ttpm.khcn.models.admin.Q_Pqfunction_RolePK[ functionid=" + functionid + ", roleid=" + roleid + " ]";
    }
    
}
