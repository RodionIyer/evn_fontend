package com.evnit.ttpm.khcn.services.detai;

import com.evnit.ttpm.khcn.models.detai.*;
import com.evnit.ttpm.khcn.models.kehoach.FileReq;
import com.evnit.ttpm.khcn.models.kehoach.KeHoachChiTietReq;
import com.evnit.ttpm.khcn.models.kehoach.KeHoachResp;
import com.evnit.ttpm.khcn.models.kehoach.LichSuKeHoach;
import com.evnit.ttpm.khcn.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Component
public class DeTaiServiceImpl implements DeTaiService {
    @Autowired
    NamedParameterJdbcTemplate jdbcTemplate;


    @Override
    public int insert(DeTaiReq deTaiReq,String maDeTai) throws Exception {
        String maKeHoach ="";
        Date fromDate =null;
        if(Util.isNotEmpty(deTaiReq.getThoiGianThucHienTu())) {
            //Timestamp ts = new Timestamp(System.currentTimeMillis());
            fromDate = deTaiReq.getThoiGianThucHienTu();
        }
        Date toDate =null;
        if(Util.isNotEmpty(deTaiReq.getThoiGianThucHienDen())) {
            //Timestamp ts = new Timestamp(System.currentTimeMillis());
            toDate = deTaiReq.getThoiGianThucHienDen();
        }

        String queryString = "INSERT INTO [dbo].[DT_DE_TAI]([MA_DETAI],[TEN_DETAI],[MA_KE_HOACH],[MA_CAPDO],[VAN_BAN],[MA_DON_VI_CHU_TRI],[THOI_GIAN_BAT_DAU]," +
                "[THOI_GIAN_KET_THUC],[MA_NGUON_KINH_PHI],[TONG_KINH_PHI],[MA_PHUONG_THUC_KHOAN],[KINH_PHI_KHOAN],[KINH_PHI_KHONG_KHOAN],[TINH_CAP_THIET],[MUC_TIEU]," +
                "[NHIEM_VU],[KET_QUA_DU_KIEN],[KIEN_NGHI_DE_XUAT],[KET_LUAN_HOI_DONG_XET_DUYET],[MA_KET_QUA_NGHIEM_THU],[KET_QUA_THUC_TE_NGHIEM_THU]," +
                "[TON_TAI_KHAC_PHUC_NGHIEM_THU],[DIEM_NGHIEM_THU],[MA_TRANG_THAI],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA],[DA_XOA])    \n" +
                "VALUES(:MA_DETAI,:TEN_DETAI, :MA_KE_HOACH,:MA_CAPDO,:VAN_BAN,:MA_DON_VI_CHU_TRI,:THOI_GIAN_BAT_DAU,:THOI_GIAN_KET_THUC,:MA_NGUON_KINH_PHI," +
                ":TONG_KINH_PHI,:MA_PHUONG_THUC_KHOAN,:KINH_PHI_KHOAN,:KINH_PHI_KHONG_KHOAN,:TINH_CAP_THIET,:MUC_TIEU,:NHIEM_VU,:KET_QUA_DU_KIEN,:KIEN_NGHI_DE_XUAT," +
                ":KET_LUAN_HOI_DONG_XET_DUYET,:MA_KET_QUA_NGHIEM_THU,:KET_QUA_THUC_TE_NGHIEM_THU,:TON_TAI_KHAC_PHUC_NGHIEM_THU,:DIEM_NGHIEM_THU,\n" +
                ":MA_TRANG_THAI, :NGUOI_TAO, :NGAY_TAO,:NGUOI_SUA,GETDATE(),0)";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI", maDeTai);
        parameters.addValue("TEN_DETAI", deTaiReq.getTenDeTai());
        parameters.addValue("MA_KE_HOACH", deTaiReq.getMaKeHoach());
        parameters.addValue("MA_CAPDO", deTaiReq.getCapQuanLy());
        parameters.addValue("VAN_BAN", deTaiReq.getVanBanChiDaoSo());
        parameters.addValue("MA_DON_VI_CHU_TRI", deTaiReq.getDonViChuTri());
        parameters.addValue("THOI_GIAN_BAT_DAU",fromDate);
        parameters.addValue("THOI_GIAN_KET_THUC", toDate);
        parameters.addValue("MA_NGUON_KINH_PHI", deTaiReq.getNguonKinhPhi());
        parameters.addValue("TONG_KINH_PHI", deTaiReq.getTongKinhPhi());
        parameters.addValue("MA_PHUONG_THUC_KHOAN", deTaiReq.getPhuongThucKhoanChi());
        parameters.addValue("KINH_PHI_KHOAN", deTaiReq.getKinhPhiKhoan());
        parameters.addValue("KINH_PHI_KHONG_KHOAN", deTaiReq.getKinhPhiKhongKhoan());
        parameters.addValue("TINH_CAP_THIET", deTaiReq.getTinhCapThietCuaDeTaiNhiemVu());
        parameters.addValue("MUC_TIEU", deTaiReq.getMucTieu());
        parameters.addValue("NHIEM_VU", deTaiReq.getNhiemVuVaPhamViNghienCuu());
        parameters.addValue("KET_QUA_DU_KIEN", deTaiReq.getKetQuaDuKien());
        parameters.addValue("KIEN_NGHI_DE_XUAT", deTaiReq.getKienNghiDeXuat());
        parameters.addValue("KET_LUAN_HOI_DONG_XET_DUYET", deTaiReq.getKetLuanHoiDongXetDuyet());
        parameters.addValue("MA_KET_QUA_NGHIEM_THU", deTaiReq.getMaKetQuaNhiemThu());
        parameters.addValue("KET_QUA_THUC_TE_NGHIEM_THU", deTaiReq.getKetQuaThucTeNghiemThu());
        parameters.addValue("TON_TAI_KHAC_PHUC_NGHIEM_THU", deTaiReq.getTonTaiKhacPhucNghiemThu());
        parameters.addValue("DIEM_NGHIEM_THU", deTaiReq.getDiemNghiemThu());
        parameters.addValue("MA_TRANG_THAI", deTaiReq.getMaTrangThai());
        parameters.addValue("NGUOI_TAO", deTaiReq.getNguoiTao());
        parameters.addValue("NGAY_TAO", deTaiReq.getNgayTao());
        parameters.addValue("NGUOI_SUA", deTaiReq.getNguoiSua());
        int result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public int insertLinhVucNC(List<String> linhVucNghienCuu,String maDeTai,String nguoiTao,String nguoiSua) throws Exception{
        String queryStringDelete = "DELETE FROM DT_DETAI_LVUC_NCUU WHERE MA_DETAI = :MA_DETAI";
        MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
        parametersDelete.addValue("MA_DETAI", maDeTai);
        int result = jdbcTemplate.update(queryStringDelete, parametersDelete);
        if(linhVucNghienCuu != null && linhVucNghienCuu.size() >0) {
            String queryString = "INSERT INTO [dbo].[DT_DETAI_LVUC_NCUU]([MA_DETAI],[MA_LVUC_NCUU],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA]) " +
                    "VALUES(:MA_DETAI,:MA_LVUC_NCUU,:NGUOI_TAO,GETDATE(),:NGUOI_SUA,GETDATE())";
           // linhVucNghienCuu.removeAll(Collections.singleton(null));
            SqlParameterSource[] paramArr = new SqlParameterSource[linhVucNghienCuu.size()];
            int i = 0;
            for (String item : linhVucNghienCuu) {
                MapSqlParameterSource parameters = new MapSqlParameterSource();
                parameters.addValue("MA_DETAI", maDeTai);
                parameters.addValue("MA_LVUC_NCUU", item);
                parameters.addValue("NGUOI_TAO", nguoiTao);
                parameters.addValue("NGUOI_SUA", nguoiSua);
                paramArr[i] = parameters;
                i++;
            }

            jdbcTemplate.batchUpdate(queryString, paramArr);
        }
        return result;
    }
    @Override
    public int update(DeTaiReq deTaiReq,String maDeTai) throws Exception {
        Date fromDate =null;
        if(Util.isNotEmpty(deTaiReq.getThoiGianThucHienTu())) {
            Timestamp ts = new Timestamp(System.currentTimeMillis());
            fromDate = new Date(ts.getTime());
        }
        Date toDate =null;
        if(Util.isNotEmpty(deTaiReq.getThoiGianThucHienDen())) {
            Timestamp ts = new Timestamp(System.currentTimeMillis());
            toDate = new Date(ts.getTime());
        }
        String queryString = "UPDATE [dbo].[DT_DE_TAI] SET [TEN_DETAI] = :TEN_DETAI,[MA_KE_HOACH] = :MA_KE_HOACH,[MA_CAPDO] = :MA_CAPDO,[VAN_BAN] = :VAN_BAN,[MA_DON_VI_CHU_TRI] = :MA_DON_VI_CHU_TRI,[THOI_GIAN_BAT_DAU] = :THOI_GIAN_BAT_DAU," +
                "[THOI_GIAN_KET_THUC] = :THOI_GIAN_KET_THUC,[MA_NGUON_KINH_PHI] = :MA_NGUON_KINH_PHI,[TONG_KINH_PHI] = :TONG_KINH_PHI,[MA_PHUONG_THUC_KHOAN] = :MA_PHUONG_THUC_KHOAN,[KINH_PHI_KHOAN] = :KINH_PHI_KHOAN,[KINH_PHI_KHONG_KHOAN] = :KINH_PHI_KHONG_KHOAN,[TINH_CAP_THIET] = :TINH_CAP_THIET,[MUC_TIEU] = :MUC_TIEU," +
                "[NHIEM_VU] = :NHIEM_VU,[KET_QUA_DU_KIEN] = :KET_QUA_DU_KIEN,[KIEN_NGHI_DE_XUAT] = :KIEN_NGHI_DE_XUAT,[KET_LUAN_HOI_DONG_XET_DUYET] = :KET_LUAN_HOI_DONG_XET_DUYET,[MA_KET_QUA_NGHIEM_THU] = :MA_KET_QUA_NGHIEM_THU,[KET_QUA_THUC_TE_NGHIEM_THU] = :KET_QUA_THUC_TE_NGHIEM_THU," +
                "[TON_TAI_KHAC_PHUC_NGHIEM_THU] = :TON_TAI_KHAC_PHUC_NGHIEM_THU,[DIEM_NGHIEM_THU] = :DIEM_NGHIEM_THU,[MA_TRANG_THAI] = :MA_TRANG_THAI,[NGUOI_SUA] = :NGUOI_SUA,[NGAY_SUA] = GETDATE()   \n" +
                " WHERE MA_DETAI = :MA_DETAI";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI", maDeTai);
        parameters.addValue("TEN_DETAI", deTaiReq.getTenDeTai());
        parameters.addValue("MA_KE_HOACH", deTaiReq.getCanCuThucHien());
        parameters.addValue("MA_CAPDO", deTaiReq.getCapQuanLy());
        parameters.addValue("VAN_BAN", deTaiReq.getVanBanChiDaoSo());
        parameters.addValue("MA_DON_VI_CHU_TRI", deTaiReq.getDonViChuTri());
        parameters.addValue("THOI_GIAN_BAT_DAU", fromDate);
        parameters.addValue("THOI_GIAN_KET_THUC",toDate);
        parameters.addValue("MA_NGUON_KINH_PHI", deTaiReq.getNguonKinhPhi());
        parameters.addValue("TONG_KINH_PHI", deTaiReq.getTongKinhPhi());
        parameters.addValue("MA_PHUONG_THUC_KHOAN", deTaiReq.getPhuongThucKhoanChi());
        parameters.addValue("KINH_PHI_KHOAN", deTaiReq.getKinhPhiKhoan());
        parameters.addValue("KINH_PHI_KHONG_KHOAN", deTaiReq.getKinhPhiKhongKhoan());
        parameters.addValue("TINH_CAP_THIET", deTaiReq.getTinhCapThietCuaDeTaiNhiemVu());
        parameters.addValue("MUC_TIEU", deTaiReq.getMucTieu());
        parameters.addValue("NHIEM_VU", deTaiReq.getNhiemVuVaPhamViNghienCuu());
        parameters.addValue("KET_QUA_DU_KIEN", deTaiReq.getKetQuaDuKien());
        parameters.addValue("KIEN_NGHI_DE_XUAT", deTaiReq.getKienNghiDeXuat());
        parameters.addValue("KET_LUAN_HOI_DONG_XET_DUYET", deTaiReq.getKetLuanHoiDongXetDuyet());
        parameters.addValue("MA_KET_QUA_NGHIEM_THU", deTaiReq.getMaKetQuaNhiemThu());
        parameters.addValue("KET_QUA_THUC_TE_NGHIEM_THU", deTaiReq.getKetQuaThucTeNghiemThu());
        parameters.addValue("TON_TAI_KHAC_PHUC_NGHIEM_THU", deTaiReq.getTonTaiKhacPhucNghiemThu());
        parameters.addValue("DIEM_NGHIEM_THU", deTaiReq.getDiemNghiemThu());
        parameters.addValue("MA_TRANG_THAI", deTaiReq.getMaTrangThai());
//        parameters.addValue("NGUOI_TAO", deTaiReq.getNguoiTao());
//        parameters.addValue("NGAY_TAO", deTaiReq.getNgayTao());
        parameters.addValue("NGUOI_SUA", deTaiReq.getNguoiSua());
        int result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public List<DeTaiResp> ListDeTai(String tenDeTai, String userId, String page, String pageSize,String orgId) throws Exception {
        String queryString = "SELECT COUNT(dt.MA_DETAI) OVER() as totalPage, dt.[MA_DETAI] maDeTai,dt.[TEN_DETAI] tenDeTai,dt.[MA_KE_HOACH] maKeHoach,dt.[MA_CAPDO] capQuanLy,dt.[VAN_BAN] vanBanChiDaoSo,dt.[MA_DON_VI_CHU_TRI] donViChuTri,dt.[THOI_GIAN_BAT_DAU] thoiGianThucHienTu," +
                " dt.[THOI_GIAN_KET_THUC] thoiGianThucHienDen,dt.[MA_NGUON_KINH_PHI] nguonKinhPhi,dt.[TONG_KINH_PHI] tongKinhPhi,dt.[MA_PHUONG_THUC_KHOAN] phuongThucKhoanChi,dt.[KINH_PHI_KHOAN] kinhPhiKhoan,dt.[KINH_PHI_KHONG_KHOAN] kinhPhiKhongKhoan,dt.[TINH_CAP_THIET] tinhCapThietCuaDeTaiNhiemVu," +
                " dt.[MUC_TIEU] mucTieu,dt.[NHIEM_VU] nhiemVuVaPhamViNghienCuu,dt.[KET_QUA_DU_KIEN] ketQuaDuKien,dt.[KIEN_NGHI_DE_XUAT] kienNghiDeXuat,dt.[KET_LUAN_HOI_DONG_XET_DUYET] ketLuanHoiDongXetDuyet,dt.[MA_KET_QUA_NGHIEM_THU] maKetQuaNhiemThu," +
                " dt.[KET_QUA_THUC_TE_NGHIEM_THU] ketQuaThucTeNghiemThu,dt.[TON_TAI_KHAC_PHUC_NGHIEM_THU] tonTaiKhacPhucNghiemThu,dt.[DIEM_NGHIEM_THU] diemNghiemThu,dt.[MA_TRANG_THAI] maTrangThai,dt.[NGUOI_TAO] nguoiTao,dt.[NGAY_TAO] ngayTao,dt.[NGUOI_SUA] nguoiSua" +
                " FROM [dbo].[DT_DE_TAI] dt WHERE 1=1 ";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("USERID",nguoiTao);
        if (Util.isNotEmpty(tenDeTai)) {
            queryString += " AND (dt.TEN_DETAI LIKE :TEN_DETAI OR dt.MA_DETAI IN (SELECT MA_DETAI FROM DT_DETAI_NGUOI_THUC_HIEN WHERE MA_CHUC_DANH IN('CNHIEM','DCNHIEM','TKY') AND TEN_NGUOI_THUC_HIEN LIKE :TEN_DETAI))";
            parameters.addValue("TEN_DETAI", "%" + tenDeTai + "%");
        }
        RoleResp role = CheckQuyen(userId);
        if(role != null && role.roleCode.equals("KHCN_ROLE_CANBO_KHCN")){
            queryString +=" AND (dt.MA_DON_VI_CHU_TRI =:ORGID OR dt.NGUOI_TAO = :USERID OR NGUOI_SUA = :USERID)";
            parameters.addValue("ORGID", orgId);
            parameters.addValue("USERID", userId);
        }else{
            queryString += " AND (dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_HOI_DONG hd, DM_NGUOI_THUC_HIEN th \n" +
                    " WHERE hd.MA_NGUOI_THUC_HIEN = th.MA_NGUOI_THUC_HIEN \n" +
                    " AND th.NS_ID IN (SELECT MA_NHAN_VIEN FROM Q_USER WHERE USERID=:USERID)) " +
                    " OR dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_NGUOI_THUC_HIEN tt WHERE  tt.NS_ID IN (SELECT MA_NHAN_VIEN FROM Q_USER WHERE USERID=:USERID)))" +
                    " OR dt.NGUOI_TAO = :USERID OR NGUOI_SUA = :USERID";
            parameters.addValue("USERID", userId);
        }

        queryString += " ORDER BY dt.NGAY_TAO DESC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
        List<DeTaiResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DeTaiResp.class));
        return listObj;
    }

    @Override
    public DeTaiResp ChiTietDeTai(String maDeTai) throws Exception {
        String queryString = "SELECT dt.[MA_DETAI] maDeTai,dt.[TEN_DETAI] tenDeTai,dt.[MA_KE_HOACH] maKeHoach,dt.[MA_CAPDO] capQuanLy,dt.[VAN_BAN] vanBanChiDaoSo,dt.[MA_DON_VI_CHU_TRI] donViChuTri,dt.[THOI_GIAN_BAT_DAU] thoiGianThucHienTu," +
                " dt.[THOI_GIAN_KET_THUC] thoiGianThucHienDen,dt.[MA_NGUON_KINH_PHI] nguonKinhPhi,dt.[TONG_KINH_PHI] tongKinhPhi,dt.[MA_PHUONG_THUC_KHOAN] phuongThucKhoanChi,dt.[KINH_PHI_KHOAN] kinhPhiKhoan,dt.[KINH_PHI_KHONG_KHOAN] kinhPhiKhongKhoan,dt.[TINH_CAP_THIET] tinhCapThietCuaDeTaiNhiemVu," +
                " dt.[MUC_TIEU] mucTieu,dt.[NHIEM_VU] nhiemVuVaPhamViNghienCuu,dt.[KET_QUA_DU_KIEN] ketQuaDuKien,dt.[KIEN_NGHI_DE_XUAT] kienNghiDeXuat,dt.[KET_LUAN_HOI_DONG_XET_DUYET] ketLuanHoiDongXetDuyet,dt.[MA_KET_QUA_NGHIEM_THU] maKetQuaNhiemThu," +
                " dt.[KET_QUA_THUC_TE_NGHIEM_THU] ketQuaThucTeNghiemThu,dt.[TON_TAI_KHAC_PHUC_NGHIEM_THU] tonTaiKhacPhucNghiemThu,dt.[DIEM_NGHIEM_THU] diemNghiemThu,dt.[MA_TRANG_THAI] maTrangThai,dt.[NGUOI_TAO] nguoiTao,dt.[NGAY_TAO] ngayTao,dt.[NGUOI_SUA] nguoiSua " +
                "  FROM [dbo].[DT_DE_TAI] dt WHERE dt.MA_DETAI = :MA_DETAI";


        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI",maDeTai);
        List<DeTaiResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DeTaiResp.class));
        if(listObj !=null && listObj.size() >0){
            return listObj.get(0);
        }
        return null;
    }

    @Override
    public int insertHoiDong(List<DanhSachThanhVien> listDanhSachThanhVien, String maDeTai, String NguoiTao, String NguoiSua) throws Exception {
        String queryStringDelete = "DELETE FROM DT_DETAI_HOI_DONG WHERE MA_DETAI = :MA_DETAI";
        MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
        parametersDelete.addValue("MA_DETAI", maDeTai);
        int result = jdbcTemplate.update(queryStringDelete, parametersDelete);

        String queryString = "INSERT INTO [dbo].[DT_DETAI_HOI_DONG]([MA_NGUOI_THUC_HIEN],[MA_DETAI],[GHI_CHU],[MA_CHUC_DANH],[LOAI_HDONG],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA],[TEN_NGUOI_THUC_HIEN],NS_ID) " +
                "VALUES(newid(),:MA_DETAI,:GHI_CHU,:MA_CHUC_DANH,:LOAI_HDONG,:NGUOI_TAO,GETDATE(),:NGUOI_SUA,GETDATE(),:TEN_NGUOI_THUC_HIEN,:NS_ID)";
        SqlParameterSource[] paramArr = new SqlParameterSource[listDanhSachThanhVien.size()];
        int i = 0;
        for (DanhSachThanhVien item : listDanhSachThanhVien) {
            MapSqlParameterSource parameters = new MapSqlParameterSource();
           // parameters.addValue("MA_NGUOI_THUC_HIEN", item.getMaThanhVien());
            parameters.addValue("MA_DETAI", maDeTai);
            parameters.addValue("GHI_CHU", item.getGhiChu());
            parameters.addValue("MA_CHUC_DANH", item.getChucDanh());
            parameters.addValue("LOAI_HDONG", item.getLoaiHD());
            parameters.addValue("NGUOI_TAO", NguoiTao);
            parameters.addValue("NGUOI_SUA", NguoiTao);
            parameters.addValue("TEN_NGUOI_THUC_HIEN", item.getTen());
            parameters.addValue("NS_ID", item.getNsId());
            paramArr[i] = parameters;
            i++;
        }
        jdbcTemplate.batchUpdate(queryString, paramArr);
        return result;
    }

    @Override
    public int insertNguoiThucHien(List<DanhSachThanhVien> listDanhSachThanhVien, String maDeTai, String nguoiTao, String nguoiSua) throws Exception {
        String queryStringDelete = "DELETE FROM [DT_DETAI_NGUOI_THUC_HIEN] WHERE MA_DETAI = :MA_DETAI";
        MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
        parametersDelete.addValue("MA_DETAI", maDeTai);
        int result = jdbcTemplate.update(queryStringDelete, parametersDelete);

        String queryString = "INSERT INTO [dbo].[DT_DETAI_NGUOI_THUC_HIEN]([MA_DETAIL_NGUOI_THUCHIEN],[STT],[MA_NGUOI_THUC_HIEN],[TEN_NGUOI_THUC_HIEN],[MA_DETAI],[NS_ID],[MA_HOC_HAM],[MA_HOC_VI],[EMAIL],\n" +
                " [SDT],[GIO_TINH],[DON_VI_CONG_TAC],[MA_CHUC_DANH],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA]) " +
                " VALUES(newid(),:STT,:MA_NGUOI_THUC_HIEN,:TEN_NGUOI_THUC_HIEN,:MA_DETAI,:NS_ID,:MA_HOC_HAM,:MA_HOC_VI,:EMAIL,:SDT,:GIO_TINH,:DON_VI_CONG_TAC,:MA_CHUC_DANH,:NGUOI_TAO,GETDATE(),:NGUOI_SUA, GETDATE())";
        SqlParameterSource[] paramArr = new SqlParameterSource[listDanhSachThanhVien.size()];
        int i = 0;
        for (DanhSachThanhVien item : listDanhSachThanhVien) {
            String chucDanh ="TVIEN";
            if(Util.isNotEmpty(item.getChucDanh())){
                chucDanh = item.getChucDanh();
            }
            if(!Util.isNotEmpty(item.getStt())){
                item.setStt(i+4);
            }
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("STT", item.getStt());
            parameters.addValue("MA_NGUOI_THUC_HIEN", item.getMaThanhVien());
            parameters.addValue("TEN_NGUOI_THUC_HIEN", item.getTen());
            parameters.addValue("MA_DETAI", maDeTai);
            parameters.addValue("NS_ID", item.getNsId());
            parameters.addValue("MA_HOC_HAM", item.getMaHocHam());
            parameters.addValue("MA_HOC_VI", item.getMaHocVi());
            parameters.addValue("EMAIL", item.getEmail());
            parameters.addValue("SDT", item.getSoDienThoai());
            parameters.addValue("GIO_TINH", item.getGioiTinh());
            parameters.addValue("DON_VI_CONG_TAC", item.getDonViCongTac());
            parameters.addValue("MA_CHUC_DANH", chucDanh);
            parameters.addValue("NGUOI_TAO", nguoiTao);
            parameters.addValue("NGUOI_SUA", nguoiSua);
            paramArr[i] = parameters;
            i++;
        }
        jdbcTemplate.batchUpdate(queryString, paramArr);
        return result;
    }

    @Override
    public int insertNguoiThucHienHD(List<DanhSachThanhVien> listDanhSachThanhVien, String maDeTai, String nguoiTao, String nguoiSua) throws Exception {
        String queryStringDelete = "DELETE FROM [DT_DETAI_NGUOI_THUC_HIEN] WHERE MA_DETAI = :MA_DETAI AND MA_CHUC_DANH NOT IN('CNHIEM','DCNHIEM','TKY')";
        MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
        parametersDelete.addValue("MA_DETAI", maDeTai);
        int result = jdbcTemplate.update(queryStringDelete, parametersDelete);

        String queryString = "INSERT INTO [dbo].[DT_DETAI_NGUOI_THUC_HIEN]([MA_DETAIL_NGUOI_THUCHIEN],[STT],[MA_NGUOI_THUC_HIEN],[TEN_NGUOI_THUC_HIEN],[MA_DETAI],[NS_ID],[MA_HOC_HAM],[MA_HOC_VI],[EMAIL],\n" +
                " [SDT],[GIO_TINH],[DON_VI_CONG_TAC],[MA_CHUC_DANH],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA]) " +
                " VALUES(newid(),:STT,:MA_NGUOI_THUC_HIEN,:TEN_NGUOI_THUC_HIEN,:MA_DETAI,:NS_ID,:MA_HOC_HAM,:MA_HOC_VI,:EMAIL,:SDT,:GIO_TINH,:DON_VI_CONG_TAC,:MA_CHUC_DANH,:NGUOI_TAO,GETDATE(),:NGUOI_SUA, GETDATE())";
        SqlParameterSource[] paramArr = new SqlParameterSource[listDanhSachThanhVien.size()];
        int i = 0;
        for (DanhSachThanhVien item : listDanhSachThanhVien) {
            String chucDanh ="TVIEN";
            if(Util.isNotEmpty(item.getChucDanh())){
                chucDanh = item.getChucDanh();
            }
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("STT", item.getStt());
            parameters.addValue("MA_NGUOI_THUC_HIEN", item.getMaThanhVien());
            parameters.addValue("TEN_NGUOI_THUC_HIEN", item.getTen());
            parameters.addValue("MA_DETAI", maDeTai);
            parameters.addValue("NS_ID", item.getNsId());
            parameters.addValue("MA_HOC_HAM", item.getMaHocHam());
            parameters.addValue("MA_HOC_VI", item.getMaHocVi());
            parameters.addValue("EMAIL", item.getEmail());
            parameters.addValue("SDT", item.getSoDienThoai());
            parameters.addValue("GIO_TINH", item.getGioiTinh());
            parameters.addValue("DON_VI_CONG_TAC", item.getDonViCongTac());
            parameters.addValue("MA_CHUC_DANH", chucDanh);
            parameters.addValue("NGUOI_TAO", nguoiTao);
            parameters.addValue("NGUOI_SUA", nguoiSua);
            paramArr[i] = parameters;
            i++;
        }
        jdbcTemplate.batchUpdate(queryString, paramArr);
        return result;
    }

    @Override
    public List<DanhSachThanhVien> ListNguoiThucHienByMaDeTai(String maDeTai) throws Exception {
        String queryString = "SELECT dt.[MA_DETAIL_NGUOI_THUCHIEN] maDanhSachThanhVien,dt.[STT] stt,dt.[MA_NGUOI_THUC_HIEN] maThanhVien,dt.[TEN_NGUOI_THUC_HIEN] ten," +
                " dt.[MA_DETAI] maDeTai,dt.[NS_ID] nsId,dt.[MA_HOC_HAM] maHocHam,dt.[MA_HOC_VI] maHocVi,dt.[EMAIL] email,dt.[SDT] soDienThoai,dt.[GIO_TINH] gioiTinh,dt.[DON_VI_CONG_TAC] donViCongTac," +
                " dt.[MA_CHUC_DANH] chucDanh,dt.[NGUOI_TAO] nguoiTao,dt.[NGAY_TAO] ,dt.[NGUOI_SUA] nguoiSua,dt.[NGAY_SUA], cd.TEN_CHUC_DANH tenChucDanh FROM [dbo].[DT_DETAI_NGUOI_THUC_HIEN] dt" +
                " LEFT JOIN DT_DM_CHUC_DANH cd ON dt.MA_CHUC_DANH = cd.MA_CHUC_DANH " +
                " WHERE MA_DETAI = :MA_DETAI";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI",maDeTai);

        List<DanhSachThanhVien> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachThanhVien.class));
        return listObj;
    }

    @Override
    public List<KeHoachResp> ListKeHoachDeTai(String ten) throws Exception{
        String queryString = "SELECT COUNT(kh.NGAY_TAO) OVER() as TotalPage,kh.[MA_KE_HOACH] maKeHoach,kh.[TEN_KE_HOACH] name,kh.[NAM] nam,kh.[MA_DON_VI] maDonVi,kh.[MA_TRANG_THAI] maTrangThai,kh.[NGUOI_TAO] nguoiTao,kh.[NGAY_TAO] ngayTao,kh.[NGUOI_SUA] nguoiSua,kh.[TONG_HOP] tongHop," +
                "kh.[Y_KIEN_NGUOI_PHE_DUYET] yKienNguoiPheDuyet,kh.[TEN_BANG_TONG_HOP] tenBangTongHop,kh.[KY_TONG_HOP] kyTongHop,kh.[CAP_TAO] capTao  ";
        queryString +=" , tt.TEN_TRANG_THAI tenTrangThai, FORMAT (NGAY_SUA, 'dd/MM/yyyy') as ngayGui, u.USERNAME nguoiGui";
        queryString +=" FROM [dbo].[KH_KE_HOACH] kh";
        queryString +=" LEFT JOIN KH_DM_TRANG_THAI tt ON kh.MA_TRANG_THAI = tt.MA_TRANG_THAI";
        queryString +=" LEFT JOIN Q_USER u ON kh.NGUOI_SUA = u.USERID";
        queryString +=" WHERE 1 = 1 ";//AND kh.MA_TRANG_THAI IN('CHO_PHE_DUYET','Y_CAU_HIEU_CHINH','DA_PHE_DUYET') ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(ten)){
            queryString +=" AND kh.TEN_KE_HOACH LIKE :TEN";
            parameters.addValue("TEN","%"+ten+"%");
        }

        queryString +=" ORDER BY kh.TEN_KE_HOACH";
     //   parameters.addValue("ORGID",orgId);

        List<KeHoachResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(KeHoachResp.class));
        return listObj;
    }

    @Override
    public List<UserResp> ListUser(String ten) throws Exception{
        String queryString = "SELECT s.ORGDESC orgName,[MA_NGUOI_THUC_HIEN] userId,[NS_ID] nsId,dm.[ORGID] orgId,[TEN_NGUOI_THUC_HIEN] username," +
                "[MA_HOC_HAM] maHocHam,[NAM_HOC_HAM] namHocHam,[MA_HOC_VI] maHocVi,[NAM_HOC_VI] namHocVi,[EMAL] email,[SDT] sdt,[NOI_LAM_VIEC] noiLamViec," +
                "[DIA_CHI_NOI_LAM_VIEC] diaChiLamViec,[TRANG_THAI_XAC_MINH] trangThaiXacMinh,[NGAY_XAC_MINH] ngayXacMinh,[CHUYEN_GIA] chuyenGia," +
                "[NGOAI_EVN] ngoaiEvn,[NAM_SINH] namSinh,[GIO_TINH] gioiTinh,[CCCD] cccd  " +
                " FROM [dbo].[DM_NGUOI_THUC_HIEN] dm " +
                " LEFT JOIN S_ORGANIZATION s ON dm.ORGID=s.ORGID" +
                " WHERE ISNULL(dm.DA_XOA,0)=0 ";
        //queryString +=" WHERE 1 = 1 ";//AND kh.MA_TRANG_THAI IN('CHO_PHE_DUYET','Y_CAU_HIEU_CHINH','DA_PHE_DUYET') ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(ten)){
            queryString +=" AND TEN_NGUOI_THUC_HIEN LIKE :TEN";
            parameters.addValue("TEN","%"+ten+"%");
        }

        queryString +=" ORDER BY USERNAME";
        //   parameters.addValue("ORGID",orgId);

        List<UserResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(UserResp.class));
        return listObj;
    }

    @Override
    public List<UserResp> ListHoiDong(String ten,String capDonVi) throws Exception{
        String queryString = "SELECT u.USERID userId,s.ORGDESC orgName,[Ns_id] nsId,[Donvi_id] orgId,[Tenkhaisinh] username," +
                "[Hocham_cnhat_id] maHocHam," +
                "[Hocvi_cnhat_id] maHocVi,[Nam_hocham] namHocHam,[Nam_hocvi] namHocVi,[Dienthoai] sdt ,ns.[Email] email," +
                "[Donvicongtac] noiLamViec  FROM [dbo].[L_NHANSU] ns" +
                " LEFT JOIN Q_USER u ON ns.Ns_id=u.MA_NHAN_VIEN " +
                " LEFT JOIN S_ORGANIZATION s ON ns.Donvi_id=s.ORGID" +
                " WHERE 1=1 ";
        //queryString +=" WHERE 1 = 1 ";//AND kh.MA_TRANG_THAI IN('CHO_PHE_DUYET','Y_CAU_HIEU_CHINH','DA_PHE_DUYET') ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        if(Util.isNotEmpty(ten)){
            queryString +=" AND Tenkhaisinh LIKE :TEN";
            parameters.addValue("TEN","%"+ten+"%");
        }
        if(Util.isNotEmpty(capDonVi)){
            queryString +=" AND Donvi_id = :CapDonVi";
            parameters.addValue("CapDonVi",capDonVi);
        }

        queryString +=" ORDER BY USERNAME";
        //   parameters.addValue("ORGID",orgId);

        List<UserResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(UserResp.class));
        return listObj;
    }

    @Override
    public UserResp UserByUserId(String userId) throws Exception{
        String queryString = "SELECT [MA_NGUOI_THUC_HIEN] userId,[NS_ID] nsId,[ORGID] orgId,[TEN_NGUOI_THUC_HIEN] username,[MA_HOC_HAM] maHocHam,[NAM_HOC_HAM] namHocHam,[MA_HOC_VI] maHocVi,[NAM_HOC_VI] namHocVi,[EMAL] email,[SDT] sdt,[NOI_LAM_VIEC] noiLamViec,[DIA_CHI_NOI_LAM_VIEC] diaChiLamViec,[TRANG_THAI_XAC_MINH] trangThaiXacMinh,[NGAY_XAC_MINH] ngayXacMinh,[CHUYEN_GIA] chuyenGia,[NGOAI_EVN] ngoaiEvn,[NAM_SINH] namSinh,[GIO_TINH] gioiTinh,[CCCD] cccd  FROM [dbo].[DM_NGUOI_THUC_HIEN] WHERE MA_NGUOI_THUC_HIEN = :USERID ";
        //queryString +=" WHERE 1 = 1 ";//AND kh.MA_TRANG_THAI IN('CHO_PHE_DUYET','Y_CAU_HIEU_CHINH','DA_PHE_DUYET') ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();

            parameters.addValue("USERID",userId);

        List<UserResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(UserResp.class));
        if(listObj != null && listObj.size() >0){
            return listObj.get(0);
        }
        return null;
    }

    @Override
    public int insertFileDeTai(List<FileReq> listFile, String maDeTai, String nguoiTao, String nguoiSua, List<String> listFolder) throws Exception {
        int result =0;
        if(listFolder != null && listFolder.size() >0){
            String queryStringDelete = "DELETE FROM [DT_DETAI_FILE] WHERE MA_DETAI = :MA_DETAI AND MA_LOAI_FILE IN(:LIST_FOLDER)";
            MapSqlParameterSource parametersDelete = new MapSqlParameterSource();
            parametersDelete.addValue("MA_DETAI", maDeTai);
            parametersDelete.addValue("LIST_FOLDER", listFolder);
            result = jdbcTemplate.update(queryStringDelete, parametersDelete);
        }

        if(listFile != null && listFile.size() >0) {
            String queryString = "INSERT INTO [dbo].[DT_DETAI_FILE]([MA_FILE],[MA_DETAI],[MA_LOAI_FILE],[SO_KY_HIEU],[NGAY_VAN_BAN],[TEN_FILE],[KICH_THUOC],[KIEU_FILE],[LOAI_FILE],[DUONG_DAN],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA],[DA_XOA])" +
                    " VALUES(newid(),:MA_DETAI,:MA_LOAI_FILE,:SO_KY_HIEU,:NGAY_VAN_BAN,:TEN_FILE,:KICH_THUOC,:KIEU_FILE,:LOAI_FILE,:DUONG_DAN,:NGUOI_TAO,GETDATE(),:NGUOI_SUA,GETDATE(),0)";
            SqlParameterSource[] paramArr = new SqlParameterSource[listFile.size()];
            int i = 0;
            for (FileReq item : listFile) {
                String maLoaiFile ="KHAC";
                if(Util.isNotEmpty(item.getMaLoaiFile())){
                    maLoaiFile = item.getMaLoaiFile();
                }
                MapSqlParameterSource parameters = new MapSqlParameterSource();
                parameters.addValue("MA_DETAI", maDeTai);
                parameters.addValue("MA_LOAI_FILE", maLoaiFile);
                parameters.addValue("SO_KY_HIEU", item.getSovanban());
                parameters.addValue("NGAY_VAN_BAN", item.getNgayVanBan());
                parameters.addValue("TEN_FILE", item.getFileName());
                parameters.addValue("KICH_THUOC", item.getSize());
                parameters.addValue("KIEU_FILE", item.getKieuFile());
                parameters.addValue("LOAI_FILE", item.getLoaiFile());
                parameters.addValue("DUONG_DAN", item.getDuongDan());
                parameters.addValue("NGUOI_TAO", nguoiTao);
                parameters.addValue("NGUOI_SUA", nguoiSua);
                paramArr[i] = parameters;
                i++;
            }
            jdbcTemplate.batchUpdate(queryString, paramArr);
        }
        return result;
    }

    @Override
    public List<FileReq> ListFileByMaDeTai(String maDeTai) throws Exception {
        String queryString = "SELECT [MA_FILE] mafile,[MA_DETAI] maDeTai,[MA_LOAI_FILE] maLoaiFile,[SO_KY_HIEU] sovanban,[NGAY_VAN_BAN] ngayVanBan," +
                " [TEN_FILE] fileName,[KICH_THUOC] size,[KIEU_FILE] kieuFile,[LOAI_FILE] loaiFile,[DUONG_DAN] duongDan,[NGUOI_TAO] nguoiTao,[NGAY_TAO] ngayTao,[NGUOI_SUA] nguoiSua  FROM [dbo].[DT_DETAI_FILE] WHERE MA_DETAI = :MA_DETAI AND DA_XOA=0";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI",maDeTai);

        List<FileReq> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(FileReq.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFile() throws Exception {
        String queryString = "SELECT MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName FROM DT_DM_LOAI_FILE WHERE DANG_KY =1 AND TRANG_THAI=1 ORDER BY SAP_XEP ";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileAll() throws Exception {
        String queryString = "SELECT [MA_LOAI_FILE] maFolder,[TEN_LOAI_FILE] fileName,[SAP_XEP] sapXep,[DANG_KY] dangKy,[RA_SOAT_DANG_KY] raSoatDangKy,[HOI_DONG_XET_DUYET] hoiDongXetDuyet,[KET_QUA_XET_DUYET] ketQuaXetDuyet,[THUC_HIEN_GIAO_HOP_DONG] thucHienHopDong,[THUC_HIEN_TAM_UNG] thucHienTamUng,[THUC_HIEN_GIA_HAN] thucHienGiaHan,[NGHIEM_THU_HSO] nghiemThuHso,\n" +
                " [NGHIEM_THU_BGIAO_KET_QUA] nghiemThuBgiaoKetQua,[HOI_DONG_NGHIEM_THU] hoiDongNghiemThu,[KET_QUA_NGHIEM_THU] ketQuaNghiemThu,[QUYET_TOAN] quyetToan,[TRANG_THAI] trangThai,[QUYEN_CAP_NHAT] quyenCapNhat FROM DT_DM_LOAI_FILE WHERE TRANG_THAI=1 ORDER BY SAP_XEP ";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileGiaoHD() throws Exception {
        String queryString = "SELECT MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName FROM DT_DM_LOAI_FILE WHERE THUC_HIEN_GIAO_HOP_DONG=1 AND TRANG_THAI=1 " +
                " AND MA_LOAI_FILE IN('HOSO_DANG_KY','QD_GIAO_KE_HOACH','DE_NGHI_TAM_UNG') ORDER BY SAP_XEP ";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileTamUng() throws Exception {
        String queryString = "SELECT MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM DT_DM_LOAI_FILE WHERE THUC_HIEN_TAM_UNG=1 AND TRANG_THAI=1 ORDER BY SAP_XEP ";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileHSNT() throws Exception {
        String queryString = "SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM DT_DM_LOAI_FILE WHERE NGHIEM_THU_HSO=1 AND TRANG_THAI=1 ORDER BY SAP_XEP ";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileBanGiaoLuuTruKQ() throws Exception {
        String queryString = " SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM DT_DM_LOAI_FILE WHERE NGHIEM_THU_BGIAO_KET_QUA=1 AND TRANG_THAI=1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileHOIDONG() throws Exception {
        String queryString = "  SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM DT_DM_LOAI_FILE WHERE HOI_DONG_NGHIEM_THU=1 AND TRANG_THAI=1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileThanhLapHD() throws Exception {
        String queryString = "  SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM DT_DM_LOAI_FILE WHERE KET_QUA_XET_DUYET=1 AND TRANG_THAI=1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileRaSoat() throws Exception {
        String queryString = "  SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM DT_DM_LOAI_FILE WHERE RA_SOAT_DANG_KY =1 AND TRANG_THAI=1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<Folder> ListFolderFileGiaHan() throws Exception{
        String queryString = "  SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM DT_DM_LOAI_FILE WHERE THUC_HIEN_GIA_HAN =1 AND TRANG_THAI=1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }


    @Override
    public List<Folder> ListFolderFileHSQuyetToan() throws Exception {
        String queryString = "  SELECT  MA_LOAI_FILE maFolder,TEN_LOAI_FILE fileName  FROM DT_DM_LOAI_FILE WHERE QUYET_TOAN=1 AND TRANG_THAI=1 ORDER BY SAP_XEP";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("MA_DETAI",maDeTai);

        List<Folder> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(Folder.class));
        return listObj;
    }

    @Override
    public List<DanhSachChung> ListDanhSachCapDo() throws Exception {
        String queryString = "SELECT [MA_CAPDO] id,[TEN_CAPDO] name FROM [dbo].[DT_DM_CAPDO_DETAI]";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<DanhSachChung> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachChung.class));
        return listObj;
    }
    @Override
    public List<DanhSachChung> ListDanhSachDonViChuTri() throws Exception {
        String queryString = "SELECT ORGID id, ORGDESC name FROM S_ORGANIZATION";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<DanhSachChung> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachChung.class));
        return listObj;
    }

    @Override
    public List<DanhSachChung> ListDanhSachTrangThai() throws Exception {
        String queryString = "SELECT MA_TRANG_THAI id, TEN_TRANG_THAI name FROM DT_DM_TRANG_THAI";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        List<DanhSachChung> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachChung.class));
        return listObj;
    }

    @Override
    public int updateTrangThai(String maDeTai,String maTrangThai) throws Exception {
        int result = 0;
            String queryString = "UPDATE [DT_DE_TAI] SET  MA_TRANG_THAI = :MA_TRANG_THAI WHERE MA_DETAI = :MA_DETAI";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI", maDeTai);
        parameters.addValue("MA_TRANG_THAI", maTrangThai);
            result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public int insertLichSu(String maDeTai,String maTrangThaiCu,String maTrangThaiMoi,String ghiChu,String nguoiTao) throws Exception {
        int result = 0;
        String queryString = "INSERT INTO [dbo].[DT_DETAI_LICH_SU]([MA_TRANG_THAI_LICH_SU],[MA_DETAI],[MA_TRANG_THAI_CU],[MA_TRANG_THAI_MOI],[GHI_CHU],[NGUOI_TAO],[NGAY_TAO]) ";
        queryString += " VALUES(newid(),:MA_DETAI,:MA_TRANG_THAI_CU,:MA_TRANG_THAI_MOI,:GHI_CHU,:NGUOI_TAO,GETDATE())";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI", maDeTai);
        parameters.addValue("MA_TRANG_THAI_CU", maTrangThaiCu);
        parameters.addValue("MA_TRANG_THAI_MOI", maTrangThaiMoi);
        parameters.addValue("GHI_CHU", ghiChu);
        parameters.addValue("NGUOI_TAO", nguoiTao);
        result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public int insertSendMail(String nguoiGui,String nhomNguoiNhan,String noiDung,String loai,String tieuDe) throws Exception {
        int result = 0;
        String queryString = "INSERT INTO [dbo].[API_GUI_EMAIL]([MA_EMAIL],[NGUOI_GUI],[NHOM_NGUOI_NHAN],[NOI_DUNG],[LOAI],[DA_GUI],[DA_XOA],[DANG_XU_LY],[TIEU_DE],[NGAY_TAO])";
        queryString += " VALUES(newid(),:NGUOI_GUI,:NHOM_NGUOI_NHAN,:NOI_DUNG,:LOAI,0,0,0,:TIEU_DE,GETDATE())";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("NGUOI_GUI", nguoiGui);
        parameters.addValue("NHOM_NGUOI_NHAN", nhomNguoiNhan);
        parameters.addValue("NOI_DUNG", noiDung);
        parameters.addValue("LOAI", loai);
        parameters.addValue("TIEU_DE", tieuDe);
        result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public String GetMailNguoiThucHien(String maDeTai) throws Exception {
        int result = 0;
        String queryString = "SELECT STRING_AGG(EMAIL,',') FROM DT_DETAI_NGUOI_THUC_HIEN a  WHERE MA_DETAI = :MA_DETAI";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI", maDeTai);
        List<String> obj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(String.class));
        if(obj != null && obj.size() >0){
            return obj.get(0);
        }
       return "";
    }

    @Override
    public int insertGiaHan(DeTaiReq detai, String maDeTai, String nguoiTao, String nguoiSua) throws Exception {

        String queryString = "INSERT INTO [dbo].[DT_DETAI_GIA_HAN]([MA_GIA_HAN],[MA_DETAI],[THOI_GIAN_GIA_HAN],[LY_DO],[LAN_GIA_HAN],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA])" +
                " VALUES(newid(),:MA_DETAI,:THOI_GIAN_GIA_HAN,:LY_DO,:LAN_GIA_HAN,:NGUOI_TAO,GETDATE(),:NGUOI_SUA,GETDATE())";

            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("MA_DETAI", maDeTai);
            parameters.addValue("THOI_GIAN_GIA_HAN", detai.getThang());
            parameters.addValue("LY_DO", detai.getLyDo());
            parameters.addValue("LAN_GIA_HAN", detai.getLanGiaHanThu());
            parameters.addValue("NGUOI_TAO", nguoiTao);
            parameters.addValue("NGUOI_SUA", nguoiSua);
       int result= jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public int insertTienDo(String maDeTai,DeTaiReq detai,String nguoiTao) throws Exception {
        int result = 0;
        String queryString = "INSERT INTO [dbo].[DT_DETAI_TIEN_DO_THUC_HIEN]([MA_TIEN_DO],[MA_DETAI],[THANG],[NAM],[NOI_DUNG_BAO_CAO],[DE_XUAT_KIEN_NGHI],[KE_HOACH_TIEP_THEO],[NGUOI_TAO],[NGAY_TAO],[NGUOI_SUA],[NGAY_SUA]) ";
        queryString += " VALUES(newid(),:MA_DETAI,:THANG,:NAM,:NOI_DUNG_BAO_CAO,:DE_XUAT_KIEN_NGHI,:KE_HOACH_TIEP_THEO,:NGUOI_TAO,GETDATE(),:NGUOI_SUA,GETDATE())";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI", maDeTai);
        parameters.addValue("THANG", detai.getThang());
        parameters.addValue("NAM", detai.getNam());
        parameters.addValue("NOI_DUNG_BAO_CAO", detai.getNoiDung());
        parameters.addValue("DE_XUAT_KIEN_NGHI", detai.getKienNghiDeXuat());
        parameters.addValue("KE_HOACH_TIEP_THEO", detai.getKeHoachTiepTheo());
        parameters.addValue("NGUOI_TAO", nguoiTao);
        parameters.addValue("NGUOI_SUA", nguoiTao);
        result = jdbcTemplate.update(queryString, parameters);
        return result;
    }

    @Override
    public String ListLinhVucNghienCuu(String maDeTai) throws Exception{
        int result = 0;
        try{
        String queryString = "SELECT STRING_AGG(TEN_LVUC_NCUU,',')  FROM DM_LVUC_NCUU WHERE MA_LVUC_NCUU IN(SELECT MA_LVUC_NCUU FROM DT_DETAI_LVUC_NCUU WHERE MA_DETAI = :MA_DETAI)";
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI", maDeTai);
        List<String> obj = jdbcTemplate.queryForList(queryString, parameters,String.class);
        if(obj != null && obj.size() >0){
            return obj.get(0);
        }
        }catch (Exception ex){}
        return "";
    }

    @Override
    public List<String> ListLinhVucNghienCuuMa(String maDeTai) throws Exception{
        int result = 0;
        try{
            String queryString = "SELECT MA_LVUC_NCUU FROM DT_DETAI_LVUC_NCUU WHERE MA_DETAI = :MA_DETAI";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("MA_DETAI", maDeTai);
            List<String> obj = jdbcTemplate.queryForList(queryString, parameters, String.class);
            if(obj != null && obj.size() >0){
                return obj;
            }
        }catch (Exception ex){}
        return new ArrayList<>();
    }
    @Override
    public String TenNguonKinhPhi(String maDeTai) throws Exception{
        int result = 0;
        try{
            String queryString = "SELECT TEN_NGUON_KINH_PHI FROM DT_DM_NGUON_KINH_PHI WHERE MA_NGUON_KINH_PHI IN(SELECT MA_NGUON_KINH_PHI FROM DT_DE_TAI WHERE  MA_DETAI = :MA_DETAI)";
            MapSqlParameterSource parameters = new MapSqlParameterSource();
            parameters.addValue("MA_DETAI", maDeTai);
            List<String> obj = jdbcTemplate.queryForList(queryString, parameters, String.class);
            if(obj != null && obj.size() >0){
                return obj.get(0);
            }
        }catch (Exception ex){}
        return "";
    }

    @Override
    public List<TienDoThucHien> ListTienDoThucHien(String maDeTai) throws Exception {
        String queryString = "SELECT [MA_TIEN_DO] maTienDo,[MA_DETAI] maDeTai,[THANG] thang,[NAM] nam,[NOI_DUNG_BAO_CAO] noiDungBaoCao,[DE_XUAT_KIEN_NGHI] deXuatKienNghi,[KE_HOACH_TIEP_THEO] keHoachTiepTheo  FROM [dbo].[DT_DETAI_TIEN_DO_THUC_HIEN] " +
                " WHERE MA_DETAI = :MA_DETAI ORDER BY NAM, THANG";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI",maDeTai);

        List<TienDoThucHien> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(TienDoThucHien.class));
        return listObj;
    }

    @Override
    public List<LichSuKeHoach> ListLichsu(String maDeTai) throws Exception {
        String queryString="SELECT [MA_TRANG_THAI_LICH_SU],[MA_DETAI] maKeHoach,[MA_TRANG_THAI_CU] maTrangThaiCu	,[MA_TRANG_THAI_MOI] maTrangThaiMoi	  ,tt2.TEN_TRANG_THAI tenTrangThaiMoi,[GHI_CHU] ghiChu,[NGUOI_TAO] nguoiTao	  ,u.USERNAME tenNguoiTao,[NGAY_TAO] ngayTao ,o.ORGDESC tenDonVi";
        queryString +="  FROM [dbo].[DT_DETAI_LICH_SU] ls";
        //queryString +="  LEFT JOIN KH_DM_TRANG_THAI tt ON ls.MA_TRANG_THAI_CU = tt.MA_TRANG_THAI";
        queryString +="  LEFT JOIN DT_DM_TRANG_THAI tt2 ON ls.MA_TRANG_THAI_MOI = tt2.MA_TRANG_THAI";
        queryString +="  LEFT JOIN Q_USER u ON u.USERID = ls.NGUOI_TAO";
        queryString +="  LEFT JOIN S_ORGANIZATION o ON u.ORGID = o.ORGID";
        queryString +="  WHERE ls.MA_DETAI = :MA_DETAI";
        queryString +="  ORDER BY NGAY_TAO DESC";


        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI",maDeTai);
        List<LichSuKeHoach> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(LichSuKeHoach.class));
        return listObj;
    }

    @Override
    public List<DanhSachThanhVien> ListHDByMaDeTai(String maDeTai) throws Exception {
        String queryString = "SELECT hd.[MA_NGUOI_THUC_HIEN] maDanhSachThanhVien,hd.[MA_DETAI] maDeTai,hd.[GHI_CHU] ghiChu,hd.[MA_CHUC_DANH] chucDanh,hd.[LOAI_HDONG] loaiHD,hd.[NGUOI_TAO] nguoiTao," +
                " hd.[NGUOI_SUA] nguoiSua,hd.[TEN_NGUOI_THUC_HIEN] ten, cd.TEN_CHUC_DANH tenChucDanh FROM [dbo].[DT_DETAI_HOI_DONG] hd " +
                " LEFT JOIN DT_DM_CHUC_DANH cd ON hd.MA_CHUC_DANH = cd.MA_CHUC_DANH " +
                " WHERE MA_DETAI = :MA_DETAI";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("MA_DETAI",maDeTai);

        List<DanhSachThanhVien> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DanhSachThanhVien.class));
        return listObj;
    }

    @Override
    public List<DeTaiResp> ListDeTaiChung(String loaiTimKiem, TimKiemReq timKiemReq, String userId, String page, String pageSize,String orgId) throws Exception {
        String queryString = "SELECT COUNT(dt.MA_DETAI) OVER() as totalPage, dt.[MA_DETAI] maDeTai,dt.[TEN_DETAI] tenDeTai,dt.[MA_KE_HOACH] maKeHoach,dt.[MA_CAPDO] capQuanLy,dt.[VAN_BAN] vanBanChiDaoSo,dt.[MA_DON_VI_CHU_TRI] donViChuTri,dt.[THOI_GIAN_BAT_DAU] thoiGianThucHienTu," +
                " dt.[THOI_GIAN_KET_THUC] thoiGianThucHienDen,dt.[MA_NGUON_KINH_PHI] nguonKinhPhi,dt.[TONG_KINH_PHI] tongKinhPhi,dt.[MA_PHUONG_THUC_KHOAN] phuongThucKhoanChi,dt.[KINH_PHI_KHOAN] kinhPhiKhoan,dt.[KINH_PHI_KHONG_KHOAN] kinhPhiKhongKhoan,dt.[TINH_CAP_THIET] tinhCapThietCuaDeTaiNhiemVu," +
                " dt.[MUC_TIEU] mucTieu,dt.[NHIEM_VU] nhiemVuVaPhamViNghienCuu,dt.[KET_QUA_DU_KIEN] ketQuaDuKien,dt.[KIEN_NGHI_DE_XUAT] kienNghiDeXuat,dt.[KET_LUAN_HOI_DONG_XET_DUYET] ketLuanHoiDongXetDuyet,dt.[MA_KET_QUA_NGHIEM_THU] maKetQuaNhiemThu," +
                " dt.[KET_QUA_THUC_TE_NGHIEM_THU] ketQuaThucTeNghiemThu,dt.[TON_TAI_KHAC_PHUC_NGHIEM_THU] tonTaiKhacPhucNghiemThu,dt.[DIEM_NGHIEM_THU] diemNghiemThu,dt.[MA_TRANG_THAI] maTrangThai,dt.[NGUOI_TAO] nguoiTao,dt.[NGAY_TAO] ngayTao,dt.[NGUOI_SUA] nguoiSua" +
                " FROM [dbo].[DT_DE_TAI] dt WHERE 1=1 ";

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        //parameters.addValue("USERID",nguoiTao);
        if (Util.isNotEmpty(timKiemReq.getQ())) {
            queryString += " AND (dt.TEN_DETAI LIKE :TEN_DETAI OR dt.MA_DETAI IN (SELECT MA_DETAI FROM DT_DETAI_NGUOI_THUC_HIEN WHERE MA_CHUC_DANH IN('CNHIEM','DCNHIEM','TKY') AND LOWER(TEN_NGUOI_THUC_HIEN) LIKE :TEN_DETAI))";
            parameters.addValue("TEN_DETAI", "%" + timKiemReq.getQ().toLowerCase() + "%");
        }
        if (Util.isNotEmpty(timKiemReq.getCapQuanLy())) {
            queryString += " AND MA_CAPDO = :MA_CAPDO";
            parameters.addValue("MA_CAPDO", timKiemReq.getCapQuanLy());
        }

        RoleResp role = CheckQuyen(userId);
        if(role != null && role.roleCode.equals("KHCN_ROLE_CANBO_KHCN")){
            queryString +=" AND ((MA_CAPDO ='EVN' AND (MA_DON_VI_CHU_TRI IN (SELECT ORGID FROM S_ORGANIZATION WHERE ORGID_PARENT =:ORGID) OR 124=:ORGID))";
            queryString +=" OR (MA_CAPDO='TCT'  AND MA_DON_VI_CHU_TRI IN (SELECT ORGID FROM S_ORGANIZATION WHERE ORGID_PARENT =:ORGID))";
            queryString +=" OR (MA_DON_VI_CHU_TRI =:ORGID))";

            parameters.addValue("ORGID", orgId);
        }else{
            queryString +=" AND 1=0";
        }
//        else{
//            queryString += " AND (dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_HOI_DONG hd, DM_NGUOI_THUC_HIEN th \n" +
//                    "WHERE hd.MA_NGUOI_THUC_HIEN = th.MA_NGUOI_THUC_HIEN \n" +
//                    "AND th.NS_ID IN (SELECT MA_NHAN_VIEN FROM Q_USER WHERE USERID=:USERID)) " +
//                    "OR dt.MA_DETAI IN(SELECT MA_DETAI FROM DT_DETAI_NGUOI_THUC_HIEN tt WHERE  tt.NS_ID IN (SELECT MA_NHAN_VIEN FROM Q_USER WHERE USERID=:USERID)))" +
//                    " OR dt.NGUOI_TAO = :USERID OR NGUOI_SUA = :USERID";
//            parameters.addValue("USERID", userId);
//        }

        queryString += " ORDER BY dt.NGAY_TAO DESC OFFSET " + page + " ROWS FETCH NEXT " + pageSize + " ROWS ONLY";
        List<DeTaiResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(DeTaiResp.class));
        return listObj;
    }


    @Override
    public RoleResp CheckQuyen(String userId) throws Exception{
        String queryString = "SELECT r.[ROLEID] roleId,r.[ROLEDESC] roleDesc,r.[ROLECODE] roleCode FROM Q_ROLE r, Q_USER_ROLE ur  WHERE r.ROLEID =ur.ROLEID AND ur.USERID=:USERID ";
        MapSqlParameterSource parameters = new MapSqlParameterSource();

        parameters.addValue("USERID",userId);

        List<RoleResp> listObj = jdbcTemplate.query(queryString, parameters, BeanPropertyRowMapper.newInstance(RoleResp.class));
        if(listObj != null && listObj.size() >0){
            return listObj.get(0);
        }
        return null;
    }
}
