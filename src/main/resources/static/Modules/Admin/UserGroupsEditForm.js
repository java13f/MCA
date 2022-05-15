import {GroupFormSelect} from "./Directories/GroupFormSelect.js";
import {UserFormSelect} from "./Directories/UserFormSelect.js";

export class UserGroupsEditForm extends FormView{
    constructor() {
        super();
        this.GroupId = "";
        this.UserId = "";
    }
    Show(options){
        this.options = options;
        if(this.options.AddMode){
            this.GroupId = this.options.GroupId;
            this.UserId = this.options.UserId;
        }
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/UserGroupsEditForm"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wUserGroupsEdit_Module_Admin", "");
        this.InitCloseEvents(this.wUserGroupsEdit);
        this.wUserGroupsEdit = $("#wUserGroupsEdit_Module_Admin");
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wUserGroupsEdit.window("close");}});
        this.txGroup.textbox({onClickButton:this.txGroup_onClickButton.bind(this)});
        this.txUser.textbox({onClickButton: this.txUser_onClickButton.bind(this)});
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wUserGroupsEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.LoadGroup();
            this.LoadUser();
        }
        else{
            this.pbEditMode.attr("class", "icon-editmode");
            this.wUserGroupsEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadUserGroups();
        }
    }

    /**
     * Загрузка привязки пользователя к группе
     */
    LoadUserGroups(){
        $.ajax({
            method:"post",
            data: {id:this.options.uuid},
            url: this.GetUrl('/AdminGroups/GetUserBinding'),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.GroupId = data.groupId;
                this.UserId = data.userId;
                this.txId.textbox("setText", data.id);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadGroup();
                this.LoadUser();
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
            data:{id: this.GroupId},
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
    LoadUser(){
        $.ajax({
            method:"post",
            url: this.GetUrl('/AdminUsers/GetUserSel?id='+this.UserId),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.txUser.textbox("setText", data);
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
        let json = {id: Id, groupId: this.GroupId, userId: this.UserId};
        this.ExistUserGroups(json);
        return false;
    }

    /**
     * Проверка существование пользователя в группе
     * @param json - модель привязки ползователя к группе
     */
    ExistUserGroups(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/ExistsUserInGroup?id=' + json.id.toString()
                +"&groupId=" + json.groupId.toString() + "&userId=" + json.userId.toString()),
            success: function(data){
                if(data){
                    this.ShowError("Данный пользователь уже существует в данной группе")
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
     * Продолжение сохранения пользователя в группе
     * @param object - модель привязки ползователя к группе
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminGroups/SaveUserInGroup'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wUserGroupsEdit.window("close");
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
        let form = new GroupFormSelect();
        form.SetResultFunc(((RecId)=>{ this.GroupId = RecId; this.LoadGroup(); }).bind(this));
        form.Show();
    }
    /**
     * Открыть форму выбора группы
     */
    txUser_onClickButton(){
        let form = new UserFormSelect()
        form.SetResultFunc(((RecId)=>{ this.UserId = RecId; this.LoadUser(); }).bind(this));
        form.Show();
    }
}