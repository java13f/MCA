import {INewsDao} from "../Dao/INewsDao.js";

export class INewsFormEdit extends FormView{
    constructor(){
        super();
        this.dNews = new INewsDao();
    }
    Show(options){
        this.options = options;
        LoadForm("#ModalWindows", this.GetUrl("/INews/INewsFormEdit"), this.InitFunc.bind(this));
    }
    async InitFunc(){
        this.InitComponents("wNewsFormEdit_Module_INews", "");
        this.InitCloseEvents(this.wNewsFormEdit, false);
        this.divForEditor.html(`<textarea id="rtxContent_Module_INews_INewsFormEditor"></textarea>`);
        this.content_editor = SUNEDITOR.create('rtxContent_Module_INews_INewsFormEditor', {
            display: 'block',
            charCounter : true,
            width : 'auto',
            height : 'auto',
            minHeight : '205px',
            maxHeight: '205px',
            buttonList : [
                ['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
                //'/', // Line break
                ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
                ['link', 'image', 'video', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print']
            ],
            lang: SUNEDITOR_LANG['ru']
        });
        this.dtDate.datetimebox({
            formatter: this.dtFormatter.bind(this),
            parser: this.dtParser.bind(this)
        });
        this.btnCancel.linkbutton({onClick:()=>{this.content_editor.destroy(); this.wNewsFormEdit.window("close");}});
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});

        this.txTitle.textbox("textbox").attr("maxlength", "64");
        this.txDescription.textbox("textbox").attr("maxlength", "4096");

        if(this.options.AddMode){
            this.pbEditMode.attr("class", "icon-addmode");
            this.wNewsFormEdit.window({title:"Добавление новой новости"});
            this.lAction.html("Добавление новой новости");
            this.dtDate.datetimebox("setValue", this.dtFormatter(new Date()))
        }
        else {
            this.pbEditMode.attr("class", "icon-editmode");
            this.wNewsFormEdit.window({title:"Редатирование новости"});
            this.lAction.html("Редатирование новости");
            if(this.options.editMode){
                this.btnOk.linkbutton({disabled: false});
            }
            else{
                this.btnOk.linkbutton({disabled: true});
            }
            await this.LoadINews(this.options.uuid);
        }
    }
    dtFormatter(date){
        let y = date.getFullYear();
        let m = date.getMonth()+1;
        let d = date.getDate();
        let hh = date.getHours();
        let mm = date.getMinutes();
        let ss = date.getSeconds();
        let str_date = (d < 10 ? ('0'+ d) : d) + '.' + (m < 10 ? ('0' + m) : m) + '.' + y;
        let str_time = (hh < 10 ? ('0' + hh) : hh) + ':' + (mm < 10 ? ('0' + mm) : mm) + ':' + (ss < 10 ? ('0' + ss) : ss);
        return str_date + " " + str_time;
    }
    dtParser(str) {
        if (!str) return new Date();
        let strs = str.split(' ');
        let date = strs[0].split('.');
        let time = strs[1].split(':');
        let y = parseInt(date[2], 10);
        let m = parseInt(date[1], 10);
        let d = parseInt(date[0], 10);
        let hh = parseInt(time[0], 10);
        let mm = parseInt(time[1], 10);
        let ss = parseInt(time[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)
            && !isNaN(hh) && !isNaN(mm) && !isNaN(ss)) {
            return new Date(y, m - 1, d, hh, mm, ss);
        } else {
            return new Date();
        }
    }

    /**
     * Загрузка новости
     * @constructor
     */
    async LoadINews(id){
        try{
            let INews_obj = await this.dNews.GetINews(id);
            this.txId.textbox("setText", INews_obj.id);
            this.dtDate.datetimebox("setValue", INews_obj.date);
            this.txTitle.textbox("setText", INews_obj.title);
            this.txDescription.textbox("setText", INews_obj.description);
            INews_obj.status == 1 ? this.cbStatus.checkbox("check"):this.cbStatus.checkbox("uncheck");
            this.content_editor.setContents(INews_obj.content);
            this.txCreator.textbox("setText", INews_obj.creator + " " + INews_obj.created);
            this.txChanger.textbox("setText", INews_obj.changer + " " + INews_obj.changed);
        }
        catch(err){
            this.ShowErrorResponse(err);
        }
    }
    async btnOk_onClick(){
        let id = this.txId.textbox("getText");
        let date = this.dtDate.datetimebox("getValue");
        let title = this.txTitle.textbox("getText");
        let description = this.txDescription.textbox("getText");
        let content = this.content_editor.getContents();
        let status = this.cbStatus.checkbox("options").checked ? 1 : 0;

        if(title.length == 0){
            this.ShowError("Введите пожалуйста заголовок");
            return;
        }
        if(description.length == 0){
            this.ShowError("Введите пожалуйста краткое описание новости");
            return;
        }
        let n_obj = {id:id, date:date, title: title, description:description, content:content, status:status};
        try {
            id = await this.dNews.Save(n_obj);
            if(this.ResultFunc != null){
                this.ResultFunc(id);
            }
            this.wNewsFormEdit.window("close");
        }
        catch(err){
            this.ShowErrorResponse(err);
        }
    }
}