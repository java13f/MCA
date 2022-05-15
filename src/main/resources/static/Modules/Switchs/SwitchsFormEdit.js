export class SwitchsFormEdit extends FormView{

    constructor(){
        super();
        this.params = {};
    }
    Show(options){
        this.options = options;
        LoadForm("#ModalWindows",
                        this.GetUrl("/Switchs/SwitchsFormEdit"),
                            this.InitFunc.bind(this)
                );
    }
    async InitFunc() {
        //Автоматическое получение идентификаторов формы
        this.InitComponents("wSwitchsFormEdit_Module_Switchs", "");

        //Закрытие формы по "ESC" и "Enter"
        this.InitCloseEvents(this.wSwitchsFormEdit);

        this.cbTypeCommctn.combobox({onSelect: this.cbTypeCommctn_onSelect.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({ onClick: ()=>{ this.wSwitchsFormEdit.window("close")}   });
        if(this.options.editMode) this.btnOk.linkbutton({disabled: false});
        else this.btnOk.linkbutton({disabled: true});

        this.LoadData();
    }

    btnOk_onClick(){
        let objSave = {};
        if(this.params.code=='phone' || this.params.code=='mobile'){
            if(!this.ChcParametr(this.SwitchsPhoneTryNo.textbox('getText'),101, 'hintSwitchsPhoneTryNo_Module_Switchs')) return 0;
            if(!this.ChcParametr(this.SwitchsPhoneNoAnswerPause.textbox('getText'),301, 'hitnSwitchsPhoneNoAnswerPause_Module_Switchs')) return 0;
            if(!this.ChcParametr(this.SwitchsPhoneBusyFailPause.textbox('getText'),301, 'hintSwitchsPhoneBusyFailPause_Module_Switchs')) return 0;
            if(!this.ChcParametr(this.SwitchsPhoneWaitAnswer.textbox('getText'),301, 'hintSwitchsPhoneWaitAnswer_Module_Switchs')) return 0;
            objSave.phone_try_no = this.SwitchsPhoneTryNo.textbox('getText');
            objSave.phone_no_answer_pause = this.SwitchsPhoneNoAnswerPause.textbox('getText');
            objSave.phone_busy_fail_pause = this.SwitchsPhoneBusyFailPause.textbox('getText');
            objSave.phone_wait_answer = this.SwitchsPhoneWaitAnswer.textbox('getText');
            objSave.phone_recall_if_break = this.SwitchsPhoneRecalIfBreak.checkbox("options").checked ? 1 : 0;
        }else if(this.params.code=='SMS' ){
            if(!this.ChcParametr(this.SwitchsSmsTryNo.textbox('getText'),101, 'hintSwitchsSmsTryNo_Module_Switchs')) return 0;
            if(!this.ChcParametr(this.SwitchsSmsPauseRepeat.textbox('getText'),301, 'hintSwitchsSmsPauseRepeat_Module_Switchs')) return 0;
            objSave.sms_try_no = this.SwitchsSmsTryNo.textbox('getText');
            objSave.sms_pause_repeat = this.SwitchsSmsPauseRepeat.textbox('getText');
        } else if(this.params.code=='EMail' ){
            if(!this.ChcParametr(this.SwitchsMailTryNo.textbox('getText'),101, 'hintSwitchsMailTryNo_Module_Switchs')) return 0;
            if(!this.ChcParametr(this.SwitchsMailPauseRepeat.textbox('getText'),301, 'hintSwitchsMailPauseRepeat_Module_Switchs')) return 0;
            objSave.mail_try_no = this.SwitchsMailTryNo.textbox('getText');
            objSave.mail_pause_repeat = this.SwitchsMailPauseRepeat.textbox('getText');
        }
        objSave.id = this.params.id;
        objSave.code = this.params.code;
        this.Save(objSave);
        return false;
    }

    async Save(obj){
        $.ajax({
            method: 'POST',
            data: JSON.stringify(obj),
            url: this.GetUrl('/Switchs/save'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                if(this.ResultFunc != null){
                    this.ResultFunc(data);
                    this.wSwitchsFormEdit.window("close");
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        })
    }
    /**
     * Загрузка данных для формы редактирования
     * @returns {Promise<void>}
     * @constructor
     */
    async LoadData(){
        $.ajax({
            method: 'POST',
            data: JSON.stringify({id: this.options.uuid}),
            url: this.GetUrl('/Switchs/get'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                this.params.id = data.id;
                this.params.code = data.code;
                    $.post({
                        url: this.GetUrl('/Switchs/getCode'),
                        contentType: "application/json; charset=utf-8",
                        headers: GetCSRFTokenHeader(),
                        success: function (dt) {
                            this.cbTypeCommctn.combobox({
                                data: dt,
                                valueField: 'id',
                                textField: 'name',
                                onLoadSuccess: ()=>{
                                    this.SwitchsId.textbox("setText", data.id);
                                    /*if(StaticRepParams.SwitchsId) */this.cbTypeCommctn.combobox('select', data.id);

                                    this.ViewTypeComm(data.code, ".5");

                                    if(data.phone_try_no>0)  this.SwitchsPhoneTryNo.textbox("setText", data.phone_try_no);

                                    if(data.phone_no_answer_pause>0) this.SwitchsPhoneNoAnswerPause.textbox("setText", data.phone_no_answer_pause);
                                    if(data.phone_wait_answer>0) this.SwitchsPhoneWaitAnswer.textbox("setText", data.phone_wait_answer);
                                    if(data.phone_busy_fail_pause>0) this.SwitchsPhoneBusyFailPause.textbox("setText", data.phone_busy_fail_pause);
                                    if(Number(data.phone_recall_if_break)==1) this.SwitchsPhoneRecalIfBreak.checkbox("check");

                                    if(data.sms_try_no>0) this.SwitchsSmsTryNo.textbox("setText", data.sms_try_no);
                                    if(data.sms_pause_repeat>0) this.SwitchsSmsPauseRepeat.textbox("setText", data.sms_pause_repeat);

                                    if(data.mail_try_no>0)this.SwitchsMailTryNo.textbox("setText", data.mail_try_no);
                                    if(data.mail_pause_repeat>0) this.SwitchsMailPauseRepeat.textbox("setText", data.mail_pause_repeat);

                                    this.SwitchsCreator.textbox("setText", data.creator);
                                    this.SwitchsCreated.textbox("setText", data.created);
                                    this.SwitchsChanger.textbox("setText", data.changer);
                                    this.Switchschanged.textbox("setText", data.changed);
                                }
                            });
                        }.bind(this)
                    })
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)

        })
    }

    /**
     * Показать блоки формы, в зависимости от типа коммуникации
     * @param code
     * @param opstIndex
     * @constructor
     */
    ViewTypeComm(code, opstIndex) {
        let chBox = $("#SwitchsPhoneRecalIfBreak_Module_Switchs");
        if(code =='phone' || code == 'mobile') {
            $('#SMSBlock_Module_Switchs, #EmailBlock_Module_Switchs').css('opacity',opstIndex);
            $(".easyui-textbox", "#SMSBlock_Module_Switchs, #EmailBlock_Module_Switchs").textbox({disabled: true});
            $(".easyui-textbox",  "#PhoneBlock_Module_Switchs").textbox({disabled: false});
            chBox.checkbox("enable");
            $('#PhoneBlock_Module_Switchs').css('opacity', 1);
        } else if(code == 'SMS') {
            $('#PhoneBlock_Module_Switchs, #EmailBlock_Module_Switchs').css('opacity',opstIndex);
            $(".easyui-textbox", "#PhoneBlock_Module_Switchs, #EmailBlock_Module_Switchs").textbox({disabled: true});
            chBox.checkbox("disable");
            $(".easyui-textbox",  "#SMSBlock_Module_Switchs").textbox({disabled: false});
            $('#SMSBlock_Module_Switchs').css('opacity', 1);
        } else if(code == 'EMail') {
            $('#SMSBlock_Module_Switchs, #PhoneBlock_Module_Switchs').css('opacity',opstIndex);
            $(".easyui-textbox", "#SMSBlock_Module_Switchs, #PhoneBlock_Module_Switchs").textbox({disabled: true});
            chBox.checkbox("disable");
            $(".easyui-textbox",  "#EmailBlock_Module_Switchs").textbox({disabled: false});
            $('#EmailBlock_Module_Switchs').css('opacity', 1);
        }
    }

    /**
     * Проверка введенных данных в форме
     * @param field
     * @param limit
     * @constructor
     */
    ChcParametr(field, limit, hintId) {
        let strVar = field.trim();
        if (strVar.length > 0) {
            if (strVar.indexOf(',') > -1 || strVar.indexOf('.') > -1) {
                this.ShowToolTip("#" + hintId, "Введите целое число !", {});
                return false;
            }
            let intVar = Number(strVar);
            if (!(Number.isInteger(intVar) && (intVar > 0 && intVar < limit))) {
                this.ShowToolTip("#" + hintId, "Введите целое число от 1 до " + (limit-1) + "!", {});
                return false;
            }
        }else {
            this.ShowToolTip("#" + hintId, "Заполните поле, введите целое число !", {});
            return false;
        }
        return true;
    }
    /**
     * Обработка combobox  пока не используеться
     * @param record
     */
    cbTypeCommctn_onSelect(record){
        this.ViewTypeComm(record.code, ".5");
    }
}