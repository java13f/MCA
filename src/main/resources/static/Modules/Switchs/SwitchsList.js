import {SwitchsFormEdit} from "../Switchs/SwitchsFormEdit.js";


export class SwitchsList extends FormView {
    constructor(prefix, StartParams) {
        super();
        this.prefix = prefix;
        this.StartParams = StartParams;
        this.sLoc = new LibLockService(300000);//Создадим объект работы с блокировками
    }
    
    Start(id) {
        this.ModuleId = id;
        LoadForm("#" + this.ModuleId,
                     this.GetUrl("/Switchs/Switchs?prefix="+this.prefix),
                     this.InitFunc.bind(this)
        );
    }
    /**
     * Функция инициализации пользовательского интерфейса
     * @constructor
     */
    async InitFunc() {
        try {
            this.InitComponents(this.ModuleId, this.prefix);
            this.dgSwitchs.id = -1;//Для последней добавленной/измененной записи
            this.dgSwitchs.index = 0;//Позиция курсора. Применяеться для восстановления позиции курсора при обновлении записи
            this.initDataGrid(
                                    this.dgSwitchs,
                                    null,
                                    {}
                            );

            this.btnChange.linkbutton({onClick: this.btnChange_onClick.bind(this)});
            this.btnUpdate.linkbutton({onClick: this.btnUpdate_onClick.bind(this)});

            this.cbShowDel.checkbox({onChange: this.btnUpdate_onClick.bind(this)});
            this.btnUpdate_onClick();

            if(this.prefix == "modal_"){
                $('#heading_Module_Switchs').text("Выбор коммутации");
                this.pOkCancel.css("visibility", "visible");
                this.wSwitchs = $("#" + this.ModuleId);
                this.InitCloseEvents(this.wSwitchs, false);
                this.btnCancel.linkbutton({ onClick: function () {  this.wSwitchs.window("close") }.bind(this)  });
                this.btnOk.linkbutton({ onClick: this.btnOk_onClick.bind(this) });
            }
        }
        catch(e){ this.ShowErrorResponse(e); }
    }
    /**Функция для тестирования в модальном режиме**/
    /*btnUpdate_onClick1(){
        StartModalModulGlobal("Switchs",
            {},
            ((data)=>{alert(data.id);}).bind(this));
    }*/

    /**
     * Обновить грид
     */
    btnUpdate_onClick(){
        let row = this.dgSwitchs.datagrid("getSelected");//получаем выбранную запись
        if(row!=null) {
            this.dgSwitchs.index = this.dgSwitchs.datagrid("getRowIndex", row);
            if(this.dgSwitchs.index<0)this.dgSwitchs.index = 0;
        }
        let showDel = this.cbShowDel.checkbox("options").checked?"true":"false";
        this.dgSwitchs.datagrid({url: this.GetUrl("/Switchs/list"), queryParams: {showDel:showDel}});//Загружаем список кодов территорий
    }

    btnOk_onClick(){
        if (this.dgSwitchs.datagrid("getRows").length == 0) {
            this.ShowWarning("Нет записей для выбора");
            return false;
        }
        let selData = this.dgSwitchs.datagrid("getSelected");
        if (selData == null) {
            this.ShowWarning("Выберите запись");
            return false;
        }
        if (this.ResultFunc != null) {
            this.ResultFunc({id: selData.id.toString()});
        }
        this.wSwitchs.window("close");
        return false;
    }

    btnChange_onClick(){
        let selData = this.dgSwitchs.datagrid("getSelected");
        let options = {};
            options.id = selData.id;
        this.sLoc.LockRecord("Switchs", -1,
            selData.id,
           this.btnContinueChange_onClick.bind(this)
        );
    }

    btnContinueChange_onClick(options) {
        if (options.lockMessage.length != 0) {
            this.ShowSlide("Предупреждение", options.lockMessage);
            options.editMode = false;
        } else if (options.editMode) options.lockState = true;
        let form = new SwitchsFormEdit();
        form.SetResultFunc((RecId) => {
            this.dgSwitchs.id = RecId;
            this.btnUpdate_onClick();
        });
        form.SetCloseWindowFunction((options) => {
            if (options != null) {
                if (options.lockState) {
                   this.sLoc.FreeLockRecord("switchs",-1, options.uuid);
                }
            }
        });
        form.Show(options);
    }
}