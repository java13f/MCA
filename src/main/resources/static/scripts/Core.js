contextPath = ""
function LoadForm(Id, url, FormInitFunc) {
    $.ajax({
        method:"GET",
        url: url,
        success: function(data){
            $(Id).html(data);
            InitEasyUIForBlock(Id);
            if(FormInitFunc!=null)
            {
                FormInitFunc();
            }
        },
        error: (data)=>{
            let responseJSON = data.responseJSON;
            let error = "";
            if(responseJSON != null){
                error = "message: " + responseJSON.message + "<br/>"
                    +"error: " + responseJSON.error + "<br/>"
                    +"status: " + responseJSON.status + "<br/>"
                    +"path: " + responseJSON.path;
            }
            error = data;
            $.messager.alert('Ошибка',error,'error');
        }
    });
}
function InitEasyUIForBlock(Id) {
    $.parser.parse(Id);
}
function EscapeSpecialHTMLCharacters(data) {
    let l_data = data;
    l_data = JSON.stringify(l_data);
    l_data = l_data.replace(/</g,"&lt;").replace(/>/g,"&gt;");;
    return JSON.parse(l_data);
}
/*function StartNestedModulGlobal(Id, AppCode) {
    import(contextPath + "/Modules/"+AppCode+"/"+AppCode+".js").then(
        module => module.StartNestedModul(Id),
        (error) => { $.messager.alert('Ошибка',"Не удалось загрузить модуль с по пути /Modules/"+AppCode+"/"+AppCode+".js"+"<br/>"+error,'error'); }
    );
}
function StartModalModulGlobal(AppCode, StartParams, ResultFunc) {
    import(contextPath + "/Modules/"+AppCode+"/"+AppCode+".js").then(
        module => module.StartModalModul(StartParams, ResultFunc),
        (error) => { $.messager.alert('Ошибка',"Не удалось загрузить модуль с по пути /Modules/"+AppCode+"/"+AppCode+".js"+"<br/>"+error,'error'); }
    );
}*/
//Добаление навигации с клавиатуры для DataGrid - а
function AddKeyboardNavigationForGrid(grid) {
    grid.datagrid('getPanel').panel('panel').attr('tabindex',1).bind('keydown',function(e){
        switch(e.keyCode){
            case 38:	// up
                var selected = grid.datagrid('getSelected');
                if (selected){
                    let index = grid.datagrid('getRowIndex', selected);
                    if(index > 0){
                        grid.datagrid('unselectAll');
                    }
                    grid.datagrid('selectRow', index-1);
                } else {
                    //grid.datagrid('unselectAll');
                    grid.datagrid('selectRow', 0);
                }
                break;
            case 40:	// down
                var selected = grid.datagrid('getSelected');
                if (selected){
                    let index = grid.datagrid('getRowIndex', selected);
                    let count = grid.datagrid('getRows').length;
                    if(index < (count - 1)){
                        grid.datagrid('unselectAll');
                    }
                    grid.datagrid('selectRow', index+1);
                } else {
                    //grid.datagrid('unselectAll');
                    grid.datagrid('selectRow', 0);
                }
                break;
        }
    });
}
//Создание диалогового окна для модального вызова справочника
function CreateModalWindow(Id, title){
    let el = document.createElement('div');
    el.setAttribute("id", Id);
    document.body.appendChild(el);
    $("#"+Id).window({
        id:Id,
        width:"1024",
        height:"633",
        modal: true,
        title: title,
        minimizable: false,
        collapsible: false,
        onClose:()=>{ $("#"+Id).window("destroy");}
    });
}
//Получить CSRF токен, если он есть на странице
function GetCSRFTokenHeader(){
    let token = $("meta[name='_csrf']").attr("content");
    let header = $("meta[name='_csrf_header']").attr("content");
    return JSON.parse("{\"" + header + "\":\"" + token + "\"}")
}
/**
 * Функция переопределения загрузчика в датагриде (для защиты данных от CSRF)
 * @param grid
 * @constructor
 */
function LoaderCSRFDataForGrid(grid){
    grid.datagrid({loader: function(param, success, error){
            let opts = $(this).datagrid('options');
            if (!opts.url) return false;
            $.ajax({
                type: opts.method,
                url: opts.url,
                data: JSON.stringify(param),
                contentType: "application/json; charset=utf-8",
                headers: GetCSRFTokenHeader(),
                success: function(data){
                    success(data);
                },
                error: function(){
                    error.apply(this, arguments);
                }
            });
        }});
}
/**
 * Функция переопределения загрузчика в датагриде (для защиты данных от CSRF) (TreeGrid)
 * @param grid
 * @constructor
 */
function LoaderCSRFDataForTreeGrid(grid){
    grid.treegrid({loader: function(param, success, error){
            let opts = $(this).treegrid('options');
            if (!opts.url) return false;
            $.ajax({
                type: opts.method,
                url: opts.url,
                data: JSON.stringify(param),
                contentType: "application/json; charset=utf-8",
                headers: GetCSRFTokenHeader(),
                success: function(data){
                    success(data);
                },
                error: function(){
                    error.apply(this, arguments);
                }
            });
        }});
}
// возвращает куки с указанным name,
// или undefined, если ничего не найдено
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}