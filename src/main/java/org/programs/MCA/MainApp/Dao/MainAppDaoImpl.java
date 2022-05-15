package org.kaznalnrprograms.MCA.MainApp.Dao;

import org.kaznalnrprograms.MCA.MainApp.Interfaces.IMainAppDao;
import org.kaznalnrprograms.MCA.MainApp.Models.AppModel;
import org.kaznalnrprograms.MCA.MainApp.Models.NewsModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.sql.Timestamp;
import java.util.*;

@Repository
public class MainAppDaoImpl implements IMainAppDao {
    private String appName = "MainApp - главное меню";
    private DBUtils db;

    MainAppDaoImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Получить приложения для построения меню
     * @return
     * @throws Exception
     */
    @Override
    public List<AppModel> getApps() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT id, COALESCE(CAST(parent_id AS character varying), '') parent_id, code, name, sort_code, type, iconCls, url FROM i_apps WHERE (get_app_rights(code) = 1 OR code IN ('OtherCategory', 'MainApp')) AND del = 0 ORDER BY Sort_Code, Name";
            return db.Query(con, sql, AppModel.class, null);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить новость
     * @param id идентификатор новости
     * @return
     */
    public NewsModel getOneNews(String id) throws Exception {
        try(var con = db.getConnection(appName)){
            var params = new HashMap<String, Object>();
            params.put("id", UUID.fromString(id));
            var date = new Date();
            var c = Calendar.getInstance();
            c.setTime(date);
            c.add(Calendar.DATE, 1);
            date = c.getTime();
            params.put("DateEnd", new Timestamp(date.getTime()));
            var sql = "SELECT id, to_char(date, 'dd.mm.yyyy') as date, title, description, content FROM i_news WHERE id = :id AND status = 1 AND del = 0 AND date < :DateEnd";
            var news = db.Query(con, sql, NewsModel.class, params);
            if(news.size() == 0){
                throw new Exception("Новость с ID = " + id + " не найдена");
            }
            return news.get(0);
        }
    }
    /**
     * Получить новости
     * @param rows количество новостей на странице
     * @param page страница
     * @param total общее количество новостей
     * @return
     */
    @Override
    public List<NewsModel> getNews(int rows, int page, int total) throws Exception{
        try(var con = db.getConnection(appName)){
            var params = new HashMap<String, Object>();
            var offset = (page - 1) * rows;
            var date = new Date();
            var c = Calendar.getInstance();
            c.setTime(date);
            c.add(Calendar.DATE, 1);
            date = c.getTime();
            params.put("DateEnd", new Timestamp(date.getTime()));
            var sql = "SELECT id, to_char(date, 'dd.mm.yyyy') as date, title, description, '' as content FROM i_news WHERE status = 1 AND del = 0 AND date < :DateEnd order by i_news.date DESC";
            sql+=" OFFSET " + offset;
            sql+=" LIMIT " + rows;
            return db.Query(con, sql, NewsModel.class, params);
        }
    }
    /**
     * Получить общее количество новостей
     * @return
     */
    @Override
    public int getNewsTotal() throws Exception{
        try(var con = db.getConnection(appName)){
            var params = new HashMap<String, Object>();
            var date = new Date();
            var c = Calendar.getInstance();
            c.setTime(date);
            c.add(Calendar.DATE, 1);
            date = c.getTime();
            params.put("DateEnd", new Timestamp(date.getTime()));
            var sql = "SELECT count(*) FROM i_news WHERE status = 1 AND del = 0 AND date < :DateEnd";
            return db.Query(con, sql, Integer.class, params).get(0);
        }
    }
}
