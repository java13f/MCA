package org.kaznalnrprograms.MCA.Abons.Models.Service;

public class AbonsDtmfModel {
    private String abonid;
    private String abon;
    private String pinid;
    private String phone;
    private Integer is_has_dtmf;

    public String getAbonid() {
        return abonid;
    }

    public void setAbonid(String abonid) {
        this.abonid = abonid;
    }

    public String getAbon() {
        return abon;
    }

    public void setAbon(String abon) {
        this.abon = abon;
    }

    public String getPinid() {
        return pinid;
    }

    public void setPinid(String pinid) {
        this.pinid = pinid;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getIs_has_dtmf() {
        return is_has_dtmf;
    }

    public void setIs_has_dtmf(Integer is_has_dtmf) {
        this.is_has_dtmf = is_has_dtmf;
    }
}
