package org.kaznalnrprograms.MCA.Admin.Dao;

import org.kaznalnrprograms.MCA.Admin.Interfaces.IAdminUsersDao;
import org.kaznalnrprograms.MCA.Admin.Models.UserModel;
import org.kaznalnrprograms.MCA.Admin.Models.UserViewModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;

@Repository
public class AdminUsersDaoImpl implements IAdminUsersDao {
    private String appName = "Admin - модуль администрирования";
    private DBUtils db;
    public AdminUsersDaoImpl(DBUtils db) {
        this.db = db;
    }
    /**
     * Фнкция возвращает список пользователей
     * @param code фильтер по части логина пользователя
     * @param name фильтер по части наименования
     */
    @Override
    public List<UserViewModel> List(String code, String name) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT u.id, u.login, u.Name as UserName, " +
                    " CASE WHEN u.isenabled = 1 THEN 'Да' ELSE 'Нет' END as isenabled, "
                    +" CASE WHEN u.Del = 1 THEN 'Да' ELSE 'Нет' END as Del FROM i_users u"
                    +" WHERE 1=1";
            if(!code.isEmpty()){
                sql+=" AND u.login ILIKE '%'||:code||'%'";
                params.put("code", code);
            }
            if(!name.isEmpty()){
                sql+=" AND u.Name ILIKE '%'||:name||'%'";
                params.put("name", name);
            }
            sql +=" ORDER BY u.login";
            List<UserViewModel> users = db.Query(con, sql, UserViewModel.class, params);
            return users;
        }
        catch(Exception ex)
        {
            throw ex;
        }
    }
    /**
     * Функция получения пользователя
     * @param id - идентификатор пользователя
     * @return
     * @throws Exception
     */
    @Override
    public UserModel GetUser(String id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT id, login, code, name, organizational_unit, email, isenabled, " +
                    " creator, created, changer, changed FROM i_users"
                    + " WHERE Id = :id";
            List<UserModel> users = db.Query(con, sql, UserModel.class, params);
            if(users.size() == 0){
                throw new Exception("Пользователь с Id = " + id);
            }
            return users.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Проверка существования пользователя
     * @param id - идентификатор пользователя
     * @param login - логин ползователя
     * @return
     * @throws Exception
     */
    @Override
    public boolean ExistsUser(String id, String login) throws Exception{
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT COUNT(*) FROM i_users WHERE login = :login";
            Map<String, Object> params = new HashMap<>();
            params.put("login", login);
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
     * Добавить/изменить пользователя
     * @param model - модуль пользователя
     * @return
     * @throws Exception
     */
    @Override
    public  String Save(UserModel model) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            String password = model.getPassword();
            Map<String, Object> params = new HashMap<>();
            params.put("login", model.getLogin());
            params.put("Code", model.getCode());
            params.put("Name", model.getName());
            params.put("organizational_unit", model.getOrganizational_unit());
            params.put("email", model.getEmail());
            if(!password.isEmpty()){
                params.put("Password", password);
            }
            if(model.getId() == ""){
                sql = "INSERT INTO i_users (id, login, Code, Name, Password, organizational_unit, email, isenabled, Del) VALUES(uuid_generate_v4(), :login, :Code, :Name, :Password, :organizational_unit, :email, " + model.getIsenabled() + ", 0)";
                model.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                db.CheckLock(con, -1, model.getId(), "i_users");
                sql = "UPDATE i_users SET login = :login, Code = :Code, Name = :Name, organizational_unit = :organizational_unit, email = :email,  isenabled = " + model.getIsenabled();
                if(!password.isEmpty()){
                    sql+=", Password = :Password";
                }
                sql+= " WHERE Id = :id";
                params.put("id", UUID.fromString(model.getId()));
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * Удаление пользователя
     * @param id - идентификатор пользователя
     * @return
     */
    @Override
    public String Delete(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT COUNT(*) as cnt FROM i_user_groups WHERE i_user_id = :id AND del = 0";
            int count = db.Query(con, sql, Integer.class, params).get(0);
            if(count > 0){
                return "Невозможно удалить пользователя так как он привязан к группам";
            }
            sql = "UPDATE i_users SET Del = 1 - Del WHERE Id = :id";
            db.Execute(con, sql, params);
            return "";
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * Получение строки представления пользователя для формы редактирования
     * @param id - идентификатор польбзователя
     */
    @Override
    public String getUserSel(String id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT LTRIM(RTRIM(CAST(Id AS VARCHAR(128)))) || ' = ' || Name FROM i_users WHERE id = :id";
            List<String> result = db.Query(con, sql, String.class, params);
            if(result.size()==0){
                throw new Exception("Не удалось получить пользователя с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
