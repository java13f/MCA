package org.kaznalnrprograms.MCA.Phrase.Dao;

import org.kaznalnrprograms.MCA.Phrase.Interfaces.IPhraseEditDao;
import org.kaznalnrprograms.MCA.Phrase.Interfaces.IPhraseGroupEditDao;
import org.kaznalnrprograms.MCA.Phrase.Models.*;
import org.kaznalnrprograms.MCA.Phrase.Util.FileUtil;
import org.kaznalnrprograms.MCA.Phrase.Util.RHVoiceUtil;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Repository
public class PhraseGroupEditDaoImpl implements IPhraseGroupEditDao {
    private String appName = "Phrase - модуль работы с фразами";
    private DBUtils db;
    IPhraseEditDao dEditPhrase;

    public PhraseGroupEditDaoImpl(DBUtils db){
        this.db = db;
        dEditPhrase = new PhraseEditDaoImpl(db);
    }

    @Override
    public List<VoiceTypeModel> GetVoiceTypes() throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String sql = "select id, \"name\" from voice_types where del=0";
            return db.Query(con, sql, VoiceTypeModel.class, null);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public VoiceEditModel GetGroup(String id) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "SELECT id, code, \"name\", voice_type_id voiceTypeId, volume, speed rate, pitch, " +
                    "test_text testText, creator, to_char(created, 'dd.MM.yyyy HH24:MI:SS') created, changer, to_char(changed, 'dd.MM.yyyy HH24:MI:SS') changed " +
                    "from phrase_grps where id=cast(:id as uuid)";
            return db.Query(con, sql, VoiceEditModel.class, params).get(0);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String SyntezeTest(VoiceTestParamModel testModel) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String sourceFile = dEditPhrase.GetTmpFilePathToServer(UUID.randomUUID().toString() + ".wav");
            String targetFile = dEditPhrase.GetTmpFilePathToServer(UUID.randomUUID().toString() + ".wav");
            FileUtil.CreateDirParentIfNotExist(targetFile);
            // Создаем голосовую модель
            VoiceModel vm = new VoiceModel();
            vm.setPitch(testModel.getPitch());
            vm.setRate(testModel.getRate());
            vm.setVolume(testModel.getVolume());
            Map<String, Object> params = new HashMap<>();
            params.put("id", testModel.getVoiceId());
            String sql = "select code from voice_types where id=cast(:id as uuid)";
            vm.setVoice(db.Query(con, sql, String.class, params).get(0));
            sql = "select array_to_string(ARRAY(select code from voice_codes " +
                    "   where client=(select \"value\" as val from global_params where param_code='voice_client' limit 1) " +
                    "), ' ') as command";
            vm.setCommandLine(db.Query(con, sql, String.class, null).get(0));
            sql = "select \"value\" as val from global_params where param_code='voice_client' limit 1";
            vm.setVoiceClient(db.Query(con, sql, String.class, null).get(0));
            // Синтез в файл
            RHVoiceUtil.Synteze(vm, testModel.getTestText(), sourceFile, targetFile);
            byte[] byts = Files.readAllBytes(Paths.get(targetFile));
            FileUtil.DeleteFile(sourceFile);
            FileUtil.DeleteFile(targetFile);
            return Base64.getEncoder().encodeToString(byts);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String SaveGroup(VoiceEditModel phraseGroup) throws Exception {
        List<ReSyntezePhraseModel> updatedPrases = null;
        String pathFolderFiles = null;
        try(Connection con = db.getConnectionWithTran(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("code", phraseGroup.getCode());
            params.put("name", phraseGroup.getName());
            params.put("pitch", phraseGroup.getPitch());
            params.put("rate", phraseGroup.getRate());
            params.put("volume", phraseGroup.getVolume());
            params.put("voiceTypeId", phraseGroup.getVoiceTypeId());
            params.put("text", phraseGroup.getTestText());
            String sql = "";
            if(phraseGroup.getId() == null || phraseGroup.getId().trim().length() == 0) {
                sql = "insert into phrase_grps (id, code, \"name\", voice_type_id, volume, speed, pitch, test_text, del) " +
                        "values " +
                        "(uuid_generate_v4(), :code, :name, cast(:voiceTypeId as uuid), :volume, :rate, :pitch, :text, 0)";
                phraseGroup.setId(db.Execute(con, sql, String.class, params));
            }
            else {
                db.CheckLock(con, -1, phraseGroup.getId(), "phrase_grps");
                // Получаем модель голоса до изменения
                VoiceModel vmCurrent = dEditPhrase.GetVoiceModel(con, phraseGroup.getId());
                // Изменяем голосовую модель
                params.put("id", phraseGroup.getId());
                sql = "update phrase_grps set " +
                        "code=:code, " +
                        "\"name\"=:name, " +
                        "voice_type_id=cast(:voiceTypeId as uuid), " +
                        "volume=:volume, " +
                        "speed=:rate, " +
                        "pitch=:pitch, " +
                        "test_text=:text " +
                        "where id=cast(:id as uuid)";
                db.Execute(con, sql,  params);

                // Получаем модель голоса после изменения
                VoiceModel vmNew = dEditPhrase.GetVoiceModel(con, phraseGroup.getId());

                // Если модель изменена, пересинтезируем фразы
                if(!vmCurrent.getVoiceClient().equals(vmNew.getVoiceClient())
                        || !vmCurrent.getVoice().equals(vmNew.getVoice())
                        || vmCurrent.getRate() != vmNew.getRate()
                        || vmCurrent.getVolume() != vmNew.getVolume()
                        || vmCurrent.getPitch() != vmNew.getPitch()
                ) {
                    // Получаем путь к папке с файлами на сервере
                    sql = "select \"value\" as val from global_params where param_code='sound_files_path' limit 1";
                    pathFolderFiles = db.Query(con, sql, String.class, null).get(0).replace("\\\\", "/").replace('\\', '/');

                    // Делаем пересинтез фраз в группе
                    updatedPrases = ReSynteseGrpPhrases(con, phraseGroup.getId(), pathFolderFiles);
                    if (updatedPrases != null && updatedPrases.size() > 0) {
                        for (ReSyntezePhraseModel reM : updatedPrases) {
                            if (reM.getNewFileName() == null || reM.getNewFileName().trim().length() == 0) {
                                throw new Exception("Не удалось найти пересинтезированный файл для фразы с id=" + reM.getId());
                            }
                            params.clear();
                            params.put("pId", reM.getId());
                            params.put("pFileName", reM.getNewFileName());
                            sql = "update phrases set file_name=:pFileName where id=cast(:pId as uuid)";
                            db.Execute(con, sql, params);
                        }
                        // Удаляем старые файлы
                        for (ReSyntezePhraseModel reM : updatedPrases) {
                            if (reM.getFileName() != null) {
                                String fPath = Paths.get(pathFolderFiles, reM.getFileName()).toString().replace("\\\\", "/").replace('\\', '/');
                                if (FileUtil.IsFileExist(fPath)) {
                                    try {
                                        FileUtil.DeleteFile(fPath);
                                    } catch (Exception ee) { }
                                }
                            }
                        }
                    }
                }
            }
            con.commit();
            return phraseGroup.getId();
        }
        catch (Exception ex) {
            DeleteFilesIfError(updatedPrases, pathFolderFiles);
            throw ex;
        }
    }

    @Override
    public boolean CheckGrpCode(Map<String, Object> params) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String id = params.get("id").toString();
            String sql = "select count(*) cnt from phrase_grps where code=:code " +
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
    public String DelGroup(String id) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "update phrase_grps set del=(select (1-del) del from phrase_grps where id=cast(:id as uuid)) where id=cast(:id as uuid)";
            db.Execute(con, sql, params);
            con.commit();
            return id;
        } catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Ресинтез текста фраз группы в аудио файл при обновлении группы
     * @param con
     * @param groupId
     * @param pathFolderFiles
     * @return
     * @throws Exception
     */
    private List<ReSyntezePhraseModel> ReSynteseGrpPhrases(Connection con, String groupId, String pathFolderFiles) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("grpId", groupId);
        String sql = "select id, \"name\", file_name fileName, NULL as newFileName " +
                "from phrases where phrase_grp_id=cast(:grpId as uuid) and is_syntesed=1 and del=0";
        List<ReSyntezePhraseModel> resynteses = db.Query(con, sql, ReSyntezePhraseModel.class, params);
        VoiceModel vm = dEditPhrase.GetVoiceModel(con, groupId);
        String tmpFolderPath = dEditPhrase.GetTmpFolderPathToServer();
        try {
            if (resynteses != null) {
                for (int i = 0; i < resynteses.size(); i++) {
                    String sourceFile = UUID.randomUUID().toString() + ".wav";
                    String sourceFilePath = Paths.get(tmpFolderPath, sourceFile).toString().replace("\\\\", "/").replace('\\', '/');
                    String targetFile = UUID.randomUUID().toString() + ".wav";
                    String targetFilePath = Paths.get(pathFolderFiles, targetFile).toString().replace("\\\\", "/").replace('\\', '/');
                    SyntezeWawFile(vm, resynteses.get(i).getName(), sourceFilePath, targetFilePath);
                    resynteses.get(i).setNewFileName(targetFile);
                }
            }
            return resynteses;
        }
        catch (Exception ex) {
            DeleteFilesIfError(resynteses, pathFolderFiles);
            throw ex;
        }
    }
    /**
     * Синтез текста в аудио файл
     * @param vm
     * @param text
     * @param sourceFilePath
     * @param targetFilePath
     * @throws Exception
     */
    private void SyntezeWawFile(VoiceModel vm, String text, String sourceFilePath, String targetFilePath) throws Exception {
        // Синтез в файл
        RHVoiceUtil.Synteze(vm, text, sourceFilePath, targetFilePath);
        FileUtil.DeleteFile(sourceFilePath);
    }
    /**
     * Удаление вновь сохраненных файлов в случае возникновения ошибки
     * @param resynteses
     * @param pathFolderFiles
     * @throws Exception
     */
    void DeleteFilesIfError(List<ReSyntezePhraseModel> resynteses, String pathFolderFiles) throws Exception {
        if (resynteses != null) {
            // Удаляем все новые файлы
            for (int i = 0; i < resynteses.size(); i++) {
                if(resynteses.get(i).getNewFileName() != null) {
                    String fPath = Paths.get(pathFolderFiles, resynteses.get(i).getNewFileName()).toString().replace("\\\\", "/").replace('\\', '/');
                    if(FileUtil.IsFileExist(fPath)) {
                        FileUtil.DeleteFile(fPath);
                    }
                }
            }
        }
    }
}
