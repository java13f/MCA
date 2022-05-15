package org.kaznalnrprograms.MCA.GrpList.Controllers;


import org.kaznalnrprograms.MCA.GrpList.Interfaces.IGrpList;
import org.kaznalnrprograms.MCA.GrpList.Models.FilterModel;
import org.kaznalnrprograms.MCA.GrpList.Models.GroupViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class GrpListController {
    private IGrpList dIGrpList;

    public GrpListController(IGrpList dIGrpList){
        this.dIGrpList = dIGrpList;
    }


    @GetMapping("/GrpList/GrpListStart")
    @PreAuthorize("GetActRight('GrpList','AbonGroupsView')")
    public String GrpListStart(){
        return "GrpList/GrpListStart";
    }


    /**
     * Получить частичное представление основного окна
     * @return
     */
    @GetMapping("/GrpList/GrpListFormList")
    @PreAuthorize("GetActRight('GrpList','AbonGroupsView')")
    public String GrpListFormList(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "GrpList/GrpListFormGrpList :: GrpListFormGrpList";
    }


    /**
     * Получить частичное представление формы Фильтр
     * @return
     */
    @GetMapping("/GrpList/GrpListFormFilter")
    @PreAuthorize("GetActRight('GrpList','AbonGroupsView')")
    public String GrpListFormFilter(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "GrpList/GrpListFormFilter :: GrpListFormFilter";
    }


    /**
     * Получить список групп для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    @PostMapping("GrpList/listGroup")
    @PreAuthorize("GetActRight('GrpList','AbonGroupsView')")
    public @ResponseBody
    List<GroupViewModel> listGroup(@RequestBody FilterModel filter) throws Exception {

        List<GroupViewModel> groups = dIGrpList.listGroup(filter);

        return groups;
    }


}
