package org.kaznalnrprograms.MCA.Abons.Dao;

import org.kaznalnrprograms.MCA.Abons.Interfaces.IEditGroup;
import org.kaznalnrprograms.MCA.Abons.Models.GroupViewModel;
import org.kaznalnrprograms.MCA.Abons.Models.SaveGroupModel;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class EditGroupDaoImpl implements IEditGroup {
    private String appName = "Abons - Администратор абонентов.";
    private DBUtils db;

    public EditGroupDaoImpl(DBUtils db){
        this.db = db;
    }


    /**
     * Получить группу по ид (для формы редактирования)
     * @param groupid
     * @return
     * @throws Exception
     */
    @Override
    public GroupViewModel getGroupById(String groupid) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();

            String sql = "select g.id, g.code, g.name, g.del, " +
                    "g.creator, to_char(g.created, 'dd.mm.yyyy HH24:MI:SS') as created, " +
                    "g.changer, to_char(g.changed, 'dd.mm.yyyy HH24:MI:SS') as changed " +
                    "from grps g " +
                    "where g.id = :id ";

            params.put("id", UUID.fromString(groupid));

            List<GroupViewModel> result = db.Query(con, sql, GroupViewModel.class, params);

            if (result.size() == 0) { throw new Exception("Не удалось получить группу с id = "+groupid); }

            return result.get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }



    /**
     * Проверить существование группы абонентов
     * @param saveGroup (для новых -1)
     * @return
     * @throws Exception
     */
    @Override
    public boolean existsGroup(SaveGroupModel saveGroup) throws Exception{
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("code", saveGroup.getCode());
            String sql = "SELECT COUNT(*) FROM grps WHERE code = :code ";

            if (!saveGroup.getId().equals("-1")){
                params.put("id", UUID.fromString(saveGroup.getId()) );
                sql += " AND id <> :id";
            }

            return db.Query(con, sql, Integer.class, params).get(0) > 0;
        }
        catch(Exception ex){
            throw ex;
        }
    }


    /**
     * Сохранить группу
     * @param saveGroupModel
     * @throws Exception
     */
    @Override
    public String saveGroup(SaveGroupModel saveGroupModel) throws Exception{
        try(Connection con = db.getConnection(appName)){

            String sql = "";
            Map<String, Object> params = new HashMap<>();
            params.put("code", saveGroupModel.getCode());
            params.put("name", saveGroupModel.getName());

            if (saveGroupModel.getId().equals("-1")){
                //Добавление новой группы
                sql = "INSERT INTO grps(code, name, del) " +
                        "VALUES(:code, :name, 0)";
                saveGroupModel.setId( db.Execute(con, sql, String.class, params) );
            }
            else{
                //редактирование группы
                db.CheckLock( con, -1, saveGroupModel.getId(), "grps");
                params.put("id", UUID.fromString(saveGroupModel.getId()) );
                sql = "UPDATE grps SET code = :code, name = :name WHERE id = :id";
                db.Execute(con, sql, params);
            }


            return saveGroupModel.getId();
        }
        catch (Exception ex){
            throw ex;
        }
    }


}
