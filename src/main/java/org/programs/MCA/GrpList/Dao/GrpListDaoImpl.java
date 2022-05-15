package org.kaznalnrprograms.MCA.GrpList.Dao;

import org.kaznalnrprograms.MCA.GrpList.Models.FilterModel;
import org.kaznalnrprograms.MCA.GrpList.Models.GroupViewModel;
import org.kaznalnrprograms.MCA.GrpList.Interfaces.IGrpList;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class GrpListDaoImpl implements IGrpList {
    private String appName = "GrpList - Список групп";
    private DBUtils db;

    public GrpListDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Получить список групп для грида
     *
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    @Override
    public List<GroupViewModel> listGroup(FilterModel filter) throws Exception {

        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "select g.id, g.code, g.name, g.del " +
                    "from grps g " +
                    "where 1=1 ";

            if (!filter.isShowDel()) {
                sql += " AND g.del = 0 ";
            }

            if(filter.getCode().trim().length() > 0){
                params.put("code", filter.getCode().trim());
                sql += " AND g.code ILIKE '%'||:code||'%' ";
            }

            if (filter.getName().trim().length() > 0) {
                params.put("name", filter.getName().trim());
                sql += " AND g.name ILIKE '%'||:name||'%' ";
            }

            sql += " order by g.code";

            List<GroupViewModel> result = db.Query(con, sql, GroupViewModel.class, params);
            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }
}
