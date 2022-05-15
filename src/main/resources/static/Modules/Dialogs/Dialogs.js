import {DialogAllFormEdit} from "../Dialogs/DialogAllFormEdit.js";
import {DialogsFormEdit} from "../Dialogs/DialogsFormEdit.js";
import {MessagesFormEdit} from "../Dialogs/MessagesFormEdit.js";
import {AnswersFormEdit} from "../Dialogs/AnswersFormEdit.js";

export function StartNestedModule(id){
    let form = new Dialogs("nested_", {});
    form.Start(id);
}


class Dialogs extends FormView {
    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;
        this.sLoc = new LibLockService(300000);

        this.SelectedDialogId = -1;
        this.SelectedMessageId = -1;

        this.Dialog = null;
    }

    /**
     * Стартуем
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId, this.GetUrl("/Dialogs/DialogsList"), this.InitFunc.bind(this));
    }


    /**
     * Инициализация компонентов
     * @constructor
     */
    async InitFunc() {
        try {

            this.InitComponents(this.ModuleId, "");

            /** Инициализация гридов */
            this.initDataGrid(this.dgDlgAll, this.btnDeleteDlgAll,{onSelect:()=> this.btnUpdateDlg_onClick(), onLoadSuccess: (data)=> this.updateEmptyGridsDlgAll(data) });
            this.initDataGrid(this.dgDlg   , null,{onSelect:()=> this.btnUpdateMsg_onClick(), onLoadSuccess: (data)=> this.updateEmptyGridsDlg(data) });
            this.initDataGrid(this.dgMsg   , null,{onSelect:()=>  this.btnUpdateAns_onClick(), onLoadSuccess: (data)=> this.updateEmptyGridsMsg(data) });
            this.initDataGrid(this.dgAns   , null,{});

            this.btnCopyDlg.linkbutton({iconCls: "icon-copy"});

            this.Rights = await this.s_postCTRF("/Dialogs/GetActRights", {});

            /** Иницализация кнопок и функций для грида "Общие диалоги" */
            this.btnUpdateDlgAll.linkbutton({onClick: this.btnUpdateDlgAll_onClick.bind(this)});     // Обновить грид "Общие диалоги"
            this.cbDelDlgAll.checkbox ({onChange:this.cbDelDlgAll_onClick.bind(this)});              // Показ удаленных записей в гриде dgDlgAll "Общие диалоги"
            this.btnAddDlgAll.linkbutton({onClick: this.btnAddDlgAll_onClick.bind(this)});           // Добавить запись в грид "Общие диалоги" по нажатию кнопки "Добавить"
            this.btnEditDlgAll.linkbutton({onClick: this.btnEditDlgAll_onClick.bind(this)});         // Редактировать запись в гриде "Общие диалоги" по нажатию кнопки "Изменить"
            this.btnDeleteDlgAll.linkbutton({onClick: this.btnDeleteDlgAll_onClick.bind(this)});     // Удалить запись в гриде "Общие диалоги" по нажатию кнопки "Удалить"
            this.btnActivateDlgAll.linkbutton({onClick: this.btnActivateDlgAll_onClick.bind(this)}); // Активировать запись в гриде "Общие диалоги" по нажатию кнопки "Удалить"
            //this.btnDeactivateDlgAll.linkbutton({onClick: this.btnDeactivateDlgAll_onClick.bind(this)}); // Удалить запись в гриде "Общие диалоги" по нажатию кнопки "Удалить"

            /** Иницализация кнопок и функций для грида "Диалоги оповещения" */
            this.btnUpdateDlg.linkbutton({onClick: this.btnUpdateDlg_onClick.bind(this)});  // Обновить грид "Диалоги оповещения"
            this.btnEditDlg.linkbutton({onClick: this.btnEditDlg_onClick.bind(this)});      // Редактировать запись в гриде "Диалоги оповещения" по нажатию кнопки "Изменить"
            this.btnCopyDlg.linkbutton({onClick: this.btnCopyDlg_onClick.bind(this)});      // Копировать запись в гриде "Диалоги оповещения" по нажатию кнопки "Копи."

            /** Иницализация кнопок и функций для грида "Обращения к абоненту" */
            this.btnUpdateMsg.linkbutton({onClick: this.btnUpdateMsg_onClick.bind(this)});  // Обновить грид "Обращения к абоненту"
            this.btnAddMsg.linkbutton({onClick: this.btnAddMsg_onClick.bind(this)});        // Добавить запись в грид "Обращения к абоненту" по нажатию кнопки "Добавить"
            this.btnEditMsg.linkbutton({onClick: this.btnEditMsg_onClick.bind(this)});      // Редактировать запись в гриде "Обращения к абоненту" по нажатию кнопки "Изменить"
            this.btnDeleteMsg.linkbutton({onClick: this.btnDeleteMsg_onClick.bind(this)});  // Удалить запись в гриде "Обращения к абоненту" по нажатию кнопки "Удалить"

            /** Иницализация кнопок и функций для грида "Ответы абонентов" */
            this.btnUpdateAns.linkbutton({onClick: this.btnUpdateAns_onClick.bind(this)}); // Обновить грид "Ответы абонентов"
            this.btnNextAns.linkbutton({onClick: this.btnNextAns_onClick.bind(this)});     // Функция перехода к следующей записи грида "Обращения к абоненту"
            this.btnAddAns.linkbutton({onClick: this.btnAddAns_onClick.bind(this)});       // Добавить запись в грид  "Ответы абонентов" по нажатию кнопки "Добавить"
            this.btnEditAns.linkbutton({onClick: this.btnEditAns_onClick.bind(this)});     // Редактировать запись в гриде "Ответы абонентов" по нажатию кнопки "Изменить"
            this.btnDeleteAns.linkbutton({onClick: this.btnDeleteAns_onClick.bind(this)}); // Удалить запись в гриде "Ответы абонентов" по нажатию кнопки "Удалить"

            /** Вызов обновления грида "Общие диалоги" */
            this.btnUpdateDlgAll_onClick();

        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Запомнить индекс датагрида
     * @param dg
     */
    rememberIndexDg(dg) {
        let row = dg.datagrid("getSelected");
        if (row != null) {
            dg.index = dg.datagrid("getRowIndex", row);
            if (dg.index < 0) {
                dg.index = 0;
            }
        }
    }

    /**
     * Получить выбранную запись в гриде
     * @param dg
     * @param table_name
     * @param action
     * @param addMode
     * @returns {boolean|*|jQuery}
     */
    getSelectedRow(dg, table_name, action){
        if(dg.datagrid("getRows").length == 0) {
            this.ShowWarning("В таблице " + table_name + " нет записей " + action);
            return false;
        }
        let selData = dg.datagrid("getSelected");
        if(selData == null) {
            this.ShowWarning("Выберите запись в таблице " + table_name);
            return false;
        }

        return selData;
    }

    /**
     * Проверка активности общего диалога
     * @param table_name
     * @param dlg_all_id
     * @returns {Promise<boolean>}
     */
    async isDlgAllActive(table_name, dlg_all_id) {
        let is_active = await this.s_postCTRF("/Dialogs/IsRecActive", {dlg_all_id: dlg_all_id});
        if (is_active == 1) {
            this.ShowWarning("Изменение таблицы \"" + table_name + "\" запрещено так как выбранная запись Id = " +
                dlg_all_id + " в таблице \"Общие диалоги\" является активной!");
            return false;
        }

        return true;
    }

    /**
     * Блокировка изменяемо записи и редактирование или открыть на просмотр
     * @param options
     * @param func
     */
    lockRecAndContinueEdit(options, func) {
        try {
            if (options.right.length == 0 && options.is_active != 1) {
                this.sLoc.LockRecord(options.table_name, -1, options.selectedRow.id, func.bind(this));
            } else {
                func({
                    id: -1,
                    uuid: options.selectedRow.id,
                    AddMode: false,
                    editMode: options.right.length == 0 && options.is_active != 1 ? true : false,
                    lockMessage: '',
                    lockState: false
                });
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * диалог бокс подтверждения выполнения оперции
     * @param action
     * @param msg
     * @returns {Promise<unknown>}
     */
    confirmationDialogBox(action, msg) {
        return new Promise((resolve, reject) => {

            $.messager.confirm(action, msg, (result) => {
                resolve(result);
            });
        });
    }


    /** --------------------------------- Действия с гридом Общие диалоги (dgDlgAll) -----------------------------------*/

    /**
     * Активация, деактивация общего диалога
     * @returns {Promise<boolean>}
     */
    async btnActivateDlgAll_onClick() {
        try {
            if (this.Rights.dlgAllChange.length > 0) {
                this.ShowWarning(this.Rights.dlgAllChange, "warning");
            } else {

                let selectedRow = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"", "");
                let message = -1;
                let title = "Активация";
                let action = "активировать";
                let success = "активирована";
                if(selectedRow.is_active == "1") {
                    title = "Деактивация";
                    action = "деактивировать";
                    success = "деактивирована";
                }

                let result = await this.confirmationDialogBox(title, "Вы действительно хотите " + action + " выбранную запись?");
                if (result) {
                    let state = await this.sLoc.StateLockRecordAsync("dlg_alls", -1, selectedRow.id);
                    if (state.data.length > 0) {
                        this.ShowWarning(state.data);
                        return false;
                    }

                    if(selectedRow.is_active == "0") {
                        let answers = await this.s_postCTRF("/Dialogs/GetAllDialogDTMFPhoneAnswers", {dlg_all_id: selectedRow.id});

                        this.Dialog = await this.s_postCTRF("/Dialogs/GetDialogInfo", {
                            is_dtmf: "0",
                            link_type_code: "phone",
                            dlg_all_id: selectedRow.id
                        });
                        //let checkWord = await this.s_postCTRF("/Voc/CheckWord", { words: wordArray, vocItemId: this.options.voc_id });

                        for (let j = 0; j < answers.length; j++) {
                            let wordArray = answers[j].value.split(" ");
                            for (let i = 0; i < wordArray.length; i++) {
                                let checkWord = await this.s_postCTRF("/Voc/CheckWord", {
                                    word: wordArray[i],
                                    vocItemId: this.Dialog.voc_id
                                });
                                let regex = /В словаре уже есть добавляемое слово/;

                                if (checkWord.length > 0 && !regex.test(checkWord)) {
                                    this.ShowWarning(checkWord);
                                    return false;
                                } else {
                                    this.s_postCTRF("/Voc/Save", {word: wordArray[i], vocItemId: this.Dialog.voc_id});
                                }
                            }
                        }

                        message = await this.s_postCTRF("/Dialogs/ActivateDlgAll", {dlg_all_id: selectedRow.id});
                    }
                    else if (selectedRow.is_active == "1") {
                        message = await this.s_postCTRF("/Dialogs/DeactivateDlgAll", {dlg_all_id: selectedRow.id});
                    }
                }



                if (message != "0" && message != -1) {
                    this.ShowWarning(message);
                    return false;
                } else if (message == "0") {
                    $.messager.alert("Информация", "Запись успешно " + success, "info");
                    this.btnUpdateDlgAll_onClick();
                }
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }


    /**
     * Редактирование записи грида Общие диалоги
     * @returns {boolean}
     */
    btnEditDlgAll_onClick() {
        if (this.Rights.dlgAllChange.length > 0) {
            $.messager.alert("Предупреждение", this.Rights.dlgAllChange, "warning", this.EditDlgAll.bind(this));
        }
        else {
            this.EditDlgAll();
        }
    }

    EditDlgAll() {
        let selectedRowDgDlgAll = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"",  "для изменения");
        if(!selectedRowDgDlgAll) return false;

        if (this.Rights.dlgAllChange.length == 0) {
            this.sLoc.LockRecord("dlg_alls", -1, selectedRowDgDlgAll.id, this.ContinueEditDlgAll.bind(this));
        } else {
            this.ContinueEditDlgAll({
                id: -1,
                uuid: selectedRowDgDlgAll.id,
                AddMode: false,
                editMode: this.Rights.dlgAllChange.length == 0 ? true : false,
                lockMessage: '',
                lockState: false
            });
        }
    }

    /**
     * Продолжить процесс редактирования записи датагрида "Общие диалоги"
     * @param options
     */
    ContinueEditDlgAll(options){
        try {
            if (options.lockMessage.length != 0) {
                this.ShowSlide("Предупреждение", options.lockMessage);
                options.editMode = false;
            } else {
                if (options.editMode) {
                    options.lockState = true
                }
            }
            let form = new DialogAllFormEdit();
            form.SetResultFunc((RecId) => {
                this.dgDlgAll.id = RecId;
                this.btnUpdateDlgAll_onClick();
            });
            form.SetCloseWindowFunction((options) => {
                if (options != null) {
                    if (options.lockState) {
                        this.sLoc.FreeLockRecord("dlg_alls", -1, options.id);
                    }
                }
            });
            form.Show(options);
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Удаление записи
     * @returns {boolean}
     */
    async btnDeleteDlgAll_onClick(){
        try {
            if (this.Rights.dlgAllDel.length > 0) {
                this.ShowWarning(this.Rights.dlgAllDel);
                return false;
            }

            let selectedRow = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"", "для удаления");
            if (!selectedRow) return false;

            if(selectedRow.is_active == "1") {
                this.ShowWarning("Невозможно удалить общий диалог, так как он яляется активированным");
                return false;
            }

            let del = selectedRow.del;
            let header = "Удаление";
            let action = "удалить";
            if (del == 1) {
                header = "Восстановление";
                action = "восстановить";
            }

            let result = await this.confirmationDialogBox(header,
                "Вы действительно хотите " + action + " выделенный тип устройства \"" + selectedRow.name + "\" с Id = " + selectedRow.id + "?");
            if (result) {
                this.sLoc.StateLockRecord("dlg_alls", -1, selectedRow.id, this.ContinueDeleteDlgAll.bind(this));
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Продолжение процесса удаления записи
     * @param options
     */
    ContinueDeleteDlgAll(options) {
        try {
            if (options.data.length > 0)
                this.ShowWarning(options.data);
            else
                this.a_postCTRF("/Dialogs/DeleteDialogAll", {id: options.uuid}, this.btnUpdateDlgAll_onClick.bind(this));

        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Добавить запись в грид "Общие диалоги" по нажатию кнопки "Добавить"
     */
    btnAddDlgAll_onClick() {
        try {
            if (this.Rights.dlgAllChange.length > 0) {
                this.ShowWarning(this.Rights.dlgAllChange);
                return false;
            }

            let form = new DialogAllFormEdit();
            form.SetResultFunc((RecId) => {
                this.dgDlgAll.id = RecId;
                this.btnUpdateDlgAll_onClick();
            });
            form.Show({AddMode: true});
        } catch (e) {
                this.ShowErrorResponse(e);
            }
    }

    /**
     * Нажали кнопку Обновить для "Общие диалоги"
     */
    btnUpdateDlgAll_onClick() {
        try {

            this.rememberIndexDg(this.dgDlgAll);

            this.dgDlgAll.datagrid({
                url: this.GetUrl("/Dialogs/DialogAllsGrid"),
                queryParams: {str: this.cbDelDlgAll.checkbox("options").checked}
            });
            this.btnUpdateDlg_onClick();
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    updateEmptyGridsDlgAll(data) {
        if(data.total == 0) {
            this.dgDlg.datagrid("loadData", []);
            this.dgMsg.datagrid("loadData", []);
            this.dgAns.datagrid("loadData", []);
        }
    }

    /**
     * Нажали птичку Показ удаленных записей на гриеде Общие диалоги (dgDlgAll)
     */
    cbDelDlgAll_onClick() {
        try {

            this.rememberIndexDg(this.dgDlgAll);

            this.dgDlgAll.datagrid({
                url: this.GetUrl("/Dialogs/DialogAllsGrid"),
                queryParams: {str: this.cbDelDlgAll.checkbox("options").checked}
            });
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /** --------------------------------- ######################################## -----------------------------------*/


    /** ------------------------------ Действия с гридом Диалоги оповещения (dgDlg) ---------------------------------*/

    /**
     * Нажали кнопку Обновить для Диалогов оповещения
     */
    btnUpdateDlg_onClick() {
        try {
            this.rememberIndexDg(this.dgDlg);
            this.dgDlg.datagrid({ onDblClickRow: null });

            var dial_data = this.dgDlgAll.datagrid("getData");
            if (dial_data.total == 0) {
                this.dgDlg.datagrid("loadData", []);
                this.dgMsg.datagrid("loadData", []);
                this.dgAns.datagrid("loadData", []);
                return;
            }

            let dlgAllRow = this.dgDlgAll.datagrid("getSelected");
            if(dlgAllRow.is_active == "1") {
                this.btnActivateDlgAll.linkbutton({iconCls: "icon-deactive", text: "Деактив."});
            } else {
                this.btnActivateDlgAll.linkbutton({iconCls: "icon-active", text: "Актив."});
            }

            this.dgDlg.datagrid({url: this.GetUrl("/Dialogs/DialogsGrid"), queryParams: {str: dlgAllRow.id }});

        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    updateEmptyGridsDlg(data) {
        if(data.total == 0) {
            this.dgMsg.datagrid("loadData", []);
            this.dgAns.datagrid("loadData", []);
        }
    }

    btnCopyDlg_onClick() {
        if (this.Rights.dialogChange.length > 0)
            $.messager.alert("Предупреждение", this.Rights.dialogChange, "warning", this.CopyDlg().bind(this));
        else
            this.CopyDlg();
    }

    async CopyDlg() {
        try {
            let selectedRow = this.getSelectedRow(this.dgDlg, "\"Диалоги оповещения\"", "для копирования");
            if (!selectedRow) return false;

            let selectedRowDgDlgAll = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"", "");
            if (!selectedRowDgDlgAll) return false;

            let is_active = await this.s_postCTRF("/Dialogs/IsRecActive", {dlg_all_id: selectedRowDgDlgAll.id});
            if (is_active == 1) {
                $.messager.alert("Предупреждение", "Копирование записей в таблице \"Диалого оповещений\" запрещено так как выбранная запись Id = " +
                    selectedRowDgDlgAll.id + " в таблице \"Общие диалоги\" является активной!", "warning");
            } else {

                $.messager.alert("Предупреждение", "По двойному нажатию на строке таблицы выберите куда копировать текущую запись", "warning", function () {
                    this.dgDlg.datagrid({
                        onDblClickRow: async function (index, row) {
                            try {
                                let CopyToRow = row;

                                if (CopyToRow.id == selectedRow.id) {
                                    $.messager.alert("Предупреждение", "Нельзя копировать выбранный диалог оповощения " + selectedRow.name +
                                        "\" Id = " + selectedRow.id + " в самого себя", "warning");
                                    return false;
                                }

                                if (CopyToRow.link_type_code == "SMS&Mail") {
                                    $.messager.alert("Предупреждение", "Не возможно копировать запись \"" + selectedRow.name +
                                        "\" Id = " + selectedRow.id + " в запись \"" + CopyToRow.name + "\" Id = " + CopyToRow.id, "warning");
                                    return false;
                                }

                                let copy = await this.s_postCTRF("/Dialogs/CopyDialog",
                                    {
                                        dlg_all_id: selectedRowDgDlgAll.id,
                                        copy_to_row_id: CopyToRow.id,
                                        copy_from_row_id: selectedRow.id
                                    });

                                this.btnUpdateDlg_onClick();
                                $.messager.alert("Информация", "Общий диалог успешно скопирован!", "info");
                            } catch (e) {
                                this.ShowErrorResponse(e);
                            }
                        }.bind(this)
                    });

                }.bind(this));
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Редактирование записи грида Диалоги оповещения
     * @returns {boolean}
     */
    btnEditDlg_onClick() {
        if (this.Rights.dialogChange.length > 0)
            $.messager.alert("Предупреждение", this.Rights.dialogChange, "warning", this.EditDlg.bind(this));
        else
            this.EditDlg();
    }

    async EditDlg() {
        try {
            let selectedRow = this.getSelectedRow(this.dgDlg, "\"Диалоги оповещения\"", "для изменения");
            if(!selectedRow) return false;

            let selectedRowDgDlgAll = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"",  "");
            if(!selectedRowDgDlgAll) return false;

            let is_active = await this.s_postCTRF("/Dialogs/IsRecActive", {dlg_all_id: selectedRowDgDlgAll.id});
            if (is_active == 1) {
                $.messager.alert("Предупреждение", "Изменение таблицы \"Диалого оповещений\" запрещено так как выбранная запись Id = " +
                    selectedRowDgDlgAll.id + " в таблице \"Общие диалоги\" является активной!", "warning", function () {

                    this.lockRecAndContinueEdit({ is_active: is_active, table_name: "dialogs", selectedRow: selectedRow, right: this.Rights.dialogChange }, this.ContinueEditDlg.bind(this));

                }.bind(this));
            } else {
                this.lockRecAndContinueEdit({ is_active: is_active, table_name: "dialogs", selectedRow: selectedRow, right: this.Rights.dialogChange }, this.ContinueEditDlg.bind(this));
            }

        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Продолжить процесс редактирования записи датагрида "Диалоги оповещения"
     * @param options
     */
    ContinueEditDlg(options) {
        try {
            if (options.lockMessage.length != 0) {
                this.ShowSlide("Предупреждение", options.lockMessage);
                options.editMode = false;
            } else {
                if (options.editMode) {
                    options.lockState = true
                }
            }
            let form = new DialogsFormEdit();
            form.SetResultFunc((RecId) => {
                this.dgDlg.id = RecId;
                this.btnUpdateDlg_onClick();
            });
            form.SetCloseWindowFunction((options) => {
                if (options != null) {
                    if (options.lockState) {
                        this.sLoc.FreeLockRecord("dialogs", -1, options.id);
                    }
                }
            });
            form.Show(options);
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }


    /** --------------------------------- ######################################## -----------------------------------*/




    /** --------------------------------- Действия с гридом Обращения к абонентам (dgMsg) 0003 -----------------------------------*/

    /**
     * Нажали кнопку Обновить на гриде Обращения к абонентам
     */
    btnUpdateMsg_onClick() {
        try {
            this.rememberIndexDg(this.dgMsg);

            let dial_data = this.dgDlg.datagrid("getData");
            if (dial_data.total == 0) {
                this.dgMsg.datagrid("loadData", []);
                this.dgAns.datagrid("loadData", []);
                return;
            }
            let dial_id = this.dgDlg.datagrid("getSelected").id;

            this.dgMsg.datagrid({url: this.GetUrl("/Dialogs/MessageGrid"), queryParams: {str: dial_id}});
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    updateEmptyGridsMsg(data) {
        if(data.total == 0) {
            this.dgAns.datagrid("loadData", []);
        }
    }

    /**
     * Добавить запись в грид "Обращения к абонентам" по нажатию кнопки "Добавить"
     */
    async btnAddMsg_onClick() {
        try {
            if (this.Rights.messagesChange.length > 0) {
                this.ShowWarning(this.Rights.messagesChange);
                return false;
            }

            let selectedRowDgDlg = this.getSelectedRow(this.dgDlg, "\"Общие диалоги\"", ", невозможно добавить запись в таблицу \"Обращения к абоненту\"");
            let selectedRowDgDlgAll = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"", "");

            if(!await this.isDlgAllActive("Обращения к абонентам", selectedRowDgDlgAll.id)) return false;

            let form = new MessagesFormEdit();
            form.SetResultFunc((RecId) => {
                this.dgMsg.id = RecId;
                this.btnUpdateMsg_onClick();
            });
            form.Show({AddMode: true, dialog_id: selectedRowDgDlg.id});
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }


    /**
     * Редактирование записи грида Обращения к абонентам
     * @returns {boolean}
     */
    btnEditMsg_onClick() {
        if (this.Rights.messagesChange.length > 0) {
            $.messager.alert("Предупреждение", this.Rights.messagesChange, "warning", this.EditMsg.bind(this));
        }
        else {
            this.EditMsg();
        }
    }

    async EditMsg() {
        try {
            let selectedRow = this.getSelectedRow(this.dgMsg, "\"Обращения к абонентам\"", "для изменения");
            if(!selectedRow) return false;

            let selectedRowDgDlg = this.getSelectedRow(this.dgDlg, "\"Диалоги оповещения\"", "");
            if(!selectedRowDgDlg) return false;

            let selectedRowDgDlgAll = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"", "");
            if(!selectedRowDgDlgAll) return false;

            this.SelectedDialogId = selectedRowDgDlg.id;
            let is_active = await this.s_postCTRF("/Dialogs/IsRecActive", {dlg_all_id: selectedRowDgDlgAll.id});
            if (is_active == 1) {
                $.messager.alert("Предупреждение", "Изменение таблицы \"Обращения к абонентам\" запрещено так как выбранная запись Id = " +
                    selectedRowDgDlgAll.id + " в таблице \"Общие диалоги\" является активной!", "warning", function () {

                    this.lockRecAndContinueEdit({ is_active: is_active, table_name: "messages", selectedRow: selectedRow, right: this.Rights.messagesChange }, this.ContinueEditMsg.bind(this));

                }.bind(this));
            } else {
                this.lockRecAndContinueEdit({ is_active: is_active, table_name: "messages", selectedRow: selectedRow, right: this.Rights.messagesChange }, this.ContinueEditMsg.bind(this));
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Продолжить процесс редактирования записи датагрида "Обращения к абонентам"
     * @param options
     */
    ContinueEditMsg(options) {
        try {
            if (options.lockMessage.length != 0) {
                this.ShowSlide("Предупреждение", options.lockMessage);
                options.editMode = false;
            } else {
                if (options.editMode) {
                    options.lockState = true
                }
            }

            if(this.SelectedDialogId != -1)
                options.dialog_id = this.SelectedDialogId;
            let form = new MessagesFormEdit();
            form.SetResultFunc((RecId) => {
                this.dgMsg.id = RecId;
                this.btnUpdateMsg_onClick();
            });
            form.SetCloseWindowFunction((options) => {
                if (options != null) {
                    if (options.lockState) {
                        this.sLoc.FreeLockRecord("messages", -1, options.id);
                    }
                }
            });
            form.Show(options);
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Удаление сообщения к пользователю
     * @returns {boolean}
     */
    async btnDeleteMsg_onClick() {
        try {

            if (this.Rights.messagesDel.length > 0) {
                this.ShowWarning(this.Rights.messagesDel);
                return false;
            }

            let selectedMessage = this.getSelectedRow(this.dgMsg, "\"Обращения к абонентам\"", "для удаления");
            if (!selectedMessage) return false;

            let selectedRowDgDlgAll = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"", "");
            if (!selectedRowDgDlgAll) return false;

            let confirmDeleteMessage = await this.confirmationDialogBox("Удаление", "Вы действительно хотите удалить выбранное обращение к абоненту \"" +
                selectedMessage.info_ru + "\" Id = " + selectedMessage.id + "?");

            if (confirmDeleteMessage) {

                let messageState = await this.sLoc.StateLockRecordAsync("messages", -1, selectedMessage.id);
                if (messageState.data.length > 0) {
                    this.ShowWarning(messageState.data);
                    return false;
                }

                let foreign_key_next_msg = await this.s_postCTRF("/Dialogs/IsForeignKey", {message_id: selectedMessage.id});
                if (foreign_key_next_msg.length > 0) {
                    this.ShowWarning("Невозможно удалить обращение к абоненту так как оно " +
                        "используется в качестве следующего обращения в таких ответах абонента: " + foreign_key_next_msg);
                    return false;
                }

                let answers = await this.s_postCTRF("/Dialogs/GetAnswers", {message_id: selectedMessage.id});

                if (answers.length == 0) {
                    if (!await this.isDlgAllActive("Обращения к абонентам", selectedRowDgDlgAll.id)) return false;

                    this.ContinueDeleteMsg(messageState);
                } else {
                    let confirmDeleteAllAnswer = await this.confirmationDialogBox("Подтверждение удаления",
                        "Все ответы абонентов для выбранного обращения буду удалены. \nВы уверены?");
                    if (confirmDeleteAllAnswer) {
                        for (let i = 0; i > answers.length; i++) {
                            let answerState = await this.sLoc.StateLockRecordAsync("answers", -1, selectedMessage.id);

                            if (answerState.data.length > 0) {
                                this.ShowWarning(answerState.data);
                                return false;
                            }
                        }

                        if (!await this.isDlgAllActive("Обращения к абонентам", selectedRowDgDlgAll.id)) return false;

                        this.ContinueDeleteMsg(messageState);
                    }
                }
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Продолжение процесса удаления записи "Обращения к абоненту"
     * @param options
     */
    ContinueDeleteMsg(options) {
        try {
            this.a_postCTRF("/Dialogs/DeleteMessage", {
                id: options.uuid,
            }, this.btnUpdateMsg_onClick.bind(this));
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /** --------------------------------- ######################################## -----------------------------------*/



    /** --------------------------------- Действия с гридом Ответы абонентов (dgAns) 0004 -----------------------------------*/

    /**
     * Нажали кнопку Обновить для Ответы абонентов
     */
    btnUpdateAns_onClick() {
        try {

            this.rememberIndexDg(this.dgAns);

            let dial_data = this.dgMsg.datagrid("getData");
            if (dial_data.total == 0) {
                this.dgAns.datagrid("loadData", []);
                return;
            }

            this.dgAns.datagrid({url: this.GetUrl("/Dialogs/AnswerGrid"), queryParams: { str: this.dgMsg.datagrid("getSelected").id }});
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     Кнопка Перейти к следующему вопросу
    */
    btnNextAns_onClick(){
        if(this.dgAns.datagrid('getData').total==0){
            this.ShowSlide("Предупреждение...", "В Ответах абонента нет строк.");
            return;
        }

        let ans_next_id = this.dgAns.datagrid('getSelected').next_msg_id;
        let msg_rows = this.dgMsg.datagrid('getData').rows;
        for(let i = 0; i < msg_rows.length; i++){
            if(msg_rows[i].id == ans_next_id){
                this.dgMsg.datagrid("selectRow", i);
                return;
            }
        }
    }

    async btnAddAns_onClick() {
        try {
            if (this.Rights.answersChange.length > 0) {
                this.ShowWarning(this.Rights.answersChange);
                return false;
            }

            let selectedRowDgMsg = this.getSelectedRow(this.dgMsg, "\"Обращения к абоненту\"",
                ", невозможно добавить запись в таблицу \"Ответы абоненту\"");
            if(!selectedRowDgMsg) return false;

            let selectedRowDgDialogs = this.getSelectedRow(this.dgDlg, "\"Диалоги оповещения\"", "");
            if(!selectedRowDgDialogs) return false;


            if(selectedRowDgDialogs.link_type_code == 'SMS&Mail') {
                this.ShowWarning("В таблицу \"Ответы абонентов\" нельзя добавлять записи для выбранной записи \"" + selectedRowDgDialogs.link_type_name +
                    "\" таблицы \"Диалоги оповещения\"");
                return false;
            }

            let selectedRowDgDlgAll = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"", "");
            if(!selectedRowDgDlgAll) return false;

            if(!await this.isDlgAllActive("Ответы абонентов", selectedRowDgDlgAll.id)) return false;

            this.Dialog = await this.s_postCTRF("/Dialogs/GetDialogInfo", { id: selectedRowDgDialogs.id });

            let form = new AnswersFormEdit();
            form.SetResultFunc((RecId) => {
                this.dgAns.id = RecId;
                this.btnUpdateAns_onClick();
            });
            form.Show({AddMode: true, message_id: selectedRowDgMsg.id, dlg_all_id: selectedRowDgDlgAll.id,
                voc_id: this.Dialog.voc_id, dialog_id: this.Dialog.id, is_dtmf: this.Dialog.is_dtmf, link_type_code: this.Dialog.link_type_code });
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Редактирование записи грида Обращения к абонентам
     * @returns {boolean}
     */
    btnEditAns_onClick() {
        if (this.Rights.answersChange.length > 0) {
            $.messager.alert("Предупреждение", this.Rights.answersChange, "warning", this.EditAns.bind(this));
        }
        else {
            this.EditAns();
        }
    }

    async EditAns() {
        try {
            let selectedRow = this.getSelectedRow(this.dgAns, "\"Ответы абонентов\"", "для изменения");
            if(!selectedRow) return false;

            let selectedRowDgMsg = this.getSelectedRow(this.dgMsg, "\"Обращения к абоненту\"", "");
            if(!selectedRowDgMsg) return false;

            let selectedRowDgDlg = this.getSelectedRow(this.dgDlg, "\"Диалоги оповещения\"", "");
            if(!selectedRowDgDlg) return false;

            let selectedRowDgDlgAll = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"", "");
            if(!selectedRowDgDlgAll) return false;

            this.Dialog = await this.s_postCTRF("/Dialogs/GetDialogInfo", { id: selectedRowDgDlg.id });
            this.SelectedMessageId = selectedRowDgMsg.id;

            let is_active = await this.s_postCTRF("/Dialogs/IsRecActive", { dlg_all_id: selectedRowDgDlgAll.id });
            if (is_active == 1) {
                $.messager.alert("Предупреждение", "Изменение таблицы \"Ответы абонентов\" запрещено так как выбранная запись Id = " +
                    selectedRowDgDlgAll.id + " в таблице \"Общие диалоги\" является активной!", "warning", function () {

                    this.lockRecAndContinueEdit({ is_active: is_active, table_name: "answers", selectedRow: selectedRow, right: this.Rights.answersChange }, this.ContinueEditAns.bind(this));

                }.bind(this));
            } else {
                this.lockRecAndContinueEdit({ is_active: is_active, table_name: "answers", selectedRow: selectedRow, right: this.Rights.answersChange }, this.ContinueEditAns.bind(this));
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Продолжить процесс редактирования записи датагрида "Обращения к абонентам"
     * @param options
     */
    ContinueEditAns(options) {
        try {
            if (options.lockMessage.length != 0) {
                this.ShowSlide("Предупреждение", options.lockMessage);
                options.editMode = false;
            } else {
                if (options.editMode) {
                    options.lockState = true
                }
            }

            let selectedRowDgDlgAll = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"", "");
            if(!selectedRowDgDlgAll) return false;

            if(this.SelectedMessageId != -1)
                options.message_id = this.SelectedMessageId;

            options.dlg_all_id = selectedRowDgDlgAll.id;
            options.voc_id = this.Dialog.voc_id;
            options.dialog_id = this.Dialog.id;
            options.is_dtmf = this.Dialog.is_dtmf;
            options.link_type_code = this.Dialog.link_type_code;
            let form = new AnswersFormEdit();
            form.SetResultFunc((RecId) => {
                this.dgAns.id = RecId;
                this.btnUpdateAns_onClick();
            });
            form.SetCloseWindowFunction((options) => {
                if (options != null) {
                    if (options.lockState) {
                        this.sLoc.FreeLockRecord("answers", -1, options.id);
                    }
                }
            });
            form.Show(options);
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Удаление записи
     * @returns {boolean}
     */
     async btnDeleteAns_onClick() {
        try {
            if (this.Rights.answersDel.length > 0) {
                this.ShowWarning(this.Rights.answersDel);
                return false;
            }

            let selectedRow = this.getSelectedRow(this.dgAns, "\"Ответы абонентов\"", "для удаление");
            if (!selectedRow) return false;

            let selectedRowDgDlgAll = this.getSelectedRow(this.dgDlgAll, "\"Общие диалоги\"", "");
            if (!selectedRowDgDlgAll) return false;

            let result = await this.confirmationDialogBox("Удаление",
                "Вы действительно хотите удалить выбранный ответ абонента \"" + selectedRow.value + "\" с Id = " + selectedRow.id + "?");

            if (!result)
                return false;

            if (!await this.isDlgAllActive("Ответы абонента", selectedRowDgDlgAll.id)) return false;

            this.sLoc.StateLockRecord("answers", -1, selectedRow.id, this.ContinueDeleteAns.bind(this));
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Продолжение процесса удаления записи "Ответы абонетов"
     * @param options
     */
    ContinueDeleteAns(options) {
        try {
            if (options.data.length > 0)
                this.ShowWarning(options.data);
            else
                this.a_postCTRF("/Dialogs/DeleteAnswer", {id: options.uuid}, this.btnUpdateAns_onClick.bind(this));
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /** --------------------------------- ######################################## -----------------------------------*/

}