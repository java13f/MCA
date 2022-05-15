package org.kaznalnrprograms.MCA.Abons.Models.Csv;

import java.util.List;

/**
 * Модель для списка абонентов полученных из csv класса
 */
public class AbonModel {
    private String snils;
    private String prior;
    private String fam;
    private String ima;
    private String otch;
    private String errorMessage;

    private List<Pin> pins;
    private List<AbonGrp> abonGrps;




    public String getSnils() {
        return snils;
    }

    public void setSnils(String snils) {
        this.snils = snils;
    }

    public String getPrior() {
        return prior;
    }

    public void setPrior(String prior) {
        this.prior = prior;
    }

    public String getFam() {
        return fam;
    }

    public void setFam(String fam) {
        this.fam = fam;
    }

    public String getIma() {
        return ima;
    }

    public void setIma(String ima) {
        this.ima = ima;
    }

    public String getOtch() {
        return otch;
    }

    public void setOtch(String otch) {
        this.otch = otch;
    }


    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public List<Pin> getPins() {
        return pins;
    }

    public void setPins(List<Pin> pins) {
        this.pins = pins;
    }

    public List<AbonGrp> getAbonGrps() {
        return abonGrps;
    }

    public void setAbonGrps(List<AbonGrp> abonGrps) {
        this.abonGrps = abonGrps;
    }
}
