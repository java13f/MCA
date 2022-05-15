package org.kaznalnrprograms.MCA.Jasper.DaoController;

import org.kaznalnrprograms.MCA.Jasper.Models.ReportDataModel;
import org.kaznalnrprograms.MCA.Jasper.Models.RepParams;

public interface IReportDao {
    String getPathToJrxml() throws Exception;

    ReportDataModel generateReport(RepParams repParams) throws Exception;
}
