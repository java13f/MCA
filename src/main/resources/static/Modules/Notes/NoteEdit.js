import {StartModalModule as StartModalModuleDialogsList} from "../DialogsList/DialogsList.js";
import {StartModalModule as StartModalModuleAbonList} from "../AbonList/AbonList.js";
import {AbonEdit} from "./AbonEdit.js";

export class NoteEdit extends FormView {
    constructor() {
        super();
        this.options = {};
        this.Note = {};
        this.InAbonIndex = 0;
        this.InAbonId = "";
        this.isShowDelAbon = false;
        this.delFilter = [{ field:'del', op:'less', value: 1 }];
        this.newIfPrefix = 'new_';
        this.abonsNewCnt = 0;
    }

    Show(options){
        this.options = options;
        this.Note.id = this.options.uuid;
        this.Note.periodTime = {
            day1: 0,
            day2: 0,
            day3: 0,
            day4: 0,
            day5: 0,
            day6: 0,
            day7: 0,
            dateStart: '01.01.2021',
            dateEnd: '01.01.2021',
            timeStart: '08:00:00',
            timeEnd: '18:00:00'
        };
        if(this.Note.id == "") {
            this.Note.patternId = this.options.patternId;
            this.Note.stts = 'Новое';
            this.Note.abons = [];
        }
        LoadForm("#ModalWindows", this.GetUrl("/Notes/NoteEditForm"), this.InitFunction.bind(this));
    }
    /**
     * Инициализация формы
     */
    InitFunction() {
        this.InitComponents("wNoteEdit_NoteEdit_Module_Notes", "");
        this.InitCloseEvents(this.wNoteEdit);
        let title = 'Добавление нового задания';
        if(this.options.FormMode === 1) {
            title = 'Редактирование задания';
        }
        if(this.options.FormMode === 1 && !this.options.editMode) {
            this.btnOk.linkbutton({disabled: true});
            title = 'Просмотр задания';
        }
        this.wNoteEdit.window({title: title});
        this.lbHeader.html(title);
        this.btnDialog.linkbutton({onClick: this.btnDialog_onClick.bind(this)});
        this.btnAddAbon.linkbutton({onClick: this.btnAddAbon_onClick.bind(this)});
        this.btnChangeAbon.linkbutton({onClick: this.btnChangeAbon_onClick.bind(this)});
        this.btnDelAbon.linkbutton({onClick: this.btnDelAbon_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: function () { this.wNoteEdit.window("close"); }.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.dgAbons.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgAbons_onLoadSuccess.bind(this),
            onSelect: this.dgAbons_onSelect.bind(this),
            rowStyler: this.dg_rowStyler.bind(this),
            singleSelect: false
        });
        this.dgAbons.datagrid('getColumnOption', 'id').formatter = ((val, row)=> {
            return val.includes('new_') ? '' : val;
        }).bind(this);
        AddKeyboardNavigationForGrid(this.dgAbons);
        LoaderCSRFDataForGrid(this.dgAbons);
        this.chbAddAbon.checkbox({onChange: function (state) {
                this.isShowDelAbon = state;
                this.dgAbons.datagrid({singleSelect: true });
                this.updateAbons();
                this.dgAbons.datagrid({singleSelect: false });
            }.bind(this)
        });
        // Чекбоксы дней недели
        this.chbDay1.checkbox({onChange: function (state) { this.Note.periodTime.day1 = state ? 1 : 0; }.bind(this)});
        this.chbDay2.checkbox({onChange: function (state) { this.Note.periodTime.day2 = state ? 1 : 0; }.bind(this)});
        this.chbDay3.checkbox({onChange: function (state) { this.Note.periodTime.day3 = state ? 1 : 0; }.bind(this)});
        this.chbDay4.checkbox({onChange: function (state) { this.Note.periodTime.day4 = state ? 1 : 0; }.bind(this)});
        this.chbDay5.checkbox({onChange: function (state) { this.Note.periodTime.day5 = state ? 1 : 0; }.bind(this)});
        this.chbDay6.checkbox({onChange: function (state) { this.Note.periodTime.day6 = state ? 1 : 0; }.bind(this)});
        this.chbDay7.checkbox({onChange: function (state) { this.Note.periodTime.day7 = state ? 1 : 0; }.bind(this)});
        this.dtStart.datebox({
            formatter: this.dtFormatter.bind(this),
            parser: this.dtParser.bind(this)
        });
        this.dtEnd.datebox({
            formatter: this.dtFormatter.bind(this),
            parser: this.dtParser.bind(this)
        });
        if(this.Note.id == "") {
            this.tbStts.textbox('setValue', this.Note.stts);
        }
        if(this.Note.id != "") {
            this.LoadNote(this.Note.id);
        }
        else {
            this.LoadTimePeriodPattrn();
            $.messager.confirm('Подтверждение', "Заполнись список абонентов автоматически<br>согласно шаблона?", function(result){
                if(result){
                    this.LoadAllAbons();
                }
            }.bind(this));
        }
        $('#tbName_NoteEdit_Module_Notes').textbox('textbox').focus();
    }

    dg_rowStyler(index, row) {
        if(row.del == 1) {
            return "background:gray;color:red;";
        }
    }
    /**
     * Форматирование даты
     * @param date - дата
     */
    dtFormatter(date){
        let y = date.getFullYear();
        let m = date.getMonth()+1;
        let d = date.getDate();
        return (d < 10 ? ('0'+ d) : d) + '.' + (m < 10 ? ('0' + m) : m) + '.' + y;
    }
    /**
     * Парсер даты
     * @param str - дата строкой
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
    /**
     * Заполнение визуальной части периода актуальности
     */
    SetPeriod() {
        this.dtStart.datebox('setValue', this.Note.periodTime.dateStart);
        this.dtEnd.datebox('setValue', this.Note.periodTime.dateEnd);
        this.tpStart.timespinner('setValue', this.Note.periodTime.timeStart);
        this.tpEnd.timespinner('setValue', this.Note.periodTime.timeEnd);
        this.chbDay1.checkbox(this.Note.periodTime.day1 === 1 ? "check" : "uncheck");
        this.chbDay2.checkbox(this.Note.periodTime.day2 === 1 ? "check" : "uncheck");
        this.chbDay3.checkbox(this.Note.periodTime.day3 === 1 ? "check" : "uncheck");
        this.chbDay4.checkbox(this.Note.periodTime.day4 === 1 ? "check" : "uncheck");
        this.chbDay5.checkbox(this.Note.periodTime.day5 === 1 ? "check" : "uncheck");
        this.chbDay6.checkbox(this.Note.periodTime.day6 === 1 ? "check" : "uncheck");
        this.chbDay7.checkbox(this.Note.periodTime.day7 === 1 ? "check" : "uncheck");
    }
    /**
     * Получение периода актуальности шаблона (при добавлении нового задания)
     */
    LoadTimePeriodPattrn() {
        let patternId = this.Note.patternId;
        $.ajax({
            method: "POST",
            data: {patternId},
            url: this.GetUrl('/Notes/GetPeriodAct'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(data != null) {
                    this.Note.periodTime = data;
                    this.SetPeriod();
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }
    /**
     * Получение списка всех абонентов
     */
    LoadAllAbons() {
        let patternId = this.Note.patternId;
        $.ajax({
            method: "POST",
            data: {patternId},
            url: this.GetUrl('/Notes/GetListItemsFromPatternId'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(data != null) {
                    this.Note.abons = data;
                    this.updateAbons();
                    this.abonsNewCnt = this.Note.abons.length;
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }
    /**
     * Загрузка задания
     * @param id - идентификатор задания
     */
    LoadNote(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Notes/GetNoteFromId'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(data != null) {
                    this.Note = data;
                    this.tbId.textbox('setValue', this.Note.id);
                    this.tbDate.textbox('setValue', this.Note.date);
                    this.tbName.textbox('setValue', this.Note.name);
                    this.tbDialog.textbox('setValue', this.Note.dialogAll.name);
                    this.tbStts.textbox('setValue', this.Note.stts);
                    this.SetPeriod();
                    this.tbCreated.textbox('setValue', this.Note.created);
                    this.tbCreator.textbox('setValue', this.Note.creator);
                    this.tbChanged.textbox('setValue', this.Note.changed);
                    this.tbChanger.textbox('setValue', this.Note.changer);
                    this.updateAbons();
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }
    /**
     * Проверка на выбор одной записи в списке
     * @param grid - элемент datagrid
     */
    IsOneSelected(grid){
        let items = grid.datagrid("getData").rows;
        let itemsSel = grid.datagrid("getSelections");
        if(items.length > 0 && itemsSel.length === 1) {
            return true;
        }
        return false;
    }
    /**
     * Получить общий диалог по идентификатору
     * @param id - идентификатор общего диалога
     */
    LoadDialogAll(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Notes/GetDialogAllFromId'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(data != null) {
                    this.Note.dialogAll = data;
                    this.tbDialog.textbox('setValue', this.Note.dialogAll.name);
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }
    /**
     * Обновление списка абонентов
     */
    updateAbons() {
        this.dgAbons.datagrid('unselectAll');
        if(!this.isShowDelAbon) {
            $('#dgAbons_NoteEdit_Module_Notes').datagrid({ filterRules: this.delFilter }).datagrid('enableFilter');
        }
        else {
            $('#dgAbons_NoteEdit_Module_Notes').datagrid('disableFilter');
        }
        this.dgAbons.datagrid({data: this.Note.abons});
    }
    /**
     * Получить абонента по идентификатору
     * @param id - идентификатор абонента
     */
    LoadAbonFromId(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Notes/LoadAbonFromId'),
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                if (!this.checkExistId(this.Note.abons, data.itemId)) {
                    this.ShowWarning('Абонент ' + data.name + ' уже добавлен в список');
                    return;
                }
                if (data != null) {
                    this.abonsNewCnt++;
                    let abon = data;
                    abon.id = this.newIfPrefix + this.abonsNewCnt;
                    this.Note.abons.push(abon);
                    this.InAbonId = abon.id;
                    this.updateAbons();
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
    /**
     * Проверка наличия идентификатора в наборе данных
     * @param data - набор данных
     * @param id - идентификатор
     */
    checkExistId(data, id) {
        for(let i=0; i<data.length; i++) {
            if(data[i].itemId == id) {
                return false;
            }
        }
        return true;
    }
    /**
     * Валидатор ввода даты
     * @param value - строка
     */
    isValidDate(value) {
        let ss = value.split('.');
        let y = parseInt(ss[2],10);
        let m = parseInt(ss[1],10);
        let d = parseInt(ss[0],10);
        if (!isNaN(y) && ss[2].length === 4 && !isNaN(m) && m > 0 && ss[1].length === 2 && !isNaN(d) && d > 0 && ss[0].length === 2) {
            let dateWrapper = new Date(y, m - 1, d);
            return !isNaN(dateWrapper.getDate());
        } else {
            return false;
        }
    }
    /**
     * Проверка корректности заполнения данных
     */
    CheckForm() {
        if (this.tbName.textbox("getText").trim().length == 0) {
            this.ShowToolTip("#tbNameToolTip_NoteEdit_Module_Notes",
                "Не заполнено поле \"Наименование\"",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (this.tbDialog.textbox("getText").trim().length == 0) {
            this.ShowToolTip("#tbDialogToolTip_NoteEdit_Module_Notes",
                "Не заполнено поле \"Общий диалог\"",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (!this.isValidDate(this.dtStart.datebox('getValue'))) {
            this.ShowToolTip("#dtStartToolTip_NoteEdit_Module_Notes",
                "Не верно указана дата",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (!this.isValidDate(this.dtEnd.datebox('getValue'))) {
            this.ShowToolTip("#dtEndToolTip_NoteEdit_Module_Notes",
                "Не верно указана дата",
                {title:'Ошибка', delay:3000});
            return;
        }
        if(this.dtParser(this.dtStart.datebox('getValue')) > this.dtParser(this.dtEnd.datebox('getValue'))) {
            this.ShowToolTip("#dtStartToolTip_NoteEdit_Module_Notes",
                "Дата начала периода не может быть больше даты окончания периода",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (this.tpStart.timespinner('getValue').trim().length === 0) {
            this.ShowToolTip("#tpStartToolTip_NoteEdit_Module_Notes",
                "Не указано время начала",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (this.tpEnd.timespinner('getValue').trim().length === 0) {
            this.ShowToolTip("#tpEndToolTip_NoteEdit_Module_Notes",
                "Не указано время окончания",
                {title:'Ошибка', delay:3000});
            return;
        }
        if(new Date('1/1/2015 ' + this.tpStart.timespinner('getValue')) >= new Date('1/1/2015 ' + this.tpEnd.timespinner('getValue'))) {
            this.ShowToolTip("#tpStartToolTip_NoteEdit_Module_Notes",
                "Время начала не может быть больше или равно времени окончания",
                {title:'Ошибка', delay:3000});
            return;
        }
        this.Note.name = this.tbName.textbox("getText");
        this.Note.periodTime.dateStart = this.dtStart.datebox('getValue');
        this.Note.periodTime.dateEnd = this.dtEnd.datebox('getValue');
        this.Note.periodTime.timeStart = this.tpStart.timespinner('getValue');
        this.Note.periodTime.timeEnd = this.tpEnd.timespinner('getValue');
        this.Save();
    }
    /**
     * Сохранение задания
     */
    Save() {
        $.ajax({
            method: "POST",
            data: JSON.stringify(this.Note),
            url: this.GetUrl('/Notes/SaveNote'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wNoteEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    btnOk_onClick() {
        this.CheckForm();
    }

    btnAddAbon_onClick() {
        StartModalModuleAbonList({}, function(data){
            this.LoadAbonFromId(data);
        }.bind(this));
    }

    btnChangeAbon_onClick() {
        let itemsSel = this.dgAbons.datagrid("getSelections");
        if(itemsSel.length === 0) {
            this.ShowWarning("Не выбрано ни одной записи");
            return true;
        }
        let form = new AbonEdit();
        form.SetResultFunc((Prior)=>{
            let itemsSel = this.dgAbons.datagrid("getSelections");
            for(let i = 0; i < itemsSel.length; i++) {
                itemsSel[i].priority = Prior;
            }
            this.updateAbons();
        });
        form.Show();
    }

    btnDelAbon_onClick() {
        if(!this.IsOneSelected(this.dgAbons)) {
            this.ShowWarning("Выберете для удаления одну запись!");
            return;
        }
        let abon = this.dgAbons.datagrid('getSelected');
        let id = abon.id;
        for(let i = 0; i<this.Note.abons.length; i++) {
            if(this.Note.abons[i].id === id) {
                this.Note.abons[i].del = 1 - this.Note.abons[i].del;
                this.updateAbons();
                return;
            }
        }
    }

    btnDialog_onClick() {
        StartModalModuleDialogsList({}, function(data){
            this.LoadDialogAll(data.id);
        }.bind(this));
    }

    dgAbons_onLoadSuccess(data) {
        if(data.total > 0) {
            if(this.InAbonId != "") {
                for (let i=0; i<data.rows.length; i++) {
                    if (data.rows[i].id == this.InAbonId && (!this.isShowDelAbon && data.rows[i].del === 0) || (this.isShowDelAbon)) {
                        this.dgAbons.datagrid("selectRecord", this.InAbonId);
                        return;
                    }
                }
                this.InAbonId = "";
            }
            if (this.InAbonIndex >= 0 && this.InAbonIndex < data.total) {
                this.dgAbons.datagrid("selectRow", this.InAbonIndex);
            } else if (data.total > 0) {
                this.dgAbons.datagrid("selectRow", data.total - 1);
            }
            this.InAbonIndex = 0;
        }
    }

    dgAbons_onSelect(index, row) {
        if(row != null) {
            this.InAbonId = row.id;
        }
        else {
            this.InAbonId = "";
        }
        if(row != null && row.del == 1) {
            this.btnDelAbon.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
        }
        else {
            this.btnDelAbon.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }
}