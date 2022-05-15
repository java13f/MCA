package org.kaznalnrprograms.MCA.Notes.Controllers;

import org.kaznalnrprograms.MCA.Notes.Interfaces.INotesDao;
import org.kaznalnrprograms.MCA.Notes.Models.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class NotesController {
    private INotesDao dNotes;

    public NotesController(INotesDao dNotes) {
        this.dNotes = dNotes;
    }

    @GetMapping("/Notes/NotesStart")
    @PreAuthorize("GetActRight('Notes','NotesView')")
    public String NotesStart(){
        return "Notes/NotesStart";
    }
    /**
     * Вызов контента главного окна модуля
     * @param prefix
     * @param model
     * @return
     */
    @GetMapping("/Notes/NotesForm")
    @PreAuthorize("GetActRight('Notes','NotesView')")
    public String NotesForm(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "Notes/NotesForm :: NotesForm";
    }
    /**
     * Вызов формы фильтра заданий
     * @return
     */
    @GetMapping("/Notes/NoteFilterForm")
    @PreAuthorize("GetActRight('Notes','NotesView')")
    public String NoteFilterForm() {
        return "Notes/NoteFilterForm :: NoteFilterForm";
    }
    /**
     * проверка всех прав модуля
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/GetActRights")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public @ResponseBody NotesRightModel GetActRights() throws Exception {
        return dNotes.GetActRights();
    }
    /**
     * Список заданий в соответствии фильтру
     * @param filter
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/GetNotes")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public @ResponseBody List<NotesViewModel> GetNotes(@RequestBody NoteFilterModel filter) throws Exception {
        return dNotes.GetNotes(filter);
    }
    /**
     * Получить список шаблонов по идентфикатору задания
     * @param filter
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/GetPatterns")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public @ResponseBody List<PatternViewModel> GetPatterns(@RequestBody PatternFilterModel filter) throws Exception {
        return dNotes.GetPatterns(filter);
    }
    /**
     * Получить статус задания
     * @param noteId
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/GetNoteStts")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public @ResponseBody SttsModel GetNoteStts(String noteId) throws Exception {
        return dNotes.GetNoteStts(noteId);
    }
    /**
     * Получить список статусов
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/LoadSttsList")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public @ResponseBody List<SttsModel> LoadSttsList() throws Exception {
        return dNotes.LoadSttsList();
    }
    /**
     * Получить список контактов по которым невозможно произвести оповещение
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/GetPinsNoNotify")
    @PreAuthorize("GetActRight('Notes','NotRun')")
    public @ResponseBody List<PinModel> GetPinsNoNotify(String id) throws Exception {
        return dNotes.GetPinsNoNotify(id);
    }
    /**
     * Запись контактов, которые невозможно оповестить в протокол
     * @param pins
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/AddPinsToLog")
    @PreAuthorize("GetActRight('Notes','NotRun')")
    public @ResponseBody String AddPinsToLog(@RequestBody List<PinModel> pins) throws Exception {
        return dNotes.AddPinsToLog(pins);
    }
    /**
     * Запуск или остановка задачи
     * @param noteId
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/RunOrStopNotify")
    @PreAuthorize("GetActRight('Notes','NotRun')")
    public @ResponseBody Map<String, Object> RunOrStopNotify(String noteId) throws Exception {
        NoteFuncModel nfm = dNotes.RunOrStopNotify(noteId);
        Map<String, Object> params = new HashMap<>();
        params.put("note_id", noteId);
        String actionUrl = nfm.getActionUrl(params); // url get запроса на действие (запуск\остановка)
        URL url = new URL(actionUrl);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");
        int status = con.getResponseCode();
        if(status == 200) {
            nfm.setSuccessMsg("Команда серверу на "
                    + (nfm.getSttsFlag().equals("001") ? "остановку" : "запуск")
                    + " задания с id=" + noteId + " отправлена успешно");
        }
        else {
            nfm.setErrorMsg("Ошибка отправки команды на "
                    + (nfm.getSttsFlag().equals("001") ? "остановку" : "запуск")
                    + " задания с id=" + noteId + ". Код ошибки " + status);
        }
        params.clear();
        params.put("errorMsg", nfm.getErrorMsg());
        params.put("successMsg", nfm.getSuccessMsg());
        return params;
    }
}
