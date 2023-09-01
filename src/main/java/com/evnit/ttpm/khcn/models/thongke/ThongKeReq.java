package com.evnit.ttpm.khcn.models.thongke;

import lombok.Data;

import java.util.List;

@Data
public class ThongKeReq {
    public String  loaiThongKe;
    public String  donViChuTri;
    public String  capQuanLy;
    public String linhVucNghienCuu;
    public String  phanLoai;
    public Integer  fromNam;
    public Integer  toNam;
}

