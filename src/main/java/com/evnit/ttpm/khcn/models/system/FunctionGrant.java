package com.evnit.ttpm.khcn.models.system;

import java.util.List;

public class FunctionGrant {

    private String functionId;

    private String functionName;

    private String link;

    private Boolean grantInsert;

    private Boolean grantUpdate;

    private Boolean grantDel;

    private List<String> grantExt;

    public FunctionGrant(String functionId, String functionName, String link, Boolean grantInsert, Boolean grantUpdate, Boolean grantDel, List<String> grantExt) {
        this.functionId = functionId;
        this.functionName = functionName;
        this.link = link;
        this.grantInsert = grantInsert;
        this.grantUpdate = grantUpdate;
        this.grantDel = grantDel;
        this.grantExt = grantExt;
    }

    public void setGrantInsert(Boolean grantInsert) {
        this.grantInsert = grantInsert;
    }

    public Boolean getGrantUpdate() {
        return grantUpdate;
    }

    public void setGrantUpdate(Boolean grantUpdate) {
        this.grantUpdate = grantUpdate;
    }

    public Boolean getGrantDel() {
        return grantDel;
    }

    public void setGrantDel(Boolean grantDel) {
        this.grantDel = grantDel;
    }

    public String getFunctionId() {
        return functionId;
    }

    public void setFunctionId(String functionId) {
        this.functionId = functionId;
    }

    public String getFunctionName() {
        return functionName;
    }

    public void setFunctionName(String functionName) {
        this.functionName = functionName;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public List<String> getGrantExt() {
        return grantExt;
    }

    public void setGrantExt(List<String> grantExt) {
        this.grantExt = grantExt;
    }

}
