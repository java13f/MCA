package org.kaznalnrprograms.MCA.Voc.Utils;

import java.util.ArrayList;
import java.io.*;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Collections;

public class WordDic {
    private ArrayList<WordString> words = new ArrayList();
    private Character[] glasn_lets = {'а', 'у', 'о', 'ы', 'и', 'э', 'я', 'ю', 'ё', 'е'};

    public void read(String filepath) throws IOException {
        words.clear();
        FileReader fr = null;
        try {
            File file = new File(filepath);
            fr = new FileReader(file, Charset.forName("utf-8"));
            BufferedReader reader = new BufferedReader(fr);
            String line = reader.readLine();
            while (line != null)
            {
                WordString str = new WordString();
                str.word = line.split(" ")[0];
                str.fonems = line.substring(str.word.length() + 1);
                words.add(str);
                line = reader.readLine();
            }
            fr.close();
        } catch (Exception e) {
            if(fr != null) {
                fr.close();
            }
            throw e;
        }
    }

    public void write(String filepath) throws IOException {
        FileWriter fw = null;
        try {
            File file = new File(filepath);
            fw = new FileWriter(file, Charset.forName("utf-8"));
            BufferedWriter writer = new BufferedWriter(fw);
            for (int i=0; i< words.size(); i++) {
                writer.write(words.get(i).word + " " + words.get(i).fonems+"\r\n");
            }
            writer.flush();
            fw.close();
        } catch (Exception e) {
            if(fw != null) {
                fw.close();
            }
            throw e;
        }

    }

    public String[] getWordList()
    {
        return words.stream().map(s -> s.word).toArray(String[]::new);
    }

    public void addWord(String word) throws Exception {
        String chk = CheckWord(word);
        if(chk.length() > 0) {
            throw new Exception(chk);
        }
        WordString list = new WordString();
        list.word=word.replaceAll("\\+", "");
        list.fonems=Transcript.transcript(word);
        words.add(list);
        Collections.sort(words);
    }

    public String CheckWord(String word) {
        if(word.contains(" ")) {
            return "В слове не должно быть пробелов";
        }
        if(!word.matches("^[а-яА-ЯёЁ\\+]+$")) {
            return "В слове присутствуют недопустимые символы. Допускаются только русские буквы и знак ударения \"+\"";
        }
        if (Arrays.asList(words.stream().map(s -> s.word).toArray()).contains(word.toLowerCase().replaceAll("\\+",""))) {
            return "В словаре уже есть добавляемое слово \"" + word.replaceAll("\\+","") + "\"";
        }
        if (!word.contains("+"))
        {
            return "Не указано ударение в слове.<br>Ударение проставляется при помощи символа \"+\" перед ударной гласной";
        }
        String[] items = word.split("\\+");
        if(items.length > 2) {
            return "В слове поставлено более одного ударения";
        }
        if(items[0].length() == word.replaceAll("\\+","").length()) {
            return "Ударение не может быть установлено в конце слова";
        }
        if(items[1].trim().length() > 0 && !Arrays.asList(glasn_lets).contains(items[1].charAt(0))) {
            return "Ударение должно быть проставлено только перед ударной гласной";
        }
        return "";
    }

    public void delWord(String word) throws Exception {
        if (Arrays.asList(words.stream().map(s -> s.word).toArray(String[]::new)).contains(word))
        {
            words.remove(Arrays.asList(words.stream().map(s -> s.word).toArray(String[]::new)).indexOf(word));
        }
        else
        {
            throw new Exception("В словаре нет удаляемого слова \""+word+"\"");
        }
    }
}
