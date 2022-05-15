export class INewsDao {
    constructor() {
        this.sLoc = new LibLockService(300000);
        this.news_filter = {
            chkDateBeg: false,
            dateBeg: this.dtFormatter(new Date()),
            chkDateEnd: false,
            dateEnd: this.dtFormatter(new Date()),
            showDel: false
        };
    }
    dtFormatter(date){
        let y = date.getFullYear();
        let m = date.getMonth()+1;
        let d = date.getDate();
        let str_date = (d < 10 ? ('0'+ d) : d) + '.' + (m < 10 ? ('0' + m) : m) + '.' + y;
        return str_date;
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
     * Передача модели на сайт
     * @param method метод запроса
     * @param url адрес
     * @param model модель
     * @returns {Promise<*>}
     * @constructor
     */
    async RequestJSON(method, url, model){
        return $.ajax({
                method: method,
                url: url,
                data: JSON.stringify(model),
                contentType: "application/json; charset=utf-8",
                headers: GetCSRFTokenHeader(),
            }
        );
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
     * Проверка блокировки новости
     * @param id идентификатор новости
     * @returns {Promise<T>}
     * @constructor
     */
    async StateLockRecord(id){
        return await this.sLoc.StateLockRecordAsync("i_news", -1, id);
    }
    /**
     * Блокировка записи
     * @param id идентификатор записи
     * @returns {Promise<T>}
     * @constructor
     */
    async LockRecord(id){
        return await this.sLoc.LockRecordAsync("i_news", -1, id);
    }

    /**
     * Удаление блокировки новости
     * @param id идентификатор новости
     * @constructor
     */
    FreeLockRecord(id){
        this.sLoc.FreeLockRecordAsync("i_news", -1, id);
    }
    /**
     * Добавление/Обновление новости
     * @param model модель новости
     * @returns {Promise<*>}
     * @constructor
     */
    async Save(model){
        return await this.RequestJSON("post", this.getUrl("/INews/save"), model)
    }

    /**
     * Получить новость для изменения/просмотра
     * @param Id идентификатор новости
     * @returns {Promise<void>}
     * @constructor
     */
    async GetINews(Id){
        return await this.RequestSimple("post", this.getUrl("/INews/get"), {id: Id});
    }

    /**
     * Уудаление нововсти
     * @param Id идентификатор новости
     * @returns {Promise<void>}
     * @constructor
     */
    async Delete(Id){
        return await this.RequestSimple("post", this.getUrl("/INews/delete"), {id: Id});
    }

    /**
     * Получить настройкифильтра
     * @constructor
     */
    GetFilter(){
        return this.news_filter;
    }

    /**
     * Заполмнить настройки фильтра
     * @param filter настройки фильтра
     * @constructor
     */
    SetFilter(filter){
        this.news_filter = filter;
    }
}