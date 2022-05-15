import {AbonListFormFilter} from "./AbonListFormFilter.js";

class AbonList extends FormView {
    constructor(ModuleId, prefix) {
        super();

        this.ModuleId = ModuleId;
        this.prefix = prefix;

        this.AbonIndex = 0;
        this.AbonId = -1; //Переменная для запоминанися последней добавленной

        this.GroupId = -1; //группа в которую будет добавлен абонент

        this.Filter = {};
    }

    /**
     * Показать форму Список абонентов
     * @param options
     * @constructor
     */
    Start(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#" + this.ModuleId, this.GetUrl("/AbonList/AbonListFormList"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        //this.InitComponents("wAbonListFormAbonList_Module_AbonList", "modal_"); //Автоматическое получение идентификаторов формы
        this.InitComponents(this.ModuleId, this.prefix);
        if($('#LinkAbonListFormAbonList_Module_AbonList').length === 0) {
            $('head').append('<link id="LinkAbonListFormAbonList_Module_AbonList" rel="stylesheet" type="text/css" href="../css/imgs/abons/abons.css"/>');
        }
        AddKeyboardNavigationForGrid(this.dgAbonList);
        LoaderCSRFDataForGrid(this.dgAbonList);

        this.dgAbonList.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data);
            },
            rowStyler: this.dgAbonList_rowStyler.bind(this), //Обработка события перерисовки грида (подсветка удаленных записей)
            onLoadSuccess: this.dgAbonList_onLoadSuccess.bind(this)
        });


        this.InitCloseEvents(this.wAbonListFormAbonList);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        this.btnOk.linkbutton({onClick: this.btnOk_onClick.bind(this)});
        this.btnCancel.linkbutton({
            onClick: () => {
                this.wAbonListFormAbonList.window("close")
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
        this.Filter.snils = '';
        this.Filter.surname = '';
        this.Filter.name = '';
        this.Filter.oname = '';
        this.Filter.priority = '';
    }


    /**
     * Фильтр по абонентам
     */
    btnFilter_onClick() {

        let form = new AbonListFormFilter();
        form.SetResultFunc((RecId) => { this.AbonId = RecId; this.btnUpdate_onClick(); }); //Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show(this.Filter);
    }


    /**
     /* Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgAbonList_rowStyler(index, row) {
        if (row.del == 1) {
            return "background:grey;color:red;"; //Красим в серый цвет (delete)
        }
    }


    /**
     * Обработка окончания загрузки списка абонентов
     * @param data - информация о загруженных данных
     */
    dgAbonList_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.AbonId != -1) {
                this.dgAbonList.datagrid("selectRecord", this.AbonId);
            } else {//иначе устанавливаем курсор согласно сохранённому положению курсору
                if (this.AbonIndex >= 0 && this.AbonIndex < data.total) {
                    this.dgAbonList.datagrid("selectRow", this.AbonIndex);
                } else if (data.total > 0) {
                    this.dgAbonList.datagrid("selectRow", data.total - 1);
                }
            }
            //возвращаем значения по умолчанию
            this.AbonId = -1;
            this.AbonIndex = 0;
        }
    }


    /**
     * Обновление спсика абонентов
     */
    btnUpdate_onClick() {
        let row = this.dgAbonList.datagrid("getSelected");

        if (row != null) {
            this.AbonIndex = this.dgAbonList.datagrid("getRowIndex", row);
            if (this.AbonIndex < 0) {
                this.AbonIndex = 0;
            }
        }

        let showDel = this.cbShowDel.checkbox("options").checked;

        this.dgAbonList.datagrid({url: this.GetUrl("/AbonList/listAbon"),
            queryParams: {
                showDel: showDel,
                snils: this.Filter.snils,
                surname: this.Filter.surname,
                name: this.Filter.name,
                oname: this.Filter.oname,
                priority: this.Filter.priority
            }
        });
    }


    /**
     * Кнопка выбора абонента
     */
    btnOk_onClick() {
        if(this.dgAbonList.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для добавления в группу.");
            return false;
        }

        let row = this.dgAbonList.datagrid("getSelected");//получаем выбранную запись
        if (row != null) {
            this.AbonIndex = this.dgAbonList.datagrid("getRowIndex", row);// получаем индекс выбранной записи
            if (this.AbonIndex < 0) {
                this.AbonIndex = 0;
                this.ShowWarning("Выберите абонента для добавления в группу.");
                return false;
            }//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0

            this.AbonId = row.id;
            this.ResultFunc(this.AbonId);
            this.wAbonListFormAbonList.window("close");
        }
    }



}


/**
 * Модально вызываю форму
 * @param StartParams
 * @param ResultFunc
 * @constructor
 */
export function StartModalModule(StartParams, ResultFunc) {
    let id = "wAbonListFormAbonList_Module_AbonList";
    CreateModalWindow(id, "Список абонентов");
    let form = new AbonList("wAbonListFormAbonList_Module_AbonList", "");
    form.SetResultFunc(ResultFunc);
    form.Start({AddMode: true}); //, StartParams.GroupId
}