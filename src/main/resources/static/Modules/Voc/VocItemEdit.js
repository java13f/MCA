export class VocItemEdit extends FormView {
    constructor() {
        super();
        this.VocItem = {};
        this.options = {};
    }

    Show(options) {
        this.options = options;
        this.VocItem.id = this.options.uuid;
        LoadForm("#ModalWindows", this.GetUrl("/Voc/VocItemEditForm"), this.InitFunction.bind(this));
    }

    InitFunction() {
        this.InitComponents("wVocItemEdit_VocItemEdit_Module_Voc", "");
        this.InitCloseEvents(this.wVocItemEdit);
        let title = 'Добавление записи';
        if(this.options.FormMode == 1) {
            title = 'Редактирование записи';
        }
        if(this.options.FormMode == 1 && !this.options.editMode) {
            this.btnOk.linkbutton({disabled: true});
            title = 'Просмотр записи';
        }
        this.wVocItemEdit.window({title: title});
        this.lbHeader.html(title);
        this.btnCancel.linkbutton({
            onClick: function () {
                this.wVocItemEdit.window("close");
            }.bind(this)
        });
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.tbId.textbox({disabled: true});
        this.tbCreate.textbox({disabled: true});
        this.tbCreator.textbox({disabled: true});
        this.tbChange.textbox({disabled: true});
        this.tbChanger.textbox({disabled: true});
        if(this.VocItem.id != "") {
            this.LoadVocItem(this.VocItem.id);
        }
    }

    btnOk_onClick() {
        this.CheckForm();
    }

    LoadVocItem(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Voc/LoadVocItem'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(data != null) {
                    this.VocItem = data;
                    this.tbId.textbox('setValue', this.VocItem.id);
                    this.tbCode.textbox('setValue', this.VocItem.code);
                    this.tbName.textbox('setValue', this.VocItem.name);
                    this.tbCreate.textbox('setValue', this.VocItem.created);
                    this.tbCreator.textbox('setValue', this.VocItem.creator);
                    this.tbChange.textbox('setValue', this.VocItem.changed);
                    this.tbChanger.textbox('setValue', this.VocItem.changer);
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }

    async CheckForm() {
        if (this.tbCode.textbox("getText").trim().length == 0) {
            this.ShowToolTip("#tbCodeToolTip_VocItemEdit_Module_Voc",
                "Не заполнено поле \"Код\"",
                {title:'Ошибка', delay:3000});
            return;
        }
        if(/[\/:*?"<>|]/.test(this.tbCode.textbox("getText").trim())) {
            this.ShowToolTip("#tbCodeToolTip_VocItemEdit_Module_Voc",
                "В поле \"Код\" введены недопустимые символы",
                {title:'Ошибка', delay:3000});
            return;
        }
        let chkCode = await this.CheckCode();
        if(chkCode !== true) {
            this.ShowToolTip("#tbCodeToolTip_VocItemEdit_Module_Voc",
                "Запись с кодом=" + this.tbCode.textbox("getText") + " уже существует",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (this.tbName.textbox("getText").trim().length == 0) {
            this.ShowToolTip("#tbNameToolTip_VocItemEdit_Module_Voc",
                "Не заполнено поле \"Наименование\"",
                {title:'Ошибка', delay:3000});
            return;
        }
        this.VocItem.code = this.tbCode.textbox('getText');
        this.VocItem.name = this.tbName.textbox('getText');
        this.Save();
    }

    CheckCode() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: JSON.stringify({code: this.tbCode.textbox("getText"), id: this.VocItem.id }),
                contentType: "application/json; charset=utf-8",
                url: this.GetUrl('/Voc/CheckCode'),
                headers: GetCSRFTokenHeader(),
                success: function(data) {
                    resolve(data);
                }.bind(this),
                error: function(data) {
                    reject(data);
                    this.ShowErrorResponse(data);
                }.bind(this)
            });
        });
    }

    Save() {
        this.btnOk.linkbutton({disabled: true});
        $.ajax({
            method: "POST",
            data: JSON.stringify(this.VocItem),
            url: this.GetUrl('/Voc/SaveVocItem'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wVocItemEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.btnOk.linkbutton({disabled: !this.options.editMode});
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}