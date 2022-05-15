package org.kaznalnrprograms.MCA.Notes.Interfaces;

import org.kaznalnrprograms.MCA.Notes.Models.*;

import java.util.List;

public interface INotesDao {
    /**
     * Все права на модуль
     * @return
     * @throws Exception
     */
    NotesRightModel GetActRights() throws Exception;
    /**
     * Получить список шаблонов
     * @param filter
     * @return
     * @throws Exception
     */
    List<PatternViewModel> GetPatterns(PatternFilterModel filter) throws Exception;
    /**
     * Получить список заданий
     * @param filter
     * @return
     * @throws Exception
     */
    List<NotesViewModel> GetNotes(NoteFilterModel filter) throws Exception;
    /**
     * Получить статус задания по ид задания
     * @param noteId
     * @return
     * @throws Exception
     */
    SttsModel GetNoteStts(String noteId) throws Exception;
    /**
     * Получить список статусов
     * @return
     * @throws Exception
     */
    List<SttsModel> LoadSttsList() throws Exception;
    /**
     * Проверка соответствия
     * @param id
     * @return
     * @throws Exception
     */
    List<PinModel> GetPinsNoNotify(String id) throws Exception;
    /**
     * Запись контактов, которые не возможно оповестить в протокол
     * @param pins
     * @return
     * @throws Exception
     */
    String AddPinsToLog(List<PinModel> pins) throws Exception;
    /**
     * Запуск или остановка задания
     * @param noteId - ид задания
     * @return
     * @throws Exception
     */
    NoteFuncModel RunOrStopNotify(String noteId) throws Exception;
}
