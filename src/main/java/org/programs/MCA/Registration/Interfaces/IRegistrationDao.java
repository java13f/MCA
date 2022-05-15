package org.kaznalnrprograms.MCA.Registration.Interfaces;

import org.kaznalnrprograms.MCA.Registration.Models.RegistrationUserModel;

import java.util.List;

public interface IRegistrationDao {
    /**
     * Проверка существования логина пользователя
     * @param login логин пользователя
     * @return
     */
    boolean existsLogin(String login) throws Exception;

    /**
     * Реагистрация нового пользователя
     * @param user модель регистраци пользователя
     * @throws Exception
     */
    void SaveRegistrationUser(RegistrationUserModel user) throws Exception;
}
