package org.kaznalnrprograms.MCA.Phrase.Dao;

import org.kaznalnrprograms.MCA.Phrase.Interfaces.IPhraseEditDao;
import org.kaznalnrprograms.MCA.Phrase.Models.*;
import org.kaznalnrprograms.MCA.Phrase.Util.FFmpegUtil;
import org.kaznalnrprograms.MCA.Phrase.Util.FileUtil;
import org.kaznalnrprograms.MCA.Phrase.Util.OSValidator;
import org.kaznalnrprograms.MCA.Phrase.Util.RHVoiceUtil;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Repository
public class PhraseEditDaoImpl implements IPhraseEditDao {
    private String appName = "Phrase - модуль работы с фразами";
    private DBUtils db;

    public PhraseEditDaoImpl(DBUtils db){
        this.db = db;
    }

    public String ConvertWavFile(ConvertFileModel file) throws Exception {
        try{
            if(!OSValidator.isUnix()) {
                throw new Exception("Используется сервер с ОС отличной от Linux");
            }
            String sourceFile = GetTmpFilePathToServer(UUID.randomUUID().toString() + ".wav");
            String targetFile = GetTmpFilePathToServer(UUID.randomUUID().toString() + ".wav");
            FileUtil.CreateDirParentIfNotExist(targetFile);
            byte[] bytes = Base64.getDecoder().decode(file.getFileData().getBytes());
            FileUtil.CreateAndWriteFileBytes(sourceFile, bytes);
            // Перекодирование в alaw
            FFmpegUtil.DecodeWavAlaw(sourceFile, targetFile);
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
    public String SyntezeWawFile(SyntezeTextModel syntezeTextModel) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String sourceFile = GetTmpFilePathToServer(UUID.randomUUID().toString() + ".wav");
            String targetFile = GetTmpFilePathToServer(UUID.randomUUID().toString() + ".wav");
            FileUtil.CreateDirParentIfNotExist(targetFile);
            VoiceModel vm = GetVoiceModel(con, syntezeTextModel.getPhraseGroupId());
            // Синтез в файл
            RHVoiceUtil.Synteze(vm, syntezeTextModel.getPhraseText(), sourceFile, targetFile);
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
    public VoiceModel GetVoiceModel(Connection con, String groupId) {
        Map<String, Object> params = new HashMap<>();
        params.put("grpId", groupId);
        String sql = "select vt.code voice, pg.volume volume, pg.speed rate, pg.pitch pitch, c.command commandLine, " +
                "(select \"value\" as val from global_params where param_code='voice_client' limit 1) voiceClient " +
                "from phrase_grps pg " +
                "join (select array_to_string(ARRAY(select code from voice_codes " +
                "  where client=(select \"value\" as val from global_params where param_code='voice_client' limit 1) " +
                "), ' ') as command) c on 1=1 " +
                "join voice_types vt on vt.id=pg.voice_type_id " +
                "where pg.id=cast(:grpId as uuid)";
        return db.Query(con, sql, VoiceModel.class, params).get(0);
    }

    @Override
    public GlobalParamsModel GetGlobalParams() throws Exception {
        try(Connection con = db.getConnection(appName)) {
            GlobalParamsModel gpm = new GlobalParamsModel();
            String sql = "select \"value\" as val from global_params where param_code='record_max_time' limit 1";
            gpm.setRecord_max_time(Integer.parseInt(db.Query(con, sql, String.class, null).get(0)));
            return gpm;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public boolean CheckPhraseCode(Map<String, Object> params) throws Exception {
        try(Connection con = db.getConnection(appName)) {
            String id = params.get("id").toString();
            String sql = "select count(*) cnt from phrases where code=:code and phrase_grp_id=cast(:grpId as uuid) " +
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
    public String GetPhraseFilePathToServer(String fileName) throws Exception {
            return Paths.get(GetPhraseFolderPathToServer(), fileName).toString()
                    .replace("\\\\", "/")
                    .replace('\\', '/');
    }

    @Override
    public String GetPhraseFolderPathToServer() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "select \"value\" as val from global_params where param_code='sound_files_path' limit 1";
            return db.Query(con, sql, String.class, null).get(0)
                    .replace("\\\\", "/")
                    .replace('\\', '/');
        }
        catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Путь к файлу по имени во временной папке
     * @param fileName
     * @return
     * @throws Exception
     */
    public String GetTmpFilePathToServer(String fileName) throws Exception {
            return Paths.get(GetTmpFolderPathToServer(), fileName).toString()
                    .replace("\\\\", "/")
                    .replace('\\', '/');
    }

    @Override
    public String GetTmpFolderPathToServer() throws Exception {
        try(Connection con = db.getConnection(appName)){
            String sql = "select \"value\" as val from global_params where param_code='tmp_files_path' limit 1";
            return db.Query(con, sql, String.class, null).get(0)
                    .replace("\\\\", "/")
                    .replace('\\', '/');
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public PhraseChangeModel GetPhrase(String id) throws Exception {
        try(Connection con = db.getConnection(appName)){
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "select " +
                    "p.id id, " +
                    "pg.id phraseGrpId, " +
                    "p.code code, " +
                    "p.\"name\" \"name\", " +
                    "p.org_file_name orgFileName, " +
                    "(case when p.is_syntesed is null then 0 else p.is_syntesed end) flagSyntezed, " +
                    "to_char(p.created, 'dd.MM.yyyy HH24:MI:SS') created, " +
                    "p.creator creator, " +
                    "to_char(p.changed, 'dd.MM.yyyy HH24:MI:SS') changed, " +
                    "p.changer changer, " +
                    "NULL as fileData, " +
                    "'' errorMess " +
                    "from phrases p " +
                    "join phrase_grps pg on pg.id=p.phrase_grp_id " +
                    "where p.id=cast(:id as uuid)";
            PhraseChangeModel phrase = db.Query(con, sql, PhraseChangeModel.class, params).get(0);
            sql = "select file_name from phrases where id=cast(:id as uuid)";
            String filePath = GetPhraseFilePathToServer(db.Query(con, sql, String.class, params).get(0));
            if(FileUtil.IsFileExist(filePath)) {
                try {
                    byte[] byts = Files.readAllBytes(Paths.get(filePath));
                    phrase.setFileData(Base64.getEncoder().encodeToString(byts));
                }
                catch (Exception ee) {
                    phrase.setFileData(null);
                }
            }
            else {
                phrase.setErrorMess("Не удалось найти звуковой файл по пути " + filePath);
            }
            if(phrase.getErrorMess().length() == 0 && (phrase.getFileData() == null || phrase.getFileData().trim().length() == 0)) {
                phrase.setErrorMess("Не удалось прочесть звуковой файл по пути " + filePath);
            }
            return phrase;
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    @Override
    public String SavePhrase(PhraseChangeModel phrase) throws Exception {
        String filePathSrv = null;
        try(Connection con = db.getConnectionWithTran(appName)){
            boolean isInsert = phrase.getId() == null || phrase.getId().trim().length() == 0;
            Map<String, Object> params = new HashMap<>();
            String sql = "";
            String fileName = UUID.randomUUID().toString() + ".wav";
            filePathSrv = GetPhraseFilePathToServer(fileName);
            if(FileUtil.IsFileExist(filePathSrv)) {
                throw new Exception("Ошибка сохранения файла. Файл с новым случайным именем уже существует на сервере. Попробуйте сохранить еще раз.");
            }
            // Сохранение файла
            byte[] bytes = Base64.getDecoder().decode(phrase.getFileData().getBytes());
            FileUtil.CreateAndWriteFileBytes(filePathSrv, bytes);
            // получаем имя старого файла
            String fOldPath = null;
            if (!isInsert) {
                params.put("id", phrase.getId());
                sql = "select file_name from phrases where id=cast(:id as uuid)";
                String fOldName = db.Query(con, sql, String.class, params).get(0);
                fOldPath = GetPhraseFilePathToServer(fOldName);
            }
            params.clear();
            // Вставка новой записи
            params.put("code", phrase.getCode());
            params.put("name", phrase.getName());
            params.put("orgFileName", phrase.getOrgFileName());
            params.put("fileName", fileName);
            params.put("phraseGrpId", phrase.getPhraseGrpId());
            params.put("flagSyntezed", phrase.getFlagSyntezed());
            if (isInsert) {
                sql = "insert into phrases (id, phrase_grp_id, code, \"name\", org_file_name, file_name, is_syntesed, del) values (" +
                        "uuid_generate_v4()," +
                        "(select id from phrase_grps where id=cast(:phraseGrpId as uuid)), " +
                        ":code, " +
                        ":name, " +
                        ":orgFileName, " +
                        ":fileName, " +
                        ":flagSyntezed, " +
                        "0" +
                        ")";
                phrase.setId(db.Execute(con, sql, String.class, params));
            }
            // Обновление существующей записи
            else {
                db.CheckLock(con, -1, phrase.getId(), "phrases");
                params.put("id", phrase.getId());
                sql = "update phrases set " +
                        "phrase_grp_id = (select id from phrase_grps where id=cast(:phraseGrpId as uuid)), " +
                        "code=:code, " +
                        "\"name\"=:name, " +
                        "org_file_name=:orgFileName, " +
                        "file_name=:fileName, " +
                        "is_syntesed=:flagSyntezed " +
                        "where id=cast(:id as uuid)";
                db.Execute(con, sql, params);
            }
            // Удаление старого файла
            if (!isInsert) {
                if(FileUtil.IsFileExist(fOldPath)) {
                    try {
                        FileUtil.DeleteFile(fOldPath);
                    }
                    catch (Exception ef) {}
                }
            }
            con.commit();
            return phrase.getId();
        }
        catch (Exception ex) {
            if(filePathSrv != null && FileUtil.IsFileExist(filePathSrv)) {
                FileUtil.DeleteFile(filePathSrv);
            }
            throw ex;
        }
    }

    @Override
    public String DelPhrase(String id) throws Exception {
        try(Connection con = db.getConnectionWithTran(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "update phrases set del=(select (1-del) del from phrases where id=cast(:id as uuid)) where id=cast(:id as uuid)";
            db.Execute(con, sql, params);
            con.commit();
            return id;
        } catch (Exception ex) {
            throw ex;
        }
    }
}
