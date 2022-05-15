package org.kaznalnrprograms.MCA.Servers.Models;

public class ServersModel {
    private String id;
    private String code;
    private String name;
    private Integer port;
    private String srv_type_id;
    private Integer is_ssl;
    private int line_all;
    private int line_cur;
    private String call_name;
    private String call_phone;
    private String call_pwd;
    private String proxy_adr;
    private String proxy_port;
    private String proxy_pwd;
    private int del;

    private String created;
    private String creator;
    private String changed;
    private String changer;

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

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getSrv_type_id() {
        return srv_type_id;
    }

    public void setSrv_type_id(String srv_type_id) {
        this.srv_type_id = srv_type_id;
    }

    public Integer getIs_ssl() {
        return is_ssl;
    }

    public void setIs_ssl(Integer is_ssl) {
        this.is_ssl = is_ssl;
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

    public String getCall_name() {
        return call_name;
    }

    public void setCall_name(String call_name) {
        this.call_name = call_name;
    }

    public String getCall_phone() {
        return call_phone;
    }

    public void setCall_phone(String call_phone) {
        this.call_phone = call_phone;
    }

    public String getCall_pwd() {
        return call_pwd;
    }

    public void setCall_pwd(String call_pwd) {
        this.call_pwd = call_pwd;
    }

    public String getProxy_adr() {
        return proxy_adr;
    }

    public void setProxy_adr(String proxy_adr) {
        this.proxy_adr = proxy_adr;
    }

    public String getProxy_port() {
        return proxy_port;
    }

    public void setProxy_port(String proxy_port) {
        this.proxy_port = proxy_port;
    }

    public String getProxy_pwd() {
        return proxy_pwd;
    }

    public void setProxy_pwd(String proxy_pwd) {
        this.proxy_pwd = proxy_pwd;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getChanged() {
        return changed;
    }

    public void setChanged(String changed) {
        this.changed = changed;
    }

    public String getChanger() {
        return changer;
    }

    public void setChanger(String changer) {
        this.changer = changer;
    }
}
