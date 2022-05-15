package org.kaznalnrprograms.MCA.Voc.Controllers;

import org.kaznalnrprograms.MCA.Voc.Interfaces.IVocDao;
import org.kaznalnrprograms.MCA.Voc.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class VocController {
    private IVocDao dVoc;

    public VocController(IVocDao dVoc) {
        this.dVoc = dVoc;
    }

    @GetMapping("/Voc/VocStart")
    @PreAuthorize("GetActRight('Voc','VocView')")
    public String VocStart(){
        return "Voc/VocStart";
    }

    @GetMapping("/Voc/VocForm")
    @PreAuthorize("GetActRight('Voc','VocView')")
    public String VocForm(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "Voc/VocForm :: VocForm";
    }

    @GetMapping("/Voc/VocEditForm")
    @PreAuthorize("GetActRight('Voc','VocView')")
    public String VocEditForm(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "Voc/VocEditForm :: VocEditForm";
    }

    @GetMapping("/Voc/VocItemEditForm")
    @PreAuthorize("GetActRight('Voc','VocView')")
    public String VocItemEditForm(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "Voc/VocItemEditForm :: VocItemEditForm";
    }

    @PostMapping("/Voc/GetVocItems")
    @PreAuthorize("GetActRight('Voc','VocView')")
    public @ResponseBody List<VocsListItemModel> GetVocItems(@RequestBody VocFilter filter) throws Exception {
        return dVoc.GetVocItems(filter);
    }

    @PostMapping("/Voc/GetVoc")
    @PreAuthorize("GetActRight('Voc','VocView')")
    public @ResponseBody List<VocViewModel> GetVoc(@RequestBody VocFilter filter) throws Exception {
        return dVoc.GetVoc(filter);
    }

    @PostMapping("/Voc/CheckWord")
    @PreAuthorize("GetActRight('Voc','VocChange')")
    public @ResponseBody String CheckWord(@RequestBody VocViewModel voc) throws Exception {
        return dVoc.CheckWord(voc);
    }

    @PostMapping("/Voc/Save")
    @PreAuthorize("GetActRight('Voc','VocChange')")
    public @ResponseBody String Save(@RequestBody VocViewModel word) throws Exception {
        return dVoc.Save(word);
    }

    @PostMapping("/Voc/Delete")
    @PreAuthorize("GetActRight('Voc','VocDel')")
    public @ResponseBody String Delete(@RequestBody VocViewModel word) throws Exception {
        return dVoc.Delete(word);
    }

    @PostMapping("/Voc/GetActRights")
    @PreAuthorize("GetActRight('Voc','VocView')")
    public @ResponseBody VocRightsModel GetActRights() throws Exception {
        return dVoc.GetActRights();
    }

    @PostMapping("/Voc/DeleteVocItem")
    @PreAuthorize("GetActRight('Voc','VocDel')")
    public @ResponseBody String DeleteVocItem(String id) throws Exception {
        return dVoc.DeleteVocItem(id);
    }

    @PostMapping("/Voc/LoadVocItem")
    @PreAuthorize("GetActRight('Voc','VocView')")
    public @ResponseBody VocItemEditModel LoadVocItem(String id) throws Exception {
        return dVoc.LoadVocItem(id);
    }

    @PostMapping("/Voc/CheckCode")
    @PreAuthorize("GetActRight('Voc','VocView')")
    public @ResponseBody boolean CheckCode(@RequestBody Map<String, Object> params) throws Exception {
        return dVoc.CheckCode(params);
    }

    @PostMapping("/Voc/SaveVocItem")
    @PreAuthorize("GetActRight('Voc','VocChange')")
    public @ResponseBody String SaveVocItem(@RequestBody VocItemEditModel vocItem) throws Exception {
        return dVoc.SaveVocItem(vocItem);
    }
}
