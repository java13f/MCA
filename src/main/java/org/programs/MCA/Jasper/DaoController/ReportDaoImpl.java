package org.kaznalnrprograms.MCA.Jasper.DaoController;

import org.kaznalnrprograms.MCA.Jasper.Models.ReportDataModel;
import org.kaznalnrprograms.MCA.Jasper.Models.RepParams;
import org.kaznalnrprograms.MCA.Jasper.Report;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

@Repository
public class ReportDaoImpl implements IReportDao {
    @Value("${JndiName}")
    private String jndiName;

    private String appName = "Report - модуль печати отчётов";
    private DBUtils db;

    public ReportDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Возвращает  имя источника данных
     *
     * @return
     */
    private String getDataSourceName() {
        String r = jndiName.substring(15);
        return r;
    }

    /**
     * Построение отчёта
     * @param repParams
     * @return
     * @throws Exception
     */
    @Override
    public ReportDataModel generateReport(RepParams repParams) throws Exception {
        Report rep = new Report(getDataSourceName());
        String repPath = getPathToJrxml();
        ReportDataModel reportData = rep.generateReport(repPath, repParams);
        return reportData;
    }

    /**
     * Получение пути к файлам отчётов Jasper
     * @return
     * @throws Exception
     */
    @Override
    public String getPathToJrxml() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT \"value\" as val FROM global_params WHERE param_code = 'jasperrep'";
            String result = db.Query(con, sql, String.class, null).get(0);
            if (result == null) {
                return "";
            }
            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }
}
