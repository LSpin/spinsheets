package com.vtm.character_sheet.service;

import com.vtm.character_sheet.entity.AppUser;
import jakarta.mail.internet.MimeMessage;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.notify-email}")
    private String notifyEmail;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @PostConstruct
    void checkMailConfig() {
        if (mailPassword == null || mailPassword.isBlank()) {
            log.warn("MAIL_PASSWORD is not set — welcome emails and registration notifications will fail. "
                   + "Set the MAIL_PASSWORD environment variable to a Gmail App Password.");
        } else {
            log.info("Mail configured: from={}, notify={}", fromEmail, notifyEmail);
        }
    }

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
            log.info("Registration notification sent for user: {}", user.getUsername());
        } catch (Exception e) {
            log.error("Failed to send registration notification for user {}: {}", user.getUsername(), e.getMessage(), e);
        }
    }

    @Async
    public void sendWelcomeEmail(AppUser user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Welcome to SpinSheets!");
            helper.setText(buildWelcomeHtml(user.getUsername()), true);
            mailSender.send(message);
            log.info("Welcome email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    private String buildWelcomeHtml(String username) {
        return """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 8px; overflow: hidden;">
              <div style="background: #16213e; padding: 28px 32px; text-align: center;">
                <h1 style="margin: 0; font-size: 26px; color: #c4a35a; letter-spacing: 1px;">SpinSheets</h1>
              </div>
              <div style="padding: 32px;">
                <h2 style="color: #c4a35a; margin-top: 0;">Welcome, %s!</h2>
                <p style="font-size: 15px; line-height: 1.6; color: #ccc;">
                  Thank you for joining SpinSheets &mdash; your digital companion for the World of Darkness.
                </p>
                <p style="font-size: 15px; line-height: 1.6; color: #ccc;">
                  Your account is all set. You can now create characters, join chronicles, and bring your stories to life.
                </p>
                <div style="margin: 28px 0; text-align: center;">
                  <a href="https://spinsheets.com"
                     style="display: inline-block; background: #c4a35a; color: #1a1a2e; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px;">
                    Get Started
                  </a>
                </div>
                <p style="font-size: 13px; color: #888; margin-bottom: 0;">
                  If you have questions or run into any issues, reach out to your Storyteller or reply to this email.
                </p>
              </div>
              <div style="background: #16213e; padding: 16px 32px; text-align: center; font-size: 12px; color: #666;">
                &copy; SpinSheets &mdash; A World of Darkness character manager
              </div>
            </div>
            """.formatted(username);
    }
}
