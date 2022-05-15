export class MainAppDao {
    constructor() {
    }
    /**
     * Получить URL с учётом контекста
     * @param url адрес
     * @returns {string}
     */
    getUrl(url){
        return contextPath + url
    }
    /**
     * Пполучение данных. В качестве передаваемых данных необходимо использовать простые данные
     * @param method метод запроса
     * @param url адрес
     * @param data данные
     * @returns {Promise<void>}
     * @constructor
     */
    async RequestSimple(method, url, data){
        return $.ajax({
                method: method,
                url: url,
                data: data,
                headers: GetCSRFTokenHeader(),
            }
        );
    }

    /**
     * Получить новости
     * @param page номер страницы
     * @param rows количество записей на странице
     * @returns {Promise<void>}
     * @constructor
     */
    async GetNews(page, rows){
        return await this.RequestSimple("get", this.getUrl("/MainApp/getNews?rows=" + rows + "&page=" + page));
    }
}