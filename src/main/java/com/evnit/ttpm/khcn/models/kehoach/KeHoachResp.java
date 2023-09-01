package com.evnit.ttpm.khcn.models.kehoach;

import com.evnit.ttpm.khcn.models.BaseModel;
import lombok.Data;

import java.util.List;

@Data
public class KeHoachResp  extends BaseModel {
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
	private String tenTrangThai;
	private String ngayGui;
	private String nguoiGui;
    private Boolean tongHop;
    private List<KeHoachChiTietReq> listKeHoach;
    private List<FileReq> listFile;
}
