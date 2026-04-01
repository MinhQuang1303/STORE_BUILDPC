package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.User;
import com.storebuildpc.backend.repository.UserRepository;
import com.storebuildpc.backend.util.ResponseMapper;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/dang-ky")
    public ResponseEntity<?> dangKy(@RequestBody Map<String, Object> body) {
        String username = String.valueOf(body.getOrDefault("username", ""));
        String email = String.valueOf(body.getOrDefault("email", "")).toLowerCase();
        String password = String.valueOf(body.getOrDefault("password", ""));
        String role = String.valueOf(body.getOrDefault("role", "user"));
        if (userRepository.existsByEmail(email) || userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Username hoặc Email đã được sử dụng"));
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Đăng ký thành công",
                "data", Map.of("id", user.getMongoId(), "username", user.getUsername(), "email", user.getEmail(), "role", user.getRole())
        ));
    }

    @GetMapping
    public ResponseEntity<?> layTatCa() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", userRepository.findAll().stream().map(ResponseMapper::userBasic).toList()
        ));
    }

    @PostMapping(value = "/{id}", consumes = {"multipart/form-data", "multipart/form-data;charset=UTF-8", "application/x-www-form-urlencoded"})
    public ResponseEntity<?> capNhatHoSo(
            @PathVariable String id,
            jakarta.servlet.http.HttpServletRequest request,
            @RequestParam(value = "avatar", required = false) org.springframework.web.multipart.MultipartFile avatarFile) {
        try {
            return userRepository.findById(Long.parseLong(id)).map(user -> {
                String fullName = request.getParameter("fullName");
                String phone = request.getParameter("phone");
                String address = request.getParameter("address");
                String dob = request.getParameter("dob");
                String gender = request.getParameter("gender");

                if (fullName != null) user.setFullName(fullName);
                if (phone != null) user.setPhone(phone);
                if (address != null) user.setAddress(address);
                if (dob != null) user.setDob(dob);
                if (gender != null) user.setGender(gender);

                if (avatarFile != null && !avatarFile.isEmpty()) {
                    try {
                        String fileName = java.util.UUID.randomUUID().toString() + "_" + avatarFile.getOriginalFilename();
                        java.nio.file.Path path = java.nio.file.Paths.get("uploads", fileName);
                        java.nio.file.Files.createDirectories(path.getParent());
                        java.nio.file.Files.write(path, avatarFile.getBytes());
                        user.setAvatar("/uploads/" + fileName);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                userRepository.save(user);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Cập nhật hồ sơ thành công",
                        "data", ResponseMapper.userBasic(user)
                ));
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Không tìm thấy User")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "ID sai định dạng"));
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> doiMatKhau(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            return userRepository.findById(Long.parseLong(id)).map(user -> {
                String oldPassword = String.valueOf(body.getOrDefault("oldPassword", ""));
                String newPassword = String.valueOf(body.getOrDefault("newPassword", ""));
                
                if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", "Mật khẩu cũ không chính xác"));
                }
                
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Đổi mật khẩu thành công"
                ));
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Không tìm thấy User")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "ID sai định dạng"));
        }
    }
}
