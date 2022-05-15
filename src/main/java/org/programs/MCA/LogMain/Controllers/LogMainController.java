package org.kaznalnrprograms.MCA.LogMain.Controllers;

import org.kaznalnrprograms.MCA.LogMain.Models.UserModel;
import org.kaznalnrprograms.MCA.LogMain.Interfaces.ILogMainDao;
import org.kaznalnrprograms.MCA.LogMain.Models.DataTable;
import org.kaznalnrprograms.MCA.LogMain.Models.FilterModel;
import org.kaznalnrprograms.MCA.LogMain.Models.LogMainModel;
import org.kaznalnrprograms.MCA.LogMain.Models.LogMainViewModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class LogMainController {
    private ILogMainDao dLogMain;

    public LogMainController(ILogMainDao dLogMain) {
        this.dLogMain = dLogMain;
    }

    @GetMapping("/LogMain/LogMainStart")
    @PreAuthorize("GetActRight('LogMain','LogMainView')")
    public String LogMainStart(){
        return "LogMain/LogMainStart";
    }
    /**
     * Получить частичное представление основного окна просмотра протокола
     * @return
     */
    @GetMapping("/LogMain/LogMainFormList")
    @PreAuthorize("GetActRight('LogMain','LogMainView')")
    public String LogMainFormList( ) {
        return "LogMain/LogMainFormList :: LogMainFormList";
    }


    /**
     * Получить частичное представление окна просмотра записи
     * @return
     */
    @GetMapping("/LogMain/LogMainFormEdit")
    @PreAuthorize("GetActRight('LogMain', 'LogMainView')")
    public String LogMainFormEdit(){
        return "LogMain/LogMainFormEdit :: LogMainFormEdit";
    }

    /**
     * Получение данных из таблицы TransLog по фильтру.
     * @param filter настройки фильтра
     * @return
     * @throws Exception
     */
    @PostMapping("/LogMain/list")
    @PreAuthorize("GetActRight('LogMain', 'LogMainView')")
    public @ResponseBody DataTable list(@RequestBody FilterModel filter) throws Exception {

        int totalCountClients = dLogMain.getTotalLogs(filter);
        List<LogMainViewModel> logs = dLogMain.list(filter);

        DataTable table = new DataTable();
        table.setTotal(totalCountClients);
        List<Object> rowsObjs = new ArrayList<>();
        for(LogMainViewModel log : logs){
            rowsObjs.add(log);
        }
        table.setRows(rowsObjs);
        return table;
    }

    /**
     * Получить список пользователей из таблицы Translog
     *
     * @param date - дата
     * @return
     * @throws Exception
     */
    @PostMapping("/LogMain/getUsers")
    @PreAuthorize("GetActRight('LogMain','LogMainView')")
    public @ResponseBody List<UserModel> getUsers(String date) throws Exception {

        return dLogMain.getUsers(date);
    }

    /**
     * Получить имя пользователя под которым вошли в систему
     * @return
     * @throws Exception
     */
    @PostMapping("/LogMain/getActiveUser")
    @PreAuthorize("GetActRight('LogMain','LogMainView')")
    public @ResponseBody String getActiveUser() throws Exception {
        return dLogMain.getActiveUser();
    }



    /**
     * Функция получения лога для просмотра
     * @param id - идентификатор из таблицы Translog
     * @return
     * @throws Exception
     */
    @PostMapping("/LogMain/get")
    @PreAuthorize("GetActRight('LogMain','LogMainView')")
    public @ResponseBody LogMainModel get(String id) throws Exception {
        return dLogMain.get(id);
    }



}




