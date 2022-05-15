package org.kaznalnrprograms.MCA.MainApp.Models;

import java.util.List;

public class MenuCategoryModel {
    private String text;
    private String iconCls;
    private String state;

    private List<MenuItemModel> children;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public List<MenuItemModel> getChildren() {
        return children;
    }

    public void setChildren(List<MenuItemModel> children) {
        this.children = children;
    }
}
