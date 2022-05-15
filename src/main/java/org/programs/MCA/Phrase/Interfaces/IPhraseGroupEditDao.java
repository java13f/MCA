package org.kaznalnrprograms.MCA.Phrase.Interfaces;

import org.kaznalnrprograms.MCA.Phrase.Models.VoiceEditModel;
import org.kaznalnrprograms.MCA.Phrase.Models.VoiceTestParamModel;
import org.kaznalnrprograms.MCA.Phrase.Models.VoiceTypeModel;
import java.util.List;
import java.util.Map;

public interface IPhraseGroupEditDao {
    /**
     * Список типов голосов
     * @return
     * @throws Exception
     */
    List<VoiceTypeModel> GetVoiceTypes() throws Exception;
    /**
     * Получить группу по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    VoiceEditModel GetGroup(String id) throws Exception;
    /**
     * Синтез аудио из текста
     * @param testModel
     * @return
     * @throws Exception
     */
    String SyntezeTest(VoiceTestParamModel testModel) throws Exception;
    /**
     * Сохранение группы
     * @param phraseGroup
     * @return
     * @throws Exception
     */
    String SaveGroup(VoiceEditModel phraseGroup) throws Exception;
    /**
     * Проверка существования кода
     * @param params
     * @return
     * @throws Exception
     */
    boolean CheckGrpCode(Map<String, Object> params) throws Exception;
    /**
     * Удаление группы
     * @param id
     * @return
     * @throws Exception
     */
    String DelGroup(String id) throws Exception;
}
