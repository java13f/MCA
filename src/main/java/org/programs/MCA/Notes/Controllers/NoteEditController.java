package org.kaznalnrprograms.MCA.Notes.Controllers;

import org.kaznalnrprograms.MCA.Notes.Interfaces.INoteEditDao;
import org.kaznalnrprograms.MCA.Notes.Models.DialogAllModel;
import org.kaznalnrprograms.MCA.Notes.Models.ListItemEditModel;
import org.kaznalnrprograms.MCA.Notes.Models.NoteEditModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class NoteEditController {
    private INoteEditDao dNoteEdit;

    public NoteEditController(INoteEditDao dNoteEdit) {
        this.dNoteEdit = dNoteEdit;
    }

    /**
     * Вызов формы редактирования задания
     * @return
     * @throws Exception
     */
    @GetMapping("/Notes/NoteEditForm")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public String NoteEditForm() {
        return "Notes/NoteEditForm :: NoteEditForm";
    }
    /**
     * Вызов формы фильтра
     * @return
     * @throws Exception
     */
    @GetMapping("/Notes/AbonEditForm")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public String AbonEditForm() {
        return "Notes/AbonEditForm :: AbonEditForm";
    }
    /**
     * Получить задание по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/GetNoteFromId")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public @ResponseBody NoteEditModel GetNoteFromId(String id) throws Exception {
        return dNoteEdit.GetNoteFromId(id);
    }
    /**
     * Получить общий диалог по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/GetDialogAllFromId")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public @ResponseBody DialogAllModel GetDialogAllFromId(String id) throws Exception {
        return dNoteEdit.GetDialogAllFromId(id);
    }
    /**
     * Удаление задания
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/DelNote")
    @PreAuthorize("GetActRight('Notes','NoteDel')")
    public @ResponseBody String DelNote(String id) throws Exception {
        return dNoteEdit.DelNote(id);
    }
    /**
     * Сохранение задания
     * @param note
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/SaveNote")
    @PreAuthorize("GetActRight('Notes','NoteChange')")
    public @ResponseBody String SaveNote(@RequestBody NoteEditModel note) throws Exception {
        return dNoteEdit.SaveNote(note);
    }
    /**
     * Получить список абонентов шаблона
     * @param patternId
     * @return
     * @throws Exception
     */
    @PostMapping("/Notes/GetListItemsFromPatternId")
    @PreAuthorize("GetActRight('Notes','NoteView')")
    public @ResponseBody List<ListItemEditModel> GetListItemsFromPatternId(String patternId) throws Exception {
        return dNoteEdit.GetListItemsFromPatternId(patternId);
    }
}
