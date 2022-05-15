package org.kaznalnrprograms.MCA.Core;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CustomFailureHandler extends SimpleUrlAuthenticationFailureHandler {
    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException{
        String targetUrl = "";
        if(exception instanceof BadCredentialsException){
            targetUrl = "/login.html?error";// + URLEncoder.encode(exception.getMessage(), "utf-8");
        }
        else
        {
            targetUrl = "/login.html?error=" + true;
        }

        if(response.isCommitted()){
            return;
        }
        redirectStrategy.sendRedirect(request, response, targetUrl);
    }
}
