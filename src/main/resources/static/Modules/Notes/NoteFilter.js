import {StartModalModule as StartModalModuleDialogsList} from "../DialogsList/DialogsList.js";
import {StartModalModule as StartModalModuleAbonList} from "../AbonList/AbonList.js";

export class NoteFilter extends FormView {
    constructor() {
        super();
        this.Filter = {};
        this.sourceFilter = {};
        this.options = {AddMode:true};
    }

    Show(options) {
        this.Filter.dateStart = this.dtFormatter(new Date());
        this.Filter.dateEnd = this.dtFormatter(new Date());
        this.sourceFilter = options;
        LoadForm("#ModalWindows", this.GetUrl("/Notes/NoteFilterForm"), this.InitFunction.bind(this));
    }
    /**
     * Инициализация формы
     */
    InitFunction() {
        this.InitComponents("wNoteFilter_NotesFilter_Module_Notes", "");
        this.InitCloseEvents(this.wNoteFilter);
        this.InitFilter();
        this.btnCancel.linkbutton({onClick: function () { this.wNoteFilter.window("close"); }.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnSearchDialog.linkbutton({onClick: this.btnSearchDialog_onClick.bind(this)});
        this.btnSearchAbon.linkbutton({onClick: this.btnSearchAbon_onClick.bind(this)});
        this.btnClearName.linkbutton({onClick: this.btnClearName_onClick.bind(this)});
        this.btnClearDialog.linkbutton({onClick: this.btnClearDialog_onClick.bind(this)});
        this.btnClearAbon.linkbutton({onClick: this.btnClearAbon_onClick.bind(this)});
        this.btnClearStts.linkbutton({onClick: this.btnClearStts_onClick.bind(this)});
        this.btnClearAll.linkbutton({onClick: this.btnClearAll_onClick.bind(this)});
        this.dpDateStart.datebox({
            formatter: this.dtFormatter.bind(this),
            parser: this.dtParser.bind(this)
        });
        this.dpDateEnd.datebox({
            formatter: this.dtFormatter.bind(this),
            parser: this.dtParser.bind(this)
        });
        this.chbDateStart.checkbox({onChange: function (state) {
                this.Filter.dateStart = this.dpDateStart.datebox('getValue');
                this.Filter.chkStart = state ? 1 : 0;
                this.UpdateDatesAndDel();
            }.bind(this)
        });
        this.chbDateEnd.checkbox({onChange: function (state) {
                this.Filter.dateEnd = this.dpDateEnd.datebox('getValue');
                this.Filter.chkEnd = state ? 1 : 0;
                this.UpdateDatesAndDel();
            }.bind(this)
        });
        this.chbShowDel.checkbox({onChange: function (state) {
                this.Filter.showDel = state ? 1 : 0;
            }.bind(this)
        });
        this.cbStts.combobox({
            valueField: "id",
            textField: "name",
            onSelect: this.cbStts_onSelect.bind(this)
        });
        this.LoadSttsList();
        this.UpdateDatesAndDel();
        this.tbName.textbox('setValue', this.Filter.name);
        if(this.Filter.dlgAllId.length !== 0) {
            this.LoadDialog(this.Filter.dlgAllId);
        }
        if(this.Filter.abonId.length !== 0) {
            this.LoadAbon(this.Filter.abonId);
        }
    }
    /**
     * Инициализация фильтра
     */
    InitFilter() {
        this.Filter.name = this.sourceFilter.name;
        this.Filter.abonId = this.sourceFilter.abonId;
        this.Filter.dlgAllId = this.sourceFilter.dlgAllId;
        this.Filter.sttsId = this.sourceFilter.sttsId;
        this.Filter.showDel = this.sourceFilter.showDel;
        this.Filter.chkStart = this.sourceFilter.chkStart;
        this.Filter.chkEnd = this.sourceFilter.chkEnd;
        this.Filter.dateStart = this.sourceFilter.dateStart.length === 0 ? this.dtFormatter(new Date()) : this.sourceFilter.dateStart;
        this.Filter.dateEnd = this.sourceFilter.dateEnd.length === 0 ? this.dtFormatter(new Date()) : this.sourceFilter.dateEnd;
    }
    /**
     * Обновление состояния настроек дат в фильтре
     */
    UpdateDatesAndDel() {
        this.dpDateStart.datebox({disabled: this.Filter.chkStart !== 1});
        this.dpDateEnd.datebox({disabled: this.Filter.chkEnd !== 1});
        this.dpDateStart.datebox('setValue', this.Filter.dateStart);
        this.dpDateEnd.datebox('setValue', this.Filter.dateEnd);
        this.chbShowDel.checkbox(this.Filter.showDel === 1 ? 'check' : 'uncheck');
        this.chbDateStart.checkbox(this.Filter.chkStart === 1 ? 'check' : 'uncheck');
        this.chbDateEnd.checkbox(this.Filter.chkEnd === 1 ? 'check' : 'uncheck');
        if(this.Filter.sttsId.length === 0) {
            this.cbStts.combobox("setValue", null);
        }
        else {
            this.cbStts.combobox("setValue", this.Filter.sttsId);
        }
    }
    /**
     * Форматирование даты
     */
    dtFormatter(date){
        let y = date.getFullYear();
        let m = date.getMonth()+1;
        let d = date.getDate();
        return (d < 10 ? ('0'+ d) : d) + '.' + (m < 10 ? ('0' + m) : m) + '.' + y;
    }
    /**
     * Парсер даты
     */
    dtParser(str){
        let ss = str.split('.');
        let y = parseInt(ss[2],10);
        let m = parseInt(ss[1],10);
        let d = parseInt(ss[0],10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date(2015, 0, 1);
        }
    }

    btnOk_onClick() {
        if(this.Filter.chkStart === 1 && this.Filter.chkEnd === 1 && this.dtParser(this.dpDateStart.datebox('getValue')) > this.dtParser(this.dpDateEnd.datebox('getValue'))) {
            this.ShowWarning('Дата начала периода не может быть больше даты окончания периода');
            return;
        }
        if (this.ResultFunc != null) {
            this.sourceFilter.name = this.tbName.textbox('getText');
            this.sourceFilter.abonId = this.Filter.abonId;
            this.sourceFilter.dlgAllId = this.Filter.dlgAllId;
            this.sourceFilter.sttsId = this.Filter.sttsId;
            this.sourceFilter.showDel = this.Filter.showDel;
            this.sourceFilter.chkStart = this.Filter.chkStart;
            this.sourceFilter.chkEnd = this.Filter.chkEnd;
            this.sourceFilter.dateStart = this.dpDateStart.datebox('getValue');
            this.sourceFilter.dateEnd = this.dpDateEnd.datebox('getValue');
            this.ResultFunc();
            this.wNoteFilter.window("close");
        }
    }

    btnSearchDialog_onClick() {
        StartModalModuleDialogsList({}, function(data){
            this.LoadDialog(data.id);
        }.bind(this));
    }
    /**
     * Получить общий диалог по id
     */
    LoadDialog(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Notes/GetDialogAllFromId'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(data != null) {
                    this.Filter.dlgAllId = data.id;
                    this.tbDialog.textbox('setValue', data.name);
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }

    btnSearchAbon_onClick() {
        StartModalModuleAbonList({}, function(id){
            this.LoadAbon(id);
        }.bind(this));
    }
    /**
     * Получить абонента по id
     */
    LoadAbon(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Notes/LoadAbonFromId'),
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                if (data != null) {
                    this.Filter.abonId = data.itemId;
                    this.tbAbon.textbox('setValue', data.name);
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    cbStts_onSelect(record) {
        this.Filter.sttsId = record.id;
    }
    /**
     * Получить список статусов
     */
    LoadSttsList() {
        $.ajax({
            method: "POST",
            url: this.GetUrl('/Notes/LoadSttsList'),
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                if (data != null) {
                    this.cbStts.combobox({data: data});
                    this.UpdateDatesAndDel();
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    btnClearName_onClick() {
        this.Filter.name = '';
        this.tbName.textbox('setValue', this.Filter.name);
    }

    btnClearDialog_onClick() {
        this.Filter.dlgAllId = '';
        this.tbDialog.textbox('setValue', this.Filter.dlgAllId);
    }

    btnClearAbon_onClick() {
        this.Filter.abonId = '';
        this.tbAbon.textbox('setValue', this.Filter.abonId);
    }

    btnClearStts_onClick() {
        this.Filter.sttsId = '';
        this.cbStts.combobox("setValue", null);
    }

    btnClearAll_onClick() {
        this.Filter.showDel = 0;
        this.Filter.chkStart = 0;
        this.Filter.chkEnd = 0;
        this.chbShowDel.checkbox('uncheck');
        this.chbDateStart.checkbox('uncheck');
        this.chbDateEnd.checkbox('uncheck');
        this.btnClearName_onClick();
        this.btnClearDialog_onClick();
        this.btnClearAbon_onClick();
        this.btnClearStts_onClick();
    }
}