package org.kaznalnrprograms.MCA.Dialogs.Models;

public class UserModel
{
    private String id;
    private String login;
    private String code;
    private String name;
    private int del;
    private int isenabled;

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getLogin()
    {
        return login;
    }

    public void setLogin(String login)
    {
        this.login = login;
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

    public int getDel()
    {
        return del;
    }

    public void setDel(int del)
    {
        this.del = del;
    }

    public int getIsenabled()
    {
        return isenabled;
    }

    public void setIsenabled(int isenabled)
    {
        this.isenabled = isenabled;
    }
}
