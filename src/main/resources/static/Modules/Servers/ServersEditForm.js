export class ServersEditForm extends FormView {
    constructor() {
        super();
        this.options = {};

        this.currentServerTypeId = "";
        this.currentServerTypeCode = "";
    }

    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows",
            this.GetUrl("/Servers/ServersEditForm"),
            this.InitFunc.bind(this)
        );
    }

    /*
    Функция инициализации
     */
    async InitFunc() {
        this.InitComponents("wServersEditForm_Module_Servers_ServersEditForm", "");
        this.InitCloseEvents(this.wServersEditForm);
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wServersEditForm.window("close")
            }
        });

        let title = "";
        if (this.options.AddMode && this.options.editMode) {
            title = "Добавление записи";
        }
        if (!this.options.AddMode && this.options.editMode && this.options.lockState) {
            title = "Редактирование записи";
        }
        if (!this.options.AddMode && !this.options.editMode) {
            this.btnOk.linkbutton({disabled: true});
            title = "Просмотр записи";
        }
        this.wServersEditForm.window({title: title});
        this.lAction.html(title);

        this.btnOk.linkbutton({disabled: !this.options.editMode});

        await this.InitCbServerType();
        this.InitNumberboxes();

        if (!this.options.AddMode) {
            this.LoadRecord(this.options.uuid);
        }
    }

    /*
    Инициализация выпадающего списка типов серверов
     */
    async InitCbServerType() {
        let serverTypesData = await this.s_postCTRF('/Servers/getServerTypes', {});

        this.cbServerType.combobox({
            valueField: 'id',
            textField: 'display',
            data: serverTypesData,
            onSelect: this.cbServerType_onSelect.bind(this)
        });
    }

    /*
    Инициализация цифровых полей
     */
    InitNumberboxes() {
        this.txPort.numberbox({min: 0});
        this.txLineAll.numberbox({min: 0});
        this.txProxyPort.numberbox({min: 0});
    }

    /*
    Загрузка записи из базы по идентификатору
     */
    async LoadRecord(id) {
        try {
            let data = await this.s_postCTRF('/Servers/get', {id: id});

            if (data != null) {
                this.txId.textbox("setText", data.id);
                this.cbServerType.combobox("setValue", data.srv_type_id);
                this.txCode.textbox("setText", data.code);
                this.txPort.textbox("setText", data.port == null ? "" : data.port);
                this.txName.textbox("setText", data.name);
                this.txLineAll.textbox("setText", data.line_all);
                this.txLineCur.textbox("setText", data.line_cur);
                this.txCallName.textbox("setText", data.call_name == null ? "" : data.call_name);
                this.txCallPhone.textbox("setText", data.call_phone);
                this.txCallPwd.textbox("setText", data.call_pwd);
                this.txProxyAdr.textbox("setText", data.proxy_adr == null ? "" : data.proxy_adr);
                this.txProxyPort.textbox("setText", data.proxy_port == null ? "" : data.proxy_port);
                this.txProxyPwd.textbox("setText", data.proxy_pwd == null ? "" : data.proxy_pwd);

                this.txCreator.textbox("setText", data.creator);
                this.txCreated.textbox("setText", data.created);
                this.txChanger.textbox("setText", data.changer);
                this.txChanged.textbox("setText", data.changed);
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /*
    Обработчик выпадающего списка типа серверов
     */
    cbServerType_onSelect(item) {
        this.currentServerTypeId = item.id;
        this.currentServerTypeCode = item.code;
        if (item.code == "EMAIL") {
            this.cbIsSSL.checkbox({disabled: false});
        } else {
            this.cbIsSSL.checkbox({disabled: true});
        }
    }

    /*
    Обработчик кнопки Ок
     */
    btnOk_onClick() {
        this.CheckDataAndSave();
    }

    /*
    Проверка введённых данных и сохранение
     */
    async CheckDataAndSave() {
        let id = this.txId.textbox("getText");
        let code = this.txCode.textbox("getText");
        let name = this.txName.textbox("getText");
        let port = this.txPort.textbox("getText"); // не обязательное
        let srv_type_id = this.currentServerTypeId;
        let is_ssl = null;
        if (this.currentServerTypeCode == "EMAIL") {
            is_ssl = this.cbIsSSL.checkbox("options").checked ? 1 : 0;
        }
        let line_all = this.txLineAll.textbox("getText");
        let call_name = this.txCallName.textbox("getText"); // не обязательное
        let call_phone = this.txCallPhone.textbox("getText");
        let call_pwd = this.txCallPwd.textbox("getText");
        let proxy_adr = this.txProxyAdr.textbox("getText"); // не обязательное
        let proxy_port = this.txProxyPort.textbox("getText"); // не обязательное
        let proxy_pwd = this.txProxyPwd.textbox("getText"); // не обязательное

        // Проверка данных
        if (this.currentServerTypeId == "") {
            this.ShowToolTip(this.ttServerType, "Укажите тип сервера", {});
            return false;
        }
        if (code.length == 0) {
            this.ShowToolTip(this.ttCode, "Заполните поле \"Адрес\"", {});
            return false;
        }
        if (name.length == 0) {
            this.ShowToolTip(this.ttName, "Заполните поле \"Наименование\"", {});
            return false;
        }
        if (line_all.length == 0) {
            this.ShowToolTip(this.ttLineAll, "Заполните поле \"Всего сессий\"", {});
            return false;
        }

        if (this.currentServerTypeCode == "SPHINX") {
            if (port.length == 0) {
                this.ShowToolTip(this.ttPort, "Заполните поле \"Порт\"")
                return false;
            }
        } else if (this.currentServerTypeCode == "ASTERISK") {
            if (call_phone.length == 0) {
                this.ShowToolTip(this.ttCallPhone, "Заполните поле \"Сообщение от\"", {});
                return false;
            }
            if (call_pwd.length == 0) {
                this.ShowToolTip(this.ttPort, "Заполните поле \"Пароль\"")
                return false;
            }
        } else if (this.currentServerTypeCode == "EMAIL") {
            if (port.length == 0) {
                this.ShowToolTip(this.ttPort, "Заполните поле \"Порт\"")
                return false;
            }
            if (call_name.length == 0) {
                this.ShowToolTip(this.ttCallName, "Заполните поле \"Логин\"")
                return false;
            }
            if (call_pwd.length == 0) {
                this.ShowToolTip(this.ttCallPwd, "Заполните поле \"Пароль\"")
                return false;
            }
        } else if (this.currentServerTypeCode == "SMS") {
        }

        try {
            let checkTypeCode = await this.s_postCTRF("/Servers/checkTypeCode", {
                id: id,
                code: code,
                srv_type_id: srv_type_id
            });
            if (checkTypeCode > 0) {
                this.ShowWarning("Сервер с таким типом и адресом уже существует!");
                return;
            }

            let checkTypeName = await this.s_postCTRF("/Servers/checkTypeName", {
                id: id,
                name: name,
                srv_type_id: srv_type_id
            });
            if (checkTypeName > 0) {
                this.ShowWarning("Сервер с таким типом и наименованием уже существует!");
                return;
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }

        let saveObj = {
            id: id,
            code: code,
            name: name,
            port: port,
            srv_type_id: srv_type_id,
            is_ssl: is_ssl,
            line_all: line_all,
            call_name: call_name,
            call_phone: call_phone,
            call_pwd: call_pwd,
            proxy_adr: proxy_adr,
            proxy_port: proxy_port,
            proxy_pwd: proxy_pwd
        }

        try {
            let id = await this.s_postCTRF("/Servers/save", saveObj);
            if (this.ResultFunc != null) {
                this.ResultFunc(id);
            }
            this.wServersEditForm.window("close");
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }
}