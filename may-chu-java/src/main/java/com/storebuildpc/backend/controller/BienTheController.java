package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.BienThe;
import com.storebuildpc.backend.model.SanPham;
import com.storebuildpc.backend.repository.BienTheRepository;
import com.storebuildpc.backend.repository.SanPhamRepository;
import com.storebuildpc.backend.util.IdUtil;
import com.storebuildpc.backend.util.ResponseMapper;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bien-the")
public class BienTheController {
    private final BienTheRepository bienTheRepository;
    private final SanPhamRepository sanPhamRepository;

    public BienTheController(BienTheRepository bienTheRepository, SanPhamRepository sanPhamRepository) {
        this.bienTheRepository = bienTheRepository;
        this.sanPhamRepository = sanPhamRepository;
    }

    @GetMapping
    public Object layDanhSach(@RequestParam(required = false) String idSanPham) {
        List<BienThe> data;
        if (idSanPham == null) data = bienTheRepository.findAll();
        else {
            SanPham sp = sanPhamRepository.findById(IdUtil.toLong(idSanPham)).orElse(null);
            data = sp == null ? List.of() : bienTheRepository.findByIdSanPham(sp);
        }
        return data.stream().map(ResponseMapper::bienThe).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> layChiTiet(@PathVariable String id) {
        return bienTheRepository.findById(IdUtil.toLong(id))
                .map(bt -> ResponseEntity.ok(ResponseMapper.bienThe(bt)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy biến thể")));
    }

    @PostMapping
    public ResponseEntity<?> taoMoi(@RequestBody Map<String, Object> body) {
        SanPham sp = sanPhamRepository.findById(IdUtil.toLong(String.valueOf(body.get("idSanPham")))).orElse(null);
        if (sp == null) return ResponseEntity.badRequest().body(Map.of("message", "idSanPham không hợp lệ"));
        BienThe bt = new BienThe();
        bt.setTen(String.valueOf(body.get("ten")));
        bt.setGia(Double.parseDouble(String.valueOf(body.get("gia"))));
        bt.setSoLuong(Integer.parseInt(String.valueOf(body.getOrDefault("soLuong", 0))));
        bt.setDaBan(Integer.parseInt(String.valueOf(body.getOrDefault("daBan", 0))));
        bt.setIdSanPham(sp);
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseMapper.bienThe(bienTheRepository.save(bt)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhat(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return bienTheRepository.findById(IdUtil.toLong(id)).map(bt -> {
            if (body.containsKey("ten")) bt.setTen(String.valueOf(body.get("ten")));
            if (body.containsKey("gia")) bt.setGia(Double.parseDouble(String.valueOf(body.get("gia"))));
            if (body.containsKey("soLuong")) bt.setSoLuong(Integer.parseInt(String.valueOf(body.get("soLuong"))));
            if (body.containsKey("daBan")) bt.setDaBan(Integer.parseInt(String.valueOf(body.get("daBan"))));
            return ResponseEntity.ok(ResponseMapper.bienThe(bienTheRepository.save(bt)));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy biến thể")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoa(@PathVariable String id) {
        Long parsed = IdUtil.toLong(id);
        if (!bienTheRepository.existsById(parsed)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy biến thể"));
        }
        bienTheRepository.deleteById(parsed);
        return ResponseEntity.ok(Map.of("message", "Đã xóa biến thể thành công"));
    }
}
