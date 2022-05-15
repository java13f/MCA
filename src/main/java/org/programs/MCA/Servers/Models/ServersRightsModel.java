package org.kaznalnrprograms.MCA.Servers.Models;

public class ServersRightsModel {
    private String serversView;
    private String serversChange;
    private String serversDel;

    public String getServersView() {
        return serversView;
    }

    public void setServersView(String serversView) {
        this.serversView = serversView;
    }

    public String getServersChange() {
        return serversChange;
    }

    public void setServersChange(String serversChange) {
        this.serversChange = serversChange;
    }

    public String getServersDel() {
        return serversDel;
    }

    public void setServersDel(String serversDel) {
        this.serversDel = serversDel;
    }
}
