package org.kaznalnrprograms.MCA.Phrase.Util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileUtil {
    /**
     * Создать папку по пути к папке
     * @param dirPath
     * @throws IOException
     */
    public static void CreateDirIfNotExist(String dirPath) throws IOException {
        Path dir = Paths.get(dirPath);
        if (!Files.exists(dir)) {
            Files.createDirectory(dir);
        }
    }
    /**
     * Создать папку по пути к файлу
     * @param filePath
     * @throws IOException
     */
    public static void CreateDirParentIfNotExist(String filePath) throws IOException {
        Path parent = Paths.get(filePath).getParent();
        if (!Files.exists(parent)) {
            Files.createDirectory(parent);
        }
    }
    /**
     * Создать файл и записать в него строку данных
     * @param filePath - путь
     * @param fileBody - содержимое
     * @throws Exception
     */
    public static void CreateAndWriteFileString(String filePath, String fileBody) throws Exception {
        try {
            CreateFile(filePath);
            WriteFile(filePath, fileBody.getBytes());
        }
        catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Создать файл и записать в него массив байт
     * @param filePath - путь
     * @param fileBody - содержимое (массив байт)
     * @throws Exception
     */
    public static void CreateAndWriteFileBytes(String filePath, byte[] fileBody) throws Exception {
        try {
            CreateFile(filePath);
            WriteFile(filePath, fileBody);
        }
        catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Записать в файл массив байт
     * @param filePath - путь
     * @param fileByte - содержимое (массив байт)
     * @throws Exception
     */
    public static void WriteFile(String filePath, byte[] fileByte) throws Exception {
        try {
            if (IsFileExist(filePath)) {
                Files.write(Paths.get(filePath), fileByte);
            }
            else {
                throw new Exception("Файл по пути " + filePath + " не найден.");
            }
        }
        catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Создать файл
     * @param filePath - путь
     * @throws Exception
     */
    public static void CreateFile(String filePath) throws Exception {
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                throw new Exception("Файл по пути " + path.toString() + " уже существует.");
            }
            if(!Files.exists(Files.createFile(path))) {
                throw new Exception("Не удалось создать фпйл по пути " + path.toString() + ".");
            }
        }
        catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Удалить файл
     * @param filePath - путь
     * @throws Exception
     */
    public static void DeleteFile(String filePath) throws Exception {
        try {
            Path path = Paths.get(filePath);
            if(Files.isDirectory(path)) {
                return;
            }
            Files.deleteIfExists(path);
        }
        catch (Exception ex) {
            throw ex;
        }
    }
    /**
     * Проверка существования файла по переданному пути
     * @param filePath - путь
     * @return
     */
    public static boolean IsFileExist(String filePath) {
        Path path = Paths.get(filePath);
        return Files.exists(path);
    }
}
