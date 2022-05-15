package org.kaznalnrprograms.MCA.MainApp.Controllers;

import org.kaznalnrprograms.MCA.MainApp.Interfaces.IMainAppDao;
import org.kaznalnrprograms.MCA.MainApp.Models.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class MainAppController {
    private IMainAppDao dMainApp;
    public MainAppController(IMainAppDao dMainApp){
        this.dMainApp = dMainApp;
    }
    @GetMapping("/MainApp/MainApp")
    public String MainApp(HttpServletResponse response){
        return "MainApp/MainApp";
    }
    @GetMapping("/MainApp/showOneNews")
    public String showOneNews(String id, Model model) throws Exception{
        var news = dMainApp.getOneNews(id);
        model.addAttribute("content", news.getContent());
        model.addAttribute("title", news.getDate().split(" ")[0] + " " + news.getTitle());
        return "MainApp/ShowOneNewsForm";
    }

    /**
     * Пполучаем список приложений для категории
     * @param apps список всех приложений, на которые есть права
     * @param categoryId идентификатор категории
     * @return
     */
    private List<MenuItemModel> getMenuItems(List<AppModel> apps, String categoryId){
        List<AppModel> app_children = apps.stream().filter(app->app.getParent_id().equals(categoryId)).collect(Collectors.toList());
        List<MenuItemModel> children = new ArrayList<>();
        for(AppModel app : app_children){
            MenuItemModel item = new MenuItemModel();
            item.setId("smMainMenu_MainUI_"+app.getCode());
            item.setUrl(app.getUrl());
            item.setText(app.getName());
            item.setIconCls(app.getIconCls());
            children.add(item);
        }
        return children;
    }

    /**
     * Получить данные главного меню
     * @return
     * @throws Exception
     */
    @GetMapping("/MainApp/getApps")
    public @ResponseBody List<MenuCategoryModel> getApps() throws Exception{
        List<AppModel> apps =  dMainApp.getApps();
        List<AppModel> root_apps = apps.stream().filter(app->app.getParent_id().isEmpty()).collect(Collectors.toList());
        List<MenuCategoryModel> categoryes = new ArrayList<>();
        for(AppModel app : root_apps){
            MenuCategoryModel category = new MenuCategoryModel();
            category.setText(app.getName());
            category.setState("open");
            category.setIconCls(app.getIconCls());
            category.setChildren(getMenuItems(apps, app.getId()));
            categoryes.add(category);
        }
        return categoryes;
    }

    /**
     * Получить новости
     * @param rows количество новостей на странице
     * @param page
     * @return
     */
    @GetMapping("/MainApp/getNews")
    public @ResponseBody DataTable getNews(int rows, int page) throws Exception {
        int totalCountNews = dMainApp.getNewsTotal();
        var news = dMainApp.getNews(rows, page, totalCountNews);
        var table = new DataTable();
        table.setTotal(totalCountNews);
        var rows_objs = new ArrayList<>();
        for(var n : news){
            rows_objs.add(n);
        }
        table.setRows(rows_objs);
        return table;
    }

    @GetMapping("/")
    public String Index(){
        return "redirect:/MainApp/MainApp";
    }
}
