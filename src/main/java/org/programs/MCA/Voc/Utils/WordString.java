package org.kaznalnrprograms.MCA.Voc.Utils;

public class WordString implements Comparable<WordString> {
    String word;
    String fonems;

    @Override
    public int compareTo(WordString s)
    {
        return word.compareTo(s.word);
    }
}
