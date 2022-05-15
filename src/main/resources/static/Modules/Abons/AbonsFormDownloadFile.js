export class AbonsFormDownloadFile extends FormView {
    constructor() {
        super();
        this.listAbon = [];
        this.paramsImport = {};
    }

    /**
     * Показать форму фильтр
     * @param options
     * @constructor
     */
    Show(listAbon, paramsImport) {
        this.listAbon = listAbon;
        this.paramsImport = paramsImport;
        LoadForm("#ModalWindows", this.GetUrl("/Abons/AbonsFormDownloadFile"), this.InitFunc.bind(this));
    }


    /**
     * Инциализация интерфейса пользователя
     * @constructor
     */
    InitFunc() {
        this.InitComponents("wAbonsFormDownloadFile_Module_Abons", ""); //Автоматическое получение идентификаторов формы

        if($('#LinkAbonsFormDownloadFile_Module_Abons').length === 0) {
            $('head').append('<link id="LinkAbonsFormDownloadFile_Module_Abons" rel="stylesheet" type="text/css" href="../css/imgs/abons/abons.css"/>');
        }

        this.InitCloseEvents(this.wAbonsFormDownloadFile);//Инициализация закрытия формы по нажатию на клавиши "ESC" и "Enter"
        this.btnClose.linkbutton({onClick: this.btnClose_onClick.bind(this)});

        // this.pbDownload.progressbar('getColumnOption', 'is_has_dtmf').formatter = ((val, row)=> {
        //     return val === 1 ? 'да' : 'нет';
        // }).bind(this);

        this.saveAbon();
    }


    btnClose_onClick() {
        this.wAbonsFormDownloadFile.window("close");
    }



    async saveAbon() {
        try {
            let result = ""; //результат по текущему абоненту
            let fullResult = ""; //результат по всем абонентам
            let step =  Math.floor(100 / this.listAbon.length);

            for (let i = 0; i < this.listAbon.length; i++) {

                this.pbDownload.progressbar('setValue',  (i + 1) * step);
                result = await this.s_postCTRF('/AbonsImport/saveAbon', {
                    abon: this.listAbon[i],
                    paramsImport: this.paramsImport
                });
                fullResult += result;

                $('#regionProtocol_Module_Abons_AbonsFormDownloadFile').append(result);
                //this.txProtocol.textbox('setText', result);
            }
            this.pbDownload.progressbar('setValue',  100);
            this.countErors(fullResult);
            this.ResultFunc(true);
        } catch (e) {
            this.pbDownload.progressbar('setValue', 0);
            this.ShowErrorResponse(e);
        } finally {
            this.btnClose.linkbutton('enable');
        }
    }

    /**
     * Количество ошибок
     * @param str
     */
    countErors(str){
        let indexError = -1;
        let curIndex = 0;
        let arrErrors = [];

        while(true){
            indexError = str.indexOf('ОШИБКА', curIndex);

            if(indexError !== -1){
                curIndex = indexError+6;
                arrErrors.push(indexError);
                indexError = -1;
                continue;
            }
            break;
        }

        if(arrErrors.length > 0){
            this.ShowWarning("В процессе импорта возникли ошибки: " + arrErrors.length);
        }
    }





}