package org.kaznalnrprograms.MCA.LockService.Interfaces;

public interface ILockServiceDao {
    /**
     * Проверить сосояние блокировки записи
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @param uuid - уникальный идентификатор
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    String StateLockRecord(String table, Integer recId, String uuid) throws Exception;
    /**
     * Накладывает блокировку на запись
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @param uuid - уникальный идентификатор записи
     * @return - если запись заблокирована возвращает сообщение о том, что запись заблокирована, а иначе возвращает пустую строку
     */
    String LockRecord(String table, Integer recId, String uuid) throws Exception;

    /**
     * Обновляет блокировку на записи
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @param uuid - уникальный идентификатор записи
     */
    void UpdateLock(String table, Integer recId, String uuid) throws Exception;
    /**
     * Удаляет блокировку
     * @param table - имя таблицы базы данных
     * @param recId - идентификатор записи
     * @param uuid - уникальный идентификатор записи
     */
    void FreeLockRecord(String table, Integer recId, String uuid) throws Exception;
}
