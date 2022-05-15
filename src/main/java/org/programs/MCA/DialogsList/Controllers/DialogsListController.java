package org.kaznalnrprograms.MCA.DialogsList.Controllers;

import org.kaznalnrprograms.MCA.DialogsList.Innterfaces.IDialogsListDao;
import org.kaznalnrprograms.MCA.DialogsList.Models.DialogsListViewModel;
import org.kaznalnrprograms.MCA.DialogsList.Models.FilterModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class DialogsListController {
    private IDialogsListDao dDialogsList;

    public DialogsListController(IDialogsListDao dDialogsList) {
        this.dDialogsList = dDialogsList;
    }

    @GetMapping("/DialogsList/DialogsListStart")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public String DialogsListStart(){
        return "DialogsList/DialogsListStart";
    }

    @GetMapping("/DialogsList/DialogsListForm")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public String DialogsListForm(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "DialogsList/DialogsListForm :: DialogsListForm";
    }

    @PostMapping("/DialogsList/GetList")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody List<DialogsListViewModel> GetList(@RequestBody FilterModel filter) throws Exception {
        return dDialogsList.GetList(filter);
    }
}
