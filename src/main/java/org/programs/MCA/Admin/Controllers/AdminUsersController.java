package org.kaznalnrprograms.MCA.Admin.Controllers;

import org.kaznalnrprograms.MCA.Admin.Interfaces.IAdminUsersDao;
import org.kaznalnrprograms.MCA.Admin.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class AdminUsersController {
    private IAdminUsersDao dUsers = null;
    public AdminUsersController(IAdminUsersDao dUsers){
        this.dUsers = dUsers;
    }
    @GetMapping("/AdminUsers/UserEditForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String UserEditForm(){
        return "Admin/UserEditForm :: UserEditForm";
    }
    @GetMapping("/AdminUsers/UserFilterForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String UserFilterForm(){
        return "Admin/UserFilterForm :: UserFilterForm";
    }
    /**
     * Получить список пользователей
     * @param filter фильтр по ползователям
     * @return
     * @throws Exception
     */
    @PostMapping("/AdminUsers/List")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody List<UserViewModel> List(@RequestBody UserFilterModel filter) throws Exception {
        return dUsers.List(filter.getCode(), filter.getName());
    }
    /**
     * Функция получения пользователя
     * @param id - идентификатор пользователя
     * @return
     * @throws Exception
     */
    @PostMapping("/AdminUsers/GetUser")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody UserModel GetUser(String id) throws Exception{
        return dUsers.GetUser(id);
    }
    /**
     * Проверка существования пользователя
     * @param id - идентификатор пользователя
     * @param login - логин ползователя
     * @return
     * @throws Exception
     */
    @GetMapping("/AdminUsers/ExistsUser")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody boolean ExistsUser(String id, String login) throws Exception {
        return dUsers.ExistsUser(id, login);
    }
    /**
     * Добавить/изменить пользователя
     * @param model - модуль пользователя
     * @return
     * @throws Exception
     */
    @PostMapping("/AdminUsers/Save")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String Save(@RequestBody UserModel model) throws Exception{
        String password = model.getPassword();
        String password2 = model.getPassword2();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(8);
        if(!password.isEmpty()){
            model.setPassword(passwordEncoder.encode(password));
        }
        if(!password.equals(password2)){
            throw new Exception("Пароли не совпадают");
        }
        return dUsers.Save(model);
    }
    /**
     * Удаление пользователя
     * @param id - идентификатор пользователя
     * @return
     */
    @PostMapping("/AdminUsers/Delete")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String Delete(String id) throws Exception{
        return dUsers.Delete(id);
    }
    /**
     * Получение строки представления пользователя для формы редактирования
     * @param id - идентификатор польбзователя
     */
    @PostMapping("/AdminUsers/GetUserSel")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public @ResponseBody String getUserSel(String id) throws Exception{
        return dUsers.getUserSel(id);
    }
}
