package org.kaznalnrprograms.MCA.LogMain.Interfaces;

import org.kaznalnrprograms.MCA.LogMain.Models.UserModel;
import org.kaznalnrprograms.MCA.LogMain.Models.FilterModel;
import org.kaznalnrprograms.MCA.LogMain.Models.LogMainModel;
import org.kaznalnrprograms.MCA.LogMain.Models.LogMainViewModel;

import java.util.List;

public interface ILogMainDao {
    /**
     * Получение данных из таблицы TransLog.
     * @param filter - модель mFilter
     * @return
     * @throws Exception
     */
    List<LogMainViewModel> list(FilterModel filter) throws Exception;

    /**
     * Получить список пользователей из таблицы Translog
     * @param date - дата запроса
     * @return
     * @throws Exception
     */
    List<UserModel> getUsers(String date) throws Exception;

    /**
     * Получить имя пользователя под которым вошли в систему
     * @return
     * @throws Exception
     */
    String getActiveUser() throws Exception;

    /**
     * Получить количество записей в таблице translog
     * @param filter
     * @return
     * @throws Exception
     */
    int getTotalLogs(FilterModel filter) throws Exception;


    /**
     * Функция получения лога для просмотра
     * @param id - идентификатор таблицы Translog
     * @return
     * @throws Exception
     */
    LogMainModel get(String id) throws Exception;

}
