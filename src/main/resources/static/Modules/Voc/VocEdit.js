export class VocEdit extends FormView {
    constructor() {
        super();
        this.vocItemId = "";
    }

    Show(object){
        this.vocItemId = object.vocItemId;
        this.options = {AddMode:true};
        LoadForm("#ModalWindows", this.GetUrl("/Voc/VocEditForm"), this.InitFunction.bind(this));
    }

    InitFunction() {
        this.InitComponents("wVocEdit_VocEdit_Module_Voc", "");
        this.InitCloseEvents(this.wVocEdit);
        this.btnCancel.linkbutton({onClick: function () {
                this.wVocEdit.window("close");
            }.bind(this)
        });
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
    }

    btnOk_onClick() {
        this.CheckForm();
    }

    async CheckForm() {
        if(this.tbWord.textbox('getText').trim().length == 0) {
            this.ShowToolTip("#tbWordToolTip_VocEdit_Module_Voc", "Не введено слово", {title:'Ошибка', delay: 5000});
            return;
        }
        let chk = await this.CheckWord();
        if(chk.length > 0) {
            this.ShowToolTip("#tbWordToolTip_VocEdit_Module_Voc", chk, {title:'Ошибка', delay: 5000});
            return;
        }
        this.Save();
    }

    CheckWord() {
        return new Promise((resolve, reject) => {
            let word = this.tbWord.textbox('getText');
            $.ajax({
                method: "POST",
                data: JSON.stringify({word: word, vocItemId: this.vocItemId}),
                contentType: "application/json; charset=utf-8",
                url: this.GetUrl('/Voc/CheckWord'),
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

    Save() {
        let word = this.tbWord.textbox('getText');
        $.ajax({
            method: "POST",
            data: JSON.stringify({ word: word, vocItemId: this.vocItemId }),
            url: this.GetUrl('/Voc/Save'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success:function(data) {
                if(this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.wVocEdit.window("close");
                }
            }.bind(this),
            error: function(data){
                this.SetStateBtnLoadData(false);
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
}