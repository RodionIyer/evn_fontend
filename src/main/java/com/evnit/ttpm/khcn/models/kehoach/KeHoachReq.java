package com.evnit.ttpm.khcn.models.kehoach;

import lombok.Data;

@Data
public class KeHoachReq {
    private String maKeHoach;
    private String name;
    private Integer nam;
    private String maDonVi;
    private String maTrangThai;
    private String nguoiTao;
    private String ngayTao;
    private String nguoiSua;
    private String yKienNguoiPheDuyet;
    private String tenBangTongHop;
    private String kyTongHop;
    private String capTao;
    private Boolean tongHop;

}
