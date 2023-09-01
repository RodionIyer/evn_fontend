package com.evnit.ttpm.khcn.services.storage;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;

@Service
@Configurable
public class FileService {

    @Value("${khcn.app.pathLocalStorage}")
    private String path;
    @Value("${app.utils.url}")
    private String urlFileService;// ="https://imistest.evn.com.vn/rpc/utils";
    @Value("${app.convert.service}")
    private String urlConvert;

    public ResponseDataConvert callConvertPdf(Object dataPdfBase64, String bearerToken) {
        ResponseDataConvert rsData = null;
        try {

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", bearerToken);
            headers.set("Authorization-type", "Header");
            // headers.set("Org-code", "EVN");
            RestTemplate restTemplate = new RestTemplate();
            HttpEntity<Object> requestEntity = new HttpEntity<>(dataPdfBase64, headers);
            ResponseEntity<ResponseDataConvert> result = restTemplate.postForEntity(urlConvert + "/v1/convert/word.savepdf",
                    requestEntity, ResponseDataConvert.class);
            rsData = result.getBody();
        } catch (Exception e) {
            //e.printStackTrace();
        }
        return rsData;
    }

    public Object callPostFile(final String fileName, String pathMogodb, byte[] fileByte, String bearerToken)
            throws IOException {
        // HttpHeaders
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("Authorization", bearerToken);
        // HttpEntity<String>: To get result as String.
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource contentsAsResource = new ByteArrayResource(fileByte) {
            @Override
            public String getFilename() {
                return fileName; // Filename has to be returned in order to be able to post.
            }
        };
        body.add("file", contentsAsResource);
        body.add("path", pathMogodb);
        // RestTemplate
        RestTemplate restTemplate = new RestTemplate();
        // Dữ liệu đính kèm theo yêu cầu.
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        // Gửi yêu cầu với phương thức POST.
        ResponseEntity<Object> result = restTemplate.postForEntity(urlFileService + "/file/upload", requestEntity,
                Object.class);
        return result.getBody();
    }

    public Object callPostFileSSL(final String fileName, String pathMogodb, byte[] fileByte, String bearerToken)
            throws IOException {
        // HttpHeaders
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("Authorization", bearerToken);
        // HttpEntity<String>: To get result as String.
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource contentsAsResource = new ByteArrayResource(fileByte) {
            @Override
            public String getFilename() {
                return fileName; // Filename has to be returned in order to be able to post.
            }
        };
        body.add("file", contentsAsResource);
        body.add("path", pathMogodb);
        // RestTemplate
        RestTemplate restTemplate = new RestTemplate();
        // Dữ liệu đính kèm theo yêu cầu.
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        // Gửi yêu cầu với phương thức POST.
        ResponseEntity<Object> result = restTemplate.postForEntity(urlFileService + "/file/upload",
                requestEntity, Object.class);
        return result.getBody();
    }

    public byte[] callDataUtilsSSL(String pathMongdb, String bearerToken) {
        try {
            // System.out.println(path + pathMongdb);
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
            headers.set("Authorization", bearerToken);
            RestTemplate restTemplate = new RestTemplate();

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<byte[]> response = restTemplate.exchange(pathMongdb, HttpMethod.GET, entity, byte[].class);
            return response.getBody();
        } catch (Exception e) {
            //e.printStackTrace();
            return null;
        }
    }

    public String callDataFile(String pathMongdb, String bearerToken) {
        try {
            int index = pathMongdb.lastIndexOf("/");
            String pathFile = pathMongdb.substring(0, index);
            // System.out.println(path + pathMongdb);
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
            headers.set("Authorization", bearerToken);
            RestTemplate restTemplate = new RestTemplate();

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<byte[]> response = restTemplate.exchange(urlFileService + "/file/download" + pathMongdb,
                    HttpMethod.GET, entity, byte[].class);

            File dirFile = new File(path + pathFile);
            if (!dirFile.exists()) {
                dirFile.mkdirs();
            }
            String dirPathFile = path + pathMongdb;
            Path filepath = Paths.get(dirPathFile);
            Files.write(filepath, response.getBody());
            return dirPathFile;
        } catch (Exception e) {
            //e.printStackTrace();
            return null;
        }
    }

    public String downloadFileBase64(String pathMongdb, String bearerToken) {
        try {
            int index = pathMongdb.lastIndexOf("/");
            String pathFile = pathMongdb.substring(0, index);
            // System.out.println(path + pathMongdb);
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
            headers.set("Authorization", bearerToken);
            RestTemplate restTemplate = new RestTemplate();

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<byte[]> response = restTemplate.exchange(urlFileService + "/file/download" + pathMongdb,
                    HttpMethod.GET, entity, byte[].class);
            String encoded = Base64Utils.encodeToString(response.getBody());
            return encoded;
        } catch (Exception e) {
            //e.printStackTrace();
            return null;
        }
    }

    public byte[] callDataUtils(String pathMongdb, String bearerToken) {
        try {
            // System.out.println(path + pathMongdb);
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
            headers.set("Authorization", bearerToken);
            RestTemplate restTemplate = new RestTemplate();

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<byte[]> response = restTemplate.exchange(urlFileService + "/file/download" + pathMongdb,
                    HttpMethod.GET, entity, byte[].class);
            return response.getBody();
        } catch (Exception e) {
            //e.printStackTrace();
            return null;
        }
    }

    public Object callDataFileURL(String url, String bearerToken) {
        try {
            // System.out.println(path + pathMongdb);
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
            headers.set("Authorization", bearerToken);
            headers.set("Authorization-type", "Header");
            headers.set("Org-code", "EVN");
            RestTemplate restTemplate = new RestTemplate();

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, entity, Object.class);
            return response.getBody();
        } catch (Exception e) {
            //e.printStackTrace();
            return null;
        }
    }

    public byte[] callDataFileURL2(String urlFileService, String bearerToken) {
        try {
            // System.out.println(path + pathMongdb);
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));
            headers.set("Authorization", bearerToken);
            headers.set("Authorization-type", "Header");
            headers.set("Org-code", "HUB");
            RestTemplate restTemplate = new RestTemplate();

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<byte[]> response = restTemplate.exchange(urlFileService, HttpMethod.GET, entity,
                    byte[].class);
            return response.getBody();
        } catch (Exception e) {
            //e.printStackTrace();
            return null;
        }

    }

    public LocalDate convertToLocalDateViaInstant(Date dateToConvert) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(dateToConvert);
        Date date = calendar.getTime();
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

}
