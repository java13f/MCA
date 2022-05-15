package org.kaznalnrprograms.MCA.Voc.Dao;

import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.kaznalnrprograms.MCA.Voc.Interfaces.IVocDao;
import org.kaznalnrprograms.MCA.Voc.Models.*;
import org.kaznalnrprograms.MCA.Voc.Utils.DicEdit;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Repository
public class VocDaoImpl implements IVocDao {
    private String appName = "Voc - словарь";
    private DBUtils db;
    DicEdit dic = new DicEdit();
    String dicFileName = "voc";
    String gramFileName = "voc";

    public VocDaoImpl(DBUtils db){
        this.db = db;
    }

    private void SetPaths(String vocItemId) throws Exception{
        try(Connection con = db.getConnection(appName)) {
            String sql = "select \"value\" as val from global_params where param_code='voc_files_path' limit 1";
            String path = db.Query(con, sql, String.class, null).get(0)
                    .replace("\\\\", "/")
                    .replace('\\', '/');
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(vocItemId));
            sql = "select code from vocs where id=:id";
            String code = db.Query(con, sql, String.class, params).get(0);
            dicFileName = gramFileName = code;
            String pathDic = Paths.get(path, dicFileName + ".dic").toString()
                    .replace("\\\\", "/")
                    .replace('\\', '/');
            String pathGram = Paths.get(path, gramFileName + ".gram").toString()
                    .replace("\\\\", "/")
                    .replace('\\', '/');
            File file = new File(pathDic);
            if(!file.exists()) {
                file.createNewFile();
            }
            file = new File(pathGram);
            if(!file.exists()) {
                file.createNewFile();
            }
            dic.setDicPath(pathDic);
            dic.setGramPath(pathGram);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public List<VocViewModel> GetVoc(VocFilter filter) throws Exception {
        try {
            SetPaths(filter.getVocItemId());
            String txtFilter = filter.getText().trim();
            String[] words = dic.list();
            List<VocViewModel> voc = new ArrayList<>();
            for (String s : words) {
                if(txtFilter.length() == 0 || s.contains(txtFilter)) {
                    VocViewModel v = new VocViewModel();
                    v.setWord(s);
                    voc.add(v);
                }
            }
            return voc;
        }
        catch (Exception ex){
            throw ex;
        }
    }

    @Override
    public String CheckWord(VocViewModel voc) throws Exception {
        try {
            SetPaths(voc.getVocItemId());
            return dic.CheckWord(voc.getWord().trim());
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String Save(VocViewModel word) throws Exception {
        try {
            SetPaths(word.getVocItemId());
            String newWord = word.getWord().trim().replace("+", "");
            dic.addword(word.getWord().trim());
            return newWord;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String Delete(VocViewModel word) throws Exception {
        try {
            SetPaths(word.getVocItemId());
            String delWord = word.getWord().trim();
            dic.delword(delWord);
            return "";
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public VocRightsModel GetActRights() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "SELECT get_act_rights('Voc', 'VocChange') vocChange, " +
                    "get_act_rights('Voc', 'VocDel') vocDel, " +
                    "get_act_rights('Voc', 'VocView') vocView";
            return db.Query(con, sql, VocRightsModel.class, null).get(0);
        }
        catch(Exception ex){
            throw ex;
        }
    }

    @Override
    public List<VocsListItemModel> GetVocItems(VocFilter filter) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String filterText = "";
            Map<String, Object> params = new HashMap<>();
            params.put("showDel", filter.getDelShow());
            if(filter.getText().trim().length() > 0) {
                params.put("filterText", filter.getText().trim());
                filterText = " and (lower(code) like '%'||lower(:filterText)||'%' or lower(name) like '%'||lower(:filterText)||'%')";
            }
            String sql = "select id, code, name, del from vocs where del<=:showDel " + filterText;
            return db.Query(con, sql, VocsListItemModel.class, params);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String DeleteVocItem(String id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(id));
            String sql = "update vocs set del=1-del where id=:id";
            db.Execute(con, sql, params);
            return "";
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public VocItemEditModel LoadVocItem(String id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", UUID.fromString(id));
            String sql = "select id, code, name,  " +
                    "to_char(created, 'dd.MM.yyyy HH24:MI:SS') created, creator," +
                    "to_char(changed, 'dd.MM.yyyy HH24:MI:SS') changed, changer " +
                    "from vocs " +
                    "where id=:id";
            return db.Query(con, sql, VocItemEditModel.class, params).get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public boolean CheckCode(Map<String, Object> params) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String id = params.get("id").toString();
            String sql = "select count(*) cnt from vocs where code=:code " +
                    (id != null && id.trim().length() > 0 ? "and id<>cast(:id as uuid)" : "");
            if(id == null || id.trim().length() <= 0){
                params.remove("id");
            }
            Integer cnt = db.Query(con, sql, Integer.class, params).get(0);
            return cnt == 0;
        } catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String SaveVocItem(VocItemEditModel vocItem) throws Exception {
        try (Connection con = db.getConnectionWithTran(appName)){
            boolean isInsert = vocItem.getId() == null || vocItem.getId().trim().length() == 0;
            Map<String, Object> params = new HashMap<>();
            String sql = "";
            sql = "select \"value\" as val from global_params where param_code='voc_files_path' limit 1";
            String path = db.Query(con, sql, String.class, null).get(0)
                    .replace("\\\\", "/")
                    .replace('\\', '/');
            String pathDicNew = Paths.get(path, vocItem.getCode() + ".dic").toString()
                    .replace("\\\\", "/")
                    .replace('\\', '/');
            String pathGramNew = Paths.get(path, vocItem.getCode() + ".gram").toString()
                    .replace("\\\\", "/")
                    .replace('\\', '/');
            if (isInsert) {
                params.put("code", vocItem.getCode());
                params.put("name", vocItem.getName());
                sql = "insert into vocs (id, code, \"name\", del) values (" +
                        "uuid_generate_v4()," +
                        ":code, " +
                        ":name, " +
                        "0" +
                        ")";
                vocItem.setId(db.Execute(con, sql, String.class, params));
                // Удаляем старые файлы если были
                try {
                    if(!Files.isDirectory(Paths.get(pathDicNew))) {
                        new File(pathDicNew).delete();
                    }
                }
                catch (Exception ex) {}
                try {
                    if(!Files.isDirectory(Paths.get(pathGramNew))) {
                        new File(pathGramNew).delete();
                    }
                }
                catch (Exception ex) {}
            }
            // Обновление существующей записи
            else {
                params.clear();
                db.CheckLock(con, -1, vocItem.getId(), "vocs");
                params.put("id", UUID.fromString(vocItem.getId()));
                String oldCode = "";
                sql = "select code from vocs where id=:id";
                oldCode = db.Query(con, sql, String.class, params).get(0);
                String pathDicOld = Paths.get(path, oldCode + ".dic").toString()
                        .replace("\\\\", "/")
                        .replace('\\', '/');
                String pathGramOld = Paths.get(path, oldCode + ".gram").toString()
                        .replace("\\\\", "/")
                        .replace('\\', '/');
                params.put("code", vocItem.getCode());
                params.put("name", vocItem.getName());
                sql = "update vocs set " +
                        "code=:code, " +
                        "\"name\"=:name " +
                        "where id=:id";
                db.Execute(con, sql, params);
                // Переименовываем файлы
                File file = new File(pathDicOld);
                if(file.exists()) {
                    if(!Files.isDirectory(Paths.get(pathDicNew))) {
                        new File(pathDicNew).deleteOnExit();
                    }
                    new File(pathDicNew).createNewFile();
                    copyFile(file, new File(pathDicNew));
                }
                file = new File(pathGramOld);
                if(file.exists()) {
                    if(!Files.isDirectory(Paths.get(pathGramNew))) {
                        new File(pathGramNew).deleteOnExit();
                    }
                    new File(pathGramNew).createNewFile();
                    copyFile(file, new File(pathGramNew));
                }
                try {
                    if(!Files.isDirectory(Paths.get(pathDicOld))) {
                        new File(pathDicOld).delete();
                    }
                }
                catch (Exception ex) {}
                try {
                    if(!Files.isDirectory(Paths.get(pathGramOld))) {
                        new File(pathGramOld).delete();
                    }
                }
                catch (Exception ex) {}
            }
            con.commit();
            return vocItem.getId();
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    public static void copyFile(File sourceFile, File destFile) throws IOException {
        if(!destFile.exists()) {
            destFile.createNewFile();
        }
        FileChannel source = null;
        FileChannel destination = null;
        try {
            source = new FileInputStream(sourceFile).getChannel();
            destination = new FileOutputStream(destFile).getChannel();
            destination.transferFrom(source, 0, source.size());
        }
        finally {
            if(source != null) {
                source.close();
            }
            if(destination != null) {
                destination.close();
            }
        }
    }
}
