import {StartModalModule as StartModalModuleAbonList} from "../AbonList/AbonList.js";
import {StartModalModule as StartModalModuleGrpList} from "../GrpList/GrpList.js";

export class PatternEdit extends FormView {
    constructor() {
        super();
        this.options = {};
        this.Pattern = {};
        this.InAbonIndex = 0;
        this.InAbonId = "";
        this.InGrpIndex = 0;
        this.InGrpId = "";
        this.isShowDelGrp = false;
        this.isShowDelAbon = false;
        this.delFilter = [{ field:'del', op:'less', value: 1 }];
        this.newIfPrefix = 'new_';
        this.grpsNewCnt = 0;
        this.abonsNewCnt = 0;
    }

    Show(options){
        this.options = options;
        this.Pattern.id = this.options.uuid;
        this.Pattern.periodTime = {
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
        if(this.Pattern.id == "") {
            this.Pattern.allFlag = 0;
            this.Pattern.grps = [];
            this.Pattern.abons = [];
        }
        LoadForm("#ModalWindows", this.GetUrl("/Notes/PatternEditForm"), this.InitFunction.bind(this));
    }
    /**
     * Инициализация формы
     */
    InitFunction() {
        this.InitComponents("wPatternEdit_PatternEdit_Module_Notes", "");
        this.InitCloseEvents(this.wPatternEdit);
        let title = 'Добавление нового шаблона';
        if(this.options.FormMode === 1) {
            title = 'Редактирование шаблона';
        }
        if(this.options.FormMode === 1 && !this.options.editMode) {
            this.btnOk.linkbutton({disabled: true});
            title = 'Просмотр шаблона';
        }
        this.wPatternEdit.window({title: title});
        this.lbHeader.html(title);
        this.dgGrps.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgGrps_onLoadSuccess.bind(this),
            onSelect: this.dgGrps_onSelect.bind(this),
            rowStyler: this.dg_rowStyler.bind(this),
            singleSelect: true
        });
        this.dgGrps.datagrid('getColumnOption', 'id').formatter = ((val, row)=> {
            return val.includes('new_') ? '' : val;
        }).bind(this);
        AddKeyboardNavigationForGrid(this.dgGrps);
        LoaderCSRFDataForGrid(this.dgGrps);
        this.dgAbons.datagrid({
            onLoadError:(data)=>{ this.ShowErrorResponse(data); },
            onLoadSuccess: this.dgAbons_onLoadSuccess.bind(this),
            onSelect: this.dgAbons_onSelect.bind(this),
            rowStyler: this.dg_rowStyler.bind(this),
            singleSelect: true
        });
        this.dgAbons.datagrid('getColumnOption', 'id').formatter = ((val, row)=> {
            return val.includes('new_') ? '' : val;
        }).bind(this);
        AddKeyboardNavigationForGrid(this.dgAbons);
        LoaderCSRFDataForGrid(this.dgAbons);
        this.chbDelGrp.checkbox({onChange: function (state) {
                this.isShowDelGrp = state;
                this.updateGrps();
            }.bind(this)
        });
        this.chbDelAbon.checkbox({onChange: function (state) {
                this.isShowDelAbon = state;
                this.updateAbons();
            }.bind(this)
        });
        this.chbAllAbon.checkbox({onChange: function (state) {
                this.Pattern.allFlag = state ? 1 : 0;
                this.btnAddGrp.linkbutton({disabled: state});
                this.btnAddAbon.linkbutton({disabled: state});
                this.btnDelGrp.linkbutton({disabled: state});
                this.btnDelAbon.linkbutton({disabled: state});
                this.chbDelGrp.checkbox({disabled: state});
                this.chbDelAbon.checkbox({disabled: state});
                this.updateGrps();
                this.updateAbons();
            }.bind(this)
        });
        this.btnAddGrp.linkbutton({onClick: this.btnAddGrp_onClick.bind(this)});
        this.btnAddAbon.linkbutton({onClick: this.btnAddAbon_onClick.bind(this)});
        this.btnDelGrp.linkbutton({onClick: this.btnDelGrp_onClick.bind(this)});
        this.btnDelAbon.linkbutton({onClick: this.btnDelAbon_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: function () { this.wPatternEdit.window("close"); }.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.dtStart.datebox({
            formatter: this.dtFormatter.bind(this),
            parser: this.dtParser.bind(this)
        });
        this.dtEnd.datebox({
            formatter: this.dtFormatter.bind(this),
            parser: this.dtParser.bind(this)
        });
        // Чекбоксы дней недели
        this.chbDay1.checkbox({onChange: function (state) { this.Pattern.periodTime.day1 = state ? 1 : 0; }.bind(this)});
        this.chbDay2.checkbox({onChange: function (state) { this.Pattern.periodTime.day2 = state ? 1 : 0; }.bind(this)});
        this.chbDay3.checkbox({onChange: function (state) { this.Pattern.periodTime.day3 = state ? 1 : 0; }.bind(this)});
        this.chbDay4.checkbox({onChange: function (state) { this.Pattern.periodTime.day4 = state ? 1 : 0; }.bind(this)});
        this.chbDay5.checkbox({onChange: function (state) { this.Pattern.periodTime.day5 = state ? 1 : 0; }.bind(this)});
        this.chbDay6.checkbox({onChange: function (state) { this.Pattern.periodTime.day6 = state ? 1 : 0; }.bind(this)});
        this.chbDay7.checkbox({onChange: function (state) { this.Pattern.periodTime.day7 = state ? 1 : 0; }.bind(this)});
        if(this.Pattern.id != "") {
            this.LoadPattern(this.Pattern.id);
        }
        else {
            this.dtStart.datebox('setValue', this.dtFormatter(new Date()));
            this.dtEnd.datebox('setValue', this.dtFormatter(new Date()));
            this.tpStart.timespinner('setValue',  this.Pattern.periodTime.timeStart);
            this.tpEnd.timespinner('setValue',  this.Pattern.periodTime.timeEnd);
        }
        $('#tbName_PatternEdit_Module_Notes').textbox('textbox').focus();
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

    dg_rowStyler(index, row) {
        if(row.del == 1) {
            return "background:gray;color:red;";
        }
    }
    /**
     * Получить шаблон по id
     * @param id - идентификатор шаблона
     */
    LoadPattern(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Notes/GetPatternFromId'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(data != null) {
                    this.Pattern = data;
                    this.tbId.textbox('setValue', this.Pattern.id);
                    this.tbName.textbox('setValue', this.Pattern.name);
                    this.chbAllAbon.checkbox(this.Pattern.allFlag === 1 ? "check" : "uncheck");
                    this.dtStart.datebox('setValue', this.Pattern.periodTime.dateStart);
                    this.dtEnd.datebox('setValue', this.Pattern.periodTime.dateEnd);
                    this.tpStart.timespinner('setValue', this.Pattern.periodTime.timeStart);
                    this.tpEnd.timespinner('setValue', this.Pattern.periodTime.timeEnd);
                    this.chbDay1.checkbox(this.Pattern.periodTime.day1 === 1 ? "check" : "uncheck");
                    this.chbDay2.checkbox(this.Pattern.periodTime.day2 === 1 ? "check" : "uncheck");
                    this.chbDay3.checkbox(this.Pattern.periodTime.day3 === 1 ? "check" : "uncheck");
                    this.chbDay4.checkbox(this.Pattern.periodTime.day4 === 1 ? "check" : "uncheck");
                    this.chbDay5.checkbox(this.Pattern.periodTime.day5 === 1 ? "check" : "uncheck");
                    this.chbDay6.checkbox(this.Pattern.periodTime.day6 === 1 ? "check" : "uncheck");
                    this.chbDay7.checkbox(this.Pattern.periodTime.day7 === 1 ? "check" : "uncheck");
                    this.tbCreated.textbox('setValue', this.Pattern.created);
                    this.tbCreator.textbox('setValue', this.Pattern.creator);
                    this.tbChanged.textbox('setValue', this.Pattern.changed);
                    this.tbChanger.textbox('setValue', this.Pattern.changer);
                    this.updateGrps();
                    this.updateAbons();
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }
    /**
     * Получить группу по id
     * @param id - идентификатор группы
     */
    LoadGrpFromId(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Notes/LoadGrpFromId'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(!this.checkExistId(this.Pattern.grps, data.itemId)) {
                    this.ShowWarning('Группа ' + data.name + ' уже добавлена в список');
                    return;
                }
                if(data != null) {
                    this.grpsNewCnt++;
                    let grp = data;
                    grp.id = this.newIfPrefix + this.grpsNewCnt;
                    this.Pattern.grps.push(grp);
                    this.InGrpId = grp.id;
                    this.updateGrps();
                }
            }.bind(this),
            error: function(data) { this.ShowErrorResponse(data); }.bind(this)
        });
    }
    /**
     * Получить абонента по id
     * @param id - идентификатор абонента
     */
    LoadAbonFromId(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Notes/LoadAbonFromId'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(!this.checkExistId(this.Pattern.abons, data.itemId)) {
                    this.ShowWarning('Абонент ' + data.name + ' уже добавлен в список');
                    return;
                }
                if(data != null) {
                    this.abonsNewCnt++;
                    let abon = data;
                    abon.id = this.newIfPrefix + this.abonsNewCnt;
                    this.Pattern.abons.push(abon);
                    this.InAbonId = abon.id;
                    this.updateAbons();
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }
    /**
     * Проверка существования идентификатора в наборе данных
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
     * Обновление групп
     */
    updateGrps() {
        if(!this.isShowDelGrp) {
            $('#dgGrps_PatternEdit_Module_Notes').datagrid({ filterRules: this.delFilter }).datagrid('enableFilter');
        }
        else {
            $('#dgGrps_PatternEdit_Module_Notes').datagrid('disableFilter');
        }
        if(this.Pattern.allFlag === 1) {
            this.dgGrps.datagrid({data: []});
        }
        else {
            this.dgGrps.datagrid({data: this.Pattern.grps});
        }
    }
    /**
     * Обновление абонентов
     */
    updateAbons() {
        if(!this.isShowDelAbon) {
            $('#dgAbons_PatternEdit_Module_Notes').datagrid({ filterRules: this.delFilter }).datagrid('enableFilter');
        }
        else {
            $('#dgAbons_PatternEdit_Module_Notes').datagrid('disableFilter');
        }
        if(this.Pattern.allFlag === 1) {
            this.dgAbons.datagrid({data: []});
        }
        else {
            this.dgAbons.datagrid({data: this.Pattern.abons});
        }
    }
    /**
     * Проверка на одну выбранную запись в списке
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
     * Валидатор даты
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
     * Проверка корректности введенных данных
     */
    CheckForm() {
        if (this.tbName.textbox("getText").trim().length == 0) {
            this.ShowToolTip("#tbNameToolTip_PatternEdit_Module_Notes",
                "Не заполнено поле \"Наименование\"",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (!this.isValidDate(this.dtStart.datebox('getValue'))) {
            this.ShowToolTip("#dtStartToolTip_PatternEdit_Module_Notes",
                "Не верно указана дата",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (!this.isValidDate(this.dtEnd.datebox('getValue'))) {
            this.ShowToolTip("#dtEndToolTip_PatternEdit_Module_Notes",
                "Не верно указана дата",
                {title:'Ошибка', delay:3000});
            return;
        }
        if(this.dtParser(this.dtStart.datebox('getValue')) > this.dtParser(this.dtEnd.datebox('getValue'))) {
            this.ShowToolTip("#dtStartToolTip_PatternEdit_Module_Notes",
                "Дата начала периода не может быть больше даты окончания периода",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (this.tpStart.timespinner('getValue').trim().length === 0) {
            this.ShowToolTip("#tpStartToolTip_PatternEdit_Module_Notes",
                "Не указано время начала",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (this.tpEnd.timespinner('getValue').trim().length === 0) {
            this.ShowToolTip("#tpEndToolTip_PatternEdit_Module_Notes",
                "Не указано время окончания",
                {title:'Ошибка', delay:3000});
            return;
        }
        if(new Date('1/1/2015 ' + this.tpStart.timespinner('getValue')) >= new Date('1/1/2015 ' + this.tpEnd.timespinner('getValue'))) {
            this.ShowToolTip("#tpStartToolTip_PatternEdit_Module_Notes",
                "Время начала не может быть больше или равно времени окончания",
                {title:'Ошибка', delay:3000});
            return;
        }
        this.Pattern.name = this.tbName.textbox("getText");
        this.Pattern.periodTime.dateStart = this.dtStart.datebox('getValue');
        this.Pattern.periodTime.dateEnd = this.dtEnd.datebox('getValue');
        this.Pattern.periodTime.timeStart = this.tpStart.timespinner('getValue');
        this.Pattern.periodTime.timeEnd = this.tpEnd.timespinner('getValue');
        this.Save();
    }
    /**
     * Сохранение шаблона
     */
    Save() {
        $.ajax({
            method: "POST",
            data: JSON.stringify(this.Pattern),
            url: this.GetUrl('/Notes/SavePattern'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wPatternEdit.window("close");
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

    btnAddGrp_onClick() {
        StartModalModuleGrpList({}, function(data){
            this.LoadGrpFromId(data);
        }.bind(this));
    }

    btnAddAbon_onClick() {
        StartModalModuleAbonList({}, function(data){
            this.abonsNewCnt++;
            this.LoadAbonFromId(data);
        }.bind(this));
    }

    btnDelGrp_onClick() {
        if(!this.IsOneSelected(this.dgGrps)) {
            this.ShowWarning("Выберете для удаления одну запись!");
            return;
        }
        let group = this.dgGrps.datagrid('getSelected');
        let id = group.id;
        for(let i = 0; i < this.Pattern.grps.length; i++) {
            if(this.Pattern.grps[i].id === id) {
                this.Pattern.grps[i].del = 1 - this.Pattern.grps[i].del;
                this.updateGrps();
                return;
            }
        }
    }

    btnDelAbon_onClick() {
        if(!this.IsOneSelected(this.dgAbons)) {
            this.ShowWarning("Выберете для удаления одну запись!");
            return;
        }
        let abon = this.dgAbons.datagrid('getSelected');
        let id = abon.id;
        for(let i = 0; this.Pattern.abons; i++) {
            if(this.Pattern.abons[i].id === id) {
                this.Pattern.abons[i].del = 1 - this.Pattern.abons[i].del;
                this.updateAbons();
                return;
            }
        }
    }

    dgGrps_onLoadSuccess(data) {
        this.dgGrps.datagrid('unselectAll');
        if(data.total > 0) {
            if(this.InGrpId != "") {
                for (let i=0; i<data.rows.length; i++) {
                    if (data.rows[i].id == this.InGrpId) {
                        this.dgGrps.datagrid("selectRecord", this.InGrpId);
                        return;
                    }
                }
                this.InGrpId = "";
            }
            if (this.InGrpIndex >= 0 && this.InGrpIndex < data.total) {
                this.dgGrps.datagrid("selectRow", this.InGrpIndex);
            } else if (data.total > 0) {
                this.dgGrps.datagrid("selectRow", data.total - 1);
            }
            this.InGrpIndex = 0;
        }
    }

    dgGrps_onSelect(index, row) {
        if(row != null) {
            this.InGrpId = row.id;
        }
        else {
            this.InGrpId = "";
        }
        if(row != null && row.del == 1) {
            this.btnDelGrp.linkbutton({iconCls:"icon-undo", text:"Вернуть"});
        }
        else {
            this.btnDelGrp.linkbutton({iconCls:"icon-remove", text:"Удалить"});
        }
    }

    dgAbons_onLoadSuccess(data) {
        this.dgAbons.datagrid('unselectAll');
        if(data.total > 0) {
            if(this.InAbonId != "") {
                for (let i=0; i<data.rows.length; i++) {
                    if (data.rows[i].id == this.InAbonId) {
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