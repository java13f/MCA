import {jrResultOfNotificationParams} from "./jrResultOfNotificationParams.js";
import {Jasper} from "../Jasper/Jasper.js";

class jrResultOfNotification extends FormView {

    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.params = {};
        this.repParams = {};
    }

    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.ModuleId = id;

        let a = this.GetUrl("/jrResultOfNotification/jrResultOfNotification?prefix=" + this.prefix);

        LoadForm("#" + this.ModuleId, this.GetUrl("/jrResultOfNotification/jrResultOfNotification?prefix=" + this.prefix),
            this.InitFunc.bind(this));
    }

    /*
    Функция инициализации
     */
    async InitFunc() {
        try {
            this.InitComponents(this.ModuleId, this.prefix);

            let rights = await this.LoadRights();
            if (!rights) {
                return;
            }

            this.btnPrint.linkbutton({onClick: this.btnPrint_onClick.bind(this)});
            this.btnWord.linkbutton({onClick: this.btnWord_onClick.bind(this)});
            this.btnExcel.linkbutton({onClick: this.btnExcel_onClick.bind(this)});
            this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});

            this.repParams.jrxml = "jrResultOfNotification";
            this.jsp = new Jasper();

            this.btnUpdate_onClick();
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /*
    Получение прав
     */
    async LoadRights() {
        try {
            let view = await this.s_get('/CoreUtils/GetActRights?TaskCode=jrResultOfNotification&ActCode=jrResultOfNotificationView',)
            if (view.length > 0) {
                this.ShowWarning(view);
                return false;
            }
            return true;
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /*
    Обработчик кнопки обновления списка записей
     */
    btnUpdate_onClick() {
        let form = new jrResultOfNotificationParams();
        this.divArea.html('<table width="100%" height="100%"><tr><td style="text-align:center"><div>Загрузка...</div></td></tr></table>');
        form.SetResultFunc(async function (data) {
            if (data != null) {
                this.params = data;
                this.repParams.params = [
                    {name: "date", type: "String", value: data.date},
                    {name: "note_id", type: "String", value: data.note_id},
                    {name: "time", type: "String", value: data.time}
                ];
                let content = await this.jsp.GenerateHTMLAsync(this.repParams);
                this.divArea.html(content);
            }
        }.bind(this));
        form.Show(this.params)
    }

    /*
    Обработчик нажатия на кнопку печати
     */
    btnPrint_onClick() {
        this.jsp.GeneratePDF(this.repParams);
    }

    /*
    Обработчик нажатия на кнопку экспорта в Word
     */
    btnWord_onClick() {
        this.jsp.GenerateDocx(this.repParams);
    }

    /*
    Обработчик нажатия на кнопку экспорта в Excel
     */
    btnExcel_onClick() {
        this.jsp.GenerateXls(this.repParams);
    }

}

export function StartNestedModule(id) {
    let form = new jrResultOfNotification("nested_", {});
    form.Start(id);
}