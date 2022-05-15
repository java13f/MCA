import {GlobalParamsFormEdit} from "../GlobalParams/GlobalParamsFormEdit.js";
export class GlobalParamTreeList extends FormView {

    constructor(StartParams) {
        super();
        this.GrPrmId = -1;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);//Создадим объект работы с блокировками
    }
    /**
     * Показать форму выбора приложения
     */
    Start(id){
        this.ModuleId = id;
        LoadForm("#"+this.ModuleId,
                   this.GetUrl("/GlobalParams/GlobalParams"),
                   this.InitFunc.bind(this)
            );
    }
    /**
     * Функция инициализации пользовательского интерфейса
     */
    async InitFunc() {
        try {
            this.InitComponents(this.ModuleId, "");
            this.dgGlPrm.treegrid({
                loadFilter: this.LoadFilter.bind(this),
                onLoadError: (data)=>{ this.ShowErrorResponse(data); },
                onLoadSuccess: this.dgGlPrm_onLoadSuccess.bind(this),
                onSelect: this.dgGlPrm_onSelect.bind(this)
            });
            LoaderCSRFDataForTreeGrid(this.dgGlPrm);
            this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
            this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
            this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
            this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
            this.txFilter.textbox({onChange: this.btnUpdate_onClick.bind(this)});
            this.btnUpdate_onClick();
        }
        catch(e){ this.ShowErrorResponse(e); }
    }
    /**
     * Обработка окончания загрузки списка приложений
     * @param data - информация о загруженных данных
     */
    dgGlPrm_onLoadSuccess(row, data){
        if(data.length>0) {
            if(this.GrPrmId!=-1) {
                this.dgGlPrm.treegrid("select", this.GrPrmId);
            }
            else
            {
                this.dgGlPrm.treegrid("select", data[0].id);
            }
            this.GrPrmId = -1;
        }
    }

    /**
     * Обработка выбора приложения
     */
    dgGlPrm_onSelect() {
      return 0;
    }
    /**
     * Обработка добавления записи
     */
    btnAdd_onClick(){
        let selData = this.checkId()
        if(!selData) return 0;
        let form = new GlobalParamsFormEdit();
        form.SetResultFunc((RecId)=>{
            this.GrPrmId = RecId;
            this.btnUpdate_onClick();
        });
        form.Show({AddMode: true, id: selData.id, parent_id: selData._parentId, nameGlPr: selData.name });
    }
    /**
     * Обработка изменения записи
     */
    btnChange_onClick(){
        let selData = this.checkId()
        if(!selData) return 0;
        this.CheckExistenceNode(selData.id).then(res=>{
            if(res){
                this.sLoc.LockRecord("global_params",
                    -1,
                    selData.id,
                    this.btnContinueChange_onClick.bind(this)
                );
            }else {
                this.ShowWarning("Выбранная запись для редактирования не существует !");
                this.btnUpdate_onClick();
            }
        });

    }

    /**
     * Обработка окончания изменения записи
     */
    btnContinueChange_onClick(options){
        if (options.lockMessage.length != 0) {
            this.ShowSlide("Предупреждение", options.lockMessage);
            options.editMode = false;
        } else if (options.editMode) options.lockState = true;

        let form = new GlobalParamsFormEdit();
        form.SetResultFunc((RecId)=>{
            this.GrPrmId = RecId;
            this.btnUpdate_onClick();
        });
        form.SetCloseWindowFunction((options) => {
            if (options != null) {
                if (options.lockState) {
                    this.sLoc.FreeLockRecord("global_params",-1, options.id);
                }
            }
        });
      form.Show(options);
    }

    /**
     * Количество вложенных элементов
     * @param id
     * @returns {Promise<jQuery|{getAllResponseHeaders: (function(): *), abort: (function(*=): jqXHR), setRequestHeader: (function(*=, *): jqXHR), readyState: number, getResponseHeader: (function(*): *), overrideMimeType: (function(*): jqXHR), statusCode: (function(*=): jqXHR)}|$|(function(*=, *=): *)|(function(*=, *=): *)|HTMLElement|*>}
     * @constructor
     */
    async NodeCount(id){
        return $.post({
            data: JSON.stringify({
                id: id,
            }),
            url: this.GetUrl('/GlobalParams/NodeCount'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader()
        });
    }

    /**
     * Проверка существования узла
     * @param id
     * @returns {Promise<*>}
     * @constructor
     */
    async CheckExistenceNode(id){
        return $.post({
            data: JSON.stringify({
                id: id,
            }),
            url: this.GetUrl('/GlobalParams/CheckExistenceNode'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader()
        });
    }

    /**
     * Поиск и удаление элементов
     * @param id
     * @returns {Promise<void>}
     * @constructor
     */
    async SearchNodeAndDelete(id){
        return $.post({
            data: JSON.stringify({
                id: id,
            }),
            url: this.GetUrl('/GlobalParams/SearchNodeAndDelete'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                if (data != "1" && data != "-1") {
                    this.ShowSlide("Предупреждение", "Одна или более записей заблокирована пользователем  " + data + " !");
                } else {
                    if (data == "-1") {
                        this.ShowWarning("Выбранная запись для удаления не существует, возможно она уже удалена !");
                        this.dgGlPrm.treegrid("unselect", id);
                    }
                    this.btnUpdate_onClick();
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    /**
     * Обработка удаления записи или записей записи
     */
    btnDelete_onClick(){
        let selData = this.checkId()
        if(!selData) return 0;
        $.messager.confirm("Удаление", "Вы действительно хотите удалить выделенную ветвь <strong>\"" + selData.name + "\"</strong>?",
            function (result) {
                if (result) {
                    this.NodeCount(selData.id).then(res=>{
                        //если есть дочерние элементы
                        if(res>0){
                            $.messager.confirm("Подтверждение удаления", "Данная ветвь имеет вложенные элементы, если хотите ее удалить нажмите <strong>\"ОK\"</strong> ",
                                function (result) {
                                    if (result)
                                        this.SearchNodeAndDelete(selData.id).then(()=>{
                                            this.dgGlPrm.treegrid("unselect", selData.id);
                                        });
                                }.bind(this));
                        }else{
                            this.SearchNodeAndDelete(selData.id).then(()=>{
                                this.dgGlPrm.treegrid("unselect", selData.id);
                            });
                        }
                    }).catch(function (data) {
                        this.ShowErrorResponse(data);
                    }.bind(this));
                }
            }.bind(this));
    }

    /**
     * Обработка окончания удаления записи
     */
    /*btnContinueDelete_onClick(options){
        console.log(options.uuid);
        if (options.lockMessage.length != 0) {
            this.ShowSlide("Предупреждение", options.lockMessage);
            options.editMode = false;
        } else if (options.editMode) options.lockState = true;
    }*/
    /**
     * Обработка обновления списка приложений
     */
    btnUpdate_onClick(){
        if(this.GrPrmId == -1){
            let selData = this.dgGlPrm.treegrid("getSelected");
            if(selData!=null) this.GrPrmId = selData.id;
        }
        let fltr = this.txFilter.textbox("getText");
        this.dgGlPrm.treegrid({url:this.GetUrl("/GlobalParams/ListTree"), queryParams: {filter: fltr}});
    }

    /**
     * Проверка существования Id выбранной записи
     * @returns {boolean}
     */
    checkId(){
        let selData = this.dgGlPrm.treegrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите глобальный параметр !");
            return false;
        }
        if (selData.id == null) {
            this.ShowWarning("Отсутствует id глобального параметра !");
            return false;
        }
        return selData;
    }
}