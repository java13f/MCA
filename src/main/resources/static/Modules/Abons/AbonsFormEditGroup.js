
export class AbonsFormEditGroup extends FormView {

    constructor() {
        super();
    }

    /**
     * Показать форму добавления/изменения записи
     * @param options
     * @constructor
     */
    Show(options){
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/Abons/AbonsFormEditGroup"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc(){
        this.InitComponents("wAbonsFormEditGroup_Module_Abons", ""); //Автоматическое получение идентификаторов формы

        this.InitCloseEvents(this.wAbonsFormEditGroup);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wAbonsFormEditGroup.window("close")}});//Обработка события нажатия на кнопку отмены

        this.txCode.textbox("textbox").attr("maxlength", "16");

        if (this.options.AddMode){ //Добавление
            this.pbEditMode.attr("class", "icon-addmode");
            this.lAction.html("Добавление новой группы");
            this.btnOk.linkbutton({disabled: false});
        }
        else { //Редактирование
            this.pbEditMode.attr("class", "icon-editmode");
            this.lAction.html("Редактирование группы абонентов");

            if (this.options.editMode) { //editMode: true - запсь открыта на редактирование, false - запись открыта на просмотр. Данная насройка нужна только для изменения или просмотра записи
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});
            }

            this.LoadDataGroup();
        }

    }



    /**
     * Обработка нажатия на кнопку "ОК"
     */
    btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let code = this.txCode.textbox("getText").trim();
        let name = this.txName.textbox("getText").trim();

         if(id.length == 0){
             id = "-1";
         }
         if(code.length == 0){
             //this.ShowError("Введите пожалуйста код группы");
             this.ShowToolTip('#divCode_Module_Abons_AbonsFormEditGroup','Введите пожалуйста код группы');
             return;
         }
         if(name.length == 0){
             //this.ShowError("Введите пожалуйста наименование группы");
             this.ShowToolTip('#divName_Module_Abons_AbonsFormEditGroup','Введите пожалуйста наименование группы');
             return;
         }

        let obj = {id: id, code: code, name: name}
        this.SaveGroup(obj)
    }


    /**
     * Добавление / изменение группы абонентов
     * @param obj данные группы
     * @constructor
     */
    SaveGroup(obj){
        $.ajax({
            method: "post",
            data: JSON.stringify(obj),
            url: this.GetUrl('/Abons/SaveGroup'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){

                if(data.length == 0 ){ //уже есть группа
                    this.ShowWarning("Группа с кодом "+ obj.code + " уже присутствует в базе данных.");
                    return;
                }

                if(this.ResultFunc!=null)
                {
                    this.ResultFunc(data);
                    this.wAbonsFormEditGroup.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }


    /**
     * Получение записи группы (grps) для формы редактирования группы
     */
    LoadDataGroup(){
            $.ajax({
                method: "post",
                data: { groupid: this.options.uuid} , //JSON.stringify( { groupid: this.options.uuid} )
                url: this.GetUrl('/Abons/getGroupById'),
                //contentType: "application/json; charset=utf-8",
                headers: GetCSRFTokenHeader(),
                success: function (data) {
                    this.txId.textbox("setText", data.id);
                    this.txCode.textbox("setText", data.code);
                    this.txName.textbox("setText", data.name);
                    this.txCode.textbox("setText", data.code);

                    this.txCreator.textbox("setText", data.creator);
                    this.txCreated.textbox("setText", data.created);
                    this.txChanger.textbox("setText", data.changer);
                    this.txChanged.textbox("setText", data.changed);

                }.bind(this),
                error: function(data){
                    this.ShowErrorResponse(data.responseJSON);
                }.bind(this)
            });

    }





}