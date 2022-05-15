package org.kaznalnrprograms.MCA.Admin.Dao;

import org.kaznalnrprograms.MCA.Admin.Interfaces.IAdminAppsDao;
import org.kaznalnrprograms.MCA.Admin.Models.AppModel;
import org.kaznalnrprograms.MCA.Admin.Models.AppViewModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class AdminAppsDaoImpl implements IAdminAppsDao {
    private String appName = "Admin - модуль администрирования";
    private DBUtils db;

    public AdminAppsDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Получить список приложений
     */
    @Override
    public List<AppViewModel> List() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, name, code, CASE WHEN type = 0 THEN 'Категория' ELSE 'Приложение' END as type, CASE WHEN del = 1 THEN 'Да' ELSE 'Нет' END AS del, COALESCE(CAST(parent_id AS VARCHAR(128)), '') as parent_id FROM i_apps ORDER BY Sort_Code, Name";
            return db.Query(con, sql, AppViewModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить наименование приложения
     * @param id идентификатор приложения
     */
    @Override
    public String GetAppSel(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT LTRIM(RTRIM(CAST(Id AS VARCHAR(128)))) || ' = ' || Name FROM i_apps WHERE Id = :id";
            List<String> result = db.Query(con, sql, String.class, params);
            if(result.size() == 0){
                throw new Exception("Не удалось получить приложение с ID = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить приложение
     * @param id - идентификатор приложения
     */
    @Override
    public AppModel Get(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT id, parent_id, code, name, sort_code, type, iconcls, url," +
                    " creator, created, changer, changed FROM i_apps WHERE id = :id";
            List<AppModel> apps = db.Query(con, sql, AppModel.class, params);
            if(apps.size() == 0){
                throw new Exception("Не удалось получить приложение с ID = " + id);
            }
            return apps.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование приложения
     * @param id - идентификатор приложения (для новых -1)
     * @param code - код приложения
     */
    @Override
    public boolean Exists(String id, String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("code", code);
            String sql = "SELECT COUNT(*) FROM i_apps WHERE Code = :code";
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
     * Добавить/Изменить приложение
     * @param app - модель приложения
     */
    @Override
    public String Save(AppModel app) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            String pId = "NULL";
            if(!app.getParent_id().isEmpty()){
                pId = ":parent_id";
                params.put("parent_id", UUID.fromString(app.getParent_id()));
            }
            params.put("code", app.getCode());
            params.put("name", app.getName());
            params.put("sort_code", app.getSort_code());
            params.put("iconcls", app.getIconCls());
            params.put("url", app.getUrl());
            String sql = "";
            if(app.getId().isEmpty()){
                sql = "INSERT INTO i_apps (id, parent_id, code, name, sort_code," +
                        " type, iconcls, url, del) VALUES(uuid_generate_v4(), " + pId + ", :code, :name, :sort_code," +
                        " " + app.getType() + ", :iconcls, :url, 0)";
                app.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                db.CheckLock(con, -1, app.getId(), "i_apps");
                params.put("id", UUID.fromString(app.getId()));
                Map<String, Object> prId = new Hashtable<>();
                prId.put("id", UUID.fromString(app.getId()));
                sql = "SELECT type FROM i_apps WHERE id = :id";
                int type = db.Query(con, sql, Integer.class, prId).get(0);
                if(type == 0 && app.getType() == 1){
                    sql = "SELECT COUNT(*) FROM i_apps WHERE parent_id = :id";
                    int count = db.Query(con, sql, Integer.class, prId).get(0);
                    if(count > 0){
                        throw new Exception("Для того чтобы категорию преобразовать в приложение сначала необходимо перепривязать дочерние приложения к другой категории");
                    }
                }
                sql = "UPDATE i_apps SET parent_id = " + pId + ", code = :code, name = :name, sort_code = :sort_code, " +
                        " type = " + app.getType() + ", iconcls = :iconcls, url = :url WHERE id = :id";
                db.Execute(con, sql, params);
            }
            return app.getId();
        }
        catch(Exception ex) {
            throw ex;
        }
    }

    /**
     * Удалить приложение
     * @param id - идентификатор приложения
     */
    @Override
    public String Delete(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT COUNT(*) FROM i_apps_groups WHERE i_app_id = :id AND del = 0";
            int count = db.Query(con, sql, Integer.class, params).get(0);
            if(count > 0){
                return "Невозможно удалить данное приложение так как оно привязано к группам";
            }
            sql = "UPDATE i_apps SET del = 1 - del WHERE id = :id";
            db.Execute(con, sql, params);
            return "";
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить список категорий
     * @return
     * @throws Exception
     */
    @Override
    public List<AppViewModel> CategoryList() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, name, code, CASE WHEN type = 0 THEN 'Категория' ELSE 'Приложение' END as type, CASE WHEN del = 1 THEN 'Да' ELSE 'Нет' END AS del, COALESCE(CAST(parent_id AS VARCHAR(128)), '') as parent_id FROM i_apps WHERE parent_id IS NULL ORDER BY Sort_Code, Name";
            return db.Query(con, sql, AppViewModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }

}
