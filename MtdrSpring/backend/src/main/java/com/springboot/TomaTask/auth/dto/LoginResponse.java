package com.springboot.TomaTask.auth.dto;

import com.springboot.TomaTask.dto.UserDTO;

public class LoginResponse {

    private String token;
    private long expiresIn;
    private UserDTO user;

    public String getToken() {
        return token;
    }

    public LoginResponse setToken(String token) {
        this.token = token;
        return this;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public LoginResponse setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
        return this;
    }

    public UserDTO getUser() {
        return user;
    }

    public LoginResponse setUser(UserDTO user) {
        this.user = user;
        return this;
    }
}
