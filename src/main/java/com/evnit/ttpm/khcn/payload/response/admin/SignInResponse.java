package com.evnit.ttpm.khcn.payload.response.admin;

import com.evnit.ttpm.khcn.payload.response.AppResponse;


public class SignInResponse extends AppResponse {

    private String token;
    private UserInfoResponse userInfo;

    public SignInResponse(int status, String message) {
        super(status, message);
    }

    public SignInResponse(String token, UserInfoResponse userInfo, int status, String message) {
        super(status, message);
        this.token = token;
        this.userInfo = userInfo;
    }




    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }


    public UserInfoResponse getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfoResponse userInfo) {
        this.userInfo = userInfo;
    }

}
