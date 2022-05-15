export class AbonsFormEditContact extends FormView {
    constructor() {
        super();

        this.Pin = {}; //Контакт для редактирования
        this.allPins = []; //Все контакты абонента

        this.selectTypeCom = {}; //тип коммутации выбранный в combobox
    }

    /**
     * Показать форму добавления/изменения карточки абонента
     * @param options
     * @constructor
     */
    Show(options, selPin, allPins) {
        this.options = options; //JSON - объект с параметрами
        this.options.editMode = true;
        this.Pin = selPin;
        this.allPins = allPins;
        LoadForm("#ModalWindows", this.GetUrl("/Abons/AbonsFormEditContact"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    async InitFunc() {
        this.InitComponents("wAbonsFormEditContact_Module_Abons", ""); //Автоматическое получение идентификаторов формы

        this.InitCloseEvents(this.wAbonsFormEditContact);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wAbonsFormEditContact.window("close")
            }
        });//Обработка события нажатия на кнопку отмены

        // Событие keyup
        this.txCodeView.textbox({
            inputEvents: $.extend({}, this.txCodeView.textbox.defaults.inputEvents, {
                keyup: function (e) {
                    this.txCodeView_onKeyup();
                }.bind(this)
            })
        });

        this.cbTypeCom.combobox({onSelect: this.cbTypeCom_onSelect.bind(this)});

        //$('#txNo_Module_Abons_AbonsFormEditContact').numberbox({});
        //$('#txNo_Module_Abons_AbonsFormEditContact').removeClass("easyui-textbox").addClass("easyui-numberbox numberbox-f");
        this.txNo.numberbox({});


        this.txInfo.textbox("textbox").attr("maxlength", "128");

        let typesCom = [];
        try{
            typesCom = await this.getTypeCom(); //заполнить combobox Тип коммутации
        }
        catch (e) {
            this.ShowErrorResponse(e)
        }

        this.cbTypeCom.combobox({
            valueField: 'id',
            textField: 'name',
            data: typesCom
        });

        if (this.options.AddMode) { //Добавление
            this.pbEditMode.attr("class", "icon-addmode");
            this.lAction.html("Добавление контакта абонента");
            this.btnOk.linkbutton({disabled: false});

            if (this.allPins.length == 0) { //Номер по порядку начинается строго с нуля.
                this.txNo.numberbox('setText', '0');
            } else {
                let nextNo = this.allPins.sort( (a,b)=> a.no - b.no )[this.allPins.length - 1].no + 1;
                this.txNo.numberbox('setText', nextNo);
            }

            this.InitPin(); //Инициализация объекта контакт
        } else { //Редактирование
            this.pbEditMode.attr("class", "icon-editmode");
            this.lAction.html("Редактирование контакта абонента");

            this.btnOk.linkbutton({disabled: false});

            this.LoadDataPins();
        }

    }


    LoadDataPins() {
        this.txId.textbox('setText', this.Pin.id);
        this.txNo.textbox('setText', this.Pin.no);

        this.txCodeView.textbox('setText', this.Pin.codeView);
        this.txCode.textbox('setText', this.Pin.code);
        this.cbTypeCom.combobox('setValue', this.Pin.switchId);


        if (this.Pin.is_has_dtmf === 1) {
            this.cbTon.checkbox('check');
        } else if(this.Pin.is_has_dtmf === 0){
            this.cbTon.checkbox('uncheck');
        }

        this.txInfo.textbox('setText', this.Pin.info);

        this.txCreator.textbox('setText', this.Pin.creator);
        this.txCreated.textbox('setText', this.Pin.created);
        this.txChanger.textbox('setText', this.Pin.changer);
        this.txChanged.textbox('setText', this.Pin.changed);
    }


    txCodeView_onKeyup() {
        this.formatData(this.selectTypeCom);
    }

    cbTypeCom_onSelect(record){
        this.selectTypeCom = record;
        this.formatData(record);

        if(record.code === 'mobile'){
            this.cbTon.checkbox('check');
        }
    }

    async formatData(record){
        let valueTypeCom = record.code;//this.cbTypeCom.combobox('getValue');
        let typeCom = record.name;//this.cbTypeCom.combobox('getText').trim();

        if (valueTypeCom.length == 0 || typeCom.length == 0) { //нужно выбрать тип коммутации
             this.ShowToolTip('#divTypeCom_Module_Abons_AbonsFormEditContact', 'Необходимо выбрать тип коммутации.');
             return;
        }

        let codeView = this.txCodeView.textbox("getText").trim();
        if (valueTypeCom == 'EMail') {
            this.txCode.textbox('setText', codeView.toLowerCase());
        } else { //Получение номера телефона без лишних символов (только цифры)

            let code = "";
            try{
                code = await this.getClearNom(codeView);
            } catch (e) {
                this.ShowErrorResponse(e);
            }

            this.txCode.textbox("setText", code);
        }
    }


    /**
     * Инициализация объекта контакт
     * @constructor
     */
    InitPin() {
        this.Pin.itemId = "";
        this.Pin.id = "";
        this.Pin.no = "";
        this.Pin.typeCom = "";
        this.Pin.switchId = "";
        this.Pin.codeView = "";
        this.Pin.code = "";
        this.Pin.is_has_dtmf = "";
        this.Pin.changing = false;
        this.Pin.info = "";
        this.Pin.del = 0;
        this.Pin.creator = "";
        this.Pin.created = "";
        this.Pin.changer = "";
        this.Pin.changed = "";
    }


    /**
     * Получение номера телефона без лишних символов (только цифры)
     * @param number номер телефона
     * @constructor
     */
    getClearNom(number) {
        return  $.ajax({
                method: "post",
                data: {number: number},
                url: this.GetUrl('/Abons/getClearNom'),
                headers: GetCSRFTokenHeader()
        });
    }


    /**
     * Заполнить Combobox Тип коммутации
     */
    getTypeCom() {
        return $.ajax({
            method: "post",
            url: this.GetUrl('/Abons/getTypeCom'),
            headers: GetCSRFTokenHeader()
        });
    }





    async btnOk_onClick() {

        let id = this.txId.textbox("getText");
        let no = this.txNo.textbox("getText").trim();

        let typeCom = this.cbTypeCom.combobox("getText").trim();
        let switchId = this.cbTypeCom.combobox("getValue"); //this.getSwitchs(this.cbTypeCom.combobox("getValue"), 'id');

        let codeView = this.txCodeView.textbox("getText").trim();
        let code = this.txCode.textbox("getText").trim();
        let is_has_dtmf = this.cbTon.checkbox('options').checked ? 1 : 0;
        let info = this.txInfo.textbox("getText").trim();

        if (no.length == 0) {
            this.ShowToolTip('#divNo_Module_Abons_AbonsFormEditContact', 'Введите пожалуйста № п/п');
            return;
        }
        if (typeCom.length == 0 || switchId.length == 0) {
            this.ShowToolTip('#divTypeCom_Module_Abons_AbonsFormEditContact', 'Выберите пожалуйста коммутацию.');
            return;
        }
        if (codeView.length == 0) {
            this.ShowToolTip('#divCodeView_Module_Abons_AbonsFormEditContact', 'Введите пожалуйста телефон или EMail адрес.');
            return;
        }
        if (code.length == 0) {
            this.ShowToolTip('#divCodeView_Module_Abons_AbonsFormEditContact', 'Вы ввели контакт, который по данной коммутации не является значащим.');
            return;
        }

        //Проверка на уникальность №п/п и присвоение itemId
        let itemId = "";
        if (this.Pin.itemId.length == 0) { //новый контакт
            //Проверка на уникальность №п/п
            let someNum = this.allPins.filter(item => item.no == no);
            if (someNum.length > 0) {
                this.ShowWarning("Контакт с №п/п " + no + " уже присутствует.");
                return;
            }

            try {
                itemId = await this.getUUID();
            }
            catch (e) {
                this.ShowErrorResponse(e);
            }

        } else { //изменение контакта
            let someNum = this.allPins.filter(item => item.no == no && item.itemId != this.Pin.itemId);
            if (someNum.length > 0) {
                this.ShowWarning("Контакт с №п/п " + no + " уже присутствует.");
                return;
            }
            itemId = this.Pin.itemId;
        }

        this.Pin.itemId = itemId;

        this.Pin.no = Number.parseInt(no);
        this.Pin.typeCom = typeCom;
        this.Pin.switchId = switchId;
        this.Pin.codeView = codeView;
        this.Pin.code = code;
        this.Pin.is_has_dtmf = is_has_dtmf; // 1, 0
        this.Pin.changing = true;
        this.Pin.info = info;

        if (this.options.AddMode) { //Добавление нового контакта
            this.allPins.push(this.Pin);
        }

        this.ResultFunc(itemId);
        this.wAbonsFormEditContact.window("close");
    }


    getUUID() {
        return  $.ajax({
                method: "GET",
                url: this.GetUrl('/CoreUtils/GetUUID')
        });
    }




}