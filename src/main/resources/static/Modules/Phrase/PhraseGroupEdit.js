export class PhraseGroupEdit extends FormView {
    constructor() {
        super();
        this.Group = {};
        this.options = {};
        this.Audio = null;
        this.IsPlay = false;
        this.IsSynteze = false;
        this.IsSaving = false;
        this.File = null;
    }

    /**
     * Стартовая функция
     */
    Show(options){
        this.options = options;
        this.Group.id = this.options.uuid;
        LoadForm("#ModalWindows", this.GetUrl("/Phrase/PhraseGroupEditForm"), this.InitFunction.bind(this));
    }

    /**
     * Инициализация формы
     */
    InitFunction() {
        this.InitComponents("wPhraseGroupEdit_PhraseGroupEdit_Module_Phrase", "");
        this.InitCloseEvents(this.wPhraseGroupEdit);
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({onClick: function () {this.wPhraseGroupEdit.window("close");}.bind(this)});
        let title = 'Добавление записи';
        if(this.options.FormMode == 1) {
            title = 'Редактирование записи';
        }
        if(this.options.FormMode == 1 && !this.options.editMode) {
            this.btnOk.linkbutton({disabled: true});
            title = 'Просмотр записи';
        }
        this.blockLoader.hide();
        this.wPhraseGroupEdit.window({title: title});
        this.lbHeader.html(title);
        this.btnPlay.linkbutton({onClick: this.btnPlay_Click.bind(this)});
        this.btnPlay.hover(() => this.ShowToolTip(this.btnPlay, "", {icon: 'icon-tip',title: 'Кнопка "Воспроизвести"',delay: 5000}),()=>{});
        this.Audio = document.createElement('audio');
        this.Audio.addEventListener("canplaythrough", function(e){
            this.IsPlay = true;
            this.UpdateCtrl();
        }.bind(this), false);
        this.Audio.addEventListener("ended", function(e){
            this.IsPlay = false;
            this.UpdateCtrl();
        }.bind(this), false);
        this.tbId.textbox({disabled: true});
        this.tbCreate.textbox({disabled: true});
        this.tbCreator.textbox({disabled: true});
        this.tbChange.textbox({disabled: true});
        this.tbChanger.textbox({disabled: true});
        this.cBTypeVoice.combobox({
            valueField: "id",
            textField: "name"
        });
        this.nbVolume.numberspinner({ onChange: function(value){
            if(value != ""){
                this.Group.volume = value;
            }
            else {
                this.nbVolume.numberspinner("setValue", 0);
            }
        }.bind(this)});
        this.nbRate.numberspinner({onChange: function(value){
            if(value != ""){
                this.Group.rate = value;
            }
            else {
                this.nbRate.numberspinner("setValue", 0);
            }
        }.bind(this)});
        this.nbPitch.numberspinner({onChange: function(value){
            if(value != ""){
                this.Group.pitch = value;
            }
            else {
                this.nbPitch.numberspinner("setValue", 0);
            }
        }.bind(this)});
        this.nbVolume.numberspinner("setValue", 0);
        this.nbRate.numberspinner("setValue", 0);
        this.nbPitch.numberspinner("setValue", 0);
        this.tbText.textbox('setValue', '');
        this.LoadVoiceTypes();
        if(this.Group.id != "") {
            this.LoadVoice(this.Group.id);
        }
    }

    /**
     * Кнопка Воспроизвести аудио
     */
    btnPlay_Click() {
        if(this.tbText.textbox('getText').trim().length === 0) {
            this.ShowToolTip("#tbTextToolTip_PhraseGroupEdit_Module_Phrase",
                "Введите текст фразы",
                {icon:'icon-tip',title:'Внимание', delay:5000});
        }
        else {
            if(!this.IsPlay) {
                let voiceTest = {};
                voiceTest.rate = this.nbRate.numberspinner("getValue");
                voiceTest.volume = this.nbVolume.numberspinner("getValue");
                voiceTest.pitch = this.nbPitch.numberspinner("getValue");
                voiceTest.testText = this.tbText.textbox('getText');
                voiceTest.voiceId = this.cBTypeVoice.combobox("getValue");
                this.IsSynteze = true;
                this.UpdateCtrl();
                $.ajax({
                    method:"POST",
                    data: JSON.stringify(voiceTest),
                    contentType: "application/json; charset=utf-8",
                    url: this.GetUrl('/Phrase/SyntezeTest'),
                    headers: GetCSRFTokenHeader(),
                    success: function(data) {
                        if(data != null && data.length > 0) {
                            this.File = this.DataURLtoFile(data, "tmp");
                            this.IsSynteze = false;
                            this.UpdateCtrl();
                            this.Play();
                        }
                    }.bind(this),
                    error: function(data) {
                        this.IsSynteze = false;
                        this.UpdateCtrl();
                        this.ShowErrorResponse(data);
                    }.bind(this)
                });
            }
            else {
                this.Stop();
            }
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

    /**
     * Воспроизвести аудио
     */
    Play() {
        this.Audio.src = URL.createObjectURL(this.File);
        this.Audio.controls = true;
        this.Audio.play();
        this.IsPlay = true;
        this.UpdateCtrl();
    }

    /**
     * Остановить воспроизведение аудио
     */
    Stop() {
        this.Audio.pause();
        this.IsPlay = false;
        this.UpdateCtrl();
    }

    /**
     * Обновление состояния элементов формы
     */
    UpdateCtrl(){
        if(this.IsPlay || this.IsSynteze || this.IsSaving) {
            this.tbText.textbox({disabled: true});
            this.tbCode.textbox({disabled: true});
            this.tbName.textbox({disabled: true});
            this.nbVolume.numberspinner({disabled: true});
            this.nbRate.numberspinner({disabled: true});
            this.nbPitch.numberspinner({disabled: true});
        }
        else {
            this.tbText.textbox({disabled: false});
            this.tbCode.textbox({disabled: false});
            this.tbName.textbox({disabled: false});
            this.nbVolume.numberspinner({disabled: false});
            this.nbRate.numberspinner({disabled: false});
            this.nbPitch.numberspinner({disabled: false});
            this.nbVolume.numberspinner("setValue", this.Group.volume);
            this.nbRate.numberspinner("setValue", this.Group.rate);
            this.nbPitch.numberspinner("setValue", this.Group.pitch);
        }
        if(this.IsPlay) {
            this.btnPlay.linkbutton({iconCls:"icon-stop", text:""});
        }
        else {
            this.btnPlay.linkbutton({iconCls:"icon-play", text:""});
        }
        if(this.IsSaving) {
            this.blockLoader.show();
            this.btnPlay.linkbutton({disabled: true});
            this.btnOk.linkbutton({disabled: true});
        }
        else {
            this.blockLoader.hide();
            this.btnPlay.linkbutton({disabled: false});
            this.btnOk.linkbutton({disabled: false});
        }
    }

    /**
     * Загрузка всех типов голосов
     */
    LoadVoiceTypes(){
        $.ajax({
            method: "POST",
            url: this.GetUrl('/Phrase/GetVoiceTypes'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                this.cBTypeVoice.combobox({
                    data: data,
                    disabled: data.length === 0
                });
                this.SetVoice();
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }

    /**
     * Загрузка голоса группы
     */
    LoadVoice(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Phrase/GetGroup'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(data != null) {
                    this.Group = data;
                    this.tbId.textbox('setValue', this.Group.id);
                    this.tbCode.textbox('setValue', this.Group.code);
                    this.tbName.textbox('setValue', this.Group.name);
                    this.tbText.textbox('setValue', this.Group.testText);
                    this.tbCreate.textbox('setValue', this.Group.created);
                    this.tbCreator.textbox('setValue', this.Group.creator);
                    this.tbChange.textbox('setValue', this.Group.changed);
                    this.tbChanger.textbox('setValue', this.Group.changer);
                    this.SetVoice();
                    this.nbVolume.numberspinner("setValue", this.Group.volume);
                    this.nbRate.numberspinner("setValue", this.Group.rate);
                    this.nbPitch.numberspinner("setValue", this.Group.pitch);
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }

    /**
     * Выбор типа голоса
     */
    SetVoice() {
        let data = this.cBTypeVoice.combobox("getData");
        if (data.length > 0) {
            for (let tVoice = 0; tVoice < data.length; tVoice++) {
                let voice = data[tVoice];
                if (voice.id == this.Group.voiceTypeId) {
                    this.cBTypeVoice.combobox("setValue", this.Group.voiceTypeId);
                    return;
                }
                else {
                    this.cBTypeVoice.combobox("setValue", data[0].id);
                }
            }
        }
    }

    /**
     * Событие кнопки ОК
     */
    btnOk_onClick(){
        this.CheckForm();
    }

    /**
     * Проверка данных в форме
     */
    async CheckForm() {
        return new Promise(async (resolve, reject) => {
            if (this.tbCode.textbox("getText").trim().length === 0) {
                this.ShowToolTip("#tbCodeToolTip_PhraseGroupEdit_Module_Phrase",
                    "Не заполнено поле \"Код\"",
                    {title:'Ошибка', delay:3000});
                return;
            }
            if (this.tbName.textbox("getText").trim().length === 0) {
                this.ShowToolTip("#tbNameToolTip_PhraseGroupEdit_Module_Phrase",
                    "Не заполнено поле \"Наименование\"",
                    {title:'Ошибка', delay:3000});
                return;
            }
            if (this.cBTypeVoice.combobox("getValue").trim().length === 0) {
                this.ShowToolTip("#cBTypeVoiceToolTip_PhraseGroupEdit_Module_Phrase",
                    "Не выбран \"Тип голоса\"",
                    {title:'Ошибка', delay:3000});
                return;
            }
            let chkCode = await this.CheckCode();
            if(chkCode !== true) {
                this.ShowToolTip("#tbCodeToolTip_PhraseGroupEdit_Module_Phrase",
                    "Запись с кодом=" + this.tbCode.textbox("getText") + " уже существует в базе",
                    {title:'Ошибка', delay:3000});
                return;
            }
            this.Group.code = this.tbCode.textbox('getText');
            this.Group.name = this.tbName.textbox('getText');
            this.Group.testText = this.tbText.textbox('getText');
            this.Group.voiceTypeId = this.cBTypeVoice.combobox("getValue");
            this.Group.volume = this.nbVolume.numberspinner("getValue");
            this.Group.rate = this.nbRate.numberspinner("getValue");
            this.Group.pitch = this.nbPitch.numberspinner("getValue");
            this.Save();
        });
    }

    /**
     * Проверка кода группы фраз
     */
    CheckCode() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: JSON.stringify({code: this.tbCode.textbox("getText"), id: this.Group.id}),
                contentType: "application/json; charset=utf-8",
                url: this.GetUrl('/Phrase/CheckGrpCode'),
                headers: GetCSRFTokenHeader(),
                success: function(data) {
                    resolve(data);
                }.bind(this),
                error: function(data) {
                    reject(data);
                    this.ShowErrorResponse(data);
                }.bind(this)
            });
        });
    }

    /**
     * Сохранение группы фраз
     */
    Save() {
        this.IsSaving = true;
        this.UpdateCtrl();
        $.ajax({
            method: "POST",
            data: JSON.stringify(this.Group),
            url: this.GetUrl('/Phrase/SaveGroup'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.IsSaving = false;
                    this.UpdateCtrl();
                    this.wPhraseGroupEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.IsSaving = false;
                this.UpdateCtrl();
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}