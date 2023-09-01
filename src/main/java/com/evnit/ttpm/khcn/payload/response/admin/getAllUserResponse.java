package com.evnit.ttpm.khcn.payload.response.admin;

import com.evnit.ttpm.khcn.models.admin.Q_User;
import com.evnit.ttpm.khcn.payload.response.AppResponse;

import java.util.List;

public class getAllUserResponse extends AppResponse {

    private List<Q_User> lstUser;

    public getAllUserResponse(int status, String message) {
        super(status, message);
    }

    public getAllUserResponse(List<Q_User> lstUser, int status, String message) {
        super(status, message);
        this.lstUser = lstUser;
    }

    public List<Q_User> getLstUser() {
        return lstUser;
    }

    public void setLstUser(List<Q_User> lstUser) {
        this.lstUser = lstUser;
    }

}
