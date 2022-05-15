import {GlobalParamTreeList} from "../GlobalParams/GlobalParamTreeList.js";
export function StartNestedModule(id){
    let form = new GlobalParamTreeList({});
    form.Start(id);
}