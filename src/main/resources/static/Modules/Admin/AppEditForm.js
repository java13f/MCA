import {CategoryFormSelect} from "./Directories/CategoryFormSelect.js";

export class AppEditForm extends FormView{
    constructor() {
        super();
        this.AppId = "";
    }
    Show(options){
        this.options = options;
        this.AppId = this.options.AppId;
        LoadForm("#ModalWindows", this.GetUrl("/AdminApps/AppEditForm"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wAppEdit_Module_Admin", "");
        this.InitCloseEvents(this.wAppEdit);

        this.cbType.combobox({
            data: [{value: "0", text: "Категория"},
                {value: "1", text: "Приложение"}],
            onSelect: this.cbType_onSelect.bind(this)
        });
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wAppEdit.window("close");}});
        this.txParentApp.textbox({onClickButton: this.txParent_onClickButton.bind(this)});
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wAppEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
            this.cbType.combobox("setValue", this.AppId.length > 0? "1":"0");
            this.LoadParentApp();
        }
        else{
            this.pbEditMode.attr("class", "icon-editmode");
            this.wAppEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            this.LoadApp();
        }
    }

    /**
     * Загрузка данных приложения
     */
    LoadApp(){
        $.ajax({
            method:"post",
            data: {id: this.options.uuid},
            url: this.GetUrl('/AdminApps/Get'),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.AppId = data.parent_id;
                this.txId.textbox("setText", data.id);
                this.cbType.combobox("setValue", data.type.toString());
                this.txCode.textbox("setText", data.code);
                this.txURL.textbox("setText", data.url);
                this.txName.textbox("setText", data.name);
                this.txSortCode.textbox("setText", data.sort_code);
                this.txIconCls.textbox("setText", data.iconCls);
                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
                this.LoadParentApp();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
    /**
     * Загрузка родительского приложения
     */
    LoadParentApp(){
        if(this.AppId==""){return;}
        $.ajax({
            method:"post",
            data:{id:this.AppId},
            url: this.GetUrl('/AdminApps/GetAppSel'),
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.txParentApp.textbox("setText", data);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    /**
     * Обработка выбора родительского приложения
     */
    txParent_onClickButton(){
        let form = new CategoryFormSelect();
        form.SetResultFunc(((RecId)=>{ this.AppId = RecId; this.LoadParentApp(); }).bind(this));
        form.Show();
    }

    /**
     * Обработка выбора типа приложения
     * @param record
     */
    cbType_onSelect(record){
        //0 - категория
        //1 - приложение
        if(record.value == "0"){
            this.AppId = "";
            this.txParentApp.textbox("setText", "");
            this.txParentApp.textbox({disabled: true});
            this.txURL.textbox("setText", "");
            this.txURL.textbox({disabled:true});
        }
        else{
            this.txParentApp.textbox({disabled: false});
            this.txURL.textbox({disabled:false});
        }
    }
    /**
     * Обработка сохранения приложения
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let code = this.txCode.textbox("getText");
        let url = this.txURL.textbox("getText");
        let name = this.txName.textbox("getText");
        let sortCode = this.txSortCode.textbox("getText");
        let type = this.cbType.combobox("getValue");
        let iconcls = this.txIconCls.textbox("getText");

        if(code.length == 0){
            this.ShowError("Ведите пожалуйста \"Код приложения\"");
            return false;
        }
        if(name.length==0){
            this.ShowError("Введите пожалуйста наименование приложения");
            return false;
        }
        //0 - категория
        //1 - приложение
        if(type == "1"){
            if(this.AppId.length == 0){
                this.ShowError("Выберите пожалуйста категорию");
                return false;
            }
            if(url.length == 0){
                this.ShowError("Введите пожалуйста URL-адрес");
                return false;
            }
        }
        let json = {id:id, parent_id:this.AppId, code:code, url:url, name: name, sort_code:sortCode, iconCls: iconcls, type: type};
        this.ExistApp(json);
        return false;
    }

    /**
     * Проверка существания приложения в базе данных
     */
    ExistApp(json){
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminApps/Exists?id=' + json.id.toString()
                +"&code=" + encodeURIComponent(json.code)),
            success: function(data){
                if(data){
                    this.ShowError("Такое приложение уже есть в таблице приложений")
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
     * Продолжение сохранения приложения
     * @param object - модель привязки ползователя к группе
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: JSON.stringify(object),
            url: this.GetUrl('/AdminApps/Save'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wAppEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}