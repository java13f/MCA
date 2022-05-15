package org.kaznalnrprograms.MCA.Switchs.Models;

import java.util.UUID;

public class SwitchsModel {
    private UUID id;
    private String code;

    private int switch_type_id;
    private int phone_try_no;
    private int phone_no_answer_pause;
    private int phone_busy_fail_pause;
    private int phone_wait_answer;
    private int sms_try_no;
    private int sms_pause_repeat;
    private int mail_try_no;
    private int mail_pause_repeat;
    private String creator;
    private String created;
    private String changer;
    private String changed;

    private int phone_recall_if_break;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }



    public void setCode(String code) {
        this.code = code;
    }

    public int getSwitch_type_id() {
        return switch_type_id;
    }

    public void setSwitch_type_id(int switch_type_id) {
        this.switch_type_id = switch_type_id;
    }

    public int getPhone_try_no() {
        return phone_try_no;
    }

    public void setPhone_try_no(int phone_try_no) {
        this.phone_try_no = phone_try_no;
    }

    public int getPhone_no_answer_pause() {
        return phone_no_answer_pause;
    }

    public void setPhone_no_answer_pause(int phone_no_answer_pause) {
        this.phone_no_answer_pause = phone_no_answer_pause;
    }

    public int getPhone_busy_fail_pause() {
        return phone_busy_fail_pause;
    }

    public void setPhone_busy_fail_pause(int phone_busy_fail_pause) {
        this.phone_busy_fail_pause = phone_busy_fail_pause;
    }

    public int getPhone_wait_answer() {
        return phone_wait_answer;
    }

    public void setPhone_wait_answer(int phone_wait_answer) {
        this.phone_wait_answer = phone_wait_answer;
    }

    public int getSms_try_no() {
        return sms_try_no;
    }

    public void setSms_try_no(int sms_try_no) {
        this.sms_try_no = sms_try_no;
    }

    public int getSms_pause_repeat() {
        return sms_pause_repeat;
    }

    public void setSms_pause_repeat(int sms_pause_repeat) {
        this.sms_pause_repeat = sms_pause_repeat;
    }

    public int getMail_try_no() {
        return mail_try_no;
    }

    public void setMail_try_no(int mail_try_no) {
        this.mail_try_no = mail_try_no;
    }

    public int getMail_pause_repeat() {
        return mail_pause_repeat;
    }

    public void setMail_pause_repeat(int mail_pause_repeat) {
        this.mail_pause_repeat = mail_pause_repeat;
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

    public int getPhone_recall_if_break() { return phone_recall_if_break; }

    public void setPhone_recall_if_break(int phone_recall_if_break) {  this.phone_recall_if_break = phone_recall_if_break; }
}
