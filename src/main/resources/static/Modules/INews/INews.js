import {INewsDao} from "./Dao/INewsDao.js";
import {INewsListView} from "./Views/INewsListView.js";

export function StartNestedModule(id){
    let dNews = new INewsDao();
    let form = new INewsListView(id);
    form.Start();
}