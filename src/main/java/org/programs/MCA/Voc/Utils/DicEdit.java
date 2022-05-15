package org.kaznalnrprograms.MCA.Voc.Utils;

import java.io.*;
import java.nio.charset.Charset;

public class DicEdit {
    private String dicPath;
    private String gramPath;
    private WordDic dict = new WordDic();

    public void setDicPath(String dicPath) {
        this.dicPath = dicPath;
    }

    public void setGramPath(String gramPath) {
        this.gramPath = gramPath;
    }

    public String[] list() throws Exception {
        dict.read(dicPath);
        String[] list = dict.getWordList();
        return list;
    }

    public void addword(String word) throws Exception {
        File file = new File(gramPath);
        FileWriter fw = null;
        fw = new FileWriter(file, Charset.forName("utf-8"));
        dict.read(dicPath);
        dict.addWord(word);
        dict.write(dicPath);
        createGram(dict.getWordList(), fw);
    }

    public void delword(String word) throws Exception {
        File file = new File(gramPath);
        FileWriter fw = null;
        fw = new FileWriter(file, Charset.forName("utf-8"));
        dict.read(dicPath);
        dict.delWord(word);
        dict.write(dicPath);
        createGram(dict.getWordList(), fw);
    }

    public String CheckWord(String word) throws Exception {
        try {
            return dict.CheckWord(word);
        }
        catch (Exception ex) {
            throw ex;
        }
    }

    private void createGram(String[] words, FileWriter fw) throws IOException {
        String wordlist = String.join(" | ", words);
        try {
            BufferedWriter writer = new BufferedWriter(fw);
            writer.write("#JSGF V1.0\r\n");
            writer.write("grammar words;\n");
            writer.write("public <words> = ( " + wordlist + " )*;");
            writer.flush();
            writer.close();
            fw.close();
        } catch (Exception e) {
            fw.close();
            throw e;
        }
    }
}
