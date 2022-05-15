package org.kaznalnrprograms.MCA.Dialogs.Models;

public class PhraseModel
{
    public String id;
    public String code;
    public String name;
    public String file_name;
    public String org_file_name;
    public Integer is_syntesed;
    public Integer del;

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

    public String getFile_name()
    {
        return file_name;
    }

    public void setFile_name(String file_name)
    {
        this.file_name = file_name;
    }

    public String getOrg_file_name()
    {
        return org_file_name;
    }

    public void setOrg_file_name(String org_file_name)
    {
        this.org_file_name = org_file_name;
    }

    public Integer getIs_syntesed()
    {
        return is_syntesed;
    }

    public void setIs_syntesed(Integer is_syntesed)
    {
        this.is_syntesed = is_syntesed;
    }

    public Integer getDel()
    {
        return del;
    }

    public void setDel(Integer del)
    {
        this.del = del;
    }
}
