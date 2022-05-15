package org.kaznalnrprograms.MCA.jrResultOfNotification.Dao;

import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.kaznalnrprograms.MCA.jrResultOfNotification.Interfaces.IjrResultOfNotificationDao;
import org.kaznalnrprograms.MCA.jrResultOfNotification.Models.NoteModel;
import org.kaznalnrprograms.MCA.jrResultOfNotification.Models.TimeModel;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class jrResultOfNotificationDaoImpl implements IjrResultOfNotificationDao {
    private String appName = "jrResultOfNotification - результаты оповещения";
    private DBUtils db;

    public jrResultOfNotificationDaoImpl(DBUtils db) {
        this.db = db;
    }

    /*
    Получить оповещения по дате
     */
    @Override
    public List<NoteModel> getNotesByDate(String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("date", date);
            String sql =
                    "SELECT DISTINCT ON (n.id) n.id, n.name " +
                    "FROM log l " +
                    "JOIN note_abons na on l.note_abon_id = na.id " +
                    "JOIN notes n ON na.note_id = n.id " +
                    "WHERE l.date = :date::date";
            List<NoteModel> result = db.Query(con, sql, NoteModel.class, params);
            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*
    Получить список времён оповещения по дате и идентификатору оповещения
     */
    @Override
    public List<TimeModel> getListTimeByNoteAndDate(String note_id, String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("note_id", UUID.fromString(note_id));
            params.put("date", date);
            String sql = "SELECT DISTINCT ON (l.time) l.time FROM log l " +
                    "JOIN note_abons na on l.note_abon_id = na.id " +
                    "JOIN notes n ON na.note_id = n.id " +
                    "WHERE n.id = :note_id " +
                    "AND l.date = :date::date";
            List<TimeModel> result = db.Query(con, sql, TimeModel.class, params);
            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }
}