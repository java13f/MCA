package org.kaznalnrprograms.MCA.Abons.Controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.kaznalnrprograms.MCA.Abons.Interfaces.IAbonsService;
import org.kaznalnrprograms.MCA.Abons.Models.Csv.AbonModel;
import org.kaznalnrprograms.MCA.Abons.Models.Csv.ParamsImportModel;
import org.kaznalnrprograms.MCA.Abons.Models.GroupViewModel;
import org.kaznalnrprograms.MCA.Abons.Models.ResultModel;
import org.kaznalnrprograms.MCA.Abons.Models.Service.AbonsDtmfModel;
import org.kaznalnrprograms.MCA.Abons.Models.Service.InstallDtmfModel;
import org.kaznalnrprograms.MCA.Abons.Models.Service.PinsAbonModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class AbonsServiceController {
    private IAbonsService dService;

    public AbonsServiceController(IAbonsService dService){
        this.dService = dService;
    }


    /**
     * Получить частичное представление окна Сервис
     * @return
     */
    @GetMapping("/Abons/AbonsFormService")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public String AbonsFormService(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "Abons/AbonsFormService :: AbonsFormService";
    }


    /**
     * Получить частичное представление окна Добавление абонента для изменения флага dtmf
     * @return
     */
    @GetMapping("/Abons/AbonsFormServiceAddAbon")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public String AbonsFormServiceAddAbon(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "Abons/AbonsFormServiceAddAbon :: AbonsFormServiceAddAbon";
    }



    /**
     * Получить список групп
     * @return
     * @throws Exception
     */
    @PostMapping("/AbonsService/getGroups")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody
    List<GroupViewModel> getGroups() throws Exception {
        return dService.getGroups();
    }


    /**
     * Получить список абонентов в группе
     * @param result
     * @return
     * @throws Exception
     */
    @PostMapping("AbonsService/getListAbonInGroup")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody
    List<AbonsDtmfModel> getListAbonInGroup(@RequestBody ResultModel result) throws Exception {

        return dService.getListAbonInGroup(result);
    }


    /**
     * Получить абонентов по ид
     * @param result
     * @return
     * @throws Exception
     */
    @PostMapping("AbonsService/getAbonById")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody
    String getAbonById(@RequestBody ResultModel result) throws Exception {

        return dService.getAbonById(result.getResult());
    }


    /**
     * Получить список контактов (phone) абонента
     * @param abonid
     * @return
     * @throws Exception
     */
    @PostMapping("AbonsService/getPinsAbon")
    @PreAuthorize("GetActRight('Abons','AbonGroupsView')")
    public @ResponseBody
    List<PinsAbonModel> getPinsAbon(@RequestBody ResultModel abonid) throws Exception {

        return dService.getPinsAbon(abonid);
    }



    /**
     * Установка / снятия флага dtmf
     * @return сообщение о результате выполнения
     * @throws Exception
     */
    @PostMapping("AbonsService/installDtmf")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public @ResponseBody
    String installDtmf(@RequestBody InstallDtmfModel installDtmf) throws Exception {

        return dService.installDtmf(installDtmf);
    }


}
