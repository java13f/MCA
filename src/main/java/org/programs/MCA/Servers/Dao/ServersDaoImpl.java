package org.kaznalnrprograms.MCA.Servers.Dao;

import org.kaznalnrprograms.MCA.Servers.Interfaces.IServersDao;
import org.kaznalnrprograms.MCA.Servers.Models.ServersModel;
import org.kaznalnrprograms.MCA.Servers.Models.ServersRightsModel;
import org.kaznalnrprograms.MCA.Servers.Models.ServersServerTypesModel;
import org.kaznalnrprograms.MCA.Servers.Models.ServersViewModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class ServersDaoImpl implements IServersDao {
    private String appName = "Servers - справочник \"Сервера\"";
    private DBUtils db;

    public ServersDaoImpl(DBUtils db) {
        this.db = db;
    }

    /*
    Получение списка записей
     */
    @Override
    public List<ServersViewModel> getList(boolean showDel) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT ser.id, st.name serverType, ser.code, ser.port, CASE WHEN is_ssl = 1 THEN 'Да' ELSE 'Нет' END is_ssl, ser.name, ser.call_name, ser.call_phone, ser.line_all, ser.line_cur, ser.del " +
                    "FROM servers ser " +
                    "JOIN server_types st ON st.id = ser.srv_type_id ";
            if (!showDel) sql += " WHERE ser.del = 0";
            List<ServersViewModel> list = db.Query(con, sql, ServersViewModel.class, null);
            return list;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*
    Получение прав для модуля
     */
    @Override
    public ServersRightsModel getRights() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT get_act_rights('Servers', 'ServersView')   serversView," +
                    "            get_act_rights('Servers', 'ServersChange') serversChange," +
                    "            get_act_rights('Servers', 'ServersDel')    serversDel";
            return db.Query(con, sql, ServersRightsModel.class, null).get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*
    Проверка уникальности по полям "тип сервера" и "адрес"
     */
    @Override
    public int checkTypeCode(String id, String code, String srv_type_id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String idState = "";
            if (id.equals("")) {
                idState = "";
            } else {
                params.put("id", UUID.fromString(id));
                idState = " AND id <> :id ";
            }
            params.put("code", code);
            params.put("srv_type_id", UUID.fromString(srv_type_id));
            String sql = "SELECT COUNT(*) FROM servers " +
                    "WHERE 1 = 1 " + idState +
                    "AND code = :code " +
                    "AND srv_type_id = :srv_type_id";
            List<Integer> list = db.Query(con, sql, Integer.class, params);
            if (list != null) {
                return list.get(0);
            } else {
                throw new Exception("Не удалось получить запись");
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*
    Проверка уникальности по полям "тип сервера" и "наименование"
     */
    @Override
    public int checkTypeName(String id, String name, String srv_type_id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String idState = "";
            if (id.equals("")) {
                idState = "";
            } else {
                params.put("id", UUID.fromString(id));
                idState = " AND id <> :id ";
            }
            params.put("name", name);
            params.put("srv_type_id", UUID.fromString(srv_type_id));
            String sql = "SELECT COUNT (*) FROM servers " +
                    "WHERE 1 = 1 " + idState +
                    "AND name = :name " +
                    "AND srv_type_id = :srv_type_id";
            List<Integer> list = db.Query(con, sql, Integer.class, params);
            if (list != null) {
                return list.get(0);
            } else {
                throw new Exception("Не удалось получить запись");
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*
    Получение списка типа серверов
     */
    @Override
    public List<ServersServerTypesModel> getServerTypes() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, code, name FROM server_types WHERE del = 0 ORDER BY code";
            List<ServersServerTypesModel> list = db.Query(con, sql, ServersServerTypesModel.class, null);
            return list;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*
    Получение записи по идентификатору
     */
    @Override
    public ServersModel get(String id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT id, code, name, port, srv_type_id, " +
                    "line_all, line_cur, " +
                    "call_name, call_phone, call_pwd, " +
                    "proxy_adr, proxy_port, proxy_pwd, " +
                    "creator, created, changer, changed " +
                    "FROM servers " +
                    "WHERE id = :id";
            List<ServersModel> result = db.Query(con, sql, ServersModel.class, params);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить запись!");
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*
    Сохранение записи
     */
    @Override
    public String save(ServersModel model) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("code", model.getCode());
            params.put("name", model.getName());
            params.put("port", model.getPort());
            params.put("srv_type_id", UUID.fromString(model.getSrv_type_id()));
            params.put("is_ssl", model.getIs_ssl());
            params.put("line_all", model.getLine_all());
            params.put("call_name", model.getCall_name().equals("") ? null : model.getCall_name());
            params.put("call_phone", model.getCall_phone());
            params.put("call_pwd", model.getCall_pwd());
            params.put("proxy_adr", model.getProxy_adr().equals("") ? null : model.getProxy_adr());
            params.put("proxy_port", model.getProxy_port().equals("") ? null : model.getProxy_port());
            params.put("proxy_pwd", model.getProxy_pwd().equals("") ? null : model.getProxy_pwd());

            String sql = "";

            if (model.getId().length() == 0) {
                sql = "INSERT INTO servers (code, name, port, srv_type_id, is_ssl, line_all, line_cur, call_name, call_phone, call_pwd, proxy_adr, proxy_port, proxy_pwd, del) " +
                        "VALUES (:code, :name, :port, :srv_type_id, :is_ssl, :line_all, 0, :call_name, :call_phone, :call_pwd, :proxy_adr, :proxy_port, :proxy_pwd, 0)";
                model.setId(db.Execute(con, sql, String.class, params));
            } else {
                params.put("id", UUID.fromString(model.getId()));
                db.CheckLock(con, -1, model.getId(), "servers");
                sql = "UPDATE servers SET " +
                        "code = :code, " +
                        "name = :name, " +
                        "port = :port, " +
                        "srv_type_id = :srv_type_id, " +
                        "is_ssl = :is_ssl, " +
                        "line_all = :line_all, " +
                        "call_name = :call_name, " +
                        "call_phone = :call_phone, " +
                        "call_pwd = :call_pwd, " +
                        "proxy_adr = :proxy_adr, " +
                        "proxy_port = :proxy_port, " +
                        "proxy_pwd = :proxy_pwd " +
                        "WHERE id = :id";
                db.Execute(con, sql, params);
            }
            return model.getId();
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*
    Удаление записи
     */
    @Override
    public void delete(String id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(id));
            String sql = "UPDATE servers SET del = 1 - del WHERE id = :id";
            db.Execute(con, sql, params);
        } catch (Exception ex) {
            throw ex;
        }
    }
}

