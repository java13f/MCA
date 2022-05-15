export class CategoryFormSelect extends FormView{
    constructor() {
        super();
        this.CategoryIndex = 0;
        this.CategoryId = "";
    }
    /**
     * Показать форму выбора группы
     */
    Show(){
        LoadForm("#ModalWindows", this.GetUrl("/AdminApps/CategoryFormSelect"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.options = {AddMode: true};
        this.InitComponents("wCategoryFormSel_Module_Admin", "");
        this.InitCloseEvents(this.wCategoryFormSel, false);
        this.dgCategory.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgCategory_onLoadSuccess.bind(this),
            rowStyler: this.dgCategory_rowStyler.bind(this),
        });
        LoaderCSRFDataForGrid(this.dgCategory);
        AddKeyboardNavigationForGrid(this.dgCategory);
        this.btnCancel.linkbutton({onClick:()=>{this.wCategoryFormSel.window("close");}});
        this.btnUpdate.linkbutton({onClick:this.btnUpdateCategory_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnUpdateCategory_onClick();
    }
    dgCategory_rowStyler(index, row){
        if(row.del=="Да") {
            return "background:lightgray;color:red;";
        }
    }
    /**
     * Обработка успешного окончания загрузки групп
     * @param data - информаци о загруженных данных
     */
    dgCategory_onLoadSuccess(data) {
        if(data.total>0) {
            if(this.CategoryId!="") {
                this.dgCategory.datagrid("selectRecord", this.CategoryId);
            }
            else {
                if(this.CategoryIndex>=0&& this.CategoryIndex < data.total) {
                    this.dgCategory.datagrid("selectRow", this.CategoryIndex);
                }
                else if (data.total>0) {
                    this.dgCategory.datagrid("selectRow", data.total-1);
                }
            }
            this.CategoryId = "";
            this.CategoryIndex = 0;
        }
    }
    /**
     * Обработка обновления списка групп
     */
    btnUpdateCategory_onClick() {
        let row = this.dgCategory.datagrid("getSelected");
        if(row!=null) {
            this.CategoryIndex = this.dgCategory.datagrid("getRowIndex", row);
        }
        this.dgCategory.datagrid({url:this.GetUrl("/AdminApps/CategoryList")});
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgCategory.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgCategory.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc(selData.id);
        }
        this.wCategoryFormSel.window("close");
        return false;
    }
}