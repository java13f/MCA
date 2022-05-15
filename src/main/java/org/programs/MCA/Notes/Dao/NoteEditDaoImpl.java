package org.kaznalnrprograms.MCA.Notes.Dao;

import org.kaznalnrprograms.MCA.Notes.Interfaces.INoteEditDao;
import org.kaznalnrprograms.MCA.Notes.Models.DialogAllModel;
import org.kaznalnrprograms.MCA.Notes.Models.ListItemEditModel;
import org.kaznalnrprograms.MCA.Notes.Models.NoteEditModel;
import org.kaznalnrprograms.MCA.Notes.Models.PeriodTimeModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class NoteEditDaoImpl implements INoteEditDao {
    private String appName = "Notes - Менеджер заданий на оповещение";
    private DBUtils db;

    public NoteEditDaoImpl(DBUtils db){
        this.db = db;
    }

    @Override
    public NoteEditModel GetNoteFromId(String id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            NoteEditModel note = null;
            String sql = "select n.id id, n.pattern_id patternId, to_char(n.date, 'dd.MM.yyyy HH24:MI:SS') date, " +
                    "n.\"name\" \"name\", NULL dialogAll, " +
                    "NULL dialogAll, st.\"name\" stts, NULL periodTime, " +
                    "to_char(n.created, 'dd.MM.yyyy HH24:MI:SS') created, " +
                    "n.creator creator, " +
                    "to_char(n.changed, 'dd.MM.yyyy HH24:MI:SS') changed, " +
                    "n.changer changer, NULL abons " +
                    "from notes n " +
                    "join stts st on st.id=n.stts_id " +
                    "where n.id=cast(:id as uuid)";
            note = db.Query(con, sql, NoteEditModel.class, params).get(0);
            sql = "select day_1 day1, day_2 day2, day_3 day3, day_4 day4, day_5 day5, " +
                    "day_6 day6, day_7 day7, " +
                    "time_beg timeStart, time_end timeEnd, " +
                    "to_char(date_beg, 'dd.MM.yyyy') dateStart, to_char(date_end, 'dd.MM.yyyy') dateEnd " +
                    "from notes where id=cast(:id as uuid)";
            note.setPeriodTime(db.Query(con, sql, PeriodTimeModel.class, params).get(0));
            params.clear();
            params.put("noteId", note.getId());
            sql = "select dg.id id, dg.code||' = '||dg.\"name\" \"name\" from notes n " +
                    "join dlg_alls dg on dg.id=n.dlg_all_id " +
                    "where n.id=cast(:noteId as uuid) and dg.del=0";
            note.setDialogAll(db.Query(con, sql, DialogAllModel.class, params).get(0));
            note.setAbons(GetAbons(id, con));
            return note;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public DialogAllModel GetDialogAllFromId(String id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "select dg.id id, dg.code||' = '||dg.\"name\" \"name\" from dlg_alls dg " +
                    "where id=cast(:id as uuid)";
            return db.Query(con, sql, DialogAllModel.class, params).get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String DelNote(String id) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "update notes set del=(select (1-del) del from notes where id=cast(:id as uuid)) " +
                    "where id=cast(:id as uuid) " +
                    "and stts_id<>(select id from stts where code='001')";
            db.Execute(con, sql, params);
            con.commit();
            return id;
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String SaveNote(NoteEditModel note) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)) {
            boolean isNew = note.getId() == null || note.getId().trim().length() == 0;
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("patternId", note.getPatternId());
            params.put("name", note.getName());
            params.put("dlgAllId", note.getDialogAll().getId());
            params.put("day1", note.getPeriodTime().getDay1());
            params.put("day2", note.getPeriodTime().getDay2());
            params.put("day3", note.getPeriodTime().getDay3());
            params.put("day4", note.getPeriodTime().getDay4());
            params.put("day5", note.getPeriodTime().getDay5());
            params.put("day6", note.getPeriodTime().getDay6());
            params.put("day7", note.getPeriodTime().getDay7());
            params.put("dateStart", note.getPeriodTime().getDateStart());
            params.put("dateEnd", note.getPeriodTime().getDateEnd());
            params.put("timeStart", note.getPeriodTime().getTimeStart());
            params.put("timeEnd", note.getPeriodTime().getTimeEnd());
            if(isNew) {
                sql = "insert into notes (id, pattern_id, \"date\", \"name\", " +
                        "dlg_all_id, day_1, day_2, day_3, day_4, day_5, day_6, day_7, date_beg, date_end, time_beg, time_end, stts_id, del) " +
                        "values " +
                        "(uuid_generate_v4(), cast(:patternId as uuid), cast(NOW() as timestamp), :name, cast(:dlgAllId as uuid), " +
                        ":day1, :day2, :day3, :day4, :day5, :day6, :day7, " +
                        "cast(:dateStart as date), " +
                        "cast(:dateEnd as date), " +
                        "cast(:timeStart as time without time zone), " +
                        "cast(:timeEnd as time without time zone), " +
                        "(select id from stts where code='000'), 0)";
                note.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                db.CheckLock(con, -1, note.getId(), "notes");
                params.put("id", note.getId());
                sql = "update notes set " +
                        "pattern_id=cast(:patternId as uuid), " +
                        "\"name\"=:name, " +
                        "dlg_all_id=cast(:dlgAllId as uuid), " +
                        "day_1=:day1, " +
                        "day_2=:day2, " +
                        "day_3=:day3, " +
                        "day_4=:day4, " +
                        "day_5=:day5, " +
                        "day_6=:day6, " +
                        "day_7=:day7, " +
                        "time_beg=cast(:timeStart as time without time zone), " +
                        "time_end=cast(:timeEnd as time without time zone), " +
                        "date_beg=cast(:dateStart as date), " +
                        "date_end=cast(:dateEnd as date) " +
                        "where id=cast(:id as uuid)";
                db.Execute(con, sql, params);
            }
            SaveAbons(con, note.getAbons(), note.getId());
            con.commit();
            return note.getId();
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    void SaveAbons(Connection con, List<ListItemEditModel> abons, String noteId) {
        try {
            for (ListItemEditModel abon : abons) {
                boolean isNew = abon.getId().contains("new_");
                if(isNew && abon.getDel() == 1) {
                    continue;
                }
                String sql = "";
                Map<String, Object> params = new HashMap<>();
                params.put("noteId", noteId);
                params.put("abonId", abon.getItemId());
                params.put("priority", abon.getPriority() != null && abon.getPriority().trim().length() > 0 ? abon.getPriority().trim() : null);
                if(isNew) {
                    sql = "insert into note_abons " +
                            "(id, note_id, abon_id, prior, server_type_id, pin_no, server_id, server_pp_id, stts_id, res_flag_id, del) " +
                            "values " +
                            "(" +
                            "uuid_generate_v4(), " +
                            "cast(:noteId as uuid), " +
                            "cast(:abonId as uuid), " +
                            (params.get("priority") == null ? "NULL, " : "cast(:priority as integer), " ) +
                            "NULL, NULL, NULL, NULL," +
                            "(select id from stts where code='000'), " +
                            "(select id from res_flags where code='000'), 0" +
                            ")";
                    if(params.get("priority") == null) {
                        params.remove("priority");
                    }
                    db.Execute(con, sql, params);
                }
                else {
                    params.put("id", abon.getId());
                    params.put("del", abon.getDel());
                    sql = "update note_abons set " +
                            "note_id=cast(:noteId as uuid), " +
                            "abon_id=cast(:abonId as uuid), " +
                            (params.get("priority") == null ? "prior=NULL, " : "prior=cast(:priority as integer), " ) +
                            "del=:del " +
                            "where id=cast(:id as uuid)";
                    if(params.get("priority") == null) {
                        params.remove("priority");
                    }
                    db.Execute(con, sql, params);
                }
            }
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<ListItemEditModel> GetListItemsFromPatternId(String patternId) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("patternId", patternId);
            String sql = "select all_flag from patterns where id=cast(:patternId as uuid)";
            Integer allFlag = db.Query(con, sql, Integer.class, params).get(0);
            List<ListItemEditModel> abons = null;
            if(allFlag == 1) {
                sql = "select '' id, a.id itemId, a.fam||' '||a.ima||' '||a.otch||' ('||a.snils||')' \"name\", " +
                        "a.prior priority, 0 del " +
                        "from abons a where a.del=0 order by a.fam";
                abons = db.Query(con, sql, ListItemEditModel.class, null);
            }
            else {
                sql = "select distinct * from (" +
                        "select '' id, a.id itemId, a.fam||' '||a.ima||' '||a.otch||' ('||a.snils||')' \"name\"," +
                        "a.prior priority, 0 del " +
                        "from patterns p " +
                        "join pattern_abons pa on pa.pattern_id=p.id " +
                        "join abons a on a.id=pa.abon_id " +
                        "where p.id=cast(:patternId as uuid) " +
                        "and a.del=0 " +
                        "and pa.del=0" +

                        "union all " +

                        "select '' id, a.id itemId, a.fam||' '||a.ima||' '||a.otch||' ('||a.snils||')' \"name\", " +
                        "a.prior priority, 0 del " +
                        "from patterns p " +
                        "join pattern_grps gp on gp.pattern_id=p.id " +
                        "join grps g on g.id=gp.grp_id " +
                        "join abon_grps ag on ag.grp_id=g.id " +
                        "join abons a on a.id=ag.abon_id " +
                        "where p.id=cast(:patternId as uuid) " +
                        "and a.del=0 " +
                        "and g.del=0 " +
                        "and gp.del=0 " +
                        "and ag.del=0" +
                ") a order by a.\"name\"";
                abons = db.Query(con, sql, ListItemEditModel.class, params);
            }
            if(abons != null) {
                String prefix = "new_";
                for(int i = 0; i < abons.size(); i++) {
                    abons.get(i).setId(prefix + (i + 1));
                }
            }
            return abons;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    private List<ListItemEditModel> GetAbons(String parentId, Connection con) throws Exception {
        final Connection _con = con == null ? db.getConnection(appName) : con;
        Map<String, Object> params = new HashMap<>();
        params.put("parentId", parentId);
        try(_con) {
            String sql = "select na.id id, a.id itemId, a.fam||' '||a.ima||' '||a.otch||' ('||a.snils||')' \"name\", " +
                    "na.prior priority, na.del del " +
                    "from note_abons na " +
                    "join abons a on a.id=na.abon_id " +
                    "where na.note_id=cast(:parentId as uuid) and a.del=0 order by a.fam";
            return db.Query(_con, sql, ListItemEditModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }
}
