package org.kaznalnrprograms.MCA.Jasper;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import net.sf.jasperreports.export.*;

import org.kaznalnrprograms.MCA.Jasper.Models.ReportDataModel;
import org.kaznalnrprograms.MCA.Jasper.Models.RepParams;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;

import java.sql.DriverManager;
import java.sql.SQLException;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import java.util.*;

/**
 * Класс для генерации отченов .jrxml-файлов
 */
public class Report {
    static java.sql.Connection pgCon = null;
    static JasperPrint jasperPrint = null;

    /**
     * Конструктор
     *
     * @param jdbcName - имя jdbc-драйвера:  new Report("jdbc/MCA"); //(<Resource name="jdbc/MCA")
     * @throws IOException
     * @throws SAXException
     * @throws ParserConfigurationException
     */
    public Report(String jdbcName) throws IOException, SAXException, ParserConfigurationException, SQLException {
        HashMap<String, String> connectParam = getConnect(jdbcName);
        Properties properties = new Properties();                     // Определение свойств подключения Connection
        properties.setProperty("password", connectParam.get("password"));
        properties.setProperty("user", connectParam.get("user"));
        ;
        if (pgCon == null) {

            for (int i = 0; i < 1; i++) {
                try {
                    pgCon = DriverManager.getConnection(connectParam.get("url"), properties);   // Пробуем соединиться (с первого раза не соединянтся)
                    if (pgCon != null)
                        break;
                } catch (SQLException e) {
                    ;
                }                                                     // С первого раза не соединилось, пробуем еще раз
                if (pgCon == null) {
                    try {
                        pgCon = DriverManager.getConnection(connectParam.get("url"), properties); // Пробуем последний раз, если не соединиться - выдаем ошибку
                    } catch (SQLException e) {
                        throw e;
                    }
                }
            }
        }
    }


    /**
     * Метод определят из файла server.xml параметры соединения с базой данных (url, username, password)
     *
     * @param jdbcName -  имя jdbc-драйвера  (<Resource name="jdbc/MCA")
     * @return возвращает объект тип Map
     * @throws ParserConfigurationException
     * @throws IOException
     * @throws SAXException
     */
    private HashMap<String, String> getConnect(String jdbcName) throws ParserConfigurationException, IOException, SAXException {
        try {
            HashMap<String, String> connectParam = new HashMap<>();
            DocumentBuilder documentBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document document = documentBuilder.parse(getPathToConfServer());
            Node root = document.getDocumentElement();
            NodeList nodes = root.getChildNodes();
            for (int i = 0; i < nodes.getLength(); i++) {
                Node node = nodes.item(i);
                if (node.getNodeName() == "GlobalNamingResources") {
                    NodeList subNodes = node.getChildNodes();
                    for (int j = 0; j < nodes.getLength(); j++) {
                        Node subNode = subNodes.item(j);
                        if (subNode.getNodeName() == "Resource") {
                            for (int k = 0; k < subNode.getAttributes().getLength(); k++) {
                                if (subNode.getAttributes().item(k).getNodeName() == "name") {
                                    String value = subNode.getAttributes().item(k).getNodeValue();
                                    if (value.equals(jdbcName)) {
                                        for (int l = 0; l < subNode.getAttributes().getLength(); l++) {
                                            if (subNode.getAttributes().item(l).getNodeName().equals("url"))
                                                connectParam.put("url", subNode.getAttributes().item(l).getNodeValue());
                                            if (subNode.getAttributes().item(l).getNodeName().equals("password"))
                                                connectParam.put("password", subNode.getAttributes().item(l).getNodeValue());
                                            if (subNode.getAttributes().item(l).getNodeName().equals("username"))
                                                connectParam.put("user", subNode.getAttributes().item(l).getNodeValue());
                                        }
                                        return connectParam;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return connectParam;
        } catch (Exception e) {
            throw e;
        }
    }


    /**
     * Получение пути к файлу конфигурации Tomcat
     *
     * @return
     */
    private String getPathToConfServer() {
        String pathToTomcat = System.getProperty("catalina.base");
        var targetFilePath = Paths.get(pathToTomcat, "conf/server.xml").toString().replace("\\\\", "/").replace('\\', '/');
        return targetFilePath;
    }

    /**
     * Преобразование приходящих параметров в формат Map
     *
     * @param repParams
     * @return
     * @throws ParseException
     */
    public Map getParams(RepParams repParams) {
        Map params = new HashMap();
        if (repParams.getParams() != null) {
            for (int i = 0; i < repParams.getParams().length; i++) {
                switch (repParams.getParams()[i].getType().toLowerCase()) {
                    case ("int"):
                        params.put(repParams.getParams()[i].getName(), repParams.getParams()[i].getVal(0));
                        break;
                    case ("string"):
                        params.put(repParams.getParams()[i].getName(), repParams.getParams()[i].getVal(""));
                        break;
                    case ("date"):
                        try {
                            params.put(repParams.getParams()[i].getName(), repParams.getParams()[i].getVal(new Date()));
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                        break;
                    case ("double"):
                        params.put(repParams.getParams()[i].getName(), repParams.getParams()[i].getVal(0.1));
                        break;
                }
            }
        }
        return params;
    }

    /**
     * Построение отчёта
     *
     * @param repPath
     * @param repParams
     * @return
     * @throws IOException
     * @throws JRException
     * @throws ParseException
     */
    public ReportDataModel generateReport(String repPath, RepParams repParams) throws JRException, UnsupportedEncodingException {
        Map params = getParams(repParams);

        String repName = repParams.getJrxml();
        String fullRepPath = repPath  + repName + ".jrxml";
        fullRepPath = fullRepPath.replace("\\\\", "/")
                .replace("\\", "/");

        try {
            Exporter exporter;
            JasperDesign jasperDesign = new JasperDesign();
            jasperDesign = JRXmlLoader.load(fullRepPath);
            JasperReport jasperReport = JasperCompileManager.compileReport(jasperDesign);
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            jasperPrint = JasperFillManager.fillReport(jasperReport, params, pgCon);
            boolean html = false;

            switch (repParams.getReportType().toLowerCase()) {
                case "html":
                    exporter = new HtmlExporter();
                    exporter.setExporterOutput(new SimpleHtmlExporterOutput(byteArrayOutputStream));
                    html = true;
                    break;

                case "pdf":
                    exporter = new JRPdfExporter();
                    break;

                case "docx":
                    exporter = new JRDocxExporter();
                    SimpleDocxReportConfiguration conf = new SimpleDocxReportConfiguration();
                    conf.setFramesAsNestedTables(false);
                    exporter.setConfiguration(conf);
                    break;

                case "xls":
                    exporter = new JRXlsExporter();
                    SimpleXlsReportConfiguration xlsReportConfiguration = new SimpleXlsReportConfiguration();
                    xlsReportConfiguration.setOnePagePerSheet(false); // true -разделение на листы в Excel, false - всё на одном листе
                    xlsReportConfiguration.setRemoveEmptySpaceBetweenRows(false); // true - убрать проблемы между листами при экспорте одним листом
                    xlsReportConfiguration.setDetectCellType(true);
                    xlsReportConfiguration.setWhitePageBackground(false);
                    exporter.setConfiguration(xlsReportConfiguration);
                    break;

                default:
                    throw new JRException("Неизвестный тип отчёта:" + repParams.getReportType().toLowerCase());
            }

            if (!html) {
                exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(byteArrayOutputStream));
            }
            exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
            exporter.exportReport();

            byte[] bytefromstream = byteArrayOutputStream.toByteArray();

            ReportDataModel repFile = new ReportDataModel();
            if (html) {
                repFile.setContent(new String(bytefromstream, StandardCharsets.UTF_8));
            } else {
                repFile.setContent(Base64.getEncoder().encodeToString(bytefromstream));
            }
            repFile.setFileName(repName + "_" + getCurrentDate());

            return repFile;
        } catch (JRException e) {
            if (e.getClass().getName() == "net.sf.jasperreports.engine.JRException") {
                throw new JRException(e.getMessage() + " " + ((JRException) e).getCause());
            }
            throw e;
        }
    }

    /*
    Получение текущей даты и времени (01.01.2020_12-00-00)
     */
    private String getCurrentDate() {
        SimpleDateFormat formatter = new SimpleDateFormat("dd.MM.yyyy_HH-mm-ss");
        return formatter.format(new Date());
    }
}



