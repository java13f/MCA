package org.kaznalnrprograms.MCA.Voc.Interfaces;

import org.kaznalnrprograms.MCA.Voc.Models.*;

import java.util.List;
import java.util.Map;

public interface IVocDao {
    /**
     * Получить словарь
     * @return
     * @throws Exception
     */
    List<VocViewModel> GetVoc(VocFilter filter) throws Exception;
    /**
     * Проверка добавляемого слова
     * @param voc
     * @return
     * @throws Exception
     */
    String CheckWord(VocViewModel voc) throws Exception;
    /**
     * Сохранение в словарь
     * @param word
     * @return
     * @throws Exception
     */
    String Save(VocViewModel word) throws Exception;
    /**
     * Удаление слова из словаря
     * @param word
     * @return
     * @throws Exception
     */
    String Delete(VocViewModel word) throws Exception;
    /**
     * Проверка прав
     * @return
     * @throws Exception
     */
    VocRightsModel GetActRights() throws Exception;
    /**
     * Получить словари из базы
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    List<VocsListItemModel> GetVocItems(VocFilter filter) throws Exception;
    /**
     * Удаление словаря
     * @param id
     * @return
     * @throws Exception
     */
    String DeleteVocItem(String id) throws Exception;
    /**
     * Загрузка словаря по ид
     * @param id
     * @return
     * @throws Exception
     */
    VocItemEditModel LoadVocItem(String id) throws Exception;
    /**
     * Проверка наличия кода словаря в базе
     * @param params
     * @return
     * @throws Exception
     */
    boolean CheckCode(Map<String, Object> params) throws Exception;
    /**
     * Сохранение словаряя
     * @param vocItem
     * @return
     * @throws Exception
     */
    String SaveVocItem(VocItemEditModel vocItem) throws Exception;
}
