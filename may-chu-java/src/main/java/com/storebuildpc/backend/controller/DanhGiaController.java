package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.DanhGia;
import com.storebuildpc.backend.model.SanPham;
import com.storebuildpc.backend.model.User;
import com.storebuildpc.backend.repository.DanhGiaRepository;
import com.storebuildpc.backend.repository.SanPhamRepository;
import com.storebuildpc.backend.repository.UserRepository;
import com.storebuildpc.backend.util.IdUtil;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/danh-gia")
public class DanhGiaController {

    private final DanhGiaRepository danhGiaRepository;
    private final SanPhamRepository sanPhamRepository;
    private final UserRepository userRepository;

    public DanhGiaController(DanhGiaRepository danhGiaRepository, SanPhamRepository sanPhamRepository, UserRepository userRepository) {
        this.danhGiaRepository = danhGiaRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/san-pham/{idSanPham}")
    public ResponseEntity<?> layDanhGiaTheoSanPham(@PathVariable String idSanPham) {
        SanPham sp = sanPhamRepository.findById(IdUtil.toLong(idSanPham)).orElse(null);
        if (sp == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Sản phẩm không tồn tại"));
        }
        List<DanhGia> danhGiaList = danhGiaRepository.findByIdSanPhamOrderByCreatedAtDesc(sp);
        
        List<Map<String, Object>> result = danhGiaList.stream().map(dg -> {
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("_id", dg.getMongoId());
            data.put("soSao", dg.getSoSao());
            data.put("noiDung", dg.getNoiDung());
            data.put("ngayTao", dg.getCreatedAt());
            Map<String, Object> userData = new LinkedHashMap<>();
            userData.put("_id", dg.getIdUser().getMongoId());
            userData.put("fullName", dg.getIdUser().getFullName() != null ? dg.getIdUser().getFullName() : dg.getIdUser().getUsername());
            userData.put("avatar", dg.getIdUser().getAvatar());
            data.put("nguoiDung", userData);
            return data;
        }).toList();

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> themDanhGia(@RequestBody Map<String, Object> payload) {
        try {
            String userIdStr = (String) payload.get("idUser");
            String productIdStr = (String) payload.get("idSanPham");
            Integer soSao = (Integer) payload.get("soSao");
            String noiDung = (String) payload.get("noiDung");

            if (userIdStr == null || productIdStr == null || soSao == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Thiếu thông tin bắt buộc"));
            }

            User user = userRepository.findById(IdUtil.toLong(userIdStr)).orElse(null);
            SanPham sp = sanPhamRepository.findById(IdUtil.toLong(productIdStr)).orElse(null);

            if (user == null || sp == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User hoặc Sản phẩm không tồn tại"));
            }

            DanhGia danhGia = new DanhGia();
            danhGia.setIdUser(user);
            danhGia.setIdSanPham(sp);
            danhGia.setSoSao(soSao);
            danhGia.setNoiDung(noiDung);
            danhGiaRepository.save(danhGia);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Đánh giá thành công", "_id", danhGia.getMongoId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Lỗi server: " + e.getMessage()));
        }
    }
}
