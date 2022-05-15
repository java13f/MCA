package org.kaznalnrprograms.MCA.GlobalParams.Models;

import java.util.UUID;

public class GlobalParamsEditModel {
    private UUID id;
    private UUID parent_id;
    private String parentIdName;
    private String name;
    private String param_code;
    private String value;
    private String creator;
    private String created;
    private String changer;
    private String changed;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getParent_id() {
        return parent_id;
    }

    public void setParent_id(UUID parent_id) {
        this.parent_id = parent_id;
    }

    public String getParentIdName() {
        return parentIdName;
    }

    public void setParentIdName(String parentIdName) {
        this.parentIdName = parentIdName;
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

    public String getCreater() {
        return creator;
    }

    public void setCreater(String creator) {
        this.creator = creator;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getChanger() {
        return changer;
    }

    public void setChanger(String changer) {
        this.changer = changer;
    }

    public String getChanged() {
        return changed;
    }

    public void setChanged(String changed) {
        this.changed = changed;
    }
}
