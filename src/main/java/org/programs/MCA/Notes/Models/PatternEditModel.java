package org.kaznalnrprograms.MCA.Notes.Models;

import java.util.List;

public class PatternEditModel {
    private String id;
    private String name;
    private int allFlag;
    private PeriodTimeModel periodTime;
    private int del;
    private String created;
    private String creator;
    private String changed;
    private String changer;
    private List<ListItemEditModel> grps;
    private List<ListItemEditModel> abons;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAllFlag() {
        return allFlag;
    }

    public void setAllFlag(int allFlag) {
        this.allFlag = allFlag;
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

    public List<ListItemEditModel> getGrps() {
        return grps;
    }

    public void setGrps(List<ListItemEditModel> grps) {
        this.grps = grps;
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
