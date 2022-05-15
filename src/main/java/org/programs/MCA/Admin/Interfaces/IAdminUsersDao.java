package org.kaznalnrprograms.MCA.Admin.Interfaces;

import org.kaznalnrprograms.MCA.Admin.Models.UserModel;
import org.kaznalnrprograms.MCA.Admin.Models.UserViewModel;

import java.util.List;

public interface IAdminUsersDao {
    /**
     * Фнкция возвращает список пользователей
     * @param code фильтер по части логина пользователя
     * @param name фильтер по части наименования
     */
    List<UserViewModel> List(String code, String name) throws Exception;
    /**
     * Функция получения пользователя
     * @param id - идентификатор пользователя
     * @return
     * @throws Exception
     */
    UserModel GetUser(String id) throws Exception;
    /**
     * Проверка существования пользователя
     * @param id - идентификатор пользователя
     * @param Login - логин ползователя
     * @return
     * @throws Exception
     */
    boolean ExistsUser(String id, String Login) throws Exception;
    /**
     * Добавить/изменить пользователя
     * @param model - модуль пользователя
     * @return
     * @throws Exception
     */
    String Save(UserModel model) throws Exception;
    /**
     * Удаление пользователя
     * @param id - идентификатор пользователя
     * @return
     */
    String Delete(String id) throws Exception;
    /**
     * Получение строки представления пользователя для формы редактирования
     * @param id - идентификатор польбзователя
     */
    String getUserSel(String id) throws Exception;
}
