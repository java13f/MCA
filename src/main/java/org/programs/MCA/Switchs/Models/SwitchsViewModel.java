package org.kaznalnrprograms.MCA.Switchs.Models;

import java.util.UUID;

public class SwitchsViewModel {
    private UUID id;
    private String tp_km;
    private String name;
    private int tl_attempts;
    private int tl_btw_attempts;
    private int tl_btw_sets;
    private int tl_pause;
    private int sms_attempts;
    private int sms_pause;
    private int email_attempts;
    private int email_pause;
    private int del;

    public UUID getId() {
        return id;
    }
    public int getDel() {
        return del;
    }
    public String getName() { return name; }
    public String getTp_km() {
        return tp_km;
    }
    public int getTl_attempts() {
        return tl_attempts;
    }
    public int getTl_btw_attempts() {
        return tl_btw_attempts;
    }
    public int getTl_btw_sets() {
        return tl_btw_sets;
    }
    public int getTl_pause() {
        return tl_pause;
    }
    public int getSms_attempts() {
        return sms_attempts;
    }
    public int getSms_pause() {
        return sms_pause;
    }
    public int getEmail_attempts() {
        return email_attempts;
    }
    public int getEmail_pause() {
        return email_pause;
    }
}
