package org.kaznalnrprograms.MCA.DialogsList.Dao;

import org.kaznalnrprograms.MCA.DialogsList.Innterfaces.IDialogsListDao;
import org.kaznalnrprograms.MCA.DialogsList.Models.DialogsListViewModel;
import org.kaznalnrprograms.MCA.DialogsList.Models.FilterModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class DialogsListDaoImpl implements IDialogsListDao {
    private String appName = "DialogsList - Список диалогов";
    private DBUtils db;

    public DialogsListDaoImpl(DBUtils db){
        this.db = db;
    }

    @Override
    public List<DialogsListViewModel> GetList(FilterModel filter) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String txtFilter = filter.getText().trim();
            Map<String, Object> params = new HashMap<>();
            String fltr = "";
            if(txtFilter.length() > 0) {
                params.put("txt", txtFilter);
                fltr = " and (code ilike '%'||:txt||'%' or name ilike '%'||:txt||'%')";
            }
            String sql = "select id, code, \"name\", is_active isActive from dlg_alls where del=0" + fltr;
            return db.Query(con, sql, DialogsListViewModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }
}
