package com.evnit.ttpm.khcn.payload.response;

public class AppResponse {

    private int status; //1: Thành công;0 Lỗi
    private String message;

    public AppResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }


}
