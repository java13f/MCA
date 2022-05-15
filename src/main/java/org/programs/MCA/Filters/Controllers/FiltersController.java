package org.kaznalnrprograms.MCA.Filters.Controllers;

import org.kaznalnrprograms.MCA.Filters.Interfaces.IFiltersDao;
import org.kaznalnrprograms.MCA.Filters.Models.FilterParamModel;
import org.kaznalnrprograms.MCA.Filters.Models.GetFilterModel;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
public class FiltersController {
    private IFiltersDao dFilters;
    public FiltersController(IFiltersDao dFilters){
        this.dFilters = dFilters;
    }
    /**
     * Получить значения фильтра
     * @param model модель получения фильтра
     * @return
     * @throws Exception
     */
    @PostMapping("/Filters/GetValues")
    public @ResponseBody List<FilterParamModel> GetValues(@RequestBody GetFilterModel model) throws Exception{
        return dFilters.GetValues(model.getCode());
    }

    /**
     * Сохранение настроек фильтра
     * @param values значения параметров фильтра, которые необходимо создать или изменить
     * @throws Exception
     */
    @PostMapping("/Filters/SetValues")
    public @ResponseBody String SetValues(@RequestBody List<FilterParamModel> values) throws Exception {
        if(values.size() != 0){
            String code = values.get(0).getCode();
            dFilters.SetValues(code, values);
        }
        return "";
    }

    /**
     * Уудалить фильтр
     * @param code код фильтра
     * @throws Exception
     */
    @PostMapping("/Filters/DeleteFilter")
    public @ResponseBody String DeleteFilter(@RequestBody String code) throws Exception{
        dFilters.DeleteFilter(code);
        return "";
    }

    /**
     * Удаление параметров фильтра
     * @param params параметры фильтра
     * @throws Exception
     */
    @PostMapping("/Filters/DeleteParamsInFilter")
    public @ResponseBody String DeleteParamsInFilter(@RequestBody List<FilterParamModel> params) throws Exception {
        if(params.size() != 0){
            String code = params.get(0).getCode();
            List<String> keys = new ArrayList<>();

            for (FilterParamModel param : params){
                keys.add(param.getParamCode());
            }
            dFilters.DeleteParamsInFilter(code, keys);
        }
        return "";
    }
}
