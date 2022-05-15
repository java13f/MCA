package org.kaznalnrprograms.MCA.Notes.Controllers;

import org.kaznalnrprograms.MCA.Notes.Interfaces.IPatternDao;
import org.kaznalnrprograms.MCA.Notes.Models.ListItemEditModel;
import org.kaznalnrprograms.MCA.Notes.Models.PatternEditModel;
import org.kaznalnrprograms.MCA.Notes.Models.PeriodTimeModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class PatternController {
    private IPatternDao dPattern;

    public PatternController(IPatternDao dPattern) {
        this.dPattern = dPattern;
    }

    /**
     * Вызов формы редактирования шаблона
     * @return
     */
    @GetMapping("/Notes/PatternEditForm")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public String PatternEditForm() {
        return "Notes/PatternEditForm :: PatternEditForm";
    }
    /**
     * Получить шаблон по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/GetPatternFromId")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public @ResponseBody PatternEditModel GetPatternFromId(String id) throws Exception {
        return dPattern.GetPatternFromId(id);
    }
    /**
     * Удаление шаблона
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/DelPattern")
    @PreAuthorize("GetActRight('Notes','PatternDel')")
    public @ResponseBody String DelPattern(String id) throws Exception {
        return dPattern.DelPattern(id);
    }
    /**
     * Получить данные о группе по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/LoadGrpFromId")
    @PreAuthorize("GetActRight('Notes','PatternChange')")
    public @ResponseBody ListItemEditModel LoadGrpFromId(String id) throws Exception {
        return dPattern.LoadGrpFromId(id);
    }
    /**
     * Получить данные об абоненте по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/LoadAbonFromId")
    @PreAuthorize("GetActRight('Notes','PatternChange')")
    public @ResponseBody ListItemEditModel LoadAbonFromId(String id) throws Exception {
        return dPattern.LoadAbonFromId(id);
    }
    /**
     * Сохранение шаблона
     * @param pattern
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/SavePattern")
    @PreAuthorize("GetActRight('Notes','PatternChange')")
    public @ResponseBody String SavePattern(@RequestBody PatternEditModel pattern) throws Exception {
        return dPattern.SavePattern(pattern);
    }
    /**
     * Получить период актуальности из шаблона
     * @param patternId
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/GetPeriodAct")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public @ResponseBody PeriodTimeModel GetPeriodAct(String patternId) throws Exception {
        return dPattern.GetPeriodAct(patternId);
    }
}
