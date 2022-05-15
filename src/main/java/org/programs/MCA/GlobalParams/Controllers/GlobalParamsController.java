package org.kaznalnrprograms.MCA.GlobalParams.Controllers;

import org.kaznalnrprograms.MCA.GlobalParams.Interfaces.IGlobalParamsDao;
import org.kaznalnrprograms.MCA.GlobalParams.Models.GlobalParamsEditModel;
import org.kaznalnrprograms.MCA.GlobalParams.Models.GlobalParamsViewModel;
import org.kaznalnrprograms.MCA.GlobalParams.Models.ParentGlobalParamsModel;
import org.kaznalnrprograms.MCA.LockTable.Models.FilterModel;
import org.kaznalnrprograms.MCA.GlobalParams.Models.GlobalParamsModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class GlobalParamsController {
    private IGlobalParamsDao dGlPrm;
    public GlobalParamsController(IGlobalParamsDao dGlPrm){
        this.dGlPrm = dGlPrm;
    }
    @GetMapping("/GlobalParams/GlobalParamsStart")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsView')")
    public String GlobalParamsStart(){ return "GlobalParams/GlobalParamsStart"; }


    @GetMapping("/GlobalParams/GlobalParams")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsView')")
    public String GlobalParams(){
        return "GlobalParams/GlobalParamsTreeList::GlobalParamsTreeList";
    }

    @PostMapping("GlobalParams/ListTree")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsView')")
    public @ResponseBody List<GlobalParamsViewModel> ListTree(@RequestBody FilterModel filter) throws Exception{
        return dGlPrm.ListTree(filter.getFilter());
    }

    @GetMapping("/GlobalParams/GlobalParamsFormEdit")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsChange')")
    public String GlobalParamsFormEditList(){
        return "GlobalParams/GlobalParamsFormEdit::GlobalParamsFormEdit";
    }

    @GetMapping("/GlobalParams/GlobalParamsFormSlct")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsView')")
    public String GlobalParamsFormslctList(){
        return "GlobalParams/GlobalParamsFormSlct::GlobalParamsFormSlct";
    }


    @PostMapping("/GlobalParams/LoadParentGlPr")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsView')")
    public @ResponseBody String LoadParentGlPr(@RequestBody ParentGlobalParamsModel id) throws Exception{
        return dGlPrm.ParentGlPr(id);
    }

    @PostMapping("/GlobalParams/Save")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsChange')")
    public @ResponseBody String save(@RequestBody GlobalParamsModel model) throws Exception{
        return  dGlPrm.save(model);
    }

    @PostMapping("/GlobalParams/LoadGlPr")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsView')")
    public @ResponseBody GlobalParamsEditModel LoadGlPr(@RequestBody ParentGlobalParamsModel id) throws Exception{
        return dGlPrm.GlPr(id);
    }

    @PostMapping("/GlobalParams/SearchNodeAndDelete")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsChange')")
    public @ResponseBody String SearchNodeAndDelete(@RequestBody ParentGlobalParamsModel id) throws Exception{
        return dGlPrm.SearchNodeAndDelete(id);
    }

    @PostMapping("/GlobalParams/NodeCount")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsView')")
    public @ResponseBody int NodeCount(@RequestBody ParentGlobalParamsModel id) throws Exception{
        return dGlPrm.NodeCount(id);
    }

    @PostMapping("/GlobalParams/ChildNode")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsView')")
    public @ResponseBody List<String> ChildNode(@RequestBody ParentGlobalParamsModel id) throws Exception{
        return dGlPrm.ChildNode(id);
    }

    @PostMapping("/GlobalParams/CheckExistenceNode")
    @PreAuthorize("GetActRight('GlobalParams','Glbl_prmsView')")
    public @ResponseBody boolean CheckExistenceNode(@RequestBody ParentGlobalParamsModel id) throws Exception{
        return dGlPrm.CheckExistenceNode(id);
    }
}
