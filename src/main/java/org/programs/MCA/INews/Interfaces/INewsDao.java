package org.kaznalnrprograms.MCA.INews.Interfaces;

import org.kaznalnrprograms.MCA.INews.Models.NewsFilterModel;
import org.kaznalnrprograms.MCA.INews.Models.NewsModel;
import org.kaznalnrprograms.MCA.INews.Models.NewsViewModel;

import java.util.List;

public interface INewsDao {
    /**
     * Получить список новостей
     * @param filter настройки фильтра
     * @return
     * @throws Exception
     */
    List<NewsViewModel> getList(NewsFilterModel filter) throws Exception;

    /**
     * Получить общее количество новостей
     * @param filter фильтр по новостям
     * @return
     * @throws Exception
     */
    int getTotalNews(NewsFilterModel filter) throws Exception;

    /**
     * Получить новость для редаитрования
     * @param id иденификатор новости
     * @return
     * @throws Exception
     */
    NewsModel get(String id) throws Exception;

    /**
     * Сохранение новости
     * @param model модель новости
     * @return
     * @throws Exception
     */
    String save(NewsModel model) throws Exception;

    /**
     * Удаление новости
     * @param id идентификатор новости
     * @throws Exception
     */
    void delete(String id) throws Exception;
}
