package com.evnit.ttpm.khcn.models.admin;

import java.util.Date;

public class Q_Lst_Api {

    private Integer apiId;
    private String endpoint;
    private String endpointClass;
    private Boolean enable;
    private Boolean isFix;
    private Date timeStamp;
    private String userCrId;
    private Date userCrDate;
    private String userMdfId;
    private Date userMdfDate;

    public Q_Lst_Api() {
    }

    public Q_Lst_Api(Integer apiId, String endpoint, String endpointClass, Boolean enable, Boolean isFix, Date timeStamp, String userCrId, Date userCrDate, String userMdfId, Date userMdfDate) {
        this.apiId = apiId;
        this.endpoint = endpoint;
        this.endpointClass = endpointClass;
        this.enable = enable;
        this.isFix = isFix;
        this.timeStamp = timeStamp;
        this.userCrId = userCrId;
        this.userCrDate = userCrDate;
        this.userMdfId = userMdfId;
        this.userMdfDate = userMdfDate;
    }

    public Integer getApiId() {
        return apiId;
    }

    public void setApiId(Integer apiId) {
        this.apiId = apiId;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getEndpointClass() {
        return endpointClass;
    }

    public void setEndpointClass(String endpointClass) {
        this.endpointClass = endpointClass;
    }

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }

    public Boolean getIsFix() {
        return isFix;
    }

    public void setIsFix(Boolean isFix) {
        this.isFix = isFix;
    }

    public Date getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Date timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getUserCrId() {
        return userCrId;
    }

    public void setUserCrId(String userCrId) {
        this.userCrId = userCrId;
    }

    public Date getUserCrDate() {
        return userCrDate;
    }

    public void setUserCrDate(Date userCrDate) {
        this.userCrDate = userCrDate;
    }

    public String getUserMdfId() {
        return userMdfId;
    }

    public void setUserMdfId(String userMdfId) {
        this.userMdfId = userMdfId;
    }

    public Date getUserMdfDate() {
        return userMdfDate;
    }

    public void setUserMdfDate(Date userMdfDate) {
        this.userMdfDate = userMdfDate;
    }

}
