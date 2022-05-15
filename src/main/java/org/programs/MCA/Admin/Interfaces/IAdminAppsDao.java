package org.kaznalnrprograms.MCA.Admin.Interfaces;

import org.kaznalnrprograms.MCA.Admin.Models.AppModel;
import org.kaznalnrprograms.MCA.Admin.Models.AppViewModel;

import java.util.List;

public interface IAdminAppsDao {
    /**
     * Получить список приложений
     */
    List<AppViewModel> List() throws Exception;

    /**
     * Получить наименование приложения
     * @param id идентификатор приложения
     */
    String GetAppSel(String id) throws Exception;

    /**
     * Получить приложение
     * @param id - идентификатор приложения
     */
    AppModel Get(String id) throws Exception;

    /**
     * Проверить существование приложения
     * @param id - идентификатор приложения (для новых -1)
     * @param code - код приложения
     */
    boolean Exists(String id, String code) throws Exception;

    /**
     * Добавить/Изменить приложение
     * @param app - модель приложения
     */
    String Save(AppModel app) throws Exception;

    /**
     * Удалить приложение
     * @param id - идентификатор приложения
     */
    String Delete(String id) throws Exception;

    /**
     * Получить список категорий
     * @return
     * @throws Exception
     */
    List<AppViewModel> CategoryList() throws Exception;
}
