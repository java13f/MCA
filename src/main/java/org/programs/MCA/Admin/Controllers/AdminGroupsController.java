package org.kaznalnrprograms.MCA.Admin.Controllers;

import org.kaznalnrprograms.MCA.Admin.Interfaces.IAdminGroupsDao;
import org.kaznalnrprograms.MCA.Admin.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
public class AdminGroupsController {
    private IAdminGroupsDao dAdminGroups;

    public AdminGroupsController(IAdminGroupsDao dAdminGroups){
        this.dAdminGroups = dAdminGroups;
    }
    @GetMapping("/AdminGroups/GroupEditForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String GroupEditForm(){
        return "Admin/GroupEditForm :: GroupEditForm";
    }
    @GetMapping("/AdminGroups/UserGroupsEditForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String UserGroupsEditFrom(){
        return "Admin/UserGroupsEditForm :: UserGroupsEditForm";
    }
    @GetMapping("/AdminGroups/GroupFormSelect")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String GroupFormSelect(){
        return "Admin/Directories/GroupFormSelect :: GroupFormSelect";
    }
    @GetMapping("/AdminGroups/UserFormSelect")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String UserFormSel(){
        return "Admin/Directories/UserFormSelect :: UserFormSelect";
    }
    @GetMapping("AdminGroups/AppRightsEditForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String AppRightsEditForm(){
        return "Admin/AppRightsEditForm :: AppRightsEditForm";
    }
    @GetMapping("/AdminGroups/ActGroupsEditForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String ActGroupsEditForm(){
        return "Admin/ActGroupsEditForm :: ActGroupsEditForm";
    }
    @GetMapping("/AdminGroups/KterGroupsEditForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String KterGroupsEditForm(){
        return "Admin/KterGroupsEditForm :: KterGroupsEditForm";
    }
    /**
     * Получить список групп
     * @param filterObj - фильтр по группам пользователей
     */
    @PostMapping("/AdminGroups/GroupsList")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody List<GroupViewModel> getGroupsList(@RequestBody GroupFilterModel filterObj) throws Exception {
        return dAdminGroups.getGroupsList(filterObj.getFilter(), filterObj.getUserId(), filterObj.getAppId(), filterObj.getActId());
    }
    /**
     * Получить группу
     * @param GroupId - идентификатор группы
     */
    @GetMapping("/AdminGroups/GetGroup")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody GroupModel GetGroup(String GroupId) throws Exception {
        return dAdminGroups.GetGroup(UUID.fromString(GroupId));
    }
    /**
     * Проверить существование группы
     * @param id - идентификатор группы (для новых -1)
     * @param code - код группы
     */
    @GetMapping("/AdminGroups/ExistsGroup")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody boolean ExistsGroup(String id, String code) throws Exception {
        return dAdminGroups.ExistsGroup(id, code);
    }
    /**
     * Сохранение группы в базе данных
     * @param group - группа
     */
    @PostMapping("/AdminGroups/Save")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String Save(@RequestBody GroupModel group) throws Exception {
        return dAdminGroups.Save(group);
    }
    /**
     * Удаление группы
     * @param id - идентификатор группы
     */
    @PostMapping("/AdminGroups/Delete")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String Delete(String id) throws Exception {
        return dAdminGroups.Delete(UUID.fromString(id));
    }
    /**
     * Функция возвращает пользователей группы
     */
    @PostMapping("/AdminGroups/UserList")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody List<UserGroupsViewModel> UserList (@RequestBody UserGroupsFilterModel filter) throws Exception {
        return dAdminGroups.UserList(filter.getGroupId());
    }
    /**
     * Получить привязку пользователя к группе
     * @param id - идентификатор привязки
     */
    @PostMapping("/AdminGroups/GetUserBinding")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody UserGroupsModel getUserBinding(String id) throws Exception {
        return dAdminGroups.getUserBinding(id);
    }
    /**
     * Проверка существования пользователя в группе
     * @param id - идентификатор привязки (для новых -1)
     * @param groupId - идентификатор группы контроля
     * @param userId - идентификатор пользователя
     */
    @GetMapping("/AdminGroups/ExistsUserInGroup")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody boolean ExistsUserInGroup(String id,  String groupId, String userId) throws Exception {
        return dAdminGroups.ExistsUserInGroup(id, groupId, userId);
    }
    /**
     * Добавить/Изменить привзяку пользователя к группе
     * @param model - модуль привязки пользователя к группе
     */
    @PostMapping("/AdminGroups/SaveUserInGroup")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String SaveUserInGroup(@RequestBody UserGroupsModel model) throws Exception {
        return dAdminGroups.SaveUserInGroup(model);
    }
    /**
     * Удаление пользователя из группы
     * @param id - идентификатор привязки пользователя к группе
     */
    @PostMapping("/AdminGroups/DeleteUserFromGroup")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String DeleteUserFromGroup(String id) throws Exception {
        dAdminGroups.DeleteUserFromGroup(id);
        return "";
    }
    @PostMapping("/AdminGroups/GetGroupSel")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String GetGroupSel(String id) throws Exception {
        return dAdminGroups.getGroupSel(id);
    }
    /**
     * Получить список приложений, входящих в группу
     */
    @PostMapping("/AdminGroups/GetAppRightsList")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody List<AppRightViewModel> GetAppRightsList(@RequestBody AppRightsFilterModel filter) throws Exception {
        return dAdminGroups.GetAppRightsList(filter.getGroupId());
    }
    /**
     * Получить привязку приложения к группе
     * @param id - идентификатор привязки
     */
    @PostMapping("/AdminGroups/GetAppRights")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody AppRightsModel GetAppRights(String id) throws Exception{
        return dAdminGroups.GetAppRights(id);
    }

    /**
     * Проверить существование приложения в группе
     * @param id - идентификатор привязки приложения к группе (для новых -1)
     * @param groupId - идентификатор группы
     * @param appId - тдентификатор приложения
     */
    @GetMapping("/AdminGroups/ExistsAppInGroup")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody boolean ExistsAppInGroup(String id, String groupId, String appId) throws Exception {
        return dAdminGroups.ExistsAppInGroup(id, groupId, appId);
    }

    /**
     * Добавить/Изменить привязку приложения к группе
     * @param model - модель привязки приложения к группе
     */
    @PostMapping("/AdminGroups/SaveAppRights")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String SaveAppRights(@RequestBody AppRightsModel model) throws Exception {
        return dAdminGroups.SaveAppRights(model);
    }

    /**
     * Удаление приложения из группы
     * @param id - идентификатор привязки приложения к группе
     */
    @PostMapping("/AdminGroups/DeleteAppFromGroup")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String DeleteAppFromGroup(String id) throws Exception {
        dAdminGroups.DeleteAppFromGroup(id);
        return "";
    }
    /**
     * Получить список действий группы
     * @param filter - фильтра по действиям группы
     */
    @PostMapping("/AdminGroups/GetActGroupsList")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody List<ActGroupsViewModel> GetActGroupsList(@RequestBody ActGroupsModel filter) throws Exception {
        return dAdminGroups.GetActGroupsList(filter.getGroupId());
    }

    /**
     * Получиьт привязку действия к группе
     * @param id - идентификатор привязки действия к группе
     */
    @PostMapping("/AdminGroups/GetActGroup")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody ActGroupsModel GetActGroup(String id) throws Exception {
        return dAdminGroups.GetActGroup(id);
    }

    /**
     * Проверить существования привязки действия к группе
     * @param id - идентификатор действия (для новых -1)
     * @param groupId - идентификатор группы
     * @param actId - идентификатор действия
     */
    @GetMapping("/AdminGroups/ExistsActInGroup")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody boolean ExistsActInGroup(String id, String groupId, String actId) throws Exception {
        return dAdminGroups.ExistsActInGroup(id, groupId, actId);
    }

    /**
     * Добавить/Изменить привязку действия к группе
     * @param model - модель привязки действия к группе
     */
    @PostMapping("/AdminGroups/SaveActGroups")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String SaveActGroups(@RequestBody ActGroupsModel model) throws Exception {
        return dAdminGroups.SaveActGroups(model);
    }

    /**
     * Удалить действие из группы
     * @param id - идентификатор привязки действия к группе
     */
    @PostMapping("/AdminGroups/DeleteActFromGroup")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String DeleteActFromGroup(String id) throws Exception {
        dAdminGroups.DeleteActFromGroup(id);
        return "";
    }
}
