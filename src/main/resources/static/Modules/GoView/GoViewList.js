export function StartNestedModule(id){  // запуск
    let form = new GoViewList("nested_", {});
    form.Start(id);
}


class GoViewList extends FormView {
    constructor(prefix, StartParams) {
        super();
        this.ModuleId="rGoView_Module_GoView";
    }

    /**
     * Стартуем
     * @constructor
     */
    Start(){
        LoadForm("#"+this.ModuleId, this.GetUrl("/GoView/GoViewList"), this.InitFunc.bind(this));
    }

    /**
     * Инициализация компонентов
     * @constructor
     */
    async InitFunc(){
        try {
            this.InitComponents(this.ModuleId, "");

            //this.cbPttrn.combobox({onClick:(record)=>{  this.dgAsterQueue.datagrid({url: this.GetUrl("/GoView/QueueList"), queryParams: {server_id: '886185ac-b385-4e9f-8c21-cf4c826729cd', note_id: 'ec58dee5-d96f-4f64-9226-9ebdcd9c75fc'}}); }});

                                                                      // Подписываем панели ИТОГАМИ
            this.initDataGrid(this.dgAsterQueue,null,{ onLoadSuccess:(data)=>this.pnQueAster .panel({title:"Очередь: "    +this.dgAsterQueue.datagrid("getData").total+" абонентов"})  });
            this.initDataGrid(this.dgAsterNotes,null,{ onLoadSuccess:(data)=>this.pnNoteAster.panel({title:"Оповещаются: "+this.dgAsterNotes.datagrid("getData").total+" абонентов"})  });
            this.initDataGrid(this.dgSMSQueue  ,null,{ onLoadSuccess:(data)=>this.pnQueSMS   .panel({title:"Очередь: "    +this.dgSMSQueue  .datagrid("getData").total+" абонентов"})  });
            this.initDataGrid(this.dgSMSNotes  ,null,{ onLoadSuccess:(data)=>this.pnNoteSMS  .panel({title:"Оповещаются: "+this.dgSMSNotes  .datagrid("getData").total+" абонентов"})  });
            this.initDataGrid(this.dgEMailQueue,null,{ onLoadSuccess:(data)=>this.pnQueEMail .panel({title:"Очередь: "    +this.dgEMailQueue.datagrid("getData").total+" абонентов"})  });
            this.initDataGrid(this.dgEMailNotes,null,{ onLoadSuccess:(data)=>this.pnNoteEMail.panel({title:"Оповещаются: "+this.dgEMailNotes.datagrid("getData").total+" абонентов"})  });

            this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});

            let IntervalTime = await this.s_get("/GoView/GetInterval");
            if (String(IntervalTime.abon_id) != "undefined") {
                if (!isNaN(IntervalTime.abon_id)) {
                    IntervalTime = IntervalTime.abon_id * 1000;
                    setInterval(this.btnUpdate_onClick.bind(this), IntervalTime);
                }
                else{
                    this.ShowError("Установленное в глобальных параметрах значение 'update_time'= '"+IntervalTime.abon_id+"' (Интервал обновления монитора (сек))  не является числом.");
                }
            }

            this.btnUpdate_onClick(1);
            // События onSelect комбобокса Шаблонов
            this.cbPttrn.combobox({onSelect:(record)=>{  this.FillCBTasks(record); }});
            // События onSelect серверных комбобоксов
            this.cbAster.combobox({onSelect:(record)=>{ this.clearDgAster(); this.FillGridAster(record.id); }});
            this.cbSms  .combobox({onSelect:(record)=>{ this.clearDgSMS()  ; this.FillGridSMS  (record.id); }});
            this.cbEMail.combobox({onSelect:(record)=>{ this.clearDgEMail(); this.FillGridEMail(record.id); }});
        }
        catch (e) {  this.ShowErrorResponse(e);  }
    }

    /*
    Нажатие на кнопку Обновить
     */
    async btnUpdate_onClick(frst_start) {
        try {
            let row;
            row = this.dgAsterQueue.datagrid("getSelected");  if(row!=null) { this.dgAsterQueue.index = this.dgAsterQueue.datagrid("getRowIndex", row); if(this.dgAsterQueue.index<0){this.dgAsterQueue.index = 0;}  }
            row = this.dgAsterNotes.datagrid("getSelected");  if(row!=null) { this.dgAsterNotes.index = this.dgAsterNotes.datagrid("getRowIndex", row); if(this.dgAsterNotes.index<0){this.dgAsterNotes.index = 0;}  }
            row = this.dgSMSQueue  .datagrid("getSelected");  if(row!=null) { this.dgSMSQueue  .index = this.dgSMSQueue  .datagrid("getRowIndex", row); if(this.dgSMSQueue  .index<0){this.dgSMSQueue  .index = 0;}  }
            row = this.dgSMSNotes  .datagrid("getSelected");  if(row!=null) { this.dgSMSNotes  .index = this.dgSMSNotes  .datagrid("getRowIndex", row); if(this.dgSMSNotes  .index<0){this.dgSMSNotes  .index = 0;}  }
            row = this.dgEMailQueue.datagrid("getSelected");  if(row!=null) { this.dgEMailQueue.index = this.dgEMailQueue.datagrid("getRowIndex", row); if(this.dgEMailQueue.index<0){this.dgEMailQueue.index = 0;}  }
            row = this.dgEMailNotes.datagrid("getSelected");  if(row!=null) { this.dgEMailNotes.index = this.dgEMailNotes.datagrid("getRowIndex", row); if(this.dgEMailNotes.index<0){this.dgEMailNotes.index = 0;}  }

            //==================== Заполняем комбобосы ==========================
            // Начальные значения комбобоксов
            var StartPttrn = this.cbPttrn.combobox("getData").filter(i => i.name == this.cbPttrn.combobox("getText"));
            StartPttrn = (StartPttrn.length > 0) ? StartPttrn[0].id : "";// Текущее значение id "ШАБЛОНА ОПОВЕЩЕНИЯ"
            var StartTasks = this.cbTasks.combobox("getData").filter(i => i.name == this.cbTasks.combobox("getText"));
            StartTasks = (StartTasks.length > 0) ? StartTasks[0].id : "";// Текущее значение id "Задания"
            var StartAster = this.cbAster.combobox("getData").filter(i => i.name == this.cbAster.combobox("getText"));
            StartAster = (StartAster.length > 0) ? StartAster[0].id : "";// Текущее значение id "Сервера Астериск"
            var StartSms = this.cbSms.combobox("getData").filter(i => i.name == this.cbSms.combobox("getText"));
            StartSms = (StartSms.length > 0) ? StartSms  [0].id : "";// Текущее значение id "Сервера Sms"
            var StartEMail = this.cbEMail.combobox("getData").filter(i => i.name == this.cbEMail.combobox("getText"));
            StartEMail = (StartEMail.length > 0) ? StartEMail[0].id : "";// Текущее значение id "Сервера EMail"

            this.ClearAll();

            // Шаблон оповещения
            var data = await this.s_postCTRF("/GoView/PttrnList", {});        // Получанм списк Шаблоны оповещения для комбобокса
            //this.cbPttrn.combobox({valueField: 'id', textField: 'name', data: data.pttrn});// Заполняем Combobox "Шаблон оповещения" в рамках ЗАДАНИЯ
            this.FillCombobox(this.cbPttrn, data.pttrn, null, StartPttrn);
            if (data.pttrn.length == 0) return;                                            // не найдено активного ЗАДАНИЯ
            if(this.cbPttrn.combobox("getValue").length==0)
                      this.cbPttrn.combobox("setValue", data.pttrn[0].name);               // Начальное значение, если комбобокс пустой

            // Задания
            var cbPtrnKey = this.cbPttrn.combobox("getData").filter(i => i.name == this.cbPttrn.combobox("getText"))[0].id; // Текущее значение id "ШАБЛОНА ОПОВЕЩЕНИЯ"
            data = await this.s_postCTRF("/GoView/TasksList", {});                                         // Получанм списк Задания для комбобокса
            this.FillCombobox(this.cbTasks, data.tasks, cbPtrnKey, StartTasks);
            var cbTasksKey = this.cbTasks.combobox("getData").filter(i => i.name == this.cbTasks.combobox("getText")); // Текущее значение id "ЗАДАНИЯ" в виде списка

            // Комбобоксы Астериск, SMS, EMail
            cbTasksKey = (cbTasksKey.length > 0 ? cbTasksKey[0].id : "");                               // Текущее значение id "ЗАДАНИЯ" или ""
            data = await this.s_postCTRF("/GoView/AsterList", {server_id: cbTasksKey});     // Получанм списк Сервера Астериск для комбобокса
            this.FillCombobox(this.cbAster, data.aster, cbTasksKey, StartAster);                        // Заполняем Combobox "СЕРВЕР АСТЕРИСК"
            data = await this.s_postCTRF("/GoView/SMSList", {server_id: cbTasksKey});       // Получанм списк Сервера SMS для комбобокса
            this.FillCombobox(this.cbSms, data.sms, cbTasksKey, StartSms);                        // Заполняем Combobox "СЕРВЕР SMS"
            data = await this.s_postCTRF("/GoView/EMailList", {server_id: cbTasksKey});     // Получанм списк Сервера EMail для комбобокса
            this.FillCombobox(this.cbEMail, data.email, cbTasksKey, StartEMail);                        // Заполняем Combobox "СЕРВЕР EMAIL"

            // ========================== Заполняем статистику ========================
            var stat = await this.s_get("/GoView/GetStat?note_id="+cbTasksKey);
            this.txAll.textbox("setText", stat.all);
            this.txQueue.textbox("setText", stat.queue);
            this.txNote.textbox("setText", stat.note);
            this.txEnd.textbox("setText", stat.end);
            this.txSeccess.textbox("setText", stat.seccess);
            this.txFail.textbox("setText", stat.fail);

            // =============================  Гриды ===================================
            var AsterAdr=this.cbAster.combobox("getData").filter(i => i.name == this.cbAster.combobox("getText"));
            AsterAdr=(AsterAdr.length>0)?AsterAdr[0].id:"";// Текущее значение id
            this.FillGridAster(AsterAdr);

            // id выбранного севера SMS
            var SMSAdr=this.cbSms.combobox("getData").filter(i => i.name == this.cbSms.combobox("getText"));
            SMSAdr=(SMSAdr.length>0)?SMSAdr[0].id:"";// Текущее значение id "Сервера SMS'
            this.FillGridSMS(SMSAdr);
            // id выбранного севера EMail
            var EMailAdr = this.cbEMail.combobox("getData").filter(i => i.name == this.cbEMail.combobox("getText"));
            EMailAdr = (EMailAdr.length > 0) ? EMailAdr[0].id : "";// Текущее значение id "Сервера EMail'
            this.FillGridEMail(EMailAdr);


            // =============================  Панели  ===================================
             this.pnAster.panel('setTitle','Asterisk - все сервера: '+stat.aster+" абонентов");
             this.pnSMS  .panel('setTitle','SMS - все сервера: '     +stat.sms+" абонентов");
             this.pnEMAIL.panel('setTitle','EMAIL - все сервера: '   +stat.email+" абонентов");
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }
   /*
     Изменился шаблон - заполняем задание
   */
    async FillCBTasks(record){
        //var cbPtrnKey = this.cbPttrn.combobox("getData").filter(i => i.name == this.cbPttrn.combobox("getText"))[0].id; // Текущее значение id "ШАБЛОНА ОПОВЕЩЕНИЯ"
        let data = await this.s_postCTRF("/GoView/TasksList", {});                                         // Получанм списк Задания для комбобокса
        this.FillCombobox(this.cbTasks, data.tasks, record.id, "");
    }

    /**
     * Отчищает все элементы экрана
     */
    ClearAll() {
        // отчищаем комбобоксы
        this.cbPttrn.combobox('loadData',[]); this.cbPttrn.combobox("setText","");
        this.cbTasks.combobox('loadData',[]); this.cbTasks.combobox("setText","");
        this.cbAster.combobox('loadData',[]); this.cbAster.combobox("setText","");
        this.cbSms  .combobox('loadData',[]); this.cbSms  .combobox("setText","");
        this.cbEMail.combobox('loadData',[]); this.cbEMail.combobox("setText","");

        // отчищаем статистику абонентов
        this.txAll.textbox("setText","");
        this.txNote.textbox("setText","");
        this.txEnd.textbox("setText","");
        this.txSeccess.textbox("setText","");
        this.txFail.textbox("setText","");

        // отчищаем гриды
        // this.clearDgAster();
        // this.clearDgSMS  ();
        // this.clearDgEMail();
    }
    /*
    Отчищает гиды сервера Астериск
    */
    clearDgAster(){
        // Астериск
        this.dgAsterQueue.datagrid('load',{});
        this.dgAsterNotes.datagrid('load',{});
        // Отчищаем панели с ИТОГАМИ
        this.pnQueAster .panel({title:"Очередь: "    });
        this.pnNoteAster.panel({title:"Оповещаются: "});
    }
    /*
    Отчищает гиды сервера SMS
    */
    clearDgSMS(){
        // SMS
        this.dgSMSQueue.datagrid('load',{});
        this.dgSMSNotes.datagrid('load',{});
        // Отчищаем панели с ИТОГАМИ
        this.pnQueSMS   .panel({title:"Очередь: "    });
        this.pnNoteSMS  .panel({title:"Оповещаются: "});
    }
    /*
    Отчищает гиды сервера EMail
    */
    clearDgEMail(){
        // EMail
        this.dgEMailQueue.datagrid('load',{});
        this.dgEMailNotes.datagrid('load',{});
        // Отчищаем панели с ИТОГАМИ
        this.pnQueEMail .panel({title:"Очередь: "    });
        this.pnNoteEMail.panel({title:"Оповещаются: "});
    }

    /**     * Заполняет гриды сервера Астериск     */
    FillGridAster(server_id){
        try {
            var StartTasks = this.cbTasks.combobox("getData").filter(i => i.name == this.cbTasks.combobox("getText"));
            StartTasks = (StartTasks.length > 0) ? StartTasks[0].id : "";// Текущее значение id "Задания"
            if(server_id.length==0) {  this.clearDgAster();   return;  }
            this.dgAsterQueue.datagrid({url: this.GetUrl("/GoView/QueueList"), queryParams: {server_id: server_id, note_id: StartTasks}});
            this.dgAsterNotes.datagrid({url: this.GetUrl("/GoView/NotesList"), queryParams: {server_id: server_id, note_id: StartTasks}});
        }
        catch (e) {  this.ShowErrorResponse(e);   }
    }
    /**     * Заполняет гриды сервера SMS     */
    FillGridSMS(server_id){
        try{
            var StartTasks = this.cbTasks.combobox("getData").filter(i => i.name == this.cbTasks.combobox("getText"));
            StartTasks = (StartTasks.length > 0) ? StartTasks[0].id : "";// Текущее значение id "Задания"
            if(server_id.length==0) {  this.clearDgSMS();   return;  }
            this.dgSMSQueue.datagrid({url: this.GetUrl("/GoView/QueueList"), queryParams: {server_id:server_id, note_id: StartTasks}});
            this.dgSMSNotes.datagrid({url: this.GetUrl("/GoView/NotesList"), queryParams: {server_id:server_id, note_id: StartTasks}});
        }
        catch (e) { this.ShowErrorResponse(e); }
    }
    /**     * Заполняет гриды сервера EMail     */
    FillGridEMail(server_id){
        try {
            var StartTasks = this.cbTasks.combobox("getData").filter(i => i.name == this.cbTasks.combobox("getText"));
            StartTasks = (StartTasks.length > 0) ? StartTasks[0].id : "";// Текущее значение id "Задания"
            if(server_id.length==0) {  this.clearDgEMail();   return;  };
            this.dgEMailQueue.datagrid({url: this.GetUrl("/GoView/QueueList"), queryParams: {server_id: server_id, note_id: StartTasks}});
            this.dgEMailNotes.datagrid({url: this.GetUrl("/GoView/NotesList"), queryParams: {server_id: server_id, note_id: StartTasks}});
        }
        catch (e) {  this.ShowErrorResponse(e);   }
    }
    /*
    Заполняет комбобоксы данными this.FillCombobox(this.cbEMail, data.pttrn, ParentId, "")
    this.cbEMail - комбобокс для заполнения
    Data - данные для заполнения в виде {[id, parentId, name, . . .]}
    ParentId - id родителя, для которого заполняются данные
       StartId - начальное значение или "" (берется первое)
    */
    FillCombobox(cb, data, ParentId, StartId){
        var cbData=data.filter(i=>i.parentId==ParentId);                                    // отфильтрованный по ParentId список для комбобокса
        cb.combobox({valueField: 'id',textField: 'name', data: cbData });                   // Заполняем Combobox
        if(StartId.length==0) {                                                             // Начальное значение
            if (cbData.length != 0)
                cb.combobox("setValue", cbData[0].name);                                    // Ставим первое, если оно есть
        }
        else {
            var rows=cb.combobox("getData").filter(i => i.id == StartId);                   // получаем строку списка
            if(rows.length>0)
                cb.combobox("setValue", rows[0].name);                                      // Ставим найденное, если оно есть
            else {
                if (cbData.length != 0)
                    cb.combobox("setValue", cbData[0].name);                                // Ставим первое, если оно есть
            }
        }
    }
}
