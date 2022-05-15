export class PhraseFilter extends FormView {
    constructor(){
        super();
        this.sourceFilter = {};
        this.Filter = {};
    }

    /**
     * Стартовая функция
     */
    Show(options){
        this.sourceFilter = options;
        this.options = {AddMode:true};
        LoadForm("#ModalWindows", this.GetUrl("/Phrase/PhraseFilterForm"), this.InitFunction.bind(this));
    }

    /**
     * Инициализация формы
     */
    InitFunction() {
        this.InitComponents("wPhraseFilter_PhraseFilter_Module_Phrase", "");
        this.InitCloseEvents(this.wPhraseFilter);
        this.btnCancel.linkbutton({onClick: function () {this.wPhraseFilter.window("close");}.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnClearCode.linkbutton({onClick: this.btnClearCode_Click.bind(this)});
        this.btnClearText.linkbutton({onClick: this.btnClearText_Click.bind(this)});
        this.btnClearFileName.linkbutton({onClick: this.btnClearFileName_Click.bind(this)});
        this.btnClearFilter.linkbutton({onClick: this.btnClearFilter_Click.bind(this)});
        this.chbDel.checkbox({onChange: function (state) {
                this.Filter.showdel = state;
            }.bind(this)
        });
        this.Filter.code = this.sourceFilter.code;
        this.Filter.text = this.sourceFilter.text;
        this.Filter.filename = this.sourceFilter.filename;
        this.Filter.showdel = this.sourceFilter.showdel;
        this.UpdateControls();
    }

    /**
     * Кнопка ОК
     */
    btnOk_onClick() {
        if (this.ResultFunc != null) {
            this.sourceFilter.code = this.tbCode.textbox('getText');
            this.sourceFilter.text = this.tbText.textbox('getText');
            this.sourceFilter.filename = this.tbFileName.textbox('getText');
            this.sourceFilter.showdel = this.Filter.showdel;
            this.ResultFunc();
            this.wPhraseFilter.window("close");
        }
    }

    /**
     * Кнопка Очистки кода
     */
    btnClearCode_Click() {
        this.Filter.code = "";
        this.Filter.text = this.tbText.textbox('getText');
        this.Filter.filename = this.tbFileName.textbox('getText');
        this.UpdateControls();
    }

    /**
     * Кнопка Очистки текста
     */
    btnClearText_Click() {
        this.Filter.text = "";
        this.Filter.code = this.tbCode.textbox('getText');
        this.Filter.filename = this.tbFileName.textbox('getText');
        this.UpdateControls();
    }

    /**
     * Кнопка Очистки имени файла
     */
    btnClearFileName_Click() {
        this.Filter.filename = "";
        this.Filter.code = this.tbCode.textbox('getText');
        this.Filter.text = this.tbText.textbox('getText');
        this.UpdateControls();
    }

    /**
     * Кнопка Очистки всего фильтра
     */
    btnClearFilter_Click() {
        this.Filter.code = "";
        this.Filter.text = "";
        this.Filter.filename = "";
        this.Filter.showdel = false;
        this.UpdateControls();
    }

    /**
     * Обновление занных элементов формы
     */
    UpdateControls() {
        this.tbCode.textbox('setValue', this.Filter.code);
        this.tbText.textbox('setValue', this.Filter.text);
        this.tbFileName.textbox('setValue', this.Filter.filename);
        this.chbDel.checkbox({checked: this.Filter.showdel});
    }
}