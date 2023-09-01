package com.evnit.ttpm.khcn.models.kehoach;

import lombok.Data;

import java.util.Date;

@Data
public class FileReq {
    private String maLoaiFile;
    private String fileName;
    private String base64;
    private Long size;
    private String sovanban;
    private Date ngayVanBan;
    private String mafile;
    private String duongDan;
    private String nguoiTao;
    private String nguoiSua;
    private String rowid;
    private Date ngayTao;
    private String maKeHoach;
    private String maDeTai;
    private String kieuFile;
    private String loaiFile;
}
