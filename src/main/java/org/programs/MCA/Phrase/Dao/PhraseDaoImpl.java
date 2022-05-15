package org.kaznalnrprograms.MCA.Phrase.Dao;

import org.kaznalnrprograms.MCA.Phrase.Interfaces.IPhraseDao;
import org.kaznalnrprograms.MCA.Phrase.Models.*;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PhraseDaoImpl implements IPhraseDao {
    private String appName = "Phrase - модуль работы с фразами";
    private DBUtils db;

    public PhraseDaoImpl(DBUtils db){
        this.db = db;
    }

    @Override
    public List<PhraseGroupViewModel> GetPhraseGroups(GroupFilterModel groupFilter) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String sql = "select pg.id id, pg.code code, pg.\"name\" \"name\", vt.name voice, pg.del del " +
                    "from phrase_grps pg " +
                    "join voice_types vt on vt.id=pg.voice_type_id " +
                    "WHERE 1=1 " +
                    (!groupFilter.isShowDel() ? "AND pg.del=0 " : " ") +
                    "order by pg.code";
            return db.Query(con, sql, PhraseGroupViewModel.class, null);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<PhraseViewModel> GetPhrases(PhraseFilterModel phraseFilter) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("phraseGrpId", phraseFilter.getPhraseGrpId());
            boolean isFilterCode = phraseFilter.getFilter().getCode() != null && phraseFilter.getFilter().getCode().trim().length() > 0;
            boolean isFilterName = phraseFilter.getFilter().getText() != null && phraseFilter.getFilter().getText().trim().replace("+", "").length() > 0;
            boolean isFilterFileName= phraseFilter.getFilter().getFilename() != null && phraseFilter.getFilter().getFilename().trim().length() > 0;
            boolean isFilterDelVisible= phraseFilter.getFilter().isShowdel();
            StringBuilder sb = new StringBuilder();
            if(isFilterCode) {
                params.put("filtercode", phraseFilter.getFilter().getCode().trim());
                sb.append(" and lower(p.code) like '%'||lower(:filtercode)||'%'");
            }
            if(isFilterName) {
                params.put("filtername", phraseFilter.getFilter().getText().trim().replace("+", ""));
                sb.append(" and replace(lower(p.name), '+', '') like '%'||lower(:filtername)||'%'");
            }
            if(isFilterFileName) {
                params.put("filterfilename", phraseFilter.getFilter().getFilename().trim());
                sb.append(" and lower(p.org_file_name) like '%'||lower(:filterfilename)||'%'");
            }
            if(!isFilterDelVisible) {
                sb.append(" and p.del=0");
            }
            String sql = "select p.id id, p.code code, p.\"name\" \"name\", p.org_file_name orgFileName, p.del del " +
                    "from phrases p " +
                    "join phrase_grps pg on pg.id=p.phrase_grp_id " +
                    "WHERE p.phrase_grp_id=cast(:phraseGrpId as uuid) and pg.del=0 " + sb.toString() + " order by p.code";
            return db.Query(con, sql, PhraseViewModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public RightModel GetActRights() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT get_act_rights('Phrase', 'PhraseChange') phraseChange, " +
                    "get_act_rights('Phrase', 'PhraseDel') phraseDel, " +
                    "get_act_rights('Phrase', 'PhraseGrpDel') phraseGrpDel, " +
                    "get_act_rights('Phrase', 'PhraseGrpChange') phraseGrpChange, " +
                    "get_act_rights('Phrase', 'PhraseView') phraseView";
            return db.Query(con, sql, RightModel.class, null).get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
