package org.kaznalnrprograms.MCA.Abons.Models.Service;

/**
 * Модель для отображения контактов абонента в combobox формы Сервис -> Добавление абонента для изменения dtmf
 */
public class PinsAbonModel {
    private String id;
    private String code_view;
    private Integer is_has_dtmf;
    private String codeforcmb;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode_view() {
        return code_view;
    }

    public void setCode_view(String code_view) {
        this.code_view = code_view;
    }

    public Integer getIs_has_dtmf() {
        return is_has_dtmf;
    }

    public void setIs_has_dtmf(Integer is_has_dtmf) {
        this.is_has_dtmf = is_has_dtmf;
    }

    public String getCodeforcmb() {
        return codeforcmb;
    }

    public void setCodeforcmb(String codeforcmb) {
        this.codeforcmb = codeforcmb;
    }
}
