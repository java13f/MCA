import {VocEdit} from "./VocEdit.js";
import {VocItemEdit} from "./VocItemEdit.js";

class Voc extends FormView {
    constructor(ModuleId, prefix) {
        super();
        this.sLoc = new LibLockService(300000);
        this.ModuleId = ModuleId;
        this.prefix = prefix;
        this.IndgVocIndex = 0;
        this.Word = "";
        this.Rights = {};
        this.showDel = false;
        this.InVocItemId = "";
        this.InVocItemIndex = 0;
    }

    Start() {
        this.Rights.vocView = "Не удалось загрузить права на просмотр Словаря";
        this.Rights.vocChange = "Не удалось загрузить права на изменение Словаря";
        this.Rights.vocDel = "Не удалось загрузить права на удаление слов из Словаря";
        LoadForm("#" + this.ModuleId, this.GetUrl("/Voc/VocForm?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        if(this.prefix != "modal_") {
            this.btnOk.hide();
            this.btnCancel.hide();
        }
        this.btnCancel.linkbutton({onClick: function(){ this.wVoc.window("close") }.bind(this)});
        this.btnVocsItemAdd.linkbutton({onClick: this.btnVocsItemAdd_onClick.bind(this)});
        this.btnVocsItemChange.linkbutton({onClick: this.btnVocsItemChange_onClick.bind(this)});
        this.btnVocsItemDel.linkbutton({onClick: this.btnVocsItemDel_onClick.bind(this)});
        this.btnVocsItemReload.linkbutton({onClick: this.btnVocsItemReload_onClick.bind(this)});
        this.dgVocItems.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgVocItems_onLoadSuccess.bind(this),
            rowStyler: this.dg_rowStyler.bind(this),
            onSelect: this.dgVocItems_onSelect.bind(this),
            singleSelect: true
        });
        AddKeyboardNavigationForGrid(this.dgVocItems);
        LoaderCSRFDataForGrid(this.dgVocItems);
        this.chbVocsItemDel.checkbox({onChange: function (state) {
                this.showDel = state;
                this.btnVocsItemReload_onClick();
            }.bind(this)
        });

        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnDel.linkbutton({onClick: this.btnDel_onClick.bind(this)});
        this.btnReload.linkbutton({onClick: this.btnReload_onClick.bind(this)});
        this.InitSearch();
        this.dgVoc.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgVoc_onLoadSuccess.bind(this),
            singleSelect: true
        });
        AddKeyboardNavigationForGrid(this.dgVoc);
        LoaderCSRFDataForGrid(this.dgVoc);
        this.LoadRights();
    }

    InitSearch(){
        this.tbVocsItemSearch.textbox({
            inputEvents: $.extend({}, this.tbVocsItemSearch.textbox.defaults.inputEvents,{
                keyup: function(e){ this.btnVocsItemReload_onClick(); }.bind(this)
            })
        });
        $('#' + this.prefix + 'tbVocsItemSearch_Voc_Module_Voc').textbox('textbox').bind('paste', function(e){
            setTimeout(()=>{ this.btnVocsItemReload_onClick(); }, 200);
        }.bind(this));
        $('#' + this.prefix + 'tbVocsItemSearch_Voc_Module_Voc').textbox('textbox').bind('cut', function(e){
            setTimeout(()=>{ this.btnVocsItemReload_onClick(); }, 200);
        }.bind(this));

        this.tbSearch.textbox({
            inputEvents: $.extend({}, this.tbSearch.textbox.defaults.inputEvents,{
                keyup: function(e){ this.btnReload_onClick(); }.bind(this)
            })
        });
        $('#' + this.prefix + 'tbSearch_Voc_Module_Voc').textbox('textbox').bind('paste', function(e){
            setTimeout(()=>{ this.btnReload_onClick(); }, 200);
        }.bind(this));
        $('#' + this.prefix + 'tbSearch_Voc_Module_Voc').textbox('textbox').bind('cut', function(e){
            setTimeout(()=>{ this.btnReload_onClick(); }, 200);
        }.bind(this));
    }

    dg_rowStyler(index, row) {
        if(row.del == 1) {
            return "background:gray;color:red;";
        }
    }

    btnOk_onClick() {
        if(this.dgVocItems.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgVocItems.datagrid("getSelected");
        if(selData == null) {
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
        this.wVoc.window("close");
        return false;
    }

    btnVocsItemAdd_onClick() {
        if(this.Rights.vocChange.length > 0) {
            this.ShowWarning(this.Rights.vocChange);
            return;
        }
        let form = new VocItemEdit();
        form.SetResultFunc((data)=>{
            this.InVocItemId = data;
            this.btnVocsItemReload_onClick();
        });
        let options = {};
        options.AddMode = true;
        options.FormMode = 0;
        options.uuid = "";
        form.Show(options);
    }

    btnVocsItemChange_onClick() {
        if(!this.IsOneSelected(this.dgVocItems)) {
            this.ShowWarning("Выберете для редактирования одну запись!");
            return;
        }
        if(this.Rights.vocChange.length > 0) {
            this.ShowWarning(this.this.Rights.vocChange);
            return;
        }
        let vc = this.dgVocItems.datagrid("getSelected");
        if(vc.del == 1) {
            this.ShowWarning("Сначала восстановите запись для редактирования");
            return;
        }
        if(this.Rights.vocChange.length == 0) {
            this.sLoc.LockRecord("vocs", -1, vc.id, this.btnContinueVocsItemChange_onClick.bind(this));
        }
        else {
            this.btnContinueVocsItemChange_onClick({uuid: vc.id, lockMessage: this.Rights.vocChange});
        }
    }

    btnContinueVocsItemChange_onClick(options) {
        if(options.lockMessage.length!=0){
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        }
        else{
            if(options.editMode){
                options.lockState = true
            }
        }
        let form = new VocItemEdit();
        form.SetResultFunc((RecId)=>{
            this.InVocItemId = RecId;
            this.btnVocsItemReload_onClick();
        });
        form.SetCloseWindowFunction((options)=>{
            if(options != null) {
                if(options.lockState && this.Rights.vocChange.length === 0){
                    this.sLoc.FreeLockRecord("vocs", -1, options.uuid);
                }
            }
        });
        options.okenabled = this.Rights.vocChange.length === 0;
        options.FormMode = 1;
        form.Show(options);
    }

    btnVocsItemDel_onClick() {
        if(!this.IsOneSelected(this.dgVocItems)) {
            this.ShowSlide('Предупреждение', 'Выберете одну запись');
            return;
        }
        if(this.Rights.vocDel.length > 0) {
            this.ShowSlide('Предупреждение', this.Rights.vocDel);
            return;
        }
        let vocItem = this.dgVocItems.datagrid('getSelected');
        let id = vocItem.id;
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Voc/DeleteVocItem'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                this.btnVocsItemReload_onClick();
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    btnVocsItemReload_onClick() {
        this.btnVocsItemDel.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        let row = this.dgVocItems.datagrid("getSelected");
        if(row != null) {
            this.InVocItemIndex= this.dgVocItems.datagrid("getRowIndex", row);
        }
        let filter = {};
        filter.vocItemId = "";
        filter.delShow = this.showDel ? 1 : 0;
        filter.text = this.tbVocsItemSearch.textbox('getText');
        this.dgVocItems.datagrid({url:this.GetUrl("/Voc/GetVocItems"), queryParams: filter });
    }

    btnReload_onClick() {
        if(this.Rights.vocView.length > 0) {
            this.ShowWarning(this.Rights.vocView);
            return;
        }
        let row = this.dgVoc.datagrid("getSelected");
        if(row != null) {
            this.IndgVocIndex = this.dgVoc.datagrid("getRowIndex", row);
        }
        let filter = {};
        let vocItem = this.dgVocItems.datagrid('getSelected');
        filter.vocItemId = "";
        if(vocItem != null) {
            filter.vocItemId = vocItem.id;
        }
        filter.text = this.tbSearch.textbox('getText');
        filter.delShow = 1;
        if(this.IsOneSelected(this.dgVocItems) && vocItem.del == 0) {
            this.setCtrlState(true);
            this.dgVoc.datagrid({url: this.GetUrl("/Voc/GetVoc"), queryParams: filter});
        }
        else {
            this.setCtrlState(false);
            this.dgVoc.datagrid('loadData', []);
        }
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
    setCtrlState(state) {
        this.btnAdd.linkbutton({disabled: !state});
        this.btnDel.linkbutton({disabled: !state});
        this.btnReload.linkbutton({disabled: !state});
    }

    dgVocItems_onLoadSuccess(data) {
        this.dgVocItems.datagrid('unselectAll');
        if(data.total > 0) {
            if(this.InVocItemId != "") {
                for (let i=0; i<data.rows.length; i++) {
                    if (data.rows[i].id == this.InVocItemId) {
                        this.dgVocItems.datagrid("selectRecord", this.InVocItemId);
                        return;
                    }
                }
                this.InVocItemId = "";
            }
            if (this.InVocItemIndex >= 0 && this.InVocItemIndex < data.total) {
                this.dgVocItems.datagrid("selectRow", this.InVocItemIndex);
            } else if (data.total > 0) {
                this.dgVocItems.datagrid("selectRow", data.total - 1);
            }
            this.InVocItemIndex = 0;
        }
    }

    dgVocItems_onSelect(index, row) {
        if(row != null && row.del == 1) {
            this.btnVocsItemDel.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
        }
        else {
            this.btnVocsItemDel.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
        this.btnReload_onClick();
    }

    dgVoc_onLoadSuccess(data) {
        this.dgVoc.datagrid('unselectAll');
        if(data.total > 0) {
            if(this.Word !== "") {
                for(let i = 0; i < data.rows.length; i++) {
                    if(data.rows[i].word === this.Word) {
                        this.IndgVocIndex = i;
                        this.dgVoc.datagrid("selectRow", this.IndgVocIndex);
                        this.Word = "";
                    }
                }
            }
            else {
                if (this.IndgVocIndex >= 0 && this.IndgVocIndex < data.total) {
                    this.dgVoc.datagrid("selectRow", this.IndgVocIndex);
                } else if (data.total > 0) {
                    this.dgVoc.datagrid("selectRow", data.total - 1);
                }
            }
            this.IndgVocIndex = 0;
        }
    }

    btnAdd_onClick() {
        if(this.Rights.vocChange.length > 0) {
            this.ShowWarning(this.Rights.vocChange);
            return;
        }
        let vocItem = this.dgVocItems.datagrid('getSelected');
        if(vocItem == null || vocItem.del == 1) {
            this.ShowWarning('Выберете одну запись в списке словарей не помеченную на удаление');
            return;
        }
        let form = new VocEdit();
        form.SetResultFunc((data)=>{
            this.Word = data;
            this.btnReload_onClick();
        });
        form.Show({vocItemId: vocItem.id});
    }

    btnDel_onClick() {
        if(!this.IsOneSelected(this.dgVoc)){
            this.ShowWarning("Выберете одну запись для удаления");
            return;
        }
        if(this.Rights.vocDel.length > 0) {
            this.ShowWarning(this.Rights.vocDel);
            return;
        }
        $.messager.confirm("Подтверждение", "Вы действительно хотите удалить выделенное слово из словаря?",
            function (result) {
                if (result) {
                    let vc = this.dgVocItems.datagrid("getSelected");
                    let row = this.dgVoc.datagrid("getSelected");
                    $.ajax({
                        method: "POST",
                        data: JSON.stringify({ word: row.word, vocItemId: vc.id }),
                        url: this.GetUrl('/Voc/Delete'),
                        contentType: "application/json; charset=utf-8",
                        headers: GetCSRFTokenHeader(),
                        success:function(data) {
                            this.btnReload_onClick();
                        }.bind(this),
                        error: function(data){
                            this.ShowErrorResponse(data);
                        }.bind(this)
                    });
                }
            }.bind(this));
    }

    LoadRights() {
        $.ajax({
            method: "post",
            url: this.GetUrl('/Voc/GetActRights'),
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                this.Rights.vocView = data.vocView;
                this.Rights.vocChange = data.vocChange;
                this.Rights.vocDel = data.vocDel;
                this.btnVocsItemReload_onClick();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}

export function StartNestedModule(id){
    let form = new Voc(id, "nested_");
    form.Start();
}

export function StartModalModule(StartParams, ResultFunc) {
    let id = "wVoc_Module_Voc_VocForm";
    CreateModalWindow(id, "Словарь");
    let form = new Voc("wVoc_Module_Voc_VocForm", "modal_");
    form.SetResultFunc(ResultFunc);
    form.Start();
}