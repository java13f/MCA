export class GroupEditForm extends FormView{
    constructor() {
        super();
    }

    /**
     * Загрузить и показать UI формы
     * @param options - настройки
     */
    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/GroupEditForm"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wGroupEdit_Module_Admin", "");
        this.InitCloseEvents(this.wGroupEdit);
        this.btnOk.attr("href", "javascript:void(0)");
        this.btnCancel.attr("href", "javascript:void(0)");
        this.btnOk.linkbutton({onClick:this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wGroupEdit.window("close");}});
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wGroupEdit.window({title:"Добавление новой записи"});
            this.lAction.html("Введите данные для новой записи");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wGroupEdit.window({title:"Редатирование записи"});
            this.lAction.html("Введите данные для редактирования текущей записи");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            $.ajax({
                method:"get",
                url: this.GetUrl('/AdminGroups/GetGroup?GroupId='+this.options.uuid),
                success: function(data){
                    this.txId.textbox("setText", data.id);
                    this.txCode.textbox("setText", data.code);
                    this.txName.textbox("setText", data.name);
                    this.txCreator.textbox("setText", data.creator);
                    this.txCreated.textbox("setText", data.created);
                    this.txChanger.textbox("setText", data.changer);
                    this.txChanged.textbox("setText", data.changed);
                }.bind(this),
                error: function(data) {
                    this.ShowErrorResponse(data);
                }.bind(this)
            })
        }
    }

    /**
     * Обработка сохранения записи
     */
    btnOk_onClick(){
        let Id = this.txId.textbox("getText");
        let Code = this.txCode.textbox("getText");
        let Name = this.txName.textbox("getText");

        if(Code.length==0){
            this.ShowError("Введите пожалуйста код группы")
            return false;
        }
        if(Name.length==0){
            this.ShowError("Введите пожалуйста наименование группы")
            return false;
        }
        let json = JSON.stringify({'id': Id, 'code': Code, 'name': Name});
        $.ajax({
            method:"get",
            url: this.GetUrl('/AdminGroups/ExistsGroup?id=' + Id.toString() + "&code="+encodeURIComponent(Code)),
            success: function(data){
                if(data){
                    this.ShowError("Группа с кодом " + Code + " уже существует.")
                }
                else {
                    this.Save(json);
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
        return false;
    }

    /**
     * Продолжение сохранения группы
     * @param object - группа
     */
    Save(object){
        $.ajax({
            method:"POST",
            data: object,
            url: this.GetUrl('/AdminGroups/Save'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wGroupEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}