import {UserFilterForm} from "../UserFilterForm.js";

export class UserFormSelect extends FormView{
    constructor() {
        super();
        this.UserIndex = 0;
        this.UserId = "";
        this.FilterLogin = "";
        this.FilterUserName = "";
    }

    /**
     * Показать форму выбора полбзователей
     */
    Show(){
        LoadForm("#ModalWindows", this.GetUrl("/AdminGroups/UserFormSelect"), this.InitFunc.bind(this));
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    InitFunc(){
        this.InitComponents("wUserFormSel_Module_Admin", "");
        this.InitCloseEvents(this.wUserFormSel, false);
        this.dgUsers.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgUsers_onLoadSuccess.bind(this),
            rowStyler: this.dgUsers_rowStyler.bind(this)
        });
        LoaderCSRFDataForGrid(this.dgUsers);
        AddKeyboardNavigationForGrid(this.dgUsers);
        this.btnCancel.linkbutton({onClick:()=>{this.wUserFormSel.window("close");}});
        this.btnUpdate.linkbutton({onClick:this.btnUpdateUsers_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnShowFilter.linkbutton({onClick: this.btnShowFilter_onClick.bind(this)});
        this.btnUpdateUsers_onClick();
    }
    dgUsers_rowStyler(index, row){
        if(row.del=="Да") {
            return "background:lightgray;color:red;";
        }
    }
    /**
     * Обработка успешного окончания загрузки пользхователей
     * @param data - информаци о загруженных данных
     */
    dgUsers_onLoadSuccess(data) {
        if(data.total>0) {
            if(this.UserId!="") {
                this.dgUsers.datagrid("selectRecord", this.UserId);
            }
            else {
                if(this.UserIndex>=0&& this.UserIndex < data.total) {
                    this.dgUsers.datagrid("selectRow", this.UserIndex);
                }
                else if (data.total>0) {
                    this.dgUsers.datagrid("selectRow", data.total-1);
                }
            }
            this.UserId = "";
            this.UserIndex = 0;
        }
    }
    /**
     * Обработка обновления списка пользователей
     */
    btnUpdateUsers_onClick() {
        let row = this.dgUsers.datagrid("getSelected");
        if(row!=null) {
            this.UserIndex = this.dgUsers.datagrid("getRowIndex", row);
        }
        let code = this.FilterLogin;
        let name = this.FilterUserName;

        let filter = {code: code, name: name};
        this.dgUsers.datagrid({url:this.GetUrl("/AdminUsers/List"), queryParams: filter});
    }

    /**
     * Обработка выбора записи
     */
    btnOk_onClick(){
        if(this.dgUsers.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgUsers.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if(this.ResultFunc!=null) {
            this.ResultFunc(selData.id);
        }
        this.wUserFormSel.window("close");
        return false;
    }

    /**
     * Показать настройки фильтра по пользователям
     */
    btnShowFilter_onClick(){
        let form = new UserFilterForm();
        form.SetResultFunc(function(data){
            this.FilterLogin = data.Code;
            this.FilterUserName = data.Name;
            this.btnUpdateUsers_onClick();
        }.bind(this));
        form.Show({AddMode: true, Code: this.FilterLogin, Name: this.FilterUserName});
    }
}