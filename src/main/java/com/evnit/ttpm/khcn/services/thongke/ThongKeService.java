package com.evnit.ttpm.khcn.services.thongke;

import com.evnit.ttpm.khcn.models.detai.DanhSachChung;
import com.evnit.ttpm.khcn.models.thongke.ListData;
import com.evnit.ttpm.khcn.models.thongke.ThongKeReq;
import com.evnit.ttpm.khcn.models.thongke.ThongKeResp;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuReq;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuResp;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ThongKeService {
    List<ThongKeResp> ListThongKe(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception;
    List<ListData> ListThongKeDeTaiKH(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception;
    List<ListData> ListThongKeCapDo(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId, boolean export) throws Exception;
    List<ListData> ListThongKeDonVi(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId, boolean export) throws Exception;
    List<DanhSachChung> ListLinhVucNC() throws Exception;
    List<DanhSachChung> ListCapDeTai() throws Exception;
    List<DanhSachChung> ListCapDonVi() throws Exception;

    List<ListData> ListThongKeSangKienKH(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception;
    List<ListData> ListThongKeSangKienCapDo(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception;
    List<ListData> ListThongKeSangKienCapDonVi(ThongKeReq thongKeReq, String page, String pageSize, String userId, String orgId,boolean export) throws Exception;
}
