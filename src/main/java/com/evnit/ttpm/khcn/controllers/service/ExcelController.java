package com.evnit.ttpm.khcn.controllers.service;

import com.aspose.words.Document;
import com.evnit.ttpm.khcn.models.kehoach.*;
import com.evnit.ttpm.khcn.models.service.Api_Service_Input;
import com.evnit.ttpm.khcn.models.thongke.ListData;
import com.evnit.ttpm.khcn.models.thongke.ThongKeResp;
import com.evnit.ttpm.khcn.payload.request.service.ExecServiceRequest;
import com.evnit.ttpm.khcn.payload.response.service.ExecServiceResponse;
import com.evnit.ttpm.khcn.security.services.SecurityUtils;
import com.evnit.ttpm.khcn.services.kehoach.ExcelService;
import org.apache.commons.io.FileUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.util.StringUtil;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class ExcelController {

    @Autowired
    ExcelService excelService;



    public ExecServiceResponse exec_FC95C3F7_942F_4C7E_88D7_46E12BFE9185(ExecServiceRequest execServiceRequest) { //xuat bao cao
        String orgId = SecurityUtils.getPrincipal().getORGID();
        String maKeHoach = "";
        for (Api_Service_Input obj : execServiceRequest.getParameters()) {
            if ("MA_KE_HOACH".equals(obj.getName())) {
                maKeHoach = obj.getValue().toString();
                //break;
            }
        }
        KeHoach kehoach = excelService.getFirstMaKeHoach(maKeHoach);
        List<DonVi> listDonVi = excelService.getListDonVi(kehoach.getMA_DON_VI());
        List<DanhSachMau> listDanhSachMau = excelService.getListDanhsachMau();
        DonVi donVi = excelService.getFirstDonVi(kehoach.getMA_DON_VI());
        List<KeHoachChiTiet> listKeHoachChiTiet = excelService.getListKeHoachChiTiet(maKeHoach);
        List<NguonKinhPhi> listNguonKinhPhi = excelService.getListNguonKinhPhi();

        try {
            String path = System.getProperty("user.dir");
            String html = CreateHtml(listDonVi, listDanhSachMau, donVi, listKeHoachChiTiet, listNguonKinhPhi, kehoach);
            if (html != null) {
                UUID uuid = UUID.randomUUID();
                String pathHtml = path + "/file" + uuid + ".html";
                File newHtmlFile = new File(pathHtml);
                FileUtils.writeStringToFile(newHtmlFile, html);
                Document doc = new Document(pathHtml);

                String fileName = "xuat_bieu_mau_" + uuid + ".docx";
                String pathSave = path + "/" + fileName;
                doc.save(pathSave);
                File file = new File(pathSave);
                byte[] fileContent = Files.readAllBytes(file.toPath());
                String fileBase64 = Base64.getEncoder().encodeToString(fileContent);
                boolean result = Files.deleteIfExists(newHtmlFile.toPath());
                boolean result2 = Files.deleteIfExists(file.toPath());
                return new ExecServiceResponse(fileBase64, 1, "Thành công.");
            }

        } catch (Exception ex) {
            ex.getMessage();
        }

        return new ExecServiceResponse(-1, "Không thành công.");
    }

    public String CreateHtml(List<DonVi> listDonVi, List<DanhSachMau> listDanhSachMau, DonVi donVi, List<KeHoachChiTiet> listKeHoachChiTiet, List<NguonKinhPhi> listNguonKinhPhi, KeHoach kehoach) {


        String html = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
                "<html xmlns:v=\"urn:schemas-microsoft-com:vml\"\n" +
                "xmlns:o=\"urn:schemas-microsoft-com:office:office\"\n" +
                "xmlns:x=\"urn:schemas-microsoft-com:office:excel\"\n" +
                "xmlns=\"http://www.w3.org/TR/REC-html40\">\n" +
                "\n" +
                "<head>\n" +
                "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\n" +
                "<meta name=\"ProgId\" content=\"Excel.Sheet\"/>\n" +
                "<meta name=\"Generator\" content=\"Aspose.Cell 23.6.5\"/>\n" +
                "<link rel=\"File-List\" href=\"_files_files/filelist.xml\"/>\n" +
                "<link rel=\"Edit-Time-Data\" href=\"_files_files/editdata.mso\"/>\n" +
                "<link rel=\"OLE-Object-Data\" href=\"_files_files/oledata.mso\"/>\n" +
                "<!--[if gte mso 9]><xml>\n" +
                " <o:DocumentProperties>\n" +
                "  <o:Author>Admin</o:Author>\n" +
                "  <o:LastPrinted>2023-07-09T01:37:41Z</o:LastPrinted>\n" +
                "  <o:Created>2023-04-06T02:51:22Z</o:Created>\n" +
                "  <o:LastSaved>2023-07-09T01:37:47Z</o:LastSaved>\n" +
                "</o:DocumentProperties>\n" +
                "</xml><![endif]-->\n" +
                "<style>\n" +
                "<!--table\n" +
                " {mso-displayed-decimal-separator:\"\\.\";\n" +
                " mso-displayed-thousand-separator:\"\\,\";}\n" +
                "@page\n" +
                " {\n" +
                " mso-header-data:\"\";\n" +
                " mso-footer-data:\"\";\n" +
                " margin:0.75in 0.1in 0.75in 0.2in;\n" +
                " mso-header-margin:0.3in;\n" +
                " mso-footer-margin:0.3in;\n" +
                " mso-page-orientation:Portrait;\n" +
                " }\n" +
                "tr\n" +
                " {mso-height-source:auto;\n" +
                " mso-ruby-visibility:none;}\n" +
                "col\n" +
                " {mso-width-source:auto;\n" +
                " mso-ruby-visibility:none;}\n" +
                "br\n" +
                " {mso-data-placement:same-cell;}\n" +
                "ruby\n" +
                " {ruby-align:left;}\n" +
                ".style0\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:general;\n" +
                " vertical-align:bottom;\n" +
                " white-space:nowrap;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:11pt;\n" +
                " font-weight:400;\n" +
                " font-style:normal;\n" +
                " font-family:Calibri,sans-serif;\n" +
                " mso-protection:locked visible;\n" +
                " mso-style-name:Normal;\n" +
                " mso-style-id:0;}\n" +
                ".font2\n" +
                " {\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif; }\n" +
                ".font5\n" +
                " {\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:400;\n" +
                " font-style:italic;\n" +
                " font-family:'Times New Roman',serif; }\n" +
                ".font9\n" +
                " {\n" +
                " color:#FF0000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif; }\n" +
                "td\n" +
                " {mso-style-parent:style0;\n" +
                " mso-number-format:General;\n" +
                " text-align:general;\n" +
                " vertical-align:bottom;\n" +
                " white-space:nowrap;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:11pt;\n" +
                " font-weight:400;\n" +
                " font-style:normal;\n" +
                " font-family:Calibri,sans-serif;\n" +
                " mso-protection:locked visible;\n" +
                " mso-ignore:padding;}\n" +
                ".x15\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:general;\n" +
                " vertical-align:bottom;\n" +
                " white-space:nowrap;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:11pt;\n" +
                " font-weight:400;\n" +
                " font-style:normal;\n" +
                " font-family:Calibri,sans-serif;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x21\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:center;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x22\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:justify;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x23\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:general;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x24\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:center;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:italic;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x25\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:justify;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:italic;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x26\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:general;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:italic;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x27\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:center;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:400;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x28\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:justify;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:400;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x29\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:general;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:400;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x30\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:center;\n" +
                " vertical-align:middle;\n" +
                " white-space:nowrap;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:13pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x31\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:general;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:400;\n" +
                " font-style:italic;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x32\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:justify;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:400;\n" +
                " font-style:italic;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x33\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:left;\n" +
                " vertical-align:middle;\n" +
                " white-space:nowrap;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x34\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:center;\n" +
                " vertical-align:middle;\n" +
                " white-space:nowrap;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x35\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:general;\n" +
                " vertical-align:bottom;\n" +
                " white-space:nowrap;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x36\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:center;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#FF0000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x37\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:left;\n" +
                " vertical-align:middle;\n" +
                " white-space:nowrap;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x38\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:center;\n" +
                " vertical-align:middle;\n" +
                " white-space:normal;word-wrap:break-word;\n" +
                " background:#D9D9D9;\n" +
                " mso-pattern:auto none;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " border-top:1px solid windowtext;\n" +
                " border-right:1px solid windowtext;\n" +
                " border-bottom:1px solid windowtext;\n" +
                " border-left:1px solid windowtext;\n" +
                " mso-diagonal-down:none;\n" +
                " mso-diagonal-up:none;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x39\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:center;\n" +
                " vertical-align:middle;\n" +
                " white-space:nowrap;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:14pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                ".x40\n" +
                " {\n" +
                " mso-number-format:General;\n" +
                " text-align:center;\n" +
                " vertical-align:middle;\n" +
                " white-space:nowrap;\n" +
                " background:auto;\n" +
                " mso-pattern:auto;\n" +
                " color:#000000;\n" +
                " font-size:12pt;\n" +
                " font-weight:700;\n" +
                " font-style:normal;\n" +
                " font-family:'Times New Roman',serif;\n" +
                " mso-protection:locked visible;\n" +
                " }\n" +
                "-->\n" +
                "</style>\n" +
                "<!--[if gte mso 9]><xml>\n" +
                " <x:ExcelWorkbook>\n" +
                "  <x:ExcelWorksheets>\n" +
                "   <x:ExcelWorksheet>\n" +
                "    <x:Name>Sheet1</x:Name>\n" +
                "<x:WorksheetOptions>\n" +
                " <x:StandardWidth>2048</x:StandardWidth>\n" +
                " <x:Print>\n" +
                "  <x:ValidPrinterInfo/>\n" +
                "  <x:PaperSizeIndex>9</x:PaperSizeIndex>\n" +
                "  <x:HorizontalResolution>600</x:HorizontalResolution>\n" +
                "  <x:VerticalResolution>600</x:VerticalResolution>\n" +
                " </x:Print>\n" +
                " <x:Selected/>\n" +
                "</x:WorksheetOptions>\n" +
                "   </x:ExcelWorksheet>\n" +
                "  </x:ExcelWorksheets>\n" +
                "  <x:WindowHeight>12330</x:WindowHeight>\n" +
                "  <x:WindowWidth>28800</x:WindowWidth>\n" +
                "  <x:WindowTopX>0</x:WindowTopX>\n" +
                "  <x:WindowTopY>0</x:WindowTopY>\n" +
                "  <x:RefModeR1C1/>\n" +
                "  <x:TabRatio>600</x:TabRatio>\n" +
                "  <x:ActiveSheet>0</x:ActiveSheet>\n" +
                " </x:ExcelWorkbook>\n" +
                "</xml><![endif]-->\n" +
                "</head>\n" +
                "<body link='blue' vlink='purple' >\n" +
                "\n" +
                "<table border='0' cellpadding='0' cellspacing='0' width='708' style='border-collapse: \n" +
                " collapse;table-layout:fixed;width:531pt'>\n" +
                " <col width='43' style='mso-width-source:userset;width:32.25pt'/>\n" +
                " <col width='217' style='mso-width-source:userset;width:162.75pt'/>\n" +
                " <col width='60' style='mso-width-source:userset;width:45pt'/>\n" +
                " <col width='76' style='mso-width-source:userset;width:57pt'/>\n" +
                " <col width='70' style='mso-width-source:userset;width:52.5pt'/>\n" +
                " <col width='78' style='mso-width-source:userset;width:58.5pt'/>\n" +
                " <col width='88' style='mso-width-source:userset;width:66pt'/>\n" +
                " <col width='76' style='mso-width-source:userset;width:57pt'/>\n" +
                " <tr height='41' style='mso-height-source:userset;height:30.75pt'>\n" +
                "<td colspan='8' height='41' class='x39' width='708' style='height:30.75pt;'>BẢNG TỔNG HỢP ĐỊNH HƯỚNG HOẠT ĐỘNG KHCN</td>\n" +
                " </tr>\n" +
                " <tr height='30' style='mso-height-source:userset;height:22.5pt'>\n" +
                "<td height='30' class='x30' style='height:22.5pt;'></td>\n" +
                "<td colspan='5' class='x40'><font class=\"font8\" style=\"text-decoration: none;\">{tieudedonvi}</font></td>\n" +
                "<td class='x37'><font class=\"font8\" style=\"text-decoration: none;\">{tieudenam}</font></td>\n" +
                //"<td colspan='5' class='x40'><font class=\"font8\" style=\"text-decoration: none;\">{tieudedonvi}&nbsp;</font><font class=\"font9\" style=\"text-decoration: none;\">{tendonvi}</font></td>\n" +
                //"<td class='x37'><font class=\"font8\" style=\"text-decoration: none;\">{tieudenam}</font><font class=\"font9\" style=\"text-decoration: none;\">&nbsp;{nam}</font></td>\n" +

                "<td class='x37'></td>\n" +
                " </tr>\n" +
                " <tr height='30' style='mso-height-source:userset;height:22.5pt'>\n" +
                "<td height='30' class='x30' style='height:22.5pt;'></td>\n" +
                "<td class='x33'><font class=\"font8\" style=\"text-decoration: none;\">{tieudedutoan}</font></td>\n" +
                // "<td class='x33'><font class=\"font8\" style=\"text-decoration: none;\">Tổng dự toán (triệu đồng):&nbsp;</font><font class=\"font9\" style=\"text-decoration: none;\">xxx</font></td>\n" +

                "<td colspan='6' class='x33' style='mso-ignore:colspan;'></td>\n" +
                " </tr>\n" +
                " <tr height='83' style='mso-height-source:userset;height:62.25pt'>\n" +
                "<td rowspan='3' height='121' class='x38' style='border-bottom:1px solid windowtext;height:90.75pt;'>STT</td>\n" +
                "<td rowspan='3' height='121' class='x38' style='border-bottom:1px solid windowtext;height:90.75pt;'>Hoạt động</td>\n" +
                "<td rowspan='3' height='121' class='x38' style='border-bottom:1px solid windowtext;height:90.75pt;'>Nguồn kinh phí (EVN/Đơn vị)</td>\n" +
                "<td rowspan='3' height='121' class='x38' style='border-bottom:1px solid windowtext;height:90.75pt;'>Kinh phí dự kiến (triệu đồng)</td>\n" +
                "<td rowspan='3' height='121' class='x38' style='border-bottom:1px solid windowtext;height:90.75pt;'>Đơn vị chủ trì</td>\n" +
                "<td rowspan='3' height='121' class='x38' style='border-bottom:1px solid windowtext;height:90.75pt;'>Chủ nhiệm nhiệm vụ</td>\n" +
                "<td rowspan='3' height='121' class='x38' style='border-bottom:1px solid windowtext;height:90.75pt;'>Nội dung hoạt động</td>\n" +
                "<td rowspan='3' height='121' class='x38' style='border-bottom:1px solid windowtext;height:90.75pt;'>Thời gian dự kiến thực hiện (từ tháng/năm đến tháng/năm)</td>\n" +
                " </tr>\n" +
                " <tr height='20' style='mso-height-source:userset;height:15pt'>\n" +
                " </tr>\n" +
                " <tr height='20' style='mso-height-source:userset;height:15pt'>\n" +
                " </tr>\n" +
                "{tempChung}" +
                "<![if supportMisalignedColumns]>\n" +
                " <tr height='0' style='display:none'>\n" +
                "  <td width='43' style='width:32.25pt;'></td>\n" +
                "  <td width='217' style='width:162.75pt;'></td>\n" +
                "  <td width='60' style='width:45pt;'></td>\n" +
                "  <td width='76' style='width:57pt;'></td>\n" +
                "  <td width='70' style='width:52.5pt;'></td>\n" +
                "  <td width='78' style='width:58.5pt;'></td>\n" +
                "  <td width='88' style='width:66pt;'></td>\n" +
                "  <td width='76' style='width:57pt;'></td>\n" +
                " </tr>\n" +
                " <![endif]>\n" +
                "</table>\n" +
                "\n" +
                "</body>\n" +
                "\n" +
                "</html>\n";

        if (listDonVi != null && listDonVi.size() > 0) {
            html = html.replace("{tieudedonvi}", "Năm: " + kehoach.getNAM());
            html = html.replace("{tieudenam}", "");
            html = html.replace("{tieudedutoan}", "");
        } else {
            html = html.replace("{tieudedonvi}", "Tên Đơn vị: " + donVi.getTenNhom());
            html = html.replace("{tieudenam}", "Năm: " + kehoach.getNAM());
            html = html.replace("{tieudedutoan}", "Tổng dự toán (triệu đồng): ");
        }
        String htmlChung = CreateBodyHtml(listDonVi, listDanhSachMau, donVi, listKeHoachChiTiet, listNguonKinhPhi);
        html = html.replace("{tempChung}", htmlChung);
        return html;
    }

    public String CreateBodyHtml(List<DonVi> listDonVi, List<DanhSachMau> listDanhSachMau, DonVi donVi, List<KeHoachChiTiet> listKeHoachChiTiet, List<NguonKinhPhi> listNguonKinhPhi) {
        String htmlTemp = " <tr height='21' style='mso-height-source:userset;height:15.75pt'>\n" +
                "<td height='19' class='x21' style='height:14.25pt;'>{stt1}</td>\n" +
                "<td class='x22'>{temp1}</td>\n" +
                "<td class='x21'></td>\n" +
                "<td class='x21'></td>\n" +
                "<td class='x21'></td>\n" +
                "<td class='x21'></td>\n" +
                "<td class='x23'></td>\n" +
                "<td class='x22'></td>\n" +
                " </tr>\n" +
//                " <tr height='21' style='mso-height-source:userset;height:15.75pt'>\n" +
//                "<td height='19' class='x24' style='height:14.25pt;'>{stt2}</td>\n" +
//                "<td class='x25'>{temp2}</td>\n" +
//                "<td class='x24'></td>\n" +
//                "<td class='x24'></td>\n" +
//                "<td class='x24'></td>\n" +
//                "<td class='x24'></td>\n" +
//                "<td class='x26'></td>\n" +
//                "<td class='x24'></td>\n" +
//                " </tr>\n" +
                "{tempCap}";

        String htmlTempCap = " <tr height='21' style='mso-height-source:userset;height:15.75pt'>\n" +
                "<td height='19' class='x24' style='height:14.25pt;'>{stt2}</td>\n" +
                "<td class='x25'>{temp2}</td>\n" +
                "<td class='x24'></td>\n" +
                "<td class='x24'></td>\n" +
                "<td class='x24'></td>\n" +
                "<td class='x24'></td>\n" +
                "<td class='x26'></td>\n" +
                "<td class='x24'></td>\n" +
                " </tr>\n" +
                "{tempDonVi}";


        String htmlTempDonVi = " <tr height='21' style='mso-height-source:userset;height:15.75pt'>\n" +
                "<td height='19' class='x24' style='height:14.25pt;'>{stt2}</td>\n" +
                "<td class='x25'>{temp2}</td>\n" +
                "<td class='x24'></td>\n" +
                "<td class='x24'></td>\n" +
                "<td class='x24'></td>\n" +
                "<td class='x24'></td>\n" +
                "<td class='x26'></td>\n" +
                "<td class='x24'></td>\n" +
                " </tr>\n" +
                "{tempChiTiet}";
        String htmlTempChiTiet = " <tr height='21' style='mso-height-source:userset;height:15.75pt'>\n" +
                "<td height='19' class='x27' style='height:14.25pt;'>{tempstt}</td>\n" +
                "<td class='x28'>{tempNoiDung}</td>\n" +
                "<td class='x27'>{tempNguonKinhPhi}</td>\n" +
                "<td class='x27'>{tempDuToan}</td>\n" +
                "<td class='x27'>{tempDonVi}</td>\n" +
                "<td class='x27'>{tempChuNhiem}</td>\n" +
                "<td class='x29'>{tempNoiDung}</td>\n" +
                "<td class='x32'>{tempThoiGian}</td>\n" +
                " </tr>";
        String html = "";
        String htmlDonVi = "";
        String htmlChiTiet = "";
        List<DanhSachMau> listDanhSachMauCha = listDanhSachMau.stream().filter(c -> c.getMA_NHOM_CHA() == null).collect(Collectors.toList());
        int i = 1;
        int j = 1;
        int k = 1;
        //html =htmlTemp;
        String htmlCap1 = "";
        String htmlTotal = "";
        listDanhSachMauCha.sort(Comparator.comparing(DanhSachMau::getSTT));
        for (DanhSachMau item : listDanhSachMauCha) {
            List<DanhSachMau> listDanhSachMaucon1 = listDanhSachMau.stream().filter(c -> c.getMA_NHOM_CHA() != null && c.getMA_NHOM_CHA().equals(item.getMA_NHOM())).collect(Collectors.toList());
            html = htmlTemp.replace("{stt1}", i + "");
            html = html.replace("{temp1}", item.getTEN_NHOM());
            String htmlCap2 = "";
            String htmlCapTotal2 = "";
            j = 1;
            for (DanhSachMau item1 : listDanhSachMaucon1) {
                htmlCap2 = htmlTempCap.replace("{stt2}", i + "." + j);
                htmlCap2 = htmlCap2.replace("{temp2}", item1.getTEN_NHOM());

                if (listDonVi != null && listDonVi.size() > 0) {
                    //htmlDonVi = htmlTempDonVi;
                    String htmlDonViChiTiet = "";
                    k = 1;
                    for (DonVi itemDv : listDonVi) {
                        htmlDonVi = htmlTempDonVi.replace("{stt2}", i + "." + j + "." + k);
                        htmlDonVi = htmlDonVi.replace("{temp2}", itemDv.getTenNhom());
                        String htmlChiTietTotal = "";
                        List<KeHoachChiTiet> listChiTiet = listKeHoachChiTiet.stream().filter(c -> c.getMA_NHOM() != null && c.getMA_NHOM().equals(item1.getMA_NHOM()) && c.getMA_DON_VI().equals(itemDv.getMaNhom())).collect(Collectors.toList());
                        if (listChiTiet != null && listChiTiet.size() > 0) {
                            for (KeHoachChiTiet chiTiet : listChiTiet) {
                                List<NguonKinhPhi> listNguon = listNguonKinhPhi.stream().filter(c -> c.getMA_NGUON_KINH_PHI() != null && c.getMA_NGUON_KINH_PHI().equals(chiTiet.getMA_NGUON_KINH_PHI())).collect(Collectors.toList());
                                String tenNguon = "";
                                if (listNguon != null && listNguon.size() > 0) {
                                    tenNguon = listNguon.get(0).getTEN_NGUON_KINH_PHI();
                                }
                                htmlChiTiet = htmlTempChiTiet.replace("{tempstt}", "");
                                htmlChiTiet = htmlChiTiet.replace("{tempNoiDung}", chiTiet.getNOI_DUNG_DANG_KY());
                                htmlChiTiet = htmlChiTiet.replace("{tempNguonKinhPhi}", tenNguon);
                                htmlChiTiet = htmlChiTiet.replace("{tempDuToan}", chiTiet.getDU_TOAN());
                                htmlChiTiet = htmlChiTiet.replace("{tempDonVi}", chiTiet.getDON_VI_CHU_TRI());
                                htmlChiTiet = htmlChiTiet.replace("{tempChuNhiem}", chiTiet.getCHU_NHIEM_NHIEM_VU());
                                htmlChiTiet = htmlChiTiet.replace("{tempNoiDung}", chiTiet.getNOI_DUNG());
                                htmlChiTiet = htmlChiTiet.replace("{tempThoiGian}", chiTiet.getTHOI_GIAN_THUC_HIEN());
                                htmlChiTietTotal += htmlChiTiet;
                            }
                            htmlDonVi = htmlDonVi.replace("{tempChiTiet}", htmlChiTietTotal);
                        } else {
                            htmlDonVi = htmlDonVi.replace("{tempChiTiet}", "");
                        }
                        htmlDonViChiTiet += htmlDonVi;
                        k++;
                    }
                    // html +=html.replace("{tempChiTiet}",htmlChiTiet);
                    htmlCap2 = htmlCap2.replace("{tempDonVi}", htmlDonViChiTiet);
                } else {
                    String htmlChiTietTotal = "";
                    List<KeHoachChiTiet> listChiTiet = listKeHoachChiTiet.stream().filter(c -> c.getMA_NHOM() != null && c.getMA_NHOM().equals(item1.getMA_NHOM())).collect(Collectors.toList());
                    if (listChiTiet != null && listChiTiet.size() > 0) {
                        for (KeHoachChiTiet chiTiet : listChiTiet) {
                            List<NguonKinhPhi> listNguon = listNguonKinhPhi.stream().filter(c -> c.getMA_NGUON_KINH_PHI() != null && c.getMA_NGUON_KINH_PHI().equals(chiTiet.getMA_NGUON_KINH_PHI())).collect(Collectors.toList());
                            String tenNguon = "";
                            if (listNguon != null && listNguon.size() > 0) {
                                tenNguon = listNguon.get(0).getTEN_NGUON_KINH_PHI();
                            }
                            htmlChiTiet = htmlTempChiTiet.replace("{tempstt}", "");
                            htmlChiTiet = htmlChiTiet.replace("{tempNoiDung}", chiTiet.getNOI_DUNG_DANG_KY());
                            htmlChiTiet = htmlChiTiet.replace("{tempNguonKinhPhi}", tenNguon);
                            htmlChiTiet = htmlChiTiet.replace("{tempDuToan}", chiTiet.getDU_TOAN());
                            htmlChiTiet = htmlChiTiet.replace("{tempDonVi}", chiTiet.getDON_VI_CHU_TRI());
                            htmlChiTiet = htmlChiTiet.replace("{tempChuNhiem}", chiTiet.getCHU_NHIEM_NHIEM_VU());
                            htmlChiTiet = htmlChiTiet.replace("{tempNoiDung}", chiTiet.getNOI_DUNG());
                            htmlChiTiet = htmlChiTiet.replace("{tempThoiGian}", chiTiet.getTHOI_GIAN_THUC_HIEN());
                            htmlChiTietTotal += htmlChiTiet;
                        }
                        htmlCap2 = htmlCap2.replace("{tempDonVi}", htmlChiTietTotal);
                    } else {
                        htmlCap2 = htmlCap2.replace("{tempDonVi}", "");
                    }
                }

                htmlCapTotal2 += htmlCap2;
                j++;
            }
            html = html.replace("{tempCap}", htmlCapTotal2);

            htmlTotal += html;
            i++;
        }
        String result = htmlTotal;
        return htmlTotal;
    }


    public ExecServiceResponse exec_030A9A96_90D5_4AD0_80E4_C596AED63EE7(ExecServiceRequest execServiceRequest) {
        String orgId = SecurityUtils.getPrincipal().getORGID();
//        String orgId = "";
//        for (Api_Service_Input obj : execServiceRequest.getParameters()) {
//            if ("ORGID".equals(obj.getName())) {
//                orgId = obj.getValue().toString();
//                //break;
//            }
//        }
        List<DonVi> listDonVi = excelService.getListDonVi(orgId);

        return new ExecServiceResponse(listDonVi, 1, "Thành công.");
    }

    public ExecServiceResponse exec_B186CEDA_876B_4511_96D1_E199926A6913(ExecServiceRequest execServiceRequest) {
        String fileBase64 = "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";
        String orgId = SecurityUtils.getPrincipal().getORGID();
//        for (Api_Service_Input obj : execServiceRequest.getParameters()) {
//             if ("ORGID".equals(obj.getName())) {
//                orgId = obj.getValue().toString();
//                //break;
//            }
//        }
        if (orgId == null || orgId.equals("")) {
            return new ExecServiceResponse(-1, "Bạn không thuộc đơn vị nào.");
        } else {

            List<DonVi> listDonVi = excelService.getListDonVi(orgId);
            List<DanhSachMau> listDanhSachMau = excelService.getListDanhsachMau();
            DonVi donVi = excelService.getFirstDonVi(orgId);

            boolean checkChild = false;
//            if (listDonVi != null && listDonVi.size() > 0) {
//                checkChild = true;
//
//            }
            try {
                //FileInputStream file = new FileInputStream(new File("howtodoinjava_demo.xlsx"));
                byte[] result = Base64.getDecoder().decode(fileBase64);

                InputStream is = new ByteArrayInputStream(result);


//                File targetFile = new File("D:/test.xlsx");
//                OutputStream outStream = new FileOutputStream(targetFile);
//
//                byte[] buffer = new byte[8 * 1024];
//                int bytesRead;
//                while ((bytesRead = is.read(buffer)) != -1) {
//                    outStream.write(buffer, 0, bytesRead);
//                }
//                outStream.close();
//                is.close();
                //Create Workbook instance holding reference to .xlsx file


                Workbook workbook = new XSSFWorkbook(is);

                //Get first/desired sheet from the workbook
                Sheet sheet = workbook.getSheetAt(0);
                CellStyle cellStyle = createStyleTitle(sheet, 1);
                //tieu de
                String tieude = "BIỂU MẪU ĐĂNG KÝ ĐỊNH HƯỚNG HOẠT ĐỘNG KHCN";
//                if(checkChild){
//                    tieude ="BẢNG TỔNG HỢP ĐỊNH HƯỚNG HOẠT ĐỘNG KHCN";
//                }
                CellStyle cellStyleCenter = createStyleTitle(sheet, 1);
                // cellStyleCenter.setAlignment(HorizontalAlignment.CENTER);
                Row row = sheet.createRow(0);
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 7));
                Cell cell = row.createCell(0);
                cell.setCellStyle(cellStyleCenter);
                cell.setCellValue(tieude);

                String DonViNam = "Tên Đơn vị: " + donVi.getOrgdesc();
                //don vi nam
//                if (checkChild) {
                    DonViNam = "Năm: " + Year.now().getValue();
                    Row row11 = sheet.createRow(1);
                    sheet.addMergedRegion(new CellRangeAddress(1, 1, 1, 7));
                    Cell cell11 = row11.createCell(1);
                    cell11.setCellStyle(cellStyle);
                    cell11.setCellValue(DonViNam);
//                } else {
//                    CellStyle cellStyle2 = createStyle(sheet, 0);
//                    Row row11 = sheet.createRow(1);
//                    sheet.addMergedRegion(new CellRangeAddress(1, 1, 1, 5));
//                    Cell cell11 = row11.createCell(1);
//                    cell11.setCellStyle(cellStyle2);
//                    cell11.setCellValue(DonViNam);
//                    //nam
//                    // Row row1 = sheet.getRow(1);
//                    //sheet.addMergedRegion(new CellRangeAddress(1, 1, 6, 5));
//                    Cell cell12 = row11.createCell(6);
//                    cell12.setCellStyle(cellStyle2);
//                    cell12.setCellValue("Năm: " + Year.now().getValue());
//
//                    Row row21 = sheet.createRow(2);
//                    sheet.addMergedRegion(new CellRangeAddress(2, 2, 1, 5));
//                    Cell cell20 = row21.createCell(1);
//                    cell20.setCellStyle(cellStyle2);
//                    cell20.setCellValue("Tổng dự toán (triệu đồng):");
//                }
                //tao header
                List<String> listHeader = new ArrayList<>();
                listHeader.add("STT");
                listHeader.add("Hoạt động");
                listHeader.add("Nguồn kinh phí (EVN/Đơn vị)");
                listHeader.add("Kinh phí dự kiến (triệu đồng)");
                listHeader.add("Đơn vị chủ trì");
                listHeader.add("Chủ nhiệm nhiệm vụ");
                listHeader.add("Nội dung hoạt động");
                listHeader.add("Thời gian dự kiến thực hiện (từ tháng/năm đến tháng/năm)");
                writeExportHeaderExcel(sheet, 3, listHeader, 1);
                //tao danh sach
                List<DanhSachMau> listCha = listDanhSachMau.stream().filter(c -> c.getMA_NHOM_CHA() == null).collect(Collectors.toList());
                if (listCha != null && listCha.size() > 0) {
                    int rowIndex = 5;
                    int cellIndex = 0;
                    int i = 1;
                    for (DanhSachMau item : listCha) {
                        rowIndex++;
                        cellIndex = 0;
                        String stt = i + "";
                        Row rows = sheet.createRow(rowIndex);
                        writeExportData(sheet, rows, cellIndex, stt, 1);
                        cellIndex++;
                        writeExportData(sheet, rows, cellIndex, item.getTEN_NHOM(), 0);
                        List<DanhSachMau> listChild = listDanhSachMau.stream().filter(c -> c.getMA_NHOM_CHA() != null && c.getMA_NHOM_CHA().equals(item.getMA_NHOM())).collect(Collectors.toList());
                        int j = 1;
                        for (DanhSachMau item2 : listChild) {
                            rowIndex++;
                            cellIndex = 0;
                            stt = i + "." + j;
                            rows = sheet.createRow(rowIndex);
                            writeExportDataChuNghieng(sheet, rows, cellIndex, stt, 1);
                            cellIndex++;
                            writeExportDataChuNghieng(sheet, rows, cellIndex, item2.getTEN_NHOM(), 0);

                            if (checkChild) {
                                int k = 1;
                                for (DonVi item3 : listDonVi) {
                                    rowIndex++;
                                    cellIndex = 0;

                                    stt = i + "." + j + "." + k;
                                    rows = sheet.createRow(rowIndex);
                                    writeExportDataChuNghieng(sheet, rows, cellIndex, stt, 1);
                                    cellIndex++;
                                    writeExportDataChuNghieng(sheet, rows, cellIndex, item3.getOrgdesc(), 0);
                                    k++;
                                }
                            }
                            j++;
                        }
                        i++;
                    }
                }

                byte[] resultFile = createOutputFile(workbook);
//                String path ="D:/test"+java.util.UUID.randomUUID()+".xlsx";
//                File file = new File(path);
//                OutputStream os = new FileOutputStream(file);
//
//                // Starting writing the bytes in it
//                os.write(resultFile);
//                os.close();
                String encoded = Base64.getEncoder().encodeToString(resultFile);

                workbook.close();
                is.close();
                return new ExecServiceResponse(encoded, 1, "Thành công.");

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return new ExecServiceResponse(-1, "Lỗi convert file");
    }

    private static void writeExportData(Sheet sheet, Row rows, int cell, String val, int position) {
        try {
            CellStyle cellStyle = createStyle(sheet, position);
            Cell cells = rows.createCell(cell);
            cells.setCellStyle(cellStyle);
            cells.setCellValue(val);
        } catch (Exception ex) {

        }
    }

    private static void writeExportDataChuNghieng(Sheet sheet, Row rows, int cell, String val, int position) {
        try {
            CellStyle cellStyle = createStyleItatic(sheet, position);

            Cell cells = rows.createCell(cell);
            cells.setCellStyle(cellStyle);
            cells.setCellValue(val);
        } catch (Exception ex) {

        }
    }

    private static void writeExportHeaderExcel(Sheet sheet, int rowIndex, List<String> listHeader, int position) throws Exception {
        // create CellStyle
        CellStyle cellStyle = createStyleForHeader(sheet, position);
        sheet.addMergedRegion(new CellRangeAddress(3, 5, 0, 0));
        sheet.addMergedRegion(new CellRangeAddress(3, 5, 1, 1));
        sheet.addMergedRegion(new CellRangeAddress(3, 5, 2, 2));
        sheet.addMergedRegion(new CellRangeAddress(3, 5, 3, 3));
        sheet.addMergedRegion(new CellRangeAddress(3, 5, 4, 4));
        sheet.addMergedRegion(new CellRangeAddress(3, 5, 5, 5));
        sheet.addMergedRegion(new CellRangeAddress(3, 5, 6, 6));
        sheet.addMergedRegion(new CellRangeAddress(3, 5, 7, 7));
        // Create row
        sheet.setColumnWidth(1, 10000);
        sheet.setColumnWidth(2, 5000);
        sheet.setColumnWidth(3, 5000);
        sheet.setColumnWidth(4, 5000);
        sheet.setColumnWidth(5, 5000);
        sheet.setColumnWidth(6, 5000);
        sheet.setColumnWidth(7, 5000);
        Row row = sheet.createRow(rowIndex);

        for (int i = 0; i < listHeader.size(); i++) {
            Cell cell = row.createCell(i);
            cell.setCellStyle(cellStyle);
            cell.setCellValue(listHeader.get(i));
        }

    }

    private static void writeExportHeaderExcelThongKe(Sheet sheet, int rowIndex, List<String> listHeader, int position) throws Exception {
        // create CellStyle
        CellStyle cellStyle = createStyleForHeader(sheet, position);
//        sheet.addMergedRegion(new CellRangeAddress(3, 5, 0, 0));
//        sheet.addMergedRegion(new CellRangeAddress(3, 5, 1, 1));
//        sheet.addMergedRegion(new CellRangeAddress(3, 5, 2, 2));
//        sheet.addMergedRegion(new CellRangeAddress(3, 5, 3, 3));
//        sheet.addMergedRegion(new CellRangeAddress(3, 5, 4, 4));
//        sheet.addMergedRegion(new CellRangeAddress(3, 5, 5, 5));
//        sheet.addMergedRegion(new CellRangeAddress(3, 5, 6, 6));
//        sheet.addMergedRegion(new CellRangeAddress(3, 5, 7, 7));
        // Create row
        sheet.setColumnWidth(1, 10000);
        sheet.setColumnWidth(2, 5000);
        sheet.setColumnWidth(3, 5000);
        sheet.setColumnWidth(4, 5000);
        sheet.setColumnWidth(5, 5000);
        sheet.setColumnWidth(6, 5000);
        sheet.setColumnWidth(7, 5000);
        Row row = sheet.createRow(rowIndex);

        for (int i = 0; i < listHeader.size(); i++) {
            sheet.addMergedRegion(new CellRangeAddress(3, 5, i, i));
            Cell cell = row.createCell(i);
            cell.setCellStyle(cellStyle);
            cell.setCellValue(listHeader.get(i));
        }

    }

    private byte[] createOutputFile(Workbook workbook) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try {
            workbook.write(bos);
        } finally {
            bos.close();
        }
        byte[] bytes = bos.toByteArray();
        return bytes;
    }

    private static CellStyle createStyle(Sheet sheet, int position) throws Exception {
        // Create font
        Font font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setBold(true);
        font.setFontHeightInPoints((short) 12); // font size

        // font.setColor(IndexedColors.GREEN.getIndex()); // text color

        // Create CellStyle
        CellStyle cellStyle = sheet.getWorkbook().createCellStyle();
        cellStyle.setFont(font);
        if (position == 1) {
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
        }
        // cellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        //  cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        //cellStyle.setBorderBottom(BorderStyle.THIN);
        return cellStyle;
    }

    private static CellStyle createStyleTitle(Sheet sheet, int position) throws Exception {
        // Create font
        Font font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setBold(true);
        font.setFontHeightInPoints((short) 14); // font size
        // font.setColor(IndexedColors.GREEN.getIndex()); // text color

        // Create CellStyle
        CellStyle cellStyle = sheet.getWorkbook().createCellStyle();
        cellStyle.setFont(font);
        if (position == 1) {
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
        }

        // cellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        //  cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        //cellStyle.setBorderBottom(BorderStyle.THIN);
        return cellStyle;
    }

    private static CellStyle createStyleItatic(Sheet sheet, int position) throws Exception {
        // Create font
        Font font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setBold(true);
        font.setItalic(true);
        font.setFontHeightInPoints((short) 12); // font size
        // font.setColor(IndexedColors.GREEN.getIndex()); // text color

        // Create CellStyle
        CellStyle cellStyle = sheet.getWorkbook().createCellStyle();
        cellStyle.setFont(font);
        if (position == 1) {
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
        }
        // cellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        //  cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        //cellStyle.setBorderBottom(BorderStyle.THIN);
        return cellStyle;
    }

    private static CellStyle createStyleForHeader(Sheet sheet, int position) throws Exception {
        // Create font
        Font font = sheet.getWorkbook().createFont();
        font.setFontName("Times New Roman");
        font.setBold(true);
        font.setFontHeightInPoints((short) 12); // font size
        //font.setColor(IndexedColors.GREY_25_PERCENT.getIndex()); // text color

        // Create CellStyle
        CellStyle cellStyle = sheet.getWorkbook().createCellStyle();
        cellStyle.setFont(font);
        cellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setWrapText(true);
        if (position == 1) {
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
            cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        }
        return cellStyle;
    }

    public ExecServiceResponse exec_1E707636_93B5_43EA_97BC_2F850C14D1E3(ExecServiceRequest execServiceRequest) {
        String fileBase64 = "";
        String orgId = SecurityUtils.getPrincipal().getORGID();
        for (Api_Service_Input obj : execServiceRequest.getParameters()) {
            if ("FILE_UPLOAD".equals(obj.getName())) {
                fileBase64 = obj.getValue().toString();
                //break;
            }
        }
        if (fileBase64 == null || fileBase64.equals("")) {
            return new ExecServiceResponse(-1, "File không tồn tại.");
        } else {
            try {
                List<DonVi> listDonVi = excelService.getListDonVi(orgId);
                List<DanhSachMau> listDanhSachMau = excelService.getListDanhsachMau();
                //DonVi donVi = excelService.getFirstDonVi(orgId);
                List<NguonKinhPhi> listNguonKinhPhi = excelService.getListNguonKinhPhi();
                boolean checkMaDonVi = false;
//                if (listDonVi != null && listDonVi.size() > 0) {
//                    checkMaDonVi = true;
//                }
                //FileInputStream file = new FileInputStream(new File("howtodoinjava_demo.xlsx"));
                byte[] result = Base64.getDecoder().decode(fileBase64);

                InputStream is = new ByteArrayInputStream(result);
//                File targetFile = new File("D:/test.xlsx");
//                OutputStream outStream = new FileOutputStream(targetFile);
//
//                byte[] buffer = new byte[8 * 1024];
//                int bytesRead;
//                while ((bytesRead = is.read(buffer)) != -1) {
//                    outStream.write(buffer, 0, bytesRead);
//                }
//                outStream.close();
//                is.close();
                //Create Workbook instance holding reference to .xlsx file
                Workbook workbook = new XSSFWorkbook(is);

                //Get first/desired sheet from the workbook
                Sheet sheet = workbook.getSheetAt(0);
                int rowNum = 7;
//              if(listDonVi != null && listDonVi.size() >0){
//                  rowNum = 8;
//              }
                int cellNum = 0;
                String manhom = "";
                String maDonVi = "";
                boolean checkVal = true;
                List<KeHoachChiTietReq> listKetHoach = new ArrayList<>();
                for (int i = rowNum; i <= sheet.getLastRowNum(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) {
                        break;
                    }
                    checkVal = true;
                    cellNum = 1;
                    String val = GetValueSheet(row, cellNum);
                    String finalVal = val;
                    List<DanhSachMau> listMau = listDanhSachMau.stream().filter(c -> c.getTEN_NHOM().toLowerCase().equals(finalVal.toLowerCase())).collect(Collectors.toList());
                    if (listMau != null && listMau.size() > 0) {
                        manhom = listMau.get(0).getMA_NHOM();
                        checkVal = false;
                        continue;
                    } else {
                        if (checkMaDonVi) {
                            String finalVal1 = val;
                            List<DonVi> listDv = listDonVi.stream().filter(c -> c.getTenNhom().toLowerCase().equals(finalVal1.toLowerCase())).collect(Collectors.toList());
                            if (listDv != null && listDv.size() > 0) {
                                maDonVi = listDv.get(0).getMaNhom();
                                checkVal = false;
                                continue;
                            }
                        }
                    }
                    if (checkVal) {
                        KeHoachChiTietReq kh = new KeHoachChiTietReq();
                        kh.setMaNhom(manhom);
                        kh.setMaDonVi(maDonVi);
                        kh.setNoiDungDangKy(val);
                        cellNum++;
                        val = GetValueSheet(row, cellNum);
                        if (cellNum == 2) {
                            String finalVal2 = val;
                            List<NguonKinhPhi> listNkp = listNguonKinhPhi.stream().filter(c -> c.getTEN_NGUON_KINH_PHI().toLowerCase().equals(finalVal2.toLowerCase())).collect(Collectors.toList());
                            if (listNkp != null && listNkp.size() > 0) {
                                kh.setNguonKinhPhi(listNkp.get(0).getMA_NGUON_KINH_PHI());
                            }
                        }
                        cellNum++;
                        val = GetValueSheet(row, cellNum);
                        kh.setDuToan(val);
                        cellNum++;
                        val = GetValueSheet(row, cellNum);
                        kh.setDonViChuTri(val);
                        cellNum++;
                        val = GetValueSheet(row, cellNum);
                        kh.setChuNhiemNhiemVu(val);
                        cellNum++;
                        val = GetValueSheet(row, cellNum);
                        kh.setNoiDungHoatDong(val);
                        cellNum++;
                        val = GetValueSheet(row, cellNum);
                        kh.setThoiGianDuKien(val);
                        listKetHoach.add(kh);
                    }


                    rowNum++;
                }


                //Iterate through each rows one by one
//                Iterator<Row> iterator = sheet.iterator();
//                while (iterator.hasNext()) {
//                    Row nextRow = iterator.next();
//                    Iterator<Cell> cellIterator = nextRow.cellIterator();
//
//                    while (cellIterator.hasNext()) {
//                        Cell cell = cellIterator.next();
//
//                        //   switch (cell.getCellType()) {
//
////                            case Cell.CELL_TYPE_STRING:
////                                System.out.print(cell.getStringCellValue());
////                                break;
////                            case Cell.CELL_TYPE_BOOLEAN:
////                                System.out.print(cell.getBooleanCellValue());
////                                break;
////                            case Cell.CELL_TYPE_NUMERIC:
////                                System.out.print(cell.getNumericCellValue());
////                                break;
//                        //  }
//                        System.out.print(" - ");
//                    }
//                    System.out.println();
//                }

                workbook.close();
                is.close();
                return new ExecServiceResponse(listKetHoach, 1, "Thành công.");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return new ExecServiceResponse(-1, "Lỗi convert file");
    }

    public String GetValueSheet(Row row, int cellNum) throws Exception {
        String result = GetRow(row, cellNum);
        result = result != null ? result : "";
        return result;
    }

    public String GetRow(Row row, int cellNum) throws Exception {
        try {
            Cell cell = row.getCell(cellNum);
            CellType cellType = cell.getCellType();
            return cell.getStringCellValue();
//            if (cell != null && cell.getCellType() != null) {
//                switch (cell.getCellType()) {
//                    case 1:
//                        return cell.getStringCellValue();
//                    case 0:
//                        if (DateUtil.isCellDateFormatted(cell)) {
//                            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
//                            return dateFormat.format(cell.getDateCellValue()) + "";
//                        } else {
//                            return cell.getNumericCellValue() + "";
//                        }
//                    case 4:
//                        return cell.getBooleanCellValue() + "";
//                    default:
//                        return "";
//                }
//            }
        } catch (Exception ex) {
        }
        try {
            if (row.getCell(cellNum) != null && row.getCell(cellNum).getStringCellValue() != null) {
                if (row.getCell(cellNum).getStringCellValue() == "#N/A") {
                    return null;
                }
                return row.getCell(cellNum).getStringCellValue();
            }
        } catch (Exception ex) {
        }
        try {
            if (row.getCell(cellNum) != null && row.getCell(cellNum).getNumericCellValue() >= 0) {
                return row.getCell(cellNum).getNumericCellValue() + "";
            }
        } catch (Exception ex) {

        }
        return null;
    }

    public ExecServiceResponse exportThongKe(List<ThongKeResp> listObj, String tieude, String loaiTimKiem, String loaiThongKe) {
        String fileBase64 = "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";
        String orgId = SecurityUtils.getPrincipal().getORGID();

        try {
            byte[] result = Base64.getDecoder().decode(fileBase64);

            InputStream is = new ByteArrayInputStream(result);

            Workbook workbook = new XSSFWorkbook(is);

            //Get first/desired sheet from the workbook
            Sheet sheet = workbook.getSheetAt(0);
            CellStyle cellStyle = createStyleTitle(sheet, 1);
            CellStyle cellStyleCenter = createStyleTitle(sheet, 1);
            Row row = sheet.createRow(0);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 10));
            Cell cell = row.createCell(0);
            cell.setCellStyle(cellStyleCenter);
            cell.setCellValue(tieude);
            //tao header
            List<String> listHeader = new ArrayList<>();
            if (loaiTimKiem != null && loaiTimKiem.equals("DETAI")) {
                if (loaiThongKe.equals("KHOAHOC")) {
                    listHeader.add("STT");
                    listHeader.add("Tên Đề tài /nhiệm vụ");
                    listHeader.add("Chủ nhiệm/ đồng chủ nhiệm");
                    listHeader.add("Cấp quản lý");
                    listHeader.add("Đơn vị chủ trì");
                    listHeader.add("Kinh phí");
                    listHeader.add("Nguồn kinh phí");
                    listHeader.add("Tổng kinh phí quyết toán");
                    listHeader.add("Thời gian thực hiện");
                } else if (loaiThongKe.equals("CAPDETAI")) {
                    listHeader.add("STT");
                    listHeader.add("Tên Đề tài /nhiệm vụ");
                    listHeader.add("Chủ nhiệm/ đồng chủ nhiệm");
                    listHeader.add("Cấp quản lý");
                    listHeader.add("Đơn vị chủ trì");
                    listHeader.add("Kinh phí");
                    listHeader.add("Nguồn kinh phí");
                    listHeader.add("Tổng kinh phí quyết toán");
                    listHeader.add("Thời gian thực hiện");
                } else if (loaiThongKe.equals("CAPDONVI")) {
                    listHeader.add("STT");
                    listHeader.add("Tên Đề tài /nhiệm vụ");
                    listHeader.add("Chủ nhiệm/ đồng chủ nhiệm");
                    listHeader.add("Cấp quản lý");
                    listHeader.add("Đơn vị chủ trì");
                    listHeader.add("Kinh phí");
                    listHeader.add("Nguồn kinh phí");
                    listHeader.add("Tổng kinh phí quyết toán");
                    listHeader.add("Thời gian thực hiện");
                }

            } else if (loaiTimKiem != null && loaiTimKiem.equals("SANGKIEN")) {
                listHeader.add("STT");
                listHeader.add("Tên giải pháp");
                listHeader.add("Tác giả/ đồng tác giả");
                listHeader.add("Cấp sáng kiến");
                listHeader.add("Lĩnh vực áp dụng");
                listHeader.add("Đơn vị đăng ký/áp dụng");
                listHeader.add("Số tiền làm lợi năm đầu tiên áp dụng");
                listHeader.add("Thù lao cho tác giả");
                listHeader.add("Thù lao cho người áp dụng lần đầu");
                listHeader.add("Tổng cộng");
            }
            writeExportHeaderExcelThongKe(sheet, 3, listHeader, 1);
            //tao danh sach
            //List<DanhSachMau> listCha = listDanhSachMau.stream().filter(c -> c.getMA_NHOM_CHA()==null).collect(Collectors.toList());
            if (listObj != null && listObj.size() > 0) {
                int rowIndex = 5;
                int cellIndex = 0;
                int i = 1;
                for (ThongKeResp item : listObj) {
                    rowIndex++;
                    cellIndex = 0;
                    String stt = i + "";
                    Row rows = sheet.createRow(rowIndex);
                    writeExportData(sheet, rows, cellIndex, stt, 1);
                    cellIndex++;
                    writeExportData(sheet, rows, cellIndex, item.getTenLinhVuc(), 0);
                    int j = 1;
                    for (ListData item2 : item.getListData()) {
                        rowIndex++;
                        cellIndex = 0;
                        stt = "" + j;
                        rows = sheet.createRow(rowIndex);
                        writeExportData(sheet, rows, cellIndex, stt, 1);
                        cellIndex++;
                        writeExportData(sheet, rows, cellIndex, item2.getTenDeTaiSK(), 0);
                        cellIndex++;
                        writeExportData(sheet, rows, cellIndex, item2.getTenChuNhiemTG(), 0);
                        cellIndex++;
                        writeExportData(sheet, rows, cellIndex, item2.getCapQuanLy(), 0);
                        cellIndex++;
                        writeExportData(sheet, rows, cellIndex, item2.getLinhVucKhoaHoc(), 0);
                        if (loaiTimKiem != null && loaiTimKiem.equals("DETAI")) {
                            cellIndex++;
                            writeExportData(sheet, rows, cellIndex, item2.getKinhPhi(), 0);
                            cellIndex++;
                            writeExportData(sheet, rows, cellIndex, item2.getNguonKinhPhi(), 0);
                            cellIndex++;
                            writeExportData(sheet, rows, cellIndex, item2.getTongKinhPhi(), 0);
                            cellIndex++;
                            writeExportData(sheet, rows, cellIndex, item2.getThoiGianThucHien(), 0);

                        } else if (loaiTimKiem != null && loaiTimKiem.equals("SANGKIEN")) {
                            cellIndex++;
                            writeExportData(sheet, rows, cellIndex, item2.getDonViDangKy(), 0);
                            cellIndex++;
                            writeExportData(sheet, rows, cellIndex, item2.getSoTienLamLoi(), 0);
                            cellIndex++;
                            writeExportData(sheet, rows, cellIndex, item2.getThuLaoTacGia(), 0);
                            cellIndex++;
                            writeExportData(sheet, rows, cellIndex, item2.getThuLaoNguoiApDung(), 0);
                            cellIndex++;
                            writeExportData(sheet, rows, cellIndex, item2.getTongCong(), 0);
                        }
                        j++;
                    }
                    i++;
                }
            }

            byte[] resultFile = createOutputFile(workbook);
            String encoded = Base64.getEncoder().encodeToString(resultFile);

            workbook.close();
            is.close();
            return new ExecServiceResponse(encoded, 1, "Thành công.");

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ExecServiceResponse(-1, "Lỗi convert file");
    }
}
