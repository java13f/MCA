class DialogsList extends FormView {
    constructor(ModuleId, prefix) {
        super();
        this.ModuleId = ModuleId;
        this.prefix = prefix;
        this.InIndex = 0;
        this.Id = "";
        this.options = {};
    }

    Start() {
        if(this.prefix == 'modal_') {
            this.options = { AddMode:true };
        }
        LoadForm("#" + this.ModuleId, this.GetUrl("/DialogsList/DialogsListForm?prefix=" + this.prefix), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);
        if (document.getElementById('sDialoglist_DialogsList_Module_DialogsList') === null) {
            $('head').append('<link id="sDialoglist_DialogsList_Module_DialogsList" rel="stylesheet" type="text/css" href="../css/imgs/dialogslist/dialogslist.css"/>');
        }
        this.InitCloseEvents(this.wDialogsList);
        this.InitSearch();
        this.dgDialogs.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgDialogs_onLoadSuccess.bind(this),
            singleSelect: true
        });
        this.btnReload.linkbutton({onClick: this.btnReload_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: function(){ this.wDialogsList.window("close") }.bind(this)});
        AddKeyboardNavigationForGrid(this.dgDialogs);
        LoaderCSRFDataForGrid(this.dgDialogs);
        this.btnReload_onClick();
    }

    InitSearch(){
        // Событие keyup
        this.tbSearch.textbox({
            inputEvents: $.extend({}, this.tbSearch.textbox.defaults.inputEvents,{
                keyup: function(e){ this.btnReload_onClick(); }.bind(this)
            })
        });
        // События copy\paste
        this.tbSearch.textbox('textbox').bind('paste', function(e){
            setTimeout(()=>{ this.btnReload_onClick(); }, 200);
        }.bind(this));
        this.tbSearch.textbox('textbox').bind('cut', function(e){
            setTimeout(()=>{ this.btnReload_onClick(); }, 200);
        }.bind(this));
    }

    dgDialogs_onLoadSuccess(data) {
        this.dgDialogs.datagrid('unselectAll');
        if(data.total > 0) {
            if(this.Id !== "") {
                for(let i = 0; i < data.rows.length; i++) {
                    if(data.rows[i].id === this.Id) {
                        this.InIndex = i;
                        this.dgDialogs.datagrid("selectRow", this.InIndex);
                        this.Id = "";
                    }
                }
            }
            else {
                if (this.InIndex >= 0 && this.InIndex < data.total) {
                    this.dgDialogs.datagrid("selectRow", this.InIndex);
                } else if (data.total > 0) {
                    this.dgDialogs.datagrid("selectRow", data.total - 1);
                }
            }
            this.InIndex = 0;
        }
    }

    btnReload_onClick() {
        let row = this.dgDialogs.datagrid("getSelected");
        if(row != null) {
            this.InIndex = this.dgDialogs.datagrid("getRowIndex", row);
        }
        let filter = {};
        filter.text = this.tbSearch.textbox('getText');
        this.dgDialogs.datagrid({url:this.GetUrl("/DialogsList/GetList"), queryParams: filter});
    }

    btnOk_onClick() {
        if(this.dgDialogs.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgDialogs.datagrid("getSelected");
        if(selData == null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc != null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wDialogsList.window("close");
        return false;
    }
}

export function StartModalModule(StartParams, ResultFunc) {
    let id = "wDialogsList_DialogsList_Module_DialogsList";
    CreateModalWindow(id, "Список диалогов");
    let form = new DialogsList("wDialogsList_DialogsList_Module_DialogsList", "modal_");
    form.SetResultFunc(ResultFunc);
    form.Start();
}