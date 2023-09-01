/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.evnit.ttpm.khcn.controllers.service;


import com.evnit.ttpm.khcn.models.service.Api_Service_Input;
import com.evnit.ttpm.khcn.payload.request.service.ExecServiceRequest;
import com.evnit.ttpm.khcn.payload.response.AppResponse;
import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;
import com.evnit.ttpm.khcn.payload.response.service.KhaiThacDuLieuDataExcelResponse;
import com.evnit.ttpm.khcn.payload.response.service.KhaiThacDuLieuDataResponse;
import com.evnit.ttpm.khcn.security.jwt.JwtUtils;
import com.evnit.ttpm.khcn.services.admin.ApiService;
import com.evnit.ttpm.khcn.services.custom.CustomService;
import com.evnit.ttpm.khcn.services.service.ServiceService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.sql.*;
import java.util.Date;
import java.util.*;

/**
 *
 * @author Admin
 */
public class ServiceCustomController {

    ServiceService serviceService;

    CustomService customService;

    JwtUtils jwtUtils;

    UserDetailsService userDetailsService;

    public ServiceCustomController(ServiceService serviceService,CustomService customService,JwtUtils jwtUtils,UserDetailsService userDetailsService) {
        this.serviceService = serviceService;
        this.customService = customService;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    public Integer checkConnect(ExecServiceRequest execServiceRequest) {

        if (execServiceRequest.getParameters() != null) {
            String ip = "";
            String port = "";
            String userName = "";
            String password = "";
            String dbName = "";
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                try {
                    if ("IP".equals(obj.getName())) {
                        ip = obj.getValue().toString();
                    }
                    if ("PORT".equals(obj.getName())) {
                        port = obj.getValue().toString();
                    }
                    if ("TEN_DANG_NHAP".equals(obj.getName())) {
                        userName = obj.getValue().toString();
                    }
                    if ("MAT_KHAU".equals(obj.getName())) {
                        password = obj.getValue().toString();
                    }
                    if ("TEN_CSDL".equals(obj.getName())) {
                        dbName = obj.getValue().toString();
                    }

                } catch (Exception e) {
                    return -2;
                }

            }
            if (ip == null || ip == "" || port == null || port == "" || userName == null || userName == "" || password == null || password == "" || dbName == null || dbName == "") {
                return -2;
            }
            try {
                String connectionUrl = "jdbc:sqlserver://" + ip + ":" + port + ";databaseName=" + dbName + ";user=" + userName + ";password=" + password;
                Connection conn = DriverManager.getConnection(connectionUrl);
                if (conn.isValid(0)) {
                    conn.close();
                    return 1;
                } else {
                    return 0;
                }
            } catch (SQLException e) {
                switch (e.getErrorCode()) {
                    case 0:
                        return -4;//Không kết nối được tới hệ thống máy chủ
                    case 18456:
                        return -5;//Sai tên đăng nhập mật khẩu
                    case 4060:
                        return -6;//Tên cơ sở dữ liệu không tồn tại
                }
                return 0;
            }
        } else {
            return -2;
        }
    }
    public ExecServiceResponse exec_BE98CBC1_D3C3_46B6_91A6_BDF6F227D40C(ExecServiceRequest execServiceRequest) {
        String maNguoiThucHien="";
        for (Api_Service_Input obj : execServiceRequest.getParameters()) {
            if ("MA_NGUOI_THUC_HIEN".equals(obj.getName())) {
                maNguoiThucHien = obj.getValue().toString();
                break;
            }
        }
        if(maNguoiThucHien==null || maNguoiThucHien.equals(""))
        {
            return new ExecServiceResponse(-1, "Mã người thực hiện không tồn tại");
        }else
        {
            String tokenLink=this.customService.generatingRandomAlphabeticString(50);
            //Tao token 1 tuan
            String tokenAccept=jwtUtils.generateTokenUpdateLinkNguoiThucHien("anonymous",maNguoiThucHien,604800000);
            if(this.customService.taoKhoaCapNhatNguoiThucHien(maNguoiThucHien,tokenLink,tokenAccept))
            {
                return new ExecServiceResponse(1, tokenLink);
            }else
            {
                return new ExecServiceResponse(-1, "Lỗi thực hiện");
            }
        }
    }
    public KhaiThacDuLieuDataResponse exec_APIC_L_1(ExecServiceRequest execServiceRequest) {
        if (execServiceRequest.getParameters() != null) {
            String MA_BANG = "";
            String TEN_BANG = "";
            List<Map<String, Object>> LST_COT = new ArrayList<>();
            List<Map<String, Object>> LST_FILTER = new ArrayList<>();
            Integer PAGE_NUM = 1;
            Integer PAGE_ROW_NUM = 1000;
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                try {
                    if ("MA_BANG".equals(obj.getName())) {
                        MA_BANG = obj.getValue().toString();
                    }
                    if ("TEN_BANG".equals(obj.getName())) {
                        TEN_BANG = obj.getValue().toString();
                    }
                    if ("LST_COT_JSON".equals(obj.getName())) {
                        if (obj.getValue() != null) {
                            LST_COT = (List<Map<String, Object>>) obj.getValue();
                        }
                    }
                    if ("LST_FILTER_JSON".equals(obj.getName())) {
                        if (obj.getValue() != null) {
                            LST_FILTER = (List<Map<String, Object>>) obj.getValue();
                        }
                    }
                    if ("PAGE_NUM".equals(obj.getName())) {
                        PAGE_NUM = Integer.parseInt(obj.getValue().toString());
                    }
                    if ("PAGE_ROW_NUM".equals(obj.getName())) {
                        PAGE_ROW_NUM = Integer.parseInt(obj.getValue().toString());
                    }

                } catch (Exception e) {
                    return new KhaiThacDuLieuDataResponse(-2, "Tham số đầu vào không đúng");
                }

            }
            if ("".equals(MA_BANG) || LST_COT.isEmpty()) {
                return new KhaiThacDuLieuDataResponse(-2, "Tham số đầu vào không đúng");//Tham số đầu vào không đúng
            }
            Map<String, Object> connectInfo = serviceService.getConnectInfoByTable(MA_BANG);
            if (connectInfo == null) {
                return new KhaiThacDuLieuDataResponse(-10, "Không có thông tin kết nối");//Không có thông tin kết nối
            } else {
                try {
                    String connectionUrl = "jdbc:sqlserver://" + connectInfo.get("IP").toString() + ":"
                            + connectInfo.get("PORT").toString()
                            + ";databaseName=" + connectInfo.get("TEN_CSDL").toString()
                            + ";user=" + connectInfo.get("TEN_DANG_NHAP").toString() + ";password=" + connectInfo.get("MAT_KHAU").toString();
                    Connection conn = DriverManager.getConnection(connectionUrl);
                    if (conn.isValid(0)) {
                        HashMap<String, String> sqlString = KhaiThacDuLieuDataSQLResponse(TEN_BANG, LST_COT, LST_FILTER, PAGE_NUM, PAGE_ROW_NUM);
                        Statement lstData = conn.createStatement();
                        Statement lstDataCount = conn.createStatement();
                        ResultSet rsLstData = lstData.executeQuery(sqlString.get("strResult").toString());
                        ResultSet rsDataCount = lstDataCount.executeQuery(sqlString.get("strResultCount").toString());
                        rsDataCount.next();
                        Long dataCountResult = rsDataCount.getLong(1);
                        List<HashMap<String, String>> dataResult = new ArrayList<HashMap<String, String>>();
                        ResultSetMetaData mdLstData = rsLstData.getMetaData();
                        int columns = mdLstData.getColumnCount();
                        HashMap dataRowResult = new HashMap();
                        while (rsLstData.next()) {
                            dataRowResult = new HashMap();
                            for (int i = 1; i <= columns; i++) {
                                dataRowResult.put(mdLstData.getColumnName(i), rsLstData.getObject(i));
                            }
                            dataResult.add(dataRowResult);
                        }
                        return new KhaiThacDuLieuDataResponse(dataResult, dataCountResult, 1, "Thành công");
                    } else {
                        return new KhaiThacDuLieuDataResponse(-11, "Kết nối không tồn tại");
                    }
                } catch (SQLException e) {
                    switch (e.getErrorCode()) {
                        case 0:
                            return new KhaiThacDuLieuDataResponse(-4, "Không kết nối được tới máy chủ");
                        case 18456:
                            return new KhaiThacDuLieuDataResponse(-5, "Sai tên đăng nhập hoặc mật khẩu");
                        case 4060:
                            return new KhaiThacDuLieuDataResponse(-6, "Tên cơ sở dữ liệu không tồn tại");
                    }
                    return new KhaiThacDuLieuDataResponse(0, "Xảy ra lỗi trong quá trình thực hiện");
                }
            }
        } else {
            return new KhaiThacDuLieuDataResponse(-2, "Tham số đầu vào không đúng");//Tham số đầu vào không đúng
        }
    }

    public KhaiThacDuLieuDataExcelResponse exec_APIC_L_2(ExecServiceRequest execServiceRequest) {
        if (execServiceRequest.getParameters() != null) {
            String MA_BANG = "";
            String TEN_BANG = "";
            List<Map<String, Object>> LST_COT = new ArrayList<>();
            List<Map<String, Object>> LST_FILTER = new ArrayList<>();
            for (Api_Service_Input obj : execServiceRequest.getParameters()) {
                try {
                    if ("MA_BANG".equals(obj.getName())) {
                        MA_BANG = obj.getValue().toString();
                    }
                    if ("TEN_BANG".equals(obj.getName())) {
                        TEN_BANG = obj.getValue().toString();
                    }
                    if ("LST_COT_JSON".equals(obj.getName())) {
                        if (obj.getValue() != null) {
                            LST_COT = (List<Map<String, Object>>) obj.getValue();
                        }
                    }
                    if ("LST_FILTER_JSON".equals(obj.getName())) {
                        if (obj.getValue() != null) {
                            LST_FILTER = (List<Map<String, Object>>) obj.getValue();
                        }
                    }

                } catch (Exception e) {
                    return new KhaiThacDuLieuDataExcelResponse(-2, "Tham số đầu vào không đúng");
                }

            }
            if ("".equals(MA_BANG) || LST_COT.isEmpty()) {
                return new KhaiThacDuLieuDataExcelResponse(-2, "Tham số đầu vào không đúng");//Tham số đầu vào không đúng
            }
            Map<String, Object> connectInfo = serviceService.getConnectInfoByTable(MA_BANG);
            if (connectInfo == null) {
                return new KhaiThacDuLieuDataExcelResponse(-10, "Không có thông tin kết nối");//Không có thông tin kết nối
            } else {
                try {
                    String connectionUrl = "jdbc:sqlserver://" + connectInfo.get("IP").toString() + ":"
                            + connectInfo.get("PORT").toString()
                            + ";databaseName=" + connectInfo.get("TEN_CSDL").toString()
                            + ";user=" + connectInfo.get("TEN_DANG_NHAP").toString() + ";password=" + connectInfo.get("MAT_KHAU").toString();
                    Connection conn = DriverManager.getConnection(connectionUrl);
                    if (conn.isValid(0)) {
                        HashMap<String, String> sqlString = KhaiThacDuLieuDataSQLExcelResponse(TEN_BANG, LST_COT, LST_FILTER);
                        Statement lstData = conn.createStatement();
                        Statement lstDataCount = conn.createStatement();
                        ResultSet rsLstData = lstData.executeQuery(sqlString.get("strResult").toString());
                        List<HashMap<String, String>> dataResult = new ArrayList<HashMap<String, String>>();
                        ResultSetMetaData mdLstData = rsLstData.getMetaData();
                        int columns = mdLstData.getColumnCount();
                        HashMap dataRowResult = new HashMap();
                        //Xuất excel                        
                        return new KhaiThacDuLieuDataExcelResponse(ResultSetToExcel(rsLstData, TEN_BANG, LST_COT), TEN_BANG + (new Date()).getTime() + ".xlsx", 1, "Thành công");
                    } else {
                        return new KhaiThacDuLieuDataExcelResponse(-11, "Kết nối không tồn tại");
                    }
                } catch (SQLException e) {
                    switch (e.getErrorCode()) {
                        case 0:
                            return new KhaiThacDuLieuDataExcelResponse(-4, "Không kết nối được tới máy chủ");
                        case 18456:
                            return new KhaiThacDuLieuDataExcelResponse(-5, "Sai tên đăng nhập hoặc mật khẩu");
                        case 4060:
                            return new KhaiThacDuLieuDataExcelResponse(-6, "Tên cơ sở dữ liệu không tồn tại");
                    }
                    return new KhaiThacDuLieuDataExcelResponse(0, "Xảy ra lỗi trong quá trình thực hiện");
                }
            }
        } else {
            return new KhaiThacDuLieuDataExcelResponse(-2, "Tham số đầu vào không đúng");//Tham số đầu vào không đúng
        }
    }

    private void createCell(Row row, int columnCount, Object value, CellStyle styleInt, CellStyle styleDouble, CellStyle styleDate, CellStyle styleDateTime, XSSFSheet sheet) {

        Cell cell = row.createCell(columnCount);
        if (value instanceof Integer) {
            cell.setCellStyle(styleInt);
            cell.setCellValue((Integer) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else if (value instanceof Timestamp) {
            cell.setCellStyle(styleDateTime);
            cell.setCellValue(((Timestamp) value));
        } else if (value instanceof java.sql.Date) {
            cell.setCellStyle(styleDate);
            cell.setCellValue(((java.sql.Date) value));
        } else if (value instanceof BigDecimal) {
            cell.setCellStyle(styleDouble);
            cell.setCellValue(((BigDecimal) value).doubleValue());
        } else if (value instanceof Double) {
            cell.setCellStyle(styleDouble);
            cell.setCellValue(((Double) value));
        } else {
            cell.setCellValue((String) value);
        }

    }

    private void createCellHeader(Row row, int columnCount, String value, CellStyle style, XSSFSheet sheet) {

        Cell cell = row.createCell(columnCount);
        cell.setCellStyle(style);
        cell.setCellValue((String) value);

    }

    private String getColDescByColName(String colName, List<Map<String, Object>> LST_COT) {
        String strValue = colName;
        for (int i = 0; i <= LST_COT.size() - 1; i++) {
            if (LST_COT.get(i).get("TEN_COT").toString().equals(colName)) {
                strValue = LST_COT.get(i).get("MO_TA").toString();
                break;
            }
        }
        return strValue;
    }

    private Object ResultSetToExcel(ResultSet rsLstData, String tableName, List<Map<String, Object>> LST_COT) {
        try {
            ResultSetMetaData mdLstData = rsLstData.getMetaData();
            int columns = mdLstData.getColumnCount();
            HashMap dataRowResult = new HashMap();
            XSSFWorkbook workbook = new XSSFWorkbook();
            XSSFSheet sheet;
            sheet = workbook.createSheet(tableName);
            Row row = sheet.createRow(0);
            CellStyle styleHeader = workbook.createCellStyle();
            CellStyle styleInt = workbook.createCellStyle();
            CellStyle styleDouble = workbook.createCellStyle();
            CellStyle styleDate = workbook.createCellStyle();
            CellStyle styleDateTime = workbook.createCellStyle();
            XSSFFont font = workbook.createFont();
            font.setBold(true);
            font.setFontHeight(12);
            styleHeader.setFont(font);
            styleHeader.setAlignment(HorizontalAlignment.CENTER);

            XSSFFont fontContent = workbook.createFont();
            fontContent.setBold(false);
            fontContent.setFontHeight(12);

            styleInt.setFont(fontContent);
            styleDouble.setFont(fontContent);
            styleDate.setFont(fontContent);
            styleDateTime.setFont(fontContent);
            CreationHelper createHelper = workbook.getCreationHelper();
            styleInt.setDataFormat(
                    createHelper.createDataFormat().getFormat("#,##0"));
            styleDouble.setDataFormat(
                    createHelper.createDataFormat().getFormat("#,##0.00"));
            styleDate.setDataFormat(
                    createHelper.createDataFormat().getFormat("d/m/yyyy"));

            styleDateTime.setDataFormat(
                    createHelper.createDataFormat().getFormat("d/m/yyyy h:mm:ss"));

            for (int i = 1; i <= columns; i++) {
                createCellHeader(row, i - 1, getColDescByColName(mdLstData.getColumnName(i), LST_COT), styleHeader, sheet);
                //dataRowResult.put(mdLstData.getColumnName(i), rsLstData.getObject(i));
            }
            CellStyle styleContent = workbook.createCellStyle();

            Integer iRowCount = 0;
            Row rowContent = sheet.createRow(1);
            while (rsLstData.next()) {
                iRowCount++;
                rowContent = sheet.createRow(iRowCount);
                for (int i = 1; i <= columns; i++) {
                    createCell(rowContent, i - 1, rsLstData.getObject(i), styleInt, styleDouble, styleDate, styleDateTime, sheet);
                }

            }
            for (int i = 0; i <= columns - 1; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return Base64.getEncoder().encodeToString(baos.toByteArray());

        } catch (Exception e) {
            String t = "";
        }
        return null;

    }

    private HashMap<String, String> KhaiThacDuLieuDataSQLExcelResponse(String TEN_BANG,
            List<Map<String, Object>> LST_COT,
            List<Map<String, Object>> LST_FILTER) {
        /*Chưa sử lý lỗi bảo mật*/
        String strResult = "SELECT ";
        Collections.sort(LST_COT, new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                return Integer.parseInt(o1.get("STT").toString()) - Integer.parseInt(o2.get("STT").toString());
            }
        });
        Collections.sort(LST_FILTER, new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                return Integer.parseInt(o1.get("STT").toString()) - Integer.parseInt(o2.get("STT").toString());
            }
        });
        String lstColumnName = "";
        String lstColumnSort = "";
        String lstColumnFilter = "";
        for (Map<String, Object> obj : LST_COT) {
            lstColumnName += obj.get("TEN_COT").toString() + ",";
            if (obj.get("SORT") != null && "1".equals(obj.get("SORT").toString())) {
                lstColumnSort += obj.get("TEN_COT").toString() + " asc,";
            }
            if (obj.get("SORT") != null && "0".equals(obj.get("SORT").toString())) {
                lstColumnSort += obj.get("TEN_COT").toString() + " desc,";
            }
        }
        if (lstColumnName.length() > 0) {
            lstColumnName = lstColumnName.substring(0, lstColumnName.length() - 1);
        }
        if (lstColumnSort.length() > 0) {
            lstColumnSort = lstColumnSort.substring(0, lstColumnSort.length() - 1);
        }
        String columnFilter = "";
        for (Map<String, Object> obj : LST_FILTER) {

            columnFilter = "";
            switch (obj.get("MA_KIEU_DLIEU").toString()) {
                case "KDL-1":
                    switch (obj.get("LOAI_DKIEN").toString()) {
                        case "%V%":
                            columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " LIKE N'%" + obj.get("GIA_TRI_LOC") + "%'";
                            break;
                        case "V%":
                            columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " LIKE N'" + obj.get("GIA_TRI_LOC") + "%'";
                            break;
                        case "%V":
                            columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " LIKE N'%" + obj.get("GIA_TRI_LOC") + "'";
                            break;
                        default:
                            columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " " + obj.get("LOAI_DKIEN").toString() + " N'" + obj.get("GIA_TRI_LOC") + "'";
                    }
                    break;
                case "KDL-2":
                    columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " " + obj.get("LOAI_DKIEN").toString() + " " + obj.get("GIA_TRI_LOC") + "";
                    break;
                case "KDL-3":
                    columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " " + obj.get("LOAI_DKIEN").toString() + " " + " TRY_PARSE('" + obj.get("GIA_TRI_LOC") + "' AS DATE)";
                    break;
                case "KDL-4":
                    columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " " + obj.get("LOAI_DKIEN").toString() + " TRY_PARSE('" + obj.get("GIA_TRI_LOC") + "' AS DATETIME)";
                    break;
                default:
            }
            if (columnFilter.length() > 0) {
                lstColumnFilter = lstColumnFilter + " " + columnFilter;
            }
        }
        strResult = strResult + lstColumnName + " from " + TEN_BANG;
        if (lstColumnFilter.length() > 0) {
            strResult = strResult + " where 1=1 " + lstColumnFilter;
        };

        if (lstColumnSort.length() > 0) {
            strResult = strResult + " ORDER BY " + lstColumnSort;
        }
        HashMap<String, String> hashResult = new HashMap<String, String>();
        hashResult.put("strResult", strResult);
        return hashResult;

    }

    private HashMap<String, String> KhaiThacDuLieuDataSQLResponse(String TEN_BANG,
            List<Map<String, Object>> LST_COT,
            List<Map<String, Object>> LST_FILTER,
            Integer PAGE_NUM,
            Integer PAGE_ROW_NUM) {
        /*Chưa sử lý lỗi bảo mật*/
        String strResult = "SELECT ";
        String strResultCount = "SELECT COUNT(*)";
        Collections.sort(LST_COT, new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                return Integer.parseInt(o1.get("STT").toString()) - Integer.parseInt(o2.get("STT").toString());
            }
        });
        Collections.sort(LST_FILTER, new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                return Integer.parseInt(o1.get("STT").toString()) - Integer.parseInt(o2.get("STT").toString());
            }
        });
        String lstColumnName = "";
        String lstColumnSort = "";
        String lstColumnFilter = "";
        for (Map<String, Object> obj : LST_COT) {
            lstColumnName += obj.get("TEN_COT").toString() + ",";
            if (obj.get("SORT") != null && "1".equals(obj.get("SORT").toString())) {
                lstColumnSort += obj.get("TEN_COT").toString() + " asc,";
            }
            if (obj.get("SORT") != null && "0".equals(obj.get("SORT").toString())) {
                lstColumnSort += obj.get("TEN_COT").toString() + " desc,";
            }
        }
        if (lstColumnName.length() > 0) {
            lstColumnName = lstColumnName.substring(0, lstColumnName.length() - 1);
        }
        if (lstColumnSort.length() > 0) {
            lstColumnSort = lstColumnSort.substring(0, lstColumnSort.length() - 1);
        }
        String columnFilter = "";
        for (Map<String, Object> obj : LST_FILTER) {

            columnFilter = "";
            switch (obj.get("MA_KIEU_DLIEU").toString()) {
                case "KDL-1":
                    switch (obj.get("LOAI_DKIEN").toString()) {
                        case "%V%":
                            columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " LIKE N'%" + obj.get("GIA_TRI_LOC") + "%'";
                            break;
                        case "V%":
                            columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " LIKE N'" + obj.get("GIA_TRI_LOC") + "%'";
                            break;
                        case "%V":
                            columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " LIKE N'%" + obj.get("GIA_TRI_LOC") + "'";
                            break;
                        default:
                            columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " " + obj.get("LOAI_DKIEN").toString() + " N'" + obj.get("GIA_TRI_LOC") + "'";
                    }
                    break;
                case "KDL-2":
                    columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " " + obj.get("LOAI_DKIEN").toString() + " " + obj.get("GIA_TRI_LOC") + "";
                    break;
                case "KDL-3":
                    columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " " + obj.get("LOAI_DKIEN").toString() + " " + " TRY_PARSE('" + obj.get("GIA_TRI_LOC") + "' AS DATE)";
                    break;
                case "KDL-4":
                    columnFilter = obj.get("NHOM_DKIEU") + " " + obj.get("TEN_COT") + " " + obj.get("LOAI_DKIEN").toString() + " TRY_PARSE('" + obj.get("GIA_TRI_LOC") + "' AS DATETIME)";
                    break;
                default:
            }
            if (columnFilter.length() > 0) {
                lstColumnFilter = lstColumnFilter + " " + columnFilter;
            }
        }
        strResult = strResult + lstColumnName + " from " + TEN_BANG;
        strResultCount = strResultCount + " from " + TEN_BANG;
        if (lstColumnFilter.length() > 0) {
            strResult = strResult + " where 1=1 " + lstColumnFilter;
            strResultCount = strResultCount + " where 1=1 " + lstColumnFilter;
        };

        if (lstColumnSort.length() > 0) {
            strResult = strResult + " ORDER BY " + lstColumnSort;
        } else {
            strResult = strResult + " ORDER BY 1";
        };
        strResult = strResult + " OFFSET " + PAGE_NUM * PAGE_ROW_NUM + " ROWS FETCH NEXT " + PAGE_ROW_NUM + " ROWS ONLY";
        HashMap<String, String> hashResult = new HashMap<String, String>();
        hashResult.put("strResult", strResult);
        hashResult.put("strResultCount", strResultCount);
        return hashResult;

    }
}
