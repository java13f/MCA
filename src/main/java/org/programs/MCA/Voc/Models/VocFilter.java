package org.kaznalnrprograms.MCA.Voc.Models;

public class VocFilter {
    private String vocItemId;
    private String text;
    private int delShow;

    public String getVocItemId() {
        return vocItemId;
    }

    public void setVocItemId(String vocItemId) {
        this.vocItemId = vocItemId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getDelShow() {
        return delShow;
    }

    public void setDelShow(int delShow) {
        this.delShow = delShow;
    }
}
