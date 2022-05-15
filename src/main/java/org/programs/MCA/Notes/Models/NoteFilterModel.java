package org.kaznalnrprograms.MCA.Notes.Models;

public class NoteFilterModel {
    private String name;
    private String abonId;
    private String dlgAllId;
    private String sttsId;
    private int chkStart;
    private int chkEnd;
    private String dateStart;
    private String dateEnd;
    private int showDel;
    private String patternId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAbonId() {
        return abonId;
    }

    public void setAbonId(String abonId) {
        this.abonId = abonId;
    }

    public String getDlgAllId() {
        return dlgAllId;
    }

    public void setDlgAllId(String dlgAllId) {
        this.dlgAllId = dlgAllId;
    }

    public String getSttsId() {
        return sttsId;
    }

    public void setSttsId(String sttsId) {
        this.sttsId = sttsId;
    }

    public int getChkStart() {
        return chkStart;
    }

    public void setChkStart(int chkStart) {
        this.chkStart = chkStart;
    }

    public int getChkEnd() {
        return chkEnd;
    }

    public void setChkEnd(int chkEnd) {
        this.chkEnd = chkEnd;
    }

    public String getDateStart() {
        return dateStart;
    }

    public void setDateStart(String dateStart) {
        this.dateStart = dateStart;
    }

    public String getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(String dateEnd) {
        this.dateEnd = dateEnd;
    }

    public int getShowDel() {
        return showDel;
    }

    public void setShowDel(int showDel) {
        this.showDel = showDel;
    }

    public String getPatternId() {
        return patternId;
    }

    public void setPatternId(String patternId) {
        this.patternId = patternId;
    }
}
