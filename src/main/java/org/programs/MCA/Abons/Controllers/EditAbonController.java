package org.kaznalnrprograms.MCA.Abons.Controllers;

import org.kaznalnrprograms.MCA.Abons.Interfaces.IEditAbon;
import org.kaznalnrprograms.MCA.Abons.Models.AbonEditModel;
import org.kaznalnrprograms.MCA.Abons.Models.TypeComModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class EditAbonController {
    private IEditAbon dEditAbon;

    public EditAbonController(IEditAbon dEditAbon){
        this.dEditAbon = dEditAbon;
    }

    /**
     * Получить частичное представление окна Добавления / Редактирования абонента
     * @return
     */
    @GetMapping("/Abons/AbonsFormEditAbon")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public String AbonsFormEditAbon(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "Abons/AbonsFormEditAbon :: AbonsFormEditAbon";
    }


    /**
     * Получить частичное представление окна Добавления / Редактирования контакта
     * @return
     */
    @GetMapping("/Abons/AbonsFormEditContact")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public String AbonsFormEditContact(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "Abons/AbonsFormEditContact :: AbonsFormEditContact";
    }


    /**
     * Получение абонента и его контактов по ид
     * @param id
     * @return
     * @throws Exception
     */
    @PostMapping("/Abons/GetAbonFromId")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody
    AbonEditModel GetAbonFromId(String id) throws Exception {
        return dEditAbon.GetAbonFromId(id);
    }



    /**
     * Получить список типов коммутаций для combobox (форма контакта)
     * @return
     * @throws Exception
     */
    @PostMapping("/Abons/getTypeCom")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody
    List<TypeComModel> getTypeCom() throws Exception {
        return dEditAbon.getTypeCom();
    }


    /**
     * Получение номера телефона без лишних символов (только цифры)
     * @return
     * @throws Exception
     */
    @PostMapping("/Abons/getClearNom")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody String getClearNom(String number) throws Exception {

        if(number.trim().length() == 0) {return ""; }

        ImpCsvAbons impCsvAbons = new ImpCsvAbons();
        return impCsvAbons.getClearNom(number.trim());
    }


    /**
     * Сохранение абонента
     * @param abon
     * @return
     * @throws Exception
     */
    @PostMapping("/Abons/SaveAbon")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public @ResponseBody String SaveAbon(@RequestBody AbonEditModel abon) throws Exception {

        if( !dEditAbon.checkAbon(abon.getId(), abon.getSnils()) ){
            return "";
        }

        return dEditAbon.SaveAbon(abon);
    }


}
