package org.kaznalnrprograms.MCA.Switchs.Controllers;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.kaznalnrprograms.MCA.Switchs.Interfaces.ISwitchsDirectoryDao;
import org.kaznalnrprograms.MCA.Switchs.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
public class SwitchsController {
    private ISwitchsDirectoryDao dSwitchs;
    public SwitchsController(ISwitchsDirectoryDao dSwitchs){
        this.dSwitchs = dSwitchs;
    }

    /**
     * Старт модуля
     * @return
     */
    @GetMapping("/Switchs/SwitchsStart")
    @PreAuthorize("GetActRight('Switchs','SwitchsView')")
    public String SwitchsStart(){ return "Switchs/SwitchsStart"; }

    /**
     *   Загрузка формы списка  SwitchsList.html
     */
    @GetMapping("/Switchs/Switchs")
    @PreAuthorize("GetActRight('Switchs','SwitchsView')")
    public String Switchs(@RequestParam(required = false, defaultValue = "") String prefix, Model model){
        model.addAttribute("prefix", prefix);
        return "Switchs/SwitchsList::SwitchsList";
     }
    /**
    ** Загрузка данных для SwitchsList
    **/
    @PostMapping("/Switchs/list")
    @PreAuthorize("GetActRight('Switchs','SwitchsView')")
    public @ResponseBody List<SwitchsViewModel> list(@RequestBody ShowDelMOdel showDel) throws Exception {
        return dSwitchs.list(showDel.isShowDel());
    }

    /**
     * Загрузка формы для редактирования коммутации
     * @return
     */
    @GetMapping("/Switchs/SwitchsFormEdit")
    @PreAuthorize("GetActRight('Switchs','SwitchsView')")
    public String SwitchsFormList(){
        return "Switchs/SwitchsForm::SwitchsForm";
    }

    @PostMapping("/Switchs/get")
    public  @ResponseBody SwitchsModel get(@RequestBody SwitchsAuxiliaryModel id) throws Exception{
        return dSwitchs.get(id);
    }

    @PostMapping("/Switchs/getCode")
    @PreAuthorize("GetActRight('Switchs','SwitchsView')")
    public  @ResponseBody List<SwitchsCodeModel> getCode() throws Exception{
        return dSwitchs.getCode();
    }

    /*

     * Добавить/Изменить проблему
     * @param prob
     * @return
     * @throws Exception

        @PostMapping("/Problems/save")
        @PreAuthorize("GetActRight('Problems.dll','ProblemsChange')")
        public @ResponseBody int save(@RequestBody ProblemsModel prob) throws Exception{
            return dProb.save(prob);
        }
     */
    @PostMapping("/Switchs/save")
    @PreAuthorize("GetActRight('Switchs','SwitchsChange')")
    public @ResponseBody UUID save(@RequestBody SwitchsModel swt) throws Exception{
        return  dSwitchs.save(swt);
    }


}
