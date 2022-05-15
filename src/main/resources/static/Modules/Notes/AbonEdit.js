export class AbonEdit extends FormView {
    constructor() {
        super();
    }

    Show() {
        this.options = {AddMode:true};
        LoadForm("#ModalWindows", this.GetUrl("/Notes/AbonEditForm"), this.InitFunction.bind(this));
    }
    /**
     * Инициализация формы
     */
    InitFunction() {
        this.InitComponents("wAbonEdit_AbonEdit_Module_Notes", "");
        this.InitCloseEvents(this.wAbonEdit);
        this.btnCancel.linkbutton({onClick: function () { this.wAbonEdit.window("close"); }.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        $('#tbPriority_AbonEdit_Module_Notes').textbox('textbox').focus();
    }

    btnOk_onClick() {
        let val = this.tbPriority.textbox('getText').trim();
        if(val.length !== 0 && !(/^[0-9]{1,}$/.test(val))) {
            this.ShowToolTip("#tbPriorityToolTip_AbonEdit_Module_Notes",
                "Приоритет может иметь либо пустое, либо целочисленное значение.",
                {title:'Ошибка', delay:3000});
            return;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc(val);
            this.wAbonEdit.window("close");
        }
    }
}