import {GroupFormSelect} from "./Directories/GroupFormSelect.js";
import {AppFormSelect} from "./Directories/AppFormSelect.js";

export class AppRightsEditForm extends FormView{
    constructor() {
        super();
        this.GroupId = "";
        this.AppId = "";
    }
    Show(options){
        this.options = options;
        if(this.options.AddMode){
            this.GroupId = this.options.GroupId;
            this.AppId = this.options.AppId;
        }
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/AppRightsEditForm"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wAppRightsEdit_Module_Admin", "");
        this.InitCloseEvents(this.wAppRightsEdit);
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wAppRightsEdit.window("close");}});
        this.txGroup.textbox({onClickButton:this.txGroup_onClickButton.bind(this)});
        this.txApp.textbox({onClickButton: this.txApp_onClickButton.bind(this)});

        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wAppRightsEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadGroup();
            this.LoadApp();
        }
        else{
            this.pbEditMode.attr("class", "icon-editmode");
            this.wAppRightsEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadAppRights();
        }
    }

    /**
     * Загрузка привязки приложения к группе
     */
    LoadAppRights(){
        $.ajax({
            method:"post",
            data: {id:this.options.uuid},
            url: this.GetUrl('/AdminGroups/GetAppRights'),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.GroupId = data.groupId;
                this.AppId = data.appId;
                this.txId.textbox("setText", data.id);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadGroup();
                this.LoadApp();
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
     * Загрузка пользователя
     */
    LoadApp(){
        $.ajax({
            method:"post",
            data: {id:this.AppId},
            url: this.GetUrl('/AdminApps/GetAppSel'),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.txApp.textbox("setText", data);
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

        let json = {id: Id, groupId: this.GroupId, appId: this.AppId};
        this.ExistAppRights(json);
        return false;
    }

    /**
     * Проверка существование приложения в группе
     * @param json - модель привязки приложения к группе
     */
    ExistAppRights(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/ExistsAppInGroup?id=' + json.id.toString()
                +"&groupId=" + json.groupId.toString() + "&appId=" + json.appId.toString()),
            success: function(data){
                if(data){
                    this.ShowError("Данное приложение уже существует в данной группе")
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
     * Продолжение сохранения приложения в группе
     * @param object - модель привязки приложения к группе
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminGroups/SaveAppRights'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wAppRightsEdit.window("close");
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
     * Открыть форму выбора группы
     */
    txApp_onClickButton(){
        let form = new AppFormSelect()
        form.SetResultFunc(((RecId)=>{ this.AppId = RecId; this.LoadApp(); }).bind(this));
        form.Show();
    }
}