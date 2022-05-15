package org.kaznalnrprograms.MCA.LockService.Dao;

import org.kaznalnrprograms.MCA.LockService.Interfaces.ILockServiceDao;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class LockServiceDaoImpl implements ILockServiceDao {
    private String appName = "LockService - сервис блокировки";
    private DBUtils db;
    public LockServiceDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Проверить сосояние блокировки записи
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @param uuid - уникальный идентификатор
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    @Override
    public String StateLockRecord(String table, Integer recId, String uuid) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            String sql = "";
            if(uuid.isEmpty()){
                sql = "SELECT u.Name FROM LockTable lt"
                        +" JOIN i_users u ON u.Id = lt.i_user_id"
                        +" WHERE lt.recId = " + recId + " AND lt.ObjectId = GetObject_Id(:table)";
            }
            else{
                sql = "SELECT u.Name FROM LockTable lt"
                        +" JOIN i_users u ON u.Id = lt.i_user_id"
                        +" WHERE lt.recuuid = :recId AND lt.ObjectId = GetObject_Id(:table)";
                params.put("recId", UUID.fromString(uuid));
            }
            params.put("table", table);
            List<String> result = db.Query(con, sql, String.class, params);
            if(result.size() > 0) {
                String userName = result.get(0);
                return "Запись редактируется пользователем " + userName;
            }
            return "";
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Накладывает блокировку на запись
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @param uuid - уникальный идентификатор записи
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    @Override
    public String LockRecord(String table, Integer recId, String uuid) throws Exception {
        String state = StateLockRecord(table, recId, uuid);
        if(!state.isEmpty()){
            return state;
        }
        try(Connection con = db.getConnection(appName)){
            String userCode = db.getUserCode();
            Map<String, Object> params = new Hashtable<>();
            String sql = "";
            if(uuid.isEmpty()){
                sql = "INSERT INTO LockTable (Id, ObjectId, RecId, Date, i_user_id) VALUES(uuid_generate_v4(), GetObject_Id(:table), " + recId
                        +", current_timestamp, (SELECT Id FROM i_users WHERE login = :userCode))";
            }
            else {
                sql = "INSERT INTO LockTable (Id, ObjectId, Recuuid, Date, i_user_id) VALUES(uuid_generate_v4(), GetObject_Id(:table), :recId"
                        +", current_timestamp, (SELECT Id FROM i_users WHERE login = :userCode))";
                params.put("recId", UUID.fromString(uuid));
            }
            params.put("userCode", userCode);
            params.put("table", table);
            db.Execute(con, sql, params);
            return "";
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Обновляет блокировку на записи
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @param uuid - уникальный идентификатор записи
     */
    @Override
    public void UpdateLock(String table, Integer recId, String uuid) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            String userCode = db.getUserCode();
            params.put("userCode", userCode);
            String sql = "SELECT Id FROM i_users WHERE login = :userCode";
            UUID UserId = db.Query(con, sql, UUID.class, params).get(0);
            params.clear();
            params.put("UserId", UserId);
            if(uuid.isEmpty()){
                sql = "UPDATE LockTable SET Date = current_timestamp WHERE ObjectId = GetObject_Id(:table)"
                        +" AND RecId = " + recId + " AND i_user_id = :UserId";
            }
            else {
                sql = "UPDATE LockTable SET Date = current_timestamp WHERE ObjectId = GetObject_Id(:table)"
                        +" AND RecUUID = :recId  AND i_user_id = :UserId";
                params.put("recId", UUID.fromString(uuid));
            }
            params.put("table", table);
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Удаляет блокировку
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @param uuid - уникальный идентификатор записи
     */
    @Override
    public void FreeLockRecord(String table, Integer recId, String uuid) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            String userCode = db.getUserCode();
            params.put("userCode", userCode);
            String sql = "SELECT Id FROM i_users WHERE login = :userCode";
            UUID UserId = db.Query(con, sql, UUID.class, params).get(0);
            params.clear();
            if(uuid.isEmpty()){
                sql = "DELETE FROM LockTable WHERE ObjectId = GetObject_Id(:table)"
                        +" AND RecId = " + recId + " AND i_user_id = :UserId";
            }
            else {
                sql = "DELETE FROM LockTable WHERE ObjectId = GetObject_Id(:table)"
                        +" AND Recuuid = :recId AND i_user_id = :UserId";
                params.put("recId", UUID.fromString(uuid));
            }
            params.put("table", table);
            params.put("UserId", UserId);
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
