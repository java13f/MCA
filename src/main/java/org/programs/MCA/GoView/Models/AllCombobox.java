package org.kaznalnrprograms.MCA.GoView.Models;

import java.util.List;

public class AllCombobox {
    // Список для комбоблкса "Шаблоны оповещения"
    List<ComboboxModel> pttrn;  public List<ComboboxModel> getPttrn() { return pttrn; }  public void setPttrn(List<ComboboxModel> pttrn) { this.pttrn = pttrn; }
    // Список для комбоблкса "Задания"
    List<ComboboxModel> tasks;  public List<ComboboxModel> getTasks() { return tasks; }  public void setTasks(List<ComboboxModel> tasks) { this.tasks = tasks; }
    // Список для комбоблкса Сервер Астериск
    List<ComboboxModel> aster;  public List<ComboboxModel> getAster() { return aster; }  public void setAster(List<ComboboxModel> aster) { this.aster = aster; }
    // Список для комбоблкса SMS сервер
    List<ComboboxModel> sms;    public List<ComboboxModel> getSms()   { return sms;   }  public void setSms  (List<ComboboxModel> sms)   { this.sms = sms;     }
    // Список для комбоблкса Email сервер
    List<ComboboxModel> email;  public List<ComboboxModel> getEmail() { return email; }  public void setEmail(List<ComboboxModel> email) { this.email = email; }
}
