package org.kaznalnrprograms.MCA.Abons.Interfaces;

import org.kaznalnrprograms.MCA.Abons.Models.*;

import java.util.List;

public interface IAbons {

    /**
     * Проверка прав
     * @return
     * @throws Exception
     */
    AbonsRightModel GetActRights() throws Exception;

    /**
     * Получить количество записей таблицы абонентов(abons)
     * @param filter
     * @return
     * @throws Exception
     */
    int getTotalAbons(FilterModel filter) throws Exception;


    /**
     * Получить список абонентов для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    List<AbonViewModel> listAbon(FilterModel filter) throws Exception;


    /**
     * Получить список групп для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    List<GroupViewModel> listGroup(FilterModel filter) throws Exception;


    /**
     * Получить список абоненвто в группе для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    List<AbonsInGroupViewModel> listAbonsInGroup(FilterModel filter) throws Exception;



    /**
     * Удаление группы
     * @param id - идентификатор
     * @throws Exception
     */
    void deleteGroup(String id) throws Exception;

    /**
     * Удаление абонента
     * @param id - идентификатор
     * @throws Exception
     */
    void deleteAbon(String id) throws Exception;


    /**
     * Проверить существование абонента в группе
     * @param abonId
     * @param groupId
     * @return
     * @throws Exception
     */
    boolean existsAbonInGroup(String abonId, String groupId) throws Exception;

    /**
     * Добавление абонента в группу
     * @param abonId
     * @param groupId
     * @return
     * @throws Exception
     */
    String addAbonToGroup(String abonId, String groupId) throws Exception;


    /**
     * Удаление абонента из группы
     * @param abonId
     * @param groupId
     * @throws Exception
     */
    void deleteAbonFromGroup(String abonId, String groupId) throws Exception;


}
