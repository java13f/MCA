class FormView {
    /**
     * Инициализация компоннетов, которые имеют id. После инициализации компоненту доступен как this.имя
     * @param ParentId Ид родителя (приходит в StartNestedModul)
     * @param prefix (приходит в StartNestedModul)
     * @constructor
     */
    InitComponents(ParentId, prefix){
        let ParentControl = $("#" + ParentId);
        let index = ParentId.indexOf("_");
        let ParentControlSimple = index!=-1?  ParentId.substring(0,index):  ParentId;
        this[ParentControlSimple] = ParentControl;

        let offset = prefix.length;

         let arr=[];
        ParentControl.find("*[id]").each(function(){
            if(!($(this).attr('id').length==0 || $(this).attr('id').substring(0,1)=="_")) {
                arr.push($(this));
            }
        });   // получаем все элементы с заполненными id=... и записиваем все значения id в arr
        for(let i=0;i<arr.length;i++) {
            let attrId = arr[i].attr("id");
            index = attrId.indexOf("_",offset);
            let curName=index!=-1?  attrId.substring(offset, index):  attrId; // Получаем усеченное до "_" имя (или если нет "_" - полное имя)
            this[curName]=arr[i];                                         // Присваиваем this.усеченноеЗначениеСвойстваId = $("#"+ЗначениеСвойстваId);
        }
    }
    /**
     * Определение клавиш и закрытия окна
     * @param wnd
     * @constructor
     */
    InitCloseEvents(wnd, bCloseByEnter = true) {
        wnd.window({onClose:()=>{
                if(this.CloseWindowFunc!=null){
                    this.CloseWindowFunc(this.options);
                }
                wnd.window("destroy");
            }});
            wnd.window('window').attr('tabindex', 1).focus().bind('keyup', function (e) {
                if (e.keyCode == Keys.VK_ESCAPE) {
                    wnd.window('close');
                }
                if(bCloseByEnter) {
                    if (e.keyCode == Keys.VK_RETURN) {
                        if (this.options == null) {
                            console.log("Не определён объект параметров формы options");
                            return false;
                        }
                        if (this.options.AddMode == null) {
                            console.log("Не определена настройка options.AddMode");
                            return false;
                        }
                        if (!this.options.AddMode && this.options.editMode == null) {
                            console.log("Для просмотра или редактирования записи необходимо определить настройку options.editMode");
                            return false;
                        }
                        if (!this.options.AddMode) {
                            if (this.options.editMode) {
                                this.btnOk_onClick();
                            }
                        } else {
                            this.btnOk_onClick();
                        }
                    }
                }
            }.bind(this))
    }

    /**
     * Устанавливает функц. кот. будут вызвана по нажатию Ок
     * @param ResultFunc
     * @constructor
     */
    SetResultFunc(ResultFunc){
        this.ResultFunc = ResultFunc;
    }
    /**
     * Получить url-адрес с учетом контекста
     * @param url - url-адрес без учета контекста
     */
    GetUrl(url) {
        return contextPath + url;
    }
    /**
     * Упрощает получение html элемента из шаблона (с учетом префикса)
     */
    GetElement(Id) {
        return $("#"+this.prefix+Id);
    }
    /**
     * Показать ошибку, которую возвращает сервер
     * @param data - объект ошибки
     */
    ShowErrorResponse(data) {
        let responseJSON = data.responseJSON
        if(responseJSON==null){
            this.ShowError(data);
        }
        else {
            let error = "message: " + responseJSON.message + "<br/>"
                +"error: " + responseJSON.error + "<br/>"
                +"status: " + responseJSON.status + "<br/>"
                +"path: " + responseJSON.path;
            this.ShowError(error);
        }
    }

    /**
     * Показать предупреждение
     * @param text - текст предупреждения
     */
    ShowWarning(text) {
        $.messager.alert("Предупреждение", text, "warning");
    }

    /**
     * Показать информационное сообщение
     * @param text - текст сообщения
     * @constructor
     */
    ShowInformation(text){
        $.messager.alert("Информация", text, "info");
    }

    /**
     * Отображение всплывающего в углу окна
     * @param header
     * @param text
     * @constructor
     */
    ShowSlide(header, text) {
        $.messager.show({
            title: header,
            msg: '<div class="messager-icon messager-warning"></div>'+text,
            timeout: 5000,
            showType: 'slide',
        });
    }
    /**
     * Показать ошибку
     * @param text - тескт ошибки
     */
    ShowError(text) {
        $.messager.alert("Ошибка", text, "error");
    }
    /**
     * Фильтрация получаемых данных с сервера приложений
     * @param data - данные, которые необходимо профильтровать
     */
    LoadFilter(data) {
        return EscapeSpecialHTMLCharacters(data);
    }
    /**
     * Задать функцию, которая вызовется при на жатию на кнопку Отмена
     * @param CancelFunc - функция родительского модуля
     */
    SetCloseWindowFunction(CloseWindowFunc){
        this.CloseWindowFunc = CloseWindowFunc
    }
    /*
    Функция рисования пузыря (tooltip)
    id - ид элемента, к которому отображать пузырь
   text  - сообщение в формате html
   options - параметры (необязательный)
   options.icon - иконка в стиле easyUI, по умолчанию icon='' - крестик (icon-no), без иконки - ' '
   options.title - заголовок, по умолчанию Ошибка (Пустой заголовок ' ')
   options.delay - задержка,  по умолчанию 5000 (5 сек)
   options.position - расположение пузыря, по умолчанию внизу (bottom, top, left, right)
   Элемент нужно заключить в div: <div style="display:inline-block;" id="dd">Элемент</div>
    Пример вызова this.ShowToolTip('#tooltip_textCode','Не заполнено поле <br> идентификатор валюты.')
       this.ShowToolTip('#txAddress_Module_Kter_KterFormEdit_toolTip','Введите пожалуйста адрес территории',
            {icon:'icon-no', title:'Ошибка', position:'right', delay:5000})
     */
    ShowToolTip(id,text,options) {
        let defIcon='icon-no';
        let defTitle='Ошибка';
        let defDelay=7000;
        let defPosition='bottom';
        if(options) {
            if(options.icon)  defIcon =options.icon;
            if(options.title) defTitle=options.title;
            if(options.delay) defDelay=options.delay;
            if(options.position) defPosition=options.position;
        }

        $(id).tooltip({                                                                           // определяем пузырь
            position: defPosition,
            content :
                `<div id="toolTipId" style="font-size:12px;margin:3px;">
                     <div class="`+defIcon+`" style="position:absolute;width:16px;height:16px;">
                </div>
                   <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`+defTitle+`</b>
                  <p style="margin-top:5px;margin-bottom:0px;margin-left:2px;margin-right:2px;font-size:11px;">`
                +text
                +`</div>`,
            onShow: function(){
                $(this).tooltip('tip').css({
                    backgroundColor: '#fcfcee',
                    borderColor: '#00a'
                });
            }
        });
        $(function(){ $('#toolTipId').bind('click', function(){ $(id).tooltip('destroy'); }); });

        $(id).tooltip('show');
        setTimeout(function(){$(id).tooltip('destroy');}, defDelay);
    }
    /** Инициализация компонента datebox текущей датой
     * @param date - компонент datebox
     */
    initDate(date){
        date.datebox({
            formatter: function (date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                return (d < 10 ? ('0' + d) : d) + '.'
                    + (m < 10 ? ('0' + m) : m) + '.'
                    + y.toString();

            },
            //парсим дату так как из бд дата в одном формате, в самом пикере дата в другом  а должна бить в третьем
            //'-' разделитель из БД
            //'/' разделитель стандартный в тайм пикере
            //'.' разделитель который должен отображаться
            parser: function (s) {
                if (!s) return new Date();
                s = s.substring(0, 10);
                var ss = s.indexOf('-') != -1 ? (s.split('-')) : s.indexOf('/') != -1 ? (s.split('/')) : s.split('.');
                if (s.indexOf('-') != -1) {
                    var y = parseInt(ss[0], 10);
                    var m = parseInt(ss[1], 10);
                    var d = parseInt(ss[2], 10);
                }

                if (s.indexOf('/') != -1) {
                    var m = parseInt(ss[0], 10);
                    var d = parseInt(ss[1], 10);
                    var y = parseInt(ss[2], 10);
                }

                if (s.indexOf('.') != -1) {
                    var d = parseInt(ss[0], 10);
                    var m = parseInt(ss[1], 10);
                    var y = parseInt(ss[2], 10);
                }
                if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                    return new Date(y, m - 1, d);
                } else {
                    return new Date();
                }
            }
        });

        let currentDate = new Date();

        let year = currentDate.getFullYear(); // 2020
        let month = currentDate.getMonth() + 1; // 0-11
        let day = currentDate.getDate(); // 1-31

        let fullDate = day + '.' + month + '.' + year;
        date.datebox("setValue", fullDate);
    }

    /**
     * Функция для выполнения post запроса с CSRF токеном в синхронном режиме
     Пример  var data = await this.s_postCTRF("/GoView/PttrnList", {});
     */
     async s_postCTRF(relUrl, _data){
        return await $.ajax({
                method: "post",
                url: this.GetUrl(relUrl),
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(_data),
                headers: GetCSRFTokenHeader(),
            }
        );
    }
    /**
     * Функция для выполнения post запроса с CSRF токеном в Асинхронном режиме
     Пример  this.a_postCTRF("/GoView/AsterList", {server_id: '123'},()=>alert('post '+data));
     */
    a_postCTRF(relUrl, _data, _func){
        $.ajax({
            method:"POST",
            data: JSON.stringify(_data),
            headers: GetCSRFTokenHeader(),
            url: this.GetUrl(relUrl),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                _func(data);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }
    /**
     * Функция для выполнения get запроса в синхронном режиме
     Пример let stat = await this.s_get("/GoView/GetStat?server_id=10");
     */
    async s_get(relUrl){
        return await $.ajax({
                method: "get",
                url: this.GetUrl(relUrl),
//                headers: GetCSRFTokenHeader(),
            }
        );
    }

    /**
     * Функция для выполнения get запроса в Асинхронном режиме
     Пример this.a_get("/GoView/GetStat?server_id=10",()=>alert('get'+data));
     */
    a_get(relUrl, _func){
        $.ajax({
            method:"GET",
//            headers: GetCSRFTokenHeader(),
            url: this.GetUrl(relUrl),
            contentType: "application/json; charset=utf-8",
            success: function(data){
                _func(data);
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }

    /*
    * Инициализация datagrid-ов
    * Выполняет:  AddKeyboardNavigationForGrid
    *             LoaderCSRFDataForGrid
    *             Установку событий loadFilter, onLoadError, rowStyler, onLoadSuccess, onSelect
    *
    * параметры:  dg - грид
    *             btnDel - кнопка пометки на удаление (будет изменяться запись Удалить/Вернуть) или null, если не нужно это делать
    *             options - указатель на функцию, которая будет выполнена после окончательной работы скрипта
    *                       вышеперечисленных событий (кроме loadFilter)
    * Пример      this.initDataGrid(this.dgMessDlg, null          , {onSelect:()=>this.btnUpdateAns_onClick()});
    *             this.initDataGrid(this.dgAnsDlg , null          , {});
    *             this.initDataGrid(this.dgDlg    , this.btnDelete, {});
    */

    initDataGrid(dg, btnDel, options) {
        AddKeyboardNavigationForGrid(dg);
        LoaderCSRFDataForGrid(dg);   // Перегрузка загрзщика datagrid-a

        if (dg.frst == null) {
            dg.frst = 0;
            dg.datagrid("loadData", dg.datagrid("getData"));
            dg.id = "";
            dg.index = 0;
        }

        dg.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data);
                if (options.onLoadError != null)
                    options.onLoadError(data);
            },
            rowStyler: (index, row) => {
                if (row.del == 1) return "background-color:lightgray;color:red;"
                if (options.rowStyler != null)
                    options.rowStyler(index, row);
            },
            onLoadSuccess: (data) => {
                if (data.total > 0) {
                    if (dg.id != "") {
                        dg.datagrid("selectRecord", dg.id);
                    } else {
                        if (dg.index >= 0 && dg.index < data.total) {
                            dg.datagrid("selectRow", dg.index);
                        } else if (data.total > 0) {
                            dg.datagrid("selectRow", data.total - 1);
                        }
                    }
                    dg.id = "";
                    dg.index = 0;
                }
                if (options.onLoadSuccess != null)
                    options.onLoadSuccess(data);
            },
            onSelect: (record) => {

                if (btnDel != null) {
                    btnDel.linkbutton({iconCls: "icon-remove", text: "Удалить"});
                    if (dg.datagrid("getRows").length != 0) {
                        let selData = dg.datagrid("getSelected");
                        if (selData != null) {
                            if (selData.del == 1) {
                                btnDel.linkbutton({iconCls: "icon-undo", text: "Вернуть"});
                            }
                        }
                    }
                }
                if (options.onSelect != null)
                    options.onSelect(record);
            }
        })
    }

}