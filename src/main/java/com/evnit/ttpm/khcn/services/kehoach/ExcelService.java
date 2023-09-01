package com.evnit.ttpm.khcn.services.kehoach;

import com.evnit.ttpm.khcn.models.kehoach.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ExcelService {
    List<DonVi> getListDonVi(String orgId);
    List<DanhSachMau> getListDanhsachMau();
    DonVi getFirstDonVi(String orgId);
    List<NguonKinhPhi> getListNguonKinhPhi();
    KeHoach getFirstMaKeHoach(String maKeHoach);
    List<KeHoachChiTiet> getListKeHoachChiTiet(String maKeHoach);
}
