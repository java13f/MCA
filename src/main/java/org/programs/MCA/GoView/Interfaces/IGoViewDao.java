package org.kaznalnrprograms.MCA.GoView.Interfaces;

import org.kaznalnrprograms.MCA.GoView.Models.AbonServModel;
import org.kaznalnrprograms.MCA.GoView.Models.AllCombobox;
import org.kaznalnrprograms.MCA.GoView.Models.DGsModel;
import org.kaznalnrprograms.MCA.GoView.Models.StatModel;

import java.util.List;

public interface IGoViewDao {
    AllCombobox      PttrnList()                   throws Exception;
    AllCombobox      TasksList()                   throws Exception;
    AllCombobox      AsterList(AbonServModel data) throws Exception;
    AllCombobox      SMSList  (AbonServModel data) throws Exception;
    AllCombobox      EMailList(AbonServModel data) throws Exception;
    StatModel        GetStat  (String note_id)     throws Exception;
    List<DGsModel>   QueueList(AbonServModel data) throws Exception;
    List<DGsModel>   NoteList (AbonServModel data) throws Exception;
    AbonServModel    GetInterval()                 throws Exception;
}
