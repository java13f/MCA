package org.kaznalnrprograms.MCA.Phrase.Models;

public class VoiceModel {
    private int pitch;
    private int rate;
    private int volume;
    private String voice;
    private String commandLine;
    private String voiceClient;

    public int getPitch() {
        return pitch;
    }

    public void setPitch(int pitch) {
        this.pitch = pitch;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        this.rate = rate;
    }

    public int getVolume() {
        return volume;
    }

    public void setVolume(int volume) {
        this.volume = volume;
    }

    public String getVoice() {
        return voice;
    }

    public void setVoice(String voice) {
        this.voice = voice;
    }

    public String getCommandLine() {
        return commandLine;
    }

    public void setCommandLine(String commandLine) {
        this.commandLine = commandLine;
    }

    public String getVoiceClient() {
        return voiceClient;
    }

    public void setVoiceClient(String voiceClient) {
        this.voiceClient = voiceClient;
    }
}
