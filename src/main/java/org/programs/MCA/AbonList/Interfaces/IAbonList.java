package org.kaznalnrprograms.MCA.AbonList.Interfaces;

import org.kaznalnrprograms.MCA.AbonList.Models.AbonViewModel;
import org.kaznalnrprograms.MCA.AbonList.Models.FilterModel;

import java.util.List;

public interface IAbonList {

    /**
     * Получить количество записей таблицы абонентов(abons)
     * @param filter
     * @return
     * @throws Exception
     */
    int getTotalAbons(FilterModel filter) throws Exception;

    /**
     * Получить список абонентов для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    List<AbonViewModel> listAbon(FilterModel filter) throws Exception;
}
