package org.kaznalnrprograms.MCA.INews.Controllers;
import org.kaznalnrprograms.MCA.INews.Interfaces.INewsDao;
import org.kaznalnrprograms.MCA.INews.Models.DataTable;
import org.kaznalnrprograms.MCA.INews.Models.NewsFilterModel;
import org.kaznalnrprograms.MCA.INews.Models.NewsModel;
import org.kaznalnrprograms.MCA.INews.Models.NewsViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class INewsController {
    private INewsDao dNews;
    public INewsController(INewsDao dNews){
        this.dNews = dNews;
    }
    @GetMapping("/INews/INewsStart")
    @PreAuthorize("GetActRight('INews','INewsView')")
    public String INews(){
        return "INews/INewsStart";
    }
    @GetMapping("/INews/INewsFormList")
    @PreAuthorize("GetActRight('INews','INewsView')")
    public String INewsFormList(){
        return "INews/INewsFormList :: INewsFormList";
    }
    @GetMapping("/INews/INewsFormEdit")
    @PreAuthorize("GetActRight('INews','INewsChange')")
    public String INewsFormEdit(){
        return "INews/INewsFormEdit :: INewsFormEdit";
    }
    @GetMapping("/INews/INewsFilterForm")
    @PreAuthorize("GetActRight('INews','INewsView')")
    public String INewsFilterForm(){
        return "INews/INewsFilterForm :: INewsFilterForm";
    }
    /**
     * Получить список новостей
     * @param filter настройки фильтра
     * @return
     * @throws Exception
     */
    @PostMapping("/INews/getList")
    @PreAuthorize("GetActRight('INews','INewsView')")
    public @ResponseBody DataTable getList(@RequestBody NewsFilterModel filter) throws Exception {
        int totalCountNews = dNews.getTotalNews(filter);
        List<NewsViewModel> news = dNews.getList(filter);
        DataTable table = new DataTable();
        table.setTotal(totalCountNews);
        List<Object> rows = new ArrayList<>();
        for(var n : news){
            rows.add(n);
        }
        table.setRows(rows);
        return table;
    }
    /**
     * Получить новость для редаитрования
     * @param id иденификатор новости
     * @return
     * @throws Exception
     */
    @PostMapping("/INews/get")
    @PreAuthorize("GetActRight('INews','INewsView')")
    public @ResponseBody NewsModel get(String id) throws Exception {
        return dNews.get(id);
    }
    /**
     * Сохранение новости
     * @param model модель новости
     * @return
     * @throws Exception
     */
    @PostMapping("/INews/save")
    @PreAuthorize("GetActRight('INews','INewsChange')")
    public @ResponseBody String save(@RequestBody NewsModel model) throws Exception{
        return dNews.save(model);
    }
    /**
     * Удаление новости
     * @param id идентификатор новости
     * @return
     * @throws Exception
     */
    @PostMapping("/INews/delete")
    @PreAuthorize("GetActRight('INews','INewsChange')")
    public @ResponseBody String delete(String id) throws Exception{
        var news_obj = dNews.get(id);
        if(news_obj.getDel() == 0 && news_obj.getStatus() == 1){
            throw new Exception("Невозможно удалить новость. Новость с ID = " + id + " уже была опубликована.");
        }
        dNews.delete(id);
        return "";
    }
}
