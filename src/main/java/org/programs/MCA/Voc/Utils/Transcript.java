package org.kaznalnrprograms.MCA.Voc.Utils;

public class Transcript {
    // глухие
    static String SURD = "p|pp|f|ff|k|kk|t|tt|sh|s|ss|h|hh|c|ch|sch";
    // гласные
    static String VOWEL = "а|я|о|ё|у|ю|э|е|ы|и|aa|a|oo|o|uu|u|ee|e|yy|y|ii|i|uj|ay|jo|je|ja|ju";
    // все гласные
    static String STARTSYL = "ь|ъ|"+VOWEL;
    // смягчаюшие гласные
    static String SOFTLETTERS = "ь|я|ё|ю|е|и";
    // несмягчающие гласные
    static String HARDLETTERS = "ъ|а|о|у|э|ы";
    // $NOPAIR_SOFT = '[ч|щ|й]';
    // $NOPAIR_HARD = '[ж|ш|ц]';
    static String NOPAIR = "ч|щ|й|ж|ш|ц|ch|sch|j|zh|sh|c";
    // твёрдые согласные, кроме ж,ш,ц
    static String HARD_SONAR1 = "b|v|g|d|z|k|l|m|n|p|r|s|t|f|h";
    // твёрдые согласные ж,ш,ц
    static String HARD_SONAR2 = "zh|sh|c";
    //
    static String HARD_SONAR=HARD_SONAR1+"|"+HARD_SONAR2;
    // мягкие согласные
    static String SOFT_SONAR = "bb|vv|gg|dd|zz|j|kk|ll|mm|nn|pp|rr|ss|tt|ff|hh|ch|sch";
    static String SOFT_SONAR_SILVER = "bb|gg|dd|zz|kk|ll|mm|nn|rr|ss|tt|ch|sch";
    // все согласные
    static String ALL_SONAR=HARD_SONAR+"|"+SOFT_SONAR+"|ь|ъ";
    // звонкие, кроме v,vv,j,l,ll,m,mm,n,nn,r,rr
    static String RINGING1 = "b|bb|g|gg|d|dd|zh|z|zz";
    // парные твёрдые согласные
    static String PAIR_HARD = "б|в|г|д|ж|з|b|v|g|d|zh|z";
    static String PAIR_HARD1 = PAIR_HARD+"|ц|c";
    //
    static String SOGL="б|в|г|д|з|к|л|м|н|й|п|р|с|т|ф|х|ж|ш|щ|ц|ч|ь|ъ|-|'";

    static private String addSpace(String word)
    {
        String s = "";
        for (char ch: word.toCharArray()) {
            s += " "+ch;
        }
        s += " ";
        return s;
    }

    static String transcript(String word)
    {
        word = addSpace(word); //разделяем буквы пробелами

        word = word.replaceAll("\\+ ", "+"); //гласную с ударением не разбиваем
        word = word.replaceAll("` ", "ъ "); // Д`артаньян -> Дъартаньян

        //Исключения
        word = word.replaceAll("(с е) г ([+]?о д н я )", "$1 v $2"); //сегодня
        word = word.replaceAll("([+]?о) г ([+]?о )", "$1 v $2"); //*ого
        word = word.replaceAll("([+]?е) г ([+]?о )", "$1 v $2"); //*его
        word = word.replaceAll("([+]?е) г ([+]?о с [+]?я )", "$1 v $2"); //*егося

        //Упрощение парных согласных
        word = word.replaceAll("б б", "б");
        word = word.replaceAll("т т", "т");
        word = word.replaceAll("с с", "с");
        word = word.replaceAll("ф ф", "ф");
        word = word.replaceAll("р р", "р");
        word = word.replaceAll("н н", "н");
        word = word.replaceAll("м м", "м");
        word = word.replaceAll("к к", "к");
        word = word.replaceAll("п п", "п");
        word = word.replaceAll("л л", "л");
        word = word.replaceAll("з з", "з");

        //Упрощение групп согласных (непроизносимый согдасный)
        word = word.replaceAll("с т л", "с л"); //счастливый
        word = word.replaceAll("с т н", "с н"); //местный
        word = word.replaceAll("з д н", "з н"); //поздний
        word = word.replaceAll("з д ц", "с ц"); //под уздцы
        word = word.replaceAll("н д ш", "н ш"); //ландшафт
        word = word.replaceAll("н т г", "н г"); //рентген
        word = word.replaceAll("н д ц", "н ц"); //голландцы
        word = word.replaceAll("р [дт] ц", "р ц"); //сердце
        word = word.replaceAll("р д ч", "р ч"); //сердчишко
        word = word.replaceAll("л н ц", "н ц"); //солнце
        word = word.replaceAll("с т с я", "с ц а");
        word = word.replaceAll("с т ь с я", "с ц а");
        word = word.replaceAll("с т с", "с");
        word = word.replaceAll("с т ь с", "с");
        word = word.replaceAll("с т ц", "с ц");
        word = word.replaceAll("ч ш", "т ш");

        //Нечитаемые фонемы
        word = word.replaceAll("[тд] с [+]?я", "ц я");
        word = word.replaceAll("[тд] ь с", "ц");
        word = word.replaceAll("х [тд] с", "х с");
        word = word.replaceAll("н (к|г) т", "$1 т");
        word = word.replaceAll("н [тд] с", "н с");
        word = word.replaceAll("н [тд] ц", "н ц");
        word = word.replaceAll("[вф] с т в", "с т в");
        word = word.replaceAll("[зс] ч", "щ");
        word = word.replaceAll("[зс] ш", "ш");
        word = word.replaceAll("[зс] щ", "щ");
        word = word.replaceAll("[зс] ж", "ж");
        word = word.replaceAll("[тд] ц", "ц");
        word = word.replaceAll("[тд] ч", "ч");
        word = word.replaceAll("[тд] щ", "ч щ");
        word = word.replaceAll("д с т", "ц т");

        //Варианты оглушения
        word = word.replaceAll("г к","h к");	// легка -> лехка

        // обозначают гласный и мягкость предшествующего парного по твердости / мягкости согласного звука: мёл [м'ол] – ср.: мол [мол]
        // исключение может составлять буква е в заимствованных словах, не обозначающая мягкости предшествующего согласного – пюре [п'урэ́];
        word = word.replaceAll("б ([+]?("+SOFTLETTERS+"))","bb $1");
        word = word.replaceAll("в ([+]?("+SOFTLETTERS+"))","vv $1");
        word = word.replaceAll("г ([+]?("+SOFTLETTERS+"))","gg $1");
        word = word.replaceAll("д ([+]?("+SOFTLETTERS+"))","dd $1");
        word = word.replaceAll("з ([+]?("+SOFTLETTERS+"))","zz $1");
        word = word.replaceAll("к ([+]?("+SOFTLETTERS+"))","kk $1");
        word = word.replaceAll("л ([+]?("+SOFTLETTERS+"))","ll $1");
        word = word.replaceAll("м ([+]?("+SOFTLETTERS+"))","mm $1");
        word = word.replaceAll("н ([+]?("+SOFTLETTERS+"))","nn $1");
        word = word.replaceAll("п ([+]?("+SOFTLETTERS+"))","pp $1");
        word = word.replaceAll("р ([+]?("+SOFTLETTERS+"))","rr $1");
        word = word.replaceAll("с ([+]?("+SOFTLETTERS+"))","ss $1");
        word = word.replaceAll("т ([+]?("+SOFTLETTERS+"))","tt $1");
        word = word.replaceAll("ф ([+]?("+SOFTLETTERS+"))","ff $1");
        word = word.replaceAll("х ([+]?("+SOFTLETTERS+"))","hh $1");

        // иногда согласные Н и С смягчаются перед некоторыми мягкими согласными
        word = word.replaceAll(" н (tt|sch|ch|щ|ч) "," nn $1 ");		// ан'тичнось, жен'щин
        word = word.replaceAll(" с (tt|sch|ch|щ|ч) "," ss $1 ");

        // простые твёрдые
        word = word.replaceAll("б","b");
        word = word.replaceAll("в","v");
        word = word.replaceAll("г","g");
        word = word.replaceAll("д","d");
        word = word.replaceAll("ж","zh");
        word = word.replaceAll("з","z");
        word = word.replaceAll("к","k");
        word = word.replaceAll("л","l");
        word = word.replaceAll("м","m");
        word = word.replaceAll("н","n");
        word = word.replaceAll("п","p");
        word = word.replaceAll("р","r");
        word = word.replaceAll("с","s");
        word = word.replaceAll("т","t");
        word = word.replaceAll("ф","f");
        word = word.replaceAll("х","h");
        word = word.replaceAll("ц","c");
        word = word.replaceAll("ш","sh");

        // и мягкие звуки
        word = word.replaceAll("ч","ch");
        word = word.replaceAll("щ","sch");
        word = word.replaceAll("й","j");

        // звонкие парные меняются на глухие в абсолютном конце (оглушаются)
        word = word.replaceAll(" b (ъ )?$"," p $1");
        word = word.replaceAll(" v (ъ )?$"," f $1");
        word = word.replaceAll(" g (ъ )?$"," k $1");
        word = word.replaceAll(" d (ъ )?$"," t $1");
        word = word.replaceAll(" z (ъ )?$"," s $1");
        word = word.replaceAll(" zh (ъ )?$"," sh $1");
        word = word.replaceAll(" bb (ъ )?$"," pp $1");
        word = word.replaceAll(" vv (ъ )?$"," ff $1");
        word = word.replaceAll(" gg (ъ )?$"," kk $1");
        word = word.replaceAll(" dd (ъ )?$"," tt $1");
        word = word.replaceAll(" zz (ъ )?$"," ss $1");

        // Мягкие сгласные в конце оглушаются ?
        word = word.replaceAll(" zh ь $"," sh ь ");
        word = word.replaceAll(" bb ь $"," pp ь ");
        word = word.replaceAll(" vv ь $"," ff ь ");
        word = word.replaceAll(" gg ь $"," kk ь ");
        word = word.replaceAll(" dd ь $"," tt ь ");
        word = word.replaceAll(" zz ь $"," ss ь ");

        // звонкие парные меняются на глухие перед глухими (оглушаются)
        word = word.replaceAll(" b ("+SURD+")"," p $1");
        word = word.replaceAll(" v ("+SURD+")"," f $1");
        word = word.replaceAll(" g ("+SURD+")"," k $1");
        word = word.replaceAll(" d ("+SURD+")"," t $1");
        word = word.replaceAll(" z ("+SURD+")"," s $1");
        word = word.replaceAll(" zh ("+SURD+")"," sh $1");
        word = word.replaceAll(" bb ("+SURD+")"," pp $1");
        word = word.replaceAll(" vv ("+SURD+")"," ff $1");
        word = word.replaceAll(" gg ("+SURD+")"," kk $1");
        word = word.replaceAll(" dd ("+SURD+")"," tt $1");
        word = word.replaceAll(" zz ("+SURD+")"," ss $1");

        // глухие парные, стоящие перед звонкими (кроме ... ) меняются за звонкие
        word = word.replaceAll(" p ("+RINGING1+")"," b $1");
        word = word.replaceAll(" f ("+RINGING1+")"," v $1");
        word = word.replaceAll(" k ("+RINGING1+")"," g $1");
        word = word.replaceAll(" t ("+RINGING1+")"," d $1");
        word = word.replaceAll(" sh ("+RINGING1+")"," zh $1");
        word = word.replaceAll(" s ("+RINGING1+")"," z $1");
        word = word.replaceAll("ь $","");			//мягкий знак на конце больше не интересует

        // Позиционное употребление согласных по имым признакам. Расподобление согласных.
        word = word.replaceAll(" t s "," c ");	// [т] + [с]  -> [цц] или [цс]: мыться [мы́цца] = [мы́ца], отсыпать [ацсы́пат’]

        // Спецзамена
        word = word.replaceAll("Б","b");
        word = word.replaceAll("В","v");
        word = word.replaceAll("Г","g");
        word = word.replaceAll("Д","d");
        word = word.replaceAll("Ж","zh");
        word = word.replaceAll("З","z");
        word = word.replaceAll("К","k");
        word = word.replaceAll("Л","l");
        word = word.replaceAll("М","m");
        word = word.replaceAll("Н","n");
        word = word.replaceAll("П","p");
        word = word.replaceAll("Р","r");
        word = word.replaceAll("С","s");
        word = word.replaceAll("Т","t");
        word = word.replaceAll("Ф","f");
        word = word.replaceAll("Х","h");
        word = word.replaceAll("Ц","c");
        word = word.replaceAll("Ш","sh");
        word = word.replaceAll("Ч","ch");
        word = word.replaceAll("Щ","sch");
        word = word.replaceAll("Й","j");

        // не читаемые гласные
        word = word.replaceAll(" и о а "," и а ");				// радиоактивных [и]
        word = word.replaceAll(" и э "," и ");				    // полиэтилен [и]

        // Й
        word = word.replaceAll("( ("+STARTSYL+")) (\\+[юяеё])","$1 j $3");		// звуки [ ю я е ё ]
        word = word.replaceAll("( [ьъ]) ([юяеё])","$1 j $2");			            // звуки [ ю я е ё ]
        word = word.replaceAll("^ ([+]?[юяеё])"," j $1");				            // звуки [ ю я е ё ]
        word = word.replaceAll("((ь|ъ) )([+]?[иоэ])","$1\\j $3");			        // бабьим [бабьйим], лосьон [лосьён]

        // после твёрдых согласных - гласные становятся грухими
        word = word.replaceAll("( ("+HARD_SONAR+") [+]?)и","/$1ы");
        word = word.replaceAll("( ("+HARD_SONAR+") [+]?)е","/$1э");
        word = word.replaceAll("( ("+HARD_SONAR+") [+]?)я","/$1а");
        word = word.replaceAll("( ("+HARD_SONAR+") [+]?)ё","/$1о");
        word = word.replaceAll("( ("+HARD_SONAR+") [+]?)ю","/$1у");

        // после мягких согласных - гласные становятся звонкими
        word = word.replaceAll("( ("+SOFT_SONAR+") [+]?)ы","/$1и");
        word = word.replaceAll("( ("+SOFT_SONAR+") [+]?)э","/$1е");
        word = word.replaceAll("( ("+SOFT_SONAR+") [+]?)а","/$1я");
        word = word.replaceAll("( ("+SOFT_SONAR+") [+]?)о","/$1ё");
        word = word.replaceAll("( ("+SOFT_SONAR+") [+]?)у","/$1ю");

        word = word.replaceAll("(^ )[ао]","$1a");	//+
        word = word.replaceAll(" о о "," a ");	// соображать
        //-------------- Первая степень редукции --------------
        word = word.replaceAll(" (zh|sh) [о](( ("+ALL_SONAR+"))* \\+("+STARTSYL+"))"," $1 y$2");	// I - жЕлтели
        word = word.replaceAll(" [ао](( ("+ALL_SONAR+"))* \\+("+STARTSYL+"))"," a$1");		    // V - зАвод
        //-------------- Первая степень редукции --------------

        //-------------- Вторая степень редукции --------------
        word = word.replaceAll(" [а]"," ay");	// @ - мОлоко
        word = word.replaceAll(" [о]"," ay");	// @ - мОлоко

        word = word.replaceAll(" [у]"," u");		// U - Укол

        word = word.replaceAll(" [и]"," i");	// $ - тЕперь
        word = word.replaceAll(" [е]"," i");	// $ - тЕперь
        word = word.replaceAll(" [я]"," i");	// $ - тЕперь

        word = word.replaceAll(" [ы]"," y");	// I - Этажи
        word = word.replaceAll(" [э]"," y");	// I - Этажи

        word = word.replaceAll(" [ю]"," uj");	// Y - новуЮ
        //-------------- Вторая степень редукции --------------

        // типовая замена ударных гласных
        word = word.replaceAll("\\+а","aa");
        word = word.replaceAll("\\+ы","yy");
        word = word.replaceAll("\\+о","oo");
        word = word.replaceAll("\\+у","uu");
        word = word.replaceAll("\\+э","ee");
        word = word.replaceAll("\\+и","ii");
        word = word.replaceAll("[\\+]?ё","jo");
        word = word.replaceAll("\\+е","je");
        word = word.replaceAll("\\+я","ja");
        word = word.replaceAll("\\+ю","ju");

        // Спецзамена
        word = word.replaceAll("А","a");

        word = word.replaceAll(" ъ","");
        word = word.replaceAll(" ь","");
        word = word.replaceAll("\\+","");
        word = word.replaceAll("^ ","");
        word = word.replaceAll(" $","");
        word = word.replaceAll("^(/ )","");
        word = word.replaceAll("/ "," ");
        return word;
    }
}
