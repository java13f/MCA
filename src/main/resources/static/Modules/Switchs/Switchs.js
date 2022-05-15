import {SwitchsList} from "../Switchs/SwitchsList.js";
export function StartNestedModule(id){
    let form = new SwitchsList("nested_", {});
    form.Start(id);
}


export function StartModalModul(StartParams, ResultFunc) {
    let id = "wSwitchs_Module_Switchs_SwitchsFormList";//идентификатор диалогового окна
    CreateModalWindow(id, "Справочник коммутации")//функция создания диалогового окна для модуля
    let form = new SwitchsList("modal_", StartParams);
    form.SetResultFunc(ResultFunc);
    form.Start(id);
}