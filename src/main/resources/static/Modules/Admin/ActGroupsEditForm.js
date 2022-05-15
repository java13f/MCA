import {GroupFormSelect} from "./Directories/GroupFormSelect.js";
import {ActFormSelect} from "./Directories/ActFormSelect.js";

export class ActGroupsEditForm extends FormView{
    constructor() {
        super();
        this.GroupId = "";
        this.ActId = "";
    }
    Show(options){
        this.options = options;
        if(this.options.AddMode){
            this.GroupId = this.options.GroupId;
            this.AppId = this.options.AppId;
            this.ActId = this.options.ActId;
        }
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/ActGroupsEditForm"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wActGroupsEdit_Module_Admin", "");
        this.InitCloseEvents(this.wActGroupsEdit);
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wActGroupsEdit.window("close");}});
        this.txGroup.textbox({onClickButton:this.txGroup_onClickButton.bind(this)});
        this.txAct.textbox({onClickButton: this.txAct_onClickButton.bind(this)});
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wActGroupsEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadGroup();
            this.LoadAct();
        }
        else{
            this.pbEditMode.attr("class", "icon-editmode");
            this.wActGroupsEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadActGroups();
        }
    }

    /**
     * Загрузка привязки действия к группе
     */
    LoadActGroups(){
        $.ajax({
            method:"post",
            data: {id: this.options.uuid},
            url: this.GetUrl('/AdminGroups/GetActGroup'),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.GroupId = data.groupId;
                this.ActId = data.actId;
                this.txId.textbox("setText", data.id);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadGroup();
                this.LoadAct();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    /**
     * Загрузка группы
     */
    LoadGroup(){
        $.ajax({
            method:"post",
            data: {id:this.GroupId},
            url: this.GetUrl('/AdminGroups/GetGroupSel'),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.txGroup.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
    /**
     * Загрузка действия
     */
    LoadAct(){
        $.ajax({
            method:"post",
            data: {id:this.ActId},
            url: this.GetUrl('/AdminActs/GetActSel'),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.txAct.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
    /**
     * Обработка сохранения записи
     */
    btnOk_onClick(){
        let Id = this.txId.textbox("getText");

        let json = {id: Id, groupId: this.GroupId, actId:this.ActId};
        this.ExistActGroups(json);
        return false;
    }

    /**
     * Проверка существование действия в группе
     * @param json - модель привязки действия к группе
     */
    ExistActGroups(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/ExistsActInGroup?id=' + json.id.toString()
                +"&groupId=" + json.groupId.toString()
                +"&actId=" + json.actId.toString()),
            success: function(data){
                if(data){
                    this.ShowError("Данное действие уже существует в данной группе")
                }
                else {
                    this.Save(json);
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
    /**
     * Продолжение сохранения действия в группе
     * @param object - модель привязки действия к группе
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminGroups/SaveActGroups'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wActGroupsEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    /**
     * Открыть форму выбора группы
     */
    txGroup_onClickButton(){
        let form = new GroupFormSelect()
        form.SetResultFunc(((RecId)=>{ this.GroupId = RecId; this.LoadGroup(); }).bind(this));
        form.Show();
    }
    /**
     * Открыть форму выбора действия
     */
    txAct_onClickButton(){
        let form = new ActFormSelect()
        form.SetResultFunc(((ActId)=>{this.ActId = ActId;this.LoadAct();}).bind(this));
        form.Show();
    }
}