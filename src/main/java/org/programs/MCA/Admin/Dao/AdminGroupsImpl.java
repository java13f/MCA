package org.kaznalnrprograms.MCA.Admin.Dao;

import org.kaznalnrprograms.MCA.Admin.Interfaces.IAdminGroupsDao;
import org.kaznalnrprograms.MCA.Admin.Models.*;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;

@Repository
public class AdminGroupsImpl implements IAdminGroupsDao {
    private String appName = "Admin - модуль администрирования";
    private DBUtils db;

    public AdminGroupsImpl(DBUtils db){
        this.db = db;
    }
    /**
     * Получить список групп
     * @param filter - Фильтр по коду и наименовании группы
     * @param UserId - Фильтр по пользователю
     * @param AppId - Фильтр по приложению
     * @param ActId - Фильтр по действию
     */
    @Override
    public List<GroupViewModel> getGroupsList(String filter, String UserId, String AppId, String ActId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<String, Object>();
            String fFilter = "";
            String fUserId = "";
            String fAppId = "";
            String fActId = "";
            String fKterId = "";
            if (!filter.isEmpty()) {
                fFilter = " AND g.Code ILIKE '%' || :filter || '%' OR g.Name ILIKE '%' || :filter || '%' ";
                params.put("filter", filter);
            }
            if (!UserId.isEmpty()) {
                fUserId = " AND (SELECT COUNT(*) FROM i_user_groups ug WHERE ug.i_Group_Id = g.Id AND ug.i_User_Id = :UserId) > 0 ";
                params.put("UserId", UUID.fromString(UserId));
            }
            if (!AppId.isEmpty()) {
                fAppId = " AND (SELECT COUNT(*) FROM i_apps_groups ag WHERE ag.i_group_id = g.Id AND ag.i_app_Id = :AppId) > 0 ";
                params.put("AppId", UUID.fromString(AppId));
            }
            if (!ActId.isEmpty()) {
                fActId = " AND (SELECT COUNT(*) FROM i_acts_groups ag WHERE ag.i_group_id = g.Id AND ag.i_act_id = :ActId) > 0 ";
                params.put("ActId", UUID.fromString(ActId));
            }
            String sql = "SELECT g.Id, g.Code, g.Name, CASE WHEN g.Del = 0 THEN 'Нет' ELSE 'Да' END Del FROM i_Groups g" +
                    " WHERE 1=1" + fFilter + fUserId + fAppId + fActId + fKterId +
                    " ORDER BY Code";

            List<GroupViewModel> groups = db.Query(con, sql, GroupViewModel.class, params);
            return groups;
        }
    }
    /**
     * Получить группу
     * @param GroupId - идентификатор группы
     */
    @Override
    public GroupModel GetGroup(UUID GroupId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("GroupId", GroupId);
            String sql = "SELECT * FROM i_groups WHERE Id = :GroupId";
            List<GroupModel> groups = db.Query(con, sql, GroupModel.class, params);
            if(groups.size()==0){
                throw new Exception("Не удалось загрузить группу с Id = " + GroupId.toString());
            }
            return groups.get(0);
        }
        catch (Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование группы
     * @param id - идентификатор группы (для новых -1)
     * @param code - код группы
     */
    @Override
    public boolean ExistsGroup(String id, String code) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            String sql = "SELECT COUNT(*) FROM i_groups WHERE Code ILIKE :code ";
            if(!id.isEmpty()){
                sql += " AND Id <> :id";
                params.put("id",  UUID.fromString(id));
            }
            params.put("code", code);
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Сохранение группы в базе данных
     * @param group - группа
     */
    @Override
    public String Save(GroupModel group) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("Code", group.getCode());
            params.put("Name", group.getName());
            if(group.getId().equals("")){
                sql = "INSERT INTO i_groups (id, Code, Name, Del) VALUES(uuid_generate_v4(), :Code, :Name, 0)";
                group.setId(db.Execute(con, sql, String.class, params));
            }
            else{
                params.put("Id", UUID.fromString(group.getId()));
                db.CheckLock(con, -1, group.getId(), "i_groups");
                sql = "UPDATE i_groups SET Code = :Code, Name = :Name WHERE Id = :Id";
                db.Execute(con, sql, params);
            }
            return group.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление группы
     * @param id - идентификатор группы
     */
    @Override
    public String Delete(UUID id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", id);
            String sql = "SELECT COUNT(*) as cnt FROM i_user_groups WHERE i_group_Id = :id AND del = 0";
            int count = db.Query(con, sql, Integer.class, params).get(0);
            if(count>0){
                return "Данную группу невозможно удалить так как к ней привязаны пользователи";
            }
            sql = "SELECT COUNT(*) as cnt FROM i_apps_groups WHERE i_group_Id = :id AND del = 0";
            count = db.Query(con, sql, Integer.class, params).get(0);
            if(count>0){
                return "Данную группу невозможно удалить так как к ней привязаны приложения";
            }
            sql = "SELECT COUNT(*) as cnt FROM i_acts_groups WHERE i_group_Id = :id AND del = 0";
            count = db.Query(con, sql, Integer.class, params).get(0);
            if(count>0){
                return "Данную группу невозможно удалить так как к ней привязаны действия";
            }
            sql = "UPDATE i_groups SET del = 1-del WHERE Id = :id";
            db.Execute(con, sql, params);
            return "";
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * Функция возвращает пользователей группы
     * @param GroupId - идентификатор группы пользователей
     */
    @Override
    public List<UserGroupsViewModel> UserList(String GroupId) throws Exception {
        if(GroupId.isEmpty()) {
            return new ArrayList<>();
        }
        try(Connection con = db.getConnection(appName)) {
            String sql = "SELECT ug.Id, u.Name as UserName, "
                    +" CASE WHEN ug.del = 1 THEN 'Да' ELSE 'Нет' END del FROM i_User_Groups ug"
                    +" JOIN i_users u ON u.Id = ug.i_user_Id"
                    +" WHERE ug.i_group_Id = :GroupId";
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("GroupId", UUID.fromString(GroupId));
            List<UserGroupsViewModel> UserGroups = db.Query(con, sql, UserGroupsViewModel.class, params);
            return  UserGroups;
        } catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Получение строки представления группы для форме редактирования
     * @param id - идентификатор группы
     */
    @Override
    public String getGroupSel(String id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT LTRIM(RTRIM(CAST(Id AS VARCHAR(128)))) || ' = ' || Name FROM i_groups WHERE id = :id";
            List<String> result = db.Query(con, sql, String.class, params);
            if(result.size()==0){
                throw new Exception("Не удалось получить группу с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить привязку пользователя к группе
     * @param id - идентификатор привязки
     */
    @Override
    public UserGroupsModel getUserBinding(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT id, i_group_id as GroupId, i_user_id as UserId," +
                    " creator, created, changer, changed FROM i_user_groups WHERE Id = :id";
            List<UserGroupsModel> UserGroups = db.Query(con, sql, UserGroupsModel.class, params);
            if(UserGroups.size() == 0){
                throw new Exception("Не удалось получить привязку пользователя к группе с Id = " + id);
            }
            return UserGroups.get(0);
        }
        catch (Exception ex){
            throw ex;
        }
    }
    /**
     * Проверка существования пользователя в группе
     * @param Id - идентификатор привязки (для новых -1)
     * @param GroupId - идентификатор группы контроля
     * @param UserId - идентификатор пользователя
     */
    @Override
    public boolean ExistsUserInGroup(String Id,  String GroupId, String UserId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable();
            params.put("GroupId", UUID.fromString(GroupId));
            params.put("UserId", UUID.fromString(UserId));
            String sql = "SELECT COUNT(*) FROM i_user_groups WHERE i_group_Id = :GroupId  AND i_user_id = :UserId";
            if(!Id.isEmpty()){
                sql+=" AND Id <> :Id";
                params.put("Id", UUID.fromString(Id));
            }
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Добавить/Изменить привзяку пользователя к группе
     * @param model - модуль привязки пользователя к группе
     */
    @Override
    public String SaveUserInGroup(UserGroupsModel model) throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "";
            Map<String, Object> params = new Hashtable<>();
            params.put("GroupId", UUID.fromString(model.getGroupId()));
            params.put("UserId", UUID.fromString(model.getUserId()));
            if(model.getId().isEmpty()){
                sql = "INSERT INTO i_user_groups (id, i_group_Id, i_user_id, del) VALUES(uuid_generate_v4(), :GroupId, :UserId, 0)";
                model.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                db.CheckLock(con, -1, model.getId(), "i_user_groups");
                params.put("Id", UUID.fromString(model.getId()));
                sql = "UPDATE i_user_groups SET i_group_Id = :GroupId, i_user_id = :UserId WHERE Id = :Id";
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Удаление пользователя из группы
     * @param id - идентификатор привязки пользователя к группе
     */
    @Override
    public void DeleteUserFromGroup(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("Id", UUID.fromString(id));
            String sql = "UPDATE i_user_groups SET Del = 1-Del WHERE Id = :Id";
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить список приложений, входящих в группу
     * @param GroupId - идентификатор группы
     */
    @Override
    public List<AppRightViewModel> GetAppRightsList(String GroupId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("GroupId", UUID.fromString(GroupId));
            String sql = "SELECT ar.Id, a.Code, a.Name, CASE WHEN ar.del=1 THEN 'Да' ELSE 'Нет' END as del "+
                    "FROM i_apps_groups ar, i_apps a WHERE ar.i_app_Id = a.Id AND ar.i_group_id = :GroupId ORDER BY a.Name";
            return db.Query(con, sql, AppRightViewModel.class, params);
        }
        catch (Exception ex){
            throw ex;
        }
    }


    /**
     * Получить привязку приложения к группе
     * @param id - идентификатор привязки
     */
    @Override
    public AppRightsModel GetAppRights(String id) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT id, i_group_Id as groupId, i_app_id as appId, " +
                    "creator, created, changer, changed FROM i_apps_groups WHERE Id = :id";
            List<AppRightsModel> result = db.Query(con, sql, AppRightsModel.class, params);
            if(result.size() == 0){
                throw new Exception("Не удалось получить привязку приложения к группе с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существование приложения в группе
     * @param id - идентификатор привязки приложения к группе (для новых -1)
     * @param groupId - идентификатор группы
     * @param appId - тдентификатор приложения
     */
    @Override
    public boolean ExistsAppInGroup(String id, String groupId, String appId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("groupId", UUID.fromString(groupId));
            params.put("appId", UUID.fromString(appId));
            String sql = "SELECT COUNT(*) as cnt FROM i_apps_groups WHERE i_group_Id = :groupId AND i_app_id = :appId";
            if(!id.isEmpty()){
                sql += " AND id <> :id";
                params.put("id", UUID.fromString(id));
            }
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/Изменить привязку приложения к группе
     * @param model - модель привязки приложения к группе
     */
    @Override
    public String SaveAppRights(AppRightsModel model) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("groupId", UUID.fromString(model.getGroupId()));
            params.put("appId", UUID.fromString(model.getAppId()));
            String sql = "";

            if(model.getId().isEmpty()){
                sql = "INSERT INTO i_apps_groups (id, i_group_id, i_app_id, del) VALUES (uuid_generate_v4(), :groupId, :appId, 0)";
                model.setId(db.Execute(con, sql, String.class, params));
            }
            else{
                db.CheckLock(con, -1, model.getId(), "i_apps_groups");
                params.put("id", UUID.fromString(model.getId()));
                sql = "UPDATE i_apps_groups SET i_group_id = :groupId, i_app_id = :appId WHERE Id = :id";
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удаление приложения из группы
     * @param id - идентификатор привязки приложения к группе
     */
    @Override
    public void DeleteAppFromGroup(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "UPDATE i_apps_groups SET del = 1 - del WHERE Id = :id";
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }
    /**
     * Получить список действий группы
     * @param GroupId - идентификатор группы
     */
    @Override
    public List<ActGroupsViewModel> GetActGroupsList(String GroupId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("GroupId", UUID.fromString(GroupId));
            String sql = "SELECT ag.Id, ap.Code as AppCode, ap.Name as AppName, ac.Code as ActCode, ac.Name as ActName, CASE WHEN ag.del=1 THEN 'Да' ELSE 'Нет' END as del" +
                    " FROM i_acts_groups ag, i_apps ap, i_acts ac " +
                    " WHERE ag.i_act_id = ac.id AND ac.i_app_id = ap.id AND ag.i_group_id = :GroupId";
            return db.Query(con, sql, ActGroupsViewModel.class, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Получиьт привязку действия к группе
     * @param id - идентификатор привязки действия к группе
     */
    @Override
    public ActGroupsModel GetActGroup(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "SELECT id, i_group_id as groupId, i_act_id as actId," +
                    " creator, created, changer, changed FROM i_acts_groups WHERE Id = :id";
            List<ActGroupsModel> result = db.Query(con, sql, ActGroupsModel.class, params);
            if(result.size() == 0){
                throw new Exception("Не удалось загрузить привязку действия к группе с Id = " + id);
            }
            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Проверить существования привязки действия к группе
     * @param id - идентификатор действия (для новых -1)
     * @param groupId - идентификатор группы
     * @param actId - идентификатор действия
     */
    @Override
    public boolean ExistsActInGroup(String id, String groupId, String actId) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("groupId", UUID.fromString(groupId));
            params.put("actId", UUID.fromString(actId));
            String sql = "SELECT COUNT(*) as cnt FROM i_acts_groups WHERE i_group_id = :groupId AND i_act_id = :actId";
            if(!id.isEmpty()){
                sql+= " AND id <> :id";
                params.put("id", UUID.fromString(id));
            }
            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Добавить/Изменить привязку действия к группе
     * @param model - модель привязки действия к группе
     */
    @Override
    public String SaveActGroups(ActGroupsModel model) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            String sql = "";
            params.put("GroupId", UUID.fromString(model.getGroupId()));
            params.put("ActId", UUID.fromString(model.getActId()));
            if(model.getId().isEmpty()){
                sql = "INSERT INTO i_acts_groups (id, i_group_id, i_act_id, del) VALUES (uuid_generate_v4(), :GroupId, :ActId, 0)";
                model.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                db.CheckLock(con, -1, model.getId(), "i_acts_groups");
                params.put("id", UUID.fromString(model.getId()));
                sql = "UPDATE i_acts_groups SET i_group_id = :GroupId, i_act_id = :ActId WHERE Id = :id";
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch(Exception ex){
            throw ex;
        }
    }

    /**
     * Удалить действие из группы
     * @param id - идентификатор привязки действия к группе
     */
    @Override
    public void DeleteActFromGroup(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new Hashtable<>();
            params.put("id", UUID.fromString(id));
            String sql = "UPDATE i_acts_groups SET del = 1 - del WHERE Id = :id";
            db.Execute(con, sql, params);
        }
        catch(Exception ex){
            throw ex;
        }
    }
}
