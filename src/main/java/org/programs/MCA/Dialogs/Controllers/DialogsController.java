package org.kaznalnrprograms.MCA.Dialogs.Controllers;

import org.kaznalnrprograms.MCA.Dialogs.Interfaces.IDialogsDao;
import org.kaznalnrprograms.MCA.Dialogs.Models.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
public class DialogsController {
    private IDialogsDao dDialogs;

    public DialogsController(IDialogsDao dDialogs) {
            this.dDialogs =dDialogs;
    }

    /**
     * Запуск модуля
     * @return
     */
    @GetMapping("/Dialogs/DialogsStart")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public String Dialogs() {
        return "Dialogs/DialogsStart";
    }

    /**
     * Загрузка главной формы
     * @return
     */
    @GetMapping("/Dialogs/DialogsList")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public String DialogsList() {
        return "Dialogs/Dialogs :: DialogsList";
    }

    /**
     * Проверка всех прав для модуля
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetActRights")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody RightsModel GetActRights () throws Exception {
        return dDialogs.GetActRights();
    }
    @PostMapping("/Dialogs/CheckAndAddWords")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public String CheckAndAddWords(Map<String, Object> model) throws Exception {
        return dDialogs.CheckAndAddWords(model);
    }

    /** --------------------------------- Действия с "Общие диалоги" 0001----------------------------------- */

    /**
     * Загрузка формы редактирования "Общие диалоги"
     * @return
     */
    @GetMapping("/Dialogs/DialogAllFormEdit")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public String DialogAllFormEdit() {
        return "Dialogs/DialogAllFormEdit :: DialogAllFormEdit";
    }


    /**
     * Возвращает данные для комбобокса Общий диалог
     * @return
     */
    @PostMapping("/Dialogs/DlgAllList")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody    List<CBModel> DlgAll() throws Exception {
        List<CBModel> r= dDialogs.DlgAll();
        return r;
    }

    /**
     * Возвращает данные для грида Общие диалоги
     * @return
     */
    @PostMapping("/Dialogs/DialogAllsGrid")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody  List<DGDialogAllsModel> DialogAllsGrid(@RequestBody Simple data) throws Exception {
        List<DGDialogAllsModel> r= dDialogs.DialogAllsGrid(data);
        return r;
    }

    /**
     * Сохранить запись общего диалога
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/SaveDialogAll")
    @PreAuthorize("GetActRight('Dialogs','DlgAllChange')")
    public @ResponseBody
    String SaveDialogAll(@RequestBody DGDialogAllsModel model) throws Exception {
        return dDialogs.SaveDialogAll(model);
    }

    /**
     * Удалить общий диалог (не физически)
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/DeleteDialogAll")
    @PreAuthorize("GetActRight('Dialogs','DlgAllDel')")
    public @ResponseBody
    String DeleteDialogAll(@RequestBody Map<String, Object> model) throws Exception {
        dDialogs.DeleteDialogAll(model);
        return "";
    }

    /**
     * Получить информацию о записи общего диалога
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetDialogAllInfo")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    DGDialogAllsModel GetDialogAllInfo(@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.GetDialogAllInfo(model);
    }

    /**
     * Проверка уникальности кода общего диалога
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/IsDlgAllCodeUnique")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    Integer IsDlgAllCodeUnique(@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.IsDlgAllCodeUnique(model);
    }

    /**
     * Проверка уникальности наименования общего диалога
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/IsDlgAllNameUnique")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    Integer IsDlgAllNameUnique(@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.IsDlgAllNameUnique(model);
    }

    /**
     * Проверка активности общего диалога
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/IsRecActive")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    Integer IsRecActive(@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.IsRecActive(model);
    }

    /**
     * Активировать общий диалог
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/ActivateDlgAll")
    @PreAuthorize("GetActRight('Dialogs','DlgAllChange')")
    public @ResponseBody
    String ActivateDlgAll (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.ActivateDlgAll(model);
    }

    /**
     * Деактивировать общий диалог
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/DeactivateDlgAll")
    @PreAuthorize("GetActRight('Dialogs','DlgAllChange')")
    public @ResponseBody
    String DeactivateDlgAll (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.DeactivateDlgAll(model);
    }

    /** --------------------------------- ######################################## -----------------------------------*/



    /** ------------------------------------ Действия с "Диалоги оповещения" 0002---------------------------------------- */

    /**
     * Загрузка формы редактирования Диалоги оповещения
     * @return
     */
    @GetMapping("/Dialogs/DialogsFormEdit")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public String DialogsFormEdit() {
        return "Dialogs/DialogsFormEdit :: DialogsFormEdit";
    }

    /**
     * Возвращает данные для грида Диалоги оповещения
     * @return
     */
    @PostMapping("/Dialogs/DialogsGrid")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody  List<DGDialogsModel> DialogsGrid (@RequestBody Simple data) throws Exception {
        List<DGDialogsModel> r= dDialogs.DialogsGrid(data);
        return r;
    }

    /**
     * Сохранить диалог оповещения
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/SaveDialog")
    @PreAuthorize("GetActRight('Dialogs','DialogChange')")
    public @ResponseBody
    String SaveDialog (@RequestBody DGDialogsModel model) throws Exception {
        return dDialogs.SaveDialog(model);
    }

    /**
     * Удалить диалог оповещения
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/DeleteDialog")
    @PreAuthorize("GetActRight('Dialogs','DialogDel')")
    public @ResponseBody
    String DeleteDialog (@RequestBody Map<String, Object> model) throws Exception {
        dDialogs.DeleteDialog(model);
        return "";
    }

    /**
     * Получить информацию о записи диалога оповещения
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetDialogInfo")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    DGDialogsModel GetDialogInfo (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.GetDialogInfo(model);
    }

    /**
     * Получить данные о словаре
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetVocsInfo")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    VocsModel GetVocsInfo (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.GetVocsInfo(model);
    }

    /**
     * Получить все овтеты для диалога оповещения
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetAllDialogDTMFPhoneAnswers")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    List<DGAnswerModel> GetAllDialogDTMFPhoneAnswers(@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.GetAllDialogDTMFPhoneAnswers(model);
    }

    /**
     * Копировать диалог оповещения
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/CopyDialog")
    @PreAuthorize("GetActRight('Dialogs','DialogChange')")
    public @ResponseBody
    String CopyDialog (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.CopyDialog(model);
    }


    /** --------------------------------- ######################################## -----------------------------------*/


    /** ---------------------------------- Действия с "Обращения к абоненту" 0003--------------------------------------- */


    /**
     * Загрузка формы редактирования Обращения к абоненту
     * @return
     */
    @GetMapping("/Dialogs/MessagesFormEdit")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public String MessagesFormEdit () {
        return "Dialogs/MessagesFormEdit :: MessagesFormEdit";
    }

    /**
     * Возвращает данные для грида Обращения
     * @return
     */
    @PostMapping("/Dialogs/MessageGrid")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody  List<DGMessegesModel> MessegesGrid (@RequestBody Simple data) throws Exception {
        List<DGMessegesModel> r = dDialogs.MessegesGrid(data);
        return r;
    }

    /**
     * Сохранить запись обращения к абоненту
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/SaveMessage")
    @PreAuthorize("GetActRight('Dialogs','MessagesChange')")
    public @ResponseBody
    String SaveMessage (@RequestBody DGMessegesModel model) throws Exception {
        return dDialogs.SaveMessage(model);
    }

    /**
     * Удалить обращение к абоненту
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/DeleteMessage")
    @PreAuthorize("GetActRight('Dialogs','MessagesDel')")
    public @ResponseBody
    String DeleteMessage (@RequestBody Map<String, Object> model) throws Exception {
        dDialogs.DeleteMessage(model);
        return "";
    }

    /**
     * Получить данные записи обращения к абоненту
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetMessageInfo")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    DGMessegesModel GetMessageInfo (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.GetMessageInfo(model);
    }

    /**
     * Получить данные звукового обращения
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetPhraseInfo")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    PhraseModel GetPhraseInfo (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.GetPhraseInfo(model);
    }

    /**
     * Проверка уникальности номера обращения к абоненту
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/IsNoUnique")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    int IsNoUnique (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.IsNoUnique(model);
    }

    /**
     * Получить список ответов абонента
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetAnswers")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    List <DGAnswerModel> GetAnswers (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.GetAnswers(model);
    }

    /**
     * Проверить при удалении является ли обращение к абоненту следующим сообщением в таблице Ответы абонентов
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/IsForeignKey")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    String IsForeignKey (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.IsForeignKey(model);
    }

    /**
     * Получить аудио файл на сервере
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetWavFile")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    String GetWavFile (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.GetWavFile(model);
    }

    /**
     * Получить путь к папке на сервере с аудиозаписями
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetSoundFilesPath")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    String GetSoundFilesPath () throws Exception {
        return dDialogs.GetSoundFilesPath();
    }

    /** --------------------------------- ######################################## -----------------------------------*/



    /** ---------------------------------- Действия с "Ответы абонентов" 0004--------------------------------------- */

    /**
     * Возвращает данные для грида Ответов
     * @return
     */
    @PostMapping("/Dialogs/AnswerGrid")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody  List<DGAnswerModel> AnswerGrid(@RequestBody Simple data) throws Exception {
        List<DGAnswerModel> r = dDialogs.AnswerGrid(data);
        return r;
    }

    /**
     * Загрузка формы редактирования Ответов абонента
     * @return
     */
    @GetMapping("/Dialogs/AnswersFormEdit")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public String AnswersFormEdit() {
        return "Dialogs/AnswersFormEdit :: AnswersFormEdit";
    }

    /**
     * Получить данные о записи ответов абоненту
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetAnswerInfo")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    DGAnswerModel GetAnswerInfo (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.GetAnswerInfo(model);
    }

    /**
     * Сохранить запись ответа обоненту
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/SaveAnswer")
    @PreAuthorize("GetActRight('Dialogs','AnswersChange')")
    public @ResponseBody
    String SaveAnswer (@RequestBody DGAnswerModel model) throws Exception {
        return dDialogs.SaveAnswer(model);
    }

    /**
     * Удалить ответ абоненту
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/DeleteAnswer")
    @PreAuthorize("GetActRight('Dialogs','AnswersDel')")
    public @ResponseBody
    String DeleteAnswer (@RequestBody Map<String, Object> model) throws Exception {
        dDialogs.DeleteAnswer(model);
        return "";
    }

    /**
     * Получить список обращений к абоненту для комбобокса "Следующие обращения"
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/GetNextMessages")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    List<DGMessegesModel> GetNextMessages (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.GetNextMessages(model);
    }

    /**
     * Проверка уникальности ответа абонента по индеку
     * @param model
     * @return
     * @throws Exception
     */
    @PostMapping("/Dialogs/IsAnswerUnique")
    @PreAuthorize("GetActRight('Dialogs','DialogsView')")
    public @ResponseBody
    int IsAnswerUnique (@RequestBody Map<String, Object> model) throws Exception {
        return dDialogs.IsAnswerUnique(model);
    }

    /** --------------------------------- ######################################## -----------------------------------*/
}
