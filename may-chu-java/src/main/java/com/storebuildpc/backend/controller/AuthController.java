package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.User;
import com.storebuildpc.backend.repository.UserRepository;
import com.storebuildpc.backend.security.JwtService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.storebuildpc.backend.util.ResponseMapper;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/dang-ky")
    public ResponseEntity<?> dangKy(@RequestBody Map<String, Object> body) {
        String username = String.valueOf(body.getOrDefault("username", ""));
        String email = String.valueOf(body.getOrDefault("email", "")).toLowerCase();
        String password = String.valueOf(body.getOrDefault("password", ""));
        String role = String.valueOf(body.getOrDefault("role", "user"));
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email này đã được sử dụng!"));
        }
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại!"));
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Đăng ký tài khoản thành công!"));
    }

    @PostMapping("/dang-nhap")
    public ResponseEntity<?> dangNhap(@RequestBody Map<String, Object> body) {
        String email = String.valueOf(body.getOrDefault("email", "")).toLowerCase();
        String password = String.valueOf(body.getOrDefault("password", ""));
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email hoặc mật khẩu không chính xác!"));
        }
        String token = jwtService.generateToken(user.getMongoId(), user.getRole());
        return ResponseEntity.ok(Map.of(
                "message", "Đăng nhập thành công!",
                "token", token,
                "user", ResponseMapper.userBasic(user)
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, Object> body) {
        String email = String.valueOf(body.getOrDefault("email", "")).toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Email không tồn tại!"));
        }
        byte[] bytes = new byte[20];
        new SecureRandom().nextBytes(bytes);
        String resetToken = HexFormat.of().formatHex(bytes);
        String hashedToken = HashUtil.sha256(resetToken);
        user.setResetPasswordToken(hashedToken);
        user.setResetPasswordExpires(Instant.now().toEpochMilli() + (10 * 60 * 1000));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Link đặt lại mật khẩu đã được gửi vào Gmail của bạn!"));
    }

    @PatchMapping("/reset-password/{token}")
    public ResponseEntity<?> resetPassword(@PathVariable String token, @RequestBody Map<String, Object> body) {
        String hashedToken = HashUtil.sha256(token);
        User user = userRepository.findAll().stream()
                .filter(u -> hashedToken.equals(u.getResetPasswordToken())
                        && u.getResetPasswordExpires() != null
                        && u.getResetPasswordExpires() > Instant.now().toEpochMilli())
                .findFirst().orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Link khôi phục không hợp lệ hoặc đã hết hạn!"));
        }
        user.setPassword(passwordEncoder.encode(String.valueOf(body.getOrDefault("password", ""))));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpires(null);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Mật khẩu của bạn đã được cập nhật thành công!"));
    }

    @GetMapping("/google")
    public ResponseEntity<?> googleLogin() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(Map.of("message", "Google OAuth chưa được cấu hình trong bản chuyển đổi Spring Boot."));
    }

    @GetMapping("/google/callback")
    public ResponseEntity<?> googleCallback() {
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, "http://localhost:3000/dang-nhap")
                .build();
    }
}

class HashUtil {
    static String sha256(String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(text.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
