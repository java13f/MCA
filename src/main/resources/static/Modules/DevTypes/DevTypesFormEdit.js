export class DevTypesFormEdit extends FormView{
    constructor() {
        super();
    }

    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/DevTypes/DevTypesFormEdit"), this.InitFunc.bind(this));
    }

    async InitFunc() {
        this.InitComponents("wDevTypesFormEdit_Module_DevTypes", "");
        let bCloseByEnter = false;
        if(this.options.AddMode || this.options.editMode)
            bCloseByEnter = true;

        this.lblSaving.hide();
        this.InitCloseEvents(this.wDevTypesFormEdit, bCloseByEnter);
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wDevTypesFormEdit.window("close")}});

        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");

            this.lAction.html("Добавление нового типа устройства");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");

            this.lAction.html("Редактирование типа устройства");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.GetDevType(this.options.uuid);
        }
    }

    /**
     * Загрузка информации о типе устройства на форму
     * @constructor
     */
    async LoadDevType(devType){
        try{
            this.txId.textbox("setText", devType.id);
            this.txCode.textbox("setText", devType.code);
            this.txName.textbox("setText", devType.name);
            this.txPrior.textbox("setText", devType.prior);
            if(devType.is_auto_define == 1) this.chkbAutoDefine.checkbox("check");
            this.txCreator.textbox("setText", devType.creator);
            this.txChanger.textbox("setText", devType.changer);
            this.txChanged.textbox("setText", devType.changed);
            this.txCreated.textbox("setText", devType.created);
        }
        catch(err){
            this.ShowErrorResponse(err);
        }
    }

    /**
     * Получить инфорацию устройства
     * @param id
     * @constructor
     */
    GetDevType(id){
        return this.a_postCTRF("/DevTypes/GetDevType", {id: id}, this.LoadDevType.bind(this));
    }

    async btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let code = this.txCode.textbox("getText");
        let name = this.txName.textbox("getText");
        let prior = this.txPrior.textbox("getText");

        if(code.length == 0){
            this.ShowToolTip(this.toolTiptxCode, "Введите пожалуйста \"Код типа устройства\"");
            return;
        }

        if(code.length > 16){
            this.ShowToolTip(this.toolTiptxCode, "Длина \"Код типа устройства\" не может превышать 16 символов");
            return;
        }

        if(name.length == 0){
            this.ShowToolTip(this.toolTiptxName,"Введите пожалуйста \"Наименование\"");
            return;
        }

        if(name.length > 64){
            this.ShowToolTip(this.toolTiptxName,"Длина \"Наименования\" не может превышать 64 символа");
            return;
        }

        if(prior.length == 0){
            this.ShowToolTip(this.toolTiptxPrior,"Введите пожалуйста \"Приоритет\"");
            return;
        }

        if(!$.isNumeric(prior)){
            this.ShowToolTip(this.toolTiptxPrior, "\"Приоритет\" должен состоять только из целых чисел");
            return;
        }

        let is_auto_define = 0;
        if(this.chkbAutoDefine.checkbox("options").checked) is_auto_define = 1;

        let obj = { id: id, code: code, name: name, prior: prior, is_auto_define: is_auto_define };
        try {
            this.lblSaving.show();
            this.TurnOffFormElements();
            let newId = await this.s_postCTRF("/DevTypes/Save", obj); // Сохранение типа устройства

            this.lblSaving.hide();
            this.TurnOnFormElements();
            if(this.ResultFunc != null){
                this.ResultFunc(newId);
            }
            this.wDevTypesFormEdit.window("close");
        }
        catch(err) {
            this.lblSaving.hide();
            this.TurnOnFormElements();
            this.ShowErrorResponse(err);
        }

        return false;
    }

    TurnOnFormElements() {
        this.wDevTypesFormEdit.window({closable: true});

        if(this.btnOk.linkbutton('options').disabled)
            this.btnOk.linkbutton("enable");

        if(this.btnCancel.linkbutton('options').disabled)
            this.btnCancel.linkbutton("enable");

        if(this.txCode.textbox('options').disabled)
            this.txCode.textbox("enable");

        if(this.txName.textbox('options').disabled)
            this.txName.textbox("enable");

        if(this.txPrior.textbox('options').disabled)
            this.txPrior.textbox("enable");

        if(this.chkbAutoDefine.checkbox('options').disabled)
            this.chkbAutoDefine.checkbox("enable");
    }

    TurnOffFormElements() {
        this.wDevTypesFormEdit.window({closable: false});

        if(!this.btnOk.linkbutton('options').disabled)
            this.btnOk.linkbutton("disable");

        if(!this.btnCancel.linkbutton('options').disabled)
            this.btnCancel.linkbutton("disable");

        if(!this.txCode.textbox('options').disabled)
            this.txCode.textbox("disable");

        if(!this.txName.textbox('options').disabled)
            this.txName.textbox("disable");

        if(!this.txPrior.textbox('options').disabled)
            this.txPrior.textbox("disable");

        if(!this.chkbAutoDefine.checkbox('options').disabled)
            this.chkbAutoDefine.checkbox("disable");
    }

}