package hu.azsn.felut;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SiteController {


    @GetMapping("/")
    public String home(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication.getPrincipal());
        if ((User.class.isInstance(authentication.getPrincipal())) && authentication.isAuthenticated()) {
            model.addAttribute("loggedin", true);
        } else {
            model.addAttribute("loggedin", false);
        }
        return "index";
    }

    @GetMapping("/logout")
    public String logout(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        authentication.setAuthenticated(false);
        return "redirect:/";
    }
}
