package org.kaznalnrprograms.MCA.DialogsList.Innterfaces;

import org.kaznalnrprograms.MCA.DialogsList.Models.DialogsListViewModel;
import org.kaznalnrprograms.MCA.DialogsList.Models.FilterModel;

import java.util.List;

public interface IDialogsListDao {
    /**
     * Список диалогов
     * @return
     * @throws Exception
     */
    List<DialogsListViewModel> GetList(FilterModel filter) throws Exception;
}
