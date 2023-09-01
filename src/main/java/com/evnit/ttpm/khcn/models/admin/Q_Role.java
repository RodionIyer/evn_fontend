package com.evnit.ttpm.khcn.models.admin;


public class Q_Role {

    private String roleId;
    private String roleDesc;

    public Q_Role() {
    }

    public Q_Role(String roleId, String roleDesc) {
        this.roleId = roleId;
        this.roleDesc = roleDesc;
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getRoleDesc() {
        return roleDesc;
    }

    public void setRoleDesc(String roleDesc) {
        this.roleDesc = roleDesc;
    }

}
