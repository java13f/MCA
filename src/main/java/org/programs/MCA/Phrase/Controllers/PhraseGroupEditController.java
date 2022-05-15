package org.kaznalnrprograms.MCA.Phrase.Controllers;

import org.kaznalnrprograms.MCA.Phrase.Interfaces.IPhraseGroupEditDao;
import org.kaznalnrprograms.MCA.Phrase.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
public class PhraseGroupEditController {
    private IPhraseGroupEditDao dPhraseGroupEdit;

    public PhraseGroupEditController(IPhraseGroupEditDao dPhraseGroupEdit) {
        this.dPhraseGroupEdit = dPhraseGroupEdit;
    }

    @GetMapping("/Phrase/PhraseGroupEditForm")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public String PhraseGroupEditForm() {
        return "Phrase/PhraseGroupEditForm :: PhraseGroupEditForm";
    }

    @PostMapping("/Phrase/GetVoiceTypes")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public @ResponseBody List<VoiceTypeModel> GetVoiceTypes() throws Exception {
        return dPhraseGroupEdit.GetVoiceTypes();
    }

    @PostMapping("/Phrase/GetGroup")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public @ResponseBody VoiceEditModel GetGroup(String id) throws Exception {
        return dPhraseGroupEdit.GetGroup(id);
    }

    @PostMapping("/Phrase/SyntezeTest")
    @PreAuthorize("GetActRight('Phrase','PhraseView')")
    public @ResponseBody String SyntezeTest(@RequestBody VoiceTestParamModel voiceTest) throws Exception {
        return dPhraseGroupEdit.SyntezeTest(voiceTest);
    }

    @PostMapping("/Phrase/SaveGroup")
    @PreAuthorize("GetActRight('Phrase','PhraseGrpChange')")
    public @ResponseBody String SaveGroup(@RequestBody VoiceEditModel phraseGroup) throws Exception {
        return dPhraseGroupEdit.SaveGroup(phraseGroup);
    }

    @PostMapping("/Phrase/CheckGrpCode")
    @PreAuthorize("GetActRight('Phrase','PhraseGrpChange')")
    public @ResponseBody boolean CheckGrpCode(@RequestBody Map<String, Object> params) throws Exception {
        return dPhraseGroupEdit.CheckGrpCode(params);
    }

    @PostMapping("/Phrase/DelGroup")
    @PreAuthorize("GetActRight('Phrase','PhraseGrpDel')")
    public @ResponseBody String DelGroup(String id) throws Exception {
        return dPhraseGroupEdit.DelGroup(id);
    }
}
