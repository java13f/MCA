package org.kaznalnrprograms.MCA.jrResultOfNotification.Interfaces;

import org.kaznalnrprograms.MCA.jrResultOfNotification.Models.NoteModel;
import org.kaznalnrprograms.MCA.jrResultOfNotification.Models.TimeModel;

import java.util.List;

public interface IjrResultOfNotificationDao {
    /*
    Получить список оповещений по дате
     */
    List<NoteModel> getNotesByDate(String date) throws Exception;

    /*
    Получить список времён оповещения по дате и идентификатору оповещения
     */
    List<TimeModel> getListTimeByNoteAndDate(String note_id, String date) throws Exception;
}
