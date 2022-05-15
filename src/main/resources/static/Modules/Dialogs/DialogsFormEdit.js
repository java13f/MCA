import {StartModalModule as VocStartModalModule} from "../Voc/Voc.js";

export class DialogsFormEdit extends FormView {
    constructor() {
        super();
        this.DialogInfo = null;
        this.SelectedVoc = null;
    }

    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Dialogs/DialogsFormEdit"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wDialogsFormEdit_Module_Dialogs", "");
        let bCloseByEnter = false;
        if(this.options.AddMode || this.options.editMode)
            bCloseByEnter = true;
        this.InitCloseEvents(this.wDialogsFormEdit, bCloseByEnter);
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wDialogsFormEdit.window("close")}});
        this.btnVocs.linkbutton({onClick: this.btnVocs_onClick.bind(this)});

        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");

            this.lAction.html("Добавление нового диалога оповещения");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");

            this.lAction.html("Редактирование диалога оповещения");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.GetDialogInfo(this.options.uuid);
        }
    }

    btnVocs_onClick() {
        try {
            VocStartModalModule({}, (RecId)=>{
                let id = RecId.id;
                this.GetVocsInfo(id);
            });
        } catch (e) {
            this.ShowError(e);
        }
    }

    async GetVocsInfo(id) {
        try {
            this.SelectedVoc = await this.s_postCTRF('/Dialogs/GetVocsInfo', {id: id});
            this.txVocName.textbox("setText", this.SelectedVoc.name);
        } catch(ex) {
            this.ShowErrorResponse(ex);
        }
    }

    /**
     * Загрузка информации диолога оповещения на форму
     * @constructor
     */
    async LoadDialogInfo(dialogInfo){
        try{
            this.txId.textbox("setText", dialogInfo.id);
            this.txPercent.textbox("setText", dialogInfo.perc);
            this.txName.textbox("setText", dialogInfo.name);
            this.txVocName.textbox("setText", dialogInfo.voc_name);
            this.txCreator.textbox("setText", dialogInfo.creator);
            this.txChanger.textbox("setText", dialogInfo.changer);
            this.txChanged.textbox("setText", dialogInfo.changed);
            this.txCreated.textbox("setText", dialogInfo.created);
            this.DialogInfo = dialogInfo;
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
    GetDialogInfo(id){
        return this.a_postCTRF("/Dialogs/GetDialogInfo", {id: id}, this.LoadDialogInfo.bind(this));
    }

    async btnOk_onClick(){
        let id = this.txId.textbox("getText").length > 0 ? this.txId.textbox("getText") : -1;
        let perc = this.txPercent.textbox("getText");
        let name = this.txName.textbox("getText");
        let voc_name = this.txVocName.textbox("getText");

        if(perc.length == 0){
            this.ShowToolTip(this.toolTiptxPercent, "Введите пожалуйста \"Продолжительность\"",
                {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
            return;
        }

        if(perc.length > 3){
            this.ShowToolTip(this.toolTiptxPercent, "\"Продолжительность\" не может состоять более чем из трёх цифр",
                {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
            return;
        }

        let regex = /^\d{1,3}$/;
        if(!regex.test(perc)){
            this.ShowToolTip(this.toolTiptxPercent, "\"Продолжительность\" должна состоять только из целых чисел в диапазоне от 0 до 100 (включительно)",
                {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
            return;
        }

        let intPerc = Number.parseInt(perc);
        if(intPerc < 0 || intPerc > 100){
            this.ShowToolTip(this.toolTiptxPercent, "\"Продолжительность\" должна быть в диапазоне от 0 до 100 (включительно)",
                {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
            return;
        }

        if (!this.btnVocs.linkbutton('options').disabled && voc_name.length == 0 && this.SelectedVoc == null && this.DialogInfo.link_type_code == "phone") {
            this.ShowToolTip(this.toolTipbtnVocs, "Выберите пожалуйста словарь",
                {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
            return;
        }


        let obj = { id: id, perc: perc, name: name, dlg_all_id: this.DialogInfo.dlg_all_id, voc_id: this.SelectedVoc.id };
        try {
            let newId = await this.s_postCTRF("/Dialogs/SaveDialog", obj); // Сохранение диалога
            if(this.ResultFunc != null){
                this.ResultFunc(newId);
            }
            this.wDialogsFormEdit.window("close");
        }
        catch(err){
            this.ShowErrorResponse(err);
        }

        return false;
    }
}