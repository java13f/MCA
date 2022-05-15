import {GroupEditForm} from "./GroupEditForm.js";
import {UserFilterForm} from "./UserFilterForm.js";
import {UserEditForm} from "./UserEditForm.js";
import {UserGroupsEditForm} from "./UserGroupsEditForm.js";
import {AppEditForm} from "./AppEditForm.js";
import {AppRightsEditForm} from "./AppRightsEditForm.js";
import {ActEditForm} from "./ActEditForm.js";
import {ActFilterForm} from "./ActFilterForm.js";
import {ActGroupsEditForm} from "./ActGroupsEditForm.js";

class Admin extends FormView {
    constructor() {
        super();
        this.GroupId = "";
        this.GroupIndex = 0;

        this.UserIndex = 0;
        this.UserId = "";

        this.UserGroupsIndex = 0;
        this.UserGroupsId = "";

        this.AppsId = "";

        this.AppRightsId = "";
        this.AppRightsIndex = 0;

        this.ActId = "";
        this.ActIndex = 0;

        this.ActGroupsId = "";
        this.ActGroupsIndex = 0;

        this.FilterLogin = "";
        this.FilterUserName = "";

        this.FilterActsAppId = "";
        this.FilterActsCode = "";
        this.FilterActsName = "";

        this.sLoc = new LibLockService(300000);
    }
    Start(id){
        LoadForm("#"+id, this.GetUrl("/Admin/AdminMainForm"), this.InitFunc.bind(this));
    }
    /**
     * Инициализация логики работы с пользователями
     * @constructor
     */
    InitUsers(){
        this.dgUsers.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgUsers_onLoadSuccess.bind(this),
            rowStyler: this.dg_rowStyler.bind(this),
            onSelect: this.dgUsers_onSelect.bind(this),
        });
        LoaderCSRFDataForGrid(this.dgUsers);
        AddKeyboardNavigationForGrid(this.dgUsers);
        this.btnUpdateUser.attr("href","javascript:void(0)");
        this.btnShowFilterUsers.attr("href", "javascript:void(0)");
        this.btnAddUser.attr("href", "javascript:void(0)");
        this.btnChangeUser.attr("href", "javascript:void(0)");
        this.btnDeleteUser.attr("href", "javascript:void(0)");
        this.btnUpdateUser.linkbutton({onClick: this.btnUpdateUsers_onClick.bind(this)})
        this.btnShowFilterUsers.linkbutton({onClick: this.btnShowFilterUsers_onClick.bind(this)});
        this.btnAddUser.linkbutton({onClick: this.btnAddUser_onClick.bind(this)});
        this.btnChangeUser.linkbutton({onClick: this.btnChangeUser_onClick.bind(this)});
        this.btnDeleteUser.linkbutton({onClick: this.btnDeleteUser_onClick.bind(this)});
        this.cbFixGroupsByUser.checkbox({onChange: this.btnUpdateGroups_onClick.bind(this)});
        this.btnUpdateUsers_onClick();
    }

    /**
     * Инициализация логики работы с группами
     * @constructor
     */
    InitGroups(){
        this.dgGroups.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgGroups_onLoadSuccess.bind(this),
            onSelect: this.dgGroups_onSelect.bind(this),
            rowStyler: this.dg_rowStyler.bind(this),
        });
        LoaderCSRFDataForGrid(this.dgGroups);
        AddKeyboardNavigationForGrid(this.dgGroups);
        this.btnUpdateGroups.attr("href", "javascript:void(0)");
        this.btnAddGroup.attr("href", "javascript:void(0)");
        this.btnChangeGroup.attr("href", "javascript:void(0)");
        this.btnDeleteGroup.attr("href", "javascript:void(0)");
        this.btnUpdateGroups.linkbutton({onClick: this.btnUpdateGroups_onClick.bind(this)})
        this.btnAddGroup.linkbutton({onClick: this.btnAddGroup_onClick.bind(this)});
        this.btnChangeGroup.linkbutton({onClick: this.btnChangeGroup_onClick.bind(this)});
        this.btnDeleteGroup.linkbutton({onClick: this.btnDeleteGroup_onClick.bind(this)})
        this.txGroupFilter.textbox({onChange: this.btnUpdateGroups_onClick.bind(this)});
        this.btnUpdateGroups_onClick();
    }

    /**
     * Инициализация работы логики пользователей группы
     * @constructor
     */
    InitUserGroups(){
        this.dgUserGroups.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgUserGroups_onLoadSuccess.bind(this),
            onSelect: this.dgUsersGroups_onSelect.bind(this),
            rowStyler: this.dg_rowStyler.bind(this)
        });
        LoaderCSRFDataForGrid(this.dgUserGroups);
        AddKeyboardNavigationForGrid(this.dgUserGroups);
        this.btnAddUserGroups.attr("href", "javascript:void(0)");
        this.btnChangeUserGroups.attr("href", "javascript:void(0)");
        this.btnDeleteUserGroups.attr("href", "javascript:void(0)");
        this.btnUpdateUserGroups.attr("href", "javascript:void(0)");
        this.btnAddUserGroups.linkbutton({onClick: this.btnAddUserGroups_onClick.bind(this)});
        this.btnChangeUserGroups.linkbutton({onClick: this.btnChangeUserGroups_onClick.bind(this)});
        this.btnDeleteUserGroups.linkbutton({onClick: this.btnDeleteUserGroups_onClick.bind(this)});
        this.btnUpdateUserGroups.linkbutton({onClick: this.btnUpdateUserGroups_onClick.bind(this)});
    }

    /**
     * Инициализация работы логики приложений
     * @constructor
     */
    InitApps(){
        this.dgApps.treegrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgApps_onLoadSuccess.bind(this),
            onSelect: this.dgApps_onSelect.bind(this),
            rowStyler: this.dg_rowStylerTreeGrid.bind(this)
        });
        LoaderCSRFDataForTreeGrid(this.dgApps);
        this.btnUpdateApps.attr("href", "javascript:void(0)");
        this.btnAddApp.attr("href","javascript:void(0)");
        this.btnChangeApp.attr("href", "javascript:void(0)");
        this.btnDelApp.attr("href", "javascript:void(0)");
        this.btnUpdateApps.linkbutton({onClick: this.btnUpdateApps_onClick.bind(this)});
        this.btnAddApp.linkbutton({onClick: this.btnAddApp_onClick.bind(this)});
        this.btnChangeApp.linkbutton({onClick: this.btnChangeApp_onClick.bind(this)});
        this.btnDelApp.linkbutton({onClick: this.btnDelApp_onClick.bind(this)});
        this.cbFixGroupsByApp.checkbox({onChange: this.btnUpdateGroups_onClick.bind(this)});
        this.btnUpdateApps_onClick();
    }

    /**
     * Инициализация работы логики привязок приложений к группам
     * @constructor
     */
    InitAppRights(){
        this.dgAppRights.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgAppRights_onLoadSuccess.bind(this),
            onSelect: this.dgAppRights_onSelect.bind(this),
            rowStyler: this.dg_rowStyler.bind(this)
        });
        LoaderCSRFDataForGrid(this.dgAppRights);
        AddKeyboardNavigationForGrid(this.dgAppRights);
        this.btnAddAppRights.attr("href", "javascript:void(0)");
        this.btnChangeAppRights.attr("href", "javascript:void(0)");
        this.btnDelAppRights.attr("href", "javascript:void(0)");
        this.btnUpdateAppRights.attr("href", "javascript:void(0)");
        this.btnAddAppRights.linkbutton({onClick: this.btnAddAppRights_onClick.bind(this)});
        this.btnChangeAppRights.linkbutton({onClick: this.btnChangeAppRights_onClick.bind(this)});
        this.btnDelAppRights.linkbutton({onClick: this.btnDelAppRights_onClick.bind(this)});
        this.btnUpdateAppRights.linkbutton({onClick: this.btnUpdateAppRights_onClick.bind(this)});
    }

    /**
     * Инициализация работы логики действий
     * @constructor
     */
    InitActs(){
        this.dgActs.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgActs_onLoadSuccess.bind(this),
            onSelect: this.dgActs_onSelect.bind(this),
            rowStyler: this.dg_rowStyler.bind(this)
        });
        LoaderCSRFDataForGrid(this.dgActs);
        AddKeyboardNavigationForGrid(this.dgActs);
        this.btnUpdateActs.attr("href", "javascript:void(0)");
        this.btnAddAct.attr("href", "javascript:void(0)");
        this.btnChangeAct.attr("href", "javascript:void(0)");
        this.btnDelAct.attr("href", "javascript:void(0)");
        this.btnShowFilterActs.attr("href", "javascript:void(0)");
        this.btnUpdateActs.linkbutton({onClick: this.btnUpdateActs_onClick.bind(this)});
        this.btnAddAct.linkbutton({onClick: this.btnAddAct_onClick.bind(this)});
        this.btnChangeAct.linkbutton({onClick: this.btnChangeAct_onClick.bind(this)});
        this.btnDelAct.linkbutton({onClick: this.btnDelAct_onClick.bind(this)});
        this.btnShowFilterActs.linkbutton({onClick: this.btnShowFilterActs_onClick.bind(this)});
        this.cbFixGroupsByAct.checkbox({onChange: this.btnUpdateGroups_onClick.bind(this)});
        this.btnUpdateActs_onClick();
    }

    /**
     * Инициализации логики работы пользовательского интерфейса для действий групп
     * @constructor
     */
    InitActGroups(){
        this.dgActGroups.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgActGroups_onLoadSuccess.bind(this),
            onSelect: this.dgActGroups_onSelect.bind(this),
            rowStyler: this.dg_rowStyler.bind(this)
        });
        LoaderCSRFDataForGrid(this.dgActGroups);
        AddKeyboardNavigationForGrid(this.dgActGroups);
        this.btnUpdateActGroups.attr("href", "javascript:void(0)");
        this.btnAddActGroup.attr("href", "javascript:void(0)");
        this.btnChangeActGroup.attr("href", "javascript:void(0)");
        this.btnDeleteActGroups.attr("href", "javascript:void(0)");
        this.btnUpdateActGroups.linkbutton({onClick: this.btnUpdateActGroups_onClick.bind(this)});
        this.btnAddActGroup.linkbutton({onClick: this.btnAddActGroup_onClick.bind(this)});
        this.btnChangeActGroup.linkbutton({onClick: this.btnChangeActGroup_onClick.bind(this)});
        this.btnDeleteActGroups.linkbutton({onClick: this.btnDeleteActGroups_onClick.bind(this)});
    }
    /**
     * Иинициализация пользовательского интерфейса
     * @constructor
     */
    InitFunc(){
        this.InitComponents("rAdmin_Module_Admin", "");
        this.tbBindings.tabs({onSelect: ((title, index) =>{this.dgGroups_onSelect();}).bind(this)});
        this.InitUsers();
        this.InitUserGroups();
        this.InitApps();
        this.InitAppRights();
        this.InitActs();
        this.InitActGroups();
        this.InitGroups();
    }
    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dg_rowStyler(index, row) {
        if(row.del=="Да") {
            return "background:lightgray;color:red;";
        }
    }
    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dg_rowStylerTreeGrid(row) {
        if(row.del=="Да") {
            return "background:lightgray;color:red;";
        }
    }
    //------------------------------------------------------------------
    //Рработа с шруппами
    //------------------------------------------------------------------
    /**
     * Обработка успешного окончания загрузки групп
     * @param data - информаци о загруженных данных
     */
    dgGroups_onLoadSuccess(data) {
        if(data.total>0) {
            if(this.GroupId != "") {
                this.dgGroups.datagrid("selectRecord", this.GroupId);
            }
            else {
                if(this.GroupIndex>=0&& this.GroupIndex < data.total) {
                    this.dgGroups.datagrid("selectRow", this.GroupIndex);
                }
                else if (data.total>0) {
                    this.dgGroups.datagrid("selectRow", data.total-1);
                }
            }
            this.GroupId = "";
            this.GroupIndex = 0;
        }
    }
    /**
     * Обработка выбора группы
     */
    dgGroups_onSelect() {
        this.btnDeleteGgroupChangeText();
        let tab = this.tbBindings.tabs("getSelected");
        let tabId = tab[0].id;
        if(tabId == "tpUsers_Module_Admin"){
            this.btnUpdateUserGroups_onClick();
        }
        if(tabId == "tpApps_Module_Admin"){
            this.btnUpdateAppRights_onClick();
        }
        if(tabId == "tpActs_Module_Admin"){
            this.btnUpdateActGroups_onClick();
        }
    }
    /**
     * Обработка обновления списка групп
     */
    btnUpdateGroups_onClick() {
        let row = this.dgGroups.datagrid("getSelected");
        if(row!=null) {
            this.GroupIndex = this.dgGroups.datagrid("getRowIndex", row);
        }
        let filter = this.txGroupFilter.textbox("getText");

        let FixGroupsByUser = this.cbFixGroupsByUser.checkbox("options").checked;
        let FixGroupsByApp = this.cbFixGroupsByApp.checkbox("options").checked;
        let FixGroupsByAct = this.cbFixGroupsByAct.checkbox("options").checked;
        let UserId = "";
        let AppId = "";
        let ActId = "";
        if(FixGroupsByUser) {
            if(this.dgUsers.datagrid("getRows").length != 0) {
                let selData = this.dgUsers.datagrid("getSelected");
                if (selData != null) {
                    UserId = selData.id;
                }
            }
        }
        if(FixGroupsByApp){
            let selData = this.dgApps.treegrid("getSelected");
            if(selData!=null){
                AppId = selData.id;
            }
        }
        if(FixGroupsByAct){
            if(this.dgActs.datagrid("getRows").length != 0) {
                let selData = this.dgActs.datagrid("getSelected");
                if (selData != null) {
                    ActId = selData.id;
                }
            }
        }
        this.dgGroups.datagrid({url:this.GetUrl("/AdminGroups/GroupsList"), queryParams: {filter:filter, userId: UserId, appId: AppId, actId: ActId}});
    }
    /**
     * Обработка добавления группы
     */
    btnAddGroup_onClick(){
        let form = new GroupEditForm();
        form.SetResultFunc((RecId)=>{  this.GroupId = RecId; this.btnUpdateGroups_onClick();});
        form.Show({AddMode: true});
    }

    /**
     * Обработка изменения группы
     * @returns {boolean}
     */
    btnChangeGroup_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgGroups.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("i_groups", -1, selData.id, this.btnContinueChangeGroup_onClick.bind(this));
    }

    /**
     * Продолжение изменения группы
     * @param options
     */
    btnContinueChangeGroup_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new GroupEditForm();
        form.SetResultFunc((RecId)=>{  this.UserId = RecId; this.btnUpdateGroups_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("i_groups", -1, options.uuid);
                }
            }
        });
        form.Show(options);
    }

    /**
     * Удаление группы
     * @returns {boolean}
     */
    btnDeleteGroup_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgGroups.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if(del == "Да"){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенную группу " + selData.name + " с кодом " + selData.code + "?", function(result){
                if(result){
                    this.sLoc.StateLockRecord("i_groups", -1, selData.id, this.btnContinueDeleteGroup_onClick.bind(this));
                }
            }.bind(this));
    }
    /**
     * ПРподолжение процесса удаления группы
     * @param options
     */
    btnContinueDeleteGroup_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else
        {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/AdminGroups/Delete'),
                data: {id: options.uuid},
                headers:GetCSRFTokenHeader(),
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.btnUpdateGroups_onClick();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data); }.bind(this)
            });
        }
    }
    /**
     * Изменение текста на кнопке "Удалить" для групп
     */
    btnDeleteGgroupChangeText(){
        if(this.dgGroups.datagrid("getRows").length != 0){
            let selData = this.dgGroups.datagrid("getSelected");
            if(selData !=null ){
                if(selData.del=="Да"){
                    this.btnDeleteGroup.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
                else {
                    this.btnDeleteGroup.linkbutton({iconCls:"icon-remove", text:"Удалить"});
                }
            }
            else {
                this.btnDeleteGroup.linkbutton({iconCls:"icon-remove", text:"Удалить"});
            }
        }
        else {
            this.btnDeleteGroup.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }
    //--------------------------------------------------------------
    //Работа с пользователями
    //--------------------------------------------------------------
    /**
     * Обработка окончания загрузки списка пользователей
     * @param data - информация о загруженных данных
     */
    dgUsers_onLoadSuccess(data){
        if(data.total>0)
        {
            if(this.UserId != "")
            {
                this.dgUsers.datagrid("selectRecord", this.UserId);
            }
            else
            {
                if(this.UserIndex>=0&& this.UserIndex < data.total)
                {
                    this.dgUsers.datagrid("selectRow", this.UserIndex);
                }
                else if (data.total>0)
                {
                    this.dgUsers.datagrid("selectRow", data.total-1);
                }
            }
            this.UserId = "";
            this.UserIndex = 0;
        }
    }

    /**
     * Обновление списка пользователей
     */
    btnUpdateUsers_onClick(){
        let row = this.dgUsers.datagrid("getSelected");
        if(row!=null) {
            this.UserIndex = this.dgUsers.datagrid("getRowIndex", row);
        }
        let code = this.FilterLogin;
        let name = this.FilterUserName;

        let filter = {code: code, name: name};
        this.dgUsers.datagrid({url:this.GetUrl("/AdminUsers/List"), queryParams: filter});
    }
    /**
     * Показать фильтр по пользователям
     */
    btnShowFilterUsers_onClick(){
        let form = new UserFilterForm();
        form.SetResultFunc(function(data){
            this.FilterLogin = data.Code;
            this.FilterUserName = data.Name;
            this.btnUpdateUsers_onClick();
        }.bind(this));
        form.Show({AddMode: true, Code: this.FilterLogin, Name: this.FilterUserName});
    }

    /**
     * Обработка команды добавления пользователя
     */
    btnAddUser_onClick(){
        let form = new UserEditForm();
        form.SetResultFunc((RecId)=>{  this.UserId = RecId; this.btnUpdateUsers_onClick();});
        form.Show({AddMode: true});
    }

    /**
     * Начало операции изменения пользователя
     */
    btnChangeUser_onClick(){
        if(this.dgUsers.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgUsers.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("i_users", -1, selData.id, this.btnContinueChangeUser_onClick.bind(this));
    }

    /**
     * Продолжение операции изменения пользователя
     * @param options
     */
    btnContinueChangeUser_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new UserEditForm();
        form.SetResultFunc((RecId)=>{  this.UserId = RecId; this.btnUpdateUsers_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("i_users", -1, options.uuid);
                }
            }
        });
        form.Show(options);
    }

    /**
     * Начало операции удаления пользователя
     */
    btnDeleteUser_onClick(){
        if(this.dgUsers.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgUsers.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if(del == "Да"){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенного пользователя " + selData.userName + " с логином " + selData.login + "?", function(result){
            if(result){
                this.sLoc.StateLockRecord("i_users", -1, selData.id, this.btnContinueDeleteUser_onClick.bind(this));
            }
        }.bind(this));
    }

    /**
     * Продолжение выполнения операции удаления пользователя
     */
    btnContinueDeleteUser_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/AdminUsers/Delete'),
                data: {id: options.uuid},
                headers:GetCSRFTokenHeader(),
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.btnUpdateUsers_onClick();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data); }.bind(this)
            });
        }
    }
    /**
     * Изменение текста на кнопке "Удалить" для пользователей
     */
    btnDeleteUserChangeText(){
        if(this.dgUsers.datagrid("getRows").length != 0){
            let selData = this.dgUsers.datagrid("getSelected");
            if(selData !=null ){
                if(selData.del=="Да"){
                    this.btnDeleteUser.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
                else {
                    this.btnDeleteUser.linkbutton({iconCls:"icon-remove", text:"Удалить"});
                }
            }
            else {
                this.btnDeleteUser.linkbutton({iconCls:"icon-remove", text:"Удалить"});
            }
        }
        else {
            this.btnDeleteUser.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }

    /**
     * Обработка выбора пользователя
     */
    dgUsers_onSelect(){
        this.btnDeleteUserChangeText();
        let FixGroupsByUser = this.cbFixGroupsByUser.checkbox("options").checked;
        if(FixGroupsByUser) {
            this.btnUpdateGroups_onClick();
        }
    }
    //-------------------------------------------------------------------
    //Пользователи группы
    //-------------------------------------------------------------------
    /**
     * Добавление ползователя в группу
     */
    btnAddUserGroups_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let selDataGroups = this.dgGroups.datagrid("getSelected");
        if(selDataGroups==null) {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        if(this.dgUsers.datagrid("getRows").length == 0) {
            this.ShowWarning("Выберите пожалуйста пользователя");
            return false;
        }
        let selDataUsers = this.dgUsers.datagrid("getSelected");
        if(selDataUsers==null) {
            this.ShowWarning("Выберите пожалуйста пользователя");
            return false;
        }
        let GroupId = selDataGroups.id;
        let UserId = selDataUsers.id;
        let form = new UserGroupsEditForm();
        form.SetResultFunc((RecId)=>{  this.UserGroupsId = RecId; this.btnUpdateUserGroups_onClick();});
        form.Show({AddMode:true, editMode:false, id:"", GroupId: GroupId, UserId: UserId});
    }

    /**
     * Начало операции изменения привязки пользователя к группе
     */
    btnChangeUserGroups_onClick(){
        if(this.dgUserGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgUserGroups.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("i_user_groups", -1, selData.id, this.btnContinueChangeUserGgroups_onClick.bind(this));
    }

    /**
     * ПРодолжение операции изменения привязки пользователя к группе
     * @param options
     */
    btnContinueChangeUserGgroups_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new UserGroupsEditForm();
        form.SetResultFunc((RecId)=>{  this.UserGroupsId = RecId; this.btnUpdateUserGroups_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("i_user_groups", -1, options.uuid);
                }
            }
        });
        form.Show(options);
    }

    /**
     * Начало операции удаления пользователя из группы
     */
    btnDeleteUserGroups_onClick(){
        if(this.dgUserGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgUserGroups.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if(del == "Да"){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенного пользователя " + selData.userName + "?", function(result){
            if(result){
                this.sLoc.StateLockRecord("i_user_groups", -1, selData.id, this.btnContinueDeleteUserGroups_onClick.bind(this));
            }
        }.bind(this));
    }

    /**
     * Продолжение операции удаления пользователя из группы
     * @param options
     */
    btnContinueDeleteUserGroups_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/AdminGroups/DeleteUserFromGroup'),
                data: {id: options.uuid},
                headers:GetCSRFTokenHeader(),
                success:function(data){
                    this.btnUpdateUserGroups_onClick();
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data); }.bind(this)
            });
        }
    }

    /**
     * Обновление списка пользователей группы
     */
    btnUpdateUserGroups_onClick(){
        let GroupId = "";
        if(this.dgGroups.datagrid("getRows").length != 0) {
            let selData = this.dgGroups.datagrid("getSelected");
            if (selData != null) {
                GroupId = selData.id;
            }
        }
        if(GroupId!="") {
            let row = this.dgUserGroups.datagrid("getSelected");
            if(row!=null)
            {
                this.UserGroupsIndex = this.dgUserGroups.datagrid("getRowIndex", row);
                if(this.UserGroupsIndex<0){this.UserGroupsIndex = 0;}
            }
            let filter_obj = {groupId: GroupId};
            this.dgUserGroups.datagrid({url: this.GetUrl("/AdminGroups/UserList"), queryParams: filter_obj});
        }
        else {
            this.dgUserGroups.datagrid("setData", {});
        }
    }

    /**
     * Обработка успешной загрузки пользователей группы
     */
    dgUserGroups_onLoadSuccess(data){
        if(data.total>0) {
            if(this.UserGroupsId!="") {
                this.dgUserGroups.datagrid("selectRecord", this.UserGroupsId);
            }
            else {
                if(this.UserGroupsIndex>=0&& this.UserGroupsIndex < data.total) {
                    this.dgUserGroups.datagrid("selectRow", this.UserGroupsIndex);
                }
                else if (data.total>0) {
                    this.dgUserGroups.datagrid("selectRow", data.total-1);
                }
            }
            this.UserGroupsId = "";
            this.UserGroupsIndex = 0;
        }
    }
    dgUsersGroups_onSelect(){
        this.btnDeleteUserGroupsChangeText();
    }
    /**
     * Изменение текста на кнопке "Удалить" для пользователей группы
     */
    btnDeleteUserGroupsChangeText(){
        this.btnDeleteUserGroups.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        if(this.dgUserGroups.datagrid("getRows").length != 0){
            let selData = this.dgUserGroups.datagrid("getSelected");
            if(selData !=null ){
                if(selData.del=="Да"){
                    this.btnDeleteUserGroups.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
            }
        }
    }
    //-----------------------------------------------------------------
    //Логика работы с приложениями
    //-----------------------------------------------------------------
    /**
     * Обновление списка приложений
     */
    btnUpdateApps_onClick(){
        if(this.AppsId == ""){
            let selData = this.dgApps.datagrid("getSelected");
            if(selData!=null) {
                this.AppsId = selData.id;
            }
        }
        this.dgApps.treegrid({url:this.GetUrl("/AdminApps/List")});
    }

    /**
     * Обработка успешной загрузки приложений
     */
    dgApps_onLoadSuccess(row, data){
        if(data.length>0) {
            if(this.AppsId != "") {
                this.dgApps.treegrid("select", this.AppsId);
            }
            else
            {
                this.dgApps.treegrid("select", data[0].id);
            }
            this.AppsId = "";
        }
    }

    /**
     * Обработка добавления нового приложаения
     */
    btnAddApp_onClick(){
        let AppId = "";
        let selData = this.dgApps.treegrid("getSelected");
        if(selData!=null && selData.type == "Категория") {
            AppId = selData.id;
        }
        let form = new AppEditForm();
        form.SetResultFunc((RecId)=>{  this.AppsId = RecId; this.btnUpdateApps_onClick();});
        form.Show({AddMode:true, id:"", AppId: AppId});
    }

    /**
     * Начало процесса редактирования приложения
     */
    btnChangeApp_onClick(){
        let selData = this.dgApps.treegrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("i_apps", -1, selData.id, this.btnContinueChangeApp_onClick.bind(this));
    }

    /**
     * Продолжение процесса редиктирования приложения
     * @param options
     */
    btnContinueChangeApp_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new AppEditForm();
        form.SetResultFunc((RecId)=>{  this.AppsId = RecId; this.btnUpdateApps_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options!=null){
                if(options.lockState){
                    this.sLoc.FreeLockRecord("i_apps", -1, options.uuid);
                }
            }
        });
        form.Show(options);
    }
    /**
     * Изменение текста на кнопке "Удалить" для приложений
     */
    btnDeleteAppChangeText(){
        this.btnDelApp.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        let selData = this.dgApps.treegrid("getSelected");
        if(selData !=null ){
            if(selData.del=="Да"){
                this.btnDelApp.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
            }
        }
    }

    /**
     * Обработка выбора приложения
     */
    dgApps_onSelect(){
        this.btnDeleteAppChangeText();
        let FixGroupsByApp = this.cbFixGroupsByApp.checkbox("options").checked;
        if(FixGroupsByApp) {
            this.btnUpdateGroups_onClick();
        }
    }

    /**
     * Функция начала удаления приложения
     */
    btnDelApp_onClick(){
        let selData = this.dgApps.treegrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if(del == "Да"){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделеннуое приложение " + selData.name + " с кодом " + selData.code + "?", function(result){
            if(result){
                this.sLoc.StateLockRecord("i_apps", -1, selData.id, this.btnContinueDeleteApp_onClick.bind(this));
            }
        }.bind(this));
    }

    /**
     * Продолжение операции удаления приложения
     * @param options
     */
    btnContinueDeleteApp_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/AdminApps/Delete'),
                data: {id: options.uuid},
                headers:GetCSRFTokenHeader(),
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.btnUpdateApps_onClick();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data); }.bind(this)
            });
        }
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Приложения группы
    //-----------------------------------------------------------------------------------------------------------------
    /**
     * Обработка обновления списка приложений группы
     */
    btnUpdateAppRights_onClick() {
        let GroupId = "";
        if(this.dgGroups.datagrid("getRows").length != 0) {
            let selData = this.dgGroups.datagrid("getSelected");
            if (selData != null) {
                GroupId = selData.id;
            }
        }
        if(GroupId != "") {
            let row = this.dgAppRights.datagrid("getSelected");
            if(row!=null) {
                this.AppRightsIndex = this.dgAppRights.datagrid("getRowIndex", row);
                if(this.AppRightsIndex<0){this.AppRightsIndex = 0;}
            }
            this.dgAppRights.datagrid({url: this.GetUrl("/AdminGroups/GetAppRightsList"), queryParams:{groupId: GroupId}});
        }
        else {
            this.dgAppRights.datagrid("setData", {});
        }
    }

    /**
     * Обработка добавления приложения в группу
     */
    btnAddAppRights_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let selDataGroups = this.dgGroups.datagrid("getSelected");
        if(selDataGroups==null) {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let selDataApps = this.dgApps.treegrid("getSelected");
        if(selDataApps==null) {
            this.ShowWarning("Выберите пожалуйста приложение");
            return false;
        }
        let GroupId = selDataGroups.id;
        let AppId = selDataApps.id;
        let form = new AppRightsEditForm();
        form.SetResultFunc((RecId)=>{  this.AppRightsId = RecId; this.btnUpdateAppRights_onClick();});
        form.Show({AddMode:true, editMode:false, id:-1, GroupId: GroupId, AppId: AppId});
    }

    /**
     * Обработка успешной загрузки приложений группы
     */
    dgAppRights_onLoadSuccess(data){
        if(data.total > 0) {
            if(this.AppRightsId != "") {
                this.dgAppRights.datagrid("selectRecord", this.AppRightsId);
            }
            else {
                if(this.AppRightsIndex >= 0 && this.AppRightsIndex < data.total) {
                    this.dgAppRights.datagrid("selectRow", this.AppRightsIndex);
                }
                else if (data.total > 0) {
                    this.dgAppRights.datagrid("selectRow", data.total - 1);
                }
            }
            this.AppRightsId = "";
            this.AppRightsIndex = 0;
        }
    }

    /**
     * Начало процесса изменения привязки приложения к группе
     */
    btnChangeAppRights_onClick(){
        if(this.dgAppRights.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgAppRights.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("i_apps_groups", -1, selData.id, this.btnContinueChangeAppRights_onClick.bind(this));
    }

    /**
     * ПРодолжение процесса изменения привязки приложения к группе
     * @param options
     */
    btnContinueChangeAppRights_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new AppRightsEditForm();
        form.SetResultFunc((RecId)=>{  this.AppRightsId = RecId; this.btnUpdateAppRights_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options.lockState){
                this.sLoc.FreeLockRecord("i_apps_groups", -1, options.uuid);
            }
        });
        form.Show(options);
    }

    /**
     * Начать процес уаления приложения из группы
     */
    btnDelAppRights_onClick(){
        if(this.dgAppRights.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgAppRights.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if(del == "Да"){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенное приложение " + selData.name + " из группы?", function(result){
            if(result){
                this.sLoc.StateLockRecord("i_apps_groups", -1, selData.id, this.btnContinueDeleteAppRights_onClick.bind(this));
            }
        }.bind(this));
    }

    /**
     * Проолжение операции удления приложения из группы
     * @param options
     */
    btnContinueDeleteAppRights_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/AdminGroups/DeleteAppFromGroup'),
                data: {id: options.uuid},
                headers:GetCSRFTokenHeader(),
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.btnUpdateGroups_onClick();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data); }.bind(this)
            });
        }
    }
    /**
     * Изменение текста на кнопке "Удалить" для привязок приложений к группам
     */
    btnDeleteAppRightsChangeText(){
        this.btnDelAppRights.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        if(this.dgAppRights.datagrid("getRows").length != 0){
            let selData = this.dgAppRights.datagrid("getSelected");
            if(selData !=null ){
                if(selData.del=="Да"){
                    this.btnDelAppRights.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
            }
        }
    }
    /**
     * Обработка выбора привзяки приложения к группе
     */
    dgAppRights_onSelect(){
        this.btnDeleteAppRightsChangeText();
    }
    //--------------------------------------------------------
    //Действия
    //--------------------------------------------------------
    /**
     * Обработка успешной загрузки действий
     * @param data
     */
    dgActs_onLoadSuccess(data){
        if(data.total>0) {
            if(this.ActId != "") {
                this.dgActs.datagrid("selectRecord", this.ActId);
            }
            else {
                if(this.ActIndex>=0&& this.ActIndex < data.total) {
                    this.dgActs.datagrid("selectRow", this.ActIndex);
                }
                else if (data.total>0) {
                    this.dgActs.datagrid("selectRow", data.total-1);
                }
            }
            this.ActId = "";
            this.ActIndex = 0;
        }
    }

    /**
     * Обновление списка действий
     */
    btnUpdateActs_onClick(){
        let row = this.dgActs.datagrid("getSelected");
        if(row!=null) {
            this.ActIndex = this.dgActs.datagrid("getRowIndex", row);
        }
        let code = this.FilterActsCode;
        let name = this.FilterActsName;
        let appId = this.FilterActsAppId;
        this.dgActs.datagrid({url:this.GetUrl("/AdminActs/List"), queryParams: {code:code, appId: appId, name: name}});
    }

    /**
     * Добавление нового действия
     */
    btnAddAct_onClick(){
        let form = new ActEditForm();
        form.SetResultFunc((RecId)=>{  this.ActId = RecId; this.btnUpdateActs_onClick();});
        form.Show({AddMode:true});
    }

    /**
     * Начало процедуры изменения действия
     */
    btnChangeAct_onClick(){
        if(this.dgActs.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для редактирования");
            return false;
        }
        let selData = this.dgActs.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для редактирования");
            return false;
        }
        this.sLoc.LockRecord("i_acts", -1, selData.id, this.btnContinueChangeAct_onClick.bind(this));
    }

    /**
     * Продолжение операции изменения действия
     * @param options
     */
    btnContinueChangeAct_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new ActEditForm();
        form.SetResultFunc((RecId)=>{  this.ActId = RecId; this.btnUpdateActs_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options.lockState){
                this.sLoc.FreeLockRecord("i_acts", -1, options.uuid);
            }
        });
        form.Show(options);
    }

    /**
     * Нначало операции удаления действия
     */
    btnDelAct_onClick(){
        if(this.dgActs.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgActs.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if(del == "Да"){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенное действие " + selData.actName + "?", function(result){
            if(result){
                this.sLoc.StateLockRecord("i_acts", -1, selData.id, this.btnContinueDeleteActs_onClick.bind(this));
            }
        }.bind(this));
    }

    /**
     * Продолжение операции удаления действия
     * @param options
     */
    btnContinueDeleteActs_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/AdminActs/Delete'),
                data: {id: options.uuid},
                headers:GetCSRFTokenHeader(),
                success:function(data){
                    if(data.length) {
                        this.ShowWarning(data);
                    }
                    else{
                        this.btnUpdateActs_onClick();
                    }
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data); }.bind(this)
            });
        }
    }
    /**
     * Изменение текста на кнопке "Удалить" для действий
     */
    btnDeleteActsChangeText(){
        this.btnDelAct.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        if(this.dgActs.datagrid("getRows").length != 0){
            let selData = this.dgActs.datagrid("getSelected");
            if(selData !=null ){
                if(selData.del=="Да"){
                    this.btnDelAct.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
            }
        }
    }
    /**
     * Обработка выбора действия
     */
    dgActs_onSelect(){
        this.btnDeleteActsChangeText();
        let FixGroupsByAct = this.cbFixGroupsByAct.checkbox("options").checked;
        if(FixGroupsByAct) {
            this.btnUpdateGroups_onClick();
        }
    }

    /**
     * Показать настройки фильтра по действиям
     */
    btnShowFilterActs_onClick(){
        let form = new ActFilterForm();
        form.SetResultFunc(function(data){
            this.FilterActsCode = data.Code;
            this.FilterActsAppId = data.AppId;
            this.FilterActsName = data.Name;
            this.btnUpdateActs_onClick();
        }.bind(this));
        form.Show({AddMode: true, Code: this.FilterActsCode, Name: this.FilterActsName, AppId: this.FilterActsAppId});
    }
    //-----------------------------------------------------------------------
    //Привязки действий к группам
    //-----------------------------------------------------------------------
    /**
     * Обработка успешной загрузки действий группы
     */
    dgActGroups_onLoadSuccess(data){
        if(data.total>0) {
            if(this.ActGroupsId != "") {
                this.dgActGroups.datagrid("selectRecord", this.ActGroupsId);
            }
            else {
                if(this.ActGroupsIndex>=0&& this.ActGroupsIndex < data.total) {
                    this.dgActGroups.datagrid("selectRow", this.ActGroupsIndex);
                }
                else if (data.total>0) {
                    this.dgActGroups.datagrid("selectRow", data.total-1);
                }
            }
            this.ActGroupsId = "";
            this.ActGroupsIndex = 0;
        }
    }
    btnUpdateActGroups_onClick(){
        let GroupId = "";
        if(this.dgGroups.datagrid("getRows").length != 0) {
            let selData = this.dgGroups.datagrid("getSelected");
            if (selData != null) {
                GroupId = selData.id;
            }
        }
        if(GroupId != "") {
            let row = this.dgActGroups.datagrid("getSelected");
            if(row!=null) {
                this.ActGroupsIndex = this.dgActGroups.datagrid("getRowIndex", row);
                if(this.ActGroupsIndex<0){this.ActGroupsIndex = 0;}
            }
            this.dgActGroups.datagrid({url: this.GetUrl("/AdminGroups/GetActGroupsList"), queryParams: {groupId: GroupId}});
        }
        else {
            this.dgActGroups.datagrid("setData", {});
        }
    }

    /**
     * Обработка добавления действия в группу
     */
    btnAddActGroup_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let selDataGroups = this.dgGroups.datagrid("getSelected");
        if(selDataGroups==null) {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        if(this.dgActs.datagrid("getRows").length == 0) {
            this.ShowWarning("Выберите пожалуйста действие");
            return false;
        }
        let selDataActs = this.dgActs.datagrid("getSelected");
        if(selDataActs==null) {
            this.ShowWarning("Выберите пожалуйста группу");
            return false;
        }
        let GroupId = selDataGroups.id;
        let ActId = selDataActs.id;
        let form = new ActGroupsEditForm();
        form.SetResultFunc((RecId)=>{  this.ActGroupsId = RecId; this.btnUpdateActGroups_onClick();});
        form.Show({AddMode:true, editMode:false, id:"", GroupId: GroupId, ActId: ActId});
    }

    /**
     * Начать процесс изменения привязки действия к группе
     */
    btnChangeActGroup_onClick(){
        if(this.dgActGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgActGroups.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        this.sLoc.LockRecord("i_acts_groups", -1, selData.id, this.btnContinueChangeActGgroups_onClick.bind(this));
    }

    /**
     * Продолжение процесса изменения привязки действия к группе
     * @param options
     */
    btnContinueChangeActGgroups_onClick(options){
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new ActGroupsEditForm();
        form.SetResultFunc((RecId)=>{  this.UserGroupsId = RecId; this.btnUpdateActGroups_onClick();});
        form.SetCloseWindowFunction((options)=>{
            if(options.lockState){
                this.sLoc.FreeLockRecord("i_acts_groups", -1, options.uuid);
            }
        });
        form.Show(options);
    }

    /**
     * Запуск процедуры удаления действия из группы
     */
    btnDeleteActGroups_onClick(){
        if(this.dgActGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgActGroups.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if(del == "Да"){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенное действие " + selData.actName + "?", function(result){
            if(result){
                this.sLoc.StateLockRecord("i_acts_groups", -1, selData.id, this.btnContinueDeleteActGroups_onClick.bind(this));
            }
        }.bind(this));
    }

    /**
     * Продолжение операции удаления действия из группы
     */
    btnContinueDeleteActGroups_onClick(options){
        if(options.data.length > 0){
            this.ShowWarning(options.data);
        }
        else {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/AdminGroups/DeleteActFromGroup'),
                data: {id: options.uuid},
                headers:GetCSRFTokenHeader(),
                success:function(data){
                    this.btnUpdateActGroups_onClick();
                }.bind(this),
                error:function(data){ this.ShowErrorResponse(data); }.bind(this)
            });
        }
    }
    /**
     * Изменение текста на кнопке "Удалить" для действий
     */
    btnDeleteActGgroupsChangeText(){
        this.btnDeleteActGroups.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        if(this.dgActGroups.datagrid("getRows").length != 0){
            let selData = this.dgActGroups.datagrid("getSelected");
            if(selData !=null ){
                if(selData.del=="Да"){
                    this.btnDeleteActGroups.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
            }
        }
    }
    /**
     * Обработка выбора привязки действия к группе
     */
    dgActGroups_onSelect(){
        this.btnDeleteActGgroupsChangeText();
    }
}
export function StartNestedModule(id){
    let form = new Admin();
    form.Start("rAdmin_Module_Admin");
}