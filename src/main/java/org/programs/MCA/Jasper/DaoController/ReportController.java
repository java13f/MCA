package org.kaznalnrprograms.MCA.Jasper.DaoController;

import org.kaznalnrprograms.MCA.Jasper.Models.ReportDataModel;
import org.kaznalnrprograms.MCA.Jasper.Models.RepParams;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ReportController {
    private IReportDao dReport;

    /*
    Конструктор класса
     */
    public ReportController(IReportDao dReport) {
        this.dReport = dReport;
    }

    /**
     * Построение отчёта
     * @param repParams
     * @return
     * @throws Exception
     */
    @PostMapping("Jasper/generateReport")
    @ResponseBody
    public ReportDataModel generateReport(@RequestBody RepParams repParams) throws Exception {
        return dReport.generateReport(repParams);
    }
}