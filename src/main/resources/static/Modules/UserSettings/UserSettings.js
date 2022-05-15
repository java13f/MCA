class UserSettings extends FormView {
    constructor(ModuleId){
        super();
        this.ModuleId = ModuleId;
    }
    Start(){
        LoadForm("#" + this.ModuleId, this.GetUrl("/UserSettings/UserSettingsMainForm"), this.InitFunc.bind(this));
    }
    InitFunc(){
        this.InitComponents(this.ModuleId, "");
        this.lChkNewPassword.html("");
        this.lChkRepeatNewPassword.html("");
        this.AddLifeSearch(this.txNewPassword, (()=>{
            let password = this.txNewPassword.textbox("getText");
            if(password.length != 0)
            {
                if(!(/(?=.*\d)/.test(password))){
                    this.lChkNewPassword.html("Пароль должен содержать хотя бы одну цифру");
                } else if(!(/(?=.*[a-zа-яё])/.test(password))){
                    this.lChkNewPassword.html("Пароль должен содержать хотя бы одну маленькую букву");
                } else if(!(/(?=.*[A-ZА-ЯЁ])/.test(password))){
                    this.lChkNewPassword.html("Пароль должен содержать хотя бы одну большую букву");
                } else if(password.length < 8){
                    this.lChkNewPassword.html("Пароль должен содержать не меньше восьми символов");
                } else {
                    this.lChkNewPassword.html("");
                }
            }
            else
            {
                this.lChkNewPassword.html("");
            }
        }).bind(this));
        this.AddLifeSearch(this.txRepeatNewPassword, (()=>{
            let password = this.txNewPassword.textbox("getText");
            let password2 = this.txRepeatNewPassword.textbox("getText");
            if(password2.length !=0 && password!=password2){
                this.lChkRepeatNewPassword.html("Пароли не совпадают");
            }
            else {
                this.lChkRepeatNewPassword.html("");
            }
        }).bind(this))
        this.btnChangePassword.linkbutton({onClick: this.btnChangePassword_onClick.bind(this)});
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
    btnChangePassword_onClick(){
        let CurrentPassword = this.txCurrentPassword.textbox("getText");
        let NewPassword = this.txNewPassword.textbox("getText");
        let RepeatNewPassword = this.txRepeatNewPassword.textbox("getText");
        if(NewPassword.length == 0){
            this.ShowError("Введите пожалуйста пароль")
            return false;
        }
        if(this.lChkNewPassword.html().length > 0
            || this.lChkRepeatNewPassword.html().length > 0){
            this.ShowError("На странице обнаружены ошибки!")
            return false;
        }
        this.UpdatePassword({currentPassword: CurrentPassword, newPassword: NewPassword, repeatNewPassword: RepeatNewPassword});
    }

    /**
     * Обновление пароля
     * @param obj - объкт изменения пароля
     * @constructor
     */
    UpdatePassword(obj){
        $.ajax({
            method: "post",
            data: JSON.stringify(obj),
            url: this.GetUrl('/UserSettings/UpdatePassword'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.txCurrentPassword.textbox("setText", "");
                this.txNewPassword.textbox("setText", "");
                this.txRepeatNewPassword.textbox("setText", "");
                this.ShowInformation("Пароль успешно изменён");
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}
export function StartNestedModule(id){
    let form = new UserSettings(id);
    form.Start();
}