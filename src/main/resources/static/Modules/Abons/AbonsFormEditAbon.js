import {AbonsFormEditContact} from "./AbonsFormEditContact.js";

export class AbonsFormEditAbon extends FormView {
    constructor() {
        super();
        this.options = {};
        this.Abon = {};

        this.PinIndex = 0;
        this.PinItemId = -1;

        this.isShowDelAbon = false;
        this.delFilter = [{ field:'del', op:'less', value: 1 }];
    }

    /**
     * Показать форму добавления/изменения карточки абонента
     * @param options
     * @constructor
     */
    Show(options){
        this.options = options; //JSON - объект с параметрами
        this.Abon.id = options.uuid;
        LoadForm("#ModalWindows", this.GetUrl("/Abons/AbonsFormEditAbon"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wAbonsFormEditAbon_Module_Abons", ""); //Автоматическое получение идентификаторов формы

        AddKeyboardNavigationForGrid(this.dgContact);
        LoaderCSRFDataForGrid(this.dgContact);

        this.dgContact.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onSelect: this.dgContact_onSelect.bind(this),
            rowStyler: this.dgContact_rowStyler.bind(this)
        });

        this.dgContact.datagrid('getColumnOption', 'is_has_dtmf').formatter = ((val, row)=> {
             return val === 1 ? 'да' : 'нет';
        }).bind(this);

        this.InitCloseEvents(this.wAbonsFormEditAbon);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wAbonsFormEditAbon.window("close")}});//Обработка события нажатия на кнопку отмены
        this.btnDeleteContact.linkbutton({onClick: this.btnDeleteContact_onClick.bind(this)});
        this.btnAddContact.linkbutton({onClick: this.btnAddContact_onClick.bind(this)});
        this.btnChangeContact.linkbutton({onClick: this.btnChangeContact_onClick.bind(this)});
        this.btnClearPriority.linkbutton({onClick: ()=>{this.txPriority.textbox('setValue', '')}});

        $('#txSnils_Module_Abons_AbonsFormEditAbon').maskedbox({});
        $('#txSnils_Module_Abons_AbonsFormEditAbon').removeClass("easyui-textbox").addClass("easyui-maskedbox maskedbox-f");
        this.txSnils.maskedbox({mask: '999-999-999 99'});

        this.txSurname.textbox("textbox").attr("maxlength", "64");
        this.txName.textbox("textbox").attr("maxlength", "64");
        this.txOname.textbox("textbox").attr("maxlength", "64");

        $('#txPriority_Module_Abons_AbonsFormEditAbon').numberbox({});
        $('#txPriority_Module_Abons_AbonsFormEditAbon').removeClass("easyui-textbox").addClass("easyui-numberbox numberbox-f");

        if (this.options.AddMode){ //Добавление
             this.pbEditMode.attr("class", "icon-addmode");
             this.lAction.html("Добавление данных по абоненту");
             this.btnOk.linkbutton({disabled: false});

             this.Abon.pins = [];
        }
        else { //Редактирование
             this.pbEditMode.attr("class", "icon-editmode");
             this.lAction.html("Редактирование данных по абоненту");

             if (this.options.editMode) { //editMode: true - запсь открыта на редактирование, false - запись открыта на просмотр. Данная насройка нужна только для изменения или просмотра записи
                 this.btnOk.linkbutton({disabled: false});
             } else { //Просмотр
                 this.btnOk.linkbutton({disabled: true});
                 this.btnDeleteContact.linkbutton({disabled: true});
                 this.btnAddContact.linkbutton({disabled: true});
                 this.btnChangeContact.linkbutton({disabled: true});

                 let title = 'Просмотр записи';
                 this.wAbonsFormEditAbon.window({title: title});
                 this.lAction.html(title);
             }

            this.cbShowDel.checkbox({onChange: function (state) {
                    this.isShowDelAbon = state;
                    this.updatePins();
                }.bind(this)
            });


             this.LoadDataAbon(this.Abon.id);
        }
    }


    /**
     * Получение данных абонента по ид
     * @param id
     * @constructor
     */
    LoadDataAbon(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Abons/GetAbonFromId'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(data != null) {
                    this.Abon = data;
                    this.setItemId(this.Abon);

                    this.txId.textbox('setValue', this.Abon.id);

                    this.txSnils.maskedbox('setValue', this.Abon.snils );

                    this.txSurname.textbox('setValue', this.Abon.fam);
                    this.txName.textbox('setValue', this.Abon.ima);
                    this.txOname.textbox('setValue', this.Abon.otch);
                    this.txPriority.textbox('setValue', this.Abon.prior);

                    this.txCreated.textbox('setValue', this.Abon.created);
                    this.txCreator.textbox('setValue', this.Abon.creator);
                    this.txChanged.textbox('setValue', this.Abon.changed);
                    this.txChanger.textbox('setValue', this.Abon.changer);

                    this.updatePins();
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }


    async setItemId(abon){
        if(abon.pins.length == 0) {return;}

        try{
            for(let i = 0; i < abon.pins.length; i++) {
                abon.pins[i].itemId = await this.getUUID();
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }



    }



    getUUID() {
        return  $.ajax({
                method: "GET",
                url: this.GetUrl('/CoreUtils/GetUUID'),
            });
    }




    updatePins() {
        this.dgContact.datagrid('unselectAll');
        if (!this.isShowDelAbon) {
            $('#dgContact_Module_Abons_AbonsFormEditAbon').datagrid({filterRules: this.delFilter}).datagrid('enableFilter');
        } else {
            $('#dgContact_Module_Abons_AbonsFormEditAbon').datagrid('disableFilter');
        }
        this.dgContact.datagrid({data: this.Abon.pins.sort( (a,b)=> a.no - b.no )});


        let rowsCount = this.dgContact.datagrid('getRows').length;
        if ( rowsCount > 0 ) {
            if (this.PinItemId != -1) {
                this.dgContact.datagrid("selectRecord", this.PinItemId); //если сохранённы идентификатор отличается от значения по кмолчанию, то заставляем грид установить курсор на запись с данным идентификатором

            } else {//иначе устанавливаем курсор согласно сохранённому положению курсору
                if (this.PinIndex >= 0 && this.PinIndex < rowsCount) {
                    this.dgContact.datagrid("selectRow", this.PinIndex);
                } else if (rowsCount > 0) {
                    this.dgContact.datagrid("selectRow", rowsCount - 1);
                }
            }
            //возвращаем значения по умолчанию
            this.PinItemId = -1;
            this.PinIndex = 0;
        }
    }



    dgContact_rowStyler(index, row) {
        if(row.del == 1) {
            return "background:gray;color:red;";
        }
    }


    dgContact_onSelect(index, row) {
        this.btnDeleteContactChangeText();
    }


    /**
     * Добавление контакта
     */
    btnAddContact_onClick(){
        let result = "";

        let form = new AbonsFormEditContact();
        form.SetResultFunc( (RecId)=>{result = RecId; this.updatePins();} ); //Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show({AddMode: true}, {}, this.Abon.pins);
    }


    /**
     * Изменение контакта
     */
    btnChangeContact_onClick(){
        if(this.dgContact.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения.");
            return;
        }
        let selData = this.dgContact.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения.");
            return;
        }

        if(selData.del == 1){
            this.ShowWarning("Сначала восстановите запись для редактирования.");
            return;
        }

        let form = new AbonsFormEditContact();
        form.SetResultFunc((itemId) => {
            this.PinItemId = itemId;
            this.updatePins();
        });

        form.Show({AddMode: false}, selData, this.Abon.pins);
    }



    btnDeleteContact_onClick() {

        if (this.dgContact.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления.");
            return false;
        }

        let contact = this.dgContact.datagrid('getSelected');

        if (contact == null) {
            this.ShowWarning("Выберите контакт для удаления.");
            return false;
        }

        let itemId = contact.itemId;
        let del = contact.del;
        let header = "Удаление"
        let action = "удалить"
        if (del == 1) {
            header = "Восстановление";
            action = "восстановить";
        }

        $.messager.confirm(header, "Вы действительно хотите " + action + " контакт с №п/п " + contact.no + "?",
            function (result) {
                if (result) {
                    for(let i = 0; i < this.Abon.pins.length; i++) {
                        if(this.Abon.pins[i].itemId === itemId) {
                            this.Abon.pins[i].del = 1 - this.Abon.pins[i].del;
                            this.Abon.pins[i].changing = true;
                            this.updatePins();
                            return;
                        }
                    }
                }
            }.bind(this)
        );
    }





    /**
     * Изменение текста на кнопке "Удалить" для действий
     */
    btnDeleteContactChangeText(){
        this.btnDeleteContact.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        if(this.dgContact.datagrid("getRows").length != 0){
            let selData = this.dgContact.datagrid("getSelected");
            if(selData != null ){
                if(selData.del==1){
                    this.btnDeleteContact.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
            }
        }
    }


    btnOk_onClick(){
        let id = this.txId.textbox("getText").trim();
        //let snils = this.txSnils.textbox("getText").trim();
        let snils = this.txSnils.maskedbox("getText");

        let surname = this.txSurname.textbox("getText").trim();
        let name = this.txName.textbox("getText").trim();
        let oname = this.txOname.textbox("getText").trim();
        let priority = this.txPriority.textbox("getText").trim();

        let resSnils = snils.split(' ').join('').split('-').join('').split('_').join('');
        //snils = snils.replace(/[- _]/g,'');

        if(resSnils.length != 11){
            this.ShowToolTip('#divSnils_Module_Abons_AbonsFormEditAbon','Введите пожалуйста 11-ти значный СНИЛС.');
            return;
        }
        if(surname.length == 0){
            this.ShowToolTip('#divSurname_Module_Abons_AbonsFormEditAbon','Введите пожалуйста фамилию');
            return;
        }
        if(name.length == 0){
            this.ShowToolTip('#divName_Module_Abons_AbonsFormEditAbon','Введите пожалуйста имя');
            return;
        }
        if(oname.length == 0){
            this.ShowToolTip('#divOname_Module_Abons_AbonsFormEditAbon','Введите пожалуйста отчество');
            return;
        }
        if( priority.length>0 && !this.isNumber(priority) ){
            this.ShowToolTip('#divPriority_Module_Abons_AbonsFormEditAbon','Введите целое число.');
            return;
        }
        if(!this.checkPins()){
            this.ShowToolTip('#divAddContact_Module_Abons_AbonsFormEditAbon','Добавьте пожалуйста контакт.');
            return;
        }

        this.Abon.id = id;
        this.Abon.snils = snils;
        this.Abon.fam = surname;
        this.Abon.ima = name;
        this.Abon.otch = oname;
        this.Abon.prior =  priority;

        this.SaveAbon();
    }


    /**
     * Проверка чтоб был хотя бы один не удаленный контакт
     * @returns {boolean} true - успех
     */
    checkPins(){
        if(this.Abon.pins.length == 0) {return false;}

        for(let i = 0; i < this.Abon.pins.length; i++) {
            if(this.Abon.pins[i].del === 0) {
                return true;
            }
        }

        return false;
    }


    /**
     * Проверка челое число или нет.
     * @param num
     * @returns {boolean} true, если num – целое число, иначе false.
     */
    isInteger(num) {
        return (num ^ 0) === num;
    }


    /**
     * Проверка число или нет.
     * @param num
     * @returns {boolean} true - если num число, иначе false.
     */
    isNumber(val) {
        // negative or positive
        return /^[-]?\d+$/.test(val);
    }



    SaveAbon() {
        $.ajax({
            method: "POST",
            data: JSON.stringify(this.Abon),
            url: this.GetUrl('/Abons/SaveAbon'), //Notes/SaveNote
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(this.ResultFunc!=null) {

                    if(data.length == 0){
                        this.ShowWarning("Абонент с СНИЛС " + this.Abon.snils + " уже есть.");
                        return;
                    }

                    this.ResultFunc(data);
                    this.wAbonsFormEditAbon.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }


}