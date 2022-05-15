package org.kaznalnrprograms.MCA.Dialogs.Interfaces;

import org.kaznalnrprograms.MCA.Dialogs.Models.*;

import java.util.List;
import java.util.Map;

public interface IDialogsDao {
     List<DGAnswerModel> AnswerGrid (Simple data) throws Exception;
     List<CBModel> DlgAll() throws Exception;
     RightsModel GetActRights() throws Exception;
     String CheckAndAddWords(Map<String, Object> model) throws Exception;

     /** --------------------------------- Действия с "Общие диалоги" ----------------------------------- */

     List<DGDialogAllsModel> DialogAllsGrid(Simple data) throws Exception;
     String SaveDialogAll(DGDialogAllsModel model) throws Exception;
     void DeleteDialogAll(Map<String, Object> model) throws Exception;
     DGDialogAllsModel GetDialogAllInfo(Map<String, Object> model) throws Exception;
     Integer IsDlgAllCodeUnique(Map<String, Object> model) throws Exception;
     Integer IsDlgAllNameUnique(Map<String, Object> model) throws Exception;
     Integer IsRecActive(Map<String, Object> model) throws Exception;
     String ActivateDlgAll(Map<String, Object> model) throws Exception;
     String DeactivateDlgAll(Map<String, Object> model) throws Exception;

     /** --------------------------------- ######################################## -----------------------------------*/


     /** --------------------------------- Действия с "Диалоги оповещения" ----------------------------------- */

     List<DGDialogsModel>    DialogsGrid(Simple data)    throws Exception;
     String SaveDialog(DGDialogsModel model) throws Exception;
     void DeleteDialog(Map<String, Object> model) throws Exception;
     DGDialogsModel GetDialogInfo(Map<String, Object> model) throws Exception;
     VocsModel GetVocsInfo(Map<String, Object> model) throws Exception;
     List<DGAnswerModel> GetAllDialogDTMFPhoneAnswers(Map<String, Object> model) throws Exception;
     String CopyDialog(Map<String, Object> model) throws Exception;

     /** --------------------------------- ######################################## -----------------------------------*/


     /** --------------------------------- Действия с "Обращения к абонентам" ----------------------------------- */

     List<DGMessegesModel>   MessegesGrid(Simple data)   throws Exception;
     String SaveMessage(DGMessegesModel model) throws Exception;
     void DeleteMessage(Map<String, Object> model) throws Exception;
     DGMessegesModel GetMessageInfo(Map<String, Object> model) throws Exception;
     PhraseModel GetPhraseInfo(Map<String, Object> model) throws Exception;
     int IsNoUnique(Map<String, Object> model) throws Exception;
     List<DGAnswerModel> GetAnswers(Map<String, Object> model) throws Exception;
     String IsForeignKey(Map<String, Object> model) throws Exception;
     String GetWavFile(Map<String, Object> model) throws Exception;
     String GetSoundFilesPath() throws Exception;

     /** --------------------------------- ######################################## -----------------------------------*/


     /** --------------------------------- Действия с "Ответы абонентов" ----------------------------------- */

     DGAnswerModel GetAnswerInfo(Map<String, Object> model) throws Exception;
     String SaveAnswer(DGAnswerModel model) throws Exception;
     void DeleteAnswer(Map<String, Object> model) throws Exception;
     List<DGMessegesModel> GetNextMessages (Map<String, Object> model) throws Exception;
     int IsAnswerUnique (Map<String, Object> model) throws Exception;
     /** --------------------------------- ######################################## -----------------------------------*/

}




