import {ActFilterForm} from "../ActFilterForm.js";

export class ActFormSelect extends FormView{
    constructor() {
        super();
        this.ActIndex = 0
        this.FilterActsAppId = "";
        this.FilterActsCode = "";
        this.FilterActsName = "";
    }


    /**
     * Показать форму выбора действия
     */
    Show(){
        this.options = {AddMode:true};
        LoadForm("#ModalWindows", this.GetUrl("/AdminActs/ActFormSelect"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wActFormSel_Module_Admin", "")
        this.InitCloseEvents(this.wActFormSel, false);
        this.dgActs.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgActs_onLoadSuccess.bind(this),
            rowStyler: this.dg_rowStyler.bind(this)
        })
        LoaderCSRFDataForGrid(this.dgActs);
        AddKeyboardNavigationForGrid(this.dgActs);
        this.btnCancel.linkbutton({onClick:()=>{this.wActFormSel.window("close");}});
        this.btnUpdate.linkbutton({onClick:this.btnActsUpdate_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnShowFilter.linkbutton({onClick: this.btnShowFilter_onClick.bind(this)});
        this.btnActsUpdate_onClick();
    }
    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dg_rowStyler(index, row) {
        if(row.del=="Да") {
            return "background:lightgray;color:red;";
        }
    }
    /**
     * Обработка обновления списка действий
     */
    btnActsUpdate_onClick() {
        let row = this.dgActs.datagrid("getSelected");
        if(row!=null) {
            this.ActIndex = this.dgActs.datagrid("getRowIndex", row);
        }
        let code = this.FilterActsCode;
        let name = this.FilterActsName;
        let appId = this.FilterActsAppId
        this.dgActs.datagrid({url:this.GetUrl("/AdminActs/List"), queryParams: {code:code, appId: appId, name: name}});
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgActs.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgActs.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc(selData.id);
        }
        this.wActFormSel.window("close");
        return false;
    }
    /**
     * Обработка окончания загрузки списка действий
     * @param data - информация о загруженных данных
     */
    dgActs_onLoadSuccess(data){
        if(data.total>0) {
            if(this.ActIndex>=0&& this.ActIndex < data.total) {
                this.dgActs.datagrid("selectRow", this.ActIndex);
            }
            else if (data.total>0) {
                this.dgActs.datagrid("selectRow", data.total-1);
            }
            this.ActIndex = 0;
        }
    }

    /**
     * Покзать фильтр
     */
    btnShowFilter_onClick(){
        let form = new ActFilterForm();
        form.SetResultFunc(function(data){
            this.FilterActsCode = data.Code;
            this.FilterActsAppId = data.AppId;
            this.FilterActsName = data.Name;
            this.btnActsUpdate_onClick();
        }.bind(this));
        form.Show({AddMode: true, Code: this.FilterActsCode, Name: this.FilterActsName, AppId: this.FilterActsAppId});
    }
}