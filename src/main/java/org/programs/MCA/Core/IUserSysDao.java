package org.kaznalnrprograms.MCA.Core;

public interface IUserSysDao {
    /**
     * Получить пользователя по логину
     * @param code - логин пользователя
     */
    UserModel getByLogin(String code) throws Exception;

    /**
     * Проверить право на действие
     * @param TaskCode - код приложения
     * @param ActCode - код действия
     */
    String GetActRights(String TaskCode, String ActCode) throws Exception;
}
