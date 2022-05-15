package org.kaznalnrprograms.MCA.Abons.Models.Csv;

/**
 * Модель для передачи параметров импорта абонентов
 */
public class ParamsImportModel {
    private boolean delPhone;
    private boolean delMobile;
    private boolean delSms;
    private boolean delEmail;
    private boolean delGroups;

    public boolean isDelPhone() {
        return delPhone;
    }

    public void setDelPhone(boolean delPhone) {
        this.delPhone = delPhone;
    }

    public boolean isDelMobile() {
        return delMobile;
    }

    public void setDelMobile(boolean delMobile) {
        this.delMobile = delMobile;
    }

    public boolean isDelSms() {
        return delSms;
    }

    public void setDelSms(boolean delSms) {
        this.delSms = delSms;
    }

    public boolean isDelEmail() {
        return delEmail;
    }

    public void setDelEmail(boolean delEmail) {
        this.delEmail = delEmail;
    }

    public boolean isDelGroups() {
        return delGroups;
    }

    public void setDelGroups(boolean delGroups) {
        this.delGroups = delGroups;
    }
}
