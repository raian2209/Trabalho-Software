package br.com.suaempresa.apigerenciamento.security.auth;

import lombok.Getter;
import lombok.Setter;

// DTO para a resposta com o token
@Getter @Setter
public class AuthResponseDTO {
    private String id;
    private String nome;
    private String email;
    private String role;
    private String token;

    public AuthResponseDTO(String id, String nome, String email, String role, String token) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.role = role;
        this.token = token;
    }
}
