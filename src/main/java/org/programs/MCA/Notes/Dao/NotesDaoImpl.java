package org.kaznalnrprograms.MCA.Notes.Dao;

import org.kaznalnrprograms.MCA.Notes.Interfaces.INotesDao;
import org.kaznalnrprograms.MCA.Notes.Models.*;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class NotesDaoImpl implements INotesDao {
    private String appName = "Notes - Менеджер заданий на оповещение";
    private DBUtils db;

    public NotesDaoImpl(DBUtils db){
        this.db = db;
    }

    @Override
    public NotesRightModel GetActRights() throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String sql = "SELECT get_act_rights('Notes', 'NoteChange') noteChange, " +
                    "get_act_rights('Notes', 'NoteDel') noteDel, " +
                    "get_act_rights('Notes', 'PatternDel') patternDel, " +
                    "get_act_rights('Notes', 'PatternChange') patternChange, " +
                    "get_act_rights('Notes', 'NoteView') noteView, " +
                    "get_act_rights('Notes', 'NoteRun') noteRun";
            return db.Query(con, sql, NotesRightModel.class, null).get(0);
        }
        catch(Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<PatternViewModel> GetPatterns(PatternFilterModel filter) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String noteId = filter.getNoteId();
            if(noteId != null && noteId.length() > 0) {
                params.put("noteId", noteId);
            }
            params.put("showDel", filter.getShowDel());
            String sql = "select p.id id, p.\"name\" \"name\", p.all_flag allFlag, p.del del " +
                    "from patterns p " +
                    (params.containsKey("noteId") ? "join notes n on n.pattern_id=p.id " : "") +
                    "where p.del<=:showDel " +
                    (params.containsKey("noteId") ? " and n.id=cast(:noteId as uuid) and (select del from notes where id=cast(:noteId as uuid))=0 " : " ") +
                    "order by p.\"name\"";
            return db.Query(con, sql, PatternViewModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<NotesViewModel> GetNotes(NoteFilterModel filter) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String patternId = filter.getPatternId();
            params.put("del", filter.getShowDel());
            if(patternId != null && patternId.length() > 0) {
                params.put("patternId", patternId);
            }
            if(filter.getSttsId().trim().length() > 0) {
                params.put("sttsId", filter.getSttsId());
            }
            if(filter.getDlgAllId().trim().length() > 0) {
                params.put("dlgAllId", filter.getDlgAllId());
            }
            if(filter.getAbonId().trim().length() > 0) {
                params.put("abonId", filter.getAbonId());
            }
            if(filter.getChkStart() == 1) {
                params.put("dateStart", filter.getDateStart());
            }
            if(filter.getChkEnd() == 1) {
                params.put("dateEnd", filter.getDateEnd());
            }
            String sql = "select n.id id, to_char(n.date, 'dd.MM.yyyy HH24:MI:SS') date, n.\"name\" \"name\", " +
                    "da.\"name\" dlgAll, st.\"name\" sttsName, st.code sttsCode, n.del del " +
                    "from notes n " +
                    "join dlg_alls da on da.id=n.dlg_all_id " +
                    "join stts st on st.id=n.stts_id " +
                    (
                      params.containsKey("abonId") ?
                     "join note_abons na on na.note_id=n.id and na.del=0 and na.abon_id=cast(:abonId as uuid) " +
                     "join abons a on a.id=cast(:abonId as uuid) and a.del=0 "
                      :
                      ""
                    ) +
                    "where da.del=0 and st.del=0 and n.del<=:del " +
                    (params.containsKey("sttsId") ? " and st.id=cast(:sttsId as uuid)" : "") +
                    (params.containsKey("dlgAllId") ? " and da.id=cast(:dlgAllId as uuid)" : "") +
                    (params.containsKey("dateStart") ? " and n.date>=cast(:dateStart as timestamp)" : "") +
                    (params.containsKey("dateEnd") ? " and n.date<=cast(:dateEnd as timestamp)" : "") +
                    (params.containsKey("patternId") ? " and n.pattern_id=cast(:patternId as uuid) and (select del from patterns where id=cast(:patternId as uuid))=0 " : "") +
                    "order by n.date";
            return db.Query(con, sql, NotesViewModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public SttsModel GetNoteStts(String noteId) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("noteId", noteId);
            String sql = "select s.id id, s.code code, s.\"name\" \"name\", n.del del from stts s " + // здесь del признак удаления задания
                    "join notes n on 1=1 and n.id=cast(:noteId as uuid) " +
                    "where s.id=(select stts_id from notes where id=cast(:noteId as uuid))";
            return db.Query(con, sql, SttsModel.class, params).get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<SttsModel> LoadSttsList() throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String sql = "select id, code, name, del from stts where del=0";
            return db.Query(con, sql, SttsModel.class, null);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<PinModel> GetPinsNoNotify(String id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "select " +
                    "p.id id, " +
                    "a.id abonId, " +
                    "get_fio(a.fam || ' ' || a.ima || ' ' || a.otch , 0) abonName, " +
                    "s.\"name\" switchName, " +
                    "na.id noteAbonId, " +
                    "p.code_view codeView " +
                    "from pins p " +
                    "join abons a on a.id=p.abon_id and a.del=0 " +
                    "join switchs s on s.id=p.switch_id " +
                    "join note_abons na on na.abon_id=a.id and na.del=0 and note_id=cast(:id as uuid) " +
                    "where p.del=0 " +
                    "and p.id not in " +
                    "   (" +
                    "       select p.id " +
                    "       from switchs    s " +
                    "       join pins       p   on s.id = p.switch_id   and p.del=0 " +
                    "       join abons      a   on p.abon_id=a.id       and p.del=0 " +
                    "       join note_abons na  on na.abon_id=a.id      and na.del=0  and note_id=cast(:id as uuid) " +
                    "       join notes      n   on n.id=na.note_id      and n.del=0 " +
                    "       join dlg_alls   da  on da.id=n.dlg_all_id   and da.del=0 " +
                    "       join dialogs    d   on d.dlg_all_id = da.id " +
                    "       where s.del=0 and s.link_type_id=d.link_type_id" +
                    "   ) order by a.fam";
            return db.Query(con, sql, PinModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String AddPinsToLog(List<PinModel> pins) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)) {
            if(pins != null && pins.size() > 0) {
                Map<String, Object> params = new HashMap<>();
                String sql = "";
                sql = "select CURRENT_DATE dt, cast(to_char(NOW(), 'HH24:MI:SS') as time with time zone) tm";
                LogDateTimeModel dtm = db.Query(con, sql, LogDateTimeModel.class, null).get(0);
                // Заносим контакты в протокол
                for (PinModel pm : pins) {
                    params.clear();
                    params.put("NoteAbonId", pm.getNoteAbonId());
                    params.put("PinId", pm.getId());
                    params.put("date", dtm.getDt());
                    params.put("time", dtm.getTm());
                    sql = "insert into log (id, \"date\", \"time\", note_abon_id, pin_id, event_id, try_no) values " +
                            "(uuid_generate_v4(), :date, :time, cast(:NoteAbonId as uuid), cast(:PinId as uuid), " +
                            "(select id from events where code='NOTES_NO_POSSIBILITY'), 1)";
                    db.Execute(con, sql, params);
                }
            }
            con.commit();
            return "";
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public NoteFuncModel RunOrStopNotify(String noteId) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)) {
            Map<String,Object> params = new HashMap<>();
            params.put("noteId", UUID.fromString(noteId));
            String sql = "select \"value\" as srvAddress, '' errorMsg, '' successMsg, " +
                    "(select code from stts where id=(select stts_id from notes where id=:noteId)) sttsFlag " +
                    "from global_params where param_code='notify_server_addr' limit 1";
            NoteFuncModel nfm = db.Query(con, sql, NoteFuncModel.class, params).get(0);
            if(nfm.getSttsFlag().equals("002")) {
                sql = "update notes set stts_id=(select id from stts where code='000') where id=:noteId";
                db.Execute(con, sql, params);
            }
            con.commit();
            return nfm;
        }
        catch (Exception ex) {
            throw ex;
        }
    }
}
