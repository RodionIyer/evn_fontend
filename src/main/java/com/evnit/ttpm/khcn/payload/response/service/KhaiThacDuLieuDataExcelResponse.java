package com.evnit.ttpm.khcn.payload.response.service;

import com.evnit.ttpm.khcn.payload.response.AppResponse;

public class KhaiThacDuLieuDataExcelResponse extends AppResponse {

    private Object dataExcel;
    private String fileName;

    public KhaiThacDuLieuDataExcelResponse(int status, String message) {
        super(status, message);
    }

    public KhaiThacDuLieuDataExcelResponse(Object dataExcel, String fileName, int status, String message) {
        super(status, message);
        this.dataExcel = dataExcel;
        this.fileName = fileName;
    }

    public Object getDataExcel() {
        return dataExcel;
    }

    public void setDataExcel(Object dataExcel) {
        this.dataExcel = dataExcel;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

}
