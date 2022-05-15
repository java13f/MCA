package org.kaznalnrprograms.MCA.Notes.Controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PinListController {
    /**
     * Вызов формы со списком контактов, которые невозможно оповестить
     * @return
     */
    @GetMapping("/Notes/PinListForm")
    @PreAuthorize("GetActRight('Notes','NotesView')")
    public String NotesForm() {
        return "Notes/PinListForm :: PinListForm";
    }
}
