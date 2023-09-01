package com.evnit.ttpm.khcn.models.tracuu;

import com.evnit.ttpm.khcn.models.BaseModel;
import com.evnit.ttpm.khcn.models.detai.DanhSachThanhVien;
import com.evnit.ttpm.khcn.models.detai.Folder;
import com.evnit.ttpm.khcn.models.kehoach.FileReq;
import lombok.Data;

import java.util.List;

@Data
public class TraCuuResp  extends BaseModel {
    public String maDeTaiSK;
    public String loaiDeTaiSK;
    public String hoatDongKeHoach;
    public String  tenDeTaiSK;
    public String  capQuanLy;
    public String  tenChuNhiemTG;
    public Integer  nam;
    public String  donViChuTri;
}
