package org.kaznalnrprograms.MCA.Servers.Models;

import java.util.UUID;

public class ServersViewModel {
    private UUID id;
    private String serverType;
    private String code;
    private Integer port;
    private String is_ssl;
    private String name;
    private String call_name;
    private String call_phone;
    private int line_all;
    private int line_cur;
    private int del;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getServerType() {
        return serverType;
    }

    public void setServerType(String serverType) {
        this.serverType = serverType;
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

    public String getCall_name() {
        return call_name;
    }

    public void setCall_name(String call_name) {
        this.call_name = call_name;
    }

    public int getLine_all() {
        return line_all;
    }

    public void setLine_all(int line_all) {
        this.line_all = line_all;
    }

    public int getLine_cur() {
        return line_cur;
    }

    public void setLine_cur(int line_cur) {
        this.line_cur = line_cur;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getIs_ssl() {
        return is_ssl;
    }

    public void setIs_ssl(String is_ssl) {
        this.is_ssl = is_ssl;
    }

    public String getCall_phone() {
        return call_phone;
    }

    public void setCall_phone(String call_phone) {
        this.call_phone = call_phone;
    }
}
