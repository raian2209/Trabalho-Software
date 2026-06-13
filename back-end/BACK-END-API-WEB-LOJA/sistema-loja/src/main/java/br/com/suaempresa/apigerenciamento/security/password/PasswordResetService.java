package br.com.suaempresa.apigerenciamento.security.password;

import br.com.suaempresa.apigerenciamento.exception.EmailNotFoundException;
import br.com.suaempresa.apigerenciamento.exception.InvalidTokenException;
import br.com.suaempresa.apigerenciamento.user.model.User;
import br.com.suaempresa.apigerenciamento.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final Duration TOKEN_VALIDITY = Duration.ofMinutes(30);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository tokenRepository,
                                EmailService emailService,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Gera um token e envia o e-mail de recuperação. Avisa explicitamente quando
     * o e-mail não está cadastrado (a pedido do produto).
     */
    @Transactional
    public void createAndSendResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EmailNotFoundException("E-mail não cadastrado no sistema."));
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setUser(user);
        resetToken.setExpiryDate(Instant.now().plus(TOKEN_VALIDITY));
        tokenRepository.save(resetToken);

        String link = frontendUrl + "/reset-password?token=" + resetToken.getToken();
        emailService.sendPasswordReset(user.getEmail(), user.getNome(), link);
    }

    @Transactional
    public void resetPassword(String token, String novaSenha) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Link inválido."));

        if (resetToken.isUsed()) {
            throw new InvalidTokenException("Este link já foi utilizado.");
        }
        if (resetToken.isExpired()) {
            throw new InvalidTokenException("Este link expirou. Solicite um novo.");
        }

        User user = resetToken.getUser();
        user.setSenha(passwordEncoder.encode(novaSenha));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}
