package org.kaznalnrprograms.MCA.Notes.Models;

import java.util.List;

public class NoteEditModel {
    private String id;
    private String patternId;
    private String date;
    private String name;
    private PeriodTimeModel periodTime;
    private DialogAllModel dialogAll;
    private String stts;
    private String created;
    private String creator;
    private String changed;
    private String changer;
    private List<ListItemEditModel> abons;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPatternId() {
        return patternId;
    }

    public void setPatternId(String patternId) {
        this.patternId = patternId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DialogAllModel getDialogAll() {
        return dialogAll;
    }

    public void setDialogAll(DialogAllModel dialogAll) {
        this.dialogAll = dialogAll;
    }

    public String getStts() {
        return stts;
    }

    public void setStts(String stts) {
        this.stts = stts;
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

    public List<ListItemEditModel> getAbons() {
        return abons;
    }

    public void setAbons(List<ListItemEditModel> abons) {
        this.abons = abons;
    }

    public PeriodTimeModel getPeriodTime() {
        return periodTime;
    }

    public void setPeriodTime(PeriodTimeModel periodTime) {
        this.periodTime = periodTime;
    }
}
