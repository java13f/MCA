import {AppFormSelect} from "./Directories/AppFormSelect.js";

export class ActEditForm extends FormView{
    constructor() {
        super();
        this.AppId = "";
    }

    /**
     * Загрузить и показать UI формы
     * @param options - настройки
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/AdminActs/GetActEditForm"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wActEdit_Module_Admin", "");
        this.InitCloseEvents(this.wActEdit);

        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.txApp.textbox({onClickButton: this.txApp_onClickButton.bind(this)});
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wActEdit.window("close");}});
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wActEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wActEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadAct(this.options.uuid);
        }
    }

    /**
     * Загрузка данных действия
     * @param ActId - идентификатор действия
     */
    LoadAct(ActId){
        $.ajax({
            method:"post",
            data:{id:ActId},
            url: this.GetUrl('/AdminActs/Get'),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.user = data;
                this.txId.textbox("setText", data.id);
                this.txCode.textbox("setText", data.code);
                this.AppId = data.appId;
                this.txName.textbox("setText", data.name);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadApp();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
    /**
     * Загрузка приложения
     */
    LoadApp(){
        if(this.AppId == ""){return;}
        $.ajax({
            method:"post",
            data:{id:this.AppId},
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
     * Выбор приложения из справочника
     */
    txApp_onClickButton(){
        let form = new AppFormSelect()
        form.SetResultFunc(((RecId)=>{ this.AppId = RecId; this.LoadApp(); }).bind(this));
        form.Show();
    }
    /**
     * Обработка сохранения записи
     */
    btnOk_onClick(){
        let Id = this.txId.textbox("getText");
        let Code = this.txCode.textbox("getText");
        let Name = this.txName.textbox("getText");

        if(this.AppId == ""){
            this.ShowError("Выберите приложение");
            return false;
        }
        if(Code.length==0){
            this.ShowError("Введите пожалуйста код действия");
            return false;
        }
        if(Name.length==0){
            this.ShowError("Введите пожалуйста наименование действия");
            return false;
        }
        let json = {id: Id, code: Code, appId:this.AppId, name:Name};
        this.ExistsAct(json);
        return false;
    }
    ExistsAct(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminActs/Exists?id=' + json.id.toString() + "&code="+encodeURIComponent(json.code)),
            success: function(data){
                if(data){
                    this.ShowError("Действие с кодом " + json.code + " уже существует.")
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
     * Продолжение сохранения действия
     * @param object - действие
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminActs/Save'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wActEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}