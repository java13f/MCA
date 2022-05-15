package org.kaznalnrprograms.MCA.GoView.Dao;

import org.kaznalnrprograms.MCA.GoView.Interfaces.IGoViewDao;
import org.kaznalnrprograms.MCA.GoView.Models.*;
import org.kaznalnrprograms.MCA.Utils.DBUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Repository
public class GoViewDaoImpl implements IGoViewDao {
    private String appName = "Монитор хода выполнения оповещений";
    private DBUtils db;

    public GoViewDaoImpl(DBUtils db) {
        this.db = db;
    }

    /**
     * Возвращает модель для комбобокса Шаблоны оповещения
     * @return
     * @throws Exception
     */
    public AllCombobox PttrnList() throws Exception {
        AllCombobox r = new AllCombobox();
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();

            // Список активных шаблонов
            var sql = "select distinct p.id,p.name, null as parentid " +
                    " from patterns p " +
                    " join notes n on n.pattern_id = p.id and n.del=0" +
                    " join stts s on n.stts_id = s.id and s.code='001' and s.del=0  /*s.code='001' задание оповещается */ " +
                    " where p.del=0" +
                    " order by name";
            r.setPttrn(db.Query(con, sql, ComboboxModel.class, params));
            return r;
        }
    }

    /**
     * Возвращает модель для комбобокса Задания
     * @return
     * @throws Exception
     */
    public AllCombobox TasksList() throws Exception {
        AllCombobox r = new AllCombobox();
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            // Список активных заданий
            var sql = "select  n.id, n.pattern_id parentId, to_char(n.date, 'HH24:MI') || ' ' || n.name as name " +
                    " from notes n " +
                    " join stts s on n.stts_id = s.id and s.code='001' and s.del=0   /* s.code='001' задание оповещается */ " +
                    " where n.del=0" +
                    " order by name";
            r.setTasks(db.Query(con, sql, ComboboxModel.class, params));
            return r;
        }
    }
    /**
     * Возвращает модель для комбобокса Сервер Астериск
     * @throws Exception
     */
    public AllCombobox AsterList(AbonServModel data) throws Exception {
        AllCombobox r = new AllCombobox();
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            params.put("note_id",data.getServer_id());
            // Список активных Астереск серверов
            var sql = "select distinct a.note_id as parentid, sa.id, sa.name\n"
                    + "  from notes n \n"
                    + "  join stts s on n.stts_id = s.id and s.code='001'                 and s.del=0        /* s.code='001'задание оповещается */\n"
                    + "  join note_abons a on a.note_id=n.id                              and a.del=0 \n"
                    + "  join stts sta on a.stts_id=sta.id and sta.code<>'002'            and sta.del=0  /* sta.code='002' абонент закончил */\n"
                    + "  join servers sa on sa.id= a.server_id                            and sa.del=0 \n"
                    + "  join server_types t on t.id=sa.srv_type_id and t.code='ASTERISK' and t.del=0 \n"
                    + "  where n.id=:note_id::uuid and n.del=0\n"
                    + " order by name";
            r.setAster(db.Query(con, sql, ComboboxModel.class, params));
            return r;
        }
    }
    /**
     * Возвращает модель для комбобокса Сервер SMS
     * @return
     * @throws Exception
     */
    public AllCombobox SMSList(AbonServModel data) throws Exception {
        AllCombobox r = new AllCombobox();
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            params.put("note_id",data.getServer_id());
            // Список активных SMS серверов
            var sql = "select distinct a.note_id as parentid, sa.id, sa.name\n"
                    + "  from notes n \n"
                    + "  join stts s on n.stts_id = s.id and s.code='001'            and s.del=0   /*s.code='001' задание оповещается */\n"
                    + "  join note_abons a on a.note_id=n.id                         and a.del=0\n"
                    + "  join stts sta on a.stts_id=sta.id and sta.code<>'002'       and sta.del=0 /*sta.code='002' абонент закончил */\n"
                    + "  join servers sa on sa.id= a.server_id                       and sa.del=0\n"
                    + "  join server_types t on t.id=sa.srv_type_id and t.code='SMS' and t.del=0\n"
                    + "  where n.id=:note_id::uuid and n.del=0\n"
                    + " order by name";
            r.setSms(db.Query(con, sql, ComboboxModel.class, params));
            return r;
        }
    }
    /**
     * Возвращает модель для комбобокса Сервер EMail
     * @return
     * @throws Exception
     */
    public AllCombobox EMailList(AbonServModel data) throws Exception {
        AllCombobox r = new AllCombobox();
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            params.put("note_id",data.getServer_id());
            // Список активных EMail серверов
            var sql = "select distinct a.note_id as parentid, sa.id, sa.name\n"
                    + "  from notes n \n"
                    + "  join stts s on n.stts_id = s.id and s.code='001'              and s.del=0       /*s.code='001' задание оповещается */\n"
                    + "  join note_abons a on a.note_id=n.id                           and a.del=0\n"
                    + "  join stts sta on a.stts_id=sta.id and sta.code<>'002'         and sta.del=0 /*sta.code='001' абонент закончил */\n"
                    + "  join servers sa on sa.id= a.server_id                         and sa.del=0\n"
                    + "  join server_types t on t.id=sa.srv_type_id and t.code='EMAIL' and t.del=0\n"
                    + "  where n.id=:note_id::uuid and n.del=0\n"
                    + " order by name";
            r.setEmail(db.Query(con, sql, ComboboxModel.class, params));
            return r;
        }
    }
        /**
         * Возвращает модель для заполнения полей статистики
         * @return
         * @throws Exception
         */
    public StatModel GetStat(String note_id) throws Exception {
        List<StatModel> r = new ArrayList<StatModel>();
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            params.put("note_id",note_id);

            var sql = "select\n" +
                    " (select count(*) from notes n \n" +
                    "  join note_abons a on a.note_id=n.id and a.del=0 \n" +
                    "  join stts sn on sn.id=n.stts_id     and sn.del=0 \n" +
                    "  where sn.code='001' and :note_id::uuid=n.id and n.del=0) as all,   /* Всего */\n" +
                    " (select count(*) from notes n \n" +
                    "  join note_abons a on a.note_id=n.id                 and a.del=0 \n" +
                    "  join stts sn on sn.id=n.stts_id and sn.code='001'   and sn.del=0\n" +
                    "  join stts sa on sa.id=a.stts_id and sa.code='000'   and sa.del=0\n" +
                    "  where :note_id::uuid=n.id and server_id is not null and n.del=0) as queue,  /* Очередь */\n" +
                    " (select count(*) from notes n \n" +
                    "  join note_abons a on a.note_id=n.id                 and a.del=0 \n" +
                    "  join stts sn on sn.id=n.stts_id and sn.code='001'   and sn.del=0\n" +
                    "  join stts sa on sa.id=a.stts_id and sa.code='001'   and sa.del=0\n" +
                    "  where :note_id::uuid=n.id and server_id is not null and n.del=0) as note,  /* Оповещается */\n" +
                    " (select count(*) from notes n \n" +
                    "  join note_abons a on a.note_id=n.id                 and a.del=0 \n" +
                    "  join stts sn on sn.id=n.stts_id and sn.code='001'   and sn.del=0\n" +
                    "  join stts sa on sa.id=a.stts_id and sa.code='002'   and sa.del=0\n" +
                    "  where :note_id::uuid=n.id and server_id is not null and n.del=0) as end,  /* Закончено */\n" +
                    " (select count(*) from notes n \n" +
                    "  join note_abons a on a.note_id=n.id                      and a.del=0 \n" +
                    "  join stts sn on sn.id=n.stts_id        and sn.code='001' and sn.del=0 \n" +
                    "  join stts sa on sa.id=a.stts_id        and sa.code='002' and sa.del=0 \n" +
                    "  join res_flags r on r.id=a.res_flag_id and r.code='001'  and r.del=0 \n" +
                    "  where :note_id::uuid=n.id and server_id is not null      and n.del=0) as seccess, /* Успешно закончено*/\n" +
                    " (select count(*) from notes n \n" +
                    "  join note_abons a on a.note_id=n.id                      and a.del=0 \n" +
                    "  join stts sn on sn.id=n.stts_id        and sn.code='001' and sn.del=0 \n" +
                    "  join stts sa on sa.id=a.stts_id        and sa.code='002' and sa.del=0 \n" +
                    "  join res_flags r on r.id=a.res_flag_id and r.code='002'  and r.del=0 \n" +
                    "  where :note_id::uuid=n.id and server_id is not null      and n.del=0) as fail, /* НеУспешно закончено*/\n"+
                    " (select count(*) from notes n \n" +
                    "  join note_abons   a on a.note_id=n.id                                    and a.del=0 \n" +
                    "  join servers      s on a.server_id=s.id                                  and s.del=0 \n" +
                    "  join server_types st on s.srv_type_id=st.id and st.code='ASTERISK'       and st.del=0 \n" +
                    "  join stts         sn on sn.id=n.stts_id     and sn.code='001'            and sn.del=0 \n" +
                    "  join stts         sa on sa.id=a.stts_id     and sa.code in ('000','001') and sa.del=0 \n" +
                    "  where :note_id::uuid=n.id                                                and n.del=0) as aster, /* Сервера ASTERISK*/\n"+
                    " (select count(*) from notes n \n" +
                    "  join note_abons a on a.note_id=n.id                                      and a.del=0 \n" +
                    "  join servers      s on a.server_id=s.id                                  and s.del=0 \n" +
                    "  join server_types st on s.srv_type_id=st.id and st.code='SMS'            and st.del=0 \n" +
                    "  join stts sn on sn.id=n.stts_id             and sn.code='001'            and sn.del=0 \n" +
                    "  join stts sa on sa.id=a.stts_id             and sa.code in ('000','001') and sa.del=0 \n" +
                    "  where :note_id::uuid=n.id                                                and n.del=0) as sms, /* Сервера SMS*/\n"+
                    " (select count(*) from notes n \n" +
                    "  join note_abons a on a.note_id=n.id                                      and a.del=0 \n" +
                    "  join servers      s on a.server_id=s.id                                  and s.del=0 \n" +
                    "  join server_types st on s.srv_type_id=st.id and st.code='EMAIL'          and st.del=0 \n" +
                    "  join stts sn on sn.id=n.stts_id             and sn.code='001'            and sn.del=0 \n" +
                    "  join stts sa on sa.id=a.stts_id             and sa.code in ('000','001') and sa.del=0 \n" +
                    "  where :note_id::uuid=n.id                                                and n.del=0) as email /* Сервера EMAIL*/\n";
            r = db.Query(con, sql, StatModel.class, params);
            return r.get(0);
        }
    }

    /**
     * Возвращает модель для заполнения датагрида Очередь
     * @param data
     * @return
     * @throws Exception
     */
    public List<DGsModel> QueueList(AbonServModel data) throws Exception {
        List<DGsModel> r= new ArrayList<DGsModel>();
        if(data.getNote_id()==null||data.getNote_id().equals("")) return r;

        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            params.put("server_id", data.getServer_id());
            params.put("note_id", data.getNote_id());

            var sql = "select a.id, a.prior, get_fio(a.fam || ' ' || a.ima || ' ' || a.otch , 0) abon_fam_io, \n" +
                    "p.code_view pin_code_view, \n" +
                    " to_char(now()-na.changed,'HH24:MI') as time\n" +
                    "from note_abons na\n" +
                    "join stts  sna on sna.id=na.stts_id and sna.code='000'  and sna.del=0 /* абонент не начал   */\n" +
                    "join notes   n on n.id=na.note_id                        and n.del=0 \n" +
                    "join stts   sn on sn.id=n.stts_id and sn.code='001'      and sn.del=0 /* задания выполняется */\n" +
                    "join abons   a on na.abon_id = a.id                      and a.del=0 \n" +
                    "join pins    p on p.abon_id= na.abon_id and p.no=na.pin_no and p.del=0\n" +
                    "join switchs s on s.id= p.switch_id and s.server_type_id=na.server_type_id and s.del=0 \n" +
                    "where server_id=:server_id::uuid \n" +
                    "  and na.note_id=:note_id::uuid" +
                    "  and na.del=0\n"+
                    " order by a.prior, time\n";
            r = db.Query(con, sql, DGsModel.class, params);

            return r;
        }
    }
    /**
     * Возвращает модель для заполнения датагрида Оповещаются
     * @param data
     * @return
     * @throws Exception
     */
    public List<DGsModel> NoteList(AbonServModel data) throws Exception {
        List<DGsModel> r= new ArrayList<DGsModel>();
        if(data.getNote_id()==null||data.getNote_id().equals("")) return r;
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();
            params.put("server_id", /*"123dda28-7c7a-48b9-a070-381e3a902dad"*/ data.getServer_id());
            params.put("note_id", data.getNote_id());

            var sql = "select a.prior, get_fio(a.fam || ' ' || a.ima || ' ' || a.otch , 0) abon_fam_io, \n" +
                    "p.code_view pin_code_view, \n" +
                    " to_char(now()-na.changed,'HH24:MI') as time\n" +
                    "from note_abons na\n" +
                    "join stts  sna on sna.id=na.stts_id and sna.code='001'  and sna.del=0 /* абонент оповещается */\n" +
                    "join notes   n on n.id=na.note_id                        and n.del=0 \n" +
                    "join stts   sn on sn.id=n.stts_id and sn.code='001'      and sn.del=0 /* задания выполняется */\n" +
                    "join abons   a on na.abon_id = a.id                      and a.del=0\n" +
                    "join pins    p on p.abon_id= na.abon_id and p.no=na.pin_no and p.del=0\n" +
                    "join switchs s on s.id= p.switch_id and s.server_type_id=na.server_type_id and s.del=0 \n" +
                    "where server_id=:server_id::uuid \n" +
                    "  and na.note_id=:note_id::uuid" +
                    "  and na.del=0\n"+
                    "  order by time, abon_fam_io\n";
            r = db.Query(con, sql, DGsModel.class, params);


            return r;
        }
    }
    /**
     * Возвращает из глобальных параметров update_time Интервал обновления монитора (сек)
     */
    public AbonServModel GetInterval() throws Exception {
        AbonServModel r;
        try (var con = db.getConnection(appName)) {
            var params = new HashMap<String, Object>();

            var sql = "select value as abon_id from global_params where param_code='update_time'";
            r = db.Query(con, sql, AbonServModel.class, params).get(0);

            return r;
        }
    }
}