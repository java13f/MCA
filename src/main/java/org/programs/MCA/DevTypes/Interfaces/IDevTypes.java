package org.kaznalnrprograms.MCA.DevTypes.Interfaces;

import org.kaznalnrprograms.MCA.DevTypes.Models.*;

import java.util.List;
import java.util.Map;

public interface IDevTypes
{
    List<DevTypesView> GetList(Boolean del) throws Exception;
    String Save(DevTypesSave model) throws Exception;
    void Delete(Map<String, Object> model) throws Exception;
    DevTypesSave GetDevType(Map<String, Object> model) throws Exception;
    RightsModel GetActRights () throws Exception;
    String GetLockRecords() throws Exception;
}
