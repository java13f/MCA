package org.kaznalnrprograms.MCA.Switchs.Interfaces;

import org.kaznalnrprograms.MCA.Switchs.Models.SwitchsAuxiliaryModel;
import org.kaznalnrprograms.MCA.Switchs.Models.SwitchsCodeModel;
import org.kaznalnrprograms.MCA.Switchs.Models.SwitchsModel;
import org.kaznalnrprograms.MCA.Switchs.Models.SwitchsViewModel;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

public interface ISwitchsDirectoryDao {

    /**
     * Получить список коммутаций
     * @param ShowDel флаг неудаленная/удаленная запись
     * @return
     * @throws Exception
     */
    List<SwitchsViewModel> list(boolean ShowDel) throws Exception;

    /**
     * Получение коммутации для просмотра/изменения
     * @param id запсии в таблице switchs
     * @return
     * @throws Exception
     */
    SwitchsModel get(SwitchsAuxiliaryModel id) throws Exception;

    /**
     * Добавить изменить коммутацию
     * @param swt модель коммутаций
     * @return
     * @throws Exception
     */
     UUID save(SwitchsModel swt) throws Exception;

    /**
     * Удаление коммутации
     * @param id запсии в таблице switchs
     * @throws Exception
     */
    void delete(int id) throws Exception;

    /**
     * Данные для comboBox Тип коммутаций
     * @return
     * @throws Exception
     */
    List<SwitchsCodeModel> getCode() throws Exception;

}
