package org.kaznalnrprograms.MCA.Admin.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

public class AppViewModel {
    private String id;
    private String name;
    private String code;
    private String type;
    private String del;
    @JsonIgnore
    private String parent_id;
    private List<AppViewModel> children;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDel() {
        return del;
    }

    public void setDel(String del) {
        this.del = del;
    }

    public String getParent_id() {
        return parent_id;
    }

    public void setParent_id(String parent_id) {
        this.parent_id = parent_id;
    }

    public List<AppViewModel> getChildren() {
        return children;
    }

    public void setChildren(List<AppViewModel> children) {
        this.children = children;
    }
}
