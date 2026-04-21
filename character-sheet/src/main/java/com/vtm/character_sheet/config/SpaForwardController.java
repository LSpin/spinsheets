package com.vtm.character_sheet.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {

    @RequestMapping(value = {"/", "/login", "/register", "/reset-password",
            "/characters/**", "/chronicles/**", "/all-chronicles", "/all-characters",
            "/7thsea", "/7thsea/**", "/l5r", "/l5r/**",
            "/blades", "/blades/**", "/dnd", "/dnd/**",
            "/uestrpg", "/uestrpg/**",
            "/cyberpunk", "/cyberpunk/**",
            "/asoiaf", "/asoiaf/**",
            "/players", "/admin", "/invite/**"},
            produces = "text/html")
    public String forward() {
        return "forward:/index.html";
    }
}
