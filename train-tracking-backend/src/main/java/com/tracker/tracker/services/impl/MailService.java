package com.tracker.tracker.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {
    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendSimpleMail(String subject, String toMail, String emailBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            message.setSubject(subject);
            message.setFrom(new InternetAddress(fromEmail));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(toMail));
            message.setText(emailBody);

            Session session = ((JavaMailSenderImpl) mailSender).getSession();
            session.getProperties().put("mail.transport.protocol", "smtp");
            session.getProperties().put("mail.smtp.auth", "true");
            session.getProperties().put("mail.smtp.ssl.enable", "false");
            session.getProperties().put("mail.debug", "true");

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            log.info(subject + " - " + e.getMessage());
        }
    }
}
