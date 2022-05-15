import {AbonsFormEditAbon} from "./AbonsFormEditAbon.js";
import {AbonsFormEditGroup} from "./AbonsFormEditGroup.js";
import {AbonsFormFilter} from "./AbonsFormFilter.js";
import {AbonsFormImport} from "./AbonsFormImport.js";
import {AbonsFormService} from "./AbonsFormService.js";
import {StartModalModule as AbonListStartModalModule} from "../AbonList/AbonList.js";
import {StartModalModule as GrpListStartModalModule} from "../GrpList/GrpList.js";

class Abons extends FormView {

    /**
     * Конструктор
     * @param prefix - приставка для идентификаторов. Данная приставка добавится для каждого идентификатора
     * @param StartParams - стартовые параметры в формате JSON
     */
    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;

        this.AbonsRight = {};

        this.AbonIndex = 0;
        this.AbonId = -1; //Переменная для запоминанися последней добавленной

        this.GroupIndex = 0;
        this.GroupId = -1; //Переменная для запоминанися последней добавленной

        this.Filter = {};

        this.sLoc = new LibLockService(300000);//Создадим объект работы с блокировками
    }


    /**
     * Функция загрузки формы
     * @param id - идентификатор эелемента HTML, в который будет загружена разметка частичного представления
     * @constructor
     */
    Start(id) {
        this.AbonsRight.abonGroupsView = 'Не удалось получить право на просмотр \"Администратор абонентов\"';
        this.AbonsRight.abonChange = 'Не удалось получить право на изменение абонента \"Администратор абонентов\"';
        this.AbonsRight.abonDel = 'Не удалось получить право на удаление абонента \"Администратор абонентов\"';
        this.AbonsRight.groupChange = 'Не удалось получить право на изменение группы \"Администратор абонентов\"';
        this.AbonsRight.groupDel = 'Не удалось получить право на удаление группы \"Администратор абонентов\"';
        this.AbonsRight.abonGroupAdd = 'Не удалось получить право на включение абонента в группу \"Администратор абонентов\"';
        this.AbonsRight.abonGroupDel = 'Не удалось получить право на исключение абонента из группы \"Администратор абонентов\"';

        this.ModuleId = id;

        //Загружаем макет формы и выполняем функции InitFunc в случае успеха
        LoadForm("#" + this.ModuleId,
            this.GetUrl("/Abons/AbonsFormList?prefix=" + this.prefix),
            this.InitFunc.bind(this));
    }


    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    InitFunc() {
        this.InitComponents(this.ModuleId, this.prefix);

        AddKeyboardNavigationForGrid(this.dgAbons);
        LoaderCSRFDataForGrid(this.dgAbons);

        AddKeyboardNavigationForGrid(this.dgGroups);
        LoaderCSRFDataForGrid(this.dgGroups);

        this.dgAbons.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data);
            },
            onSelect: this.dgAbons_onSelect.bind(this),
            rowStyler: this.dgAbons_rowStyler.bind(this), //Обработка события перерисовки грида (подсветка удаленных записей)
            onLoadSuccess: this.dgAbons_onLoadSuccess.bind(this)
        });

        this.dgGroups.datagrid({
            loadFilter: this.LoadFilter.bind(this),
            onLoadError: (data) => {
                this.ShowErrorResponse(data);
            },
            onSelect: this.dgGroups_onSelect.bind(this),
            rowStyler: this.dgGroups_rowStyler.bind(this), //Обработка события перерисовки грида (подсветка удаленных записей)
            onLoadSuccess: this.dgGroups_onLoadSuccess.bind(this)
        });


        // Инициализация фильтра
        this.FilterInit();

        this.rbGroups.radiobutton({onChange: this.rbGroups_onChange.bind(this)});
        this.rbAbons.radiobutton({onChange: this.rbAbons_onChange.bind(this)});
        this.cbShowDel.checkbox({onChange: this.cbShowDel_onChange.bind(this)});


        this.btnAddGroup.linkbutton({onClick: this.btnAddGroup_onClick.bind(this)});
        this.btnChangeGroup.linkbutton({onClick: this.btnChangeGroup_onClick.bind(this)});
        this.btnDeleteGroup.linkbutton({onClick: this.btnDeleteGroup_onClick.bind(this)});
        this.btnUpdateGroup.linkbutton({onClick: this.btnUpdateGroup_onClick.bind(this)});


        this.btnAddAbon.linkbutton({onClick: this.btnAddAbon_onClick.bind(this)});
        this.btnChangeAbon.linkbutton({onClick: this.btnChangeAbon_onClick.bind(this)});
        this.btnDeleteAbon.linkbutton({onClick: this.btnDeleteAbon_onClick.bind(this)});
        this.btnUpdateAbon.linkbutton({onClick: this.btnUpdateAbon_onClick.bind(this)});
        this.btnFilterAbon.linkbutton({onClick: this.btnFilterAbon_onClick.bind(this)});
        this.btnImportAbon.linkbutton({onClick: this.btnImportAbon_onClick.bind(this)});
        this.btnServiceAbon.linkbutton({onClick: this.btnServiceAbon_onClick.bind(this)});


        this.LoadRights();
    }


    LoadRights() {
        $.ajax({
            method: "post",
            url: this.GetUrl('/Abons/GetActRights'),
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                this.AbonsRight.abonGroupsView = data.abonGroupsView;
                this.AbonsRight.abonChange = data.abonChange;
                this.AbonsRight.abonDel = data.abonDel;
                this.AbonsRight.groupChange = data.groupChange;
                this.AbonsRight.groupDel = data.groupDel;
                this.AbonsRight.abonGroupAdd = data.abonGroupAdd;
                this.AbonsRight.abonGroupDel = data.abonGroupDel;

                this.rbGroups_onChange();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }


    rbGroups_onChange() {
        if (this.rbGroups.radiobutton('options').checked) {
            this.rbAbons.radiobutton('uncheck');

            //this.btnChangeAbon.linkbutton('disable');
            this.btnChangeAbon.linkbutton('enable');
            this.btnServiceAbon.linkbutton('disable');
            this.btnImportAbon.linkbutton('disable');

            this.btnChangeGroup.linkbutton('enable');

            this.btnUpdateGroup_onClick();
        }
    }

    rbAbons_onChange() {
        if (this.rbAbons.radiobutton('options').checked) {
            this.rbGroups.radiobutton('uncheck');

            this.btnChangeAbon.linkbutton('enable');
            this.btnServiceAbon.linkbutton('enable');
            this.btnImportAbon.linkbutton('enable');

            //this.btnChangeGroup.linkbutton('disable');
            this.btnChangeGroup.linkbutton('enable');

            this.btnUpdateAbon_onClick();
        }
    }


    /**
     * Показывать удаленные записи
     */
    cbShowDel_onChange() {
        if (this.rbGroups.radiobutton('options').checked) {
            this.btnUpdateGroup_onClick();
        } else {
            this.btnUpdateAbon_onClick();
        }
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
     * Обновление спсика абонентов
     */
    btnUpdateAbon_onClick() {
        let row = this.dgAbons.datagrid("getSelected");

        if (row != null) {
            this.AbonIndex = this.dgAbons.datagrid("getRowIndex", row);
            if (this.AbonIndex < 0) {
                this.AbonIndex = 0;
            }
        }

        let showDel = this.cbShowDel.checkbox("options").checked;
        let showAbonsInGroup = this.rbGroups.radiobutton('options').checked;
        let groupId = "";
        if (showAbonsInGroup) { //выбран чекбокс "Абоненты в группе"

            let row = this.dgGroups.datagrid("getSelected");//получаем выбранную запись
            if (row != null) {
                let groupIndex = this.dgGroups.datagrid("getRowIndex", row);// получаем индекс выбранной записи
                if (groupIndex >= 0) {
                    groupId = row.id;
                }//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0
            }
        }

        this.dgAbons.datagrid({
            url: this.GetUrl("/Abons/listAbon"),
            queryParams: {
                showDel: showDel,
                snils: this.Filter.snils,
                surname: this.Filter.surname,
                name: this.Filter.name,
                oname: this.Filter.oname,
                priority: this.Filter.priority,
                showAbonsInGroup: showAbonsInGroup,
                groupId: groupId
            }
        });
    }

    /**
     * Обновление спсика групп
     */
    btnUpdateGroup_onClick() {
        let row = this.dgGroups.datagrid("getSelected");

        if (row != null) {
            this.GroupIndex = this.dgGroups.datagrid("getRowIndex", row);
            if (this.GroupIndex < 0) {
                this.GroupIndex = 0;
            }
        }

        let showDel = this.cbShowDel.checkbox("options").checked;
        let showGroupsAbon = this.rbAbons.radiobutton("options").checked;
        let abonId = "";
        if (showGroupsAbon) { //выбраны Абоненты (отображать Группы абонента)
            let row = this.dgAbons.datagrid("getSelected");//получаем выбранную запись
            if (row != null) {
                let аbonIndex = this.dgAbons.datagrid("getRowIndex", row);// получаем индекс выбранной записи
                if (аbonIndex >= 0) {
                    abonId = row.id;
                }//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0
            }
        }

        this.dgGroups.datagrid({
            url: this.GetUrl("/Abons/listGroup"),
            queryParams: {showDel: showDel, showGroupsAbon: showGroupsAbon, abonId: abonId}
        });
    }


    /**
     * Обработка окончания загрузки списка абонентов
     * @param data - информация о загруженных данных
     */
    dgAbons_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.AbonId != -1) {
                this.dgAbons.datagrid("selectRecord", this.AbonId);
            } else {//иначе устанавливаем курсор согласно сохранённому положению курсору
                if (this.AbonIndex >= 0 && this.AbonIndex < data.total) {
                    this.dgAbons.datagrid("selectRow", this.AbonIndex);
                } else if (data.total > 0) {
                    this.dgAbons.datagrid("selectRow", data.total - 1);
                }
            }
            //возвращаем значения по умолчанию
            this.AbonId = -1;
            this.AbonIndex = 0;
        } else if (this.rbAbons.radiobutton('options').checked) {
            this.btnUpdateGroup_onClick();
        }
    }


    /**
     * Обработка окончания загрузки списка абонентов
     * @param data - информация о загруженных данных
     */
    dgGroups_onLoadSuccess(data) {
        if (data.total > 0) {
            if (this.GroupId != -1) {
                this.dgGroups.datagrid("selectRecord", this.GroupId);
            } else {//иначе устанавливаем курсор согласно сохранённому положению курсору
                if (this.GroupIndex >= 0 && this.GroupIndex < data.total) {
                    this.dgGroups.datagrid("selectRow", this.GroupIndex);
                } else if (data.total > 0) {
                    this.dgGroups.datagrid("selectRow", data.total - 1);
                }
            }
            //возвращаем значения по умолчанию
            this.GroupId = -1;
            this.GroupIndex = 0;
        } else if (this.rbGroups.radiobutton('options').checked) {
            this.btnUpdateAbon_onClick();
        }
    }


    /**
     /* Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgAbons_rowStyler(index, row) {
        if (row.del == 1) {
            return "background:grey;color:red;"; //Красим в серый цвет (delete)
        }
    }


    /**
     /* Обработка события перерисовки грида (подсветка удалённых записей)
     * @param index - позиция записи
     * @param row - запись
     */
    dgGroups_rowStyler(index, row) {
        if (row.del == 1) {
            return "background:grey;color:red;"; //Красим в серый цвет (delete)
        }
    }


    /**
     * Выделение строки группы абонентов
     * @param index
     * @param row
     */
    dgAbons_onSelect(index, row) {
        if (this.rbAbons.radiobutton('options').checked) {
            this.btnUpdateGroup_onClick();
        }

        this.btnDeleteAbonChangeText();
    }

    /**
     * Изменение текста на кнопке "Удалить" для действий
     */
    btnDeleteAbonChangeText() {
        this.btnDeleteAbon.linkbutton({iconCls: "icon-remove", text: "Удалить"});
        if (this.dgAbons.datagrid("getRows").length != 0) {
            let selData = this.dgAbons.datagrid("getSelected");
            if (selData != null) {
                if (selData.del == 1) {
                    this.btnDeleteAbon.linkbutton({iconCls: "icon-undo", text: "Вернуть"});
                }
            }
        }
    }


    /**
     * Выделение строки группы абонентов
     * @param index
     * @param row
     */
    dgGroups_onSelect(index, row) {
        if (this.rbGroups.radiobutton('options').checked) {
            if (this.dgAbons.datagrid("getRows").length > 0) { //при обновлении запоминается индекс
                this.dgAbons.datagrid("selectRow", 0);
            }
            this.btnUpdateAbon_onClick();
        }

        this.btnDeleteGgroupChangeText();
    }


    /**
     * Изменение текста на кнопке "Удалить" для действий
     */
    btnDeleteGgroupChangeText() {
        this.btnDeleteGroup.linkbutton({iconCls: "icon-remove", text: "Удалить"});
        if (this.dgGroups.datagrid("getRows").length != 0) {
            let selData = this.dgGroups.datagrid("getSelected");
            if (selData != null) {
                if (selData.del == 1) {
                    this.btnDeleteGroup.linkbutton({iconCls: "icon-undo", text: "Вернуть"});
                }
            }
        }
    }


    /**
     * Фильтр по абонентам
     */
    btnFilterAbon_onClick() {

        let form = new AbonsFormFilter();
        form.SetResultFunc((RecId) => {
            this.AbonId = RecId;
            this.btnUpdateAbon_onClick();
        }); //Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show(this.Filter);
    }


    /**
     * Добавление нового абонента
     */
    btnAddAbon_onClick() {
        if (this.rbAbons.radiobutton('options').checked) { //Добавляем нового абонента
            let form = new AbonsFormEditAbon();
            form.SetResultFunc((RecId) => {
                this.AbonId = RecId;
                this.btnUpdateAbon_onClick();
            }); //Передача функции, которая будет вызвана по нажатию на кнопку ОК
            form.Show({AddMode: true});
        } else if (this.rbGroups.radiobutton('options').checked) { //Добавляем абонента в группу
            if (!this.getGroupId()) {
                return;
            }

            try {
                AbonListStartModalModule("", async (RecId) => {
                    this.AbonId = RecId;
                    let data = await this.addAbonToGroup(this.AbonId, this.GroupId);
                    if (data.length > 0) { //в группе уже есть этот абонент
                        this.ShowWarning(data);
                        return;
                    }

                    this.btnUpdateGroup_onClick();
                });

            } catch (e) {
                this.ShowErrorResponse(e);
            }
        }
    }

    /**
     * Получить ид группы
     * @returns {boolean}
     */
    getGroupId() {
        if (this.dgGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Добавьте группу.");
            return false;
        }

        let row = this.dgGroups.datagrid("getSelected");//получаем выбранную запись
        if (row != null) {
            this.GroupIndex = this.dgGroups.datagrid("getRowIndex", row);// получаем индекс выбранной записи
            if (this.GroupIndex < 0) {
                this.GroupIndex = 0;
                this.ShowWarning("Выберите группу в которую будет добавлен абонент.");
                return false;
            }//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0

            this.GroupId = row.id;
            return true;
        }

        return false;
    }


    /**
     * Получить ид абонента
     * @returns {boolean}
     */
    getAbonId() {
        if (this.dgAbons.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей в таблице абонентов.");
            return false;
        }

        let row = this.dgAbons.datagrid("getSelected");//получаем выбранную запись
        if (row != null) {
            this.AbonIndex = this.dgAbons.datagrid("getRowIndex", row);// получаем индекс выбранной записи
            if (this.AbonIndex < 0) {
                this.AbonIndex = 0;
                this.ShowWarning("Выберите абонента.");
                return false;
            }//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0

            this.AbonId = row.id;
            return true;
        }

        return false;
    }


    /**
     * Получить имя группы
     * @param del
     * @returns {boolean}
     */
    getGroupName(del) {
        if (this.rbGroups.radiobutton('options').checked) {
            if (this.dgGroups.datagrid("getRows").length == 0) {
                return "";
            }

            let row = this.dgGroups.datagrid("getSelected");//получаем выбранную запись
            if (row != null) {
                let groupIndex = this.dgGroups.datagrid("getRowIndex", row);// получаем индекс выбранной записи
                if (groupIndex < 0) {
                    return "";
                }//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0

                let nameGroup = "";
                if (del == 0) {
                    nameGroup = " из группы " + row.name;
                } else {
                    nameGroup = " в группу " + row.name;
                }

                return nameGroup;
            }

            return "";
        }

        return "";
    }


    /**
     * Получить имя абонента
     * @param del
     * @returns {boolean}
     */
    getAbonName(del) {
        if (this.dgAbons.datagrid("getRows").length == 0) {
            return "";
        }

        let row = this.dgAbons.datagrid("getSelected");//получаем выбранную запись
        if (row != null) {
            let abonIndex = this.dgAbons.datagrid("getRowIndex", row);// получаем индекс выбранной записи
            if (abonIndex < 0) {
                return "";
            }//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0

            let nameAbon = "";
            if (del == 0) {
                //абонента " + (del==0? "из группы ":"в группу ") +"с кодом " + selData.code + "?",
                nameAbon = "c СНИЛС " + row.snils + " из группы ";
            } else {
                nameAbon = "c СНИЛС " + row.snils + " в группу ";
            }

            return nameAbon;
        }


        return "";
    }


    /**
     * Добавление новой группы
     */
    btnAddGroup_onClick() {
        if (this.rbGroups.radiobutton('options').checked) {
            let form = new AbonsFormEditGroup();
            form.SetResultFunc((RecId) => {
                this.GroupId = RecId;
                this.btnUpdateGroup_onClick();
            }); //Передача функции, которая будет вызвана по нажатию на кнопку ОК
            form.Show({AddMode: true});
        } else if (this.rbAbons.radiobutton('options').checked) {
            if (!this.getAbonId()) {
                return;
            }

            try {
                GrpListStartModalModule("", async (RecId) => {
                    this.GroupId = RecId;
                    let data = await this.addAbonToGroup(this.AbonId, this.GroupId);
                    if (data.length > 0) { //в группе уже есть этот абонент
                        this.ShowWarning(data);
                        return;
                    }

                    this.btnUpdateGroup_onClick();
                });
            } catch (e) {
                this.ShowErrorResponse(e)
            }
        }
    }


    /**
     * Добавление абонента в группу
     * @param abonId
     * @param groupId
     */
    addAbonToGroup(abonId, groupId) {
        return $.ajax({
            method: "post",
            data: {abonId: abonId, groupId: groupId},
            url: this.GetUrl('/Abons/addAbonToGroup'),
            headers: GetCSRFTokenHeader()
        });
    }


    /**
     * Редактирование группы
     */
    btnChangeGroup_onClick() {

        //if (this.rbGroups.radiobutton('options').checked) {

            if (this.dgGroups.datagrid("getRows").length == 0) {
                this.ShowWarning("Нет записей для изменения.");
                return false;
            }
            let selData = this.dgGroups.datagrid("getSelected");
            if (selData == null) {
                this.ShowWarning("Выберите запись для изменения");
                return false;
            }

            let editMode = true;//Keys.isKeyDown(Keys.VK_Z) || Keys.isKeyDown(Keys.VK_OEM_PERIOD); //проверка нажатия на кнопки Z и . если одна из них нажата, то запись нужно попытаться открыть на редактирование
            if (editMode) {
                this.sLoc.LockRecord("grps", -1, selData.id, this.btnContinueChangeGroup_onClick.bind(this));
            }
            //// else {
            ////     this.btnContinueChangeGroup_onClick({id: selData.id, AddMode:false, editMode: editMode, lockMessage:'', lockState: false});
            //// }
        //}
    }


    /**
     * Редактирование группы (продолжение)
     * @param options
     */
    btnContinueChangeGroup_onClick(options) {
        if (options.lockMessage.length != 0) {
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        } else {
            if (options.editMode) {
                options.lockState = true
            }
        }

        let form = new AbonsFormEditGroup();
        form.SetResultFunc((RecId) => {
            this.GroupId = RecId;
            this.btnUpdateGroup_onClick();
        }); //Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.SetCloseWindowFunction((options) => {
            if (options != null) {
                if (options.lockState) {
                    this.sLoc.FreeLockRecord("grps", -1, options.uuid);
                }
            }
        });

        form.Show(options);
    }


    /**
     * Редактирование абонента
     */
    btnChangeAbon_onClick() {

        //if (this.rbAbons.radiobutton('options').checked) {

            if (this.dgAbons.datagrid("getRows").length == 0) {
                this.ShowWarning("Нет записей для изменения.");
                return;
            }
            let row = this.dgAbons.datagrid("getSelected");
            if (row == null) {
                this.ShowWarning("Выберите запись для изменения.");
                return;
            }

            let аbonIndex = this.dgAbons.datagrid("getRowIndex", row);
            if (аbonIndex < 0) {
                this.ShowWarning("Выберите запись для изменения.");
                return;
            }//даже если нет выбранной записи getSelected может вернуть запись, но getRowIndex отработает корректно и вернёт -1 поэтому заместо -1 запоминаем 0

            if (row.del == 1) {
                this.ShowWarning("Сначала восстановите запись для редактирования");
                return;
            }

            if (this.AbonsRight.abonChange.length === 0) {
                this.sLoc.LockRecord("abons", -1, row.id, this.btnContinueChangeAbon_onClick.bind(this));
            } else {
                this.btnContinueChangeAbon_onClick.bind({uuid: row.id, lockMessage: this.AbonsRight.abonChange});
            }
       //}
    }


    /**
     * Редактирование абонента (продолжение)
     * @param options
     */
    btnContinueChangeAbon_onClick(options) {
        if (options.lockMessage.length !== 0) {
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        } else {
            if (options.editMode) {
                options.lockState = true
            }
        }

        let form = new AbonsFormEditAbon();
        form.SetResultFunc((RecId) => {
            this.AbonId = RecId;
            this.btnUpdateAbon_onClick();
        }); //Передача функции, которая будет вызвана по нажатию на кнопку ОК

        form.SetCloseWindowFunction((options) => {
            if (options != null) {
                if (options.lockState) {
                    this.sLoc.FreeLockRecord("abons", -1, options.uuid);
                }
            }
        });

        form.Show(options);
    }


    /**
     * Удаление записи абонента
     */
    btnDeleteAbon_onClick() {
        if (this.dgAbons.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления.");
            return false;
        }
        let selData = this.dgAbons.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if (del == 1) {
            header = "Восстановление";
            action = "восстановить";
        }

        $.messager.confirm(header, "Вы действительно хотите " + action + " выделенного абонента с СНИЛС " + selData.snils + this.getGroupName(del) + "?",
            function (result) {
                if (result) {
                    this.sLoc.StateLockRecord("abons", -1, selData.id, this.btnContinueDeleteAbon_onClick.bind(this));
                }
            }.bind(this));
    }


    /**
     * Продолжение процесса удаления абонента
     * @param options
     */
    btnContinueDeleteAbon_onClick(options) {
        if (options.data.length > 0) {
            this.ShowWarning(options.data);
        } else {
            if (this.rbGroups.radiobutton('options').checked) { //удаление абонента из группы
                this.deleteAbonFromGroup();
            } else if (this.rbAbons.radiobutton('options').checked) { //удаление абонента
                $.ajax({
                    method: "post",
                    data: {id: options.uuid},
                    url: this.GetUrl('/Abons/deleteAbon'),
                    headers: GetCSRFTokenHeader(),
                    success: function (data) {
                        if (data.length) {
                            this.ShowWarning(data);
                        } else {
                            this.btnUpdateAbon_onClick();
                        }
                    }.bind(this),
                    error: function (data) {
                        this.ShowErrorResponse(data);
                    }.bind(this)
                });
            }

        }
    }


    /**
     *
     */
    deleteAbonFromGroup() {
        if (!this.getGroupId()) {
            return;
        }
        if (!this.getAbonId()) {
            return;
        }

        $.ajax({
            method: "post",
            data: {abonId: this.AbonId, groupId: this.GroupId},
            url: this.GetUrl('/Abons/deleteAbonFromGroup'),
            headers: GetCSRFTokenHeader(),
            success: function (data) {
                this.btnUpdateAbon_onClick();
            }.bind(this),
            error: function (data) {
                this.ShowErrorResponse(data);
            }.bind(this)
        });
    }


    /**
     * Удаление записи группа
     */
    btnDeleteGroup_onClick() {

        if (this.dgGroups.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления");
            return false;
        }
        let selData = this.dgGroups.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись для удаления");
            return false;
        }
        let del = selData.del;
        let header = "Удаление"
        let action = "удалить"
        if (del == 1) {
            header = "Восстановление";
            action = "восстановить";
        }

        if (this.rbGroups.radiobutton('options').checked) {
            $.messager.confirm(header, "Вы действительно хотите " + action + " выделенную группу с кодом " + selData.code + "?",
                function (result) {
                    if (result) {
                        this.sLoc.StateLockRecord("grps", -1, selData.id, this.btnContinueDeleteGroup_onClick.bind(this));
                    }
                }.bind(this));
        } else if (this.rbAbons.radiobutton('options').checked) {
            $.messager.confirm(header, "Вы действительно хотите " + action + " абонента " + this.getAbonName(del) + " с кодом " + selData.code + "?",
                function (result) {
                    if (result) {
                        this.sLoc.StateLockRecord("grps", -1, selData.id, this.btnContinueDeleteGroup_onClick.bind(this));
                    }
                }.bind(this));
        }


    }


    /**
     * Продолжение процесса удаления группы
     * @param options
     */
    btnContinueDeleteGroup_onClick(options) {
        if (options.data.length > 0) {
            this.ShowWarning(options.data);
        } else {
            if (this.rbAbons.radiobutton('options').checked) {
                this.deleteAbonFromGroup();
            } else if (this.rbGroups.radiobutton('options').checked) {
                $.ajax({
                    method: "post",
                    data: {id: options.uuid},
                    url: this.GetUrl('/Abons/deleteGroup'),
                    headers: GetCSRFTokenHeader(),
                    success: function (data) {
                        if (data.length) {
                            this.ShowWarning(data);
                        } else {
                            this.btnUpdateGroup_onClick();
                        }
                    }.bind(this),
                    error: function (data) {
                        this.ShowErrorResponse(data);
                    }.bind(this)
                });
            }
        }
    }

    /**
     * Вызов формы Импорт абонентов
     */
    btnImportAbon_onClick() {
        let options = {lockMessage: this.AbonsRight.abonChange};

        if (options.lockMessage.length !== 0) {
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        } else {
            options.editMode = true;
        }

        let form = new AbonsFormImport();
        form.SetResultFunc(() => {
            this.btnUpdateAbon_onClick();
        }); //Передача функции, которая будет вызвана по нажатию на кнопку ОК
        form.Show(options);
    }



    btnServiceAbon_onClick(){
        let options = {lockMessage: this.AbonsRight.abonChange};

        if (options.lockMessage.length !== 0) {
            this.ShowSlide("Предупреждение", options.lockMessage)
            options.editMode = false;
        } else {
            options.editMode = true;
        }

        let form = new AbonsFormService();
        form.Show(options);
    }



}


/**
 * Функция встраиваемого запуска модуля
 * @param Id идентификатор
 * @constructor
 */
export function StartNestedModule(Id) {
    let form = new Abons("nested_", "");
    form.Start(Id);
}