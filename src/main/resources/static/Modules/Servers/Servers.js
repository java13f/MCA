import {ServersEditForm} from "./ServersEditForm.js";

class Servers extends FormView {

    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.rights = {};

        this.ServersIndex = 0;
        this.ServersId = "";

        this.sLoc = new LibLockService(300000);
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId,
            this.GetUrl("/Servers/ServersList?prefix=" + this.prefix),
            this.InitFunc.bind(this));
    }

    /*
    Функция инициализации
     */
    async InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        this.initDataGrid(this.dgServers, this.btnDel, {
            onLoadSuccess: (data) => this.dgServers_onLoadSuccess(data),
            onLoadError: (err) => this.ShowErrorResponse(err)
        });

        this.dgServers.datagrid({
            onDblClickRow: function () {
                this.btnChange_onClick();
            }.bind(this)
        });

        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDel.linkbutton({onClick: this.btnDel_onClick.bind(this)});

        this.cbShowDel.checkbox({
            onChange: function () {
                let selData = this.dgServers.datagrid("getSelected");
                if (selData) {
                    this.ServersId = selData.id;
                }
                this.btnUpdate_onClick();
            }.bind(this)
        });

        try {
            await this.LoadRights();
            if (this.rights.serversView.length > 0) {
                this.ShowWarning(this.rights.serversView);
                return;
            }
            if (this.rights.serversChange.length > 0) {
                this.btnAdd.linkbutton({disabled: true});
            }
            if (this.rights.serversDel.length > 0) {
                this.btnDel.linkbutton({disabled: true});
            }
        } catch (e) {
            this.ShowErrorResponse(e);
            return;
        }

        this.btnUpdate_onClick();

        if (this.prefix == "modal_") {
            $('#heading_Module_Servers').text("Выбор сервера");
            this.pOkCancel.css("visibility", "visible");
            this.wServers = $("#" + this.ModuleId);
            this.InitCloseEvents(this.wServers, false);
            this.btnCancel.linkbutton({
                onClick: function () {
                    this.wServers.window("close")
                }.bind(this)
            });
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        }
    }

    /*
    Функция получения прав
     */
    LoadRights() {
        return $.ajax({
            method: "post",
            url: this.GetUrl('/Servers/getRights'),
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                this.rights.serversView = data.serversView;
                this.rights.serversChange = data.serversChange;
                this.rights.serversOkEnabled = data.serversChange.length == 0;
                this.rights.serversDel = data.serversDel;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    /*
    Обработка загрузки грида
     */
    dgServers_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.ServersId != "") {
                this.dgServers.datagrid("selectRecord", this.ServersId);
                this.ServersId = "";
            } else {
                if (this.ServersIndex >= 0 && this.ServersIndex < data.total) {
                    this.dgServers.datagrid("selectRow", this.ServersIndex);
                } else if (data.total > 0) {
                    this.dgServers.datagrid("selectRow", data.total - 1);
                }
            }
            this.ServersIndex = 0;
        }
    }

    /*
    Обработчик кнопки обновления списка записей
     */
    btnUpdate_onClick() {
        let row = this.dgServers.datagrid("getSelected");
        if (row != null) {
            this.ServersIndex = this.dgServers.datagrid("getRowIndex", row);
            if (this.ServersIndex < 0) this.ServersIndex = 0;
        }
        let showDel = this.cbShowDel.checkbox("options").checked ? "true" : "false";
        this.dgServers.datagrid({
            url: this.GetUrl("/Servers/getList"),
            queryParams: {showDel: showDel}
        });
    }

    /*
    Обработчик кнопки добавления записи
     */
    btnAdd_onClick() {
        if (!this.rights.serversOkEnabled) {
            this.ShowSlide("Предупреждение", this.rights.serversChange)
        } else {
            let form = new ServersEditForm();

            form.SetResultFunc(function (data) {
                this.ServersId = data;
                this.btnUpdate_onClick();
            }.bind(this));

            let options = {};

            options.AddMode = true;
            options.editMode = true;
            options.uuid = "";

            form.Show(options);
        }
    }

    /*
    Обработчик кнопки редактирования записи
     */
    async btnChange_onClick() {
        if (this.dgServers.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения");
            return false;
        }
        let selData = this.dgServers.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для изменения");
            return false;
        }
        let options = {};

        if (selData != null) {
            if (this.rights.serversChange.length == 0) {
                try {
                    options = await this.sLoc.LockRecordAsync("servers", -1, selData.id);
                    if (options.lockMessage.length > 0) {
                        this.ShowSlide("Предупреждение", options.lockMessage);
                    }
                } catch (e) {
                    this.ShowErrorResponse(e);
                }
            } else {
                options.AddMode = false;
                options.editMode = false;
                options.lockState = false;
                options.uuid = selData.id;
            }

            let form = new ServersEditForm();
            form.SetResultFunc((RecId) => {
                this.ServersId = RecId;
                this.btnUpdate_onClick();
            });
            form.SetCloseWindowFunction(async (options) => {
                if (options != null) {
                    if (options.lockState) {
                        try {
                            await this.sLoc.FreeLockRecordAsync("servers", -1, options.uuid);
                        } catch (e) {
                            this.ShowErrorResponse(e);
                        }
                    }
                }
            });
            form.Show(options);
        }
    }

    /*
    Обработчик кнопки удаления записи
     */
    btnDel_onClick() {
        try {
            if (this.rights.serversDel.length > 0) {
                this.ShowWarning(this.rights.serversDel);
                return false;
            }

            if (this.dgServers.datagrid("getRows").length == 0) {
                this.ShowWarning("Нет записей для удаления");
                return false;
            }
            let selData = this.dgServers.datagrid("getSelected");
            if (selData == null) {
                this.ShowWarning("Выберите запись для удаления");
                return false;
            }
            let del = selData.del;
            let header = "Удаление";
            let action = "удалить";
            if (del == 1) {
                header = "Восстановление";
                action = "восстановить";
            }

            $.messager.confirm(header, "Вы действительно хотите " + action + " сервер \"" + selData.name + "\" ?",
                async function (result) {
                    if (result) {
                        this.ServersId = selData.id;
                        let lock = await this.sLoc.StateLockRecordAsync("servers", -1, selData.id);
                        if (lock.data.length > 0) {
                            this.ShowWarning(lock.data);
                        } else
                            this.a_postCTRF("/Servers/delete", {id: lock.uuid}, this.btnUpdate_onClick.bind(this));
                    }
                }.bind(this));
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }
}

export function StartNestedModule(id) {
    let form = new Servers("nested_", {});
    form.Start(id);
}

export function StartModalModul(StartParams, ResultFunc) {
    let id = "wServers_Module_Servers_Servers";
    CreateModalWindow(id, "Справочник \"Сервера\"");
    let form = new Servers("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}