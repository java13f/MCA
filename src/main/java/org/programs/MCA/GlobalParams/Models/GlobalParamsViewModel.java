package org.kaznalnrprograms.MCA.GlobalParams.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.UUID;

public class GlobalParamsViewModel {
    private UUID id;
    private String name;
    private String param_code;
    private String value;
    @JsonIgnore
    private UUID parent_id;
    private List<GlobalParamsViewModel> children;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParam_code() {
        return param_code;
    }

    public void setParam_code(String param_code) {
        this.param_code = param_code;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public UUID getParent_id() {
        return parent_id;
    }

    public void setParent_id(UUID parent_id) {
        this.parent_id = parent_id;
    }

    public List<GlobalParamsViewModel> getChildren() {
        return children;
    }

    public void setChildren(List<GlobalParamsViewModel> children) {
        this.children = children;
    }
}
