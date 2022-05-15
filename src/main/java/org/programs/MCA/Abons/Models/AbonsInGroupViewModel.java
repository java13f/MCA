package org.kaznalnrprograms.MCA.Abons.Models;

/**
 * Модель для отображения абонентов в группе в гриде
 */
public class AbonsInGroupViewModel {
    private String id;
    private String fioabon;
    private String namegroup;
    private String creator;
    private String created;
    private String changer;
    private String changed;
    private String del;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFioabon() {
        return fioabon;
    }

    public void setFioabon(String fioabon) {
        this.fioabon = fioabon;
    }

    public String getNamegroup() {
        return namegroup;
    }

    public void setNamegroup(String namegroup) {
        this.namegroup = namegroup;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getChanger() {
        return changer;
    }

    public void setChanger(String changer) {
        this.changer = changer;
    }

    public String getChanged() {
        return changed;
    }

    public void setChanged(String changed) {
        this.changed = changed;
    }

    public String getDel() {
        return del;
    }

    public void setDel(String del) {
        this.del = del;
    }
}
