package org.kaznalnrprograms.MCA.INews.Models;

public class NewsFilterModel {
    private boolean chkDateBeg;
    private String dateBeg;
    private boolean chkDateEnd;
    private String dateEnd;
    private boolean showDel;

    private int page;
    private int rows;

    public boolean isChkDateBeg() {
        return chkDateBeg;
    }

    public void setChkDateBeg(boolean chkDateBeg) {
        this.chkDateBeg = chkDateBeg;
    }

    public String getDateBeg() {
        return dateBeg;
    }

    public void setDateBeg(String dateBeg) {
        this.dateBeg = dateBeg;
    }

    public boolean isChkDateEnd() {
        return chkDateEnd;
    }

    public void setChkDateEnd(boolean chkDateEnd) {
        this.chkDateEnd = chkDateEnd;
    }

    public String getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(String dateEnd) {
        this.dateEnd = dateEnd;
    }

    public boolean isShowDel() {
        return showDel;
    }

    public void setShowDel(boolean showDel) {
        this.showDel = showDel;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }
}
