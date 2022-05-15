package org.kaznalnrprograms.MCA.Notes.Dao;

import org.kaznalnrprograms.MCA.Notes.Interfaces.IPatternDao;
import org.kaznalnrprograms.MCA.Notes.Models.ListItemEditModel;
import org.kaznalnrprograms.MCA.Notes.Models.PatternEditModel;
import org.kaznalnrprograms.MCA.Notes.Models.PeriodTimeModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PatternDaoImpl implements IPatternDao {
    private String appName = "Notes - Менеджер заданий на оповещение";
    private DBUtils db;

    public PatternDaoImpl(DBUtils db){
        this.db = db;
    }

    @Override
    public PatternEditModel GetPatternFromId(String id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            PatternEditModel pattern = null;
            String sql = "select p.id id, p.\"name\" \"name\", p.all_flag allFlag, p.del del, NULL periodTime, " +
                    "to_char(p.created, 'dd.MM.yyyy HH24:MI:SS') created, " +
                    "p.creator creator, " +
                    "to_char(p.changed, 'dd.MM.yyyy HH24:MI:SS') changed, " +
                    "p.changer changer, NULL grps, NULL abons " +
                    "from patterns p where id=cast(:id as uuid)";
            pattern = db.Query(con, sql, PatternEditModel.class, params).get(0);
            pattern.setPeriodTime(GetPeriodAct(id, con));
            pattern.setGrps(GetAbonGrps(id, con));
            pattern.setAbons(GetAbons(id, con));
            return pattern;
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
            String sql = "select pa.id id, a.id itemId, a.fam||' '||a.ima||' '||a.otch||' ('||a.snils||')' \"name\", " +
                    "a.prior priority, pa.del del " +
                    "from pattern_abons pa " +
                    "join abons a on a.id=pa.abon_id " +
                    "where pa.pattern_id=cast(:parentId as uuid) and a.del=0 order by a.fam";
            return db.Query(_con, sql, ListItemEditModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    private List<ListItemEditModel> GetAbonGrps(String parentId, Connection con) throws Exception {
        final Connection _con = con == null ? db.getConnection(appName) : con;
        Map<String, Object> params = new HashMap<>();
        params.put("parentId", parentId);
        try(_con) {
            String sql = "select pg.id id, g.id itemId, g.code||' = '||g.\"name\" \"name\", " +
                    "NULL priority, pg.del del " +
                    "from pattern_grps pg " +
                    "join grps g on g.id=pg.grp_id " +
                    "where pg.pattern_id=cast(:parentId as uuid) and g.del=0 order by g.code";
            return db.Query(_con, sql, ListItemEditModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String DelPattern(String id) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "update patterns set del=(select (1-del) del from patterns where id=cast(:id as uuid)) where id=cast(:id as uuid)";
            db.Execute(con, sql, params);
            con.commit();
            return id;
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public ListItemEditModel LoadGrpFromId(String id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "select '' id, g.id itemId, g.code||' = '||g.\"name\" \"name\", " +
                    "NULL priority, 0 del " +
                    "from grps g  " +
                    "where g.id=cast(:id as uuid) and g.del=0";
            return db.Query(con, sql, ListItemEditModel.class, params).get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public ListItemEditModel LoadAbonFromId(String id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "select '' id, a.id itemId,  a.fam||' '||a.ima||' '||a.otch||' ('||a.snils||')' \"name\", " +
                    "a.prior priority, 0 del " +
                    "from abons a " +
                    "where a.id=cast(:id as uuid) and a.del=0";
            return db.Query(con, sql, ListItemEditModel.class, params).get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String SavePattern(PatternEditModel pattern) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)) {
            boolean isNew = pattern.getId() == null || pattern.getId().trim().length() == 0;
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("name", pattern.getName());
            params.put("allFlag", pattern.getAllFlag());
            params.put("day1", pattern.getPeriodTime().getDay1());
            params.put("day2", pattern.getPeriodTime().getDay2());
            params.put("day3", pattern.getPeriodTime().getDay3());
            params.put("day4", pattern.getPeriodTime().getDay4());
            params.put("day5", pattern.getPeriodTime().getDay5());
            params.put("day6", pattern.getPeriodTime().getDay6());
            params.put("day7", pattern.getPeriodTime().getDay7());
            params.put("dateStart", pattern.getPeriodTime().getDateStart());
            params.put("dateEnd", pattern.getPeriodTime().getDateEnd());
            params.put("timeStart", pattern.getPeriodTime().getTimeStart());
            params.put("timeEnd", pattern.getPeriodTime().getTimeEnd());
            if(isNew) {
                sql = "insert into patterns " +
                        "(id, \"name\", day_1, day_2, day_3, day_4, day_5, day_6, day_7, time_beg, time_end, date_beg, date_end, all_flag, del) " +
                        "values " +
                        "(uuid_generate_v4(), :name, :day1, :day2, :day3, :day4, :day5, :day6, :day7, " +
                        "cast(:timeStart as time without time zone), " +
                        "cast(:timeEnd as time without time zone), " +
                        "cast(:dateStart as date), " +
                        "cast(:dateEnd as date), " +
                        ":allFlag, 0)";
                pattern.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                db.CheckLock(con, -1, pattern.getId(), "patterns");
                params.put("id", pattern.getId());
                sql = "update patterns set " +
                        "\"name\"=:name, " +
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
                        "date_end=cast(:dateEnd as date)," +
                        "all_flag=:allFlag " +
                        "where id=cast(:id as uuid)";
                db.Execute(con, sql, params);
            }
            if(pattern.getAllFlag() != 1) {
                SaveGrps(con, pattern.getGrps(), pattern.getId());
                SaveAbons(con, pattern.getAbons(), pattern.getId());
            }
            con.commit();
            return pattern.getId();
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public PeriodTimeModel GetPeriodAct(String patternId) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            return GetPeriodAct(patternId, con);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    PeriodTimeModel GetPeriodAct(String patternId, Connection con) throws Exception {
        try{
            Map<String, Object> params = new HashMap<>();
            params.put("id", patternId);
            String sql = "select day_1 day1, day_2 day2, day_3 day3, day_4 day4, day_5 day5, " +
                    "day_6 day6, day_7 day7, time_beg timeStart, time_end timeEnd, to_char(date_beg, 'dd.MM.yyyy') dateStart, " +
                    "to_char(date_end, 'dd.MM.yyyy') dateEnd " +
                    "from patterns where id=cast(:id as uuid)";
            return db.Query(con, sql, PeriodTimeModel.class, params).get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    void SaveGrps(Connection con, List<ListItemEditModel> grps, String parentId) {
        try {
            for (ListItemEditModel grp : grps) {
                boolean isNew = grp.getId().contains("new_");
                if(isNew && grp.getDel() == 1) {
                    continue;
                }
                String sql = "";
                Map<String, Object> params = new HashMap<>();
                params.put("patternId", parentId);
                params.put("grpId", grp.getItemId());
                if(isNew) {
                    sql = "insert into pattern_grps (id, pattern_id, grp_id, del) values " +
                            "(uuid_generate_v4(), cast(:patternId as uuid), cast(:grpId as uuid), 0)";
                    db.Execute(con, sql, params);
                }
                else {
                    params.put("id", grp.getId());
                    params.put("del", grp.getDel());
                    sql = "update pattern_grps set " +
                            "pattern_id=cast(:patternId as uuid), " +
                            "grp_id=cast(:grpId as uuid), " +
                            "del=:del " +
                            "where id=cast(:id as uuid)";
                    db.Execute(con, sql, params);
                }
            }
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    void SaveAbons(Connection con, List<ListItemEditModel> abons, String parentId) {
        try {
            for (ListItemEditModel abon : abons) {
                boolean isNew = abon.getId().contains("new_");
                if(isNew && abon.getDel() == 1) {
                    continue;
                }
                String sql = "";
                Map<String, Object> params = new HashMap<>();
                params.put("patternId", parentId);
                params.put("abonId", abon.getItemId());
                if(isNew) {
                    sql = "insert into pattern_abons (id, pattern_id, abon_id, del) values " +
                            "(uuid_generate_v4(), cast(:patternId as uuid), cast(:abonId as uuid), 0)";
                    db.Execute(con, sql, params);
                }
                else {
                    params.put("id", abon.getId());
                    params.put("del", abon.getDel());
                    sql = "update pattern_abons set " +
                            "pattern_id=cast(:patternId as uuid), " +
                            "abon_id=cast(:abonId as uuid), " +
                            "del=:del " +
                            "where id=cast(:id as uuid)";
                    db.Execute(con, sql, params);
                }
            }
        }
        catch (Exception ex) {
            throw ex;
        }
    }
}
