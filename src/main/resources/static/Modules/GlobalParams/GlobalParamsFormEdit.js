import {GlobalParamsFormSlct} from "../GlobalParams/GlobalParamsFormSlct.js";

export class GlobalParamsFormEdit extends FormView {

    constructor() {
        super();
        this.GlId = "";
        this.GlPrId = "";
    }

    Show(options) {
        this.options = options;
        LoadForm("#ModalWindows",
            this.GetUrl("/GlobalParams/GlobalParamsFormEdit"),
            this.InitFunc.bind(this)
        );
    }

    /**
     * Инициализация компнетов формы
     * @returns {Promise<void>}
     * @constructor
     */
    async InitFunc() {
        this.InitComponents("wGlobalParamsFormEdit_Module_GlobalParams", "");
        this.InitCloseEvents(this.wGlobalParamsFormEdit, true);

        this.btnParentGlPrClear.linkbutton({onClick: this.btnParentGlPrClear_onClick.bind(this)});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wGlobalParamsFormEdit.window("close");
            }
        });
        this.txParentGlPr.textbox({onClickButton: this.txParentGlPr_onClickButton.bind(this)});
        if (this.options.AddMode) {
            this.GlPrId = this.options.id;
            this.LoadParentGlPr(this.GlPrId, true).then(res => {
                this.pbEditMode.attr("class", "icon-addmode");
                let txt = "Добавление глобального параметра";
                this.wGlobalParamsFormEdit.window({title: txt});
                this.lAction.html(txt);
            });
        } else {
            this.LoadGlPr(this.options.uuid).then(result => {
                this.txIdParametr.textbox('setText', this.options.uuid);
                this.pbEditMode.attr("class", "icon-editmode");
                let txt = "Редактирование глобального параметра";
                this.wGlobalParamsFormEdit.window({title: txt});
                this.lAction.html(txt);
                this.txParentGlPr.textbox('setText', result.parentIdName);
                this.txNameParametr.textbox('setText', result.name);
                this.txCodeParametr.textbox('setText', result.param_code);
                this.txValueParametr.textbox('setText', result.value);

                this.txCreatorParametr.textbox('setText', result.creater);
                this.txCreatParametr.textbox('setText', result.created);
                this.txChangerParametr.textbox('setText', result.changer);
                this.txChangeParametr.textbox('setText', result.changed);

                this.GlId = this.options.uuid;
                this.GlPrId = result.parent_id;

        }).catch(function (data) {
                this.ShowErrorResponse(data);
            }.bind(this));

            if(this.options.editMode) this.btnOk.linkbutton({disabled: false});
            else this.btnOk.linkbutton({disabled: true});
        }

    }

    /**
     * Очистить поле Родитель
     */
    btnParentGlPrClear_onClick() {
        this.GlPrId = "";
        this.txParentGlPr.textbox('clear');
    }

    /**
     * Обработка нажатяи на кнопку ОК
     */
    btnOk_onClick() {
        let codeParam = this.txCodeParametr.textbox('getText').trim();
        if (codeParam.length < 1) return this.ShowToolTip("#hintCodeParametr_Module_GlobalParams_GlobalParamsEdit", "Заполните поле код параметра !", {});
        let nameParam = this.txNameParametr.textbox('getText').trim();
        if (nameParam.length < 1) return this.ShowToolTip("#hintNameParametr_Module_GlobalParams_GlobalParamsEdit", "Заполните поле название параметра !", {});
        let valueParam = this.txValueParametr.textbox('getText').trim();
        let objGlPr = {parent_id: this.GlPrId, name: nameParam, codeParam: codeParam, valueParam: valueParam, flagMode: "0"};
        this.options.AddMode? objGlPr.flagMode = "-1": objGlPr.id = this.GlId;
        this.save(objGlPr);
    }


    /**
     * Сохранить изменения
     * @param objGlPr
     * @returns {Promise<jQuery|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}|$|jQuery|HTMLElement|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}>}
     */
    async save(objGlPr) {
        return $.post({
            data: JSON.stringify({
                id: objGlPr.id,
                flagMode: objGlPr.flagMode,
                parent_id: objGlPr.parent_id,
                name: objGlPr.name,
                param_code: objGlPr.codeParam,
                value: objGlPr.valueParam
            }),
            url: this.GetUrl('/GlobalParams/Save'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                if (this.ResultFunc != null) {
                    this.ResultFunc(data);
                    this.wGlobalParamsFormEdit.window("close");
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        })
    }
async NodeSearch(id){
    return $.post({
        data: JSON.stringify({id: id}),
        url: this.GetUrl('/GlobalParams/ChildNode'),
        contentType: "application/json; charset=utf-8",
        headers: GetCSRFTokenHeader()
    });
}
    /**
     * Вызов модального окна для выбора родительского параметра
     * @returns {Promise<void>}
     */
    async txParentGlPr_onClickButton() {
        let form = new GlobalParamsFormSlct();
        form.SetResultFunc(((RecId) => {
            this.NodeSearch(this.options.uuid)
                .then((res => {
                    let index = res.indexOf(RecId);
                    if (index == -1) {
                        this.LoadParentGlPr(RecId, true);
                        this.GlPrId = RecId;
                    } else {
                        let txt = "Неверно указан родитель.";
                        if (index == 0) txt += "Вы указали в качестве родительского параметра сам параметр !";
                        else txt += "Вы указали в качестве родительского параметра его дочерний параметр !";
                        this.ShowWarning(txt);
                    }
                }))
                .catch(function (data) {
                    this.ShowErrorResponse(data);
                }.bind(this));

        }).bind(this));
        form.Show();
    }

    /**
     * Получить пару: название родительского параметр = id
     * @param GlPrId
     * @param flagMod
     * @returns {Promise<jQuery|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}|$|jQuery|HTMLElement|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}|number>}
     * @constructor
     */
    async LoadParentGlPr(GlPrId, flagMod) {
        if (typeof GlPrId === 'undefined' || GlPrId == "") return 0;
        return $.post({
            data: JSON.stringify({id: GlPrId, flagMod: flagMod}),
            url: this.GetUrl('/GlobalParams/LoadParentGlPr'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                if (data == "-1") {
                    this.txParentGlPr.textbox('setText', "корневой глобальный параметр = null");
                } else {
                    this.GlPrId = data.split(" = ")[0];
                    this.txParentGlPr.textbox('setText', data);
                }
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        })
    }

    /**
     * Получить глобальные параметры
     * @param id
     * @returns {Promise<jQuery|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}|$|jQuery|HTMLElement|{getAllResponseHeaders: function(): (*|null), abort: function(*=): this, setRequestHeader: function(*=, *): this, readyState: number, getResponseHeader: function(*): (null|*), overrideMimeType: function(*): this, statusCode: function(*=): this}|number>}
     * @constructor
     */
    async LoadGlPr(id) {
        if (typeof id === 'undefined' || id == "") return 0;
        return $.post({
            data: JSON.stringify({id: id}),
            url: this.GetUrl('/GlobalParams/LoadGlPr'),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader()
        })
    }
}