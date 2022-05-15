import {GrpListFormFilter} from "./GrpListFormFilter.js";

class GrpList extends FormView {
    constructor(ModuleId, prefix) {
        super();

        this.ModuleId = ModuleId;
        this.prefix = prefix;

        this.GroupIndex = 0;
        this.GroupId = -1; //Переменная для запоминанися последней добавленной

        this.Filter = {};
    }

    /**
     * Показать форму добавления абонента в группу
     * @param options
     * @constructor
     */
    Start(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#" + this.ModuleId, this.GetUrl("/GrpList/GrpListFormList"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        //this.InitComponents("wAbonsFormListGroups_Module_Abons", ""); //Автоматическое получение идентификаторов формы
        this.InitComponents(this.ModuleId, this.prefix);
        if($('#LinkAbonsFormListGroups_Module_Abons').length === 0) {
            $('head').append('<link id="LinkAbonsFormListGroups_Module_Abons" rel="stylesheet" type="text/css" href="../css/imgs/abons/abons.css"/>');
        }
        AddKeyboardNavigationForGrid(this.dgGrpList);
        LoaderCSRFDataForGrid(this.dgGrpList);

        this.dgGrpList.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data);
            },
            rowStyler: this.dgGrpList_rowStyler.bind(this), //Обработка события перерисовки грида (подсветка удаленных записей)
            onLoadSuccess: this.dgGrpList_onLoadSuccess.bind(this)
        });


        this.InitCloseEvents(this.wGrpListFormGrpList);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wGrpListFormGrpList.window("close")
            }
        });//Обработка события нажатия на кнопку отмены

        this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});
        this.btnFilter.linkbutton({onClick: this.btnFilter_onClick.bind(this)});
        this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});


        // Инициализация фильтра
        this.FilterInit();

        this.btnUpdate_onClick();
    }


    /**
     * Инициализация фильтра
     * @constructor
     */
    FilterInit() {
        this.Filter.code = '';
        this.Filter.name = '';
    }


    /**
     * Фильтр по абонентам(тут будет фильтр по группам)
     */
    btnFilter_onClick() {

        let form = new GrpListFormFilter();
        form.SetResultFunc((RecId) => { this.btnUpdate_onClick(); }); //Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show(this.Filter);
    }


    /**
     /* Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgGrpList_rowStyler(index, row) {
        if (row.del == 1) {
            return "background:grey;color:red;"; //Красим в серый цвет (delete)
        }
    }


    /**
     * Обработка окончания загрузки списка абонентов
     * @param data - информация о загруженных данных
     */
    dgGrpList_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.GroupId != -1) {
                this.dgGrpList.datagrid("selectRecord", this.GroupId);
            } else {//иначе устанавливаем курсор согласно сохранённому положению курсору
                if (this.GroupIndex >= 0 && this.GroupIndex < data.total) {
                    this.dgGrpList.datagrid("selectRow", this.GroupIndex);
                } else if (data.total > 0) {
                    this.dgGrpList.datagrid("selectRow", data.total - 1);
                }
            }
            //возвращаем значения по умолчанию
            this.GroupId = -1;
            this.GroupIndex = 0;
        }
    }


    /**
     * Обновление спсика абонентов
     */
    btnUpdate_onClick() {
        let row = this.dgGrpList.datagrid("getSelected");

        if (row != null) {
            this.GroupIndex = this.dgGrpList.datagrid("getRowIndex", row);
            if (this.GroupIndex < 0) {
                this.GroupIndex = 0;
            }
        }

        let showDel = this.cbShowDel.checkbox("options").checked;

        this.dgGrpList.datagrid({url: this.GetUrl("/GrpList/listGroup"), queryParams: {showDel: showDel, code:this.Filter.code, name:this.Filter.name }});
    }


    /**
     * Кнопка выбора абонента
     */
    btnOk_onClick() {
        if(this.dgGrpList.datagrid("getRows").length == 0) {
            this.ShowWarning("Список групп пуст.");
            return false;
        }

        let row = this.dgGrpList.datagrid("getSelected");//получаем выбранную запись
        if (row != null) {
            this.GroupIndex = this.dgGrpList.datagrid("getRowIndex", row);// получаем индекс выбранной записи
            if (this.GroupIndex < 0) {
                this.GroupIndex = 0;
                this.ShowWarning("Выберите группу.");
                return false;
            }//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0

            this.GroupId = row.id;

            //--
            this.ResultFunc(this.GroupId);
            this.wGrpListFormGrpList.window("close");
            //--

            //TODO:необходимо убрать. Здесь будет возвращаться только ид группы.
            //this.addAbonToGroup(this.AbonId, this.GroupId);
        }
    }


    /**
     * Добавление абонента в группу
     * @param abonId
     * @param groupId
     */
    addAbonToGroup(abonId, groupId){
        $.ajax({
            method: "post",
            data: {abonId: abonId, groupId: groupId},  //JSON.stringify(number)
            url: this.GetUrl('/Abons/addAbonToGroup'),
            //contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success: function(data){
                if(this.ResultFunc!=null)
                {
                    if(data.length > 0){ //в группе уже есть этот абонент
                        this.ShowWarning(data);
                        return;
                    }

                    this.ResultFunc(this.AbonId);
                    this.wGrpListFormGrpList.window("close");
                }
            }.bind(this),
            error: function(data){
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }


}



/**
 * Модально вызываю форму
 * @param StartParams
 * @param ResultFunc
 * @constructor
 */
export function StartModalModule(StartParams, ResultFunc) {
    let id = "wGrpListFormGrpList_Module_GrpList";
    CreateModalWindow(id, "Список групп");
    let form = new GrpList("wGrpListFormGrpList_Module_GrpList", "");
    form.SetResultFunc(ResultFunc);
    form.Start({AddMode: true}); //, StartParams.AbonId
}