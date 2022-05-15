export class GlobalParamsFormSlct extends FormView {
    constructor() {
        super();
        this.GrPrmId = -1;
    }

    Show(options){
        this.options = options;
        LoadForm("#ModalWindows",
            this.GetUrl("/GlobalParams/GlobalParamsFormSlct"),
            this.InitFunc.bind(this)
        );
    }

    async InitFunc() {
        this.InitComponents("wGlobalParamsFormSlct_Module_GlobalParams", "");
        this.InitCloseEvents(this.wGlobalParamsFormSlct, false);

        LoaderCSRFDataForTreeGrid(this.dgGlPrmSlct);

        this.dgGlPrmSlct.treegrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgGlPrmSlct_onLoadSuccess.bind(this),
            onSelect: this.dgGlPrmSlct_onSelect.bind(this)
        });
        this.btnUpdateSlct.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});
        this.btnOkSlct.linkbutton({onClick: this.btnOkSlct_onClick.bind(this)});
        this.btnCancelSlct.linkbutton({ onClick: ()=>{ this.wGlobalParamsFormSlct.window("close")} });
        this.txFilterSlct.textbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.btnUpdate_onClick();
    }

    btnUpdate_onClick(){
        if(this.GrPrmId == -1){
            let selData = this.dgGlPrmSlct.treegrid("getSelected");
            if(selData!=null) this.GrPrmId = selData.id;
        }
        let fltr = this.txFilterSlct.textbox("getText");
        this.dgGlPrmSlct.treegrid({url:this.GetUrl("/GlobalParams/ListTree")   , queryParams: {filter: fltr}});
    }

    btnOkSlct_onClick(){
        let selData = this.dgGlPrmSlct.treegrid("getSelected");
        if(this.ResultFunc!=null) {
            this.ResultFunc(selData.id);
            this.wGlobalParamsFormSlct.window("close");
        }
    }
    /**
     * Обработка окончания загрузки списка приложений
     * @param data - информация о загруженных данных
     */
    dgGlPrmSlct_onLoadSuccess(row, data){
        if(data.length>0) {
            if(this.GrPrmId!=-1) {
                this.dgGlPrmSlct.treegrid("select", this.GrPrmId);
            }
            else
            {
                this.dgGlPrmSlct.treegrid("select", data[0].id);
            }
            this.GrPrmId = -1;
        }
    }

    /**
     * Обработка выбора приложения
     */
    dgGlPrmSlct_onSelect() {
        return 0;
    }

}