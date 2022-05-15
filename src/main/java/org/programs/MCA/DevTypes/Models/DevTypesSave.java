package org.kaznalnrprograms.MCA.DevTypes.Models;

public class DevTypesSave
{
    private String id;
    private String code;
    private String name;
    private int prior;
    private int is_auto_define;
    private String changer;
    private String changed;
    private String creator;
    private String created;

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

    public int getIs_auto_define()
    {
        return is_auto_define;
    }

    public void setIs_auto_define(int is_auto_define)
    {
        this.is_auto_define = is_auto_define;
    }

    public String getChanger()
    {
        return changer;
    }

    public void setChanger(String changer)
    {
        this.changer = changer;
    }

    public String getChanged()
    {
        return changed;
    }

    public void setChanged(String changed)
    {
        this.changed = changed;
    }

    public String getCreator()
    {
        return creator;
    }

    public void setCreator(String creator)
    {
        this.creator = creator;
    }

    public String getCreated()
    {
        return created;
    }

    public void setCreated(String created)
    {
        this.created = created;
    }
}
