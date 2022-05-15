package org.kaznalnrprograms.MCA.Abons.Models.Csv;

/**
 * Класс описывает контакт абонента
 */


public class Pin {
    private String snils;
    private String switch_type_code;
    private String code;
    private String no;
    private String is_has_dtmf;
    private String info;
    private Boolean isNew;

    public Pin(){}

    public Pin(String _snils, String _switch_type_code, String _code, String _no, String _is_has_dtmf, String _info){
        setSnils(_snils.trim());
        setSwitch_type_code(_switch_type_code.trim());
        setCode(_code.trim());
        setNo(_no.trim());
        setIs_has_dtmf(_is_has_dtmf.trim());
        setInfo(_info.trim());
    }


    public String getSnils()                                 {        return snils;    }
    public void setSnils(String snils)                       {        this.snils = snils;    }
    public String getSwitch_type_code()                      {        return switch_type_code;    }
    public void setSwitch_type_code(String switch_type_code) {        this.switch_type_code = switch_type_code;    }
    public String getCode()                                  {        return code;    }
    public void setCode(String code)                         {        this.code = code;    }
    public String getNo()                                    {        return no;    }
    public void setNo(String no)                             {        this.no = no;    }
    public String getIs_has_dtmf()                           {        return is_has_dtmf;    }
    public void setIs_has_dtmf(String is_has_dtmf)           {        this.is_has_dtmf = is_has_dtmf;    }
    public String getInfo()                                  {        return info;    }
    public void setInfo(String info)                         {        this.info = info;    }

    public Boolean getIsNew() {
        return isNew;
    }

    public void setIsNew(Boolean isNewPin) {
        isNew = isNewPin;
    }
}
