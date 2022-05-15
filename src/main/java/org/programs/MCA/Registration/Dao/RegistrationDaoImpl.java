package org.kaznalnrprograms.MCA.Registration.Dao;

import org.kaznalnrprograms.MCA.Registration.Interfaces.IRegistrationDao;
import org.kaznalnrprograms.MCA.Registration.Models.RegistrationUserModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;

@Repository
public class RegistrationDaoImpl implements IRegistrationDao {

    private String appName = "Registration - модуль регистрации пользователя";
    private DBUtils db;

    public RegistrationDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Проверка существования логина пользователя
     * @param login логин пользователя
     * @return
     */
    @Override
    public boolean existsLogin(String login) throws Exception{
        try(Connection con  = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT COUNT(1) FROM i_users WHERE lower(login) = :login";
            params.put("login", login.toLowerCase());
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Реагистрация нового пользователя
     * @param user модель регистраци пользователя
     * @throws Exception
     */
    @Override
    public void SaveRegistrationUser(RegistrationUserModel user) throws Exception{
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(8);
        Map<String, Object> params = new Hashtable<>();
        String sql = "";
        try(Connection con = db.getConnection(appName)){
            params.put("login", user.getLogin());
            params.put("code", user.getCode());
            params.put("name", user.getName());
            params.put("password", passwordEncoder.encode(user.getPassword()));
            params.put("organizational_unit", user.getOrganizationalUnit());
            params.put("email", user.getEmail());
            sql = "INSERT INTO i_users (id, login, code, name, password, del, isenabled, organizational_unit, email) VALUES(uuid_generate_v4(), :login, :code, :name, :password, 0, 0, :organizational_unit, :email)";
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
