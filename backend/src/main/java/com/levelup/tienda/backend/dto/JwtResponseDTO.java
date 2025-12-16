package com.levelup.tienda.backend.dto;

import lombok.Data;

@Data
public class JwtResponseDTO {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    // private List<String> roles; // Se agregará cuando se implementen los roles

    public JwtResponseDTO(String accessToken, Long id, String username, String email) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
    }
}
