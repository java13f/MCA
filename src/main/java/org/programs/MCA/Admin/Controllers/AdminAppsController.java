package org.kaznalnrprograms.MCA.Admin.Controllers;

import org.kaznalnrprograms.MCA.Admin.Interfaces.IAdminAppsDao;
import org.kaznalnrprograms.MCA.Admin.Models.AppModel;
import org.kaznalnrprograms.MCA.Admin.Models.AppViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class AdminAppsController {
    private IAdminAppsDao dAdminApps;
    public AdminAppsController(IAdminAppsDao dAdminApps){
        this.dAdminApps = dAdminApps;
    }
    @GetMapping("/AdminApps/AppEditForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String AppEditForm(){
        return "Admin/AppEditForm :: AppEditForm";
    }
    @GetMapping("/AdminApps/CategoryFormSelect")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String CategoryFormSelect(){
        return "Admin/Directories/CategoryFormSelect :: CategoryFormSelect";
    }
    @GetMapping("/AdminApps/AppFormSelect")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String AppFormSelect(){
        return "Admin/Directories/AppFormSelect :: AppFormSelect";
    }
    /**
     * Получить список приложений
     */
    @PostMapping("/AdminApps/List")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody List<AppViewModel> List() throws Exception {
        List<AppViewModel> apps =  dAdminApps.List();
        List<AppViewModel> categories = apps.stream().filter(app->app.getParent_id().isEmpty()).collect(Collectors.toList());
        for(AppViewModel category : categories){
            List<AppViewModel> children = apps.stream().filter(app->app.getParent_id().equals(category.getId())).collect(Collectors.toList());
            category.setChildren(children);
        }
        return categories;
    }

    /**
     * Получить наименование приложения
     * @param id идентификатор приложения
     */
    @PostMapping("/AdminApps/GetAppSel")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String GetAppSel(String id) throws Exception {
        return dAdminApps.GetAppSel(id);
    }

    /**
     * Получить приложение
     * @param id - идентификатор приложения
     */
    @PostMapping("/AdminApps/Get")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody AppModel Get(String id) throws Exception {
        return dAdminApps.Get(id);
    }

    /**
     * Проверить существование приложения
     * @param id - идентификатор приложения (для новых -1)
     * @param code - код приложения
     */
    @GetMapping("/AdminApps/Exists")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody boolean Exists(String id, String code) throws Exception {
        return dAdminApps.Exists(id, code);
    }

    /**
     * Добавить/Изменить приложение
     * @param app - модель приложения
     */
    @PostMapping("/AdminApps/Save")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String Save(@RequestBody AppModel app) throws Exception {
        return dAdminApps.Save(app);
    }

    /**
     * Удалить приложение
     * @param id - идентификатор приложения
     */
    @PostMapping("/AdminApps/Delete")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String Delete(String id) throws Exception {
        return dAdminApps.Delete(id);
    }
    /**
     * Получить список категорий
     * @return
     * @throws Exception
     */
    @PostMapping("/AdminApps/CategoryList")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody List<AppViewModel> CategoryList() throws Exception {
        return dAdminApps.CategoryList();
    }
}
