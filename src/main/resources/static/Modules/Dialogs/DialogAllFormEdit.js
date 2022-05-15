export class DialogAllFormEdit extends FormView {
    constructor() {
        super();
    }

    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Dialogs/DialogAllFormEdit"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wDialogAllFormEdit_Module_Dialogs", "");
        let bCloseByEnter = false;
        if(this.options.AddMode || this.options.editMode)
            bCloseByEnter = true;
        this.InitCloseEvents(this.wDialogAllFormEdit, bCloseByEnter);
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wDialogAllFormEdit.window("close")}});

        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");

            this.lAction.html("Добавление нового диалога");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");

            this.lAction.html("Редактирование диалога");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.GetDialogAllInfo(this.options.uuid);
        }
    }

    /**
     * Загрузка информации на форму
     * @constructor
     */
    async LoadDialogAllInfo(dialogInfo){
        try{
            this.txId.textbox("setText", dialogInfo.id);
            this.txCode.textbox("setText", dialogInfo.code);
            this.txName.textbox("setText", dialogInfo.name);
            this.txCreator.textbox("setText", dialogInfo.creator);
            this.txChanger.textbox("setText", dialogInfo.changer);
            this.txChanged.textbox("setText", dialogInfo.changed);
            this.txCreated.textbox("setText", dialogInfo.created);
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
    GetDialogAllInfo(id){
        return this.a_postCTRF("/Dialogs/GetDialogAllInfo", {id: id}, this.LoadDialogAllInfo.bind(this));
    }


    async btnOk_onClick(){
        try {
            let id = this.txId.textbox("getText").length > 0 ? this.txId.textbox("getText") : -1;
            let code = this.txCode.textbox("getText");
            let name = this.txName.textbox("getText");

            if (code.length == 0) {
                this.ShowToolTip(this.toolTiptxCode, "Введите пожалуйста \"Код\"",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }

            if (code.length > 8) {
                this.ShowToolTip(this.toolTiptxCode, "Длина \"Код\" не может превышать 8 символов",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }

            let dlgAllUniqueCode = await this.s_postCTRF("/Dialogs/IsDlgAllCodeUnique", {id: id, code: code});
            if (dlgAllUniqueCode == "1") {
                   this.ShowToolTip(this.toolTiptxCode, "Такой \"Код\" уже существует в базе данных",
                       {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                    return;
            }


            if (name.length == 0) {
                this.ShowToolTip(this.toolTiptxName, "Введите пожалуйста \"Наименование\"",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }

            if (name.length > 64) {
                this.ShowToolTip(this.toolTiptxName, "Длина \"Наименования\" не может превышать 64 символа",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }

            let dlgAllName = await this.s_postCTRF("/Dialogs/IsDlgAllNameUnique", {id: id, name: name});
            if (dlgAllName == "1") {
                this.ShowToolTip(this.toolTiptxName, "Такое \"Наименование\" уже существует в базе данных",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }

            let obj = {id: id, code: code, name: name};
            let newId = await this.s_postCTRF("/Dialogs/SaveDialogAll", obj); // Сохранение диалога
            if (this.ResultFunc != null) {
                this.ResultFunc(newId);
            }
            this.wDialogAllFormEdit.window("close");
        }
        catch(err){
            this.ShowErrorResponse(err);
        }

        return false;
    }
}