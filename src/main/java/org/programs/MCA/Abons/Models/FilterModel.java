package org.kaznalnrprograms.MCA.Abons.Models;

public class FilterModel {

    private boolean showDel;

    /**
     * Показывать абонентов в группе (чекбокс)
     */
    private boolean showAbonsInGroup;

    private String groupId;

    /**
     * Показывать группы абонентов (чекбокс)
     */
    private boolean showGroupsAbon;

    private String abonId;


    private String snils;
    private String surname;
    private String name;
    private String oname;
    private String priority;

    private boolean showDelAbon;
    private boolean ShowDelGroup;


    private int page;
    private int rows;





    public boolean isShowDel() {
        return showDel;
    }

    public void setShowDel(boolean showDel) {
        this.showDel = showDel;
    }

    public boolean isShowAbonsInGroup() {
        return showAbonsInGroup;
    }

    public void setShowAbonsInGroup(boolean showAbonsInGroup) {
        this.showAbonsInGroup = showAbonsInGroup;
    }


    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }



    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public boolean isShowGroupsAbon() {
        return showGroupsAbon;
    }

    public void setShowGroupsAbon(boolean showGroupsAbon) {
        this.showGroupsAbon = showGroupsAbon;
    }

    public String getAbonId() {
        return abonId;
    }

    public void setAbonId(String abonId) {
        this.abonId = abonId;
    }


    public String getSnils() {
        return snils;
    }

    public void setSnils(String snils) {
        this.snils = snils;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOname() {
        return oname;
    }

    public void setOname(String oname) {
        this.oname = oname;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public boolean isShowDelAbon() {
        return showDelAbon;
    }

    public void setShowDelAbon(boolean showDelAbon) {
        this.showDelAbon = showDelAbon;
    }

    public boolean isShowDelGroup() {
        return ShowDelGroup;
    }

    public void setShowDelGroup(boolean showDelGroup) {
        ShowDelGroup = showDelGroup;
    }
}
