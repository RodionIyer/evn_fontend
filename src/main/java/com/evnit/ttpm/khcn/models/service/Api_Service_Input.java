package com.evnit.ttpm.khcn.models.service;

public class Api_Service_Input {

    private String name;

    private Object value;

    public Api_Service_Input() {
    }

    public Api_Service_Input(String name, Object value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

}
