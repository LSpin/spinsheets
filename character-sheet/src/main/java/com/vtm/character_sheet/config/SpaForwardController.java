package com.vtm.character_sheet.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {

    @RequestMapping(value = {"/", "/login", "/register", "/reset-password", "/characters/**", "/chronicles/**"},
            produces = "text/html")
    public String forward() {
        return "forward:/index.html";
    }
}
