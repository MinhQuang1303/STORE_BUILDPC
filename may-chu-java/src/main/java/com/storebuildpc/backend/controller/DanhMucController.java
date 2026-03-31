package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.DanhMuc;
import com.storebuildpc.backend.repository.DanhMucRepository;
import com.storebuildpc.backend.util.IdUtil;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/danh-muc")
public class DanhMucController {
    private final DanhMucRepository repository;

    public DanhMucController(DanhMucRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Object layTatCa() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> taoMoi(@RequestBody DanhMuc body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(body));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhat(@PathVariable String id, @RequestBody DanhMuc body) {
        DanhMuc dm = repository.findById(IdUtil.toLong(id)).orElse(null);
        if (dm == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy danh mục"));
        }
        dm.setTen(body.getTen());
        dm.setMoTa(body.getMoTa());
        return ResponseEntity.ok(repository.save(dm));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoa(@PathVariable String id) {
        Long parsedId = IdUtil.toLong(id);
        if (!repository.existsById(parsedId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy danh mục"));
        }
        repository.deleteById(parsedId);
        return ResponseEntity.ok(Map.of("message", "Đã xoá danh mục thành công"));
    }
}
