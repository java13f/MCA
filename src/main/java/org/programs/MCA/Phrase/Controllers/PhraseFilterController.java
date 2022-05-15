package org.kaznalnrprograms.MCA.Phrase.Controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PhraseFilterController {
    @GetMapping("/Phrase/PhraseFilterForm")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public String PhraseFilterForm() {
        return "Phrase/PhraseFilterForm :: PhraseFilterForm";
    }
}
