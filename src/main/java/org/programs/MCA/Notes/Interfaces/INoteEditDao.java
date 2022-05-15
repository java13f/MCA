package org.kaznalnrprograms.MCA.Notes.Interfaces;

import org.kaznalnrprograms.MCA.Notes.Models.DialogAllModel;
import org.kaznalnrprograms.MCA.Notes.Models.ListItemEditModel;
import org.kaznalnrprograms.MCA.Notes.Models.NoteEditModel;

import java.util.List;

public interface INoteEditDao {
    /**
     * Получить задание по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    NoteEditModel GetNoteFromId(String id) throws Exception;
    /**
     * Получить общий диалог по идентификатору
     * @param id
     * @return
     * @throws Exception
     */
    DialogAllModel GetDialogAllFromId(String id) throws Exception;
    /**
     * Удаление задания
     * @param id
     * @return
     * @throws Exception
     */
    String DelNote(String id) throws Exception;
    /**
     * Сохранение задания
     * @param note
     * @return
     * @throws Exception
     */
    String SaveNote(NoteEditModel note) throws Exception;
    /**
     * Получить список абонентов для новой задачи из шаблона
     * @param patternId
     * @return
     * @throws Exception
     */
    List<ListItemEditModel> GetListItemsFromPatternId(String patternId) throws Exception;
}
