package org.kaznalnrprograms.MCA.Phrase.Util;

import java.nio.file.Files;
import java.nio.file.Paths;

public class FFmpegUtil {
    public static void DecodeWavAlaw(String tmpFilePath, String outFilePath) throws Exception {
        try {
            if(!OSValidator.isUnix()) {
                throw new Exception("Используется сервер с ОС отличной от Linux");
            }
            if(!Files.exists(Paths.get(tmpFilePath))) {
                throw new Exception("Не найден аудио файл для перекодирования");
            }
            StringBuilder sb = new StringBuilder();
            sb.append("ffmpeg -y -i ");
            sb.append(tmpFilePath);
            sb.append(" -acodec pcm_alaw -ar 8000 -ac 1 ");
            sb.append(outFilePath);
            String[] command = {"sh", "-c", sb.toString()};
            Process proc = Runtime.getRuntime().exec(command);
            proc.waitFor();
        }
        catch (Exception ex) {
            throw ex;
        }
    }
}
