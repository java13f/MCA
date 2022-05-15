package org.kaznalnrprograms.MCA.Configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {
    public void addViewControllers(ViewControllerRegistry registry) {
        //registry.addViewController("/login").setViewName("Login/LoginForm");
        //registry.addViewController("/error403").setViewName("Errors/403");
    }
}
