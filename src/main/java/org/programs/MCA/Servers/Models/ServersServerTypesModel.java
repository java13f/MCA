package org.kaznalnrprograms.MCA.Servers.Models;

public class ServersServerTypesModel {
    private String id;
    private String code;
    private String name;
    private String display;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplay() {
        return (code + " = " + name);
    }

    public void setDisplay(String display) {
        this.display = display;
    }
}
