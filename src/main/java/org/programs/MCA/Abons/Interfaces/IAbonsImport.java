package org.kaznalnrprograms.MCA.Abons.Interfaces;
import org.kaznalnrprograms.MCA.Abons.Models.Csv.AbonModel;
import org.kaznalnrprograms.MCA.Abons.Models.Csv.ParamsImportModel;
import org.kaznalnrprograms.MCA.Abons.Models.ResultModel;

import java.util.List;


public interface IAbonsImport {


    /**
     * Получить абонентов из файла
     * @param result
     * @return
     * @throws Exception
     */
    List<AbonModel> getAbonsFromFile(ResultModel result) throws Exception;


    /**
     * Загрузка данных абонента в базу данных
     * @param abon
     * @param paramsImport
     * @return Ошибка, Добавлен, Обновлен
     * @throws Exception
     */
    String saveAbon(AbonModel abon, ParamsImportModel paramsImport) throws Exception;

}
