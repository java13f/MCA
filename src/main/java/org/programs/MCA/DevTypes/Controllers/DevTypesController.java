package org.kaznalnrprograms.MCA.DevTypes.Controllers;

import org.kaznalnrprograms.MCA.DevTypes.Interfaces.IDevTypes;
import org.kaznalnrprograms.MCA.DevTypes.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class DevTypesController
{
    private IDevTypes dao;

    public DevTypesController(IDevTypes dao) {
        this.dao = dao;
    }

    @GetMapping("/DevTypes/DevTypesFormList")
    @PreAuthorize("GetActRight('DevTypes','DevTypesView')")
    public String DevTypesFormList(@RequestParam(required = false, defaultValue = "")String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "DevTypes/DevTypesFormList :: DevTypesFormList";
    }

    @GetMapping("/DevTypes/DevTypesStart")
    @PreAuthorize("GetActRight('DevTypes','DevTypesView')")
    public String DevTypesStart() {
        return "DevTypes/DevTypesStart";
    }

    @GetMapping("/DevTypes/DevTypesFormEdit")
    @PreAuthorize("GetActRight('DevTypes','DevTypesView')")
    public String DevTypesFormEdit() {
        return "DevTypes/DevTypesFormEdit :: DevTypesFormEdit";
    }

    /**
     * Получить список типов устройств
     * @param del
     * @return
     * @throws Exception
     */
    @PostMapping("/DevTypes/GetList")
    @PreAuthorize("GetActRight('DevTypes','DevTypesView')")
    public @ResponseBody
    List<DevTypesView> GetList(Boolean del) throws Exception {
        return dao.GetList(del);
    }

    /**
     * Сохранить тип устройства
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/DevTypes/Save")
    @PreAuthorize("GetActRight('DevTypes','DevTypesChange')")
    public @ResponseBody
    String Save(@RequestBody DevTypesSave model) throws Exception {
        return dao.Save(model);
    }

    /**
     * Удалить запись
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/DevTypes/Delete")
    @PreAuthorize("GetActRight('DevTypes','DevTypesDel')")
    public @ResponseBody
    String Delete(@RequestBody Map<String, Object> model) throws Exception {
        dao.Delete(model);
        return "";
    }

    /**
     * Получить тип устройства
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/DevTypes/GetDevType")
    @PreAuthorize("GetActRight('DevTypes','DevTypesView')")
    public @ResponseBody
    DevTypesSave GetDevType(@RequestBody Map<String, Object> model) throws Exception {
        return dao.GetDevType(model);
    }

    /**
     * Проверка всех прав для модуля
     * @return
     * @throws Exception
     */
    @PostMapping("/DevTypes/GetActRights")
    @PreAuthorize("GetActRight('DevTypes','DevTypesView')")
    public @ResponseBody
    RightsModel GetActRights () throws Exception {
        return dao.GetActRights();
    }

    /**
     * Получить заблокируемые записи
     * @return
     * @throws Exception
     */
    @PostMapping("/DevTypes/GetLockRecords")
    @PreAuthorize("GetActRight('DevTypes','DevTypesView')")
    public @ResponseBody
    String GetLockRecords () throws Exception {
        return dao.GetLockRecords();
    }
}
