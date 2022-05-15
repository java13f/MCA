package org.kaznalnrprograms.MCA.Filters.Dao;

import org.kaznalnrprograms.MCA.Filters.Interfaces.IFiltersDao;
import org.kaznalnrprograms.MCA.Filters.Models.FilterParamModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;

@Repository
public class FiltersDaoImpl implements IFiltersDao {
    private String appName = "Filters - настройки фильтров";
    private DBUtils db;

    public FiltersDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получить идентификатор пользователя
     * @param con соединение с базой данных
     * @return
     */
    private String getUserId(Connection con){
        Map<String, Object> params = new HashMap<>();
        String login = db.getUserCode();
        params.put("login", login);
        String sql = "SELECT id FROM i_users WHERE login = :login";
        var userId = db.Query(con, sql, String.class, params).get(0);
        return userId;
    }
    /**
     * Получить значения фильтра
     * @param code код фильтра
     * @return
     * @throws Exception
     */
    @Override
    public List<FilterParamModel> GetValues(String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            var userId = getUserId(con);
            params.put("code", code);
            params.put("userId", UUID.fromString(userId));
            String sql = "SELECT code, paramcode, val FROM Filters WHERE i_user_id = :userId AND Code = :code";
            return db.Query(con, sql, FilterParamModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Сохранение настроек фильтра
     * @param code код фильтра
     * @param values значения параметров фильтра, которые необходимо создать или изменить
     * @throws Exception
     */
    @Override
    public void SetValues(String code, List<FilterParamModel> values) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "";
            var userId = getUserId(con);
            for(FilterParamModel param: values){
                params.clear();
                params.put("code", param.getCode());
                params.put("paramCode", param.getParamCode());
                params.put("userId", UUID.fromString(userId));
                sql = "SELECT id FROM Filters WHERE i_user_id = :userId AND Code = :code AND ParamCode = :paramCode";
                List<String> result = db.Query(con, sql, String.class, params);
                params.put("val", param.getVal());
                if(result.size() == 0){
                    sql = "INSERT INTO Filters (id, i_user_id, Code, ParamCode, Val) VALUES(uuid_generate_v4(), :userId, :code, :paramCode, :val)";
                }
                else {
                    params.clear();
                    params.put("val", param.getVal());
                    var id = result.get(0);
                    params.put("id", UUID.fromString(id));
                    sql = "UPDATE Filters SET Val = :val WHERE id = :id";
                }
                db.Execute(con, sql, params);
            }
            con.commit();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Уудалить фильтр
     * @param code код фильтра
     * @throws Exception
     */
    @Override
    public void DeleteFilter(String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            var userId = getUserId(con);
            params.put("code", code);
            params.put("userId", UUID.fromString(userId));
            String sql = "DELETE FROM Filters WHERE i_user_id = :userId AND Code = :code";
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление параметров фильтра
     * @param code код фильтра
     * @param keys параметры фильтра
     * @throws Exception
     */
    @Override
    public void DeleteParamsInFilter(String code, List<String> keys) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)){
            Map<String, Object> params = new Hashtable<>();
            var userId = getUserId(con);
            params.put("code", code);
            params.put("paramCode", "");
            params.put("userId", UUID.fromString(userId));
            for(String key : keys){
                params.replace("paramCode", key);
                String sql = "DELETE FROM Filters WHERE i_user_id = :userId AND Code = :code AND ParamCode = :paramCode";
                db.Execute(con, sql, params);
            }
            con.commit();
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
