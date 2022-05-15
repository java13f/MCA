package org.kaznalnrprograms.MCA.Notes.Models;

public class NotesViewModel {
    private String id;
    private String date;
    private String name;
    private String dlgAll;
    private String sttsName;
    private String sttsCode;
    private int del;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getDlgAll() {
        return dlgAll;
    }

    public void setDlgAll(String dlgAll) {
        this.dlgAll = dlgAll;
    }

    public String getSttsName() {
        return sttsName;
    }

    public void setSttsName(String sttsName) {
        this.sttsName = sttsName;
    }

    public String getSttsCode() {
        return sttsCode;
    }

    public void setSttsCode(String sttsCode) {
        this.sttsCode = sttsCode;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }
}
