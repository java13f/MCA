package org.kaznalnrprograms.MCA.Dialogs.Dao;

import org.kaznalnrprograms.MCA.Dialogs.Interfaces.IDialogsDao;
import org.kaznalnrprograms.MCA.Dialogs.Models.*;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.kaznalnrprograms.MCA.Dialogs.Utils.*;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;


import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Repository
public class DialogsImpl implements IDialogsDao {

    private String appName = "Конструктор диалогов";
    private DBUtils db;

    public DialogsImpl(DBUtils db) {
        this.db = db;
    }


    /**
     * Проверка слова в словаре если нет, добавить
     * @param model
     * @return
     * @throws Exception
     */
    public String CheckAndAddWords(Map<String, Object> model) throws Exception {
        try (var con = db.getConnection(appName)) {
            ArrayList<String> words = (ArrayList<String>) model.get("wordsArray");
            var vocItemId = model.get("vocItemId");
            return "";
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Возвращает данные для комбобокса Общие диалоги
     * @return
     */
    @Override
    public List<CBModel> DlgAll() throws Exception {
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();

            var sql = "SELECT id, name " +
                      "FROM dlg_alls " +
                      "WHERE del = 0 " +
                      "ORDER BY name";
            var r = db.Query(con, sql, CBModel.class, params);
            return r;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Возвращает данные для грида Общие Диалоги
     * @return
     */
    @Override
    public List<DGDialogAllsModel> DialogAllsGrid(Simple data) throws Exception {
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            params.put("show_del", (data.getStr()=="true"?1:0));

            var sql = "SELECT id, code, name," +
                    "is_active," +
                    "CASE WHEN is_active = 1 THEN 'Да' ELSE '-' END is_active_name," +
                    "del " +
                    "FROM dlg_alls " +
                    "WHERE del = CASE WHEN :show_del=1 THEN del ELSE 0 END " +
                    "ORDER BY code";
            var r = db.Query(con, sql, DGDialogAllsModel.class, params);
            return r;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Возвращает данные для грида Диалоги
     * @param data
     * @return
     */
    @Override
    public List<DGDialogsModel> DialogsGrid(Simple data) throws Exception {
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            params.put("dlg_all_id", UUID.fromString(data.getStr()));

            var sql = "SELECT d.id, d.name, d.is_dtmf, l.name link_type_name, link_type_id, l.code link_type_code, d.perc, v.id voc_id, v.name voc_name " +
                    "FROM dialogs d " +
                    "JOIN link_types l on l.id = d.link_type_id and l.del = 0 " +
                    "LEFT JOIN vocs v ON d.voc_id = v.id " +
                    "WHERE dlg_all_id = :dlg_all_id " +
                    "ORDER BY d.name";
            var r = db.Query(con, sql, DGDialogsModel.class, params);
            return r;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Возвращает данные для грида Обращения
     * @param data
     * @return
     */
    @Override
    public List<DGMessegesModel> MessegesGrid(Simple data) throws Exception {
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            params.put("dlg_id", UUID.fromString(data.getStr()));

            var sql = "SELECT m.id, m.no, CASE WHEN m.phrase_id IS NULL THEN replace(m.info_ru, '+', '') ELSE replace(ph.name, '+', '') END info_ru " +
                        "FROM messages m LEFT JOIN phrases ph ON m.phrase_id = ph.id " +
                        "WHERE m.dialog_id = :dlg_id " +
                        "ORDER BY m.no";
            var r = db.Query(con, sql, DGMessegesModel.class, params);
            return r;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Возвращает данные для грида Ответа
     * @param data
     * @return
     */
    @Override
    public List<DGAnswerModel> AnswerGrid(Simple data) throws Exception {
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            params.put("msg_id", UUID.fromString(data.getStr()));

            var sql = "SELECT a.id, replace(a.value, '+', '') AS value, a.info, " +
                    "CASE WHEN m.phrase_id IS NULL THEN m.info_ru ELSE replace(ph.name, '+', '') END next_msg_name, m.id next_msg_id " +
                    "FROM answers a left " +
                    "JOIN messages m ON m.id = a.next_msg_id " +
                    "LEFT JOIN phrases ph ON ph.id = m.phrase_id " +
                    "WHERE message_id = :msg_id " +
                    "ORDER BY value ";
            var r = db.Query(con, sql, DGAnswerModel.class, params);
            return r;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение прав
     * @return
     * @throws Exception
     */
    @Override
    public RightsModel GetActRights() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT get_act_rights('Dialogs', 'DlgAllChange') dlgAllChange, " +
                    "get_act_rights('Dialogs', 'DlgAllDel') dlgAllDel, " +
                    "get_act_rights('Dialogs', 'DialogChange') dialogChange, " +
                    "get_act_rights('Dialogs', 'DialogDel') dialogDel, " +
                    "get_act_rights('Dialogs', 'MessagesChange') messagesChange, " +
                    "get_act_rights('Dialogs', 'MessagesDel') messagesDel, " +
                    "get_act_rights('Dialogs', 'AnswersChange') answersChange, " +
                    "get_act_rights('Dialogs', 'AnswersDel') answersDel ";
            return db.Query(con, sql, RightsModel.class, null).get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /** ----------------------------------- Действия с "Общие диалоги" -------------------------------------- */

    /**
     * Активация общего диалога
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public String ActivateDlgAll(Map<String, Object> model) throws Exception {
        try (Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("dlg_all_id").toString()));

            //String checkWords = CheckAndAddWords()

            String sql = "SELECT chk_dlg_active(:id)";
            String result = db.Query(con, sql, String.class, params).get(0);

            return result;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Деактивация общего диалога
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public String DeactivateDlgAll(Map<String, Object> model) throws Exception {
        try (Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("dlg_all_id").toString()));
            String sql = "SELECT chk_dlg_deactive(:id)";
            String result = db.Query(con, sql, String.class, params).get(0);

            return result;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранение записи Общие диалоги
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public String SaveDialogAll(DGDialogAllsModel model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("code", model.getCode());
            params.put("name", model.getName());

            String sql = "";
            if(model.getId().equals("-1")){
                sql = "INSERT INTO dlg_alls (code, name, del, is_active)"
                        +" VALUES(:code, :name, 0, 0)";
                model.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                params.put("id", UUID.fromString(model.getId()));
                db.CheckLock(con, -1, model.getId(), "dlg_alls");
                sql = "UPDATE dlg_alls SET code = :code, name = :name WHERE id = :id";
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удаление записи из таблицы dlg_alls грида Общие диалоги
     * @param model
     * @throws Exception
     */
    @Override
    public void DeleteDialogAll(Map<String, Object> model) throws Exception {
        try(var con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "UPDATE dlg_alls SET del = 1 - del WHERE id = :id";
            db.Execute(con, sql, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение записи для грида Общие диалоги
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public DGDialogAllsModel GetDialogAllInfo(Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "SELECT id, code, name, changer, creator, " +
                            "to_char(DATE_TRUNC('second', created), 'DD.MM.YYYY HH:MM:SS') created, " +
                            "to_char(DATE_TRUNC('second', changed), 'DD.MM.YYYY HH:MM:SS') changed " +
                        "FROM dlg_alls WHERE id = :id";
            List<DGDialogAllsModel> result = db.Query(con, sql, DGDialogAllsModel.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись \"Общие диалоги\" таблицы dlg_alls с id = " + model.get("id").toString());
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка уникальности кода в таблице dlg_alls
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public Integer IsDlgAllCodeUnique(Map<String, Object> model) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();

            String strId = "";
            if(!model.get("id").toString().equals("-1"))
            {
                params.put("id", UUID.fromString(model.get("id").toString()));
                strId =  " AND id <> :id";
            }

            params.put("code", model.get("code"));
            String sql = "SELECT COUNT(*) count " +
                    "FROM dlg_alls " +
                    "WHERE code = :code " + strId;
            List<Integer> result = db.Query(con, sql, Integer.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось проверить уникальность code = " + model.get("code").toString() + " в таблице dlg_alls");
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Проверка уникальности наимнования в таблице dlg_alls
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public Integer IsDlgAllNameUnique(Map<String, Object> model) throws Exception
    {
        try(Connection con = db.getConnection(appName))
        {
            Map<String, Object> params = new HashMap<>();

            String strId = "";
            if(!model.get("id").toString().equals("-1"))
            {
                params.put("id", UUID.fromString(model.get("id").toString()));
                strId =  " AND id <> :id";
            }
            params.put("name", model.get("name"));
            String sql = "SELECT COUNT(*) count " +
                    "FROM dlg_alls " +
                    "WHERE name = :name " + strId;
            List<Integer> result = db.Query(con, sql, Integer.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось проверить уникальность name = " + model.get("name") + " Id = " + params.get("id") + " в таблице dlg_alls");
            }

            return result.get(0);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    /**
     * Проверить активен ли Общий диалог
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public Integer IsRecActive(Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("dlg_all_id").toString()));
            String sql = "SELECT is_active FROM dlg_alls WHERE id = :id";
            List<Integer> result = db.Query(con, sql, Integer.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить информаци об активности записи \"Общие диалоги\" таблицы dlg_alls с id = " + model.get("dlg_all_id").toString());
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /** --------------------------------- ######################################## -----------------------------------*/


    /** ----------------------------------- Действия с "Обращения к абонентам" -------------------------------------- */

    /**
     * Сохранение записи "Диалоги оповещения"
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public String SaveDialog(DGDialogsModel model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("perc", Integer.parseInt(model.getPerc()));
            params.put("name", model.getName());

            Map<String, Object> recParams = new HashMap<>();
            recParams.put("dlg_all_id", model.getDlg_all_id());
            Integer active_flag = IsRecActive(recParams);
            if(active_flag == 1) {
                throw new Exception("Сохранить запись невозможно, так как общий диалог Id = " +  recParams.get("dlg_all_id").toString() + " является активным!");
            }

            String voc_param = "";
            String voc_value = "";

            String sql = "";
            if(model.getId().equals("-1")){

                if(model.getVoc_id() != null) {
                    voc_param = ", voc_id";
                    voc_value = ", :voc_id";
                    params.put("voc_id", UUID.fromString(model.getVoc_id()));
                }

                sql = "INSERT INTO dialogs (perc, name" + voc_param + ")"
                        +" VALUES(:perc, :name" + voc_value + ")";
                model.setId(db.Execute(con, sql, String.class, params));
            }
            else {

                if(model.getVoc_id() != null) {
                    voc_param = ", voc_id = ";
                    voc_value = ":voc_id";
                    params.put("voc_id", UUID.fromString(model.getVoc_id()));
                }

                params.put("id", UUID.fromString(model.getId()));
                db.CheckLock(con, -1, model.getId(), "dialogs");
                sql = "UPDATE dialogs SET perc = :perc, name = :name " + voc_param + voc_value + " WHERE id = :id";
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Копирование записи таблицы dialogs грида "Диалоги оповещения"
     * @param model
     * @throws Exception
     */
    @Override
    public String CopyDialog(Map<String, Object> model) throws Exception {
        try(var con = db.getConnectionWithTran(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("copy_to_row_id", UUID.fromString(model.get("copy_to_row_id").toString()));
            String sql = "DELETE FROM answers a WHERE a.message_id IN (SELECT m.id FROM messages m WHERE m.dialog_id = :copy_to_row_id)";
            db.Execute(con, sql, params);

            sql = "DELETE FROM messages WHERE dialog_id = :copy_to_row_id";
            db.Execute(con, sql, params);


            params.put("copy_from_row_id", UUID.fromString(model.get("copy_from_row_id").toString()));
            sql = "INSERT INTO messages (dialog_id, no, info_ru, phrase_id) SELECT :copy_to_row_id, m2.no, m2.info_ru, m2.phrase_id "
                    + "FROM messages m2 WHERE m2.dialog_id = :copy_from_row_id";
            db.Execute(con, sql, params);

            sql = "INSERT INTO answers (message_id, value, info, next_msg_id) " +
                    "SELECT m1.id, a.value, a.info , (SELECT m1.id FROM messages m2 " +
                                                        "JOIN messages m1 ON m2.no = m1.no AND m2.phrase_id = m1.phrase_id " +
                                                        "JOIN answers a ON m2.id = a.next_msg_id " +
                                                        "WHERE m2.dialog_id = :copy_from_row_id " +
                                                        "AND m1.dialog_id = :copy_to_row_id) next_msg_id " +
                    "FROM messages m2 " +
                    "JOIN messages m1 ON m2.no = m1.no AND m2.phrase_id = m1.phrase_id " +
                    "JOIN answers a ON m2.id = a.message_id " +
                    "WHERE m2.dialog_id = :copy_from_row_id " +
                    "AND m1.dialog_id = :copy_to_row_id";

            db.Execute(con, sql, params);
            con.commit();

            return "";
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удаление записи из таблицы dialogs грида "Диалоги оповещения"
     * @param model
     * @throws Exception
     */
    @Override
    public void DeleteDialog(Map<String, Object> model) throws Exception {
        try(var con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "UPDATE dialogs SET del = 1 - del WHERE id = :id";
            db.Execute(con, sql, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить запись из модуля Vocs
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public VocsModel GetVocsInfo (Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            if (model.get("id") == null) {
                throw new Exception("Не удалось получить информацию о словаре");
            }

            var params = new HashMap<String, Object>();
            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "SELECT id, code, name " +
                    "FROM vocs " +
                    "WHERE id = :id";
            List<VocsModel> result = db.Query(con, sql, VocsModel.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись таблицы phrases c id = ");
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получение записи "Диалоги оповещения"
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public DGDialogsModel GetDialogInfo(Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();

            String filter = "";

            if (model.get("id") != null) {
                params.put("id", UUID.fromString(model.get("id").toString()));
                filter += " AND d.id = :id";
            }

            if (model.get("dlg_all_id") != null) {
                params.put("dlg_all_id", UUID.fromString(model.get("dlg_all_id").toString()));
                filter += " AND d.dlg_all_id = :dlg_all_id";
            }

            if (model.get("is_dtmf") != null) {
                params.put("is_dtmf", Integer.parseInt(model.get("is_dtmf").toString()));
                filter += " AND d.is_dtmf = :is_dtmf";
            }

            if (model.get("link_type_code") != null) {
                params.put("link_type_code", model.get("link_type_code").toString());
                filter += " AND lt.code = :link_type_code";
            }

            String sql = "SELECT d.id, d.perc, d.name, d.dlg_all_id, d.link_type_id, d.is_dtmf, lt.code link_type_code, lt.name link_type_name, " +
                            "d.changer, d.creator, v.id voc_id, v.name voc_name, " +
                            "to_char(DATE_TRUNC('second', d.created), 'DD.MM.YYYY HH:MM:SS') created, " +
                            "to_char(DATE_TRUNC('second', d.changed), 'DD.MM.YYYY HH:MM:SS') changed " +
                          "FROM dialogs d JOIN link_types lt ON d.link_type_id = lt.id " +
                          "LEFT JOIN vocs v ON d.voc_id = v.id " +
                          "WHERE 1=1" + filter;
            List<DGDialogsModel> result = db.Query(con, sql, DGDialogsModel.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись \"Диалоги оповещения\" таблицы dialogs c id = " + model.get("id"));
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить все овтеты для диалога оповещения
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public List<DGAnswerModel> GetAllDialogDTMFPhoneAnswers(Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("dlg_all_id", UUID.fromString(model.get("dlg_all_id").toString()));
            String sql = "SELECT a.* " +
                    "FROM dlg_alls da " +
                    "JOIN dialogs d ON da.id = d.dlg_all_id " +
                    "JOIN link_types lt ON d.link_type_id = lt.id " +
                    "JOIN messages m ON d.id = m.dialog_id " +
                    "JOIN answers a ON m.id = a.message_id " +
                    "WHERE d.dlg_all_id = :dlg_all_id AND lt.code = 'phone' AND d.is_dtmf = 0";
            List<DGAnswerModel> result = db.Query(con, sql, DGAnswerModel.class, params);

            return result;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<DGAnswerModel> GetAnswers(Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("message_id", UUID.fromString(model.get("message_id").toString()));
            String sql = "SELECT id " +
                         "FROM answers " +
                         "WHERE message_id = :message_id ";
            List<DGAnswerModel> result = db.Query(con, sql, DGAnswerModel.class, params);

            return result;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /** --------------------------------- ######################################## -----------------------------------*/



    /** ----------------------------------- Действия с "Обращения к абонентам" -------------------------------------- */

    /**
     * Сохранение записи "Обращения к абонентам"
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public String SaveMessage (DGMessegesModel model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("no", Integer.parseInt(model.getNo()));
            params.put("info_ru", model.getInfo_ru());

            Map<String, Object> recParams = new HashMap<>();
            recParams.put("dlg_all_id", model.getDlg_all_id());
            Integer active_flag = IsRecActive(recParams);
            if(active_flag == 1) {
                throw new Exception("Сохранить запись невозможно, так как общий диалог Id = " +  recParams.get("dlg_all_id") + " является активным!");
            }

            String sql = "";
            if(model.getId().equals("-1")){
                params.put("dialog_id", UUID.fromString(model.getDialog_id()));

                String phrase_id_param = "";
                String phrase_id_value = "";
                if(!model.getPhrase_id().equals("-1")) {
                    params.put("phrase_id", UUID.fromString(model.getPhrase_id()));
                    phrase_id_value = ", :phrase_id";
                    phrase_id_param = ", phrase_id";
                }

                sql = "INSERT INTO messages (no, info_ru, dialog_id" + phrase_id_param + ")"
                        +" VALUES(:no, :info_ru, :dialog_id" + phrase_id_value + ")";
                model.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                String phrase_id = "";
                if(!model.getPhrase_id().equals("-1")) {
                    params.put("phrase_id", UUID.fromString(model.getPhrase_id()));
                    phrase_id = ", phrase_id = :phrase_id ";
                }

                params.put("id", UUID.fromString(model.getId()));
                db.CheckLock(con, -1, model.getId(), "messages");
                sql = "UPDATE messages SET no = :no, info_ru = :info_ru " + phrase_id + " WHERE id = :id";
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удаление записи из таблицы messages грида "Обращения к абонентам"
     * @param model
     * @throws Exception
     */
    @Override
    public void DeleteMessage (Map<String, Object> model) throws Exception {
        try(var con = db.getConnectionWithTran(appName)){
            Map<String, Object> params = new HashMap<>();

            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "DELETE FROM answers WHERE message_id = :id";
            db.Execute(con, sql, params);

            sql = "DELETE FROM messages WHERE id = :id";
            db.Execute(con, sql, params);

            con.commit();
        }
        catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Получение записи "Обращения к абонентам"
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public DGMessegesModel GetMessageInfo(Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "SELECT m.id, m.no, m.info_ru, m.dialog_id, m.phrase_id, ph.name phrase_name, d.link_type_id, " +
                    "d.is_dtmf, lt.code link_type_code, lt.name link_type_name, d.dlg_all_id, " +
                    "m.creator, m.changer, " +
                    "to_char(DATE_TRUNC('second', m.created), 'DD.MM.YYYY HH:MM:SS') created, " +
                    "to_char(DATE_TRUNC('second', m.changed), 'DD.MM.YYYY HH:MM:SS') changed " +
                    "FROM messages m " +
                    "JOIN dialogs d ON m.dialog_id = d.id " +
                    "JOIN link_types lt ON d.link_type_id = lt.id " +
                    "LEFT JOIN phrases ph ON m.phrase_id = ph.id " +
                    "WHERE m.id = :id";
            List<DGMessegesModel> result = db.Query(con, sql, DGMessegesModel.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись \"Обращения к абонентам\" таблицы messages c id = " + model.get("id"));
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить запись из модуля Фразы
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public PhraseModel GetPhraseInfo (Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            if (model.get("id") == null) {
                throw new Exception("Не удалось получить информацию о аудиозаписи");
            }

            var params = new HashMap<String, Object>();
            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "SELECT id, code, name, file_name, org_file_name, is_syntesed, del " +
                         "FROM phrases " +
                         "WHERE id = :id";
            List<PhraseModel> result = db.Query(con, sql, PhraseModel.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись таблицы phrases c id = ");
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка уникальности номера обращения к абоненту
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public int IsNoUnique (Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String strId = "";
            if(!model.get("id").toString().equals("-1"))
            {
                params.put("id", UUID.fromString(model.get("id").toString()));
                strId =  " AND id <> :id";
            }

            params.put("dialog_id", UUID.fromString(model.get("dialog_id").toString()));
            params.put("no", Integer.parseInt(model.get("no").toString()));
            String sql = "SELECT COUNT(*) " +
                    "FROM messages " +
                    "WHERE dialog_id = :dialog_id AND no = :no " + strId;

            List<Integer> result = db.Query(con, sql, Integer.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись таблицы messages c id = " + model.get("id"));
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка является ли удаляемое обращение к абоненту "Следующим обращением" в записях таблицы ответов
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public String IsForeignKey(Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();

            params.put("message_id", UUID.fromString(model.get("message_id").toString()));
            String sql = "SELECT string_agg('\"' || a.value || '\" Id = ' || CAST(a.id AS character varying), ', ') " +
                    "FROM messages m JOIN answers a ON m.id = a.next_msg_id " +
                    "WHERE m.id = :message_id";


            List<String> result = db.Query(con, sql, String.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись таблицы messages c id = " + model.get("id").toString());
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Получаем аудиозапись с сервера
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public String GetWavFile(Map<String, Object> model) throws Exception {
        try {
            String fileSource = model.get("file_source").toString().replace("\\\\", "/").replace("\\", "/");
            if(FileUtil.FileIsDirectory(fileSource)) {
                throw new Exception("Файл является директорией");
            }

            if(!FileUtil.IsFileExist(fileSource)) {
                throw new Exception("Аудиозапись не существует");
            }

            byte[] byts = Files.readAllBytes(Paths.get(fileSource));
            return Base64.getEncoder().encodeToString(byts);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить путь к папке на сервере с аудиозаписями
     * @return
     * @throws Exception
     */
    @Override
    public String GetSoundFilesPath() throws Exception {
        try(Connection con = db.getConnection(appName)) {

            String sql = "SELECT \"value\" AS val FROM global_params gp WHERE gp.param_code = 'sound_files_path'";
            List <String> result = db.Query(con, sql, String.class, null);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись таблицы global_params c param_code = sound_files_path ");
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /** --------------------------------- ######################################## -----------------------------------*/


    /** -------------------------------------- Действия с "Ответы абонентов" ---------------------------------------- */

    /**
     * Получить запись из таблицы answers
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public DGAnswerModel GetAnswerInfo (Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "SELECT id, message_id, value, next_msg_id, info, " +
                    "creator, changer, " +
                    "to_char(DATE_TRUNC('second', created), 'DD.MM.YYYY HH:MM:SS') created, " +
                    "to_char(DATE_TRUNC('second', changed), 'DD.MM.YYYY HH:MM:SS') changed " +
                    "FROM answers " +
                    "WHERE id = :id";
            List<DGAnswerModel> result = db.Query(con, sql, DGAnswerModel.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись таблицы answers c id = " + model.get("id"));
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранение записи "Ответы абонентов"
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public String SaveAnswer (DGAnswerModel model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("value", model.getValue());
            params.put("info", model.getInfo());

            Map<String, Object> recParams = new HashMap<>();
            recParams.put("dlg_all_id", model.getDlg_all_id());
            Integer active_flag = IsRecActive(recParams);
            if(active_flag == 1) {
                throw new Exception("Сохранить запись невозможно, так как общий диалог Id = " +  recParams.get("dlg_all_id") + " является активным!");
            }

            String sql = "";
            if(model.getId().equals("-1")){
                params.put("message_id", UUID.fromString(model.getMessage_id()));

                String next_msg_id_param = "";
                String next_msg_id_value = "";
                if(!model.getNext_msg_id().equals("0")) {
                    params.put("next_msg_id", UUID.fromString(model.getNext_msg_id()));
                    next_msg_id_value = ", :next_msg_id";
                    next_msg_id_param = ", next_msg_id";
                }


                sql = "INSERT INTO answers (message_id, value, info" + next_msg_id_param + ") " +
                        "VALUES(:message_id, :value, :info" + next_msg_id_value + ")";
                model.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                params.put("id", UUID.fromString(model.getId()));

                String next_msg_id = "";
                if(!model.getNext_msg_id().equals("0")) {
                    params.put("next_msg_id", UUID.fromString(model.getNext_msg_id()));
                    next_msg_id = ", next_msg_id = :next_msg_id ";
                }
                db.CheckLock(con, -1, model.getId(), "answers");
                sql = "UPDATE answers SET value = :value, info = :info " + next_msg_id +
                        " WHERE id = :id";
                db.Execute(con, sql, params);
            }
            return model.getId();
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удаление записи из таблицы answers грида "Ответы абонентов"
     * @param model
     * @throws Exception
     */
    @Override
    public void DeleteAnswer (Map<String, Object> model) throws Exception {
        try(var con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(model.get("id").toString()));
            String sql = "DELETE FROM answers WHERE id = :id";
            db.Execute(con, sql, params);
        }
    }

    /**
     * Получить список обращений к абоненту для комбобокса "Следующее обращение" на форме редактирования ответов абоненту
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public List<DGMessegesModel> GetNextMessages (Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("message_id", UUID.fromString(model.get("message_id").toString()));
            params.put("dialog_id", UUID.fromString(model.get("dialog_id").toString()));
            String sql = "SELECT m.id, m.no, CASE WHEN LENGTH(m.info_ru) = 0 THEN replace(ph.name, '+', '') ELSE replace(m.info_ru, '+', '') END info_ru, m.dialog_id " +
                        "FROM messages m " +
                        "LEFT JOIN phrases ph ON m.phrase_id = ph.id " +
                        "WHERE m.dialog_id = :dialog_id AND m.id <> :message_id " +
                        "ORDER BY no";
            return db.Query(con, sql, DGMessegesModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка уникальности Ответа абонента
     * @param model
     * @return
     * @throws Exception
     */
    @Override
    public int IsAnswerUnique (Map<String, Object> model) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String strId = "";
            if(!model.get("id").toString().equals("-1"))
            {
                params.put("id", UUID.fromString(model.get("id").toString()));
                strId =  " AND id <> :id";
            }

            params.put("message_id", UUID.fromString(model.get("message_id").toString()));
            params.put("value", model.get("value").toString());
            String sql = "SELECT COUNT(*) " +
                    "FROM answers " +
                    "WHERE message_id = :message_id AND value = :value " + strId;

            List<Integer> result = db.Query(con, sql, Integer.class, params);
            if(result.size() == 0) {
                throw new Exception("Не удалось получить запись таблицы answers c id = " + model.get("id"));
            }

            return result.get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }
    /** --------------------------------- ######################################## -----------------------------------*/
}