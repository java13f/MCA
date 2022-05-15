export class PhraseEdit extends FormView {
    constructor(){
        super();
        this.options = {};
        this.Phrase = {};
        this.IsWaitServer = false;
        this.Audio = null;
        this.IsRec = false;
        this.IsPlay = false;
        this.IsSynteze = false;
        this.mediaRecorder = null;
        this.File = null;
        this.FileSource = null;
        this.OkDisabled = false;
        this.IsInitRecorder = false;
        this.RecordMaxTime = 5000; // максимальное время записи с микрофона (мс) получить из global_params (c)
        this.RecordTime = 0; // сколько времени прошло с момента записи
        this.timeoutRec = null;
        this.timerRecord = null;
        this.OnCancel = false;
        this.CurText = "";
        this.TBDefBckg = {};
    }

    /**
     * Стартовая функция
     */
    Show(options){
        this.options = options;
        this.Phrase.id = this.options.uuid;
        this.Phrase.flagSyntezed = 0;
        this.Phrase.phraseGrpId = this.options.phraseGrpId;
        LoadForm("#ModalWindows", this.GetUrl("/Phrase/PhraseEditForm"), this.InitFunction.bind(this));
    }

    /**
     * Инициализация формы
     */
    async InitFunction(){
        this.InitComponents("wPhraseEdit_PhraseEdit_Module_Phrase", "");
        this.InitCloseEvents(this.wPhraseEdit);
        this.btnCancel.linkbutton({onClick: function () {
            this.wPhraseEdit.window("close");
        }.bind(this)});
        let title = 'Добавление записи';
        if(this.options.FormMode == 1) {
            title = 'Редактирование записи';
        }
        if(this.options.FormMode == 1 && !this.options.editMode) {
            this.btnOk.linkbutton({disabled: true});
            title = 'Просмотр записи';
        }
        this.wPhraseEdit.window({title: title});
        this.blockLoader.hide();
        this.lbRec.hide();
        this.lbHeader.html(title);
        this.tbId.textbox({disabled: true});
        this.tbCreate.textbox({disabled: true});
        this.tbCreator.textbox({disabled: true});
        this.tbChange.textbox({disabled: true});
        this.tbChanger.textbox({disabled: true});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnPlay.linkbutton({onClick: this.btnPlay_Click.bind(this)});
        this.btnPlay.hover(() => this.ShowToolTip(this.btnPlay, "", {icon: 'icon-tip',title: 'Кнопка "Воспроизвести"',delay: 5000}),()=>{});
        this.btnMicrophone.linkbutton({onClick: this.btnMicrophone_Click.bind(this)});
        this.btnMicrophone.hover(() => this.ShowToolTip(this.btnMicrophone, "", {icon: 'icon-tip',title: 'Кнопка "Записать"',delay: 5000}),()=>{});
        this.btnAdd.linkbutton({onClick: this.btnAdd_Click.bind(this)});
        this.btnAdd.hover(() => this.ShowToolTip(this.btnAdd, "", {icon: 'icon-tip',title: 'Кнопка "Синтезировать"',delay: 5000}),()=>{});
        this.fBox.filebox({onChange: this.fBox_Change.bind(this)});
        $('#fBox_PhraseEdit_Module_Phrase').nextAll().hover(function(){
            this.ShowToolTip('#tbFBoxToolTip_PhraseEdit_Module_Phrase', "", {icon: 'icon-tip',title: 'Кнопка "Выбрать файл"',delay: 5000});
        }.bind(this));
        this.InitColored();
        this.Audio = document.createElement('audio');
        // Начало воспроизведения
        this.Audio.addEventListener("canplaythrough", function(e){
            this.IsPlay = true;
            this.UpdateBtns();
        }.bind(this), false);
        // Окончание воспроизведения (конец трека)
        this.Audio.addEventListener("ended", function(e){
            this.IsPlay = false;
            this.UpdateBtns();
        }.bind(this), false);
        let globalParams = await this.GetGlobalParams();
        if(globalParams != null) {
            this.RecordMaxTime = globalParams.record_max_time * 1000;
        }
        else {
            this.IsWaitServer = true;
            this.ShowError('Не удалось загрузить настройки');
            return;
        }
        if(this.Phrase.id != "") {
            this.LoadPhrase(this.Phrase.id);
        }
        this.UpdateBtns();
    }

    /**
     * События текстбокса текста фразы
     */
    InitColored(){
        //Запомнить дефолтное значение фона текстбокса
        this.TBDefBckg = $('#tbText_PhraseEdit_Module_Phrase').textbox('textbox').css('background-color');
        this.tbText.textbox({onChange: this.SetTextBoxStyle.bind(this)});
        // Событие keyup
        this.tbText.textbox({
            inputEvents: $.extend({}, this.tbText.textbox.defaults.inputEvents,{
                keyup: function(e){ this.SetTextBoxStyle();}.bind(this)
            })
        });
        // События copy\paste
        $('#tbText_PhraseEdit_Module_Phrase').textbox('textbox').bind('paste', function(e){
            setTimeout(()=>{this.SetTextBoxStyle()}, 200);
        }.bind(this));
        $('#tbText_PhraseEdit_Module_Phrase').textbox('textbox').bind('cut', function(e){
            setTimeout(()=>{this.SetTextBoxStyle()}, 200);
        }.bind(this));
    }

    /**
     * Изменение фона текстбокса
     */
    SetTextBoxStyle() {
        if (this.tbText.textbox('getText') !== this.CurText) {
            $('#tbText_PhraseEdit_Module_Phrase').textbox('textbox').css('background-color', '#ffc1df')
        } else {
            $('#tbText_PhraseEdit_Module_Phrase').textbox('textbox').css('background-color', this.TBDefBckg)
        }
    }

    /**
     * Изменение времени таймера
     */
    SetRecordTimer(flag) {
        if(flag) {
            if (this.timerRecord != null) {
                clearInterval(this.timerRecord);
                this.timerRecord = null;
            }
            this.RecordTime = 0;
            this.lbRec.html('Запись: осталось ' + this.formatTimeFromSeconds((this.RecordMaxTime - this.RecordTime)/1000));
            this.timerRecord = setInterval(() => {
                this.RecordTime += 1000;
                let outSeconds = (this.RecordMaxTime - this.RecordTime)/1000;
                this.lbRec.html('Запись: осталось ' + this.formatTimeFromSeconds(outSeconds));
            }, 1000);
            this.lbRec.show();
        }
        else {
            if (this.timerRecord != null) {
                clearInterval(this.timerRecord);
                this.timerRecord = null;
            }
            this.RecordTime = 0;
            this.lbRec.hide();
        }
    }

    /**
     * Форматирование числа секунд в формат времени hh:mm:ss
     */
    formatTimeFromSeconds(timestamp){
        let hours = Math.floor(timestamp / 60 / 60);
        let minutes = Math.floor(timestamp / 60) - (hours * 60);
        let seconds = timestamp % 60;
        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }

    /**
     * Получение глобальных параметров
     */
    GetGlobalParams() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                url: this.GetUrl('/Phrase/GetGlobalParams'),
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
     * Изменение состояния элементов формы
     */
    UpdateBtns() {
        if(this.IsPlay) {
            this.btnPlay.linkbutton({iconCls:"icon-stop", text:""});
            this.btnMicrophone.linkbutton({disabled: true});
        }
        else {
            this.btnPlay.linkbutton({iconCls:"icon-play", text:""});
            this.btnMicrophone.linkbutton({disabled: false});
        }
        if(this.IsRec) {
            this.btnMicrophone.linkbutton({iconCls:"icon-mic-rec", text:""});
            this.btnPlay.linkbutton({disabled: true});
        }
        else {
            this.btnMicrophone.linkbutton({iconCls:"icon-mic", text:""});
            this.btnPlay.linkbutton({disabled: false});
        }
        if(this.IsPlay || this.IsRec) {
            this.btnOk.linkbutton({disabled: true});
            this.fBox.filebox({disabled: true});
            this.btnAdd.linkbutton({disabled: true});
        }
        else {
            this.btnOk.linkbutton({disabled: this.OkDisabled});
            this.fBox.filebox({disabled: false});
            this.btnAdd.linkbutton({disabled: false});
        }
        // если ждем ответ от сервера то делаем неактивными все кнопки
        if(this.IsWaitServer) {
            this.btnOk.linkbutton({disabled: this.IsWaitServer});
            this.fBox.filebox({disabled: this.IsWaitServer});
            this.btnAdd.linkbutton({disabled: this.IsWaitServer});
            this.btnMicrophone.linkbutton({disabled: this.IsWaitServer});
            this.btnPlay.linkbutton({disabled: this.IsWaitServer});
        }
        if(this.IsSynteze) {
            this.blockLoader.show();
        }
        else {
            this.blockLoader.hide();
        }
    }

    /**
     * Воспроизвести аудио
     */
    Play() {
        this.Audio.src = URL.createObjectURL(this.File);
        this.Audio.controls = true;
        this.Audio.play();
        this.IsPlay = true;
        this.UpdateBtns();
    }

    /**
     * Остановка воспроизведения
     */
    Stop() {
        this.Audio.pause();
        this.IsPlay = false;
        this.UpdateBtns();
    }

    /**
     * Событие кнопки ОК
     */
    btnOk_onClick(){
        this.CheckForm();
    }

    /**
     * Проверка введенных данных формы
     */
    async CheckForm() {
        if (this.tbCode.textbox("getText").trim().length == 0) {
            this.ShowToolTip("#tbCodeToolTip_PhraseEdit_Module_Phrase",
                "Не заполнено поле \"Код\"",
                {title:'Ошибка', delay:3000});
            return;
        }
        let chkCode = await this.CheckCode();
        if(chkCode !== true) {
            this.ShowToolTip("#tbCodeToolTip_PhraseEdit_Module_Phrase",
                "Запись с кодом=" + this.tbCode.textbox("getText") + " уже существует в этой группе",
                {title:'Ошибка', delay:3000});
            return;
        }
        if (this.tbText.textbox("getText").trim().length == 0) {
            this.ShowToolTip("#tbTextToolTip_PhraseEdit_Module_Phrase",
                "Не заполнено поле \"Текст фразы\"",
                {title:'Ошибка', delay:3000});
            return;
        }
        if(this.File == null || this.tbFile.textbox("getText").trim().length == 0) {
            this.ShowToolTip("#tbFileToolTip_PhraseEdit_Module_Phrase",
                "Отсутствует звуковой файл для сохранения",
                {title:'Ошибка', delay:3000});
            return;
        }
        this.Phrase.code = this.tbCode.textbox('getText');
        this.Phrase.name = this.tbText.textbox('getText');
        this.Phrase.orgFileName = this.tbFile.textbox('getText');
        this.SetStateBtnLoadData(true); // Блокируем кнопки, далее считываем файл и пытаемся сохранить
        let fr = new FileReader();
        fr.onload = (() => {
            let res = (fr.result).split(',');
            try {
                this.Phrase.fileData = res[res.length - 1];
                this.Save();
            } catch (e) {
                this.ShowError(e);
                this.SetStateBtnLoadData(false);
                return;
            }
        }).bind(this);
        fr.onerror = ((error) => {
            this.ShowError(error);
            this.SetStateBtnLoadData(false);
        }).bind(this);
        fr.readAsDataURL(this.File);
    }

    /**
     * Проверка введенного кода фразы
     */
    CheckCode() {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "POST",
                data: JSON.stringify({code: this.tbCode.textbox("getText"), id: this.Phrase.id, grpId: this.Phrase.phraseGrpId}),
                contentType: "application/json; charset=utf-8",
                url: this.GetUrl('/Phrase/CheckPhraseCode'),
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
     * Сохранение фразы
     */
    Save() {
        $.ajax({
            method: "POST",
            data: JSON.stringify(this.Phrase),
            url: this.GetUrl('/Phrase/SavePhrase'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(this.ResultFunc!=null) {
                    this.ResultFunc(data);
                    this.wPhraseEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.SetStateBtnLoadData(false);
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    /**
     * Событие кнопки синтеза аудио из текста
     */
    btnAdd_Click() {
        if(this.tbText.textbox('getText').trim().length == 0) {
            this.ShowToolTip("#tbTextToolTip_PhraseEdit_Module_Phrase",
                "Введите текст фразы",
                {icon:'icon-tip',title:'Внимание', delay:3000});
        }
        else {
            let phraseText = this.tbText.textbox('getText');
            this.IsSynteze = true;
            this.SetStateBtnLoadData(true);
            $.ajax({
                method:"POST",
                data: JSON.stringify({phraseGroupId: this.Phrase.phraseGrpId, phraseText: phraseText}),
                contentType: "application/json; charset=utf-8",
                url: this.GetUrl('/Phrase/SyntezeWawFile'),
                headers: GetCSRFTokenHeader(),
                success: function(data) {
                    if(data != null && data.length > 0) {
                        this.File = this.DataURLtoFile(data, "syntese_" + this.DateTimeToString() + ".wav");
                        this.IsSynteze = false;
                        this.SetStateBtnLoadData(false);
                        this.tbFile.textbox('setValue', this.File.name);
                        this.CurText = this.tbText.textbox('getText');
                        this.SetTextBoxStyle();
                        this.Phrase.flagSyntezed = 1;
                    }
                }.bind(this),
                error: function(data) {
                    this.ShowErrorResponse(data);
                    this.IsSynteze = false;
                    this.SetStateBtnLoadData(false);
                }.bind(this)
            });
        }
    }

    /**
     * Событие кнопки воспроизведения
     */
    btnPlay_Click() {
        if(!this.IsPlay) {
            if(this.File != null || this.tbFile.textbox('getText').trim().length > 0) {
                this.Play();
            }
            else {
                this.ShowToolTip("#tbFileToolTip_PhraseEdit_Module_Phrase",
                    "Нет записей для воспроизведения",
                    {icon:'icon-tip',title:'Внимание', delay:3000});
            }
        }
        else {
            this.Stop();
        }
    }

    /**
     * Событие изменения данных файлбокса (при выборе локального файла)
     */
    fBox_Change(value) {
        let files = this.fBox.filebox('files');
        if(files.length > 0) {
            this.FileSource = files[0];
            this.ConvertWavFile();
        }
    }

    /**
     * Событие кнопки микрофон
     */
    btnMicrophone_Click() {
        if(this.IsRec) {
            this.mediaRecorder.stop();
            this.IsRec = false;
            if(this.timeoutRec != null) {
                clearTimeout(this.timeoutRec);
            }
        }
        else {
            if(this.mediaRecorder == null) {
                this.InitRecorder();
            }
            if(!this.IsInitRecorder) {return;}
            try {
                this.mediaRecorder.start();
                this.IsRec = true;
                if(this.timeoutRec != null) {
                    clearTimeout(this.timeoutRec);
                }
                this.timeoutRec = setTimeout(()=>{
                        this.btnMicrophone_Click();
                        this.ShowWarning('Максимальное время записи фразы через микрофон составляет ' + this.RecordMaxTime/1000 + ' сек. Запись остановлена автоматически.');
                    }, this.RecordMaxTime);
            }
            catch (e) {
                this.IsRec = false;
            }
        }
        this.SetRecordTimer(this.IsRec);
        this.UpdateBtns();
    }

    /**
     * Отменить все операции медиа по кнопке Cancel
     */
    StopAudioCancel() {
        this.OnCancel = true;
        if(this.IsRec) {
            this.btnMicrophone_Click();
        }
        if(this.IsPlay) {
            this.Stop();
        }
    }

    /**
     * Инициализация рекордера
     */
    InitRecorder() {
        return new Promise(async(resolve, reject) => {
            try {
                await navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
                    this.mediaRecorder = new MediaRecorder(stream);
                    let audioChunks = [];
                    this.mediaRecorder.addEventListener("dataavailable", function (event) {
                        audioChunks.push(event.data);
                    });
                    this.mediaRecorder.addEventListener("stop", function () {
                        if(!this.OnCancel) {
                            const audioBlob = new Blob(audioChunks, {
                                type: 'audio/wav'
                            });
                            this.FileSource = new File([audioBlob], "rec_" + this.DateTimeToString() + ".wav");
                            this.ConvertWavFile();
                            audioChunks = [];
                        }
                    }.bind(this));
                    this.IsInitRecorder = this.mediaRecorder != null;
                    this.btnMicrophone_Click();
                });
            }
            catch (e) {
                this.ShowSlide("Ошибка", "Не удалось обнаружить или получить доступ к микрофону")
            }
        });
    }

    /**
     * Получение объекта File из загруженных данных (строки)
     */
    DataURLtoFile(dataurl, filename) {
        let mime = 'audio/wav',
            bstr = atob(dataurl),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    }

    /**
     * Конвертирование аудио файла в кодек a_law
     */
    ConvertWavFile() {
        this.SetStateBtnLoadData(true);
        let fr = new FileReader();
        fr.onload = (() => {
            let res = (fr.result).split(',');
            try {
                let fileData = res[res.length - 1];
                $.ajax({
                    method:"POST",
                    data: JSON.stringify({fileName: this.FileSource.name, fileData: fileData}),
                    contentType: "application/json; charset=utf-8",
                    url: this.GetUrl('/Phrase/ConvertWavFile'),
                    headers: GetCSRFTokenHeader(),
                    success: function(data){
                        this.File = this.DataURLtoFile(data, this.FileSource.name);
                        this.SetStateBtnLoadData(false);
                        this.tbFile.textbox('setValue', this.File.name);
                        this.CurText = this.tbText.textbox('getText');
                        this.SetTextBoxStyle();
                        this.Phrase.flagSyntezed = 0;
                    }.bind(this),
                    error: function(data) {
                        this.ShowErrorResponse(data);
                        this.SetStateBtnLoadData(false);
                    }.bind(this)
                });
            } catch (e) {
                this.ShowError(e);
                this.SetStateBtnLoadData(false);
                return;
            }
        }).bind(this);
        fr.onerror = ((error) => {
            this.ShowError(error);
            this.SetStateBtnLoadData(false);
        }).bind(this);
        fr.readAsDataURL(this.FileSource);
    }

    /**
     * Загрузка модели фразы
     */
    LoadPhrase(id) {
        $.ajax({
            method: "POST",
            data: {id},
            url: this.GetUrl('/Phrase/GetPhrase'),
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(data != null) {
                    this.Phrase = data;
                    try{
                        this.tbId.textbox('setValue', this.Phrase.id);
                        this.tbCode.textbox('setValue', this.Phrase.code);
                        this.CurText = this.Phrase.name;
                        this.tbText.textbox('setValue', this.Phrase.name);
                        this.tbCreate.textbox('setValue', this.Phrase.created);
                        this.tbCreator.textbox('setValue', this.Phrase.creator);
                        this.tbChange.textbox('setValue', this.Phrase.changed);
                        this.tbChanger.textbox('setValue', this.Phrase.changer);
                        if (this.Phrase.fileData != null && this.Phrase.fileData != undefined) {
                            this.File = this.DataURLtoFile(this.Phrase.fileData, this.Phrase.orgFileName);
                            this.tbFile.textbox('setValue', this.Phrase.orgFileName);
                        }
                        else if (this.Phrase.errorMess.length > 0) {
                            this.ShowError(this.Phrase.errorMess);
                        }
                    }
                    catch (e) {
                        this.ShowError(e);
                    }
                }
            }.bind(this),
            error: function(data){ this.ShowErrorResponse(data); }.bind(this)
        });
    }

    /**
     * Установка статуса в зависимости от флага загрузки или окончания загрузки данных
     */
    SetStateBtnLoadData(flag) {
        this.IsWaitServer = flag;
        this.UpdateBtns();
    }

    /**
     * Формат даты yyyyMMdd
     */
    DateTimeToString() {
        let m = new Date();
        let dateString =
            m.getUTCFullYear() +
            ("0" + (m.getUTCMonth() + 1)).slice(-2) +
            ("0" + m.getUTCDate()).slice(-2) +
            ("0" + m.getUTCHours()).slice(-2) +
            ("0" + m.getUTCMinutes()).slice(-2) +
            ("0" + m.getUTCSeconds()).slice(-2);
        return dateString;
    }
}
