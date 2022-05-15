package org.kaznalnrprograms.MCA.Abons.Controllers;

import org.kaznalnrprograms.MCA.Abons.Interfaces.IEditGroup;
import org.kaznalnrprograms.MCA.Abons.Models.GroupViewModel;
import org.kaznalnrprograms.MCA.Abons.Models.SaveGroupModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class EditGroupController {
    private IEditGroup dEditGroup;

    public EditGroupController(IEditGroup dEditGroup){
        this.dEditGroup = dEditGroup;
    }

    /**
     * Получить частичное представление окна Добавления / Редактирования группы
     * @return
     */
    @GetMapping("/Abons/AbonsFormEditGroup")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public String AbonsFormEditGroup(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "Abons/AbonsFormEditGroup :: AbonsFormEditGroup";
    }


    /**
     * Получение записи группы (grps) для формы редактирования группы
     * @param groupid
     * @return
     * @throws Exception
     */
    @PostMapping("/Abons/getGroupById")
    @PreAuthorize("GetActRight('Abons','GroupChange')")
    public  @ResponseBody
    GroupViewModel getGroupById(String groupid) throws Exception {
        return dEditGroup.getGroupById(groupid);
    }



    /**
     * Добавление / изменение группы
     * @param saveGroupModel
     * @return
     * @throws Exception
     */
    @PostMapping("/Abons/SaveGroup")
    @PreAuthorize("GetActRight('Abons','GroupChange')")
    public @ResponseBody
    String saveGroup(@RequestBody SaveGroupModel saveGroupModel) throws Exception {
        //Проверка существования группы
        boolean existGroup = dEditGroup.existsGroup(saveGroupModel);
        if (existGroup){
            return "";
        }

        return dEditGroup.saveGroup(saveGroupModel);
    }


}
