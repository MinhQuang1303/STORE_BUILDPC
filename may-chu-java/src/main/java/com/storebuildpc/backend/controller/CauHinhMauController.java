package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.CauHinhMau;
import com.storebuildpc.backend.repository.CauHinhMauRepository;
import com.storebuildpc.backend.util.ResponseMapper;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@RestController
@RequestMapping("/api/cau-hinh-mau")
public class CauHinhMauController {

    private final CauHinhMauRepository cauHinhMauRepository;

    @Value("${app.server.url:http://localhost:5000}")
    private String serverUrl;

    public CauHinhMauController(CauHinhMauRepository cauHinhMauRepository) {
        this.cauHinhMauRepository = cauHinhMauRepository;
    }

    @GetMapping
    public List<Map<String, Object>> layDanhSach() {
        return cauHinhMauRepository.findAll().stream()
                .map(ResponseMapper::cauHinhMau)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> layChiTiet(@PathVariable Long id) {
        return cauHinhMauRepository.findById(id)
                .map(config -> ResponseEntity.ok(ResponseMapper.cauHinhMau(config)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy cấu hình mẫu")));
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> taoMoi(HttpServletRequest request) {
        try {
            CauHinhMau entity = new CauHinhMau();
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ResponseMapper.cauHinhMau(saveEntity(entity, request)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi tạo cấu hình: " + e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> capNhat(@PathVariable Long id, HttpServletRequest request) {
        return cauHinhMauRepository.findById(id).map(entity -> {
            try {
                return ResponseEntity.ok(ResponseMapper.cauHinhMau(saveEntity(entity, request)));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Lỗi cập nhật: " + e.getMessage()));
            }
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Không tìm thấy cấu hình mẫu")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoa(@PathVariable Long id) {
        if (!cauHinhMauRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Không tìm thấy cấu hình mẫu"));
        }
        cauHinhMauRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa cấu hình mẫu thành công"));
    }

    private CauHinhMau saveEntity(CauHinhMau entity, HttpServletRequest httpRequest) throws Exception {
        // Cast sang MultipartHttpServletRequest để lấy file
        MultipartHttpServletRequest request = (MultipartHttpServletRequest) httpRequest;

        String ten = request.getParameter("ten");
        if (ten != null) entity.setTen(ten);

        String giaStr = request.getParameter("gia");
        if (giaStr != null && !giaStr.trim().isEmpty()) {
            try { entity.setGia(Double.parseDouble(giaStr)); } catch (Exception e) { entity.setGia(0.0); }
        } else if (entity.getGia() == null) {
            entity.setGia(0.0);
        }

        // Ảnh đại diện chính
        MultipartFile anhFile = request.getFile("anh");
        if (anhFile != null && !anhFile.isEmpty()) {
            String anhUrl = saveFile(anhFile);
            if (anhUrl != null) entity.setAnh(anhUrl);
        } else {
            String anhStr = request.getParameter("anh");
            if (anhStr != null && !anhStr.isEmpty() && !anhStr.equals("null")) {
                entity.setAnh(anhStr);
            }
        }

        // Album ảnh phụ
        List<MultipartFile> hinhAnhKhacFiles = request.getFiles("hinhAnhKhac");
        if (hinhAnhKhacFiles != null && !hinhAnhKhacFiles.isEmpty()) {
            List<String> urls = new ArrayList<>();
            for (MultipartFile file : hinhAnhKhacFiles) {
                if (file != null && !file.isEmpty()) {
                    String url = saveFile(file);
                    if (url != null) urls.add(url);
                }
            }
            if (!urls.isEmpty()) {
                entity.setHinhAnhKhac(String.join(",", urls));
            }
        } else {
            // Fallback: giữ lại album ảnh cũ nếu không upload mới
            String hinhAnhKhacStr = request.getParameter("hinhAnhKhacStr");
            if (hinhAnhKhacStr != null && !hinhAnhKhacStr.equals("null") && !hinhAnhKhacStr.isEmpty()) {
                entity.setHinhAnhKhac(hinhAnhKhacStr);
            }
        }

        String cpu = request.getParameter("cpu");
        if (cpu != null && !cpu.equals("null")) entity.setCpu(cpu);

        String vga = request.getParameter("vga");
        if (vga != null && !vga.equals("null")) entity.setVga(vga);

        String main = request.getParameter("main");
        if (main != null && !main.equals("null")) entity.setMainboard(main);

        String ram = request.getParameter("ram");
        if (ram != null && !ram.equals("null")) entity.setRam(ram);

        String ssd = request.getParameter("ssd");
        if (ssd != null && !ssd.equals("null")) entity.setSsd(ssd);

        String psu = request.getParameter("psu");
        if (psu != null && !psu.equals("null")) entity.setPsu(psu);

        String casePc = request.getParameter("case");
        if (casePc != null && !casePc.equals("null")) entity.setCasePc(casePc);

        String tanNhiet = request.getParameter("tanNhiet");
        if (tanNhiet != null && !tanNhiet.equals("null")) entity.setTanNhiet(tanNhiet);

        String tags = request.getParameter("tags");
        if (tags != null && !tags.equals("null")) entity.setTags(tags);

        return cauHinhMauRepository.save(entity);
    }

    private String saveFile(MultipartFile file) {
        try {
            String uploadDir = "uploads/";
            Files.createDirectories(Paths.get(uploadDir));
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return serverUrl + "/uploads/" + fileName;
        } catch (IOException e) {
            return null;
        }
    }
}
