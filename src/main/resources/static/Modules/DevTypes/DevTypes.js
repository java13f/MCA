import {DevTypesFormEdit} from "../DevTypes/DevTypesFormEdit.js";

class DevTypes extends FormView {

    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.DevTypesIndex = 0;
        this.DevTypesId = -1;
        this.sLoc = new LibLockService(300000);
        this.Del = false;
    }

    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + id, this.GetUrl("/DevTypes/DevTypesFormList?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    async InitFunc() {
        try {
            this.InitComponents(this.ModuleId, this.prefix);
            AddKeyboardNavigationForGrid(this.dgDevTypes);

            this.Rights = await this.s_postCTRF("/DevTypes/GetActRights", {});

            this.dgDevTypes.datagrid({
                loadFilter: this.LoadFilter.bind(this),
                onLoadError: (data) => {
                    this.ShowErrorResponse(data);
                },
                onLoadSuccess: this.dgDevTypes_onLoadSuccess.bind(this),
                rowStyler: this.dgDevTypes_rowStyler.bind(this),
                onSelect: this.dgDevTypes_onSelect.bind(this),
            });

            try {
                LoaderCSRFDataForGrid(this.dgDevTypes);

                this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
                this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
                this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
                this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
                this.chkDelRec.checkbox({onChange: this.chkDelRec_onChange.bind(this)});
                this.btnUpdate_onClick()
            } catch (err) {
                this.ShowErrorResponse(err.responseJSON);
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Нажат чекбокс
     * @param checked
     */
    chkDelRec_onChange(checked) {
        if(checked)
            this.Del = true;
        else
            this.Del = false;
        this.btnUpdate_onClick();
    }

    /**
     * Удаление записи
     * @returns {boolean}
     */
    async btnDelete_onClick() {
        try {
            if (this.Rights.devTypesDel.length > 0) {
                this.ShowWarning(this.Rights.devTypesDel);
                return false;
            }

            if (this.dgDevTypes.datagrid("getRows").length == 0) {
                this.ShowWarning("Нет записей для удаления");
                return false;
            }

            let lockRecords = await this.s_postCTRF("/DevTypes/GetLockRecords");
            if(lockRecords.length > 0) {
                this.ShowWarning("Изменение таблицы \"Типы устройств SMS сервера\" запрещено, так как редактируются следующие записи. " + lockRecords);
                return false;
            }

            let selData = this.dgDevTypes.datagrid("getSelected");
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

            $.messager.confirm(header, "Вы действительно хотите " + action + " выбранный тип устройства \"" + selData.name + "\" с Id = " + selData.id + "?",
                function (result) {
                    if (result) {
                        this.sLoc.StateLockRecord("dev_types", -1, selData.id, this.btnContinueDelete_onClick.bind(this));
                    }
                }.bind(this));
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Обработка выбора строки в гриде
     */
    dgDevTypes_onSelect(){
        this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        if(this.dgDevTypes.datagrid("getRows").length != 0){
            let selData = this.dgDevTypes.datagrid("getSelected");
            if(selData != null ){
                if(selData.del == 1){
                    this.btnDelete.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
            }
        }
    }

    /**
     * Продолжение процесса удаления записи
     * @param options
     */
    btnContinueDelete_onClick(options) {
        try {
            if (options.data.length > 0)
                this.ShowWarning(options.data);
            else
                this.a_postCTRF("/DevTypes/Delete", {id: options.uuid}, this.btnUpdate_onClick.bind(this));
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Редактирование записи
     * @returns {boolean}
     */
    btnChange_onClick() {
        try {
            if (this.Rights.devTypesChange.length > 0) {
                $.messager.alert("Предупреждение", this.Rights.devTypesChange, "warning", this.Change.bind(this));
            } else {
                this.Change();
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    MessageAlert(caption, text, icon) {
        return new Promise((resolve, reject) => {
            $.messager.alert(caption, text, icon, function (result) {
                resolve(result);
            })
        });
    }

    async Change() {
        try {
            if (this.dgDevTypes.datagrid("getRows").length == 0) {
                this.ShowWarning("Нет записей для изменения");
                return false;
        }
            let selData = this.dgDevTypes.datagrid("getSelected");
            if (selData == null) {
                this.ShowWarning("Выберите запись для изменения");
                return false;
            }

            let lockRecords = await this.s_postCTRF("/DevTypes/GetLockRecords");
            if(lockRecords.length > 0) {
                await this.MessageAlert("Предупреждение",
                    "Изменение таблицы \"Типы устройств SMS сервера\" запрещено, так как редактируются следующие записи. " + lockRecords, "warning");
            }

            if (this.Rights.devTypesChange.length == 0 && lockRecords.length < 1) {
                this.sLoc.LockRecord("dev_types", -1, selData.id, this.btnContinueChange_onClick.bind(this));
            } else {
                this.btnContinueChange_onClick({
                    id: -1,
                    uuid: selData.id,
                    AddMode: false,
                    editMode: this.Rights.devTypesChange.length == 0 && lockRecords.length < 1 ? true : false,
                    lockMessage: '',
                    lockState: false
                });
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Продолжить процесс редактирования записи
     * @param options
     */
    btnContinueChange_onClick(options) {
        try {
            if (options.lockMessage.length != 0) {
                this.ShowSlide("Предупреждение", options.lockMessage);
                options.editMode = false;
            } else {
                if (options.editMode) {
                    options.lockState = true
                }
            }
            let form = new DevTypesFormEdit();
            form.SetResultFunc((RecId) => {
                this.DevTypesId = RecId;
                this.btnUpdate_onClick();
            });
            form.SetCloseWindowFunction((options) => {
                if (options != null) {
                    if (options.lockState) {
                        this.sLoc.FreeLockRecord("dev_types", -1, options.id);
                    }
                }
            });
            form.Show(options);
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Добавить запись
     */
    async btnAdd_onClick() {
        try {
            if (this.Rights.devTypesChange.length > 0) {
                this.ShowWarning(this.Rights.devTypesChange);
                return false;
            }

            let lockRecords = await this.s_postCTRF("/DevTypes/GetLockRecords");
            if(lockRecords.length > 0) {
                this.ShowWarning("Изменение таблицы \"Типы устройств SMS сервера\" запрещено, так как редактируются следующие записи. " + lockRecords);
                return false;
            }

            let form = new DevTypesFormEdit();
            form.SetResultFunc((RecId) => {
                this.DevTypesId = RecId;
                this.btnUpdate_onClick();
            });
            form.Show({AddMode: true});
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Обновление списка типов устройств
     */
    btnUpdate_onClick() {
        try {
            let row = this.dgDevTypes.datagrid("getSelected");
            if (row != null) {
                this.DevTypesIndex = this.dgDevTypes.datagrid("getRowIndex", row);
                if (this.DevTypesIndex < 0) {
                    this.DevTypesIndex = 0;
                }
            }
            this.dgDevTypes.datagrid({method: "POST", url: this.GetUrl("/DevTypes/GetList?del=" + this.Del)});
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }


    /**
     * Обработка окончания загрузки списка типов устройств
     * @param data - информация о загруженных данных
     */
    dgDevTypes_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.DevTypesId != -1) {
                this.dgDevTypes.datagrid("selectRecord", this.DevTypesId);
            } else {
                if (this.DevTypesIndex >= 0 && this.DevTypesIndex < data.total) {
                    this.dgDevTypes.datagrid("selectRow", this.DevTypesIndex);
                } else if (data.total > 0) {
                    this.dgDevTypes.datagrid("selectRow", data.total - 1);
                }
            }
            this.DevTypesId = -1;
            this.DevTypesIndex = 0;
        }
        else
            this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
    }

    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgDevTypes_rowStyler(index, row) {
        if (row.del == 1) {
            return "background-color:lightgray;color:red";
        }
    }
}

export function StartNestedModule(id){
    let form = new DevTypes("nested_", {});
    form.Start("rDevTypes_Module_DevTypes");
}