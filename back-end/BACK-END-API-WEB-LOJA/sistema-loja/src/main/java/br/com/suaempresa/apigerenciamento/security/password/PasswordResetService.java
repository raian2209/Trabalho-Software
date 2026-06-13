package br.com.suaempresa.apigerenciamento.security.password;

import br.com.suaempresa.apigerenciamento.exception.InvalidTokenException;
import br.com.suaempresa.apigerenciamento.user.model.User;
import br.com.suaempresa.apigerenciamento.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);
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
     * Gera um token e envia o e-mail de recuperação. Por segurança, NÃO revela
     * se o e-mail existe — o retorno é sempre genérico no controller.
     */
    @Transactional
    public void createAndSendResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.info("Pedido de reset para e-mail inexistente: {}", email);
            return;
        }

        User user = userOpt.get();
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
