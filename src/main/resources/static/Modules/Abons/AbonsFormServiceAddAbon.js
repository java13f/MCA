import {StartModalModule as AbonListStartModalModule} from "../AbonList/AbonList.js";

export class AbonsFormServiceAddAbon extends FormView {
    constructor() {
        super();

        this.listAbon = []; //список абонентов
        this.row = {}; //получаем при редактировании записи
        this.abonId = ""; //получаем из внешнего справочника
        this.contact = {}; //получаем при выборе данных в combobox
    }

    /**
     * Показать форму фильтр
     * @param options
     * @constructor
     */
    Show(options, listAbon, row) {
        LoadForm("#ModalWindows", this.GetUrl("/Abons/AbonsFormServiceAddAbon"), this.InitFunc.bind(this));
        this.options = options;
        this.listAbon = listAbon;
        this.row = row;


    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wAbonsFormServiceAddAbon_Module_Abons", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wAbonsFormServiceAddAbon);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        if (this.options.editMode){
            this.wAbonsFormServiceAddAbon.window({title: "Редактирование записи"});
            this.pbEditMode.attr("class", "icon-editmode");
            this.lAction.html("Введите данные для редактирования текущей записи");
        }

        if ($('#LinkAbonsFormServiceAddAbon_Module_Abons').length === 0) {
            $('head').append('<link id="LinkAbonsFormServiceAddAbon_Module_Abons" rel="stylesheet" type="text/css" href="../css/imgs/abons/abons.css"/>');
        }

        this.btnSelectAbon.linkbutton({onClick: this.btnSelectAbon_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wAbonsFormServiceAddAbon.window("close")}});//Обработка события нажатия на кнопку отмены

        this.cbContact.combobox({onSelect: this.cbContact_onSelect.bind(this)});
        this.cbContact.combobox({
            valueField: 'id',
            textField: 'codeforcmb'
        });

        if(this.options.editMode){
           this.loadData();
        }
    }


    async loadData(){
        try{
            this.btnSelectAbon.linkbutton({disabled:true});
            //В текстовое поле вставляю данные абонента
            this.txAbon.textbox('setText', this.row.abon);
            this.abonId = this.row.abonid;

            //загружаю данные в combobox
            let pins = await this.s_postCTRF('/AbonsService/getPinsAbon', {result: this.row.abonid});
            this.cbContact.combobox({data: pins});

            for (let i=0; i < pins.length; i++){
                //становлюсь на выбранный контакт в combobox
                if (pins[i].id == this.row.pinid){
                    this.cbContact.combobox("setValue", pins[i].id);
                }
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }


    /**
     * Выбор абонента из списка
     */
    btnSelectAbon_onClick() {
        try {
            AbonListStartModalModule("", async (RecId) => {

                if (RecId.trim().length == 0) {
                    return;
                }

                this.abonId = RecId;

                let abonName = await this.s_postCTRF('/AbonsService/getAbonById', {result: this.abonId});
                this.txAbon.textbox('setText', abonName);

                let pins = await this.s_postCTRF('/AbonsService/getPinsAbon', {result: this.abonId});
                this.cbContact.combobox({data: pins});
            });

        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }



    cbContact_onSelect(record){
        this.contact.pinid = record.id;
        this.contact.code_view = record.code_view;
        this.contact.is_has_dtmf = record.is_has_dtmf;
    }


    btnOk_onClick(){
        if( this.txAbon.textbox('getText').trim().length == 0 || this.abonId.length == 0 ){
            this.ShowToolTip('#divAbon_Module_Abons_AbonsFormServiceAddAbon', 'Выберите пожалуйста абонента.');
            return;
        }

        if( this.cbContact.combobox('getText').trim().length == 0 || this.contact.pinid.length == 0 ){
            this.ShowToolTip('#divContact_Module_Abons_AbonsFormServiceAddAbon', 'Выберите пожалуйста контакт абонента.');
            return;
        }

        //Проверка есть ли выбраный абонент и контакт уже в списке
        if(this.listAbon.length > 0){
            let someAbon = this.listAbon.filter(item => item.abonid == this.abonId && item.pinid == this.contact.pinid);
            if (someAbon.length > 0) {
                this.ShowWarning("Абонент "+ this.txAbon.textbox('getText') +"\n с контактом " + this.contact.code_view + " уже присутствует.");
                return;
            }
        }

        if(this.options.AddMode){ //Добавление абонента
            let obj = {
                abonid: this.abonId,
                abon: this.txAbon.textbox('getText').trim(),
                pinid: this.contact.pinid,
                phone: this.contact.code_view.trim(),
                is_has_dtmf: this.contact.is_has_dtmf
            };

            this.listAbon.push(obj);
        } else if (this.options.editMode){
            this.row.pinid = this.contact.pinid;
            this.row.phone = this.contact.code_view;
            this.row.is_has_dtmf = this.contact.is_has_dtmf;
        }


        this.ResultFunc();
        this.wAbonsFormServiceAddAbon.window("close");
    }

}