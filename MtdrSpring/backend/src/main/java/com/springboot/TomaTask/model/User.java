package com.springboot.TomaTask.model;
import jakarta.persistence.*;


import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;

import com.fasterxml.jackson.annotation.JsonIgnore;

/*
    representation of the User table that exists already
    in the autonomous database
 */
@Entity
@Table(name = "user_table")
public class User implements UserDetails  {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "id", updatable = false, nullable = false, unique = true)
    private String id;

    @Column(name = "firstName")
    String firstName;

    @Column(name = "lastName")
    String lastName;

    @Column(name = "email")
    String email;

    @Column(name = "phoneNumber")
    String phoneNumber;

    @Column(name = "password", nullable = false)
    String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role", referencedColumnName = "id", nullable = false)
    private UserRole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @CreationTimestamp
    @Column(name = "creation_ts", updatable = false)
    OffsetDateTime creationTs;

    @UpdateTimestamp
    @Column(name = "update_ts")
    OffsetDateTime updateTs;

    @Column(name = "telegram_token", unique = true)
    private String telegramToken;

    public User(){}
    public User(String firstName, String lastName, String email, String phoneNumber, String password, UserRole role, Team team) {
        this.firstName = firstName;
        this.lastName  = lastName;
        this.email     = email;
        this.phoneNumber = phoneNumber;
        this.password  = password;
        this.role      = role;
        this.team      = team;
    }
    public String getID() { return id; }
    public String getName() {
        return firstName + " " + lastName;
    }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }

    public String getTelegramToken() {
        return telegramToken;
    }

    public void setTelegramToken(String telegramToken) {
        this.telegramToken = telegramToken;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", role=" + role +
                ", team=" + team +
                ", creationTs=" + creationTs +
                '}';
    }


    @Override
    @JsonIgnore 
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role != null) {
            return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + role.getRole())
            );
        }
        return Collections.emptyList();
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    // CAMBIO 3: Agregar @JsonIgnore a los métodos de UserDetails
    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }
}