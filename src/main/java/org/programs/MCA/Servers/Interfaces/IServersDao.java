package org.kaznalnrprograms.MCA.Servers.Interfaces;

import org.kaznalnrprograms.MCA.Servers.Models.ServersModel;
import org.kaznalnrprograms.MCA.Servers.Models.ServersRightsModel;
import org.kaznalnrprograms.MCA.Servers.Models.ServersServerTypesModel;
import org.kaznalnrprograms.MCA.Servers.Models.ServersViewModel;

import java.util.List;

public interface IServersDao {
    /*
    Получение списка записей
     */
    List<ServersViewModel> getList(boolean showDel) throws Exception;

    /*
    Получение прав для модуля
     */
    ServersRightsModel getRights() throws Exception;

    /*
    Проверка уникальности по полям "тип сервера" и "адрес"
     */
    int checkTypeCode(String id, String code, String srv_type_id) throws Exception;

    /*
    Проверка уникальности по полям "тип сервера" и "наименование"
     */
    int checkTypeName(String id, String name, String srv_type_id) throws Exception;

    /*
    Получение списка типа серверов
     */
    List<ServersServerTypesModel> getServerTypes() throws Exception;

    /*
    Получение записи по идентификатору
     */
    ServersModel get(String id) throws Exception;

    /*
    Сохранение записи
     */
    String save(ServersModel model) throws Exception;

    /*
    Удаление записи
     */
    void delete(String id) throws Exception;
}




