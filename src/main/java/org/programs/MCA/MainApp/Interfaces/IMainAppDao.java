package org.kaznalnrprograms.MCA.MainApp.Interfaces;

import org.kaznalnrprograms.MCA.MainApp.Models.AppModel;
import org.kaznalnrprograms.MCA.MainApp.Models.NewsModel;

import java.util.List;

public interface IMainAppDao {
    /**
     * Получить приложения для построения меню
     * @return
     * @throws Exception
     */
    List<AppModel> getApps() throws Exception;

    /**
     * Получить новость
     * @param id идентификатор новости
     * @return
     */
    NewsModel getOneNews(String id) throws Exception;

    /**
     * Получить новости
     * @param rows количество новостей на странице
     * @param page страница
     * @param total общее количество новостей
     * @return
     */
    List<NewsModel> getNews(int rows, int page, int total) throws Exception;
    /**
     * Получить общее количество новостей
     * @return
     */
    int getNewsTotal() throws Exception;
}
