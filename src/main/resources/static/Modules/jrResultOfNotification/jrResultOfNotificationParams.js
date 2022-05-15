export class jrResultOfNotificationParams extends FormView {
    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;
        this.StartParams = StartParams;

        this.notesData = {};
        this.timesData = {};

        this.currentDate = "";
        this.currentNoteId = "";
        this.currentTime = "";
    }

    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows",
            this.GetUrl("/jrResultOfNotification/jrResultOfNotificationParams"),
            this.InitFunc.bind(this)
        );
    }

    /*
    Функция инициализации
     */
    async InitFunc() {
        this.InitComponents("wJrResultOfNotificationParams_Module_jrResultOfNotification", "");
        this.InitCloseEvents(this.wJrResultOfNotificationParams);
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wJrResultOfNotificationParams.window("close")
            }
        });

        this.cbNote.combobox({onSelect: this.cbNote_onSelect.bind(this)});
        this.cbTime.combobox({onSelect: this.cbTime_onSelect.bind(this)});

        await this.InitComboboxes();

        this.dtDate.datebox({
            formatter: this.dateFormatter.bind(this),
            parser: this.dateParser.bind(this),
            onSelect: this.dtDate_onSelect.bind(this),
            editable: false
        });

        await this.LoadParams();
    }

    /*
    Инициализация комбобоксов
     */
    InitComboboxes() {
        this.cbNote.combobox({
            valueField: "id",
            textField: "name"
        });

        this.cbTime.combobox({
            valueField: "time",
            textField: "time"
        });
    }

    /*
    Загрузка стартовых параметров
     */
    async LoadParams() {
        if (this.options != null) {
            if (this.options.date != null) {
                this.currentDate = this.options.date;
                this.dtDate.datebox("setText", this.currentDate);
                await this.LoadNotes();
            }

            if (this.options.note_id != null) {
                this.currentNoteId = this.options.note_id;
                for (let i = 0; i < this.notesData.length; i++) {
                    if (this.notesData[i].id == this.currentNoteId) {
                        this.cbNote.combobox("setValue", this.currentNoteId);
                    }
                }

                if (this.options.time != null && this.cbNote.combobox("getText").length > 0) {
                    this.currentTime = this.options.time;
                    await this.LoadTimeList();
                    for (let i = 0; i < this.timesData.length; i++) {
                        if (this.timesData[i].time == this.currentTime) {
                            this.cbTime.combobox("setValue", this.currentTime);
                        }
                    }
                }
            }
        }
    }

    /*
    Загрузка оповещений
     */
    async LoadNotes() {
        try {
            let data = await this.s_postCTRF('/jrResultOfNotification/getNotesByDate',
                {date: this.currentDate});
            if (data != null) {
                this.notesData = data;
                this.cbNote.combobox({data: this.notesData});
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /*
    Загрузка списка времён оповещений
     */
    async LoadTimeList() {
        try {
            let data = await this.s_postCTRF('/jrResultOfNotification/getListTimeByNoteAndDate',
                {note_id: this.currentNoteId, date: this.currentDate});
            if (data != null) {
                this.timesData = data;
                this.cbTime.combobox({data: this.timesData});
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /*
    Обработчик выбора даты
     */
    async dtDate_onSelect(item) {
        this.currentDate = this.dateFormatter(item);
        await this.LoadNotes();
    }

    /*
    Обработчик выбора оповещения
     */
    async cbNote_onSelect(item) {
        this.currentNoteId = item.id;
        await this.LoadTimeList();
    }

    /*
    Обработчик выбора времени
     */
    cbTime_onSelect(item) {
        this.currentTime = item.time;
    }

    /*
    Обработчик нажатия на кнопку Ок
     */
    btnOk_onClick() {
        if (!this.CheckData()) {
            return;
        }

        let params = {
            date: this.currentDate,
            note_id: this.currentNoteId,
            time: this.currentTime
        }

        if (this.ResultFunc != null) {
            this.ResultFunc(params);
        }

        this.wJrResultOfNotificationParams.window("close");
    }

    /*
    Проверка данных введённых для формирования отчёта
     */
    CheckData() {
        if (this.dtDate.datebox("getText").length == 0) {
            this.ShowToolTip(this.ttDate, "Укажите дату!", {});
            return false;
        }
        if (this.cbNote.combobox("getText").length == 0) {
            this.ShowToolTip(this.ttNote, "Укажите оповещение!", {});
            return false;
        }
        if (this.cbTime.combobox("getText").length == 0) {
            this.ShowToolTip(this.ttTime, "Укажите время!", {});
            return false;
        }
        return true;
    }

    // Форматер и парсер для Datebox
    dateFormatter(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return (d < 10 ? ('0' + d) : d) + '.'
            + (m < 10 ? ('0' + m) : m) + '.'
            + y.toString();
    };

    dateParser(s) {
        if (!s) return new Date();
        var ss = (s.split('.'));
        var y = parseInt(ss[2], 10);
        var m = parseInt(ss[1], 10);
        var d = parseInt(ss[0], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    };
}