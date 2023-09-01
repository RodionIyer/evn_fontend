package com.evnit.ttpm.khcn.models.detai;

import lombok.Data;

import java.util.Date;

@Data
public class UserResp {
    private String userId;
    private String maNhanVien;
    private String orgId;
    private String orgName;
    private String username;
    private Double nsId;
    private String maHocHam;
    private Integer namHocHam;
    private String maHocVi;
    private Integer namHocVi;
    private String email;
    private String sdt;
    private String noiLamViec;
    private String diaChiLamViec;
    private Boolean trangThaiXacMinh;
   // private Date ngayXacMinh;
    private Boolean chuyenGia;
    private Boolean ngoaiEvn;
    private Integer namSinh;
    private Integer gioiTinh;
    private String cccd;

}
