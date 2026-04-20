package com.vtm.character_sheet.config;

import jakarta.servlet.http.HttpServletResponse;
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
            "/players", "/admin", "/invite/**"},
            produces = "text/html")
    public String forward(HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        return "forward:/index.html";
    }
}
