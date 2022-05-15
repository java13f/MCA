package org.kaznalnrprograms.MCA.GlobalParams.Interfaces;

import org.kaznalnrprograms.MCA.GlobalParams.Models.GlobalParamsEditModel;
import org.kaznalnrprograms.MCA.GlobalParams.Models.GlobalParamsModel;
import org.kaznalnrprograms.MCA.GlobalParams.Models.GlobalParamsViewModel;
import org.kaznalnrprograms.MCA.GlobalParams.Models.ParentGlobalParamsModel;

import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;


public interface IGlobalParamsDao {
    /**
     * Получить список глобальных параметров для дерева
     */
    List<GlobalParamsViewModel> ListTree(String Filter) throws Exception;

    /**
     * Получить id = name для глобального дерева
     * @param id глобального параметра
     * @return
     * @throws Exception
     */
    String ParentGlPr(ParentGlobalParamsModel id) throws Exception;


    /**
     * Сохранение глобального параметра
     * @param model модель глобального параметра
     * @return
     * @throws Exception
     */
    String save(GlobalParamsModel model) throws Exception;

    /**
     * Получить данные редактируемого глобального параметра
     * @param id редактируемого глобального параметра
     * @return
     * @throws Exception
     */
    GlobalParamsEditModel GlPr(ParentGlobalParamsModel id) throws Exception;

    /**
     * Поиск всех дочернех элементов
     * @param id
     * @return
     * @throws Exception
     */
    String SearchNodeAndDelete(ParentGlobalParamsModel id) throws Exception;

    /**
     * Количество дочерних элементов для данного узла
     * @param id - узла у которого определить количество детей
     * @return
     * @throws Exception
     */
    int NodeCount(ParentGlobalParamsModel id) throws Exception;

    /**
     * Дочерние элементы
     * @param id
     * @return
     * @throws Exception
     */
    List<String> ChildNode( ParentGlobalParamsModel id) throws Exception;

    /**
     * Проверить существования узла
     * @param id
     * @return
     * @throws Exception
     */
    boolean CheckExistenceNode(@RequestBody ParentGlobalParamsModel id) throws Exception;
}


