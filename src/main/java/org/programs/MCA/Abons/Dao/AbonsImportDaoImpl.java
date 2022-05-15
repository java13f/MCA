package org.kaznalnrprograms.MCA.Abons.Dao;

import org.kaznalnrprograms.MCA.Abons.Controllers.ImpCsvAbons;
import org.kaznalnrprograms.MCA.Abons.Interfaces.IAbonsImport;
import org.kaznalnrprograms.MCA.Abons.Models.*;
import org.kaznalnrprograms.MCA.Abons.Models.Csv.*;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class AbonsImportDaoImpl implements IAbonsImport {
    private String appName = "Abons - Администратор абонентов.";
    private DBUtils db;
    private ImpCsvAbons impCsvAbons;

    public AbonsImportDaoImpl(DBUtils db) {
        this.db = db;
        impCsvAbons = new ImpCsvAbons();  // Создаем экземпляр класса
    }

    /**
     * Получение абонентов из файла csv
     *
     * @param fileBody
     * @return
     * @throws Exception
     */
    @Override
    public List<AbonModel> getAbonsFromFile(ResultModel fileBody) throws Exception {

        if (fileBody.getResult() == null || fileBody.getResult().length() == 0) {
            return null;
        }

        //Получить все группы
        List<Grp> grps = getGroups();

        // Работа
        List<ArrayList<String>> data = impCsvAbons.ParseCSV(fileBody.getResult(), ",");  // Преобразовываем тело файла в объект data

        String error = impCsvAbons.checkAbons(data, grps);  // Проверяем ошибки
        if (error.length() > 0) {
            var abon = new AbonModel();
            abon.setErrorMessage(error);
            var listAbon = new ArrayList<AbonModel>();
            listAbon.add(abon);
            return listAbon;
        }

        ImpModel model = impCsvAbons.getModel(data);  // Формируем структуру для закачки в БД
        List<AbonModel> listAbons = getListAbons(model);
        listAbons.get(0).setErrorMessage(""); //ошибок нет

        //saveData(model); //Сохраняю данные в базу данных

        return listAbons;
    }


    /**
     * Получаем список абонентов
     *
     * @param model
     * @return
     */
    List<AbonModel> getListAbons(ImpModel model) {

        List<AbonModel> listAbon = new ArrayList<>();

        for (int i = 0; i < model.getAbons().size(); i++) {
            AbonModel abon = new AbonModel();
            abon.setSnils(model.getAbons().get(i).getSnils().trim());
            abon.setFam(model.getAbons().get(i).getFam().trim());
            abon.setIma(model.getAbons().get(i).getIma().trim());
            abon.setOtch(model.getAbons().get(i).getOtch().trim());
            abon.setPrior(model.getAbons().get(i).getPrior().trim());

            final int ii = i;
            //Получаем контакты абонента
            abon.setPins(model.getPins().stream().filter(x -> x.getSnils() == model.getAbons().get(ii).getSnils()).collect(Collectors.toList()));
            //Получаем группы абонента
            abon.setAbonGrps(model.getAbonGrps().stream().filter(x -> x.getSnils() == model.getAbons().get(ii).getSnils()).collect(Collectors.toList()));

            listAbon.add(abon);
        }


        return listAbon;
    }


    /**
     * Загрузка данных абонента в базу данных
     *
     * @param abon
     * @param paramsImport
     * @return Ошибка, Добавлен, Обновлен
     * @throws Exception
     */
    public String saveAbon(AbonModel abon, ParamsImportModel paramsImport) throws Exception {

        String result = "";

        if (existAbon(abon.getSnils())) { //есть такой абонент
            //Обновляю этого абонента, его контакты, и включение в группы
            result = updateAbon(abon, paramsImport);
        } else { //новый абонент
            result = insertAbon(abon, paramsImport);
        }

        return result;
    }

    /**
     * Обновление абонента
     *
     * @param
     * @return
     * @throws Exception
     */
    String updateAbon(AbonModel abon, ParamsImportModel paramsImport) throws Exception {
        try (Connection con = db.getConnectionWithTran(appName)) {
            String sql = "";
            Map<String, Object> params = new HashMap<>();

            String snils = getFormatSnils(abon.getSnils().trim()); //привожу к формату 111-111-111 11
            params.put("snils", snils);

            String abonId = getAbonId(con, snils);

            String stateLock = LockRecord(con, "abons", abonId);
            if (stateLock.length() > 0) { //запись кем то заблокирована
                return "<p><font color='red'; size='3'>ОШИБКА  Абонент с СНИЛС: " + snils + " - ЗАБЛОКИРОВАН (" + stateLock + ")</font></p>";
            }

            params.put("id", UUID.fromString(abonId));
            params.put("surname", abon.getFam().trim());
            params.put("name", abon.getIma().trim());
            params.put("oname", abon.getOtch());
            if (abon.getPrior().length() > 0) {
                params.put("prior", Integer.parseInt(abon.getPrior()));
            } else {
                params.put("prior", -1);
            }

            sql = "UPDATE abons " +
                    "SET prior = " +
                    "(CASE " +
                    "when :prior=-1 THEN null " +
                    "else :prior " +
                    " END), " +
                    "snils = :snils, " +
                    "fam = :surname, " +
                    "ima = :name, " +
                    "otch = :oname, " +
                    "del = 0 " +
                    "WHERE id = :id ";

            db.Execute(con, sql, params);

            SetNo(abon.getPins(), false);
            String resultPins = savePins(con, abon.getPins(), abonId, paramsImport); //результат добавления, обновления контактов
            String resultGroupsAbon = saveAbonToGroup(con, abon.getAbonGrps(), abonId, paramsImport); //результат добавления, обновления групп абонентов

            FreeLockRecord(con, "abons", abonId);

            con.commit();
            return "<p>Абонент с СНИЛС: " + snils + " - ОБНОВЛЕН</p>" + resultPins + resultGroupsAbon;
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Вставляю нового абонента
     *
     * @param abon - модель с данными абонента, его контактов и групп абонентов
     * @return
     * @throws Exception
     */
    String insertAbon(AbonModel abon, ParamsImportModel paramsImport) throws Exception {
        try (Connection con = db.getConnectionWithTran(appName)) {
            String sql = "";
            Map<String, Object> params = new HashMap<>();

            String snils = getFormatSnils(abon.getSnils().trim()); //привожу к формату 111-111-111 11
            params.put("snils", snils);

            params.put("surname", abon.getFam().trim());
            params.put("name", abon.getIma().trim());
            params.put("oname", abon.getOtch());
            if (abon.getPrior().length() > 0) {
                params.put("prior", Integer.parseInt(abon.getPrior()));
            } else {
                params.put("prior", -1);
            }

            sql = "INSERT INTO abons(prior, snils, fam, ima, otch, del) " +
                    "VALUES( " +
                    "(CASE" +
                    "   when :prior=-1 THEN null " +
                    "   else :prior " +
                    "END), " +
                    ":snils, :surname, :name, :oname, 0)";
            String abonId = db.Execute(con, sql, String.class, params);

            SetNo(abon.getPins(), true);
            String resultPins = savePins(con, abon.getPins(), abonId, paramsImport); //результат добавления, обновления контактов
            String resultGroupsAbon = saveAbonToGroup(con, abon.getAbonGrps(), abonId, paramsImport); //результат добавления, обновления групп абонентов

            con.commit();
            return "<p>Абонент с СНИЛС: " + snils + " - ДОБАВЛЕН</p>" + resultPins + resultGroupsAbon;
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Установка параметров импорта (удаление групп абонента)
     * @param con
     * @param abonid
     * @param paramsImport
     */
    void delGroupsAbonParamsImport(Connection con, String abonid, ParamsImportModel paramsImport) throws Exception{
        if(!paramsImport.isDelGroups()){return;}

        try{
            String sql = "update abon_grps " +
             "set del = 1 " +
             "where abon_id = :abonid";

            Map<String,Object> params = new HashMap<>();
            params.put("abonid", UUID.fromString(abonid));

            db.Execute(con, sql, params);
        }catch (Exception ex){
            throw ex;
        }
    }


    /**
     * Установка параметров импорта (удаления контактов)
     * @param paramsImport
     */
    void delPinsParamsImport(Connection con, String abonid, ParamsImportModel paramsImport ) throws Exception
    {
       if (!paramsImport.isDelPhone() && !paramsImport.isDelMobile() && !paramsImport.isDelSms() && !paramsImport.isDelEmail()) {return;}

       try {
           String sql = "update pins " +
                   "set del = 1 " +
                   "where abon_id = :abonid and " +
                   "switch_id in (select id from switchs where code in ('1' ";

           Map<String, Object> params = new HashMap<>();
           params.put("abonid", UUID.fromString(abonid));

           if (paramsImport.isDelPhone()) {
               sql += ",'phone' ";
           }

           if (paramsImport.isDelMobile()) {
               sql += ", 'mobile' ";
           }

           if (paramsImport.isDelSms()) {
               sql += ",'SMS'";
           }

           if (paramsImport.isDelEmail()) {
               sql += ",'EMail'";
           }

           sql += "))";

           db.Execute(con, sql, params);
       } catch (Exception ex){
           throw ex;
       }

    }


    /**
     * Сохранение контактов абонента (insert, update)
     *
     * @param con
     * @param pins
     * @param abonId
     * @throws Exception
     */
    String savePins(Connection con, List<Pin> pins, String abonId, ParamsImportModel paramsImport) throws Exception {
        try {
            delPinsParamsImport(con, abonId, paramsImport);

            String result = "";
            for (Pin pin : pins) {
                boolean isNew = pin.getIsNew();

                String sql = "";
                Map<String, Object> params = new HashMap<>();

                String switchId = getSwitchId(con, pin.getSwitch_type_code());

                String code = "";
                if (pin.getSwitch_type_code().toLowerCase().equals("email")) {
                    code = pin.getCode().toLowerCase();
                } else { //Получение номера телефона без лишних символов (только цифры)
                    code = impCsvAbons.getClearNom(pin.getCode().trim());
                }

                params.put("code", code);
                params.put("codeView", pin.getCode());
                params.put("is_has_dtmf", Integer.parseInt(pin.getIs_has_dtmf()));
                //params.put("info", pin.getInfo());

                if (isNew) { //когда новый абонент
                    params.put("switchId", UUID.fromString(switchId));
                    params.put("abonId", UUID.fromString(abonId));
                    params.put("no", Integer.parseInt(pin.getNo()));
                    addPin(con, params);
                    result += "<p style='padding-left:40px'>контакт " + pin.getCode() + " - ДОБАВЛЕН</p>";
                }
                else { //когда абонент уже существует
                    String pinId = existPin(con, abonId, switchId, code);
                    if (pinId.length() > 0){ //контакт существует
                        params.put("pinid", UUID.fromString(pinId));
                        sql = "update pins " +
                          "set code = :code, " +
                          "code_view = :codeView, " +
                          "is_has_dtmf = :is_has_dtmf, " +
                          "del = 0 " +
                          "where id = :pinid";

                        db.Execute(con, sql, params);
                        result += "<p style='padding-left:40px'>контакт " + pin.getCode() + " - ОБНОВЛЕН</p>";
                    } else {
                        params.put("switchId", UUID.fromString(switchId));
                        params.put("abonId", UUID.fromString(abonId));
                        //Получить следующий номер (no) для контакта
                        Integer no = getNextNo(con, abonId);
                        params.put("no", no);
                        addPin(con, params);
                        result += "<p style='padding-left:40px'>контакт " + pin.getCode() + " - ДОБАВЛЕН</p>";
                    }
                }
            }

            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }




    /**
     * Добавить новый контакт абоненту
     * @param con
     * @param params
     * @throws Exception
     */
    void addPin(Connection con, Map<String, Object> params) throws Exception {
        String sql = "INSERT INTO pins(abon_id, switch_id, code, code_view, no, is_has_dtmf, del) " + //info,
                "VALUES(:abonId, :switchId, :code, :codeView, :no, :is_has_dtmf, 0 )";  //:info,

        db.Execute(con, sql, params);
    }


    /**
     * Проверить существование контакта
     * @param con
     * @param abonId
     * @param switchId
     * @param code
     * @return
     */
    String existPin(Connection con, String abonId, String switchId, String code) throws Exception{

        Map<String, Object> params = new HashMap<>();
        params.put("abonid", UUID.fromString(abonId));
        params.put("switchid", UUID.fromString(switchId));
        params.put("code", code);

        String sql = "select id from pins " +
                "where abon_id = :abonid " +
                "and switch_id = :switchid " +
                "and code = :code";

        List<String> result = db.Query(con, sql, String.class, params);
        if (result.size() == 0) {
            return "";
        }

        return result.get(0);
    }

    /**
     * Добавление/Обновление групп абонента (abon_grps)
     * @param con
     * @param grps
     * @param abonId
     * @return
     * @throws Exception
     */
    String saveAbonToGroup(Connection con, List<AbonGrp> grps, String abonId, ParamsImportModel paramsImport) throws Exception {
        try {
            delGroupsAbonParamsImport(con, abonId, paramsImport);

            String result = "";
            for (AbonGrp grp : grps) {
                String sql = "";
                String groupId = getGroupId(con, grp.getcodeGrp().trim());

                Map<String, Object> params = new HashMap<>();
                params.put("abonid", UUID.fromString(abonId));
                params.put("groupid", UUID.fromString(groupId));

                //Проверка существования абонента в группе
                if (existsAbonInGroup(abonId, groupId)) { //уже присутсвует в группе
                    sql = "UPDATE abon_grps SET Del = 0 " +
                            "WHERE abon_id = :abonid AND grp_id= :groupid ";
                    result += "<p style='padding-left:40px'>группа абонента с кодом: " + grp.getcodeGrp() + " - ОБНОВЛЕНА</p>";
                } else { //добавление абонента в группу
                    sql = "INSERT INTO abon_grps(abon_id, grp_id, del) " +
                            "VALUES(:abonid, :groupid, 0)";
                    result += "<p style='padding-left:40px'>абонент в группу с кодом: " + grp.getcodeGrp() + " - ДОБАВЛЕН<p>";
                }

                db.Execute(con, sql, String.class, params);
            }
            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Получить abonId по СНИЛС
     *
     * @param snils
     * @return
     */
    String getAbonId(Connection con, String snils) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("snils", snils);
        String sql = "select id from abons where snils = :snils";

        List<String> result = db.Query(con, sql, String.class, params);
        if (result.size() == 0) {
            throw new Exception("Не удалось получить идентификатор абонента.");
        }

        return result.get(0);
    }


    /**
     * Получить GroupId по GroupCode
     *
     * @param groupCode
     * @return
     */
    String getGroupId(Connection con, String groupCode) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("code", groupCode);
        String sql = "select id from grps where code = :code";

        List<String> result = db.Query(con, sql, String.class, params);
        if (result.size() == 0) {
            throw new Exception("Не удалось получить идентификатор группы.");
        }

        return result.get(0);
    }


    /**
     * Проверить существование абонента в группе
     *
     * @param abonId
     * @param groupId
     * @return
     * @throws Exception
     */
    public boolean existsAbonInGroup(String abonId, String groupId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("abonid", UUID.fromString(abonId));
            params.put("groupid", UUID.fromString(groupId));

            String sql = "SELECT COUNT(*) FROM abon_grps " +
                    "WHERE abon_id = :abonid  AND grp_id = :groupid ";

            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Получить следующий номер (no) для контакта
     * @return
     */
    Integer getNextNo(Connection con, String abonid){
        Map<String, Object> params = new HashMap<>();
        params.put("abonid", UUID.fromString(abonid));
        //Получить последний no из контактов абонента
        String sql = "select max(no)+1 as no from pins " +
                "where abon_id = :abonid";

        List<String> result = db.Query(con, sql, String.class, params);
        if (result.size() == 0) {
            return 0;
        }

        return  Integer.parseInt(result.get(0)) ;
    }




    /**
     * Установить порядковый номер (no) для контактов и признак новой записи(insert)
     *
     * @param pins
     */
    void SetNo(List<Pin> pins, boolean isNew) {
        for (Integer i = 0; i < pins.size(); i++) {
            pins.get(i).setNo(i.toString());
            pins.get(i).setIsNew(isNew);
        }
    }


    /**
     * Проверка есть ли абонент с таким СНИЛС
     *
     * @param snils
     * @return true - абонент с таким СНИЛС уже есть, false - абонента нет
     * @throws Exception
     */

    Boolean existAbon(String snils) throws Exception {
        try (Connection con = db.getConnection(appName)) {

            Map<String, Object> params = new HashMap<>();
            snils = getFormatSnils(snils.trim()); //привожу к формату 111-111-111 11
            params.put("snils", snils);

            String sql = "select count(*) from abons " +
                    "where snils = :snils ";

            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Преобразовать СНИЛС
     *
     * @param snils На вход приходит строка (11 символов) '12345678910'
     * @return out 123-456-789 10
     */
    String getFormatSnils(String snils) {
        if (snils.length() == 0) {
            return "";
        }

        String fsnils = "";
        for (int i = 0; i < snils.length(); i++) {
            fsnils += snils.toCharArray()[i];
            if (i == 2 || i == 5) {
                fsnils += '-';
            }
            if (i == 8) {
                fsnils += ' ';
            }
        }

        return fsnils;
    }


    /**
     * Получить SwitchId по SwitchCode
     *
     * @param switch_code
     * @return
     */
    String getSwitchId(Connection con, String switch_code) throws Exception {
        String sql = "";
        Map<String, Object> params = new HashMap<>();
        params.put("code", switch_code);
        sql = "select id from switchs where code = :code";

        List<String> result = db.Query(con, sql, String.class, params);
        if (result.size() == 0) {
            throw new Exception("Не удалось получить коммутацию");
        }

        return result.get(0);
    }


    /**
     * Получить список групп
     *
     * @return
     */
    public List<Grp> getGroups() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "select code,name from grps";
            List<Grp> result = db.Query(con, sql, Grp.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить список групп.");
            }

            return result;
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Проверить сосояние блокировки записи
     *
     * @param table - имя таблицы базы данных
     * @param uuid  - уникальный идентификатор
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    String StateLockRecord(Connection con, String table, String uuid) throws Exception {
        Map<String, Object> params = new Hashtable<>();

        params.put("recId", UUID.fromString(uuid));
        params.put("table", table);

        String sql = "SELECT u.Name FROM LockTable lt"
                + " JOIN i_users u ON u.Id = lt.i_user_id"
                + " WHERE lt.recuuid = :recId AND lt.ObjectId = GetObject_Id(:table)";

        List<String> result = db.Query(con, sql, String.class, params);
        if (result.size() > 0) {
            String userName = result.get(0);
            return "Запись редактируется пользователем " + userName;
        }
        return "";
    }


    /**
     * Накладывает блокировку на запись
     *
     * @param table - имя таблицы базы данных
     * @param uuid  - уникальный идентификатор записи
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    String LockRecord(Connection con, String table, String uuid) throws Exception {
        String state = StateLockRecord(con, table, uuid);
        if (!state.isEmpty()) {
            return state;
        }

        String userCode = db.getUserCode();

        Map<String, Object> params = new Hashtable<>();
        params.put("recId", UUID.fromString(uuid));
        params.put("userCode", userCode);
        params.put("table", table);

        String sql = "INSERT INTO LockTable (Id, ObjectId, Recuuid, Date, i_user_id) VALUES(uuid_generate_v4(), GetObject_Id(:table), :recId"
                + ", current_timestamp, (SELECT Id FROM i_users WHERE login = :userCode))";


        db.Execute(con, sql, params);
        return "";
    }


    /**
     * Удаляет блокировку
     *
     * @param table - имя таблицы базы данных
     * @param uuid  - уникальный идентификатор записи
     */
    void FreeLockRecord(Connection con, String table, String uuid) throws Exception {

        Map<String, Object> params = new Hashtable<>();
        String userCode = db.getUserCode();
        params.put("userCode", userCode);
        String sql = "SELECT Id FROM i_users WHERE login = :userCode";
        UUID UserId = db.Query(con, sql, UUID.class, params).get(0);
        params.clear();

        sql = "DELETE FROM LockTable WHERE ObjectId = GetObject_Id(:table)"
                + " AND Recuuid = :recId AND i_user_id = :UserId";
        params.put("recId", UUID.fromString(uuid));
        params.put("table", table);
        params.put("UserId", UserId);

        db.Execute(con, sql, params);
    }


}
