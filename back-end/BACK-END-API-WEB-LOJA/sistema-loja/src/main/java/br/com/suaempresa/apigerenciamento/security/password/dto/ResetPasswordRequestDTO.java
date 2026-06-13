package br.com.suaempresa.apigerenciamento.security.password.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequestDTO {

    @NotBlank(message = "Token ausente.")
    private String token;

    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres.")
    private String novaSenha;
}
