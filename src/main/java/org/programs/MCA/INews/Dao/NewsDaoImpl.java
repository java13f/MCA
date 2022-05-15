package org.kaznalnrprograms.MCA.INews.Dao;

import org.kaznalnrprograms.MCA.INews.Interfaces.INewsDao;
import org.kaznalnrprograms.MCA.INews.Models.NewsFilterModel;
import org.kaznalnrprograms.MCA.INews.Models.NewsModel;
import org.kaznalnrprograms.MCA.INews.Models.NewsViewModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Repository
public class NewsDaoImpl implements INewsDao {
    private String appName = "Управление новостями";
    private DBUtils db;

    public NewsDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Получить список новостей
     * @param filter настройки фильтра
     * @return
     * @throws Exception
     */
    @Override
    public List<NewsViewModel> getList(NewsFilterModel filter) throws Exception {
        try(var con = db.getConnection(appName)){
            var params = new HashMap<String, Object>();
            var offset = (filter.getPage() -1 ) * filter.getRows();
            var sql = "SELECT n.id, to_char(n.date, 'dd.mm.yyyy HH24:MI:SS') date, n.title, n.status, n.del FROM i_news n WHERE 1=1";
            if(!filter.isShowDel()){
                sql += " AND n.del = 0";
            }
            if(filter.isChkDateBeg()){
                params.put("DateBeg", filter.getDateBeg());
                sql += " AND n.Date >= to_date(:DateBeg, 'dd.mm.yyyy')";
            }
            if(filter.isChkDateEnd()){
                params.put("DateEnd", filter.getDateEnd());
                sql += " AND n.Date < to_date(:DateEnd, 'dd.mm.yyyy') + interval '1' day";
            }
            sql += " order by date desc";
            sql+=" OFFSET "+offset;
            sql+=" LIMIT "+filter.getRows();
            return db.Query(con, sql, NewsViewModel.class, params);
        }
    }
    /**
     * Получить общее количество новостей
     * @param filter фильтр по новостям
     * @return
     * @throws Exception
     */
    @Override
    public int getTotalNews(NewsFilterModel filter) throws Exception {
        try(var con = db.getConnection(appName)){
            var params = new HashMap<String, Object>();
            var sql = "SELECT count(*) FROM i_news n WHERE 1=1";
            if(!filter.isShowDel()){
                sql += " AND n.del = 0";
            }
            if(filter.isChkDateBeg()){
                params.put("DateBeg", filter.getDateBeg());
                sql += " AND n.Date >= to_date(:DateBeg, 'dd.mm.yyyy')";
            }
            if(filter.isChkDateEnd()){
                params.put("DateEnd", filter.getDateEnd());
                sql += " AND n.Date < to_date(:DateEnd, 'dd.mm.yyyy') + interval '1' day";
            }
            return db.Query(con, sql, Integer.class, params).get(0);
        }
    }

    /**
     * Получить новость для редаитрования
     * @param id иденификатор новости
     * @return
     * @throws Exception
     */
    @Override
    public NewsModel get(String id) throws Exception{
        try(var con = db.getConnection(appName)){
            var params = new HashMap<String, Object>();
            params.put("id", UUID.fromString(id));
            var sql = "SELECT id, to_char(date, 'dd.mm.yyyy HH24:MI:SS') as date, description, content, status,title,\n" +
                    " COALESCE(creator, '') AS creator, COALESCE(to_char(created, 'dd.mm.yyyy HH24:MI:SS'), '') as created,\n" +
                    " COALESCE(changer, '') AS changer, COALESCE(to_char(changed, 'dd.mm.yyyy HH24:MI:SS'), '') as changed, del\n" +
                    " FROM I_NEWS WHERE id = :id";
            var news = db.Query(con, sql, NewsModel.class, params);
            if(news.size() == 0){
                throw new Exception("Не удалось получить новость с Id = " + id);
            }
            return news.get(0);
        }
    }

    /**
     * Сохранение новости
     * @param model модель новости
     * @return
     * @throws Exception
     */
    @Override
    public String save(NewsModel model) throws Exception{
        try(var con = db.getConnection(appName)){
            var sql = "";
            var params = new HashMap<String, Object>();
            params.put("date", model.getDate());
            params.put("title", model.getTitle());
            params.put("description", model.getDescription());
            params.put("content", model.getContent());
            if(model.getId().isEmpty()){
                sql = "INSERT INTO i_news (ID, date, title, description, content, status, del)\n" +
                        " VALUES(uuid_generate_v4(), to_timestamp(:date, 'dd.mm.yyyy HH24:MI:SS'), :title, :description, :content, " + model.getStatus() + ", 0)";
                model.setId(db.Execute(con, sql, UUID.class, params).toString());
            }
            else{
                params.put("id", UUID.fromString(model.getId()));
                db.CheckLock(con, -1, model.getId(), "i_news");
                sql = "UPDATE i_news SET date = to_timestamp(:date, 'dd.mm.yyyy HH24:MI:SS'), title = :title, description = :description, content = :content, status = " + model.getStatus() + " \n" +
                        " WHERE id = :id";
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
    }

    /**
     * Удаление новости
     * @param id идентификатор новости
     * @throws Exception
     */
    @Override
    public void delete(String id) throws Exception {
        try(var con = db.getConnection(appName)){
            var params = new HashMap<String, Object>();
            params.put("id", UUID.fromString(id));
            var sql = "UPDATE i_news SET del = 1 - del WHERE id = :id";
            db.Execute(con, sql, params);
        }
    }
}
