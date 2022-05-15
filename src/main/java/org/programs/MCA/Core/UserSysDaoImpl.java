package org.kaznalnrprograms.MCA.Core;

import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class UserSysDaoImpl implements IUserSysDao {
    private String appName = "ITreasury";
    private DBUtils db;
    public UserSysDaoImpl(DBUtils db){
        this.db = db;
    }
    @Override
    public UserModel getByLogin(String login) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, login, Name, password, isenabled FROM i_users WHERE login = :login and del = 0";
            Map<String, Object> params = new HashMap<>();
            params.put("login", login);
            List<UserModel> users = db.Query(con, sql, UserModel.class,params);
            if(users.size() == 0){
                throw new Exception("Неверный логин или пароль");
            }
            return users.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Проверить право на действие
     * @param TaskCode - код приложения
     * @param ActCode - код действия
     */
    @Override
    public String GetActRights(String TaskCode, String ActCode) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT get_act_rights(:TaskCode, :ActCode)";
            Map<String, Object> params = new HashMap<>();
            params.put("TaskCode", TaskCode);
            params.put("ActCode", ActCode);
            return db.Query(con, sql, String.class, params).get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
