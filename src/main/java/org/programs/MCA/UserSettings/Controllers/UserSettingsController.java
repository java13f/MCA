package org.kaznalnrprograms.MCA.UserSettings.Controllers;

import org.kaznalnrprograms.MCA.UserSettings.Interfaces.IUserSettingsDao;
import org.kaznalnrprograms.MCA.UserSettings.Models.PasswordChangeModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UserSettingsController {
    private IUserSettingsDao dUserSettings;

    public UserSettingsController(IUserSettingsDao dUserSettings) {
        this.dUserSettings = dUserSettings;
    }
    @GetMapping("UserSettings/UserSettingsStart")
    @PreAuthorize("GetActRight('UserSettings','UserSettingsRight')")
    public String UserSettingsStart(){
        return "UserSettings/UserSettingsStart";
    }
    @GetMapping("UserSettings/UserSettingsMainForm")
    @PreAuthorize("GetActRight('UserSettings','UserSettingsRight')")
    public String UserSettingsMainForm() {
        return "UserSettings/UserSettings :: UserSettings";
    }
    @PostMapping("UserSettings/UpdatePassword")
    @PreAuthorize("GetActRight('UserSettings','UserSettingsRight')")
    public @ResponseBody String UpdatePassword(@RequestBody PasswordChangeModel model) throws Exception{
        String password = model.getNewPassword();
        String password2 = model.getRepeatNewPassword();
        if(password.length()==0&&password2.length()==0){
            return "";
        }
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(8);
        String currentPasswordHash = dUserSettings.getCurrentPassword();
        if(!passwordEncoder.matches(model.getCurrentPassword(), currentPasswordHash)) {
            throw new Exception("Введён неверный текущий пароль");
        }
        if(password.matches("(?=.*\\d)")){
            throw new Exception("Пароль должен содержать хотя бы одну цифру");
        }
        else if(password.matches("(?=.*[a-zа-яё])")){
            throw new Exception("Пароль должен содержать хотя бы одну маленькую букву");
        }
        else if(password.matches("(?=.*[A-ZА-ЯЁ])")){
            throw new Exception("Пароль должен содержать хотя бы одну большую букву");
        }
        else if(password.length()<8) {
            throw new Exception("Пароль должен содержать не меньше восьми символов");
        }
        if(!password.equals(password2)){
            throw new Exception("Пароли не совпадают");
        }
        dUserSettings.UpdatePassword(model);
        return "";
    }
}
