class LibLockService{
    constructor(Interval) {
        this.LastTable = "";
        this.LastRecId = "";
        this.LastRecUUID = ""
        this.Interval = Interval;
        this.TimerId = -1;
    }
    GetUrl(url){
        return contextPath + url;
    }
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
    ShowError(text) {
        $.messager.alert("Ошибка", text, "error");
    }
    StateLockRecord(Table, Id, UUID, success_func){
        if(UUID.length == 0){
            $.ajax({
                method:"get",
                url: this.GetUrl("/LockService/StateLockRecord?table=" + Table + "&recId=" + Id),
                success:(data)=>{success_func({id:Id, uuid:UUID, data:data});},
                error: (data)=>{this.ShowErrorResponse(data);}
            });
        }
        else {
            $.ajax({
                method:"get",
                url: this.GetUrl("/LockService/StateLockRecord?table=" + Table + "&recId=-1&uuid=" + UUID),
                success:(data)=>{success_func({id:Id, uuid:UUID, data:data});},
                error: (data)=>{this.ShowErrorResponse(data);}
            });
        }
    }
    /**
     * Пытается заблокировать запись Id, по результату заполняет объект Options
     * @param Table
     * @param Id
     * @param Options
     * @constructor
     */
    LockRecord(Table, Id, UUID, success_func){
        var options={id: Id, uuid:UUID, AddMode: false, editMode: true, lockMessage:'', lockState: false};

        let json = JSON.stringify({'table': Table, 'recId': Id, 'uuid':UUID});
        this.LastTable = Table;
        this.LastRecId = Id;
        this.LastRecUUID = UUID;
        $.ajax({
            method:"post",
            data: json,
            url: this.GetUrl("/LockService/LockRecord"),
            contentType: "application/json; charset=utf-8",
            headers:GetCSRFTokenHeader(),
            success:((data)=>{
                options.lockMessage = data;
                if(options.lockMessage.length == 0){
                    this.TimerId = setInterval((() => {this.UpdateLock();}).bind(this), this.Interval);
                }
                success_func(options);
            }).bind(this),
            error: (data)=>{this.ShowErrorResponse(data);}
        });
    }
    UpdateLock(){
        let json = JSON.stringify({'table': this.LastTable, 'recId': this.LastRecId, 'uuid': this.LastRecUUID});
        $.ajax({
            method:"post",
            data: json,
            url: this.GetUrl("/LockService/UpdateLock"),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success:((data)=>{}).bind(this),
            error: (data)=>{}
        });
    }
    FreeLockRecord(Table, Id, UUID){
        clearInterval(this.TimerId);
        let json = JSON.stringify({'table': this.LastTable, 'recId': this.LastRecId, 'uuid': this.LastRecUUID});
        this.LastTable = "";
        this.LastRecId = "";
        this.LastRecUUID = "";
        $.ajax({
            method:"post",
            data: json,
            url: this.GetUrl("/LockService/FreeLockRecord"),
            contentType: "application/json; charset=utf-8",
            headers: GetCSRFTokenHeader(),
            success:((data)=>{}).bind(this),
            error: (data)=>{}
        });
    }

    async StateLockRecordAsync(Table, Id, UUID){
        return new Promise(function(resolve, rejected){
            this.StateLockRecord(Table, Id, UUID, (options) => { resolve(options); });
        }.bind(this));
    }

    async LockRecordAsync(Table, Id, UUID){
        return new Promise(function(resolve, reject){
            this.LockRecord(Table, Id, UUID, (options) => {
                if(options.lockMessage.length != 0){
                    options.editMode = false;
                }
                else{
                    if(options.editMode){
                        options.lockState = true
                    }
                }
                resolve(options);
            });
        }.bind(this));
    }

    async FreeLockRecordAsync(Table, Id, UUID){
        return new Promise(function(resolve, rejected){
            this.FreeLockRecord(Table, Id, UUID);
            resolve("");
        }.bind(this));
    }
}