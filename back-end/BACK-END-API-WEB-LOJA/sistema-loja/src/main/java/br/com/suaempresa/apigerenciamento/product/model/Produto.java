package br.com.suaempresa.apigerenciamento.product.model;

import br.com.suaempresa.apigerenciamento.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "produtos")
@Getter
@Setter
@SQLDelete(sql = "UPDATE produtos SET deleted = true WHERE id = ?") // Implementa o Soft Delete
@Where(clause = "deleted = false") // Garante que buscas tragam apenas ativos
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String descricao;

    @Column(nullable = false)
    private Double preco;

    // Quantidade disponível em estoque. ColumnDefault garante que a coluna seja
    // adicionada com DEFAULT 0 em bancos já existentes (ddl-auto=update).
    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer estoque = 0;

    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String imagem;

    // Relacionamento: Muitos produtos pertencem a um Fornecedor (User)
    @ManyToOne(fetch = FetchType.LAZY) // LAZY para melhor performance
    @JoinColumn(name = "fornecedor_id", nullable = false)
    private User fornecedor;

    @Column(name = "deleted")
    private boolean deleted = false;
}