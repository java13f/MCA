package org.kaznalnrprograms.MCA.Registration.Controllers;

import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.kaznalnrprograms.MCA.Registration.CaptchaImage;
import org.kaznalnrprograms.MCA.Registration.Interfaces.IRegistrationDao;
import org.kaznalnrprograms.MCA.Registration.Models.RegistrationUserModel;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

@Controller
public class RegistrationController {
    private IRegistrationDao dRegistration;

    public RegistrationController(IRegistrationDao dRegistration){
        this.dRegistration = dRegistration;
    }

    @GetMapping("/Registration/RegistrationForm")
    public String RegistrationForm(Model model){
        return "Registration/RegistrationForm";
    }
    @GetMapping("/Registration/GetRequestForm")
    public String GetRequestForm(String reqId){
        return "Registration/RequestForm";
    }
    @PostMapping("/Registration/addUser")
    public String addUser(@Valid RegistrationUserModel user, BindingResult bindingResult, Model model, HttpServletRequest request) throws Exception{
        if(bindingResult.hasErrors()){
            List<ObjectError> errors = bindingResult.getAllErrors();
            StringBuilder sb = new StringBuilder();
            for(ObjectError err : errors){
                sb.append(err.getDefaultMessage());
                sb.append("\r\n");
            }
            model.addAttribute("errors", sb.toString());
            return "Registration/RegistrationForm";
        }
        boolean bError = false;
        HttpSession session = request.getSession();
        String captchaValue = (String)session.getAttribute("CaptchaValue");
        if (!captchaValue.equals(user.getCaptchaValue())){
            CaptchaImage ci =new CaptchaImage();
            BufferedImage argbImage = ci.getCaptchaImage();
            session.setAttribute("CaptchaValue", ci.getCaptchaString());
            bError = true;
            model.addAttribute("Captchainfo", "Неверное значение");
        }
        if(dRegistration.existsLogin(user.getLogin())){
            bError = true;
            model.addAttribute("LoginInfo", "Логин уже занят");
        }

        if(user.getPassword().matches("(?=.*\\d)")){
            bError = true;
            model.addAttribute("PasswordInfo", "Пароль должен содержать хотя бы одну цифру");
        }
        else if(user.getPassword().matches("(?=.*[a-zа-яё])")){
            bError = true;
            model.addAttribute("PasswordInfo", "Пароль должен содержать хотя бы одну маленькую букву");
        }
        else if(user.getPassword().matches("(?=.*[A-ZА-ЯЁ])")){
            bError = true;
            model.addAttribute("PasswordInfo", "Пароль должен содержать хотя бы одну большую букву");
        }
        else if(user.getPassword().length()<8) {
            bError = true;
            model.addAttribute("PasswordInfo", "Пароль должен содержать не меньше восьми символов");
        }
        if(!user.getPassword().equals(user.getPassword2())){
            bError = true;
            model.addAttribute("Password2Info", "Пароли не совпадают");
        }
        model.addAttribute("Login", user.getLogin());
        model.addAttribute("UserName", user.getName());
        model.addAttribute("Password", user.getPassword());
        model.addAttribute("Password2", user.getPassword2());
        model.addAttribute("Code", user.getCode());
        model.addAttribute("OrganizationalUnit", user.getOrganizationalUnit());
        model.addAttribute("Email", user.getEmail());
        if(bError){
            return "Registration/RegistrationForm";
        }
        dRegistration.SaveRegistrationUser(user);
        return "redirect:/Registration/GetRequestForm?reqId=0";
    }
    @GetMapping("/Registration/existsLogin")
    public @ResponseBody boolean existsLogin(String login) throws Exception {
        return dRegistration.existsLogin(login);
    }
    public byte[] compress(BufferedImage image, float scale) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
        ImageWriter writer = writers.next();
        ImageWriteParam param = writer.getDefaultWriteParam();
        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(scale);
        ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
        writer.setOutput(ios);
        writer.write(null, new IIOImage(image, null, null), param);
        byte[] data = baos.toByteArray();
        writer.dispose();
        return data;
    }
    @RequestMapping(value = "/Registration/getCaptcha", method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody byte[] getCaptcha(@RequestParam(required = false) Float rid, HttpServletRequest request) throws IOException {
        CaptchaImage ci =new CaptchaImage();
        BufferedImage argbImage = ci.getCaptchaImage();
        HttpSession session = request.getSession();
        session.setAttribute("CaptchaValue", ci.getCaptchaString());
        byte[] data = compress(argbImage, 1);
        return data;
    }
}
