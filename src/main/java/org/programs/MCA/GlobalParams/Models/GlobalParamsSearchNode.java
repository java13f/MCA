package org.kaznalnrprograms.MCA.GlobalParams.Models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import java.util.UUID;

public class GlobalParamsSearchNode {
    private UUID id;
    private UUID parent_id;
    private List<GlobalParamsSearchNode> children;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getParent_id() {
        return parent_id;
    }

    public void setParent_id(UUID parent_id) {
        this.parent_id = parent_id;
    }

    public List<GlobalParamsSearchNode> getChildren() {
        return children;
    }

    public void setChildren(List<GlobalParamsSearchNode> children) {
        this.children = children;
    }
}
