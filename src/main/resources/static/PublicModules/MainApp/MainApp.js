import {MainAppDao} from "./Dao/MainAppDao.js";

class MainApp extends FormView {
    constructor(id){
        super();
        this.ModuleId = id;
        this.dMainApp = new MainAppDao();
    }
    async Start(){
        this.InitComponents(this.ModuleId, "");
        this.pPegination.pagination({
            onSelectPage: this.LoadNews.bind(this),
            onRefresh: this.LoadNews.bind(this),
            onChangePageSize: this.LoadNews.bind(this)
        });
        await this.LoadNews();
    }

    /**
     * Загрузка новостей
     * @returns {Promise<void>}
     * @constructor
     */
    async LoadNews(){
        try{
            let options = this.pPegination.pagination("options");
            let news = await this.dMainApp.GetNews(options.pageNumber, options.pageSize);
            this.pPegination.pagination({total: news.total});
            this.rContent.html("");
            for(let i = 0; i < news.rows.length; i++){
                let one_news = news.rows[i];
                this.AddNews(this.rContent, one_news);
            }
            InitEasyUIForBlock("#" + this.ModuleId)
        }
        catch(err){
            this.ShowErrorResponse(err);
        }
    }
    /**
     * Добавить новость на страницу
     * @param news новости
     * @constructor
     */
    AddNews(control, news){
        let url = this.GetUrl("/MainApp/showOneNews?id=" + news.id);
        let html_url = `<a href='${url}'>${news.date} ${news.title}</a>`;
        control.append(`<div style="padding:5px;"><div class="easyui-panel" title="${html_url}" style="padding:5px;" data-options="fit:true">
                        <p>${news.description}</p>
                       </div></div>`)
    }
}

export function StartNestedModule(id){
    let form = new MainApp(id);
    form.Start();
}