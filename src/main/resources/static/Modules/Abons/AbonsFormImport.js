import {AbonsFormDownloadFile} from "./AbonsFormDownloadFile.js";

export class AbonsFormImport extends FormView {
    constructor() {
        super();
        this.FileSource = null;
        this.options = {AddMode:true};
    }

    /**
     * Показать форму фильтр
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/Abons/AbonsFormImport"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wAbonsFormImport_Module_Abons", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wAbonsFormImport);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wAbonsFormImport.window("close")}});//Обработка события нажатия на кнопку отмены

        this.btnHelp.linkbutton({onClick: this.btnHelp_onClick.bind(this)});

        if (this.options.editMode){ //есть права
            this.btnOk.linkbutton({disabled: false});
            this.fbPath.filebox({disabled: false});
            this.options.AddMode = true;
        }

        this.fbPath.filebox({onChange: this.fbPath_Change.bind(this)});
        $('#fbPath_Module_Abons_AbonsFormImport').nextAll().hover(function(){
            this.ShowToolTip('#divPath_Module_Abons_AbonsFormImport', "", {icon: 'icon-tip',title: 'Кнопка "Выбрать файл"',delay: 5000});
        }.bind(this));
    }


    /**
     * Событие изменения данных файлбокса (при выборе локального файла)
     */
    fbPath_Change(value){
        let files = this.fbPath.filebox('files');
        if(files.length > 0) {
            this.FileSource = files[0];
            this.txPath.textbox('setText', this.FileSource.name);
        }
    }




    btnOk_onClick(){
        if(this.FileSource == null || this.txPath.textbox("getText").trim().length == 0) {
            this.ShowToolTip("#divPath_Module_Abons_AbonsFormImport",
                "Отсутствует файл для добавления абонентов.",
                {title:'Ошибка', delay:3000});
            return;
        }

        let reader = new FileReader();
        reader.readAsText(this.FileSource);

        reader.onload = async ()=>{
            try {
                let listAbon = await this.s_postCTRF('/Abons/readerResult', {result: reader.result});

                if(listAbon[0].errorMessage.length > 0){
                    this.FileSource = null;
                    this.txPath.textbox('setText', '');
                    this.ShowError(listAbon[0].errorMessage);
                    return;
                }

                let paramsImport = {
                    delPhone: this.cbDelPhone.checkbox('options').checked,
                    delMobile: this.cbDelMobile.checkbox('options').checked,
                    delSms: this.cbDelSms.checkbox('options').checked,
                    delEmail: this.cbDelEmail.checkbox('options').checked,
                    delGroups: this.cbDelGroups.checkbox('options').checked
                };

                let form = new AbonsFormDownloadFile();
                form.SetResultFunc((ready) => {
                    if(ready){
                        this.ResultFunc();
                        this.wAbonsFormImport.window("close");
                    }
                });
                form.Show(listAbon, paramsImport);
            } catch (e) {
                this.ShowErrorResponse(e);
            }
        }


        reader.onerror = function() {

            //this.ShowError(reader.error);
            console.log(reader.error);
        };
    }



    btnHelp_onClick(){
        // let message = `Формат файла импорта абонентов\n` +
        //     `\n` +
        //     `В файле значения разделяются запятыми.\n` +
        //     `\n` +
        //     `--------------------------------------------------------------------------------\n` +
        //     `0            \t\t1  \t2       \t3    \t4        \t5         \t6                \t7       \t8    \n` +
        //     `--------------------------------------------------------------------------------\n` +
        //     `СНИЛС        \t\tП  \tФамилия \tИмя  \tОтчество \tГородские, \tМобильные и SMS, \tEmail , \tГруппы\n` +
        //     `--------------------------------------------------------------------------------\n` +
        //     `11145678900, 1 ,Иванов ,Иван,Иванович,101;t102 , 072-105;072-106, a@b.ru, Gr1;Gr2\n` +
        //     `22245678900, 2 ,Петров ,Петр,Иванович,101;102  , 072-105;072-106, a@b.ru, Gr1;Gr2\n` +
        //     `33345678900,   ,Сидоров,Петр,Иванович,101;102  , 072-105;072-106, a@b.ru, Gr1;Gr2\n` +
        //     `--------------------------------------------------------------------------------\n` +
        //     `Файл состоит из значений, разделенными запятыми:\n` +
        //     `\tСНИЛС – СНИЛС.\n` +
        //     `\tП – приоритет абонента, приоритет 1 выше, чем приоритет 2 и т.д., пустое значение – самый низший \n` +
        //     `Приоритет.\n` +
        //     `\tФ,И,О – фамилия имя отчество, разделенные запятыми.\n` +
        //     `\tГородские – список городских телефонов в порядке важности, разделенные точкой с запятой. Если \n` +
        //     `городской телефон поддерживает тоновый набор (DTMF), то перед номером, без пробелов, \n` +
        //     "указывается буква t. Отсутствие телефонов – null.\n" +
        //     "\tМобильные и SMS– список мобильных телефонов в порядке важности, разделенные точкой с \n" +
        //     "запятой. Отсутствие телефонов – null.\n" +
        //     "\tEmail - список Email адресов в порядке важности, разделенные точкой с запятой. Отсутствие адресов \n" +
        //     "– null. \n" +
        //     "\tГруппы – список групп, в которые входит абонент, разделенные точкой с запятой. Если абонент не \n" +
        //     "принадлежит ни к одной из групп, то группа указывается как null.\n" +
        //     "\n" +
        //     "Поля «Городские»,\t«Мобильные», «Email», «Группы» в свою очередь представляют списки, разделенные точкой с запятой.\n" +
        //     "\n" +
        //     "Перед закачкой файла должны быть выполнены следующие проверки:\n" +
        //     "1.\tКаждая строка должна содержать 9 элементов (СНИЛС, приоритет, фамилия . . ., группы абонента).\n" +
        //     "2.\tВ файле поле СНИЛС должно быть уникальным.\n" +
        //     "3.\tПоле СНИЛС должно быть длиной 11 символов.\n" +
        //     "4.\tПоле Приоритет должно содержать число или пустое значение.\n" +
        //     "5.\tПоля Фамилия, Имя, Отчество должны быть заполнены.\n" +
        //     "6.\tВ списках городских, мобильных телефонов, EMail адресов и групп абонента:\n" +
        //     "\t•не должно быть дубликатов;\n" +
        //     "\t•элементы списков должны быть значащими (не пустые).\n" +
        //     "7.\tВ списке групп абонента не должно быть групп, отсутствующих в БД.\n";
        //
        //
        // alert(message);
    }


}