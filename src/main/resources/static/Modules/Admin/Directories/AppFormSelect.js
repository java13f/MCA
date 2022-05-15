export class AppFormSelect extends FormView{
    constructor() {
        super();
        this.AppsId = "";
    }
    /**
     * Показать форму выбора приложения
     */
    Show(){
        this.options = {AddMode:true};
        LoadForm("#ModalWindows", this.GetUrl("/AdminApps/AppFormSelect"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wAppFormSel_Module_Admin", "");
        this.InitCloseEvents(this.wAppFormSel, false);
        this.dgApps.treegrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess:this.dgApps_onLoadSuccess.bind(this),
            rowStyler: this.dg_rowStylerTreeGrid.bind(this)
        });
        LoaderCSRFDataForTreeGrid(this.dgApps);
        this.btnCancel.linkbutton({onClick:()=>{this.wAppFormSel.window("close");}});
        this.btnUpdate.linkbutton({onClick:this.btnAppsUpdate_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnAppsUpdate_onClick();
    }
    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dg_rowStylerTreeGrid(row) {
        if(row.del=="Да") {
            return "background:lightgray;color:red;";
        }
    }
    /**
     * Обработка обновления списка приложений
     */
    btnAppsUpdate_onClick() {
        if(this.AppsId == -1){
            let selData = this.dgApps.treegrid("getSelected");
            if(selData!=null) {
                this.AppsId = selData.id;
            }
        }
        this.dgApps.treegrid({url:this.GetUrl("/AdminApps/List")});
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        let selData = this.dgApps.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc(selData.id);
        }
        this.wAppFormSel.window("close");
        return false;
    }
    /**
     * Обработка окончания загрузки списка приложений
     * @param data - информация о загруженных данных
     */
    dgApps_onLoadSuccess(row, data){
        if(data.length>0) {
            if(this.AppsId != "") {
                this.dgApps.treegrid("select", this.AppsId);
            }
            else {
                this.dgApps.treegrid("select", data[0].id);
            }
            this.AppsId = "";
        }
    }
}