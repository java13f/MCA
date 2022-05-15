package org.kaznalnrprograms.MCA.Login.Models;

public class SignData {
    private String subject;
    private boolean certVerify;
    private String date;
    private boolean totalVerify;
    private String code;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public boolean isCertVerify() {
        return certVerify;
    }

    public void setCertVerify(boolean certVerify) {
        this.certVerify = certVerify;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public boolean isTotalVerify() {
        return totalVerify;
    }

    public void setTotalVerify(boolean totalVerify) {
        this.totalVerify = totalVerify;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
