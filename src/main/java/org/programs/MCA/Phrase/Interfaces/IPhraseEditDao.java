package org.kaznalnrprograms.MCA.Phrase.Interfaces;

import org.kaznalnrprograms.MCA.Phrase.Models.*;
import org.sql2o.Connection;

import java.util.Map;

public interface IPhraseEditDao {
    /**
     * Перекодирует аудио файл в wav alaw
     * @param fileData - данные звукового файла
     * @return
     * @throws Exception
     */
    String ConvertWavFile(ConvertFileModel fileData) throws Exception;
    /**
     * Синтез аудио файла из текста
     * @param text
     * @return
     * @throws Exception
     */
    String SyntezeWawFile(SyntezeTextModel text) throws Exception;
    /**
     * Возвращает модель глобальных параметров
     * @return
     * @throws Exception
     */
    GlobalParamsModel GetGlobalParams() throws Exception;

    /**
     * Путь к файлу во временной папке на сервере
     * @param fileName
     * @return
     * @throws Exception
     */
    String GetTmpFilePathToServer(String fileName) throws Exception;
    /**
     * Проверка существования кода
     * @param params
     * @return
     * @throws Exception
     */
    boolean CheckPhraseCode(Map<String, Object> params) throws Exception;
    /**
     * Получить фразу по ид
     * @param id
     * @return
     * @throws Exception
     */
    PhraseChangeModel GetPhrase(String id) throws Exception;
    /**
     * Сохранение фразы
     * @param phrase
     * @return
     * @throws Exception
     */
    String SavePhrase(PhraseChangeModel phrase) throws Exception;
    /**
     * Удаление фразы
     * @param id
     * @return
     * @throws Exception
     */
    String DelPhrase(String id) throws Exception;
    /**
     * Полный путь к файлу на сервере по имени
     * @param fileName
     * @return
     * @throws Exception
     */
    String GetPhraseFilePathToServer(String fileName) throws Exception;
    /**
     * Путь к папке с файлами на сервере
     * @return
     * @throws Exception
     */
    String GetPhraseFolderPathToServer() throws Exception;
    /**
     * Путь к временной папке с файлами на сервере
     * @return
     * @throws Exception
     */
    String GetTmpFolderPathToServer()throws Exception;
    /**
     * Получить голосовую модель
     * @param con
     * @param groupId
     * @return
     * @throws Exception
     */
    VoiceModel GetVoiceModel(Connection con, String groupId);
}
