package org.kaznalnrprograms.MCA.Admin.Interfaces;

import org.kaznalnrprograms.MCA.Admin.Models.ActModel;
import org.kaznalnrprograms.MCA.Admin.Models.ActViewModel;

import java.util.List;

public interface IAdminActsDao {
    /**
     * Получить список действий
     * @param appId - идентификатор приложения
     * @param code - код действия
     * @param name - наименование действия
     */
    List<ActViewModel> List(String appId, String code, String name) throws Exception;

    /**
     * Получить действие
     * @param id - идентификатор действия
     */
    ActModel Get(String id) throws Exception;

    /**
     * Проверить существование действия в базе данных
     * @param id - идентификатор действия (для новых -1)
     * @param code - код действия
     */
    boolean Exists(String id, String code) throws Exception;

    /**
     * Добавить/Изменить действие
     * @param act - модель действия
     */
    String Save(ActModel act) throws Exception;

    /**
     * Удалить действие
     * @param id - идентификатор действия
     */
    String Delete(String id) throws Exception;

    /**
     * Получить данные выбранного действия
     * @param id - Идентифиатор действия
     */
    String GetActSel(String id) throws Exception;
}
