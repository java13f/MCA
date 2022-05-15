package org.kaznalnrprograms.MCA.Phrase.Controllers;

import org.kaznalnrprograms.MCA.Phrase.Interfaces.IPhraseEditDao;
import org.kaznalnrprograms.MCA.Phrase.Models.ConvertFileModel;
import org.kaznalnrprograms.MCA.Phrase.Models.GlobalParamsModel;
import org.kaznalnrprograms.MCA.Phrase.Models.PhraseChangeModel;
import org.kaznalnrprograms.MCA.Phrase.Models.SyntezeTextModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
public class PhraseEditController {
    private IPhraseEditDao dPhraseEdit;

    public PhraseEditController(IPhraseEditDao dPhraseEdit) {
        this.dPhraseEdit = dPhraseEdit;
    }

    @GetMapping("/Phrase/PhraseEditForm")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public String PhraseEditForm() {
        return "Phrase/PhraseEditForm :: PhraseEditForm";
    }

    @PostMapping("/Phrase/SyntezeWawFile")
    @PreAuthorize("GetActRight('Phrase','PhraseChange')")
    public @ResponseBody String SyntezeWawFile(@RequestBody SyntezeTextModel syntezeTextModel) throws Exception {
        return dPhraseEdit.SyntezeWawFile(syntezeTextModel);
    }

    @PostMapping("/Phrase/ConvertWavFile")
    @PreAuthorize("GetActRight('Phrase','PhraseChange')")
    public @ResponseBody String ConvertWavFile(@RequestBody ConvertFileModel fileData) throws Exception {
        return dPhraseEdit.ConvertWavFile(fileData);
    }

    @PostMapping("/Phrase/GetGlobalParams")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public @ResponseBody GlobalParamsModel GetGlobalParams() throws Exception {
        return dPhraseEdit.GetGlobalParams();
    }

    @PostMapping("/Phrase/GetPhrase")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public @ResponseBody PhraseChangeModel GetPhrase(String id) throws Exception {
        return dPhraseEdit.GetPhrase(id);
    }

    @PostMapping("/Phrase/CheckPhraseCode")
    @PreAuthorize("GetActRight('Phrase','PhraseChange')")
    public @ResponseBody boolean CheckPhraseCode(@RequestBody Map<String, Object> params) throws Exception {
        return dPhraseEdit.CheckPhraseCode(params);
    }

    @PostMapping("/Phrase/SavePhrase")
    @PreAuthorize("GetActRight('Phrase','PhraseChange')")
    public @ResponseBody String SavePhrase(@RequestBody PhraseChangeModel phrase) throws Exception {
        return dPhraseEdit.SavePhrase(phrase);
    }

    @PostMapping("/Phrase/DelPhrase")
    @PreAuthorize("GetActRight('Phrase','PhraseDel')")
    public @ResponseBody String DelPhrase(String id) throws Exception {
        return dPhraseEdit.DelPhrase(id);
    }
}
