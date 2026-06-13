package br.com.suaempresa.apigerenciamento.security.password;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordReset(String to, String nome, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("Recuperação de senha - WartMart");
        message.setText(
                "Olá " + (nome != null ? nome : "") + ",\n\n" +
                "Recebemos um pedido para redefinir a senha da sua conta.\n" +
                "Clique no link abaixo para criar uma nova senha (válido por 30 minutos):\n\n" +
                link + "\n\n" +
                "Se você não solicitou isso, ignore este e-mail com segurança.\n\n" +
                "Equipe WartMart"
        );
        mailSender.send(message);
    }
}
