package com.storebuildpc.backend.config;

import com.storebuildpc.backend.model.User;
import com.storebuildpc.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // =====================================================
            // CẤU HÌNH TÀI KHOẢN ADMIN MẶC ĐỊNH
            // Thay đổi các giá trị bên dưới trước khi chạy server
            // =====================================================
            String adminUsername = "admin";
            String adminEmail    = "admin@gmail.com";
            String adminPassword = "admin123";  // <-- ĐỔI MẬT KHẨU TẠI ĐÂY
            // =====================================================

            boolean usernameExists = userRepository.findByUsername(adminUsername).isPresent();
            boolean emailExists    = userRepository.findByEmail(adminEmail).isPresent();

            if (!usernameExists && !emailExists) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole("admin");
                admin.setFullName("Quản Trị Viên");
                admin.setPhone("0901234567");
                userRepository.save(admin);
                System.out.println("======================================================");
                System.out.println("✅ Tạo tài khoản ADMIN mặc định thành công!");
                System.out.println("   Username: " + adminUsername);
                System.out.println("   Password: " + adminPassword);
                System.out.println("======================================================");
            } else {
                System.out.println("ℹ️ Tài khoản admin đã tồn tại, bỏ qua khởi tạo.");
            }
        };
    }
}
