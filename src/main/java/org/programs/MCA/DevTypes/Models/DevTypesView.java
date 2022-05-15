package org.kaznalnrprograms.MCA.DevTypes.Models;

public class DevTypesView
{
    private String id;
    private String code;
    private String name;
    private int prior;
    private String is_auto_define;
    private int del;

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getCode()
    {
        return code;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public int getPrior()
    {
        return prior;
    }

    public void setPrior(int prior)
    {
        this.prior = prior;
    }

    public int getDel()
    {
        return del;
    }

    public void setDel(int del)
    {
        this.del = del;
    }

    public String getIs_auto_define()
    {
        return is_auto_define;
    }

    public void setIs_auto_define(String is_auto_define)
    {
        this.is_auto_define = is_auto_define;
    }
}
