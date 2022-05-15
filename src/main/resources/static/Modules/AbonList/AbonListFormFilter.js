export class AbonListFormFilter extends FormView {
    constructor() {
        super();
        this.sourceFilter = {}; // Копия входящего фильтра
        this.options = {AddMode:true};
    }

    /**
     * Показать форму фильтр
     * @param options
     * @constructor
     */
    Show(filter) {
        this.sourceFilter = filter;
        LoadForm("#ModalWindows", this.GetUrl("/AbonList/AbonListFormFilter"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wAbonListFormFilter_Module_AbonList", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wAbonListFormFilter);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wAbonListFormFilter.window("close")}});//Обработка события нажатия на кнопку отмены

        this.btnClearSnils.linkbutton({onClick:this.btnClearSnils_onClick.bind(this)});
        this.btnClearSurname.linkbutton({onClick:this.btnClearSurname_onClick.bind(this)});
        this.btnClearName.linkbutton({onClick:this.btnClearName_onClick.bind(this)});
        this.btnClearOname.linkbutton({onClick:this.btnClearOname_onClick.bind(this)});

        this.btnPriority.linkbutton({onClick:this.btnPriority_onClick.bind(this)});

        this.btnClearPriority.linkbutton({onClick:this.btnClearPriority_onClick.bind(this)});
        this.btnClearAll.linkbutton({onClick:this.btnClearAll_onClick.bind(this)});

        this.txSnils.textbox('setText', this.sourceFilter.snils);

        this.txSurname.textbox('setText', this.sourceFilter.surname);
        this.txName.textbox('setText', this.sourceFilter.name);
        this.txOname.textbox('setText', this.sourceFilter.oname);

        this.txPriority.numberbox({});
        this.txPriority.numberbox('setText', this.sourceFilter.priority);

    }


    btnPriority_onClick(){
        this.txPriority.textbox('setText', 'null');
    }

    btnOk_onClick(){

        this.sourceFilter.snils = this.txSnils.textbox('getText');
        this.sourceFilter.surname = this.txSurname.textbox('getText');
        this.sourceFilter.name = this.txName.textbox('getText');
        this.sourceFilter.oname = this.txOname.textbox('getText');
        this.sourceFilter.priority = this.txPriority.textbox('getText');

        if (this.ResultFunc != null) {
            this.ResultFunc();
            this.wAbonListFormFilter.window("close")
        }
    }


    btnClearSnils_onClick(){
        this.txSnils.textbox('setValue', '');
    }

    btnClearSurname_onClick(){
        this.txSurname.textbox('setValue', '');
    }

    btnClearName_onClick(){
        this.txName.textbox('setValue', '');
    }

    btnClearOname_onClick(){
        this.txOname.textbox('setValue', '');
    }

    btnClearPriority_onClick(){
        this.txPriority.textbox('setValue', '');
    }

    btnClearAll_onClick(){
        this.txSnils.textbox('setValue', '');
        this.txSurname.textbox('setValue', '');
        this.txName.textbox('setValue', '');
        this.txOname.textbox('setValue', '');
        this.txPriority.textbox('setValue', '');
    }


}