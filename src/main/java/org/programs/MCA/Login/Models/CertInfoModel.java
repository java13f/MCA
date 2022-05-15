package org.kaznalnrprograms.MCA.Login.Models;

public class CertInfoModel {
    private String issuer;
    private String serialNumber;
    private String certificate;
    private String Thumbprint;

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getCertificate() {
        return certificate;
    }

    public void setCertificate(String certificate) {
        this.certificate = certificate;
    }

    public String getThumbprint() {
        return Thumbprint;
    }

    public void setThumbprint(String thumbprint) {
        Thumbprint = thumbprint;
    }
}
