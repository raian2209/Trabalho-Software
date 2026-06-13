package br.com.suaempresa.apigerenciamento.security.password;

import br.com.suaempresa.apigerenciamento.security.password.dto.ForgotPasswordRequestDTO;
import br.com.suaempresa.apigerenciamento.security.password.dto.ResetPasswordRequestDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO dto) {
        passwordResetService.createAndSendResetToken(dto.getEmail());
        // Resposta genérica: não revela se o e-mail existe.
        return ResponseEntity.ok(Map.of(
                "message",
                "Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO dto) {
        passwordResetService.resetPassword(dto.getToken(), dto.getNovaSenha());
        return ResponseEntity.ok(Map.of("message", "Senha redefinida com sucesso."));
    }
}
