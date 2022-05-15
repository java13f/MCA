package org.kaznalnrprograms.MCA.AbonList.Dao;

import org.kaznalnrprograms.MCA.AbonList.Interfaces.IAbonList;
import org.kaznalnrprograms.MCA.AbonList.Models.AbonViewModel;
import org.kaznalnrprograms.MCA.AbonList.Models.FilterModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Repository
public class AbonListDaoImpl implements IAbonList {

    private String appName = "AbonList - Список абонентов";
    private DBUtils db;

    public AbonListDaoImpl(DBUtils db) {
        this.db = db;
    }

    @Override
    public int getTotalAbons(FilterModel filter) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();

            String sql = "";

            sql += "select count(*) " +
                    "from abons a " +
                    "where 1=1 ";

            if (!filter.isShowDel()) {
                sql += " AND a.del = 0 ";
            }


            if (filter.getSnils().trim().length() > 0) {
                params.put("snils", filter.getSnils().trim());
                sql += " AND a.snils ILIKE '%'||:snils||'%' ";
            }

            if (filter.getSurname().trim().length() > 0) {
                params.put("surname", filter.getSurname().trim());
                sql += " AND a.fam ILIKE '%'||:surname||'%' ";
            }

            if (filter.getName().trim().length() > 0) {
                params.put("name", filter.getName().trim());
                sql += " AND a.ima ILIKE '%'||:name||'%' ";
            }

            if (filter.getOname().trim().length() > 0) {
                params.put("oname", filter.getOname().trim());
                sql += " AND a.otch ILIKE '%'||:oname||'%' ";
            }

            boolean isNumber = filter.getPriority().trim().matches("-?(0|[1-9]\\d*)");
            if (isNumber) {
                params.put("priority", Integer.parseInt(filter.getPriority().trim()));
                sql += " AND a.prior = :priority ";
            } else if (filter.getPriority().trim().length() > 0 && filter.getPriority().trim().equals("null")) {
                sql += " AND a.prior isnull ";
            } else if (filter.getPriority().trim().length() > 0) {
                sql += " AND a.prior = -1 ";
            }

            return db.Query(con, sql, Integer.class, params).get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Получить список абонентов для грида
     *
     * @param filter - фильтр по коду терртиорий
     * @return
     * @throws Exception
     */
    @Override
    public List<AbonViewModel> listAbon(FilterModel filter) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();

            int offset = (filter.getPage() - 1) * filter.getRows();
            String sql = "";


            sql += "select a.id, a.prior, a.snils, a.fam, a.ima, a.otch, a.del " +
                    "from abons a " +
                    "where 1=1 ";

            if (!filter.isShowDel()) { //&& !filter.isShowAbonsInGroup()
                sql += " AND a.del = 0 ";
            }


            if (filter.getSnils().trim().length() > 0) {
                params.put("snils", filter.getSnils().trim());
                sql += " AND a.snils ILIKE '%'||:snils||'%' ";
            }

            if (filter.getSurname().trim().length() > 0) {
                params.put("surname", filter.getSurname().trim());
                sql += " AND a.fam ILIKE '%'||:surname||'%' ";
            }

            if (filter.getName().trim().length() > 0) {
                params.put("name", filter.getName().trim());
                sql += " AND a.ima ILIKE '%'||:name||'%' ";
            }

            if (filter.getOname().trim().length() > 0) {
                params.put("oname", filter.getOname().trim());
                sql += " AND a.otch ILIKE '%'||:oname||'%' ";
            }


            boolean isNumber = filter.getPriority().trim().matches("-?(0|[1-9]\\d*)");
            if (isNumber) {
                params.put("priority", Integer.parseInt(filter.getPriority().trim()));
                sql += " AND a.prior = :priority ";
            } else if (filter.getPriority().trim().length() > 0 && filter.getPriority().trim().equals("null")) {
                sql += " AND a.prior isnull ";
            } else if (filter.getPriority().trim().length() > 0) {
                sql += " AND a.prior = -1 ";
            }

            sql += " ORDER BY a.fam, a.ima, a.otch ";

            sql += " OFFSET " + offset;
            sql += " LIMIT " + filter.getRows();

            List<AbonViewModel> xxx = db.Query(con, sql, AbonViewModel.class, params);

            return xxx;
        } catch (Exception ex) {
            throw ex;
        }
    }


}
