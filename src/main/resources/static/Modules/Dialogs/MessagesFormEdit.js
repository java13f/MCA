import {StartModalModule as PhraseStartModalModule} from "../Phrase/Phrase.js";


export class MessagesFormEdit extends FormView {
    constructor() {
        super();
    }

    Show(options){
        this.options = options;
        this.SelectedPhrase = null;
        this.MessageInfo = null;
        this.IsPlaying = false;
        this.Sound_Files_Path = "";
        LoadForm("#ModalWindows", this.GetUrl("/Dialogs/MessagesFormEdit"), this.InitFunc.bind(this));
    }

    async InitFunc() {
        try {
            this.InitComponents("wMessagesFormEdit_Module_Dialogs", "");
            let bCloseByEnter = false;
            if(this.options.AddMode || this.options.editMode)
                bCloseByEnter = true;
            this.InitCloseEvents(this.wMessagesFormEdit, bCloseByEnter);
            this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
            this.btnCancel.linkbutton({
                onClick: () => {
                    this.Stop();
                    this.wMessagesFormEdit.window("close");
                }
            });

            this.btnOpenPhrase.linkbutton({onClick: this.btnOpenPhrase_onClick.bind(this)});
            this.btnClearSoundText.linkbutton({onClick: this.btnClearSoundText_onClick.bind(this)});
            this.btnPlay.linkbutton({onClick: this.btnPlay_onClick.bind(this)});
            this.btnPlay.linkbutton({iconCls:"icon-play", text:""});
            this.btnPlay.hover(() => this.ShowToolTip(this.btnPlay, "", {icon: 'icon-tip',title: 'Воспроизвести обращение',delay: 5000}),()=>{});
            this.btnOpenPhrase.hover(() => this.ShowToolTip(this.btnOpenPhrase, "", {icon: 'icon-tip',title: 'Выбрать обращение',delay: 5000}),()=>{});
            this.btnClearSoundText.hover(() => this.ShowToolTip(this.btnClearSoundText, "", {icon: 'icon-tip',title: 'Очистить выбранное обращение',delay: 5000}),()=>{});
            this.Sound_Files_Path = await this.s_postCTRF("/Dialogs/GetSoundFilesPath");

            this.Audio = document.createElement('audio');
            // Начало воспроизведения
            this.Audio.addEventListener("canplaythrough", function(e){
                this.IsPlaying = true;
                this.UpdateBtns();
            }.bind(this), false);
            // Окончание воспроизведения (конец трека)
            this.Audio.addEventListener("ended", function(e){
                this.IsPlaying = false;
                this.UpdateBtns();
            }.bind(this), false);


            if (this.options.AddMode) {
                this.pbEditMode.attr("class", "icon-addmode");

                this.lAction.html("Добавление нового обращения к абоненту");
                this.MessageInfo = await this.GetDialogInfo(this.options.dialog_id);
                this.MessageInfo.dialog_id = this.MessageInfo.id;
                this.AdoptFields(this.MessageInfo.is_dtmf);

            } else {
                this.pbEditMode.attr("class", "icon-editmode");

                this.lAction.html("Редактирование обращения к абоненту");
                if (this.options.editMode) {
                    this.btnOk.linkbutton({disabled: false});
                } else {
                    this.btnOk.linkbutton({disabled: true});
                }
                this.UpdateBtns();
                this.GetMessageInfo(this.options.uuid);
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Получение объекта File из загруженных данных (строки)
     */
    DataURLtoFile(dataurl, filename) {
        let mime = 'audio/wav',
            bstr = atob(dataurl),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while(n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    }

    async btnPlay_onClick() {
        try {
            if(!this.IsPlaying) {
                if(this.File == null)
                    this.GetAudio();
                else
                    this.Play();
            } else {
                this.Stop();
            }
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }

    /**
     * Остановить воспроизведение аудио
     */
    Stop() {
        try {
            if (this.IsPlaying) {
                this.Audio.pause();
                this.IsPlaying = false;
                this.UpdateBtns();
            }
        } catch (ex) {
            this.ShowErrorResponse(ex);
        }
    }


    async GetAudio() {
        try {
            if (this.SelectedPhrase == null) {
                this.ShowToolTip(this.btnOpenPhrase, "Для воспроизведения аудиозаписи, её сначало нужно выбрать",
                    {icon: 'icon-warning', title: 'Предупреждение', delay: 5000, position: 'bottom'});
                return false;
            }

            let soundData = await this.s_postCTRF("/Dialogs/GetWavFile", {file_source: this.Sound_Files_Path + "/" + this.SelectedPhrase.file_name});
            this.File = this.DataURLtoFile(soundData, this.SelectedPhrase.file_name);
            this.Play();
        } catch (ex) {
            this.ShowErrorResponse(ex);
        }
    }

    /**
     * Воспроизвести аудио
     */
    Play() {
        try {
            if (!this.IsPlaying) {
                this.Audio.src = URL.createObjectURL(this.File);
                this.Audio.controls = true;
                this.Audio.play();
                this.IsPlaying = true;
                this.UpdateBtns();
            }
        } catch (ex) {
            this.ShowErrorResponse(ex);
        }
    }

    AdoptFields(is_dtmf) {
        try {
            if (is_dtmf == "1" || is_dtmf == "0") {
                this.txSMSText.textbox("disable");
            } else {
                this.txSoundText.textbox("disable");
                this.btnPlay.linkbutton("disable");
                this.btnOpenPhrase.linkbutton("disable");
                this.btnClearSoundText.linkbutton("disable");
            }
        } catch (ex) {
            this.ShowErrorResponse(ex);
        }
    }


    /**
     * Изменение состояния элементов формы
     */
    UpdateBtns() {
        if(this.IsPlaying) {
            this.btnPlay.hover(() => this.ShowToolTip(this.btnPlay, "", {icon: 'icon-tip',title: 'Остановить воспроизведение обращения',delay: 5000}),()=>{});
            this.btnPlay.linkbutton({iconCls: "icon-stop", text: ""});
        }
        else {
            this.btnPlay.hover(() => this.ShowToolTip(this.btnPlay, "", {icon: 'icon-tip',title: 'Воспроизвести обращение',delay: 5000}),()=>{});
            this.btnPlay.linkbutton({iconCls: "icon-play", text: ""});
        }
    }

    /**
     * Получить инфорацию о диалоги оповещения
     * @param id
     * @constructor
     */
    GetDialogInfo(id){
        try {
            return this.s_postCTRF("/Dialogs/GetDialogInfo", {id: id});
        } catch (ex) {
            this.ShowErrorResponse(ex);
        }
    }

    btnClearSoundText_onClick() {
        this.SelectedPhrase = null;
        this.txSoundText.textbox("clear");
        this.IsPlaying = false;
        this.File = null;
        this.UpdateBtns();
    }

    btnOpenPhrase_onClick() {
        try {
            PhraseStartModalModule({}, (RecId)=>{
                let id = RecId.id;
                this.GetPhraseInfo(id);
            });
        } catch (e) {
            this.ShowError(e);
        }
    }

    async GetPhraseInfo(id) {
        try {
            this.SelectedPhrase = await this.s_postCTRF('/Dialogs/GetPhraseInfo', {id: id});
            this.txSoundText.textbox("setText", this.SelectedPhrase.name.replaceAll('+', ''));
        } catch(ex) {
            this.ShowErrorResponse(ex);
        }
    }

    /**
     * Загрузка информации обращения к абоненту на форму
     * @constructor
     */
    async LoadMessageInfo(messageInfo){
        try{
            this.txId.textbox("setText", messageInfo.id);
            this.txNumber.textbox("setText", messageInfo.no);

            if(messageInfo.link_type_code == "phone" && messageInfo.phrase_id != null) {
                //this.txSoundText.textbox("setText", messageInfo.phrase_name.replaceAll('+', ''));
                this.GetPhraseInfo(messageInfo.phrase_id);
            }
            else {
                this.txSMSText.textbox("setText", messageInfo.info_ru);
            }

            this.txCreator.textbox("setText", messageInfo.creator);
            this.txChanger.textbox("setText", messageInfo.changer);
            this.txChanged.textbox("setText", messageInfo.changed);
            this.txCreated.textbox("setText", messageInfo.created);

            this.MessageInfo = messageInfo;
            this.AdoptFields(messageInfo.is_dtmf);
        }
        catch(err){
            this.ShowErrorResponse(err);
        }
    }

    /**
     * Получить инфорацию устройства
     * @param id
     * @constructor
     */
    GetMessageInfo(id) {
        try {
            return this.a_postCTRF("/Dialogs/GetMessageInfo", {id: id}, this.LoadMessageInfo.bind(this));
        } catch (ex) {
            this.ShowErrorResponse(ex);
        }
    }

    async btnOk_onClick(){
        try {
            this.Stop();
            let id = this.txId.textbox("getText").length > 0 ? this.txId.textbox("getText") : -1;
            let number = this.txNumber.textbox("getText");
            let smsText = this.txSMSText.textbox("getText");
            let soundText = this.txSoundText.textbox("getText");

            if (number.length == 0) {
                this.ShowToolTip(this.toolTiptxNumber, "Введите пожалуйста \"Номер\"",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }

            if (!$.isNumeric(number)) {
                this.ShowToolTip(this.toolTiptxNumber, "\"Номер\" должен состоять только из целых положительных чисел",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }

            if (Number.parseInt(number) < 0) {
                this.ShowToolTip(this.toolTiptxNumber, "\"Номер\" должен состоять только из целых положительных чисел",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }

            let isNoUnique = await this.s_postCTRF("/Dialogs/IsNoUnique", {
                dialog_id: this.options.dialog_id,
                id: id,
                no: number
            });
            if (isNoUnique > 0) {
                this.ShowToolTip(this.toolTiptxNumber, "Такой номер обращения к абоненту для текущего диалога оповщения уже существует в базе данных",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }


            if (!this.txSMSText.textbox('options').disabled && smsText.length == 0) {
                this.ShowToolTip(this.toolTiptxSMSText, "Введите пожалуйста \"Тест SMS или E-Mail\"",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }

            if (!this.txSMSText.textbox('options').disabled && smsText.length > 1024) {
                this.ShowToolTip(this.toolTiptxSMSText, "Длина \"Тест SMS или E-Mail\" не может превышать 1024 символа",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }


            if (!this.btnOpenPhrase.linkbutton('options').disabled && soundText.length == 0 && this.SelectedPhrase == null) {
                this.ShowToolTip(this.toolTipbtnOpenPhrase, "Выберите пожалуйста обращение",
                    {icon: 'icon-warning',title: 'Предупреждение',delay: 5000, position: 'bottom'});
                return;
            }

            let info_ru = "";
            if (this.SelectedPhrase == null) {
                info_ru = smsText;
            }


            let obj = {
                id: id,
                no: number,
                info_ru: info_ru,
                dialog_id: this.MessageInfo.dialog_id,
                phrase_id: this.SelectedPhrase == null ? -1 : this.SelectedPhrase.id,
                dlg_all_id: this.MessageInfo.dlg_all_id
            };
            let newId = await this.s_postCTRF("/Dialogs/SaveMessage", obj);
            if (this.ResultFunc != null) {
                this.ResultFunc(newId);
            }
            this.wMessagesFormEdit.window("close");
        }
        catch(err){
            this.ShowErrorResponse(err);
        }

        return false;
    }
}