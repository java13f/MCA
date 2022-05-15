class Registration extends FormView {
    constructor() {
        super();
    }

    /**
     * Инициализация формы
     * @constructor
     */
    Init(){
        this.InitComponents("wRegistrationForm_Module_Registration", "");
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)})
        this.btnCancel.linkbutton({onClick: this.btnCancel_onClick.bind(this)})

        this.AddLifeSearch(this.txLogin, (()=>{this.existsLogin()}).bind(this));
        this.AddLifeSearch(this.txPassword, (()=>{
            let password = this.txPassword.textbox("getText");
            if(password.length != 0)
            {
                if(!(/(?=.*\d)/.test(password))){
                    this.lPasswordInfo.html("Пароль должен содержать хотя бы одну цифру");
                } else if(!(/(?=.*[a-zа-яё])/.test(password))){
                    this.lPasswordInfo.html("Пароль должен содержать хотя бы одну маленькую букву");
                } else if(!(/(?=.*[A-ZА-ЯЁ])/.test(password))){
                    this.lPasswordInfo.html("Пароль должен содержать хотя бы одну большую букву");
                } else if(password.length < 8){
                    this.lPasswordInfo.html("Пароль должен содержать не меньше восьми символов");
                } else {
                    this.lPasswordInfo.html("");
                }
            }
            else
            {
                this.lPasswordInfo.html("");
            }
        }).bind(this));
        this.AddLifeSearch(this.txPassword2, (()=>{
            let password = this.txPassword.textbox("getText");
            let password2 = this.txPassword2.textbox("getText");
            if(password2.length !=0 && password!=password2){
                this.lPassword2Info.html("Пароли не совпадают");
            }
            else {
                this.lPassword2Info.html("");
            }
        }).bind(this));
        this.txLogin.textbox("textbox").attr("maxlength", "64");
        this.txPassword.textbox("textbox").attr("maxlength", "255");
        this.txPassword2.textbox("textbox").attr("maxlength", "255");
        this.txCode.textbox("textbox").attr("maxlength", "16");
        this.txName.textbox("textbox").attr("maxlength", "64");
        this.txEmail.textbox("textbox").attr("maxlength", "64");
    }
    AddLifeSearch(textBox, func){
        textBox.textbox({
            inputEvents: $.extend({}, textBox.textbox.defaults.inputEvents,{
                keyup: function(e){
                    func();
                }
            })
        });
    }
    /**
     * Проверка существования логина пользователя
     */
    existsLogin(){
        let login = this.txLogin.textbox("getText");
        login = encodeURIComponent(login);
        $.ajax({
            method: "get",
            url: this.GetUrl("/Registration/existsLogin?login="+login),
            success: function(data){
                if(data){
                    this.lLoginInfo.html("Логин уже занят");
                }
                else {
                    this.lLoginInfo.html("");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data.responseJSON);
            }.bind(this)
        });
    }
    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick(){
        let login = this.txLogin.textbox("getText");
        let password = this.txPassword.textbox("getText");
        let code = this.txCode.textbox("getText");
        let name = this.txName.textbox("getText");
        let OrganizationalUnit = this.txOrganizationalUnit.textbox("getValue");
        let Email = this.txEmail.textbox("getValue");


        if(login.length == 0){
            this.ShowError("Введите пожалуйста логин пользователя")
            return false;
        }
        if(password.length == 0){
            this.ShowError("Введите пожалуйста пароль")
            return false;
        }
        if(code.length == 0){
            this.ShowError("Введите пожалуйста ИНН пользователя")
            return false;
        }
        if(code.length!=8&&code.length!=10){
            this.ShowError("ИНН пользователя должен содержать 8 или 10 символов")
            return false;
        }
        if(isNaN(code)){
            this.ShowError("ИНН пользователя должен содержать только цифры")
            return false;
        }
        if(name.length == 0){
            this.ShowError("Введите пожалуйста ФИО пользователя")
            return false;
        }
        if(OrganizationalUnit.length == 0){
            this.ShowError("Заполните пожалуйста поле \"Подразделение\"")
            return false;
        }
        if(Email.length == 0){
            this.ShowError("Введите пожалуйста E-mail");
            return false;
        }
        if(this.lLoginInfo.html().length > 0
        || this.lPasswordInfo.html().length > 0
        || this.lPassword2Info.html().length > 0){
            this.ShowError("На странице обнаружены ошибки!")
            return false;
        }
        this.ContinueRegUser();
    }

    /**
     * Продолжить регистрацию пользователя
     * @constructor
     */
    ContinueRegUser(){
        this.fRegistration.submit();
    }
    /**
     * Отоменить регитсрацию
     */
    btnCancel_onClick(){
        document.location.href = this.GetUrl("/MainApp/MainApp");
    }
}

