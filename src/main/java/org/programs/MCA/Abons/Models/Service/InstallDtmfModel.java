package org.kaznalnrprograms.MCA.Abons.Models.Service;


import java.util.List;

public class InstallDtmfModel {
    private List<AbonsDtmfModel> abons;
    private boolean is_has_dtmf;

    public List<AbonsDtmfModel> getAbons() {
        return abons;
    }

    public void setAbons(List<AbonsDtmfModel> abons) {
        this.abons = abons;
    }

    public boolean isIs_has_dtmf() {
        return is_has_dtmf;
    }

    public void setIs_has_dtmf(boolean is_has_dtmf) {
        this.is_has_dtmf = is_has_dtmf;
    }
}
