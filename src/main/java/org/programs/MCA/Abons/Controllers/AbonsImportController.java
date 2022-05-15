package org.kaznalnrprograms.MCA.Abons.Controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.kaznalnrprograms.MCA.Abons.Interfaces.IAbonsImport;
import org.kaznalnrprograms.MCA.Abons.Models.Csv.ParamsImportModel;
import org.kaznalnrprograms.MCA.Abons.Models.ResultModel;
import org.kaznalnrprograms.MCA.Abons.Models.Csv.AbonModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@Controller
public class AbonsImportController {
    private IAbonsImport dImport;

    public AbonsImportController(IAbonsImport dImport){
        this.dImport = dImport;
    }

    /**
     * Получить частичное представление окна Импорта абонентов
     * @return
     */
    @GetMapping("/Abons/AbonsFormImport")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public String AbonsFormImport(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "Abons/AbonsFormImport :: AbonsFormImport";
    }


    /**
     * Получить частичное представление окна Процесса загрузки данных из файла
     * @return
     */
    @GetMapping("/Abons/AbonsFormDownloadFile")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public String AbonsFormDownloadFile(@RequestParam(required = false, defaultValue = "") String prefix, Model model ) {
        model.addAttribute("prefix", prefix);
        return "Abons/AbonsFormDownloadFile :: AbonsFormDownloadFile";
    }


    /**
     * Получение списока абонентов из csv файла
     * @param result - строка с абонентами
     * @return
     * @throws Exception
     */
    @PostMapping("Abons/readerResult")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public @ResponseBody
    List<AbonModel> readerResult(@RequestBody ResultModel result) throws Exception {

        return dImport.getAbonsFromFile(result);
    }



    /**
     * Загрузка данных абонента в базу данных
     * @return сообщение о результате выполнения
     * @throws Exception
     */
    @PostMapping("AbonsImport/saveAbon")
    @PreAuthorize("GetActRight('Abons','AbonChange')")
    public @ResponseBody
    String saveAbon(@RequestBody Map<String, Object> map) throws Exception {

        ObjectMapper m = new ObjectMapper();

        AbonModel abon = (AbonModel) m.convertValue(map.get("abon"), AbonModel.class);
        ParamsImportModel paramsImport = (ParamsImportModel) m.convertValue(map.get("paramsImport"), ParamsImportModel.class);

        String x = dImport.saveAbon(abon, paramsImport);

        return x;
    }




}
