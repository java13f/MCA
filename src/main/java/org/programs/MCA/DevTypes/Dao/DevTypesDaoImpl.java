package org.kaznalnrprograms.MCA.DevTypes.Dao;

import org.kaznalnrprograms.MCA.DevTypes.Interfaces.IDevTypes;
import org.kaznalnrprograms.MCA.DevTypes.Models.*;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;
import org.kaznalnrprograms.MCA.DevTypes.SmsClient.*;

import java.util.*;

@Repository
public class DevTypesDaoImpl implements IDevTypes
{
    private DBUtils dbUtils;
    private String appName = "Типы устройств";

    public DevTypesDaoImpl(DBUtils dbUtils) {
        this.dbUtils = dbUtils;
    }

    /**
     * Получить данные для грида
     * @param del
     * @return
     * @throws Exception
     */
    @Override
    public List<DevTypesView> GetList(Boolean del) throws Exception {
        try(Connection con = dbUtils.getConnection(appName)) {
            String sql = "SELECT id, code, name, prior, del, CASE WHEN is_auto_define = 0 THEN 'Нет' ELSE 'Да' END is_auto_define " +
                    "FROM dev_types";
            if(!del) {
                sql = "SELECT id, code, name, prior, del, CASE WHEN is_auto_define = 0 THEN 'Нет' ELSE 'Да' END is_auto_define " +
                        "FROM dev_types " +
                        "WHERE del = 0";
            }

            return dbUtils.Query(con, sql, DevTypesView.class, null);
    }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранить тип устройства
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public String Save(DevTypesSave model) throws Exception {
        try(Connection con = dbUtils.getConnectionWithTran(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("code", model.getCode());
            params.put("name", model.getName());
            params.put("prior", model.getPrior());
            params.put("is_auto_define", model.getIs_auto_define());

            String sql = "";
            if(model.getId().length() == 0){
                sql = "INSERT INTO dev_types (code, name, prior, is_auto_define, del)"
                        +" VALUES(:code, :name, :prior, :is_auto_define, 0)";
                model.setId(dbUtils.Execute(con, sql, String.class, params));
            }
            else {
                params.put("id", UUID.fromString(model.getId()));
                dbUtils.CheckLock(con, -1, model.getId(), "dev_types");
                sql = "UPDATE dev_types " +
                        "SET code = :code, name = :name, prior = :prior, is_auto_define = :is_auto_define " +
                        "WHERE id = :id";
                dbUtils.Execute(con, sql, params);
            }

            sql = "SELECT code, prior FROM dev_types";
            List<mDevType> dev_types_list = dbUtils.Query(con, sql, mDevType.class, null);
            mDevTypes dev = new mDevTypes();
            dev.setDevTypes((ArrayList<mDevType>) dev_types_list);
            SmsClient smsClient = new SmsClient();
            sql = "SELECT s.code " +
                    "FROM servers s JOIN server_types st ON s.srv_type_id = st.id " +
                    "WHERE st.code = 'SMS' AND s.del = 0";
            List<String> hosts = dbUtils.Query(con, sql, String.class, null);
            for (String host : hosts)
            {
                smsClient.setServerHost(host);
                if (!smsClient.setDevTypes(dev))
                {
                    throw new Exception("При сохранении данных на сервере " + host + " (см. Справочник серверов) произошла ошибка:" + smsClient.getLastError());
                }
            }

            con.commit();
            return model.getId();
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удалить тип устройства
     * @param model
     * @throws Exception
     */
    @Override
    public void Delete(Map<String, Object> model) throws Exception {
        try(var con = dbUtils.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "UPDATE dev_types SET del = 1 - del WHERE id = :id";
            dbUtils.Execute(con, sql, params);
        }
    }

    /**
     * Получить данные записи типа устройства
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public DevTypesSave GetDevType(Map<String, Object> model) throws Exception {
        try(Connection con = dbUtils.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "SELECT id, code, name, prior, is_auto_define, " +
                            "changer, creator, " +
                            "to_char(DATE_TRUNC('second', created), 'DD.MM.YYYY HH:MM:SS') created, " +
                            "to_char(DATE_TRUNC('second', changed), 'DD.MM.YYYY HH:MM:SS') changed " +
                            "FROM dev_types " +
                            "WHERE id = :id";
            List<DevTypesSave> result = dbUtils.Query(con, sql, DevTypesSave.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись с id = " + model.get("id").toString());
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить права на модуль для пользователя
     * @return
     * @throws Exception
     */
    @Override
    public RightsModel GetActRights () throws Exception {
        try(Connection con = dbUtils.getConnection(appName)) {
            String sql = "SELECT get_act_rights('DevTypes', 'DevTypesChange') devTypesChange, " +
                                "get_act_rights('DevTypes', 'DevTypesDel') devTypesDel";
            List<RightsModel> result = dbUtils.Query(con, sql, RightsModel.class, null);

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Получить заблокироанные записи
     * @return
     * @throws Exception
     */
    @Override
    public String GetLockRecords () throws Exception {
        try(Connection con = dbUtils.getConnection(appName)) {
            String sql = "SELECT string_agg('Запись \"' || dt.name || '\" редактируется пользователем ' || u.name, '. ') " +
                    "FROM locktable lt " +
                    "JOIN i_users u ON lt.i_user_id = u.id " +
                    "JOIN dev_types dt ON dt.id = lt.recuuid " +
                    "WHERE lt.objectid = getobject_id('dev_types')";
            List<String> result = dbUtils.Query(con, sql, String.class, null);

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }
}
