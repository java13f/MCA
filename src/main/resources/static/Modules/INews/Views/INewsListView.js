import {INewsFormEdit} from "./INewsFormEdit.js";
import {INewsDao} from "../Dao/INewsDao.js";
import {INewsFilterForm} from "./INewsFilterForm.js";

export class INewsListView extends FormView{
    constructor(ModuleId) {
        super();
        this.ModuleId = ModuleId;
        this.INewsIndex = 0;
        this.INewsId = "";
        this.dNews = new INewsDao();
        this.filter = this.dNews.GetFilter();
    }
    Start(){
        LoadForm("#" + this.ModuleId, this.GetUrl("/INews/INewsFormList"), this.InitFunc.bind(this));
    }
    InitFunc(){
        this.InitComponents(this.ModuleId, "");
        AddKeyboardNavigationForGrid(this.dgINews);
        this.dgINews.datagrid({
            loadFilter:this.LoadFilter.bind(this),
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            rowStyler: this.dgINews_rowStyler.bind(this),
            onLoadSuccess: this.dgINews_onLoadSuccess.bind(this),
            onSelect: this.dgINews_onSelect.bind(this)
        });
        this.dgINews.datagrid('getColumnOption', 'status_icon').formatter = ((val, row)=> {
            return this.getSttsIcon(row.status);
        }).bind(this);
        this.dgINews.datagrid('getColumnOption', 'date').sorter = ((a, b)=> {
            return (this.dtParser(a) > this.dtParser(b) ? 1 : -1);
        }).bind(this);
        LoaderCSRFDataForGrid(this.dgINews);
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnShowFilter.linkbutton({onClick: this.btnShowFilter_onClick.bind(this)});
        this.btnUpdate_onClick();
    }
    dtParser(str) {
        if (!str) return new Date();
        let strs = str.split(' ');
        let date = strs[0].split('.');
        let time = strs[1].split(':');
        let y = parseInt(date[2], 10);
        let m = parseInt(date[1], 10);
        let d = parseInt(date[0], 10);
        let hh = parseInt(time[0], 10);
        let mm = parseInt(time[1], 10);
        let ss = parseInt(time[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)
            && !isNaN(hh) && !isNaN(mm) && !isNaN(ss)) {
            return new Date(y, m - 1, d, hh, mm, ss);
        } else {
            return new Date();
        }
    }

    /**
     * Получение иконки по статусу
     * @param stts статус
     * @returns {string}
     */
    getSttsIcon(stts)
    {
        let sttsStr = "";
        if(stts == 1) {
            sttsStr = "published";
        }
        else if (stts == 0) {
            sttsStr = "unpublished";
        }
        if(sttsStr.length > 0) {
            sttsStr = "<div style=\"display:table;width:20px;height:20px;\"><div class=\"icon-" + sttsStr + "\" style=\"display:table-cell;width:20px;height:20px;\"></div></div>";
        }
        return sttsStr;
    }
    /**
     * Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgINews_rowStyler(index, row) {
        if(row.del==1) {
            return "background-color:lightgray;color:red;";
        }
    }
    /**
     * Обновление спсика новостей
     */
    btnUpdate_onClick(){
        let row = this.dgINews.datagrid("getSelected");
        if(row!=null) {
            this.INewsIndex = this.dgINews.datagrid("getRowIndex", row);
            if(this.INewsIndex<0){this.INewsIndex = 0;}
        }
        this.dgINews.datagrid({url: this.GetUrl("/INews/getList"), queryParams: this.filter});
    }
    /**
     * Обработка окончания загрузки списка новостей
     * @param data - информация о загруженных данных
     */
    dgINews_onLoadSuccess(data){
        if(data.total > 0) {
            if(this.INewsId != "") {
                this.dgINews.datagrid("selectRecord", this.INewsId);
            }
            else {
                if(this.INewsIndex >=0 && this.INewsIndex < data.total) {
                    this.dgINews.datagrid("selectRow", this.INewsIndex);
                }
                else if (data.total > 0) {
                    this.dgINews.datagrid("selectRow", data.total - 1);
                }
            }
            this.INewsId = "";
            this.INewsIndex = 0;
        }
    }

    /**
     *  Добавление новой записи
     */
    btnAdd_onClick(){
        let form = new INewsFormEdit();
        form.SetResultFunc(function(RecId){
            this.INewsId = RecId;
            this.btnUpdate_onClick();
        }.bind(this));
        form.Show({AddMode: true});
    }

    /**
     * Иизменить выделенну новость
     */
    async btnChange_onClick(){
        try{
            if(this.dgINews.datagrid("getRows").length == 0) {
                this.ShowWarning("Нет записей для изменения");
                return false;
            }
            let selData = this.dgINews.datagrid("getSelected");
            if(selData == null) {
                this.ShowWarning("Выберите запись для изменения");
                return false;
            }
            let options = await this.dNews.LockRecord(selData.id);
            if(options.lockMessage.length != 0){
                this.ShowSlide("Предупреждение", options.lockMessage)
            }
            let form = new INewsFormEdit();
            form.SetResultFunc((RecId)=>{  this.INewsId = RecId; this.btnUpdate_onClick();});
            form.SetCloseWindowFunction((options)=>{
                if(options != null && options.lockState){
                    this.dNews.FreeLockRecord(options.uuid)
                }
            });
            form.Show(options);
        }
        catch(err){
            this.ShowErrorResponse(err);
        }
    }

    /**
     * Удаление записи
     */
    async btnDelete_onClick(){
        if(this.dgINews.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgINews.datagrid("getSelected");
        if(selData==null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if(del == 1){
            header = "Восстановление";
            action = "восстановить";
        }
        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенную новость?", async function(result){
            if(result){
                try{
                    let options = await this.dNews.StateLockRecord(selData.id);
                    if(options.data.length > 0){
                        this.ShowWarning(options.data);
                    }
                    else
                    {
                        await this.dNews.Delete(selData.id);
                        this.btnUpdate_onClick();
                    }
                }
                catch(err){
                    this.ShowErrorResponse(err);
                }
            }
        }.bind(this));
    }

    /**
     * Обработка выбора новости
     */
    dgINews_onSelect(){
        this.btnDelete.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        if(this.dgINews.datagrid("getRows").length != 0){
            let selData = this.dgINews.datagrid("getSelected");
            if(selData != null ){
                if(selData.del == 1){
                    this.btnDelete.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
                }
            }
        }
    }

    /**
     * Показать настройки фильтра
     */
    btnShowFilter_onClick(){
        let form = new INewsFilterForm(this.dNews);
        form.SetResultFunc(function(){
            this.filter = this.dNews.GetFilter();
            this.btnUpdate_onClick();
        }.bind(this));
        form.Show();
    }
}