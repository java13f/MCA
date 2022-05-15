import {PatternEdit} from "./PatternEdit.js";
import {NoteEdit} from "./NoteEdit.js";
import {NoteFilter} from "./NoteFilter.js";
import {PinList} from "./PinList.js";

class Notes extends FormView {
    constructor(ModuleId, prefix) {
        super();
        this.options = {AddMode:true};
        this.sLoc = new LibLockService(300000);
        this.ModuleId = ModuleId;
        this.prefix = prefix;
        this.NotesRight = {};
        this.Mode = true;
        this.InPatternId = "";
        this.InNoteId = "";
        this.InPatternIndex = 0;
        this.InNoteIndex = 0;
        this.PatternFilter = {};
        this.Filter = {
            showDel: 0,
            chkStart: 0,
            chkEnd: 0,
            dateStart: '',
            dateEnd: '',
            name: '',
            abonId: '',
            dlgAllId: '',
            sttsId: ''
        };
    }
    /**
     * Стартовая функция
     */
    Start() {
        this.NotesRight.noteView = 'Не удалось получить право на просмотр \"Менеджера заданий на оповещение\"';
        this.NotesRight.noteChange = 'Не удалось получить право на изменение списка заданий на оповещение \"Менеджера заданий на оповещение\"';
        this.NotesRight.noteDel = 'Не удалось получить право на удаление заданий на оповещение \"Менеджера заданий на оповещение\"';
        this.NotesRight.patternChange = 'Не удалось получить право на изменение списка шаблонов заданий на оповещение \"Менеджера заданий на оповещение\"';
        this.NotesRight.patternDel = 'Не удалось получить право на удаление шаблонов заданий на оповещение \"Менеджера заданий на оповещение\"';
        this.NotesRight.noteRun = 'Не удалось получить право на запуск.остановку заданий \"Менеджера заданий на оповещение\"';
        this.PatternFilter.showDel = 0;
        LoadForm("#" + this.ModuleId, this.GetUrl("/Notes/NotesForm?prefix=" + this.prefix), this.InitFunc.bind(this));
    }
    /**
     * Инициализация компонентов формы
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        if (document.getElementById('sNoteStyle_Module_Notes_NotesForm') === null) {
            $('head').append('<link id="sNoteStyle_Module_Notes_NotesForm" rel="stylesheet" type="text/css" href="../css/imgs/notes/notes.css"/>');
        }
        this.blockLoader.hide();
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnNoteCancel.linkbutton({onClick: function () { this.wNotes.window("close"); }.bind(this)});
        this.btnPatternAdd.linkbutton({onClick: this.btnPatternAdd_onClick.bind(this)});
        this.btnPatternChange.linkbutton({onClick: this.btnPatternChange_onClick.bind(this)});
        this.btnNoteAdd.linkbutton({onClick: this.btnNoteAdd_onClick.bind(this)});
        this.btnNoteChange.linkbutton({onClick: this.btnNoteChange_onClick.bind(this)});
        if(this.prefix != "modal_") {
            this.btnOk.hide();
            this.btnNoteCancel.hide();
        }
        else {
            this.btnPatternAdd.hide();
            this.btnPatternChange.hide();
            this.btnPatternDel.hide();
            this.btnNoteAdd.hide();
            this.btnNoteChange.hide();
            this.btnNoteDel.hide();
            this.btnNoteRun.hide();
        }
        this.btnPatternReload.linkbutton({onClick: this.btnPatternReload_onClick.bind(this)});
        this.btnNoteReload.linkbutton({onClick: this.btnNoteReload_onClick.bind(this)});
        this.btnPatternDel.linkbutton({onClick: this.btnPatternDel_onClick.bind(this)});
        this.btnNoteDel.linkbutton({onClick: this.btnNoteDel_onClick.bind(this)});
        this.btnNoteRun.linkbutton({onClick: this.btnNoteRun_onClick.bind(this)});
        this.btnNoteFilter.linkbutton({onClick: this.btnNoteFilter_onClick.bind(this)});
        this.dgPattern.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgPattern_onLoadSuccess.bind(this),
            onSelect: this.dgPattern_onSelect.bind(this),
            rowStyler: this.dg_rowStyler.bind(this),
            singleSelect: true
        });
        AddKeyboardNavigationForGrid(this.dgPattern);
        LoaderCSRFDataForGrid(this.dgPattern);
        this.dgNote.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgNote_onLoadSuccess.bind(this),
            onSelect: this.dgNote_onSelect.bind(this),
            onUnselect: this.dgNote_onUnselect.bind(this),
            rowStyler: this.dg_rowStyler.bind(this),
            singleSelect: true
        });
        AddKeyboardNavigationForGrid(this.dgNote);
        LoaderCSRFDataForGrid(this.dgNote);
        this.dgNote.datagrid('getColumnOption', 'date').sorter = ((a, b)=> {
            return (this.dtParse(a) > this.dtParse(b) ? 1 : -1);
        }).bind(this);
        this.dgPattern.datagrid('getColumnOption', 'allFlag').formatter = ((val, row)=> {
            return val == 1 ? 'Да' : 'Нет';
        }).bind(this);
        this.rbPattern.radiobutton({onChange: function (state) {
                if(state) {
                    this.Mode = true;
                    this.ReloadLists();
                }
            }.bind(this)
        });
        this.rbNote.radiobutton({onChange: function (state) {
                if(state) {
                    this.Mode = false;
                    this.ReloadLists();
                }
            }.bind(this)
        });
        this.rbPattern.radiobutton("check");
        this.chbPatternDel.checkbox({onChange: function (state) {
                this.PatternFilter.showDel = state ? 1 : 0;
                this.btnPatternReload_onClick();
            }.bind(this)
        });
        this.LoadRights();
    }

    dg_rowStyler(index, row) {
        if(row.del == 1) {
            return "background:gray;color:red;";
        }
    }
    /**
     * Обновление списков
     */
    ReloadLists() {
        if (this.Mode) {
            this.btnPatternReload_onClick();
        }
        else {
            this.btnNoteReload_onClick();
        }
    }
    /**
     * Парсер даты
     * @param str - дата строкой
     */
    dtParse(str){
        let dttm = (str.split(' '));
        let dt = (dttm[0].split('.'));
        let tm = (dttm[1].split(':'));

        let y = parseInt(dt[2],10);
        let m = parseInt(dt[1],10);
        let d = parseInt(dt[0],10);

        let ss = parseInt(tm[2],10);
        let mm = parseInt(tm[1],10);
        let hh = parseInt(tm[0],10);

        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            try {
                Date.parse(d+ "." + (m - 1) + '.' + y);
                let dtTemp = new Date(y,m - 1, d);
                if (dtTemp.getDate() != d || dtTemp.getMonth() + 1 != m || dtTemp.getFullYear() != y) {
                    return null;
                }
                if (!isNaN(hh) && !isNaN(mm) && !isNaN(ss)) {
                    return new Date(y,m - 1, d, hh, mm, ss);
                }
                return new Date(y,m - 1, d);
            }
            catch (e) {
                return null;
            }
        }
        else {
            return null;
        }
    }

    dgPattern_onLoadSuccess(data) {
        this.dgPattern.datagrid('unselectAll');
        if(data.total > 0) {
            if(this.InPatternId != "") {
                for (let i=0; i<data.rows.length; i++) {
                    if (data.rows[i].id == this.InPatternId) {
                        this.dgPattern.datagrid("selectRecord", this.InPatternId);
                        return;
                    }
                }
                this.InPatternId = "";
            }
            if (this.InPatternIndex >= 0 && this.InPatternIndex < data.total) {
                this.dgPattern.datagrid("selectRow", this.InPatternIndex);
            } else if (data.total > 0) {
                this.dgPattern.datagrid("selectRow", data.total - 1);
            }
            this.InPatternIndex = 0;
        }
    }

    dgNote_onLoadSuccess(data) {
        this.dgNote.datagrid('unselectAll');
        if(data.total > 0) {
            if(this.InNoteId != "") {
                for (let i=0; i<data.rows.length; i++) {
                    if (data.rows[i].id == this.InNoteId) {
                        this.dgNote.datagrid("selectRecord", this.InNoteId);
                        return;
                    }
                }
                this.InNoteId = "";
            }
            if (this.InNoteIndex >= 0 && this.InNoteIndex < data.total) {
                this.dgNote.datagrid("selectRow", this.InNoteIndex);
            } else if (data.total > 0) {
                this.dgNote.datagrid("selectRow", data.total - 1);
            }
            this.InNoteIndex = 0;
        }
    }

    dgPattern_onSelect(index, row) {
        if(row != null) {
            this.InPatternId = row.id;
        }
        else {
            this.InPatternId = "";
        }
        if(row != null && row.del == 1) {
            this.btnPatternDel.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
        }
        else {
            this.btnPatternDel.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
        if(this.Mode) {
            this.btnNoteReload_onClick();
        }
    }

    dgNote_onSelect(index, row) {
        if(row != null) {
            this.InNoteId = row.id;
        }
        else {
            this.InNoteId = "";
        }
        if(row != null && row.del == 1) {
            this.btnNoteDel.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
        }
        else {
            this.btnNoteDel.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
        if(row != null && row.sttsCode == '001') {
            this.btnNoteRun.linkbutton({iconCls:"icon-stop", text:"&nbsp;&nbsp;&nbsp;Стоп&nbsp;&nbsp;&nbsp;"});
        }
        else {
            this.btnNoteRun.linkbutton({iconCls:"icon-run", text:"&nbsp;&nbsp;&nbsp;Пуск&nbsp;&nbsp;&nbsp;"});
        }
        if(!this.Mode) {
            this.btnPatternReload_onClick();
        }
    }

    dgNote_onUnselect(index, row){
        this.btnNoteRun.linkbutton({iconCls:"icon-run", text:"&nbsp;&nbsp;&nbsp;Пуск&nbsp;&nbsp;&nbsp;"});
    }

    btnNoteFilter_onClick() {
        let form = new NoteFilter();
        form.SetResultFunc(function (filter) {
            this.btnNoteReload_onClick();
        }.bind(this));
        form.Show(this.Filter);
    }

    async btnNoteRun_onClick() {
        if(!this.IsOneSelected(this.dgNote)) {
            this.ShowWarning("Выберете для запуска/остановки одну запись!");
            return;
        }
        let note = this.dgNote.datagrid('getSelected');
        let res = await this.CheckRunStopFromState(note.id, note.sttsCode);
        if(res.length > 0) {
            this.ShowWarning(res);
            this.btnNoteReload_onClick();
        }
        else {
            this.RunOrStopNote(note.id, note.sttsCode);
        }
    }
    /**
     * Проверяет выполнение действия в другом экземпляре программы
     * @param id - идентификатор задания
     * @param stts - флаг состояния задания
     */
    async CheckRunStopFromState(id, stts) {
        let noteStts = await this.GetNoteStts(id);
        if(noteStts.del == 1) {
            return 'С удаленной записью нельзя выполнять операции запуска или остановки.';
        }
        if(noteStts.code == '001' && stts == noteStts.code) {
            return '';
        }
        else if(noteStts.code == '001' && stts != noteStts.code) {
            return'Задание уже было запущено другим пользователем';
        }
        else if(noteStts.code != '001' && stts == noteStts.code) {
            return '';
        }
        else if(noteStts.code != '001' && stts != noteStts.code) {
            return'Задание уже было остановлено другим пользователем';
        }
    }
    /**
     * Запуск или остановка задания
     * @param id - идентификатор задания
     * @param sttsCode - флаг состояния задания
     */
    async RunOrStopNote(id, sttsCode) {
        let chkPins = []; // Список контактов, которые невозможно оповестить
        if(sttsCode != '001') {
            chkPins = await this.GetPinsNoNotify(id);
        }
        if(chkPins.length > 0) {
            let form = new PinList();
            form.SetResultFunc(function() {
                this.Run(id, sttsCode, chkPins);
            }.bind(this));
            form.Show(chkPins);
        }
        else {
            this.Run(id, sttsCode, chkPins);
        }
    }

    /**
     * Продолжение с подеверждением запуска или остановки задания
     * @param id - идентификатор задания
     * @param sttsCode - флаг состояния задания
     * @param chkPins - список контактов, которые невозможно оповестить
     */
    Run(id, sttsCode, chkPins) {
        // Проверка прав на запуск\остановку заданий
        if(this.NotesRight.noteRun.length > 0){
            this.ShowSlide("Предупреждение", this.NotesRight.noteRun);
            return;
        }
        // запрос подтверждения действия
        let act = sttsCode != '001' ? 'запустить' : 'остановить';
        $.messager.confirm('Подтверждение', "Подтвердите, что вы действительно хотите&nbsp;" + act + "&nbsp;задание на оповещение c id = " + id + ".", async function(result){
            if(result) {
                // Повторная проверка выполняемого действия (не выполнено ли уже в другом экземпляре)
                let res = await this.CheckRunStopFromState(id, sttsCode);
                if(res.length > 0) {
                    this.ShowWarning(res);
                }
                else {
                    // Блокируем запись если не заблокирована
                    this.sLoc.LockRecord("notes", -1, id, async function(options) {
                        if(options.lockMessage.length !== 0) {
                            this.ShowSlide("Предупреждение", options.lockMessage);
                        }
                        else {
                            this.StartStopLoader(true, sttsCode != '001' ? 'Запуск&#133;' : 'Остановка&#133;');
                            // Пишем протокол (контакты)
                            let logRes = '';
                            if (chkPins.length > 0) {
                                logRes = await this.AddPinsToLog(chkPins);
                            }
                            if (logRes.length === 0) {
                                // здесь вызов функции note()
                                let isRun = await this.RunOrStopNotify(id);
                                if(isRun) {
                                    setTimeout(() => {this.btnNoteReload_onClick();}, 2000);
                                }
                            } else {
                                this.ShowError(logRes);
                            }
                            if(options != null) {
                                this.sLoc.FreeLockRecord("notes", -1, options.uuid);
                            }
                            this.StartStopLoader(false, '');
                        }
                    }.bind(this));
                }
            }
        }.bind(this));
    }
    /**
     * Запуск или остановка задания
     * @param noteId - идентификатор задания
     */
    RunOrStopNotify(noteId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: {noteId},
                url: this.GetUrl('/Notes/RunOrStopNotify'),
                headers: GetCSRFTokenHeader(),
                success: function(data) {
                    if(data.errorMsg.length > 0) {
                        this.ShowError(data.errorMsg);
                    }
                    else if(data.successMsg.length > 0) {
                        this.ShowInformation(data.successMsg);
                    }
                    resolve(true);
                }.bind(this),
                error: function(data) {
                    this.ShowErrorResponse(data);
                    resolve(false);
                }.bind(this)
            });
        });
    }
    /**
     * Запуск\остановка лоадера
     * @param state - флаг состояния (true, false)
     * @param text - текст сообщения
     */
    StartStopLoader(state, text) {
        this.lbLoader.html(text);
        if(state) {
            this.blockLoader.show();
        }
        else {
            this.blockLoader.hide();
        }
        this.btnNoteAdd.linkbutton({disabled: state});
        this.btnNoteChange.linkbutton({disabled: state});
        this.btnNoteDel.linkbutton({disabled: state});
        this.btnNoteReload.linkbutton({disabled: state});
        this.btnNoteFilter.linkbutton({disabled: state});
        this.btnNoteRun.linkbutton({disabled: state});
    }
    /**
     * Запись контактов, которые невозможно оповестить в протокол
     * @param chkPins - список контактов, которые невозможно оповестить
     */
    AddPinsToLog(chkPins) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: JSON.stringify(chkPins),
                url: this.GetUrl('/Notes/AddPinsToLog'),
                contentType: "application/json; charset=utf-8",
                headers: GetCSRFTokenHeader(),
                success: function(data) {
                    resolve(data);
                }.bind(this),
                error: function(data) {
                    resolve(data.responseJSON.message);
                }.bind(this)
            });
        });
    }

    btnPatternDel_onClick() {
        if(!this.IsOneSelected(this.dgPattern)) {
            this.ShowWarning("Выберете для удаления одну запись!");
            return;
        }
        let pattern = this.dgPattern.datagrid('getSelected');
        let id = pattern.id;
        this.sLoc.LockRecord("patterns", -1, id, async function(options) {
            if(options.lockMessage.length !== 0) {
                this.ShowSlide("Предупреждение", options.lockMessage);
            }
            else {
                await $.ajax({
                    method: "post",
                    data: {id},
                    url: this.GetUrl('/Notes/DelPattern'),
                    headers: GetCSRFTokenHeader(),
                    success: function (data) {
                        this.btnPatternReload_onClick();
                    }.bind(this),
                    error: function (data) {
                        this.ShowErrorResponse(data);
                    }.bind(this)
                });
                if(options != null) {
                    this.sLoc.FreeLockRecord("patterns", -1, options.uuid);
                }
            }
        }.bind(this));
    }

    async btnNoteDel_onClick() {
        if(!this.IsOneSelected(this.dgNote)) {
            this.ShowWarning("Выберете для удаления одну запись!");
            return;
        }
        let note = this.dgNote.datagrid('getSelected');
        let noteStts = await this.GetNoteStts(note.id);
        if(noteStts.code == '001') {
            this.ShowWarning('Нельзя пометить на удаление задание, которое выполняется');
            return ;
        }
        let id = note.id;
        this.sLoc.LockRecord("notes", -1, id, async function(options) {
            if(options.lockMessage.length !== 0) {
                this.ShowSlide("Предупреждение", options.lockMessage);
            }
            else {
                await $.ajax({
                    method: "post",
                    data: {id},
                    url: this.GetUrl('/Notes/DelNote'),
                    headers: GetCSRFTokenHeader(),
                    success: function (data) {
                        this.btnNoteReload_onClick();
                    }.bind(this),
                    error: function (data) {
                        this.ShowErrorResponse(data);
                    }.bind(this)
                });
                if(options != null) {
                    this.sLoc.FreeLockRecord("notes", -1, options.uuid);
                }
            }
        }.bind(this));
    }

    btnPatternReload_onClick() {
        let patternFilter = {};
        patternFilter.showDel = this.PatternFilter.showDel;
        patternFilter.noteId = "";
        if(!this.Mode) {
            let note = this.dgNote.datagrid('getSelected');
            patternFilter.noteId = note.id;
        }
        this.dgPattern.datagrid({url:this.GetUrl("/Notes/GetPatterns"), queryParams: patternFilter});
    }

    btnNoteReload_onClick() {
        this.btnNoteRun.linkbutton({iconCls:"icon-run", text:"&nbsp;&nbsp;&nbsp;Пуск&nbsp;&nbsp;&nbsp;"});
        this.Filter.patternId = "";
        if(this.Mode) {
            let pattern = this.dgPattern.datagrid('getSelected');
            this.Filter.patternId = pattern.id;
        }
        this.dgNote.datagrid({url:this.GetUrl("/Notes/GetNotes"), queryParams: this.Filter});
    }

    btnPatternAdd_onClick() {
        let form = new PatternEdit();
        form.SetResultFunc(function (RecId) {
            this.InPatternId= RecId;
            this.btnPatternReload_onClick();
        }.bind(this));
        let options = {};
        options.AddMode = true;
        options.FormMode = 0;
        options.uuid = "";
        form.Show(options);
    }

    btnNoteAdd_onClick() {
        let pattern = this.dgPattern.datagrid('getSelected');
        if(pattern == null) {
            this.ShowWarning('Не выбран шаблон');
            return;
        }
        if(pattern.del == 1) {
            this.ShowWarning('Нельзя добавить задание по удаленному шаблону.<br>Сначала восстановите шаблон.');
            return
        }
        let form = new NoteEdit();
        form.SetResultFunc(function (RecId) {
            this.InNoteId= RecId;
            this.btnNoteReload_onClick();
        }.bind(this));
        let options = {};
        options.AddMode = true;
        options.FormMode = 0;
        options.uuid = "";
        options.patternId = pattern.id;
        form.Show(options);
    }

    btnPatternChange_onClick() {
        if(!this.IsOneSelected(this.dgPattern)) {
            this.ShowWarning("Выберете для редактирования одну запись!");
            return;
        }
        let pattern = this.dgPattern.datagrid("getSelected");
        if(pattern.del == 1) {
            this.ShowWarning("Сначала восстановите запись для редактирования");
            return;
        }
        if(this.NotesRight.patternChange.length === 0) {
            this.sLoc.LockRecord("patterns", -1, pattern.id, this.btnContinueEditPattern_onClick.bind(this));
        }
        else {
            this.btnContinueEditPattern_onClick({uuid: pattern.id, lockMessage: this.NotesRight.patternChange });
        }
    }

    btnContinueEditPattern_onClick(options) {
        if(options.lockMessage.length !== 0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new PatternEdit();
        form.SetResultFunc((RecId)=>{
            this.InPatternId= RecId;
            this.btnPatternReload_onClick();
        });
        form.SetCloseWindowFunction((options)=>{
            if(options != null) {
                if(options.lockState && this.NotesRight.patternChange.length === 0){
                    this.sLoc.FreeLockRecord("patterns", -1, options.uuid);
                }
            }
        });
        options.okenabled = this.NotesRight.patternChange.length === 0;
        options.FormMode = 1;
        form.Show(options);
    }

    async btnNoteChange_onClick() {
        if(!this.IsOneSelected(this.dgNote)) {
            this.ShowWarning("Выберете для редактирования одну запись!");
            return;
        }
        let note = this.dgNote.datagrid("getSelected");
        if(note.del == 1) {
            this.ShowWarning("Сначала восстановите запись для редактирования");
            return;
        }
        let noteStts = await this.GetNoteStts(note.id);
        if(noteStts.code == '001') {
            this.btnContinueEditNote_onClick({uuid: note.id, lockMessage: "Нельзя редактировать задание, которое выполняется.<br>Только просмотр"});
        }
        else {
            if (this.NotesRight.noteChange.length === 0) {
                this.sLoc.LockRecord("notes", -1, note.id, this.btnContinueEditNote_onClick.bind(this));
            } else {
                this.btnContinueEditNote_onClick({uuid: note.id, lockMessage: this.NotesRight.noteChange});
            }
        }
    }

    btnContinueEditNote_onClick(options) {
        if(options.lockMessage.length !== 0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new NoteEdit();
        form.SetResultFunc((RecId)=>{
            this.InNoteId= RecId;
            this.btnNoteReload_onClick();
        });
        form.SetCloseWindowFunction((options)=>{
            if(options != null) {
                if(options.lockState && this.NotesRight.noteChange.length === 0){
                    this.sLoc.FreeLockRecord("notes", -1, options.uuid);
                }
            }
        });
        options.okenabled = this.NotesRight.noteChange.length === 0;
        options.FormMode = 1;
        form.Show(options);
    }

    btnOk_onClick() {
        if(this.dgNote.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgNote.datagrid("getSelected");
        if(selData == null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc != null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wNotes.window("close");
        return false;
    }
    /**
     * Проверка состояния задания
     * @param id - идентификатор задания
     */
    GetPinsNoNotify(id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: {id},
                url: this.GetUrl('/Notes/GetPinsNoNotify'),
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
    /**
     * Статус задания
     * @param noteId - идентификатор задания
     */
    GetNoteStts(noteId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: {noteId},
                url: this.GetUrl('/Notes/GetNoteStts'),
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
    /**
     * Проверка, что выбрана одна запись в списке
     * @param grid - элемент datagrid
     */
    IsOneSelected(grid){
        let items = grid.datagrid("getData").rows;
        let itemsSel = grid.datagrid("getSelections");
        if(items.length > 0 && itemsSel.length === 1) {
            return true;
        }
        return false;
    }
    /**
     * Загрузка прав
     */
    LoadRights() {
        $.ajax({
            method: "post",
            url: this.GetUrl('/Notes/GetActRights'),
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                this.NotesRight = data;
                this.btnPatternReload_onClick();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}

export function StartNestedModule(id){
    let form = new Notes(id, "nested_");
    form.Start();
}

export function StartModalModule(StartParams, ResultFunc) {
    let id = "wNotes_Module_Notes_NotesForm";
    CreateModalWindow(id, "Оповещения");
    let form = new Notes("wNotes_Module_Notes_NotesForm", "modal_");
    form.SetResultFunc(ResultFunc);
    form.Start();
}