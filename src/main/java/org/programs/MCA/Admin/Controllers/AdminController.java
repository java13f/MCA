package org.kaznalnrprograms.MCA.Admin.Controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class AdminController {
    @GetMapping("/Admin/AdminStart")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String Admin(){
        return "Admin/AdminStart";
    }
    @GetMapping("Admin/AdminMainForm")
    @PreAuthorize("GetActRight('Admin','AdminView')")
    public String AdminMainForm(){
        return "Admin/AdminMainForm :: AdminMainForm";
    }
}
