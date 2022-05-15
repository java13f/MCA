package org.kaznalnrprograms.MCA.UserSettings.Dao;


import org.kaznalnrprograms.MCA.UserSettings.Interfaces.IUserSettingsDao;
import org.kaznalnrprograms.MCA.UserSettings.Models.PasswordChangeModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class UserSettingsDaoImpl implements IUserSettingsDao {
    private String appName = "UserSettings - изменение пароля";
    private DBUtils db;

    public UserSettingsDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Изменение пароля
     * @param model модель изменения пароля
     */
    @Override
    public void UpdatePassword(PasswordChangeModel model) throws Exception{
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(8);
        try(Connection con = db.getConnection(appName)){
            String userCode = db.getUserCode();
            Map<String, Object> params = new HashMap<>();
            params.put("password", passwordEncoder.encode(model.getNewPassword()));
            params.put("login", userCode);
            String sql = "UPDATE i_users SET Password = :password WHERE login = :login";
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получить хэш текущего пароля
     * @return
     * @throws Exception
     */
    @Override
    public String getCurrentPassword() throws Exception{
        try(Connection con = db.getConnection(appName)) {
            String userCode = db.getUserCode();
            Map<String, Object> params = new HashMap<>();
            params.put("login", userCode);
            String sql = "SELECT password FROM i_users WHERE login = :login AND del = 0";

            List<String> result = db.Query(con, sql, String.class, params);
            if(result.size() == 0){
                throw new Exception("Неверный логин или пароль");
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
