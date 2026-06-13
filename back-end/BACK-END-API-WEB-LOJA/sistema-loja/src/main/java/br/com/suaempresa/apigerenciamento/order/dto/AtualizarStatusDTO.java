package br.com.suaempresa.apigerenciamento.order.dto;

import br.com.suaempresa.apigerenciamento.order.model.StatusPedido;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarStatusDTO {

    @NotNull(message = "O status é obrigatório.")
    private StatusPedido status;
}
