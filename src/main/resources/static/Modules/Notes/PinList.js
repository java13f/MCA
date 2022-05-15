export class PinList extends FormView {
    constructor() {
        super();
        this.pins = [];
    }

    Show(options) {
        this.pins = options;
        this.options = {AddMode: true};
        LoadForm("#ModalWindows", this.GetUrl("/Notes/PinListForm"), this.InitFunction.bind(this));
    }
    /**
     * Инициализация компонентов формы
     */
    InitFunction() {
        this.InitComponents("wPinList_NotesFilter_Module_Notes", "");
        this.InitCloseEvents(this.wPinList);
        this.btnCancel.linkbutton({
            onClick: function () {
                this.wPinList.window("close");
            }.bind(this)
        });
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.dgPin.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            singleSelect: true
        });
        this.dgPin.datagrid({data: this.pins});
        AddKeyboardNavigationForGrid(this.dgPin);
    }

    btnOk_onClick() {
        if (this.ResultFunc != null) {
            this.ResultFunc();
            this.wPinList.window("close");
        }
    }
}