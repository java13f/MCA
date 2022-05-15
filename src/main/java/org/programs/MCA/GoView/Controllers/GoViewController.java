package org.kaznalnrprograms.MCA.GoView.Controllers;

import org.kaznalnrprograms.MCA.GoView.Interfaces.IGoViewDao;
import org.kaznalnrprograms.MCA.GoView.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class GoViewController {
    private IGoViewDao dGoView;

    public GoViewController(IGoViewDao dGoView) {        this.dGoView = dGoView;    }

    @GetMapping("/GoView/GoViewStart")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public String GoView() {        return "GoView/GoViewStart";    }

    @GetMapping("/GoView/GoViewList")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public String GoViewList(){
        return "GoView/GoViewList :: GoViewList";
    }

    /**
     * Возвращает данные для выпадающего списка "Шаблон оповещения"
     * @return
     */
    @PostMapping("/GoView/PttrnList")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public @ResponseBody AllCombobox PttrnList() throws Exception {
        AllCombobox r= dGoView.PttrnList();
        return r;
    }
    /**
     * Возвращает данные для выпадающего списка "Задания"
     * @return
     */
    @PostMapping("/GoView/TasksList")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public @ResponseBody AllCombobox TasksList() throws Exception {
        AllCombobox r= dGoView.TasksList();
        return r;
    }
    /**
     * Возвращает данные для выпадающего списка "Сервер Астериск"
     * @return
     */
    @PostMapping("/GoView/AsterList")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public @ResponseBody AllCombobox AsterList(@RequestBody  AbonServModel data) throws Exception {
        AllCombobox r= dGoView.AsterList(data);
        return r;
    }
    /**
     * Возвращает данные для выпадающего списка "Сервер SMS"
     * @return
     */
    @PostMapping("/GoView/SMSList")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public @ResponseBody AllCombobox SMSList(@RequestBody  AbonServModel data) throws Exception {
        AllCombobox r= dGoView.SMSList(data);
        return r;
    }
    /**
     * Возвращает данные для выпадающего списка "Сервер EMail"
     * @return
     */
    @PostMapping("/GoView/EMailList")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public @ResponseBody AllCombobox EMailList(@RequestBody  AbonServModel data) throws Exception {
        AllCombobox r= dGoView.EMailList(data);
        return r;
    }

    /**
     * Посчет статистики
     */
    @GetMapping("/GoView/GetStat")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public @ResponseBody StatModel GetStat(String note_id) throws Exception {
        StatModel r= dGoView.GetStat(note_id);
        return r;
    }

    /**
     * Возвращает данные для грида Очередь заданного сервера
     * @return
     */
    @PostMapping("/GoView/QueueList")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public @ResponseBody List<DGsModel> QueueList(@RequestBody AbonServModel data) throws Exception {
        List<DGsModel> r= dGoView.QueueList(data);
        return r;
    }

    /**
     * Возвращает данные для грида Оповещаются  заданного сервера
     * @return
     */
    @PostMapping("/GoView/NotesList")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public @ResponseBody List<DGsModel> NoteList(@RequestBody AbonServModel data) throws Exception {
        List<DGsModel> r= dGoView.NoteList(data);
        return r;
    }

    /**
     *  Возвращает из глобальных параметров update_time Интервал обновления монитора (сек)
     * @return
     */
    @GetMapping("/GoView/GetInterval")
    @PreAuthorize("GetActRight('GoView','GoViewView')")
    public @ResponseBody AbonServModel GetInterval() throws Exception {
        AbonServModel r= dGoView.GetInterval();
        return r;
    }


}