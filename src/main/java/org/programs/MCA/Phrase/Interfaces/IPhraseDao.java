package org.kaznalnrprograms.MCA.Phrase.Interfaces;

import org.kaznalnrprograms.MCA.Phrase.Models.*;

import java.util.List;

public interface IPhraseDao {
    /**
     * Список групп фраз
     * @param groupFilter
     * @return
     * @throws Exception
     */
    List<PhraseGroupViewModel> GetPhraseGroups(GroupFilterModel groupFilter) throws Exception;
    /**
     * Список фраз
     * @param phraseFilter
     * @return
     * @throws Exception
     */
    List<PhraseViewModel> GetPhrases(PhraseFilterModel phraseFilter) throws Exception;
    /**
     * Получение всех прав
     * @return
     * @throws Exception
     */
    RightModel GetActRights() throws Exception;
}
