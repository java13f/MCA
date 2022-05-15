package org.kaznalnrprograms.MCA.Notes.Models;

public class PatternViewModel {
    private String id;
    private String name;
    private int allFlag;
    private int del;

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
}
