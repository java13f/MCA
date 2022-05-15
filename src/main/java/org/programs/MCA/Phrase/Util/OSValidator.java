package org.kaznalnrprograms.MCA.Phrase.Util;

public class OSValidator {
    private static String OS = System.getProperty("os.name").toLowerCase();

    public static boolean isUnix() {
        return (OS.contains("nix") || OS.contains("nux") || OS.contains("aix"));
    }
}
