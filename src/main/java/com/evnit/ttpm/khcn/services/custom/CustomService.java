package com.evnit.ttpm.khcn.services.custom;

import org.springframework.stereotype.Service;

@Service
public interface CustomService {
    String generatingRandomAlphabeticString(int length);
    boolean taoKhoaCapNhatNguoiThucHien(String maNguoiThucHien,String tokenLink,String tokenAccept);

}
