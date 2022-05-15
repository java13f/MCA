package org.kaznalnrprograms.MCA.Abons.Models;

import java.util.List;

/**
 * Модель для формы редактирование абонента
 */
public class AbonEditModel {
    private String id;
    private String snils;
    private String fam;
    private String ima;
    private String otch;
    private String prior;
    private String created;
    private String creator;
    private String changed;
    private String changer;
    private List<ItemEditPinsModel> pins;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSnils() {
        return snils;
    }

    public void setSnils(String snils) {
        this.snils = snils;
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

    public String getPrior() {
        return prior;
    }

    public void setPrior(String prior) {
        this.prior = prior;
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

    public List<ItemEditPinsModel> getPins() {
        return pins;
    }

    public void setPins(List<ItemEditPinsModel> pins) {
        this.pins = pins;
    }
}
