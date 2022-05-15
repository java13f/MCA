package org.kaznalnrprograms.MCA.Phrase.Controllers;

import org.kaznalnrprograms.MCA.Phrase.Interfaces.IPhraseDao;
import org.kaznalnrprograms.MCA.Phrase.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class PhraseController {
    private IPhraseDao dPhrase;

    public PhraseController(IPhraseDao dPhrase) {
        this.dPhrase = dPhrase;
    }

    @GetMapping("/Phrase/PhraseStart")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public String PhraseStart(){
        return "Phrase/PhraseStart";
    }

    @GetMapping("/Phrase/PhraseForm")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public String PhraseForm(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "Phrase/PhraseForm :: PhraseForm";
    }

    @PostMapping("/Phrase/GetPhraseGroups")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public @ResponseBody List<PhraseGroupViewModel> GetPhraseGroups(@RequestBody GroupFilterModel groupFilter) throws Exception {
        return dPhrase.GetPhraseGroups(groupFilter);
    }

    @PostMapping("/Phrase/GetPhrases")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public @ResponseBody List<PhraseViewModel> GetPhrases(@RequestBody PhraseFilterModel phraseFilter) throws Exception {
        return dPhrase.GetPhrases(phraseFilter);
    }

    @PostMapping("/Phrase/GetActRights")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public @ResponseBody RightModel GetActRights() throws Exception {
        return dPhrase.GetActRights();
    }
}
