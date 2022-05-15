package org.kaznalnrprograms.MCA.Abons.Dao;

import org.kaznalnrprograms.MCA.Abons.Interfaces.IAbonsService;
import org.kaznalnrprograms.MCA.Abons.Models.Csv.ParamsImportModel;
import org.kaznalnrprograms.MCA.Abons.Models.GroupViewModel;
import org.kaznalnrprograms.MCA.Abons.Models.ResultModel;
import org.kaznalnrprograms.MCA.Abons.Models.Service.AbonsDtmfModel;
import org.kaznalnrprograms.MCA.Abons.Models.Service.InstallDtmfModel;
import org.kaznalnrprograms.MCA.Abons.Models.Service.PinsAbonModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;

@Repository
public class AbonsServiceDaoImpl implements IAbonsService {
    private String appName = "Abons - Администратор абонентов.";
    private DBUtils db;

    public AbonsServiceDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Получить список групп
     * @return
     * @throws Exception
     */
    @Override
    public List<GroupViewModel> getGroups() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "select id, name from grps " +
                    "where del=0 " +
                    "order by name";

            List<GroupViewModel> result = db.Query(con, sql, GroupViewModel.class, null);

            if (result.size() == 0) { throw new Exception("Не удалось получить список групп"); }

            return result;
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Получить список абонентов в группе
     * @param groupid
     * @return
     * @throws Exception
     */
    @Override
    public List<AbonsDtmfModel> getListAbonInGroup(ResultModel groupid) throws Exception {
        try(Connection con = db.getConnection(appName)){

            String sql = "";

            sql = "select id from switchs " +
                    "where code = 'phone' " +
                    "and del = 0";

            List<String> res = db.Query(con, sql, String.class, null);
            if (res.size() == 0) { throw new Exception("Не удалось получить идентификатор коммутации 'phone'"); }
            String switchid = res.get(0);


            sql = "select a.id as abonid, " +
                    "' [ ' || snils || ' ] ' || fam ||' '||ima||' '||otch as abon, " +
                    "p.id as pinid, " +
                    "p.code_view as phone, " +
                    "p.is_has_dtmf " +
                    "from abon_grps ag " +
                    "join abons a on a.id = ag.abon_id and a.del = 0 " +
                    "join pins p on p.abon_id = a.id and p.del = 0 " +
                    "where grp_id = :groupid " +
                    "AND p.switch_id = :switchid " +
                    "order by abon, phone";

            Map<String, Object> params = new HashMap<>();
            params.put("groupid", UUID.fromString(groupid.getResult()));
            params.put("switchid", UUID.fromString(switchid));

            List<AbonsDtmfModel> result = db.Query(con, sql, AbonsDtmfModel.class, params);

            return result;
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Получить абонента по ид
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public String getAbonById(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "select " +
                    "' [ ' || snils || ' ] ' || fam ||' '||ima||' '||otch as abon " +
                    "from abons " +
                    "where id = :id";

            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(id) );

            List<String> result = db.Query(con, sql, String.class, params);

            if (result.size() == 0) { throw new Exception("Не удалось получить абонента"); }

            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Получить список контактов (phone) абонента
     * @param abonid
     * @return
     * @throws Exception
     */
    @Override
    public List<PinsAbonModel> getPinsAbon(ResultModel abonid) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";

            sql = "select id from switchs " +
                    "where code = 'phone' " +
                    "and del = 0";

            List<String> res = db.Query(con, sql, String.class, null);
            if (res.size() == 0) { throw new Exception("Не удалось получить идентификатор коммутации 'phone'"); }
            String switchid = res.get(0);


            sql = "select id, code_view, is_has_dtmf, " +
                    "code_view || '	Тоновый набор: ' || " +
                    "CASE WHEN " +
                    "   is_has_dtmf = 0 THEN 'нет' " +
                    "   ELSE 'да' " +
                    "END codeforcmb " +
                    "from pins " +
                    "where abon_id= :abonid " +
                    "and switch_id = :switchid " +
                    "and del = 0";

            Map<String, Object> params = new HashMap<>();
            params.put("abonid", UUID.fromString(abonid.getResult()) );
            params.put("switchid", UUID.fromString(switchid) );

            List<PinsAbonModel> result = db.Query(con, sql, PinsAbonModel.class, params);

            return result;
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Установка / снятия флага dtmf
     * @param installDtmf
     * @return
     * @throws Exception
     */
    @Override
    public String installDtmf(InstallDtmfModel installDtmf) throws Exception {

        try (Connection con = db.getConnectionWithTran(appName)) {

            //Обновляем признак is_has_dtmf в табл. pins
            String result = updatePinsDtmf(con, installDtmf);

            if( result.length() > 0 ){
                return result;
            }

            con.commit();
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }




    /**
     * Обновляем признак is_has_dtmf в табл. pins
     * @param con
     * @param installDtmf
     * @return
     * @throws Exception
     */
    String updatePinsDtmf(Connection con, InstallDtmfModel installDtmf) throws Exception {
        try{
            String sql = "";
            Integer is_has_dtmf = installDtmf.isIs_has_dtmf() ? 1 : 0;

            for(int i = 0; i < installDtmf.getAbons().size(); i++){

                String stateLock = LockRecord(con, "abons", installDtmf.getAbons().get(i).getAbonid());
                if (stateLock.length() > 0) { //запись кем то заблокирована

                    String lockAbon = getAbonById( installDtmf.getAbons().get(i).getAbonid() );

                    return lockAbon +".   "+ stateLock;
                }

                Map<String,Object> params = new HashMap<>();
                params.put("is_has_dtmf", is_has_dtmf);
                params.put("pinid", UUID.fromString( installDtmf.getAbons().get(i).getPinid() ));

                sql = "update pins " +
                      "set is_has_dtmf = :is_has_dtmf " +
                      "where id = :pinid";

                db.Execute(con, sql, params);
                FreeLockRecord(con, "abons", installDtmf.getAbons().get(i).getAbonid());
            }

            return "";
        } catch (Exception ex){
            throw ex;
        }
    }




    /**
     * Проверить сосояние блокировки записи
     *
     * @param table - имя таблицы базы данных
     * @param uuid  - уникальный идентификатор
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    String StateLockRecord(Connection con, String table, String uuid) throws Exception {
        Map<String, Object> params = new Hashtable<>();

        params.put("recId", UUID.fromString(uuid));
        params.put("table", table);

        String sql = "SELECT u.Name FROM LockTable lt"
                + " JOIN i_users u ON u.Id = lt.i_user_id"
                + " WHERE lt.recuuid = :recId AND lt.ObjectId = GetObject_Id(:table)";

        List<String> result = db.Query(con, sql, String.class, params);
        if (result.size() > 0) {
            String userName = result.get(0);
            return "Запись редактируется пользователем " + userName;
        }
        return "";
    }


    /**
     * Накладывает блокировку на запись
     *
     * @param table - имя таблицы базы данных
     * @param uuid  - уникальный идентификатор записи
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    String LockRecord(Connection con, String table, String uuid) throws Exception {
        String state = StateLockRecord(con, table, uuid);
        if (!state.isEmpty()) {
            return state;
        }

        String userCode = db.getUserCode();

        Map<String, Object> params = new Hashtable<>();
        params.put("recId", UUID.fromString(uuid));
        params.put("userCode", userCode);
        params.put("table", table);

        String sql = "INSERT INTO LockTable (Id, ObjectId, Recuuid, Date, i_user_id) VALUES(uuid_generate_v4(), GetObject_Id(:table), :recId"
                + ", current_timestamp, (SELECT Id FROM i_users WHERE login = :userCode))";


        db.Execute(con, sql, params);
        return "";
    }


    /**
     * Удаляет блокировку
     *
     * @param table - имя таблицы базы данных
     * @param uuid  - уникальный идентификатор записи
     */
    void FreeLockRecord(Connection con, String table, String uuid) throws Exception {

        Map<String, Object> params = new Hashtable<>();
        String userCode = db.getUserCode();
        params.put("userCode", userCode);
        String sql = "SELECT Id FROM i_users WHERE login = :userCode";
        UUID UserId = db.Query(con, sql, UUID.class, params).get(0);
        params.clear();

        sql = "DELETE FROM LockTable WHERE ObjectId = GetObject_Id(:table)"
                + " AND Recuuid = :recId AND i_user_id = :UserId";
        params.put("recId", UUID.fromString(uuid));
        params.put("table", table);
        params.put("UserId", UserId);

        db.Execute(con, sql, params);
    }



}
