package com.evnit.ttpm.khcn.payload.response.service;

import com.evnit.ttpm.khcn.payload.response.AppResponse;

import java.util.HashMap;
import java.util.List;

public class KhaiThacDuLieuDataResponse extends AppResponse {

    private List<HashMap<String, String>> rowData;
    private Long rowCount;

    public KhaiThacDuLieuDataResponse(int status, String message) {
        super(status, message);
    }

    public KhaiThacDuLieuDataResponse(List<HashMap<String, String>> rowData, Long rowCount, int status, String message) {
        super(status, message);
        this.rowData = rowData;
        this.rowCount = rowCount;
    }

    public Object getRowData() {
        return rowData;
    }

    public void setRowData(List<HashMap<String, String>> rowData) {
        this.rowData = rowData;
    }

    public Long getRowCount() {
        return rowCount;
    }

    public void setRowCount(Long rowCount) {
        this.rowCount = rowCount;
    }
}
