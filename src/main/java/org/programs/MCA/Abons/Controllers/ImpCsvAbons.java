package org.kaznalnrprograms.MCA.Abons.Controllers;

//import org.apache.commons.lang.math.NumberUtils;
import org.kaznalnrprograms.MCA.Abons.Models.Csv.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

/**
 * Класс для импорта абонентов из csv файла
 */
public class ImpCsvAbons {
    /**
     * Получает модель типа ImpModel
     * @param data
     * @return
     */
    public ImpModel getModel(List<ArrayList<String>> data) {
        ImpModel model = new ImpModel();                     // Создаем пустую модель

        for(int i=0; i<data.size(); i++){
            ArrayList<String> _abon = data.get(i);           // Текущий абонент

            model.getAbons().add(new Abon(_abon.get(0),_abon.get(1), _abon.get(2), _abon.get(3), _abon.get(4)));  // Добавляем абонента

            // Добавляем контакты абонента
            model = addPins(model, _abon, 5, "phone" );  // городские телефоны
            model = addPins(model, _abon, 6, "mobile");  // мобильные телефоны
            model = addPins(model, _abon, 6, "SMS"   );  // SMS
            model = addPins(model, _abon, 7, "EMail" );  // EMail


            if(!_abon.get(8).toLowerCase().trim().equals("null")) {                                // Добавляем группы абонента (без группы null)
                ArrayList<String> grps = this.ParseCSV(_abon.get(8), ";").get(0);             // список групп
                for (Integer j = 0; j < grps.size(); j++) {
                    model.getAbonGrps().add(new AbonGrp(_abon.get(0), grps.get(j)));                   // добавляем СНИЛС и группу
                }
            }
        }

        return model;
    }

    /**
     * Вставляет в модель ImpModel model список контоктов contactNo
     * @param model - исходная модель
     * @param _abon - список полей абонента
     * @param contactNo - номер контакта 5 - городские, 6 - мобильные и смс, 7 - EMail
     * @return - модель со вставкой
     */
    private ImpModel addPins(ImpModel model, ArrayList<String> _abon, int contactNo, String _switch_type_code) {
        ArrayList<String> contacts = this.ParseCSV(_abon.get(contactNo),";").get(0);                     // список контактов

        if(contacts.size()==1 && contacts.get(0).trim().toLowerCase().equals("null"))
            return model;

        for(Integer j=0; j<contacts.size(); j++) {
            String curContact = contacts.get(j).trim();                                                             // текущий контакт

            String is_has_dtmf = "0";
            if(_switch_type_code.equals("mobile")) is_has_dtmf="1";                                               // dtmf у мобильных есть

            if(curContact.substring(0,1).toLowerCase().equals("t")&&_switch_type_code.equals("phone")) {          // dtmf есть, если перед номером у городских тел. стоит буква t
                is_has_dtmf="1";
                curContact = curContact.substring(1);
            }

            model.getPins().add(new Pin(_abon.get(0), _switch_type_code, curContact, j.toString(), is_has_dtmf, ""));
        }
        return model;
    }


    /**
     * Получает содержимое csv файла в виде строки, возвращает объект ArrayList<ArrayList<String>> data
     * @param csv
     * @param delimiter
     * @return
     */
    public ArrayList<ArrayList<String>>  ParseCSV(String csv, String delimiter){

        ArrayList<ArrayList<String>> data = new ArrayList<ArrayList<String>>();

        if(csv.trim().length() == 0){ //если в контактах не указали null
            data.add(new ArrayList<String>());                                              // Добавляем строку файла
            data.get(data.size()-1).add("null");
            return data;
        }

        Scanner scanner = new Scanner(csv);
        scanner.useDelimiter(delimiter);

        while(scanner.hasNext())
        {
            String s=scanner.next().trim();
            int enter_pos=s.indexOf("\r\n");

            if( enter_pos ==-1) {
                if(data.size()==0) {
                    data.add(new ArrayList<String>());                                          // Добавляем строку файла
                }
                data.get(data.size()-1).add(s);                                                 // Добавляем "Элемент строки"
            }
            else {                                                                              // Встретился \r\n - значит s имеет вид: "Последний элемент строки"\r\n"Первый элемент следующей строки"
                data.get(data.size()-1).add(s.substring(0, enter_pos).trim());                  // Добавляем "Последний эленмент строки"
                s=s.substring(enter_pos+2).trim();                                              // присваиваем s "Перый элемент строки"
                if(s.length()==0||s.substring(0,1).equals("\r")||s.substring(0,1).equals("\n")) // Встречена строка с пустым "Первым элементом" или \r - считаем это концом данных
                    break;
                data.add(new ArrayList<String>());                                              // Добавляем строку файла
                data.get(data.size()-1).add(s);                                                 // Добавляем "Первый элемент следующей строки"
            }
        }
        scanner.close();
        return data;
    }





    /**
     * Получает содержимое csv файла объекта ArrayList<ArrayList<String>> data,
     * проверяет корректность данных,
     * возвращает сообщение об ошибке или пустую строку
     */
    public String checkAbons(List<ArrayList<String>> data, List<Grp> grps) {

        // Проверка списка абонентов
        if(data.stream().filter(x->x.size()!=9).count()!=0){
            return "Cтрока не содержит 9 элементов (8 запятых). СНИЛС: "+data.stream().filter(x->x.size()!=9).findFirst().get().get(0);
        }

        //Проверка дубликатов по СНИЛС
        final String[] a = {""};
        var grp = data.stream().collect(Collectors.groupingBy(x->x.get(0)));   // Получаем список словарь СНИЛС=к-во повторений
        if(grp.size() != data.size()) {                                        // есть на дубликаты?
            var dublList = grp.values().stream().filter(x->x.size()!=1);     // Список с дубликатами
            dublList.forEach(x-> a[0] +=x.get(0).get(0)+", " );              // Получаем в a[0] список повторяющихся СНИЛС
            return "В наборе данных найдены дубликаты по полю СНИЛС: \""
                    +a[0].trim().substring(0,a[0].trim().length()-1)+"\"";
        }

        // Проверка на длину СНИЛС
        var stils_list = data.stream()
                .filter(x->x.get(0).trim().length()!=11)
                .collect(Collectors.groupingBy(x->x.get(0)));
        if(stils_list.size() !=0 )
            return "В наборе данных найдены СНИЛС с длиной, отличной от 11: "+String.join(", ",stils_list.keySet().toArray(CharSequence[]::new));

        //boolean isNumber = filter.getPriority().trim().matches("-?(0|[1-9]\\d*)");
        // Проверка приоритета -> число или ""
        stils_list = data.stream()
                .filter(x-> !( x.get(1).trim().matches("-?(0|[1-9]\\d*)")  || x.get(1).trim().length()==0 )  )
                // .filter(x-> !(NumberUtils.isNumber(x.get(1).trim())  || x.get(1).trim().length()==0)  )
                .collect(Collectors.groupingBy(x->x.get(0)));
        if(stils_list.size() != 0)
            return "СНИЛС с недопустимым приоритетом: "+String.join(", ",stils_list.keySet().toArray(CharSequence[]::new))+". Допускается число или пустое значение.";

        // Проверка заполненности Фамилии
        stils_list = data.stream().filter(x-> x.get(2).trim().length()==0).collect(Collectors.groupingBy(x->x.get(0)));
        if(stils_list.size() != 0)
            return "СНИЛС у которых не заполнено поле Фамилия: "+String.join(", ",stils_list.keySet().toArray(CharSequence[]::new));

        // Проверка заполненности Имени
        stils_list = data.stream().filter(x-> x.get(3).trim().length()==0).collect(Collectors.groupingBy(x->x.get(0)));
        if(stils_list.size() != 0)
            return "СНИЛС у которых не заполнено поле Имя: "+String.join(", ",stils_list.keySet().toArray(CharSequence[]::new));

        // Проверка заполненности Отчества
        stils_list = data.stream().filter(x-> x.get(4).trim().length()==0).collect(Collectors.groupingBy(x->x.get(0)));
        if(stils_list.size() != 0)
            return "СНИЛС у которых не заполнено поле Отчество: "+String.join(", ",stils_list.keySet().toArray(CharSequence[]::new));


        // ------------------------------------------------------------
        // Проверка абонентов
        for(int i=0; i < data.size(); i++){
            // исходние данные
            var abon = data.get(i);
            String r;
            ArrayList<String> town    =ParseCSV(abon.get(5), ";").get(0);
            ArrayList<String> mobil   =ParseCSV(abon.get(6), ";").get(0);
            ArrayList<String> eMail   =ParseCSV(abon.get(7), ";").get(0);
            ArrayList<String> groups  =ParseCSV(abon.get(8), ";").get(0);

            //если не указан городской, мобильный или почта
            if(town.get(0).equals("null") && mobil.get(0).equals("null") && eMail.get(0).equals("null") ){return "У абонента СНИЛС=\""+abon.get(0)+"\" не указано ни одного контакта.";}

            // Проверка незначещих телефонов, мобильных, EMail-ов и групп
            if(town  .stream().filter(x-> getClearNom(x).trim().equals("") && !x.trim().toLowerCase().equals("null")).count()>0)  return "У абонента СНИЛС=\""+abon.get(0)+"\" в перечне городских телефонов найдены незначащие номера";
            if(mobil .stream().filter(x-> getClearNom(x).trim().equals("") && !x.trim().toLowerCase().equals("null")).count()>0)  return "У абонента СНИЛС=\""+abon.get(0)+"\" в перечне мобильных телефонов найдены незначащие номера";
            if(eMail .stream().filter(x->             x .trim().equals(""))                                          .count()>0)  return "У абонента СНИЛС=\""+abon.get(0)+"\" в перечне E-Mail адресов найдены пустые адреса";
            if(groups.stream().filter(x->             x .trim().equals(""))                                          .count()>0)  return "У абонента СНИЛС=\""+abon.get(0)+"\" в перечне групп найдены пустые группы";

            // Проверка дубликатов в
            r = checkNomAsDouble(data.get(i).get(0), town, true, "городских телефонов");  if(r!="") return r;  // городских телефонах
            r = checkNomAsDouble(data.get(i).get(0), mobil, true, "мобильных телефонов"); if(r!="") return r;  // мобильных телефонах
            r = checkNomAsDouble(data.get(i).get(0), eMail, false, "адресов E-Mail");     if(r!="") return r;  // адресах EMail
            r = checkNomAsDouble(data.get(i).get(0), groups, false, "групп абонента");    if(r!="") return r;  // группах абонента

            // список групп абонента, которые отсутствуют в таблице Grps, за исключением null - абонент не вхдит ни в одну группу
            var notInGrps= groups.stream()
                    .filter(z->!z.toLowerCase().equals("null"))
                    .filter(x-> grps.stream().filter(y->y.getCode().equals(x)).count()!=1 )
                    .toArray();
            if(notInGrps.length>0) {
                for (Object k : notInGrps)    r += k+", ";
                r = r.trim().substring(0,r.trim().length()-1); // список групп абонента, которые отсутствуют в таблице Grps в виде строки
                return "У абонента СНИЛС=\""+data.get(i).get(0)+"\" есть группы, которые отсутствуют в БД: "+r;
            }
        }
        return "";
    }



    /**
     * Убирает из номера телефона лишние символы (оставляет только цифры)
     */
//    public String  getClearNom(String nom) {
//        String newNom="";
//        for(int i=0; i<nom.length(); i++){
//            if (NumberUtils.isDigits(nom.substring(i, i+1))) {
//                newNom += nom.substring(i, i+1);
//            }
//        }
//        return  newNom;
//    }

    /**
     * Убирает из номера телефона лишние символы (оставляет только цифры)
     */
    public String  getClearNom(String nom) {
        String newNom="";
        for(int i=0; i<nom.length(); i++){
            if ( nom.substring(i, i+1).matches("-?(0|[1-9]\\d*)")  ) {
                newNom += nom.substring(i, i+1);
            }
        }
        return  newNom;
    }






    /**
     * Проверяет в списке ArrayList<String> nom наличие дубликатов
     * @param snils - СНИЛС для сообщения
     * @param nom   - список номеров телефонов (адресов Email, групп абонента)
     * @param isGetClearNom - оставлять ли в номере телефона только цифры
     * @param typeNom       - тип номера телефона: "городских телефонов", "городских телефонов с тоновым набором", "мобильных телефонов", "адресов E-Mail"
     * @return сообщение об ошибке или ""
     */
    private String  checkNomAsDouble(String snils, ArrayList<String> nom, boolean isGetClearNom, String typeNom) {
        final String[] a = {""};
        var grp1=nom.stream().collect(Collectors.groupingBy(x->getClearNom(x)));          // Получаем список словарь тел=к-во повторений
        if (!isGetClearNom)
            grp1=nom.stream().collect(Collectors.groupingBy(x->x));
        if(grp1.size()!=nom.size()) {
            var dublList = grp1.values().stream().filter(x -> x.size() != 1); // Список с дубликатами
            dublList.forEach(x -> a[0] += (isGetClearNom?  getClearNom(x.get(0))  :x.get(0)) + ", ");                   // Получаем в a[0] список повторяющихся телефонов
            String contacts=a[0];
            contacts=contacts.trim().substring(0, contacts.trim().length() - 1);
            return "В наборе данных для абонента СНИЛС=\""+snils+"\" найдены дубликаты "+typeNom+". Дублируется: \"" + contacts + "\"";
        }
        return  "";
    }


}
