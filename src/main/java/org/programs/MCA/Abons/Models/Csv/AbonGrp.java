package org.kaznalnrprograms.MCA.Abons.Models.Csv;


/**
 * Класс описывает абонента в группе
 */
public class AbonGrp {
    private String snils;
    private String codeGrp;

    public AbonGrp(){
    }

    public AbonGrp(String _snils, String _codeGrp){
      setSnils(_snils);
      setcodeGrp(_codeGrp);
    }
    
    public String getSnils()                 {        return snils;    }
    public void setSnils(String snils)       {        this.snils = snils;    }
    public String getcodeGrp()              {        return codeGrp;    }
    public void setcodeGrp(String codeGrp) {        this.codeGrp = codeGrp;    }
}
