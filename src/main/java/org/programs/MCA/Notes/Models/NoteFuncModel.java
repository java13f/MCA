package org.kaznalnrprograms.MCA.Notes.Models;

import java.util.Map;

public class NoteFuncModel {
    private String srvAddress;
    private String sttsFlag;
    private String errorMsg;
    private String successMsg;

    public String getSrvAddress() {
        return srvAddress;
    }

    public void setSrvAddress(String srvAddress) {
        this.srvAddress = srvAddress;
    }

    public String getSttsFlag() {
        return sttsFlag;
    }

    public void setSttsFlag(String sttsFlag) {
        this.sttsFlag = sttsFlag;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }

    public String getSuccessMsg() {
        return successMsg;
    }

    public void setSuccessMsg(String successMsg) {
        this.successMsg = successMsg;
    }

    public String getActionUrl(Map<String, Object> params) {
        String actStart = "/NotifyServer/MainApp/notes";
        String actStop = "/NotifyServer/MainApp/terminalStopNote";
        String getparams = "";
        if(!params.isEmpty()) {
            getparams = "?";
            for (String key: params.keySet()) {
                getparams += key + "=" + params.get(key) + "&";
            }
            getparams = getparams.substring(0, getparams.length() - 1);
        }
        return srvAddress + (sttsFlag.equals("001") ? actStop : actStart) + getparams;
    }
}
