package org.kaznalnrprograms.MCA.Abons.Interfaces;

import org.kaznalnrprograms.MCA.Abons.Models.GroupViewModel;
import org.kaznalnrprograms.MCA.Abons.Models.SaveGroupModel;

public interface IEditGroup {


    /**
     * Получить группу по ид (для формы редактирования)
     * @param groupid
     * @return
     * @throws Exception
     */
    GroupViewModel getGroupById(String groupid) throws Exception;


    /**
     * Проверить существование группы
     * @param saveGroup
     * @return
     * @throws Exception
     */
    boolean existsGroup(SaveGroupModel saveGroup) throws Exception;


    /**
     * Добавление / изменение группы абонентов
     * @param saveModel
     * @return
     * @throws Exception
     */
    String saveGroup(SaveGroupModel saveModel) throws Exception;

}
