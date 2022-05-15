package org.kaznalnrprograms.MCA.Abons.Models;

/**
 * Модель контакта
 */
public class ItemEditPinsModel {
    private String id;
    private int no;
    private String code;
    private String codeView;
    private String switchId;
    private String typeCom;
    private int del;
    private  int is_has_dtmf;
    private boolean changing;
    private String itemId;
    private String info;

    private String creator;
    private String created;
    private String changer;
    private String changed;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getNo() {
        return no;
    }

    public void setNo(int no) {
        this.no = no;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCodeView() {
        return codeView;
    }

    public void setCodeView(String codeView) {
        this.codeView = codeView;
    }


    public String getSwitchId() {
        return switchId;
    }

    public void setSwitchId(String switchId) {
        this.switchId = switchId;
    }

    public String getTypeCom() {
        return typeCom;
    }

    public void setTypeCom(String typeCom) {
        this.typeCom = typeCom;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }

    public int getIs_has_dtmf() {
        return is_has_dtmf;
    }

    public void setIs_has_dtmf(int is_has_dtmf) {
        this.is_has_dtmf = is_has_dtmf;
    }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
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

    public boolean isChanging() {
        return changing;
    }

    public void setChanging(boolean changing) {
        this.changing = changing;
    }
}
