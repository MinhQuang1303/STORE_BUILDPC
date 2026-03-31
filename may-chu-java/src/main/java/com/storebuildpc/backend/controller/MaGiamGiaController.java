package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.MaGiamGia;
import com.storebuildpc.backend.repository.MaGiamGiaRepository;
import com.storebuildpc.backend.util.IdUtil;
import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ma-giam-gia")
public class MaGiamGiaController {
    private final MaGiamGiaRepository repository;

    public MaGiamGiaController(MaGiamGiaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Object layTatCa() {
        return repository.findAll();
    }

    @GetMapping("/kiem-tra/{ma}")
    public ResponseEntity<?> kiemTra(@PathVariable String ma) {
        MaGiamGia mg = repository.findByMaAndTrangThai(ma.toUpperCase(), true).orElse(null);
        if (mg == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"));
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(mg.getNgayBatDau())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã giảm giá chưa đến thời gian sử dụng"));
        }
        if (now.isAfter(mg.getNgayHetHan())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã giảm giá đã hết hạn"));
        }
        if (mg.getSoLuong() > 0 && mg.getDaSuDung() >= mg.getSoLuong()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã giảm giá đã hết lượt sử dụng"));
        }
        return ResponseEntity.ok(mg);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> layChiTiet(@PathVariable String id) {
        MaGiamGia mg = repository.findById(IdUtil.toLong(id)).orElse(null);
        if (mg == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy mã giảm giá"));
        }
        return ResponseEntity.ok(mg);
    }

    @PostMapping
    public ResponseEntity<?> taoMoi(@RequestBody MaGiamGia body) {
        if (repository.findByMa(body.getMa().toUpperCase()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mã giảm giá này đã tồn tại"));
        }
        body.setMa(body.getMa().toUpperCase());
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(body));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhat(@PathVariable String id, @RequestBody MaGiamGia body) {
        MaGiamGia old = repository.findById(IdUtil.toLong(id)).orElse(null);
        if (old == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy mã giảm giá"));
        }
        body.setId(old.getId());
        return ResponseEntity.ok(repository.save(body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoa(@PathVariable String id) {
        Long parsedId = IdUtil.toLong(id);
        if (!repository.existsById(parsedId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy mã giảm giá"));
        }
        repository.deleteById(parsedId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa mã giảm giá thành công"));
    }
}
