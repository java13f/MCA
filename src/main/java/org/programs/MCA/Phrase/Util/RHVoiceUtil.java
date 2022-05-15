package org.kaznalnrprograms.MCA.Phrase.Util;

import org.kaznalnrprograms.MCA.Phrase.Models.VoiceModel;

public class RHVoiceUtil {
    public static void Synteze(VoiceModel vModel, String inText, String tmpFilePath, String outFilePath) throws Exception {
        try {
            if(!OSValidator.isUnix()) {
                throw new Exception("Используется сервер с ОС отличной от Linux");
            }
            String volumeStr = "";
            String rateStr = "";
            String pitchStr = "";
            if(vModel.getVoiceClient().equals("RHVoice-test")) {
                volumeStr = String.valueOf(vModel.getVolume() == 0 ? 100 : 100 + (vModel.getVolume() * 10));
                rateStr = String.valueOf(vModel.getRate() == 0 ? 100 : 100 + (vModel.getRate() * 10));
                pitchStr = String.valueOf(vModel.getPitch() == 0 ? 100 : 100 + (vModel.getPitch() * 10));
            }
            else if(vModel.getVoiceClient().equals("RHVoice-client")) {
                volumeStr = String.valueOf((double)(vModel.getVolume() == 0 ? vModel.getVolume() : vModel.getVolume())/10).replace(',', '.');
                rateStr = String.valueOf((double)(vModel.getRate() == 0 ? vModel.getRate() : vModel.getRate())/10).replace(',', '.');
                pitchStr = String.valueOf((double)(vModel.getPitch() == 0 ? vModel.getPitch() : vModel.getPitch())/10).replace(',', '.');
            }
            StringBuilder sb = new StringBuilder();
            sb.append("echo \"");
            sb.append(inText);
            sb.append("\" | ");
            sb.append(vModel.getVoiceClient());
            sb.append(" ");
            sb.append(vModel.getCommandLine()
                    .replace("@TypeVoice",vModel.getVoice())
                    .replace("@Volume", volumeStr)
                    .replace("@Speed", rateStr)
                    .replace("@Pitch", pitchStr)
                    .replace("@Output", tmpFilePath)
            );
            sb.append("; ffmpeg -y -i ");
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
