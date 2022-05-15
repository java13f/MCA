

export class AnswersFormEdit extends FormView {
    constructor() {
        super();
        this.SelectedNextMessage = null;
    }

    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/Dialogs/AnswersFormEdit"), this.InitFunc.bind(this));
    }

    InitFunc() {
        this.InitComponents("wAnswersFormEdit_Module_Dialogs", "");

        let bCloseByEnter = false;
        if(this.options.AddMode || this.options.editMode)
            bCloseByEnter = true;
        this.InitCloseEvents(this.wAnswersFormEdit, bCloseByEnter);
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick:()=>{this.wAnswersFormEdit.window("close")}});

        this.cmbNextMessage.combobox({onSelect: this.cmbNextMessage_onSelect.bind(this)});

        this.LoadcmbNextMessage();
        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");

            this.lAction.html("Добавление нового ответа абонента");
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");

            this.lAction.html("Редактирование ответа абонента");
            if (this.options.editMode) {
                this.btnOk.linkbutton({disabled: false});
            } else {
                this.btnOk.linkbutton({disabled: true});
            }
            this.GetAnswerInfo(this.options.uuid);
        }
    }

    cmbNextMessage_onSelect(record) {
        this.SelectedNextMessage = record.id;
    }


    /**
     * Загрузка информации ответа абонента на форму
     * @constructor
     */
    async LoadAnswerInfo(answerInfo){
        try{
            this.txId.textbox("setText", answerInfo.id);
            this.txAnswer.textbox("setText", answerInfo.value.replaceAll('+', ''));
            this.txComment.textbox("setText", answerInfo.info);
            this.SelectedNextMessage = answerInfo.next_msg_id;
            if(this.SelectedNextMessage != null)
                this.cmbNextMessage.combobox("setValue", this.SelectedNextMessage);

            this.txCreator.textbox("setText", answerInfo.creator);
            this.txChanger.textbox("setText", answerInfo.changer);
            this.txChanged.textbox("setText", answerInfo.changed);
            this.txCreated.textbox("setText", answerInfo.created);
        }
        catch(err){
            this.ShowErrorResponse(err);
        }
    }

    async LoadcmbNextMessage() {
        try {
            this.NextMessages = await this.s_postCTRF('/Dialogs/GetNextMessages', { message_id: this.options.message_id, dialog_id: this.options.dialog_id });

            if(this.NextMessages.length == 0) {
                this.cmbNextMessage.combobox("disable");
                return false;
            }

            this.cmbNextMessage.combobox({
                valueField: "id",
                textField: "info_ru",
                data: this.NextMessages
            });


            if (this.SelectedNextMessage != null) {
                for (let i = 0; i < this.NextMessages.length; i++) {
                    let stts = this.NextMessages[i];
                    if (stts.id == this.SelectedNextMessage) {
                        this.cmbNextMessage.combobox("setValue", this.NextMessages[i].id);
                    }
                }
            }
        } catch
            (err) {
            this.ShowErrorResponse(err);
        }
    }

    /**
     * Получить инфорацию устройства
     * @param id
     * @constructor
     */
    GetAnswerInfo(id){
        try {
            return this.a_postCTRF("/Dialogs/GetAnswerInfo", {id: id}, this.LoadAnswerInfo.bind(this));
        } catch
            (err) {
            this.ShowErrorResponse(err);
        }
    }

    async btnOk_onClick() {
        try {
            let id = this.txId.textbox("getText").length > 0 ? this.txId.textbox("getText") : -1;
            let answer = this.txAnswer.textbox("getText");
            let comment = this.txComment.textbox("getText");
            let next_msg_id = 0;

            if (answer.length == 0) {
                this.ShowToolTip(this.toolTiptxAnswer, "Введите пожалуйста \"Текст ответа\"",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000,position: 'bottom'});
                return;
            }

            if (answer.length > 32) {
                this.ShowToolTip(this.toolTiptxAnswer, "Длина поля \"Текст ответа\" не может превышать 32 символа",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000,position: 'bottom'});
                return;
            }

            if (comment.length > 64) {
                this.ShowToolTip(this.toolTiptxComment, "Длина поля \"Комментарий к ответу\" не может превышать 64 символа",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000,position: 'bottom'});
                return;
            }

            if(!this.cmbNextMessage.combobox("options").disabled && (this.SelectedNextMessage == 0 || this.SelectedNextMessage == null)) {
                this.ShowToolTip(this.toolTiptxNextMessage,"Выберите пожалуйста \"Следующее обращение\"",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000,position: 'bottom'});
                return;
            } else {
                next_msg_id = this.SelectedNextMessage == null ? 0 : this.SelectedNextMessage;
            }

            let isunique = await this.s_postCTRF("/Dialogs/IsAnswerUnique", {
                message_id: this.options.message_id,
                id: id,
                value: answer
            });

            if (isunique > 0) {
                this.ShowToolTip(this.toolTiptxAnswer, "Такое значение для выбранного обращения к абоненту уже существует в базе данных",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }


            if(this.options.is_dtmf == "0" && this.options.link_type_code == "phone") {

                if (this.options.voc_id == null) {
                    this.ShowWarning("Ответ абонента не может быть сохранён. Выберите словарь для общего диалога ");
                    return false;
                }
                let wordArray = answer.split(" ");
                for (let i = 0; i < wordArray.length; i++) {
                    let checkWord = await this.s_postCTRF("/Voc/CheckWord", {
                        word: wordArray[i],
                        vocItemId: this.options.voc_id
                    });
                    let regex = /В словаре уже есть добавляемое слово/;

                    if(checkWord.length > 0 && !regex.test(checkWord)) {
                        this.ShowWarning(checkWord);
                        return;
                    }
                    if (checkWord.length == 0) {
                        this.s_postCTRF("/Voc/Save", {word: wordArray[i], vocItemId: this.options.voc_id});
                    }
                }
            }

            answer = answer.replaceAll('+', '');

            let obj = {
                id: id,
                value: answer,
                info: comment,
                next_msg_id: next_msg_id,
                message_id: this.options.message_id,
                dlg_all_id: this.options.dlg_all_id
            };
            let newId = await this.s_postCTRF("/Dialogs/SaveAnswer", obj);
            if (this.ResultFunc != null) {
                this.ResultFunc(newId);
            }
            this.wAnswersFormEdit.window("close");
        } catch (err) {
            this.ShowErrorResponse(err);
        }

        return false;
    }
}