package org.kaznalnrprograms.MCA.Switchs.Dao;

import org.kaznalnrprograms.MCA.Switchs.Interfaces.ISwitchsDirectoryDao;
import org.kaznalnrprograms.MCA.Switchs.Models.SwitchsAuxiliaryModel;
import org.kaznalnrprograms.MCA.Switchs.Models.SwitchsCodeModel;
import org.kaznalnrprograms.MCA.Switchs.Models.SwitchsModel;
import org.kaznalnrprograms.MCA.Switchs.Models.SwitchsViewModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;

import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class SwitchsDirectoryDaoImpl implements ISwitchsDirectoryDao {
    private String appName = "Switchs - справочник коммутаций";
    private DBUtils db;

    public SwitchsDirectoryDaoImpl(DBUtils db){ this.db = db;}

    @Override
    public List<SwitchsViewModel> list(boolean ShowDel) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT s.id, s.code as tp_km, s.name as name, " +
                            " s.phone_try_no as tl_attempts, " +
                            " s.phone_no_answer_pause as tl_btw_attempts," +
                            " s.phone_busy_fail_pause as tl_btw_sets, " +
                            " s.phone_wait_answer as tl_pause," +
                            " s.sms_try_no as sms_attempts, s.sms_pause_repeat as sms_pause," +
                            " s.mail_try_no as email_attempts, s.mail_pause_repeat as email_pause, s.del"+
                            " FROM switchs s";
            if(!ShowDel) sql += " WHERE s.del = 0";
            sql += " ORDER BY s.name";

            return db.Query(con, sql, SwitchsViewModel.class, null);
        }
        catch (Exception ex){
            throw ex;
        }
    }

    @Override
    public SwitchsModel get(SwitchsAuxiliaryModel id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT s.id, s.code, s.phone_recall_if_break, s.phone_try_no, s.phone_no_answer_pause, s.phone_busy_fail_pause, s.phone_wait_answer, s.sms_try_no, s.sms_pause_repeat, s.mail_try_no, s.mail_pause_repeat,  s.creator, s.created, s.changer, s.changed"+
                    " FROM switchs s WHERE id = :id";
            params.put("id", id.getId());
            return db.Query(con, sql, SwitchsModel.class, params).get(0);
        }catch (Exception ex){
            throw ex;
        }
    }

    @Override
    public List<SwitchsCodeModel> getCode() throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, code, name FROM SWITCHS";
            return db.Query(con, sql, SwitchsCodeModel.class, null);
        } catch ( Exception ex) {
            throw ex;
        }


    }

    @Override
    public UUID save(SwitchsModel swt) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            db.CheckLock(con,-1, swt.getId().toString(), "switchs");
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("id", swt.getId());
            if("phone".equals(swt.getCode() ) || "mobile".equals(swt.getCode())){
                params.put("phone_try_no", swt.getPhone_try_no());
                params.put("phone_no_answer_pause", swt.getPhone_no_answer_pause());
                params.put("phone_busy_fail_pause", swt.getPhone_busy_fail_pause());
                params.put("phone_wait_answer", swt.getPhone_wait_answer());
                params.put("phone_recall_if_break", swt.getPhone_recall_if_break());
                sql="UPDATE switchs SET phone_try_no =:phone_try_no, phone_no_answer_pause =:phone_no_answer_pause, phone_busy_fail_pause =:phone_busy_fail_pause, phone_wait_answer =:phone_wait_answer, phone_recall_if_break =:phone_recall_if_break WHERE id =:id";
            }else if("SMS".equals(swt.getCode())){
                params.put("sms_try_no", swt.getSms_try_no());
                params.put("sms_pause_repeat", swt.getSms_pause_repeat());
                sql="UPDATE switchs SET  sms_try_no =:sms_try_no, sms_pause_repeat =:sms_pause_repeat WHERE id = :id";
            }else if ("EMail".equals(swt.getCode())){
                params.put("mail_try_no", swt.getMail_try_no());
                params.put("mail_pause_repeat", swt.getMail_pause_repeat());
                sql="UPDATE switchs SET  mail_try_no =:mail_try_no, mail_pause_repeat =:mail_pause_repeat WHERE id = :id";
            }
            db.Execute(con, sql, params);
        }catch (Exception ex){
            throw ex;
        }
        return swt.getId();
    }

    @Override
    public void delete(int id) throws Exception {

    }
}
