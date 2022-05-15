package org.kaznalnrprograms.MCA.Abons.Models.Csv;

/**
 * Класс описывает абонента
 */
public class Abon {
    private String snils;
    private String prior;
    private String fam;
    private String ima;
    private String otch;

    public Abon(String _snils, String _prior, String _fam, String _ima, String _otch){
        setSnils(_snils.trim());
        setPrior(_prior.trim());
        setFam(_fam.trim());
        setIma(_ima.trim());
        setOtch(_otch.trim());
    }

    public String getSnils()           {        return snils;    }
    public void setSnils(String snils) {        this.snils = snils;    }
    public String getPrior()           {        return prior;    }
    public void setPrior(String prior) {        this.prior = prior;    }
    public String getFam()             {        return fam;    }
    public void setFam(String fam)     {        this.fam = fam;    }
    public String getIma()             {        return ima;    }
    public void setIma(String ima)     {        this.ima = ima;    }
    public String getOtch()            {        return otch;    }
    public void setOtch(String otch)   {        this.otch = otch;    }
}
