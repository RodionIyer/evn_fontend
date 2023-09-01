package com.evnit.ttpm.khcn.models.system;

import java.util.List;

public class NavigationItem {

    private String id;
    private String title;
    private String subtitle;
    private String type;//| 'aside'| 'basic'| 'collapsable'| 'divider'| 'group'| 'spacer';
    private String link;
    private String icon;
    private Boolean externalLink;
    private String target;//| '_blank'| '_self'| '_parent'| '_top'| string;
    private List<NavigationItem> children;

    public NavigationItem() {
    }

    public NavigationItem(String id, String title, String subtitle, String type, String link, String icon, Boolean externalLink, String target, List<NavigationItem> children) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.type = type;
        this.link = link;
        this.icon = icon;
        this.externalLink = externalLink;
        this.target = target;
        this.children = children;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Boolean getExternalLink() {
        return externalLink;
    }

    public void setExternalLink(Boolean externalLink) {
        this.externalLink = externalLink;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public List<NavigationItem> getChildren() {
        return children;
    }

    public void setChildren(List<NavigationItem> children) {
        this.children = children;
    }



}
