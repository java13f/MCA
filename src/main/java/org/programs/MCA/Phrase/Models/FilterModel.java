package org.kaznalnrprograms.MCA.Phrase.Models;

public class FilterModel {
    private String code;
    private String text;
    private String filename;
    private boolean showdel;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public boolean isShowdel() {
        return showdel;
    }

    public void setShowdel(boolean showdel) {
        this.showdel = showdel;
    }
}
