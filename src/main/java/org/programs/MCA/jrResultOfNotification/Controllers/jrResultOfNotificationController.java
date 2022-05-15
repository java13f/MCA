package org.kaznalnrprograms.MCA.jrResultOfNotification.Controllers;

import org.kaznalnrprograms.MCA.jrResultOfNotification.Interfaces.IjrResultOfNotificationDao;
import org.kaznalnrprograms.MCA.jrResultOfNotification.Models.NoteModel;
import org.kaznalnrprograms.MCA.jrResultOfNotification.Models.TimeModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class jrResultOfNotificationController {
    private IjrResultOfNotificationDao dao;

    jrResultOfNotificationController(IjrResultOfNotificationDao dao) {
        this.dao = dao;
    }

    /*
    Стартовый маппинг
     */
    @GetMapping("/jrResultOfNotification/jrResultOfNotificationStart")
    @PreAuthorize("GetActRight('jrResultOfNotification','jrResultOfNotificationView')")
    public String jrResultOfNotificationStart() throws Exception {
        return "jrResultOfNotification/jrResultOfNotificationStart";
    }

    /*
    Получить частичное представление основной формы
     */
    @GetMapping("/jrResultOfNotification/jrResultOfNotification")
    @PreAuthorize("GetActRight('jrResultOfNotification','jrResultOfNotificationView')")
    public String jrResultOfNotification(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "jrResultOfNotification/jrResultOfNotification :: jrResultOfNotification";
    }

    /*
    Получить частичное представление формы с выобором параметров для отчёта
     */
    @GetMapping("/jrResultOfNotification/jrResultOfNotificationParams")
    @PreAuthorize("GetActRight('jrResultOfNotification','jrResultOfNotificationView')")
    public String jrResultOfNotificationParams() throws Exception {
        return "jrResultOfNotification/jrResultOfNotificationParams :: jrResultOfNotificationParams";
    }

    /*
    Получить оповещения по дате
     */
    @PostMapping("/jrResultOfNotification/getNotesByDate")
    @PreAuthorize("GetActRight('jrResultOfNotification','jrResultOfNotificationView')")
    @ResponseBody
    public List<NoteModel> getNotesByDate(@RequestBody Map<String, Object> params) throws Exception {
        String date = params.get("date").toString();
        List<NoteModel> result = dao.getNotesByDate(date);
        return result;
    }

    /*
    Получить список времён оповещения по дате и идентификатору оповещения
     */
    @PostMapping("/jrResultOfNotification/getListTimeByNoteAndDate")
    @PreAuthorize("GetActRight('jrResultOfNotification','jrResultOfNotificationView')")
    @ResponseBody
    public List<TimeModel> getListTimeByNoteAndDate(@RequestBody Map<String, Object> params) throws Exception {
        String note_id = params.get("note_id").toString();
        String date = params.get("date").toString();
        List<TimeModel> result = dao.getListTimeByNoteAndDate(note_id, date);
        return result;
    }
}
