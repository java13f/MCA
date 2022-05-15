package org.kaznalnrprograms.MCA.LockService.Controllers;

import org.kaznalnrprograms.MCA.LockService.Interfaces.ILockServiceDao;
import org.kaznalnrprograms.MCA.LockService.Models.LockObjectModel;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class LockServiceController {
    private ILockServiceDao dLockService;

    public LockServiceController(ILockServiceDao dLockService) {
        this.dLockService = dLockService;
    }
    /**
     * Проверить сосояние блокировки записи
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @param uuid - уникальный идентификатор записи
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    @GetMapping("/LockService/StateLockRecord")
    public @ResponseBody String StateLockRecord(String table, Integer recId, @RequestParam(required = false, defaultValue = "") String uuid) throws Exception {
        return dLockService.StateLockRecord(table, recId, uuid);
    }
    /**
     * Накладывает блокировку на запись
     * @param model - модель объекта блокировки
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    @PostMapping(value = "/LockService/LockRecord")
    public @ResponseBody String LockRecord(@RequestBody LockObjectModel model) throws Exception{
        return dLockService.LockRecord(model.getTable(), model.getRecId(), model.getUuid());
    }

    /**
     * Обновляет блокировку на записи
     * @param model - модель объекта блокировки
     */
    @PostMapping("/LockService/UpdateLock")
    public @ResponseBody String UpdateLock(@RequestBody LockObjectModel model) throws Exception{
        dLockService.UpdateLock(model.getTable(), model.getRecId(), model.getUuid());
        return "";
    }
    /**
     * Удаляет блокировку
     * @param model - модель объекта блокировки
     */
    @PostMapping("/LockService/FreeLockRecord")
    public @ResponseBody String FreeLockRecord(@RequestBody LockObjectModel model) throws Exception{
        dLockService.FreeLockRecord(model.getTable(), model.getRecId(), model.getUuid());
        return "";
    }
}
