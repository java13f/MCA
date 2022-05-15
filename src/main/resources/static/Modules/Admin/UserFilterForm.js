export class UserFilterForm extends FormView{
    constructor() {
        super();
    }
    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/AdminUsers/UserFilterForm"), this.InitFunc.bind(this));
    }
    InitFunc(){
        this.InitComponents("wUserFilterForm_Module_Admin", "");
        this.InitCloseEvents(this.wUserFilterForm);
        this.btnCancel.linkbutton({onClick:()=>{this.wUserFilterForm.window("close")}});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.txCode.textbox({onClickButton: function(){ this.txCode.textbox("setText", "") }.bind(this)});
        this.txName.textbox({onClickButton: function(){ this.txName.textbox("setText", "") }.bind(this)});
        this.btnClearFilter.linkbutton({onClick: this.btnClearFilter_onClick.bind(this)});

        this.txCode.textbox("setText", this.options.Code);
        this.txName.textbox("setText", this.options.Name);
    }

    /**
     * Полная очистка фильтра
     */
    btnClearFilter_onClick(){
        this.txCode.textbox("setText", "");
        this.txName.textbox("setText", "");
    }
    btnOk_onClick(){
        if(this.ResultFunc!=null){
            let Code = this.txCode.textbox("getText");
            let Name = this.txName.textbox("getText");
            this.ResultFunc({Code:Code, Name: Name});
        }
        this.wUserFilterForm.window("close");
    }
}