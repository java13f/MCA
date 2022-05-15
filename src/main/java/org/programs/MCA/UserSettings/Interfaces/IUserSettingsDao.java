package org.kaznalnrprograms.MCA.UserSettings.Interfaces;

import org.kaznalnrprograms.MCA.UserSettings.Models.PasswordChangeModel;

public interface IUserSettingsDao {
    /**
     * Изменение пароля
     * @param model модель изменения пароля
     */
    void UpdatePassword(PasswordChangeModel model) throws Exception;
    /**
     * Получить хэш текущего пароля
     * @return
     * @throws Exception
     */
    String getCurrentPassword() throws Exception;
}
