package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.AppUser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.notify-email}")
    private String notifyEmail;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void notifyRegistration(AppUser user) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(notifyEmail);
            msg.setSubject("SpinSheets — New " + user.getRole().name().toLowerCase() + " registered");
            msg.setText(String.format(
                    "A new user has registered on SpinSheets.\n\n" +
                    "Username: %s\n" +
                    "Email: %s\n" +
                    "Role: %s\n",
                    user.getUsername(), user.getEmail(), user.getRole().name()
            ));
            mailSender.send(msg);
        } catch (Exception e) {
            // Don't let email failures break registration
        }
    }
}
