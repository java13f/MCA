package org.kaznalnrprograms.MCA.GrpList.Interfaces;

import org.kaznalnrprograms.MCA.GrpList.Models.FilterModel;
import org.kaznalnrprograms.MCA.GrpList.Models.GroupViewModel;

import java.util.List;

public interface IGrpList {
    /**
     * Получить список групп для грида
     * @param filter - фильтр
     * @return
     * @throws Exception
     */
    List<GroupViewModel> listGroup(FilterModel filter) throws Exception;
}
