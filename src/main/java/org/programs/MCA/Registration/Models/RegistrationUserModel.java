package org.kaznalnrprograms.MCA.Registration.Models;

import javax.validation.constraints.NotBlank;

public class RegistrationUserModel {
    @NotBlank(message = "Не заполнено поле \"Логин\"")
    private String login;
    @NotBlank(message = "Не заполнено поле \"Пароль\"")
    private String password;
    @NotBlank(message = "Не заполнено поле \"Подтверждение пароля\"")
    private String password2;
    @NotBlank(message = "Не заполнено поле \"ИНН пользователя\"")
    private String code;
    @NotBlank(message = "Не заполнено поле \"ФИО пользователя\"")
    private String name;
    @NotBlank(message = "Не заполнено поле \"Подразделение\"")
    private String organizationalUnit;
    @NotBlank(message = "Не заполнено поле \"E-mail\"")
    private String email;
    private String captchaValue;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword2() {
        return password2;
    }

    public void setPassword2(String password2) {
        this.password2 = password2;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrganizationalUnit() {
        return organizationalUnit;
    }

    public void setOrganizationalUnit(String organizationalUnit) {
        this.organizationalUnit = organizationalUnit;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCaptchaValue() {
        return captchaValue;
    }

    public void setCaptchaValue(String captchaValue) {
        this.captchaValue = captchaValue;
    }
}
