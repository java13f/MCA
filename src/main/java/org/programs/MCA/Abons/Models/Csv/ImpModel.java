package org.kaznalnrprograms.MCA.Abons.Models.Csv;

import java.util.ArrayList;
import java.util.List;

public class ImpModel {
    private List<Abon> abons;
    private List<AbonGrp> abonGrps;
    private List<Pin> pins;

    public ImpModel(){
        abons    = new ArrayList<Abon>();
        abonGrps = new ArrayList<AbonGrp>();
        pins     = new ArrayList<Pin>();
    }

    public List<Abon> getAbons()                    {        return abons;    }
    public void setAbons(List<Abon> abons)          {        this.abons = abons;    }
    public List<AbonGrp> getAbonGrps()              {        return abonGrps;    }
    public void setAbonGrps(List<AbonGrp> abonGrps) {        this.abonGrps = abonGrps;    }
    public List<Pin> getPins()                      {        return pins;    }
    public void setPins(List<Pin> pins)             {        this.pins = pins;    }
}
