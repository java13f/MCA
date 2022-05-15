package org.kaznalnrprograms.MCA.Notes.Models;

public class PinModel {
    private String id;
    private String abonId;
    private String abonName;
    private String noteAbonId;
    private String switchName;
    private String codeView;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAbonName() {
        return abonName;
    }

    public String getAbonId() {
        return abonId;
    }

    public String getNoteAbonId() {
        return noteAbonId;
    }

    public void setNoteAbonId(String noteAbonId) {
        this.noteAbonId = noteAbonId;
    }

    public void setAbonId(String abonId) {
        this.abonId = abonId;
    }

    public void setAbonName(String abonName) {
        this.abonName = abonName;
    }

    public String getSwitchName() {
        return switchName;
    }

    public void setSwitchName(String switchName) {
        this.switchName = switchName;
    }

    public String getCodeView() {
        return codeView;
    }

    public void setCodeView(String codeView) {
        this.codeView = codeView;
    }
}
