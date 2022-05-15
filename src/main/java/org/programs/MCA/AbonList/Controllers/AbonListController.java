package org.kaznalnrprograms.MCA.AbonList.Controllers;

import org.kaznalnrprograms.MCA.AbonList.Interfaces.IAbonList;
import org.kaznalnrprograms.MCA.AbonList.Models.AbonViewModel;
import org.kaznalnrprograms.MCA.AbonList.Models.DataTable;
import org.kaznalnrprograms.MCA.AbonList.Models.FilterModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@Controller
public class AbonListController {

    private IAbonList dIAbonList;

    public AbonListController(IAbonList dIAbonList){
        this.dIAbonList = dIAbonList;
    }

    @GetMapping("/AbonList/AbonListStart")
    @PreAuthorize("GetActRight('AbonList','AbonGroupsView')")
    public String AbonListStart(){
        return "AbonList/AbonListStart";
    }


    /**
     * Получить частичное представление основного окна
     * @return
     */
    @GetMapping("/AbonList/AbonListFormList")
    @PreAuthorize("GetActRight('AbonList','AbonGroupsView')")
    public String AbonListFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "AbonList/AbonListFormAbonList :: AbonListFormAbonList";
    }


    /**
     * Получить частичное представление фильтра
     * @return
     */
    @GetMapping("/AbonList/AbonListFormFilter")
    @PreAuthorize("GetActRight('AbonList','AbonGroupsView')")
    public String AbonListFormFilter(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "AbonList/AbonListFormFilter :: AbonListFormFilter";
    }


    /**
     * Получить список абонентов для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    @PostMapping("AbonList/listAbon")
    @PreAuthorize("GetActRight('AbonList','AbonGroupsView')")
    public @ResponseBody
    DataTable listAbon(@RequestBody FilterModel filter) throws Exception {
        int totalCountAbons = dIAbonList.getTotalAbons(filter);

        List<AbonViewModel> abons = dIAbonList.listAbon(filter);

        DataTable table = new DataTable();
        table.setTotal(totalCountAbons);
        List<Object> rowsObjs = new ArrayList<>();
        for(AbonViewModel abon : abons){
            rowsObjs.add(abon);
        }
        table.setRows(rowsObjs);
        return table;
    }




}
