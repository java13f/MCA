package org.kaznalnrprograms.MCA.Abons.Dao;

import org.kaznalnrprograms.MCA.Abons.Interfaces.IAbons;
import org.kaznalnrprograms.MCA.Abons.Models.*;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class AbonsDaoImpl implements IAbons {

    private String appName = "Abons - Администратор абонентов.";
    private DBUtils db;

    public AbonsDaoImpl(DBUtils db){
        this.db = db;
    }

    /**
     * Проверка прав
     * @return
     * @throws Exception
     */
    @Override
    public AbonsRightModel GetActRights() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT get_act_rights('Abons', 'AbonGroupsView') abonGroupsView, " +
                    "get_act_rights('Abons', 'AbonChange') abonChange, " +
                    "get_act_rights('Abons', 'AbonDel') abonDel, " +
                    "get_act_rights('Abons', 'GroupChange') groupChange, " +
                    "get_act_rights('Abons', 'GroupDel') groupDel, " +
                    "get_act_rights('Abons', 'AbonGroupAdd') abonGroupAdd, " +
                    "get_act_rights('Abons', 'AbonGroupDel') abonGroupDel";

            return db.Query(con, sql, AbonsRightModel.class, null).get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }


    @Override
    public int getTotalAbons(FilterModel filter) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();

            String sql = "";

            if (filter.isShowAbonsInGroup()){
                if(filter.getGroupId().length() == 0){
                    filter.setGroupId("00000000-0000-0000-0000-000000000000");
                }

                params.put("grpid", UUID.fromString(filter.getGroupId()));

                sql += "select count(*) " +
                        "from abon_grps ag " +
                        "inner join abons a on a.id = ag.abon_id " +
                        "where ag.grp_id = :grpid ";

                if ( !filter.isShowDel() ){ //&& filter.isShowAbonsInGroup()
                    sql += " AND ag.del = 0 ";
                }
            }
            else{
                sql += "select count(*) " +
                        "from abons a " +
                        "where 1=1 ";

                if ( !filter.isShowDel() ){ //&& !filter.isShowAbonsInGroup()
                    sql += " AND a.del = 0 ";
                }
            }


            if(filter.getSnils().trim().length() > 0) {
                params.put("snils", filter.getSnils().trim());
                sql += " AND a.snils ILIKE '%'||:snils||'%' ";
            }

            if(filter.getSurname().trim().length() > 0) {
                params.put("surname", filter.getSurname().trim());
                sql += " AND a.fam ILIKE '%'||:surname||'%' ";
            }

            if(filter.getName().trim().length() > 0) {
                params.put("name", filter.getName().trim());
                sql += " AND a.ima ILIKE '%'||:name||'%' ";
            }

            if(filter.getOname().trim().length() > 0) {
                params.put("oname", filter.getOname().trim());
                sql += " AND a.otch ILIKE '%'||:oname||'%' ";
            }

            boolean isNumber = filter.getPriority().trim().matches("-?(0|[1-9]\\d*)");
            if(isNumber){
                params.put("priority",  Integer.parseInt(filter.getPriority().trim()));
                sql += " AND a.prior = :priority ";
            } else if(filter.getPriority().trim().length() > 0 && filter.getPriority().trim().equals("null")){
                sql += " AND a.prior isnull ";
            } else if( filter.getPriority().trim().length() > 0 ){
                sql += " AND a.prior = -1 ";
            }

            return db.Query(con, sql, Integer.class, params).get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }



    /**
     * Получить список абонентов для грида
     * @param filter - фильтр по коду терртиорий
     * @return
     * @throws Exception
     */
    @Override
    public List<AbonViewModel> listAbon(FilterModel filter) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();

            int offset = (filter.getPage() -1 ) * filter.getRows();
            String sql = "";

            if (filter.isShowAbonsInGroup()){
                if(filter.getGroupId().length() == 0){
                    filter.setGroupId("00000000-0000-0000-0000-000000000000");
                }

                params.put("grpid", UUID.fromString(filter.getGroupId()));

                sql += "select a.id, a.prior, a.snils, a.fam, a.ima, a.otch, ag.del " +
                        "from abon_grps ag " +
                        "inner join abons a on a.id = ag.abon_id " +
                        "where ag.grp_id = :grpid ";

                if ( !filter.isShowDel() ){ //&& filter.isShowAbonsInGroup()
                    sql += " AND ag.del = 0 ";
                }
            }
            else{
                sql += "select a.id, a.prior, a.snils, a.fam, a.ima, a.otch, a.del " +
                        "from abons a " +
                        "where 1=1 ";

                if ( !filter.isShowDel() ){ //&& !filter.isShowAbonsInGroup()
                    sql += " AND a.del = 0 ";
                }
            }

            if(filter.getSnils().trim().length() > 0) {
                params.put("snils", filter.getSnils().trim());
                sql += " AND a.snils ILIKE '%'||:snils||'%' ";
            }

            if(filter.getSurname().trim().length() > 0) {
                params.put("surname", filter.getSurname().trim());
                sql += " AND a.fam ILIKE '%'||:surname||'%' ";
            }

            if(filter.getName().trim().length() > 0) {
                params.put("name", filter.getName().trim());
                sql += " AND a.ima ILIKE '%'||:name||'%' ";
            }

            if(filter.getOname().trim().length() > 0) {
                params.put("oname", filter.getOname().trim());
                sql += " AND a.otch ILIKE '%'||:oname||'%' ";
            }


            boolean isNumber = filter.getPriority().trim().matches("-?(0|[1-9]\\d*)");
            if(isNumber){
                params.put("priority",  Integer.parseInt(filter.getPriority().trim()));
                sql += " AND a.prior = :priority ";
            } else if(filter.getPriority().trim().length() > 0 && filter.getPriority().trim().equals("null")){
                sql += " AND a.prior isnull ";
            } else if( filter.getPriority().trim().length() > 0 ){
                sql += " AND a.prior = -1 ";
            }

            sql += " ORDER BY a.fam, a.ima, a.otch ";

            sql+=" OFFSET "+offset;
            sql+=" LIMIT "+filter.getRows();

            List<AbonViewModel> xxx = db.Query(con, sql, AbonViewModel.class, params);

            return xxx;
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Получить список групп для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    @Override
    public List<GroupViewModel> listGroup(FilterModel filter) throws Exception {

        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "";

            if(filter.getAbonId().length() == 0){
                filter.setAbonId("00000000-0000-0000-0000-000000000000");
            }

            if (filter.isShowGroupsAbon()){ //Группы абонента
                params.put("abonid", UUID.fromString(filter.getAbonId()));
                sql += "select g.id, g.code, g.name, ag.del " +
                        "from abon_grps ag " +
                        "inner join grps g on g.id = ag.grp_id " +
                        "where ag.abon_id = :abonid ";

                if ( !filter.isShowDel() ){ //&& filter.isShowGroupsAbon()
                    sql += " AND ag.del = 0 ";
                }
            }
            else { //все группы
                sql += "select g.id, g.code, g.name, g.del " +
                       "from grps g " +
                       "where 1=1 ";

                if ( !filter.isShowDel() ){ //&& !filter.isShowAbonsInGroup()
                    sql += " AND g.del = 0 ";
                }
            }


            sql += " order by g.code";

            List<GroupViewModel> result = db.Query(con, sql, GroupViewModel.class, params);
            return result;
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Получить список абонентов в группе для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    @Override
    public List<AbonsInGroupViewModel> listAbonsInGroup(FilterModel filter) throws Exception {

        try(Connection con = db.getConnection(appName)){

            Map<String, Object> params = new HashMap<>();
            params.put("groupid", UUID.fromString( filter.getGroupId() ));


            String sql = "select ag.id, get_fio(a.fam ||' '|| a.ima ||' '|| a.otch, 0) as fioAbon, " +
                    "g.name as namegroup, ag.del, " +
                    "g.creator, g.created, g.changer, g.changed, " +
                    "ag.creator, to_char(ag.created, 'dd.mm.yyyy HH24:MI:SS') as created, " +
                    "ag.changer, to_char(ag.changed, 'dd.mm.yyyy HH24:MI:SS') as changed " +
                    " from abon_grps ag " +
                    " inner join abons a on a.id = ag.abon_id " +
                    " inner join grps g on g.id = ag.grp_id " +
                    " where ag.grp_id = :groupid " +
                    " order by fioAbon ";


            List<AbonsInGroupViewModel> listAbonsInGroup = db.Query(con, sql, AbonsInGroupViewModel.class, params);

            return listAbonsInGroup;
        }
        catch(Exception ex){
            throw ex;
        }
    }




    /**
     * Удаление группы
     * @param id - идентификатор
     * @throws Exception
     */
    @Override
    public void deleteGroup(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();

            String sql = "UPDATE grps SET Del = 1 - Del WHERE Id = :id";

            params.put("id", UUID.fromString(id) );
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }



    /**
     * Удаление абонента
     * @param id - идентификатор
     * @throws Exception
     */
    @Override
    public void deleteAbon(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();

            String sql = "UPDATE abons SET Del = 1 - Del WHERE Id = :id";

            params.put("id", UUID.fromString(id) );
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }






    /**
     * Проверить существование абонента в группе
     * @param abonId
     * @param groupId
     * @return
     * @throws Exception
     */
    @Override
    public boolean existsAbonInGroup(String abonId, String groupId) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("abonid", UUID.fromString(abonId) );

            String sql = "SELECT COUNT(*) FROM abon_grps " +
                    "WHERE abon_id = :abonid  ";

            if (groupId.length() > 0 ){
                params.put("groupid", UUID.fromString(groupId) );
                sql += "AND grp_id = :groupid ";
            }

            if (groupId.length() == 0 ){
                sql += " AND del = 0";
            }

            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Добавление абонента в группу
     * @param abonId
     * @param groupId
     * @return
     * @throws Exception
     */
    @Override
    public String addAbonToGroup(String abonId, String groupId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("abonid", UUID.fromString(abonId) );
            params.put("groupid", UUID.fromString(groupId) );
            String sql = "INSERT INTO abon_grps(abon_id, grp_id, del) " +
                    "VALUES(:abonid, :groupid, 0)";


            return db.Execute(con, sql, String.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Удаление абонента из группы
     * @param abonId
     * @param groupId
     * @throws Exception
     */
    @Override
    public void deleteAbonFromGroup(String abonId, String groupId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();

            params.put("abonid", UUID.fromString(abonId) );
            params.put("groupid", UUID.fromString(groupId) );

            String sql = "UPDATE abon_grps SET Del = 1 - Del " +
                    "WHERE abon_id = :abonid AND grp_id= :groupid ";

            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }



}
