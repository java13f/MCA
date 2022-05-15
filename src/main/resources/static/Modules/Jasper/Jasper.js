export class Jasper extends FormView {
    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor() {
        super();
    }

    /**
     * Получение отчёта в формате HTML
     * @constructor
     */
    GenerateHTML(RepParams) {
        RepParams.reportType = 'html';

        $.ajax({
            method: "POST",
            data: JSON.stringify(RepParams),
            url: this.GetUrl('/Jasper/generateReport'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                    let w = window.open("");
                    w.document.body.innerHTML = data.content;
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    GenerateHTMLAsync(RepParams) {
        RepParams.reportType = 'html';

        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: JSON.stringify(RepParams),
                url: this.GetUrl('/Jasper/generateReport'),
                contentType: "application/json; charset=utf-8",
                headers: GetCSRFTokenHeader(),
                success: function (data) {
                    if (data) {
                        resolve(data.content);
                    } else resolve("");
                }.bind(this),
                error: function (data) {
                    this.ShowErrorResponse(data);
                }.bind(this)
            });
        });
    }


    /**
     * Получение отчёта в формате PDF
     * @returns {Promise<unknown>}
     * @constructor
     */
    GeneratePDF(RepParams) {
        RepParams.reportType = 'pdf';

        $.ajax({
            method: "POST",
            data: JSON.stringify(RepParams),
            url: this.GetUrl('/Jasper/generateReport'),
            contentType: "application/json; charset=utf- 8",
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                let file = this.DataToFile(data.content, data.fileName + '.pdf', 'pdf');
                let url = URL.createObjectURL(file);
                window.open(url);
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    /**
     * Получение отчёта в формате .docx
     * @returns {Promise<unknown>}
     * @constructor
     */
    GenerateDocx(RepParams) {
        RepParams.reportType = 'docx';

        $.ajax({
            method: "POST",
            data: JSON.stringify(RepParams),
            url: this.GetUrl('/Jasper/generateReport'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                let docx = this.DataToFile(data.content, data.fileName + '.docx', 'docx');
                let url = URL.createObjectURL(docx);
                var link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', data.fileName + '.docx');
                link.click();
                link.remove();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    /**
     * Получение отчёта в формате .xls
     * @returns {Promise<unknown>}
     * @constructor
     */
    GenerateXls(RepParams) {
        RepParams.reportType = 'xls';

        $.ajax({
            method: "POST",
            data: JSON.stringify(RepParams),
            url: this.GetUrl('/Jasper/generateReport'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                let xls = this.DataToFile(data.content, data.fileName + '.xls', 'xls');
                let url = URL.createObjectURL(xls);
                var link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', data.fileName + '.xls');
                link.click();
                link.remove();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    /*
    Преобразование данных в файл
     */
    DataToFile(dataurl, filename, type) {
        let mime = '';
        if (type == 'pdf') {
            mime = 'application/pdf';
        } else if (type == 'docx') {
            mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (type == 'xls') {
            mime = 'application/vnd.ms-excel';
        } else {
            this.ShowError("Не верный тип файла!");
            return;
        }

        let bstr = atob(dataurl);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {type: mime});
    }
}

/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModule(Id) {
    let form = new Jasper("nested_", "");
    form.Start(Id);
}