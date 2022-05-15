package org.kaznalnrprograms.MCA.Dialogs.Utils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileUtil
{
    /**
     * Проверка является переданный путь директорией
     * @param filePath
     * @return
     */
    public static boolean FileIsDirectory(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.isDirectory(path);
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
