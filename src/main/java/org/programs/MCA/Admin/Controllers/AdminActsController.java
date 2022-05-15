package org.kaznalnrprograms.MCA.Admin.Controllers;

import org.kaznalnrprograms.MCA.Admin.Interfaces.IAdminActsDao;
import org.kaznalnrprograms.MCA.Admin.Models.ActFilterModel;
import org.kaznalnrprograms.MCA.Admin.Models.ActModel;
import org.kaznalnrprograms.MCA.Admin.Models.ActViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class AdminActsController {
    private IAdminActsDao dActs;
    public AdminActsController(IAdminActsDao dActs){
        this.dActs = dActs;
    }

    @GetMapping("/AdminActs/GetActEditForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String GetActEditForm(){
        return "Admin/ActEditForm :: ActEditForm";
    }
    @GetMapping("/AdminActs/ActFormSelect")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String ActFormSelect(){
        return "Admin/Directories/ActFormSelect :: ActFormSelect";
    }
    @GetMapping("/AdminActs/ActFilterForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String ActFilterForm(){
        return "Admin/ActFilterForm :: ActFilterForm";
    }
    /**
     * Получить список действий
     * @param filter - фильтр по действиям
     */
    @PostMapping("/AdminActs/List")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody List<ActViewModel> List(@RequestBody ActFilterModel filter) throws Exception {
        return dActs.List(filter.getAppId(), filter.getCode(), filter.getName());
    }
    /**
     * Получить действие
     * @param id - идентификатор действия
     */
    @PostMapping("/AdminActs/Get")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody ActModel Get(String id) throws Exception {
        return dActs.Get(id);
    }
    /**
     * Проверить существование действия в базе данных
     * @param id - идентификатор действия (для новых -1)
     * @param code - код действия
     */
    @GetMapping("/AdminActs/Exists")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody boolean Exists(String id, String code) throws Exception {
        return dActs.Exists(id, code);
    }
    /**
     * Добавить/Изменить действие
     * @param act - модель действия
     */
    @PostMapping("/AdminActs/Save")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String Save(@RequestBody ActModel act) throws Exception {
        return dActs.Save(act);
    }
    /**
     * Удалить действие
     * @param id - идентификатор действия
     */
    @PostMapping("/AdminActs/Delete")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String Delete(String id) throws Exception {
        return dActs.Delete(id);
    }
    /**
     * Получить данные выбранного действия
     * @param id - Идентифиатор действия
     */
    @PostMapping("/AdminActs/GetActSel")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String GetActSel(String id) throws Exception {
        return dActs.GetActSel(id);
    }
}
