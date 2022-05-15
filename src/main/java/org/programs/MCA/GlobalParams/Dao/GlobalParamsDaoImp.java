package org.kaznalnrprograms.MCA.GlobalParams.Dao;

import org.kaznalnrprograms.MCA.GlobalParams.Interfaces.IGlobalParamsDao;
import org.kaznalnrprograms.MCA.GlobalParams.Models.*;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;

import org.springframework.transaction.annotation.SpringTransactionAnnotationParser;
import org.springframework.web.bind.annotation.RequestBody;
import org.sql2o.Connection;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class GlobalParamsDaoImp implements IGlobalParamsDao {
    private String appName = "Справочник глобальных параметров";
    private DBUtils db;

    public GlobalParamsDaoImp(DBUtils db) {
        this.db = db;
    }

    private List<GlobalParamsViewModel> getChildGlPrm(Connection con, List<GlobalParamsViewModel> allGlPrm, UUID id) {
        List<GlobalParamsViewModel> grPrs = allGlPrm.stream()
                .filter(a -> a.getParent_id() != null && a.getParent_id().compareTo(id) == 0)
                .collect(Collectors.toList());
        for (GlobalParamsViewModel grP : grPrs)
            grP.setChildren(getChildGlPrm(con, allGlPrm, grP.getId()));
        return grPrs;
    }

    private List<GlobalParamsViewModel> filtrTree(List<GlobalParamsViewModel> tree, String filter, boolean flag) {
        ListIterator<GlobalParamsViewModel> i = tree.listIterator();
        while (i.hasNext()) {
            GlobalParamsViewModel tr = i.next();
            if (tr.getName().toLowerCase().contains(filter)
                    || tr.getParam_code().toLowerCase().contains(filter)
                        || tr.getValue().toLowerCase().contains(filter))
                continue;

            if (tr.getChildren().size() > 0) {
                filtrTree(tr.getChildren(), filter.toLowerCase(), flag);
            } else if ((!tr.getName().toLowerCase().contains(filter)
                    || !tr.getParam_code().toLowerCase().contains(filter)
                        || !tr.getValue().toLowerCase().contains(filter))
                /*&& tr.getChildren().size()==0 */) {
                i.remove();

                if (i.hasPrevious() && flag) {
                    GlobalParamsViewModel tr2 = i.previous();
                    filtrTree(tr2.getChildren(), filter.toLowerCase(), flag);
                }
            }
        }
        return tree;
    }

    /**
     * @param Filter
     * @return
     * @throws Exception
     */
    @Override
    public List<GlobalParamsViewModel> ListTree(String Filter) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, parent_id, param_code, name, value FROM global_params ORDER BY param_code";
            List<GlobalParamsViewModel> allGlPrm = db.Query(con, sql, GlobalParamsViewModel.class, null);
            List<GlobalParamsViewModel> rootGlPrm = allGlPrm.stream().filter((a) -> a.getParent_id() == null).collect(Collectors.toList());
            for (GlobalParamsViewModel gPr : rootGlPrm) gPr.setChildren(getChildGlPrm(con, allGlPrm, gPr.getId()));
            if (!Filter.isEmpty()) {
                String fltr = Filter.toLowerCase();
                int j = rootGlPrm.size();
                for(int i=0;i<j;i++) {
                    rootGlPrm = filtrTree(rootGlPrm, fltr, true);
                    rootGlPrm = filtrTree(rootGlPrm, fltr, false);
                }
            }
            return rootGlPrm;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить id = название параметра
     *
     * @param id глобального параметра
     * @return
     * @throws Exception
     */
    @Override
    public String ParentGlPr(ParentGlobalParamsModel id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(id.getId()));
            String sql = "";
            if (id.isFlagMod())
                sql = "SELECT glp.id || ' = ' || glp.name FROM global_params glp WHERE glp.id = :id";
            else
                sql = "SELECT glp.parent_id || ' = ' || glp2.name FROM global_params glp JOIN global_params glp2 ON glp2.id = glp.parent_id WHERE glp.id = :id";
            List<String> record = db.Query(con, sql, String.class, params);
            if (record.size() == 0) return "-1";
            return record.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Сохранение глобальных параметров
     *
     * @param model модель глобального параметра
     * @return
     * @throws Exception
     */
    @Override
    public String save(GlobalParamsModel model) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("parent_id", model.getParent_id());
            params.put("param_code", model.getParam_code());
            params.put("name", model.getName());
            params.put("value", model.getValue());
            String sql = "";
            if (model.getFlagMode().equals("-1")) {
                sql = "INSERT INTO global_params (id, parent_id, param_code, name, value)  VALUES (uuid_generate_v4(), :parent_id, :param_code, :name, :value)";
                model.setId(db.Execute(con, sql, UUID.class, params));
            } else {
                db.CheckLock(con, -1, model.getId().toString(), "global_params");
                params.put("id", model.getId());
                sql = "UPDATE global_params SET parent_id = :parent_id, param_code = :param_code, name = :name, value = :value WHERE id = :id";
                db.Execute(con, sql, params);
            }
            return model.getId().toString();
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить название и id глобального параметра
     *
     * @param id редактируемого глобального параметра
     * @return
     * @throws Exception
     */
    @Override
    public GlobalParamsEditModel GlPr(ParentGlobalParamsModel id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(id.getId()));
            String sql = "SELECT glp.id, glp.parent_id, glp2.name|| ' = ' || glp.parent_id as parentIdName,  glp.name, glp.param_code, glp.value, glp.creator, glp.created, glp.changer, glp.changed FROM global_params glp JOIN global_params glp2 ON glp2.id = glp.parent_id WHERE glp.id = :id";
            List<GlobalParamsEditModel> glPrm = db.Query(con, sql, GlobalParamsEditModel.class, params);
            if (glPrm.size() == 0) {
                sql = "SELECT glp.id, glp.parent_id, 'корневой параметр = null'  as parentIdName,  glp.name, glp.param_code, glp.value, glp.creator, glp.created, glp.changer, glp.changed FROM global_params glp  WHERE glp.id = :id";
                glPrm = db.Query(con, sql, GlobalParamsEditModel.class, params);
            }
            return glPrm.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Получить дочерние узлы глобального параметра
     *
     * @param con
     * @param allGlPrm - все глобальные параметра
     * @param id       - глобального параметра
     * @return
     */
    private List<GlobalParamsSearchNode> getChildGlPrmSearchNodes(Connection con, List<GlobalParamsSearchNode> allGlPrm, UUID id) {
        List<GlobalParamsSearchNode> grPrs = allGlPrm.stream()
                .filter(a -> a.getParent_id() != null && a.getParent_id().compareTo(id) == 0)
                .collect(Collectors.toList());
        for (GlobalParamsSearchNode grP : grPrs)
            grP.setChildren(getChildGlPrmSearchNodes(con, allGlPrm, grP.getId()));
        return grPrs;
    }

    /**
     * Получить список id дочерных узлов для данного узла node
     *
     * @param node  узел
     * @param delEl
     * @return
     */
    private List<String> SearchChl(List<GlobalParamsSearchNode> node, List<String> delEl) {
        ListIterator<GlobalParamsSearchNode> i = node.listIterator();
        while (i.hasNext()) {
            GlobalParamsSearchNode gPSrNd = i.next();
            delEl.add(gPSrNd.getId().toString());
            if (gPSrNd.getChildren().size() > 0) {
                SearchChl(gPSrNd.getChildren(), delEl);
            }
        }
        return delEl;
    }

    /**
     * Проверить существует ли такой глобальный параметр
     * @param id глобального параметра
     * @return
     */
    public boolean CheckExistenceNode(ParentGlobalParamsModel id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(id.getId()));
            String sql = "SELECT COUNT(id) FROM global_params WHERE id =:id";
            if (db.Query(con, sql, Integer.class, params).get(0) == 0) return false; //если нет записи с такой id
            return true;
        }catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получить id дочерних элементов
     * @param id
     * @return
     * @throws Exception
     */
    public List<String> ChildNode(ParentGlobalParamsModel id) throws Exception{
        try (Connection con = db.getConnection(appName)) {
            List<String> idRec = new ArrayList<String>();
            String sql = "SELECT id, parent_id FROM global_params";
            UUID idRootNode = UUID.fromString(id.getId());
            List<GlobalParamsSearchNode> allGlPrm = db.Query(con, sql, GlobalParamsSearchNode.class, null);
            List<GlobalParamsSearchNode> rootGlPrm = allGlPrm.stream().filter((a) -> a.getId().compareTo(idRootNode) == 0).collect(Collectors.toList());
            rootGlPrm.get(0).setChildren(getChildGlPrmSearchNodes(con, allGlPrm, rootGlPrm.get(0).getId()));
            SearchChl(rootGlPrm, idRec);
            return idRec;
        }catch (Exception ex) {  throw ex; }
    }
    /**
     * Найти все узлы для удаления
     *
     * @param id
     * @return
     * @throws Exception
     */
    @Override
    public String SearchNodeAndDelete(ParentGlobalParamsModel id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            //если нет записи с такой id
            if(!CheckExistenceNode(id)) return "-1";
            String sql = "";
            List<String> idRec = new ArrayList<String>();
            idRec = this.ChildNode(id);
            //String idStr = String.join(", ", idRec);
            String idStr = idRec.stream().collect(Collectors.joining("','", "'", "'"));

            sql = "SELECT array_to_string(array("
                    + "SELECT distinct u.Name ||' = '|| recuuid as name FROM LockTable lt"
                    + " JOIN i_users u ON u.Id = lt.i_user_id"
                    + " WHERE lt.ObjectId = GetObject_Id('global_params') AND recuuid in (" + idStr + ") ) ,', ')";
            List<String> cnt = db.Query(con, sql, String.class, null);
            if (!cnt.get(0).isEmpty()) return cnt.get(0);
            //for(String i: idRec)  db.CheckLock(con, -1, i, "global_params");
            sql = "DELETE FROM global_params WHERE id in (" + idStr + ")";
            db.Execute(con, sql, null);
            return "1";
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public int NodeCount(ParentGlobalParamsModel id) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            //если нет записи с такой id
            if(!CheckExistenceNode(id)) return -1;
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(id.getId()));
            String sql = "SELECT count(glp.id)"
            +" FROM global_params glp"
            +" WHERE glp.parent_id = :id";
            int i = db.Query(con, sql, Integer.class, params).get(0);
            if (i > 0) return i;
            return 0;
        } catch (Exception ex){
            throw ex;
        }
    }
}