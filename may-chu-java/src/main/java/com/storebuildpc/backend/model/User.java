package com.storebuildpc.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "user";

    // Fields mở rộng cho Profile Cá nhân
    private String fullName;
    private String phone;
    @Column(columnDefinition = "TEXT")
    private String address;

    private String dob;
    private String gender;

    @Column(unique = true)
    private String googleId;

    private String avatar;
    private String resetPasswordToken;
    private Long resetPasswordExpires;
}
