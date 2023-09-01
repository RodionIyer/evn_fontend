package com.evnit.ttpm.khcn.models.kehoach;

import java.util.ArrayList;
import java.util.Date;

public class FileUpload {
        public int id;
        public String key;
        public String name;
        public Object content;
        public String mimeType;
        public int size;
        public Boolean isFile;
        public String path;
        public int level;
        public Object gridId;
        public String rowId;
        public Date createdAt;
        public Object baseLanguage;
        public Boolean isValidated;
        public Object informations;
        public Object warnings;
        public Object errors;
        public ArrayList<Object> generalWarnings;
        public ArrayList<Object> generalErrors;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public Boolean getFile() {
        return isFile;
    }

    public void setFile(Boolean file) {
        isFile = file;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public Object getGridId() {
        return gridId;
    }

    public void setGridId(Object gridId) {
        this.gridId = gridId;
    }

    public String getRowId() {
        return rowId;
    }

    public void setRowId(String rowId) {
        this.rowId = rowId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Object getBaseLanguage() {
        return baseLanguage;
    }

    public void setBaseLanguage(Object baseLanguage) {
        this.baseLanguage = baseLanguage;
    }

    public Boolean getValidated() {
        return isValidated;
    }

    public void setValidated(Boolean validated) {
        isValidated = validated;
    }

    public Object getInformations() {
        return informations;
    }

    public void setInformations(Object informations) {
        this.informations = informations;
    }

    public Object getWarnings() {
        return warnings;
    }

    public void setWarnings(Object warnings) {
        this.warnings = warnings;
    }

    public Object getErrors() {
        return errors;
    }

    public void setErrors(Object errors) {
        this.errors = errors;
    }

    public ArrayList<Object> getGeneralWarnings() {
        return generalWarnings;
    }

    public void setGeneralWarnings(ArrayList<Object> generalWarnings) {
        this.generalWarnings = generalWarnings;
    }

    public ArrayList<Object> getGeneralErrors() {
        return generalErrors;
    }

    public void setGeneralErrors(ArrayList<Object> generalErrors) {
        this.generalErrors = generalErrors;
    }
}
