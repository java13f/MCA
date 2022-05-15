import {PhraseEdit} from "./PhraseEdit.js";
import {PhraseGroupEdit} from "./PhraseGroupEdit.js";
import {PhraseFilter} from "./PhraseFilter.js";

class Phrase extends FormView {
    constructor(ModuleId, prefix) {
        super();
        this.sLoc = new LibLockService(300000);
        this.ModuleId = ModuleId;
        this.prefix = prefix;
        this.isGroupDelView = false;
        this.InGroupIndex = 0;
        this.InGroupId = "";
        this.InPhraseIndex = 0;
        this.InPhraseId = "";
        this.Rights = {};
        this.Filter = {};
    }

    /**
     * Стартовая функция
     */
    Start() {
        this.Filter.code = "";
        this.Filter.text = "";
        this.Filter.filename = "";
        this.Filter.showdel = false;
        this.Rights.phraseView = 'Не удалось получить права на действие PhraseView';
        this.Rights.phraseChange = 'Не удалось получить права на действие PhraseChange';
        this.Rights.phraseOkEnabled = false;
        this.Rights.phraseDel = 'Не удалось получить права на действие PhraseDel';
        this.Rights.phraseGrpChange = 'Не удалось получить права на действие PhraseGrpChange';
        this.Rights.phraseGrpOkEnabled = false;
        this.Rights.phraseGrpDel = 'Не удалось получить права на действие PhraseGrpDel';
        LoadForm("#" + this.ModuleId, this.GetUrl("/Phrase/PhraseForm?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    /**
     * Инициализация формы
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        if (document.getElementById('sStylePhrase_Module_Phrase_PhraseForm') === null) {
            $('head').append('<link id="sStylePhrase_Module_Phrase_PhraseForm" rel="stylesheet" type="text/css" href="../css/imgs/phrase/phrase.css"/>');
        }
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        if(this.prefix != "modal_") {
            this.btnOk.hide();
            this.btnCancel.hide();
        }
        this.btnCancel.linkbutton({onClick: function(){ this.wPhrase.window("close") }.bind(this)});
        this.btnAddGroup.linkbutton({onClick: this.btnAddGroup_onClick.bind(this)});
        this.btnAddPhrase.linkbutton({onClick: this.btnAddPhrase_onClick.bind(this)});
        this.btnChangeGroup.linkbutton({onClick: this.btnChangeGroup_onClick.bind(this)});
        this.btnChangePhrase.linkbutton({onClick: this.btnChangePhrase_onClick.bind(this)});
        this.btnDelGroup.linkbutton({onClick: this.btnDelGroup_onClick.bind(this)});
        this.btnDelPhrase.linkbutton({onClick: this.btnbtnDelPhrase_onClick.bind(this)});
        this.btnRefrashGroup.linkbutton({onClick: this.btnRefrashGroup_onClick.bind(this)});
        this.btnRefrashPhrase.linkbutton({onClick: this.btnRefrashPhrase_onClick.bind(this)});
        this.btnFilterPhrase.linkbutton({onClick: this.btnFilterPhrase_onClick.bind(this)});
        this.chbDelGroup.checkbox({checked: this.isGroupDelView});
        this.chbDelGroup.checkbox({checked: this.isGroupDelView});
        this.chbDelGroup.checkbox({onChange: function (state) {
                this.isGroupDelView = state;
                this.btnRefrashGroup_onClick();
            }.bind(this)
        });
        this.dgGroup.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgGroup_onLoadSuccess.bind(this),
            rowStyler: this.dg_rowStyler.bind(this),
            onSelect: this.dgGroup_onSelect.bind(this),
            singleSelect: true
        });
        this.dgPhrase.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgPhrase_onLoadSuccess.bind(this),
            rowStyler: this.dg_rowStyler.bind(this),
            onSelect: this.dgPhrase_onSelect.bind(this),
            singleSelect: true
        });
        AddKeyboardNavigationForGrid(this.dgGroup);
        LoaderCSRFDataForGrid(this.dgGroup);
        AddKeyboardNavigationForGrid(this.dgPhrase);
        LoaderCSRFDataForGrid(this.dgPhrase);
        this.LoadRights();
        this.btnRefrashGroup_onClick();
    }

    /**
     * Событие выбора записи списка групп фраз
     */
    dgGroup_onSelect(){
        let row = this.dgGroup.datagrid("getSelected");
        let btnPhraseDisabled = true;
        if(row != null && row.del == 1) {
            this.btnDelGroup.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
            btnPhraseDisabled = true;
        }
        else {
            this.btnDelGroup.linkbutton({iconCls:"icon-remove", text:"Удалить"});
            btnPhraseDisabled = false;
        }
        this.btnAddPhrase.linkbutton({disabled: btnPhraseDisabled});
        this.btnChangePhrase.linkbutton({disabled: btnPhraseDisabled});
        this.btnDelPhrase.linkbutton({disabled: btnPhraseDisabled});
        this.btnRefrashPhrase.linkbutton({disabled: btnPhraseDisabled});
        this.btnFilterPhrase.linkbutton({disabled: btnPhraseDisabled});
        this.btnRefrashPhrase_onClick();
    }

    /**
     * Событие выбора записи списка фраз
     */
    dgPhrase_onSelect() {
        let row = this.dgPhrase.datagrid("getSelected");
        if(row != null && row.del == 1) {
            this.btnDelPhrase.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
        }
        else {
            this.btnDelPhrase.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }

    /**
     * Событие окончания успешной загрузки списка групп фраз
     */
    dgGroup_onLoadSuccess(data) {
        this.dgGroup.datagrid('unselectAll');
        if(data.total > 0) {
            if(this.InGroupId != "") {
                this.dgGroup.datagrid("selectRecord", this.InGroupId);
                this.InGroupId = "";
            }
            else {
                if (this.InGroupIndex >= 0 && this.InGroupIndex < data.total) {
                    this.dgGroup.datagrid("selectRow", this.InGroupIndex);
                } else if (data.total > 0) {
                    this.dgGroup.datagrid("selectRow", data.total - 1);
                }
            }
            this.InGroupIndex = 0;
        }
        this.btnRefrashPhrase_onClick();
    }

    /**
     * Событие окончания успешной загрузки списка фраз
     */
    dgPhrase_onLoadSuccess(data){
        this.dgPhrase.datagrid('unselectAll');
        if(data.total > 0) {
            if(this.InPhraseId != "") {
                this.dgPhrase.datagrid("selectRecord", this.InPhraseId);
                this.InPhraseId = "";
            }
            else {
                if (this.InPhraseIndex >= 0 && this.InPhraseIndex < data.total) {
                    this.dgPhrase.datagrid("selectRow", this.InPhraseIndex);
                } else if (data.total > 0) {
                    this.dgPhrase.datagrid("selectRow", data.total - 1);
                }
            }
            this.InPhraseIndex = 0;
        }
    }

    /**
     * Стиль строки списка
     */
    dg_rowStyler(index, row) {
        if(row.del == 1) {
            return "background:gray;color:red;";
        }
    }

    /**
     * Действие по кнопке ОК вызванного модально справочника фраз
     */
    btnOk_onClick() {
        if(this.dgPhrase.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgPhrase.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(selData.del == 1) {
            this.ShowWarning("Нельзя выбрать запись помеченную на удаление");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wPhrase.window("close");
        return false;
    }

    /**
     * Вызов фильтра фраз
     */
    btnFilterPhrase_onClick() {
        let form = new PhraseFilter();
        form.SetResultFunc(()=>{
            this.btnRefrashPhrase_onClick();
        });
        form.Show(this.Filter);
    }

    /**
     * Добавление группы фраз
     */
    btnAddGroup_onClick(){
        if(!this.Rights.phraseGrpOkEnabled){
            this.ShowSlide("Предупреждение", this.Rights.phraseGrpChange)
        }
        else {
            let form = new PhraseGroupEdit();
            form.SetResultFunc(function (data) {
                this.InGroupId = data;
                this.btnRefrashGroup_onClick();
            }.bind(this));
            let options = {};
            options.AddMode = true;
            options.FormMode = 0;
            options.uuid = "";
            form.Show(options);
        }
    }

    /**
     * Добавление фразы
     */
    btnAddPhrase_onClick(){
        if(!this.Rights.phraseOkEnabled){
            this.ShowSlide("Предупреждение", this.Rights.phraseChange)
        }
        else {
            let form = new PhraseEdit();
            form.SetResultFunc(function (data) {
                this.InPhraseId = data;
                this.btnRefrashPhrase_onClick();
            }.bind(this));
            let options = {};
            options.AddMode = true;
            options.FormMode = 0;
            options.uuid = "";
            let group = this.dgGroup.datagrid('getSelected');
            options.phraseGrpId = group.id;
            form.Show(options);
        }
    }

    /**
     * Проверка на одну выбранную строку в списке
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
     * Редактирование группы фраз
     */
    btnChangeGroup_onClick() {
        if(!this.IsOneSelected(this.dgGroup)) {
            this.ShowWarning("Выберете для редактирования одну запись!");
            return;
        }
        if(this.Rights.phraseView.length > 0) {
            this.ShowWarning(this.Rights.phraseView);
            return;
        }
        let grp = this.dgGroup.datagrid("getSelected");
        if(grp.del == 1) {
            this.ShowWarning("Сначала восстановите запись для редактирования");
            return;
        }
        if(this.Rights.phraseGrpOkEnabled) {
            this.sLoc.LockRecord("phrase_grps", -1, grp.id, this.btnContinueEditGrp_onClick.bind(this));
        }
        else {
            this.btnContinueEditGrp_onClick({uuid: grp.id, lockMessage: this.Rights.phraseGrpChange});
        }
    }

    btnContinueEditGrp_onClick(options) {
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new PhraseGroupEdit();
        form.SetResultFunc((RecId)=>{
            this.InGroupId = RecId;
            this.btnRefrashGroup_onClick();
        });
        form.SetCloseWindowFunction((options)=>{
            try{
                form.Stop();
            }
            catch (e) {}
            if(options != null) {
                if(options.lockState && this.Rights.phraseGrpOkEnabled){
                    this.sLoc.FreeLockRecord("phrase_grps", -1, options.uuid);
                }
            }
        });
        options.okenabled = this.Rights.phraseGrpOkEnabled;
        options.FormMode = 1;
        form.Show(options);
    }

    /**
     * Редактирование фразы
     */
    btnChangePhrase_onClick(){
        if(!this.IsOneSelected(this.dgPhrase)) {
            this.ShowWarning("Выберете для редактирования одну запись!");
            return;
        }
        if(this.Rights.phraseView.length > 0) {
            this.ShowWarning(this.Rights.phraseView);
            return;
        }
        let phrase = this.dgPhrase.datagrid("getSelected");
        if(phrase.del == 1) {
            this.ShowWarning("Сначала восстановите запись для редактирования");
            return;
        }
        if(this.Rights.phraseOkEnabled) {
            this.sLoc.LockRecord("phrases", -1, phrase.id, this.btnContinueEditPhrase_onClick.bind(this));
        }
        else {
            this.btnContinueEditPhrase_onClick({uuid: phrase.id, lockMessage: this.Rights.phraseChange});
        }
    }

    btnContinueEditPhrase_onClick(options) {
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new PhraseEdit();
        form.SetResultFunc((RecId)=>{
            this.InPhraseId = RecId;
            this.btnRefrashPhrase_onClick();
        });
        form.SetCloseWindowFunction((options)=>{
            try{ form.StopAudioCancel();} catch (e) {}
            if(options != null) {
                if(options.lockState && this.Rights.phraseOkEnabled){
                    this.sLoc.FreeLockRecord("phrases", -1, options.uuid);
                }
            }
        });
        let group = this.dgGroup.datagrid('getSelected');
        options.okenabled = this.Rights.phraseOkEnabled;
        options.FormMode = 1;
        options.phraseGrpId = group.id;
        form.Show(options);
    }

    /**
     * Удаление группы фраз
     */
    btnDelGroup_onClick() {
        if(this.Rights.phraseGrpDel.length > 0){
            this.ShowSlide("Предупреждение", this.Rights.phraseGrpDel)
        }
        else {
            if(!this.IsOneSelected(this.dgGroup)) {
                this.ShowWarning("Выберете для удаления одну запись!");
                return;
            }
            let group = this.dgGroup.datagrid('getSelected');
            let id = group.id;
            this.sLoc.LockRecord("phrase_grps", -1, id, async function(options) {
                if(options.lockMessage.length !== 0) {
                    this.ShowSlide("Предупреждение", options.lockMessage);
                }
                else {
                    await $.ajax({
                        method: "post",
                        data: {id},
                        url: this.GetUrl('/Phrase/DelGroup'),
                        headers: GetCSRFTokenHeader(),
                        success: function (data) {
                            this.btnRefrashGroup_onClick();
                        }.bind(this),
                        error: function (data) {
                            this.ShowErrorResponse(data);
                        }.bind(this)
                    });
                    if(options != null) {
                        this.sLoc.FreeLockRecord("phrase_grps", -1, options.uuid);
                    }
                }
            }.bind(this));
        }
    }

    /**
     * Удаление фразы
     */
    btnbtnDelPhrase_onClick() {
        if(this.Rights.phraseDel.length > 0){
            this.ShowSlide("Предупреждение", this.Rights.phraseDel)
        }
        else {
            if(!this.IsOneSelected(this.dgPhrase)) {
                this.ShowWarning("Выберете для удаления одну запись!");
                return;
            }
            let phrase = this.dgPhrase.datagrid("getSelected");
            let id = phrase.id;
            this.sLoc.LockRecord("phrases", -1, id, async function(options) {
                if(options.lockMessage.length !== 0) {
                    this.ShowSlide("Предупреждение", options.lockMessage);
                }
                else {
                    await $.ajax({
                        method: "post",
                        data: {id},
                        url: this.GetUrl('/Phrase/DelPhrase'),
                        headers: GetCSRFTokenHeader(),
                        success: function (data) {
                            this.btnRefrashPhrase_onClick();
                        }.bind(this),
                        error: function (data) {
                            this.ShowErrorResponse(data);
                        }.bind(this)
                    });
                    if(options != null) {
                        this.sLoc.FreeLockRecord("phrases", -1, options.uuid);
                    }
                }
            }.bind(this));
        }
    }

    /**
     * Обновление списка групп фраз
     */
    btnRefrashGroup_onClick() {
        this.btnDelGroup.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        let row = this.dgGroup.datagrid("getSelected");
        if(row != null) {
            this.InGroupIndex = this.dgGroup.datagrid("getRowIndex", row);
        }
        let groupFilter = {};
        groupFilter.showDel = this.isGroupDelView;
        this.dgGroup.datagrid({url:this.GetUrl("/Phrase/GetPhraseGroups"), queryParams: groupFilter});
    }

    /**
     * Обновление списка фраз
     */
    btnRefrashPhrase_onClick(){
        this.btnDelPhrase.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        let row = this.dgPhrase.datagrid("getSelected");
        if(row != null) {
            this.InPhraseIndex = this.dgPhrase.datagrid("getRowIndex", row);
        }
        let phraseFilter = {};
        let group = this.dgGroup.datagrid('getSelected');
        phraseFilter.phraseGrpId = group.id;
        phraseFilter.filter = this.Filter;
        this.dgPhrase.datagrid({url:this.GetUrl("/Phrase/GetPhrases"), queryParams: phraseFilter});
    }

    /**
     * Загрузка прав
     */
    LoadRights() {
        $.ajax({
            method: "post",
            url: this.GetUrl('/Phrase/GetActRights'),
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                this.Rights.phraseView = data.phraseView;
                this.Rights.phraseChange = data.phraseChange;
                this.Rights.phraseOkEnabled = data.phraseChange.length === 0;
                this.Rights.phraseDel = data.phraseDel;
                this.Rights.phraseGrpChange = data.phraseGrpChange;
                this.Rights.phraseGrpOkEnabled = data.phraseGrpChange.length === 0;
                this.Rights.phraseGrpDel = data.phraseGrpDel;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}

export function StartNestedModule(id){
    let form = new Phrase(id, "nested_");
    form.Start();
}

export function StartModalModule(StartParams, ResultFunc) {
    let id = "wPhrase_Module_Phrase_PhraseForm";
    CreateModalWindow(id, "Справочник фраз");
    let form = new Phrase("wPhrase_Module_Phrase_PhraseForm", "modal_");
    form.SetResultFunc(ResultFunc);
    form.Start();
}