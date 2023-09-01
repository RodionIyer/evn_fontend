package com.evnit.ttpm.khcn.services.storage;

import com.evnit.ttpm.khcn.util.Util;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class StorageService {

    @Value("${khcn.app.pathLocalStorage}")
    private String path;
    public static final int EXCEL_HTML = 44;
    public static final int EXCEL_PDF = 57;

    public String saveFile(MultipartFile file, String module, String donviId) {
        String fileName = file.getOriginalFilename();
        // String path_id = "/smartevn/" + module + "/" + donviId + "/" + strDate;
        String path_id = Util.folderDvName(module, donviId, null);

        String nPath = path + path_id;
        File dirFile = new File(nPath);
        if (!dirFile.exists()) {
            dirFile.mkdirs();
        }
        if (file.isEmpty()) {
            throw new StorageException("Failed to store empty file");
        }
        try {
            // Get the file and save it somewhere
            byte[] bytes = file.getBytes();
            Path filepath = Paths.get(nPath + "/" + fileName);
            Files.write(filepath, bytes);
        } catch (IOException e) {
            String msg = String.format("Failed to store file %f", file.getName());
            throw new StorageException(msg, e);
        }
        return path_id + "/" + fileName;
    }

    public String saveFile(String fileName, byte[] bytes, String donviId) {
        String uriFile = "";
        // String nPath = path + donviId + "\\" + strDate + "\\";
        String nPath = path + Util.folderDvName("utilities", donviId, null);
        File dirFile = new File(nPath);
        if (!dirFile.exists()) {
            dirFile.mkdirs();
        }
        if (bytes == null) {
            throw new StorageException("Failed to store empty file");
        }
        try {
            Path filepath = Paths.get(nPath + "/" + fileName);
            Files.write(filepath, bytes);
            uriFile = nPath + fileName;
        } catch (IOException e) {
            String msg = String.format("Failed to store file %f", fileName);
            throw new StorageException(msg, e);
        }
        return uriFile;
    }

}
