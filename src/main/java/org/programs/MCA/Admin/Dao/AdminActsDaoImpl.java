package org.kaznalnrprograms.MCA.Admin.Dao;

import org.kaznalnrprograms.MCA.Admin.Interfaces.IAdminActsDao;
import org.kaznalnrprograms.MCA.Admin.Models.ActModel;
import org.kaznalnrprograms.MCA.Admin.Models.ActViewModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;

@Repository
public class AdminActsDaoImpl implements IAdminActsDao {
    private String appName = "Admin - модуль администрирования";
    private DBUtils db;
    public AdminActsDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Получить список действий
     * @param appId - идентификатор приложения
     * @param code - код действия
     * @param name - наименование действия
     */
    @Override
    public List<ActViewModel> List(String appId, String code, String name) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            String fAppId = "";
            String fCode = "";
            String fName = "";
            Map<String, Object> params = new HashMap<>();
            if(!appId.isEmpty()){
                fAppId = " AND ac.i_app_id = :appId";
                params.put("appId", UUID.fromString(appId));
            }
            if(code != null && !code.isEmpty()){
                fCode = " AND ac.Code ILIKE '%' || :filterCode || '%' ";
                params.put("filterCode", code);
            }
            if(name != null && !name.isEmpty()){
                fName = " AND ac.Name ILIKE '%' || :filterName || '%' ";
                params.put("filterName", name);
            }
            sql = "SELECT ac.Id, ac.Code, ap.Name as AppName, ac.Name as actName, CASE WHEN ac.del = 1 THEN 'Да' ELSE 'Нет' END as del FROM i_acts ac, i_apps ap WHERE ac.i_app_id = ap.Id "
                    +fAppId +fCode +fName;
            return db.Query(con, sql, ActViewModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить действие
     * @param id - идентификатор действия
     */
    @Override
    public ActModel Get(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT id, code, i_app_id as appId, name, " +
                    " creator, created, changer, changed FROM i_acts WHERE Id = :id";
            List<ActModel> result = db.Query(con, sql, ActModel.class, params);
            if(result.size() == 0){
                throw new Exception("Не удалось получить действие с Id = " + id);
            }
            return result.get(0);
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование действия в базе данных
     * @param id - идентификатор действия (для новых -1)
     * @param code - код действия
     */
    @Override
    public boolean Exists(String id, String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("code", code);
            String sql = "SELECT COUNT(*) as cnt FROM i_acts WHERE Code = :code";
            if(!id.isEmpty()){
                sql+=" AND id <> :id";
                params.put("id", UUID.fromString(id));
            }
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/Изменить действие
     * @param act - модель действия
     */
    @Override
    public String Save(ActModel act) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("code", act.getCode());
            params.put("name", act.getName());
            params.put("AppId", UUID.fromString(act.getAppId()));
            if(act.getId().isEmpty()){
                sql = "INSERT INTO i_acts (id, i_app_id, Code, Name, del) VALUES (uuid_generate_v4(), :AppId, :code, :name, 0)";
                act.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                db.CheckLock(con, -1, act.getId(), "i_acts");
                params.put("id", UUID.fromString(act.getId()));
                sql = "UPDATE i_acts SET i_app_id = :AppId, Code = :code, Name = :name WHERE Id = :id";
                db.Execute(con, sql, params);
            }
            return act.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удалить действие
     * @param id - идентификатор действия
     */
    @Override
    public String Delete(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT COUNT(*) as cnt FROM i_acts_groups WHERE i_act_id = :id AND del = 0";
            int count = db.Query(con, sql, Integer.class, params).get(0);
            if(count > 0){
                return "Невозможно удалить действие так как оно привязано к группам";
            }
            sql = "UPDATE i_acts SET del = 1 - del WHERE Id = :id";
            db.Execute(con, sql, params);
            return "";
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить данные выбранного действия
     * @param id - Идентифиатор действия
     */
    @Override
    public String GetActSel(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT LTRIM(RTRIM(CAST(Id AS VARCHAR(128)))) || ' = ' || Name FROM i_acts WHERE Id = :id";
            List<String> result = db.Query(con, sql, String.class, params);
            if(result.size() == 0){
                throw new Exception("Не удалось получить действие с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
