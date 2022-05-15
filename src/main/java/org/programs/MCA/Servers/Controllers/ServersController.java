package org.kaznalnrprograms.MCA.Servers.Controllers;

import org.kaznalnrprograms.MCA.Servers.Interfaces.IServersDao;
import org.kaznalnrprograms.MCA.Servers.Models.ServersModel;
import org.kaznalnrprograms.MCA.Servers.Models.ServersRightsModel;
import org.kaznalnrprograms.MCA.Servers.Models.ServersServerTypesModel;
import org.kaznalnrprograms.MCA.Servers.Models.ServersViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class ServersController {
    private IServersDao dServers;

    public ServersController(IServersDao dServers) {
        this.dServers = dServers;
    }

    @GetMapping("/Servers/ServersStart")
    @PreAuthorize("GetActRight('Servers','ServersView')")
    public String ServersStart() {
        return "Servers/ServersStart";
    }

    /**
     * Получить частичное представление основного окна
     *
     * @return
     */
    @GetMapping("/Servers/ServersList")
    @PreAuthorize("GetActRight('Servers','ServersView')")
    public String ServersList(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "Servers/ServersList :: ServersList";
    }

    /**
     * Получить частичное представление окна редактирования
     *
     * @return
     */
    @GetMapping("/Servers/ServersEditForm")
    @PreAuthorize("GetActRight('Servers','ServersView')")
    public String ServersEditForm(@RequestParam(required = false, defaultValue = "") String prefix, Model model) {
        model.addAttribute("prefix", prefix);
        return "Servers/ServersEditForm :: ServersEditForm";
    }

    /**
     * Получение списка записей
     * @param params
     * @return
     * @throws Exception
     */
    @PostMapping("/Servers/getList")
    @PreAuthorize("GetActRight('Servers','ServersView')")
    @ResponseBody
    public List<ServersViewModel> getList(@RequestBody Map<String, Object> params) throws Exception {
        List<ServersViewModel> list = dServers.getList(Boolean.parseBoolean(params.get("showDel").toString()));
        return list;
    }

    /**
     * Получение прав для модуля
     * @return
     * @throws Exception
     */
    @PostMapping("/Servers/getRights")
    @PreAuthorize("GetActRight('Servers','ServersView')")
    public @ResponseBody
    ServersRightsModel getRights() throws Exception {
        return dServers.getRights();
    }

    /**
     * Проверка уникальности по полям "тип сервера" и "адрес"
     * @param params
     * @return
     * @throws Exception
     */
    @PostMapping("/Servers/checkTypeCode")
    @PreAuthorize("GetActRight('Servers','ServersChange')")
    public @ResponseBody
    int checkTypeCode(@RequestBody Map<String, Object> params) throws Exception {
        String id = params.get("id").toString();
        String code = params.get("code").toString();
        String srv_type_id = params.get("srv_type_id").toString();
        return dServers.checkTypeCode(id, code, srv_type_id);
    }

    /**
     * Проверка уникальности по полям "тип сервера" и "наименование"
     * @param params
     * @return
     * @throws Exception
     */
    @PostMapping("/Servers/checkTypeName")
    @PreAuthorize("GetActRight('Servers','ServersChange')")
    public @ResponseBody
    int checkTypeName(@RequestBody Map<String, Object> params) throws Exception {
        String id = params.get("id").toString();
        String name = params.get("name").toString();
        String srv_type_id = params.get("srv_type_id").toString();
        return dServers.checkTypeName(id, name, srv_type_id);
    }

    /**
     * Получение списка типа серверов
     * @return
     * @throws Exception
     */
    @PostMapping("/Servers/getServerTypes")
    @PreAuthorize("GetActRight('Servers','ServersView')")
    public @ResponseBody
    List<ServersServerTypesModel> getServerTypes() throws Exception {
        return dServers.getServerTypes();
    }

    /**
     * Получение записи по идентификатору
     * @param params
     * @return
     * @throws Exception
     */
    @PostMapping("/Servers/get")
    @PreAuthorize("GetActRight('Servers','ServersView')")
    public @ResponseBody
    ServersModel get(@RequestBody Map<String, Object> params) throws Exception {
        String id = params.get("id").toString();
        return dServers.get(id);
    }

    /**
     * Сохранение записи
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Servers/save")
    @PreAuthorize("GetActRight('Servers','ServersChange')")
    public @ResponseBody
    String save(@RequestBody ServersModel model) throws Exception {
        return dServers.save(model);
    }

    /**
     * Удаление записи по идентификатору
     * @param params
     * @return
     * @throws Exception
     */
    @PostMapping("/Servers/delete")
    @PreAuthorize("GetActRight('Servers','ServersDel')")
    public @ResponseBody
    String delete(@RequestBody Map<String, Object> params) throws Exception {
        String id = params.get("id").toString();
        dServers.delete(id);
        return "";
    }
}
