export class UserEditForm extends FormView{
    constructor() {
        super();
    }

    /**
     * Загрузить и показать UI формы
     * @param options - настройки
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/AdminUsers/UserEditForm"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wUserEdit_Module_Admin", "");
        this.InitCloseEvents(this.wUserEdit);
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wUserEdit.window("close");}});
        this.cbIsEnabled.combobox({
            valueField: "id",
            textField: "name",
            data: [{id: "1", name: "Включен"},
                {id: "0", name: "Выключен"}]
        });
        this.txEmail.textbox("textbox").attr("maxlength", "64");
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wUserEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.cbIsEnabled.combobox("setValue", "0");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wUserEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadUser()
        }
    }

    /**
     * Загрузка данных пользователя
     * @param UserId - идентификатор пользователя
     */
    LoadUser(){
        $.ajax({
            method:"post",
            data: {id: this.options.uuid},
            url: this.GetUrl('/AdminUsers/GetUser'),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.txId.textbox("setText", data.id);
                this.txLogin.textbox("setText", data.login);
                this.txCode.textbox("setText", data.code);
                this.txName.textbox("setText", data.name);
                this.txOrganizationalUnit.textbox("setText", data.organizational_unit);
                this.txEmail.textbox("setText", data.email);
                this.cbIsEnabled.combobox("setValue", data.isenabled.toString());
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
            }.bind(this),
            error: function(data){this.ShowErrorResponse(data);}.bind(this)
        });
    }
    /**
     * Обработка сохранения записи
     */
    btnOk_onClick(){
        let Id = this.txId.textbox("getText");
        let Login = this.txLogin.textbox("getText");
        let Code = this.txCode.textbox("getText");
        let Name = this.txName.textbox("getText");
        let Password = this.txPassword.textbox("getText");
        let Password2 = this.txPassword2.textbox("getText");
        let OrganizationalUnit = this.txOrganizationalUnit.textbox("getText");
        let Email = this.txEmail.textbox("getText");
        let isEnabled = this.cbIsEnabled.combobox("getValue");

        if(Login.length == 0) {
            this.ShowError("Введите пожалуйста логин пользователя")
        }
        if(Code.length==0){
            this.ShowError("Введите пожалуйста ИНН пользователя")
            return false;
        }
        if(Name.length==0){
            this.ShowError("Введите пожалуйста имя пользователя")
            return false;
        }
        if(Id == "-1" && Password.length == 0){
            this.ShowError("Для нового пользователя обязательно необходимо ввести пароль");
            return false;
        }
        if(Password != Password2){
            this.ShowError("Ввведённые пароли не совпадают");
            return false;
        }
        if(OrganizationalUnit.length == 0){
            this.ShowError("Введите пожалуйста подразделение");
            return false;
        }
        let json = {id: Id, login: Login,  code: Code, name: Name, password:Password, password2:Password2, organizational_unit: OrganizationalUnit, email: Email, isenabled:isEnabled};
        this.ExistUser(json);
        return false;
    }
    ExistUser(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminUsers/ExistsUser?id=' + json.id.toString() + "&login="+encodeURIComponent(json.login)),
            success: function(data){
                if(data){
                    this.ShowError("Пользователь с логином " + json.login + " уже существует.")
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
     * Продолжение сохранения пользователя
     * @param object - пользователь
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminUsers/Save'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wUserEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}