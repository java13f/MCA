package org.kaznalnrprograms.MCA.Admin.Interfaces;

import org.kaznalnrprograms.MCA.Admin.Models.*;

import java.util.List;
import java.util.UUID;

public interface IAdminGroupsDao {
    /**
     * Получить список групп
     * @param filter - Фильтр по коду и наименовании группы
     * @param UserId - Фильтр по пользователю
     * @param AppId - Фильтр по приложению
     * @param ActId - Фильтр по действию
     */
    List<GroupViewModel> getGroupsList(String filter, String UserId, String AppId, String ActId) throws Exception;
    /**
     * Получить группу
     * @param GroupId - идентификатор группы
     */
    GroupModel GetGroup(UUID GroupId) throws Exception;

    /**
     * Проверить существование группы
     * @param id - идентификатор группы (для новых -1)
     * @param code - код группы
     */
    boolean ExistsGroup(String id, String code) throws Exception;

    /**
     * Сохранение группы в базе данных
     * @param group - группа
     */
    String Save(GroupModel group) throws Exception;

    /**
     * Удаление группы
     * @param id - идентификатор группы
     */
    String Delete(UUID id) throws Exception;

    /**
     * Функция возвращает пользователей группы
     * @param GroupId - идентификатор группы пользователей
     */
    List<UserGroupsViewModel> UserList(String GroupId) throws Exception;

    /**
     * Получение строки представления группы для форме редактирования
     * @param id - идентификатор группы
     */
    String getGroupSel(String id) throws Exception;

    /**
     * Получить привязку пользователя к группе
     * @param id - идентификатор привязки
     */
    UserGroupsModel getUserBinding(String id) throws Exception;

    /**
     * Проверка существования пользователя в группе
     * @param Id - идентификатор привязки (для новых -1)
     * @param GroupId - идентификатор группы контроля
     * @param UserId - идентификатор пользователя
     */
    boolean ExistsUserInGroup(String Id,  String GroupId, String UserId) throws Exception;

    /**
     * Добавить/Изменить привзяку пользователя к группе
     * @param model - модуль привязки пользователя к группе
     */
    String SaveUserInGroup(UserGroupsModel model) throws Exception;

    /**
     * Удаление пользователя из группы
     * @param id - идентификатор привязки пользователя к группе
     */
    void DeleteUserFromGroup(String id) throws Exception;

    /**
     * Получить список приложений, входящих в группу
     * @param GroupId - идентификатор группы
     */
    List<AppRightViewModel> GetAppRightsList(String GroupId) throws Exception;

    /**
     * Получить привязку приложения к группе
     * @param id - идентификатор привязки
     */
    AppRightsModel GetAppRights(String id) throws Exception;

    /**
     * Проверить существование приложения в группе
     * @param id - идентификатор привязки приложения к группе (для новых -1)
     * @param groupId - идентификатор группы
     * @param appId - тдентификатор приложения
     */
    boolean ExistsAppInGroup(String id, String groupId, String appId) throws Exception;

    /**
     * Добавить/Изменить привязку приложения к группе
     * @param model - модель привязки приложения к группе
     */
    String SaveAppRights(AppRightsModel model) throws Exception;

    /**
     * Удаление приложения из группы
     * @param id - идентификатор привязки приложения к группе
     */
    void DeleteAppFromGroup(String id) throws Exception;

    /**
     * Получить список действий группы
     * @param GroupId - идентификатор группы
     */
    List<ActGroupsViewModel> GetActGroupsList(String GroupId) throws Exception;

    /**
     * Получиьт привязку действия к группе
     * @param id - идентификатор привязки действия к группе
     */
    ActGroupsModel GetActGroup(String id) throws Exception;

    /**
     * Проверить существования привязки действия к группе
     * @param id - идентификатор действия (для новых -1)
     * @param groupId - идентификатор группы
     * @param actId - идентификатор действия
     */
    boolean ExistsActInGroup(String id, String groupId, String actId) throws Exception;

    /**
     * Добавить/Изменить привязку действия к группе
     * @param model - модель привязки действия к группе
     */
    String SaveActGroups(ActGroupsModel model) throws Exception;

    /**
     * Удалить действие из группы
     * @param id - идентификатор привязки действия к группе
     */
    void DeleteActFromGroup(String id) throws Exception;
}
