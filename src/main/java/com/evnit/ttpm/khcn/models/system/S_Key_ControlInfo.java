package com.evnit.ttpm.khcn.models.system;

import java.io.Serializable;

public class S_Key_ControlInfo implements Serializable {

    public static int DELTA = 1000;
    private int genStatus;
    private String inputValue;
    private String outputValue;
    private int svalue;
    private String table;
    private String colID;

    public S_Key_ControlInfo() {

    }

    public S_Key_ControlInfo(String inputValue, String table) {
        this.inputValue = inputValue;
        this.table = table;
    }

    public int getSvalue() {
        return svalue;
    }

    public void setSvalue(int svalue) {
        this.svalue = svalue;
    }

    public int getGenStatus() {
        return genStatus;
    }

    public void setGenStatus(int genStatus) {
        this.genStatus = genStatus;
    }

    public String getInputValue() {
        return inputValue;
    }

    public void setInputValue(String inputValue) {
        this.inputValue = inputValue;
    }

    public String getOutputValue() {
        return outputValue;
    }

    public void setOutputValue(String outputValue) {
        this.outputValue = outputValue;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public String getColID() {
        return colID;
    }

    public void setColID(String colID) {
        this.colID = colID;
    }
}
