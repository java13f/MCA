package org.kaznalnrprograms.MCA.Abons.Interfaces;

import org.kaznalnrprograms.MCA.Abons.Models.AbonEditModel;
import org.kaznalnrprograms.MCA.Abons.Models.TypeComModel;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface IEditAbon {

    /**
     * Получить абонента и его контакты по ид
     * @param id
     * @return
     * @throws Exception
     */
    AbonEditModel GetAbonFromId(String id) throws Exception;


    /**
     * Получить список типов коммуникаций для combobox (форма контакта)
     * @throws Exception
     */
    List<TypeComModel> getTypeCom() throws Exception;



    /**
     * Проверка есть ли абонент с таким СНИЛС
     * @param abonId
     * @param snils
     * @return true - успех, false - абонент с таким СНИЛС уже есть
     * @throws Exception
     */
    Boolean checkAbon(String abonId, String snils) throws Exception;

    /**
     * Сохранение абонента
     * @param abon
     * @return
     * @throws Exception
     */
    String SaveAbon(AbonEditModel abon) throws Exception;

}
