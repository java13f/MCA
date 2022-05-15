export class GrpListFormFilter extends FormView {
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
        LoadForm("#ModalWindows", this.GetUrl("/GrpList/GrpListFormFilter"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wGrpListFormFilter_Module_GrpList", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wGrpListFormFilter);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wGrpListFormFilter.window("close")}});//Обработка события нажатия на кнопку отмены

        this.btnClearCode.linkbutton({onClick:this.btnClearCode_onClick.bind(this)});
        this.btnClearName.linkbutton({onClick:this.btnClearName_onClick.bind(this)});

        this.btnClearAll.linkbutton({onClick:this.btnClearAll_onClick.bind(this)});

        this.txCode.textbox('setText', this.sourceFilter.code);
        this.txName.textbox('setText', this.sourceFilter.name);
    }



    btnOk_onClick(){

        this.sourceFilter.code = this.txCode.textbox('getText');
        this.sourceFilter.name = this.txName.textbox('getText');

        if (this.ResultFunc != null) {
            this.ResultFunc();
            this.wGrpListFormFilter.window("close")
        }
    }


    btnClearCode_onClick(){
        this.txCode.textbox('setValue', '');
    }

    btnClearName_onClick(){
        this.txName.textbox('setValue', '');
    }


    btnClearAll_onClick(){
        this.txCode.textbox('setValue', '');
        this.txName.textbox('setValue', '');
    }


}