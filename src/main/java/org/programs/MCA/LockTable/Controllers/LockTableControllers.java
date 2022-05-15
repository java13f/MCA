package org.kaznalnrprograms.MCA.LockTable.Controllers;


import org.kaznalnrprograms.MCA.LockTable.Interfaces.ILockTableDao;
import org.kaznalnrprograms.MCA.LockTable.Models.FilterModel;
import org.kaznalnrprograms.MCA.LockTable.Models.LockDateModel;
import org.kaznalnrprograms.MCA.LockTable.Models.LockTableModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class LockTableControllers {
    private ILockTableDao dLockTable;

    public LockTableControllers(ILockTableDao dLockTable) {this.dLockTable = dLockTable;}

    @GetMapping("/LockTable/LockTableStart")
    @PreAuthorize("GetActRight('LockTable','LockTableView')")
    public String LockTableStart(){
        return "LockTable/LockTableStart";
    }
    @GetMapping("/LockTable/LockTableFormList")
    @PreAuthorize("GetActRight('LockTable','LockTableView')")
    public String LockTableFormList(){
                return "LockTable/LockTableFormList :: LockTableFormList";
    }
    /**
     * Получить список
     * @param filter - фильтр
     * @return
     */
    @PostMapping("/LockTable/list")
    @PreAuthorize("GetActRight('LockTable','LockTableView')")
    public @ResponseBody List<LockTableModel> list(@RequestBody FilterModel filter) throws Exception{
        return dLockTable.list(filter.getFilter());
    }

    /**
     * получние время блокировки записи
     * @param id - идентификатор территории
     * @return
     * @throws Exception
     */
    @PostMapping("/LockTable/getDate")
    @PreAuthorize("GetActRight('LockTable','LockTableView')")
    public @ResponseBody LockDateModel getDate(String id) throws Exception {
        return dLockTable.getDate(id);
    }
    @PostMapping("/LockTable/unlock")
    @PreAuthorize("GetActRight('LockTable','LockTableChange')")
    public @ResponseBody String unlock(String id) throws Exception{
        dLockTable.unlock(id);
        return "";
    }
}
