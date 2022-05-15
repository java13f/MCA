package org.kaznalnrprograms.MCA.Jasper.Models;

public class RepParams {
    private String jrxml;
    private String reportType;
    private RepBean[] params;

    public String getJrxml() {
        return jrxml;
    }

    public void setJrxml(String jrxml) {
        this.jrxml = jrxml;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public RepBean[] getParams() {
        return params;
    }

    public void setParams(RepBean[] params) {
        this.params = params;
    }
}

