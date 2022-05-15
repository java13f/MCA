package org.kaznalnrprograms.MCA.Abons.Dao;

import org.kaznalnrprograms.MCA.Abons.Interfaces.IEditAbon;
import org.kaznalnrprograms.MCA.Abons.Models.AbonEditModel;
import org.kaznalnrprograms.MCA.Abons.Models.ItemEditPinsModel;
import org.kaznalnrprograms.MCA.Abons.Models.TypeComModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class EditAbonDaoImpl implements IEditAbon {
    private String appName = "Abons - Администратор абонентов.";
    private DBUtils db;

    public EditAbonDaoImpl(DBUtils db){
        this.db = db;
    }



    @Override
    public AbonEditModel GetAbonFromId(String id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(id) );

            AbonEditModel abon = null;

            String sql = "select a.id, a.snils, a.fam, a.ima, a.otch, a.prior, " +
                    "to_char(a.created, 'dd.MM.yyyy HH24:MI:SS') created, " +
                    "a.creator creator, " +
                    "to_char(a.changed, 'dd.MM.yyyy HH24:MI:SS') changed, " +
                    "a.changer changer, NULL pins " +
                    "from abons a " +
                    "where a.id=:id ";


            abon = db.Query(con, sql, AbonEditModel.class, params).get(0);
            abon.setPins( GetPins(id, con) );
            return abon;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить список контактов абонента
     * @param parentId
     * @param con
     * @return
     * @throws Exception
     */
    private List<ItemEditPinsModel> GetPins(String parentId, Connection con) throws Exception {
        final Connection _con = con == null ? db.getConnection(appName) : con;
        Map<String, Object> params = new HashMap<>();
        params.put("parentId", UUID.fromString(parentId));

        try(_con) {
            String sql = "select p.id, p.no, p.code, p.code_view as codeView, s.id as switchId, " +
                    "s.name as typeCom, null itemId, null changing, p.del, " +
                    "p.is_has_dtmf, info, " +
                    "p.creator, to_char(p.created, 'dd.MM.yyyy HH24:MI:SS') created, " +
                    "p.changer, to_char(p.changed, 'dd.MM.yyyy HH24:MI:SS') changed " +
                    "from pins p " +
                    "join switchs s on s.id = p.switch_id " +
                    "where abon_id = :parentId " +
                    "and s.del = 0 " +
                    "order by no";

            return db.Query(_con, sql, ItemEditPinsModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }



    /**
     * Получить список типов коммуникаций для combobox (форма контакта)
     * @throws Exception
     */
    @Override
    public List<TypeComModel> getTypeCom() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "select id, code, name from switchs where del=0 order by name";
            List<TypeComModel> result = db.Query(con, sql, TypeComModel.class, null);
            if (result.size() == 0) { throw new Exception("Не удалось получить коммутацию"); }

            return result;
        }
        catch(Exception ex){
            throw ex;
        }
    }



    /**
     * Проверка есть ли абонент с таким СНИЛС
     * @param abonId
     * @param snils
     * @return true - успех, false - абонент с таким СНИЛС уже есть
     * @throws Exception
     */
    @Override
    public Boolean checkAbon(String abonId, String snils) throws Exception{
        try(Connection con = db.getConnection(appName)){

            Map<String, Object> params = new HashMap<>();
            params.put("snils", snils);

            String sql = "select count(*) from abons " +
                    "where snils = :snils ";

            if(abonId.length() > 0){
                params.put("abonId", UUID.fromString(abonId));
                sql += "and id <> :abonId";
            }

            return db.Query(con, sql, Integer.class, params).get(0) == 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }



    /**
     * Сохранение абонента
     * @param abon
     * @return
     * @throws Exception
     */
    @Override
    public String SaveAbon(AbonEditModel abon) throws Exception{
        try(Connection con = db.getConnectionWithTran(appName)) {
            String id = abon.getId().trim();

            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("snils", abon.getSnils());
            params.put("surname", abon.getFam());
            params.put("name", abon.getIma());
            params.put("oname", abon.getOtch());
            if(abon.getPrior().length() > 0){
                params.put("prior", Integer.parseInt(abon.getPrior()) );
            } else {
                params.put("prior", -1);
            }


            if(id.length() == 0) {
                sql = "INSERT INTO abons(prior, snils, fam, ima, otch, del) " +
                      "VALUES( " +
                        "(CASE" +
                        "   when :prior=-1 THEN null " +
                        "   else :prior " +
                        "END), " +
                        ":snils, :surname, :name, :oname, 0)";
                abon.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                db.CheckLock(con, -1, abon.getId(), "abons");

                params.put("id", UUID.fromString(abon.getId()) );
                sql = "UPDATE abons " +
                        "SET prior = " +
                        "(CASE " +
                        "when :prior=-1 THEN null " +
                        "else :prior " +
                        " END), " +
                        "snils = :snils, " +
                        "fam = :surname, " +
                        "ima = :name, " +
                        "otch = :oname " +
                        "WHERE id = :id ";
                db.Execute(con, sql, params);
            }

            SavePins(con, abon.getPins(), abon.getId());

            con.commit();
            return abon.getId();
        }
        catch (Exception ex) {
            throw ex;
        }
    }


    void SavePins(Connection con, List<ItemEditPinsModel> pins, String parentId) {
        try {
            for (ItemEditPinsModel pin : pins) {
                boolean isNew = pin.getId().length() == 0;
                if(isNew && pin.getDel() == 1) {
                    continue;
                }
                String sql = "";
                Map<String, Object> params = new HashMap<>();

                params.put("switchId", UUID.fromString(pin.getSwitchId()) );
                params.put("code", pin.getCode());
                params.put("codeView", pin.getCodeView());
                params.put("no", pin.getNo());
                params.put("is_has_dtmf", pin.getIs_has_dtmf());
                params.put("info", pin.getInfo());

                if(isNew) {
                    params.put("abonId", UUID.fromString(parentId));
                    sql = "INSERT INTO pins(abon_id, switch_id, code, code_view, no, is_has_dtmf, info, del) " +
                    "VALUES(:abonId, :switchId, :code, :codeView, :no, :is_has_dtmf, :info, 0 )";

                    db.Execute(con, sql, params);
                }
                else if( pin.isChanging() ){
                    params.put("id", UUID.fromString(pin.getId()));
                    params.put("del", pin.getDel());
                    sql = "UPDATE pins " +
                            "SET switch_id = :switchId, code = :code, code_view = :codeView, " +
                            "no = :no, is_has_dtmf = :is_has_dtmf, info = :info, del = :del " +
                            "WHERE id = :id";
                    db.Execute(con, sql, params);
                }
            }
        }
        catch (Exception ex) {
            throw ex;
        }
    }


}
