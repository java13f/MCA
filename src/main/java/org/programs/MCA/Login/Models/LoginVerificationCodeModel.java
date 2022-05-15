package org.kaznalnrprograms.MCA.Login.Models;

public class LoginVerificationCodeModel {
    private String verificationCode;
    private String certificate;

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public String getCertificate() {
        return certificate;
    }

    public void setCertificate(String certificate) {
        this.certificate = certificate;
    }
}
