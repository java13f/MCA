package org.kaznalnrprograms.MCA.Phrase.Models;

public class PhraseFilterModel {
    private String phraseGrpId;
    private FilterModel filter;

    public String getPhraseGrpId() {
        return phraseGrpId;
    }

    public void setPhraseGrpId(String phraseGrpId) {
        this.phraseGrpId = phraseGrpId;
    }

    public FilterModel getFilter() {
        return filter;
    }

    public void setFilter(FilterModel filter) {
        this.filter = filter;
    }
}
