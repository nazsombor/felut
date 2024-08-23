package hu.azsn.felut.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SiteController {


    @GetMapping("/")
    public String home(Model model) {
        if (User.class.isInstance(SecurityContextHolder.getContext().getAuthentication().getPrincipal())) {
            model.addAttribute("loggedin", true);
        } else {
            model.addAttribute("loggedin", false);
        }
        return "index";
    }

    @GetMapping("/logout")
    public String logout(Model model) {
        SecurityContextHolder.getContext().setAuthentication(null);
        return "redirect:/";
    }
}
