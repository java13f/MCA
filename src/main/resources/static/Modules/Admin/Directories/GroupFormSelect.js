export class GroupFormSelect extends FormView{
    constructor() {
        super();
        this.GroupIndex = 0;
        this.GroupId = "";
    }
    /**
     * Показать форму выбора группы
     */
    Show(){
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/GroupFormSelect"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.options = {AddMode: true};
        this.InitComponents("wGroupFormSel_Module_Admin", "");
        this.InitCloseEvents(this.wGroupFormSel, false);
        this.dgGroups.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgGroups_onLoadSuccess.bind(this),
            rowStyler: this.dgGroups_rowStyler.bind(this),
        });
        LoaderCSRFDataForGrid(this.dgGroups);
        AddKeyboardNavigationForGrid(this.dgGroups);
        this.btnCancel.linkbutton({onClick:()=>{this.wGroupFormSel.window("close");}});
        this.btnUpdate.linkbutton({onClick:this.btnUpdateGroups_onClick.bind(this)});
        this.txGroupFilter.textbox({onChange: this.txGroupFilter_onChange.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnUpdateGroups_onClick();
    }
    dgGroups_rowStyler(index, row){
        if(row.del=="Да") {
            return "background:lightgray;color:red;";
        }
    }
    /**
     * Обработка успешного окончания загрузки групп
     * @param data - информаци о загруженных данных
     */
    dgGroups_onLoadSuccess(data) {
        if(data.total>0) {
            if(this.GroupId!="") {
                this.dgGroups.datagrid("selectRecord", this.GroupId);
            }
            else {
                if(this.GroupIndex>=0&& this.GroupIndex < data.total) {
                    this.dgGroups.datagrid("selectRow", this.GroupIndex);
                }
                else if (data.total>0) {
                    this.dgGroups.datagrid("selectRow", data.total-1);
                }
            }
            this.GroupId = "";
            this.GroupIndex = 0;
        }
    }
    /**
     * Обработка обновления списка групп
     */
    btnUpdateGroups_onClick() {
        let row = this.dgGroups.datagrid("getSelected");
        if(row!=null) {
            this.GroupIndex = this.dgGroups.datagrid("getRowIndex", row);
        }
        let filter = this.txGroupFilter.textbox("getText");
        this.dgGroups.datagrid({url:this.GetUrl("/AdminGroups/GroupsList"), queryParams: {filter:filter, userId: "", appId: "", actId: "", kterId: -1}});
    }
    /**
     * Обработка фильтра по имени и коду группы
     */
    txGroupFilter_onChange() {
        this.btnUpdateGroups_onClick();
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgGroups.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc(selData.id);
        }
        this.wGroupFormSel.window("close");
        return false;
    }
}