export class INewsFilterForm extends FormView {
    constructor(dNews){
        super();
        this.dNews = dNews;
        this.options = {AddMode: true};
    }
    Show(){
        LoadForm("#ModalWindows", this.GetUrl("/INews/INewsFilterForm"), this.InitFunc.bind(this));
    }
    InitFunc(){
        this.InitComponents("wINewsFilterForm_Module_INews", "");
        this.InitCloseEvents(this.wINewsFilterForm);
        this.btnCancel.linkbutton({onClick: function(){this.wINewsFilterForm.window("close");}.bind(this)});
        this.dtDateBeg.datebox({
            formatter: this.dtFormatter.bind(this),
            parser: this.dtParser.bind(this)
        });

        this.dtDateEnd.datebox({
            formatter: this.dtFormatter.bind(this),
            parser: this.dtParser.bind(this)
        });
        this.cbDateBeg.checkbox({onChange: this.cbDateBeg_onChange.bind(this)});
        this.cbDateEnd.checkbox({onChange: this.cbDateEnd_onChange.bind(this)});
        this.btnClearFilter.linkbutton({onClick: this.btnClearFilter_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});

        let filter = this.dNews.GetFilter();

        this.dtDateBeg.datebox("setValue", filter.dateBeg);
        this.dtDateEnd.datebox("setValue", filter.dateEnd);
        filter.showDel ? this.cbShowDel.checkbox("check"):this.cbShowDel.checkbox("uncheck");
        filter.chkDateBeg ? this.cbDateBeg.checkbox("check") : this.cbDateBeg.checkbox("uncheck");
        filter.chkDateEnd ? this.cbDateEnd.checkbox("check") : this.cbDateEnd.checkbox("uncheck");

        filter.chkDateBeg ?  this.dtDateBeg.datebox("enable") : this.dtDateBeg.datebox("disable");
        filter.chkDateEnd ?  this.dtDateEnd.datebox("enable") : this.dtDateEnd.datebox("disable");
    }
    dtFormatter(date){
        let y = date.getFullYear();
        let m = date.getMonth()+1;
        let d = date.getDate();
        let str_date = (d < 10 ? ('0'+ d) : d) + '.' + (m < 10 ? ('0' + m) : m) + '.' + y;
        return str_date;
    }
    dtParser(str) {
        if (!str) return new Date();
        let date = str.split('.');
        let y = parseInt(date[2], 10);
        let m = parseInt(date[1], 10);
        let d = parseInt(date[0], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    }

    /**
     * Обработка включения/выключения фильтра начальной даты
     */
    cbDateBeg_onChange(){
        let chk = this.cbDateBeg.checkbox("options").checked;
        chk ?  this.dtDateBeg.datebox("enable") : this.dtDateBeg.datebox("disable")
    }
    /**
     * Обработка включения/выключения фильтра конечной даты
     */
    cbDateEnd_onChange(){
        let chk = this.cbDateEnd.checkbox("options").checked;
        chk ?  this.dtDateEnd.datebox("enable") : this.dtDateEnd.datebox("disable")
    }

    /**
     * Оочистка фильтра
     */
    btnClearFilter_onClick(){
        let filter = {
            chkDateBeg: false,
            dateBeg: this.dtFormatter(new Date()),
            chkDateEnd: false,
            dateEnd: this.dtFormatter(new Date()),
            showDel: false
        };
        this.dtDateBeg.datebox("setValue", filter.dateBeg);
        this.dtDateEnd.datebox("setValue", filter.dateEnd);
        filter.showDel ? this.cbShowDel.checkbox("check"):this.cbShowDel.checkbox("uncheck");
        filter.chkDateBeg ? this.cbDateBeg.checkbox("check"):this.cbDateBeg.checkbox("uncheck");
        filter.chkDateEnd ? this.cbDateEnd.checkbox("check"):this.cbDateEend.checkbox("uncheck");
    }

    /**
     * Сохранить настройки фильтра
     */
    btnOk_onClick(){
        let filter = {
            chkDateBeg: this.cbDateBeg.checkbox("options").checked,
            dateBeg: this.dtDateBeg.datebox("getValue"),
            chkDateEnd: this.cbDateEnd.checkbox("options").checked,
            dateEnd: this.dtDateEnd.datebox("getValue"),
            showDel: this.cbShowDel.checkbox("options").checked
        };
        this.dNews.SetFilter(filter);
        if(this.ResultFunc){
            this.ResultFunc();
        }
        this.wINewsFilterForm.window("close");
    }
}