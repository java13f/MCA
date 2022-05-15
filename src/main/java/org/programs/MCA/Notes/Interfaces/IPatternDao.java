package org.kaznalnrprograms.MCA.Notes.Interfaces;

import org.kaznalnrprograms.MCA.Notes.Models.ListItemEditModel;
import org.kaznalnrprograms.MCA.Notes.Models.PatternEditModel;
import org.kaznalnrprograms.MCA.Notes.Models.PeriodTimeModel;

public interface IPatternDao {
    /**
     * Паттерн по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    PatternEditModel GetPatternFromId(String id) throws Exception;
    /**
     * Удаление шаблона
     * @param id
     * @return
     * @throws Exception
     */
    String DelPattern(String id) throws Exception;
    /**
     * Получить группу по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    ListItemEditModel LoadGrpFromId(String id) throws Exception;
    /**
     * Получить абонента по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    ListItemEditModel LoadAbonFromId(String id) throws Exception;
    /**
     * Сохранение шаблона
     * @param pattern
     * @return
     * @throws Exception
     */
    String SavePattern(PatternEditModel pattern) throws Exception;
    /**
     * Получить период активности шаблона
     * @param patternId
     * @return
     * @throws Exception
     */
    PeriodTimeModel GetPeriodAct(String patternId) throws Exception;
}
