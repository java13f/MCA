package org.kaznalnrprograms.MCA.Abons.Interfaces;

import org.kaznalnrprograms.MCA.Abons.Models.GroupViewModel;
import org.kaznalnrprograms.MCA.Abons.Models.ResultModel;
import org.kaznalnrprograms.MCA.Abons.Models.Service.AbonsDtmfModel;
import org.kaznalnrprograms.MCA.Abons.Models.Service.InstallDtmfModel;
import org.kaznalnrprograms.MCA.Abons.Models.Service.PinsAbonModel;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface IAbonsService {

    /**
     * Получить список групп
     * @throws Exception
     */
    List<GroupViewModel> getGroups() throws Exception;


    /**
     * Получить список абонентов в группе
     * @throws Exception
     */
    List<AbonsDtmfModel> getListAbonInGroup(ResultModel groupid) throws Exception;


    /**
     * Получить абонента по ид
     * @param id
     * @return
     * @throws Exception
     */
    String getAbonById(String id) throws Exception;


    /**
     * Получить список контактов (phone) абонента
     * @param abonid
     * @return
     * @throws Exception
     */
    List<PinsAbonModel> getPinsAbon(ResultModel abonid) throws Exception;


    /**
     *
     * @param installDtmf
     * @return
     * @throws Exception
     */
    String installDtmf(InstallDtmfModel installDtmf) throws Exception;

}
