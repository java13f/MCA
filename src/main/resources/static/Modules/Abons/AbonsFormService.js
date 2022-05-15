import {AbonsFormServiceAddAbon} from "./AbonsFormServiceAddAbon.js";

export class AbonsFormService extends FormView {
    constructor() {
        super();
        this.options = {AddMode: true};

        this.selectGroupId = "";
        this.listAbon = [];

        this.AbonIndex = 0;
    }

    /**
     * Показать форму фильтр
     * @param options
     * @constructor
     */
    Show(options) {
        this.options = options; //JSON - объект с параметрами
        LoadForm("#ModalWindows", this.GetUrl("/Abons/AbonsFormService"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    async InitFunc() {
        this.InitComponents("wAbonsFormService_Module_Abons", ""); //Автоматическое получение идентификаторов формы
        this.InitCloseEvents(this.wAbonsFormService);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"

        AddKeyboardNavigationForGrid(this.dgPhoneAbons);
        LoaderCSRFDataForGrid(this.dgPhoneAbons);


        this.dgPhoneAbons.datagrid({
            onLoadError: (data) => {
                this.ShowErrorResponse(data);
            },
            onLoadSuccess: this.dgPhoneAbons_onLoadSuccess.bind(this)
        });

        this.dgPhoneAbons.datagrid('getColumnOption', 'is_has_dtmf').formatter = ((val, row) => {
            return val === 1 ? 'да' : 'нет';
        }).bind(this);

        $('#dgPhoneAbons_Module_Abons_AbonsFormService').datagrid('disableFilter');


        if ($('#LinkAbonsFormService_Module_Abons').length === 0) {
            $('head').append('<link id="LinkAbonsFormService_Module_Abons" rel="stylesheet" type="text/css" href="../css/imgs/abons/abons.css"/>');
        }

        this.btnAdd.linkbutton({onClick: this.btnAdd_onClick.bind(this)});
        this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
        this.btnDelete.linkbutton({onClick: this.btnDelete_onClick.bind(this)});
        this.btnClear.linkbutton({onClick: this.btnClear_onClick.bind(this)});
        this.btnAddAllGroup.linkbutton({onClick: this.btnAddAllGroup_onClick.bind(this)});
        this.btnInstall.linkbutton({onClick: this.btnInstall_onClick.bind(this)});
        this.btnClose.linkbutton({onClick: this.btnClose_onClick.bind(this)});

        if (this.options.editMode) { //есть права
            this.btnAdd.linkbutton({disabled: false});
            this.btnChange.linkbutton({disabled: false});
            this.btnDelete.linkbutton({disabled: false});
            this.btnInstall.linkbutton({disabled: false});
            this.btnClear.linkbutton({disabled: false});
        }


        let grps = [];
        try {
            grps = await this.getGroups();
        } catch (e) {
            this.ShowErrorResponse(e)
        }


        this.cbGroups.combobox({
            valueField: 'id',
            textField: 'name',
            data: grps
        });

        this.cbGroups.combobox({onSelect: this.cbGroups_onSelect.bind(this)});
    }


    /**
     * Получить список групп
     * @returns
     */
    async getGroups() {
        return $.ajax({
            method: "post",
            url: this.GetUrl('/AbonsService/getGroups'),
            headers: GetCSRFTokenHeader()
        });
    }


    cbGroups_onSelect(record) {
        this.selectGroupId = record.id;
    }


    /**
     * Добавить всю группу
     */
    async btnAddAllGroup_onClick() {
        if (this.selectGroupId.trim().length == 0) {
            return;
        }

        try {
            let listAbonInGroup = await this.s_postCTRF('/AbonsService/getListAbonInGroup', {result: this.selectGroupId});

            if (listAbonInGroup.length == 0) {
                return;
            }

            //Проверка есть ли абоненты уже в списке
            if (this.listAbon.length > 0) {

                for (let i = 0; i < listAbonInGroup.length; i++) {
                    let someAbon = this.listAbon.filter(item => item.abonid == listAbonInGroup[i].abonid && item.pinid == listAbonInGroup[i].pinid);
                    if (someAbon.length > 0) {
                        continue;
                    }

                    this.listAbon.push(listAbonInGroup[i]);
                }
            } else {
                this.listAbon = this.listAbon.concat(listAbonInGroup);
            }

            this.update();
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }


    /**
     * Добавление абонента для изменения флага dtmf
     */
    btnAdd_onClick() {
        let form = new AbonsFormServiceAddAbon();

        form.SetResultFunc(() => {

            this.update();
        }); //Передача функции, которая будет вызвана по нажатию на кнопку ОК

        form.Show({AddMode: true}, this.listAbon);
    }


    btnChange_onClick(){
        if (this.dgPhoneAbons.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для изменения.");
            return false;
        }

        let row = this.dgPhoneAbons.datagrid('getSelected');

        if (row == null) {
            this.ShowWarning("Выберите запись для изменения.");
            return false;
        }


        let form = new AbonsFormServiceAddAbon();

        form.SetResultFunc(() => {
            this.AbonIndex = this.listAbon.indexOf(row);
            this.dgPhoneAbons.datagrid({data: this.listAbon});
            this.lblCountRec.html(this.listAbon.length);
        }); //Передача функции, которая будет вызвана по нажатию на кнопку ОК

        form.Show({editMode: true }, this.listAbon, row);
    }


    /**
     * Удаление абонента из списка для изменения флага dtmf
     */
    btnDelete_onClick() {
        if (this.dgPhoneAbons.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для удаления.");
            return false;
        }

        let row = this.dgPhoneAbons.datagrid('getSelected');

        if (row == null) {
            this.ShowWarning("Выберите запись для удаления.");
            return false;
        }


        $.messager.confirm("Удаление", "Вы действительно хотите удалить абонента: " + row.abon + " с контактом: " + row.phone + " из списка для изменения тонового набора?",
            function (result) {
                if (result) {
                    //arr.indexOf(item, from) ищет item, начиная с индекса from, и возвращает индекс, на котором был найден искомый элемент, в противном случае -1.
                    //arr.splice(1, 1); // начиная с позиции 1, удалить 1 элемент
                    let index = this.listAbon.indexOf(row);
                    this.AbonIndex = index;
                    this.listAbon.splice(index, 1);

                    this.dgPhoneAbons.datagrid({data: this.listAbon});
                    this.lblCountRec.html(this.listAbon.length);
                }
            }.bind(this)
        );
    }


    btnClear_onClick(){
        this.listAbon = [];
        this.cbGroups.combobox('setValue', '');
        this.dgPhoneAbons.datagrid({data: this.listAbon});
        this.lblCountRec.html(this.listAbon.length);
    }


    /**
     * Установить списку флаг dtmf
     */
    btnInstall_onClick() {
        if (this.dgPhoneAbons.datagrid("getRows").length == 0 || this.listAbon.length == 0) {
            this.ShowWarning("Нет записей.");
            return false;
        }

        let is_has_dtmf = this.cbTone.checkbox('options').checked;

        let action = is_has_dtmf ? "установить" : "снять";
        $.messager.confirm("Внимание", "Вы действительно хотите выбраным абонентам " + action + " флаг 'Тоновый набор'?",
            function (result) {
                if (result) {
                    this.installDtmf(is_has_dtmf);
                }
            }.bind(this));
    }


    async installDtmf(is_has_dtmf) {
        try {
            let result = await this.s_postCTRF('/AbonsService/installDtmf', {
                abons: this.listAbon,
                is_has_dtmf: is_has_dtmf
            });

            if (result.length > 0) {
                this.ShowError(result);
                return;
            }

            this.ShowInformation("Установки выполнены.")
            this.btnClose_onClick();
        } catch (e) {
            this.ShowErrorResponse(e);
        }
    }


    btnClose_onClick() {
        this.wAbonsFormService.window("close");
    }


    /**
     * Обработка окончания загрузки списка абонентов
     * @param data - информация о загруженных данных
     */
    dgPhoneAbons_onLoadSuccess(data) {
        if (data.total > 0) {
            //иначе устанавливаем курсор согласно сохранённому положению курсору
            if (this.AbonIndex >= 0 && this.AbonIndex < data.total) {
                this.dgPhoneAbons.datagrid("selectRow", this.AbonIndex);
            } else if (data.total > 0) {
                this.dgPhoneAbons.datagrid("selectRow", data.total - 1);
            }

            //возвращаем значения по умолчанию
            this.AbonIndex = 0;
        }
    }


    update() {
        this.AbonIndex = this.listAbon.length - 1;
        this.dgPhoneAbons.datagrid({data: this.listAbon});
        this.lblCountRec.html(this.listAbon.length);
    }


}