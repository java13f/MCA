package org.kaznalnrprograms.MCA.Abons.Controllers;

import org.kaznalnrprograms.MCA.Abons.Interfaces.IAbons;
import org.kaznalnrprograms.MCA.Abons.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class AbonsController {

    private IAbons dAbons;

    public AbonsController(IAbons dAbons){
        this.dAbons = dAbons;
    }

    @GetMapping("/Abons/AbonsStart")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public String AbonsStart(){
        return "Abons/AbonsStart";
    }

    /**
     * Получить частичное представление основного окна
     * @return
     */
    @GetMapping("/Abons/AbonsFormList")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public String AbonsFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "Abons/AbonsFormList :: AbonsFormList";
    }



    @PostMapping("/Abons/GetActRights")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody
    AbonsRightModel GetActRights() throws Exception {
        return dAbons.GetActRights();
    }


    /**
     * Получить частичное представление окна Фильтр по абонентам
     * @return
     */
    @GetMapping("/Abons/AbonsFormFilter")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public String AbonsFormFilter(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "Abons/AbonsFormFilter :: AbonsFormFilter";
    }


    /**
     * Получить список абонентов для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    @PostMapping("Abons/listAbon")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody
    DataTable listAbon(@RequestBody FilterModel filter) throws Exception {
        int totalCountAbons = dAbons.getTotalAbons(filter);

        List<AbonViewModel> abons = dAbons.listAbon(filter);

        DataTable table = new DataTable();
        table.setTotal(totalCountAbons);
        List<Object> rowsObjs = new ArrayList<>();
        for(AbonViewModel abon : abons){
            rowsObjs.add(abon);
        }
        table.setRows(rowsObjs);
        return table;
    }


    /**
     * Получить список групп для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    @PostMapping("Abons/listGroup")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody
    List<GroupViewModel> listGroup(@RequestBody FilterModel filter) throws Exception {

        List<GroupViewModel> groups = dAbons.listGroup(filter);

        return groups;
    }



    /**
     * Получить список абонентов в группе для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    @PostMapping("Abons/listAbonsInGroup")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody
    List<AbonsInGroupViewModel> listAbonsInGroup(@RequestBody FilterModel filter) throws Exception {

        List<AbonsInGroupViewModel> abonsInGroups = dAbons.listAbonsInGroup(filter);

        return abonsInGroups;
    }



    /**
     * Удаление группы
     * @param id - идентификатор группы
     * @throws Exception
     */
    @PostMapping("/Abons/deleteGroup")
    @PreAuthorize("GetActRight('Abons','GroupDel')")
    public @ResponseBody String deleteGroup(String id) throws Exception{

        dAbons.deleteGroup(id);
        return "";
    }



    /**
     * Удаление абонента
     * @param id - идентификатор абонента
     * @throws Exception
     */
    @PostMapping("/Abons/deleteAbon")
    @PreAuthorize("GetActRight('Abons','AbonDel')")
    public @ResponseBody String deleteAbon(String id) throws Exception{

        //Проверка существования абонента в группе
        boolean existsAbonInGroup = dAbons.existsAbonInGroup(id, "");
        if (existsAbonInGroup){
            return "Невозможно удалить абонента, так как он присутствует в группе.";
        }

        dAbons.deleteAbon(id);
        return "";
    }



    /**
     * Добавление абонента в группу
     * @param abonId
     * @param groupId
     * @return
     * @throws Exception
     */
    @PostMapping("/Abons/addAbonToGroup")
    @PreAuthorize("GetActRight('Abons','AbonGroupAdd')")
    public @ResponseBody String addAbonToGroup(String abonId, String groupId) throws Exception {
        //Проверка существования абонента в группе
        boolean existsAbonInGroup = dAbons.existsAbonInGroup(abonId, groupId);
        if (existsAbonInGroup){
           return "Абонент уже присутствует в группе.";
        }

        dAbons.addAbonToGroup(abonId, groupId);
        return "";
    }


    /**
     * Удаление абонента из группу
     * @param abonId
     * @param groupId
     * @return
     * @throws Exception
     */
    @PostMapping("/Abons/deleteAbonFromGroup")
    @PreAuthorize("GetActRight('Abons','AbonGroupDel')")
    public @ResponseBody String deleteAbonFromGroup(String abonId, String groupId) throws Exception {

        dAbons.deleteAbonFromGroup(abonId, groupId);
        return "";
    }




}
