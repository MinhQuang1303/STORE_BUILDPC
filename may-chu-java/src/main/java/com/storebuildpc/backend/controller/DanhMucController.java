package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.DanhMuc;
import com.storebuildpc.backend.model.SanPham;
import com.storebuildpc.backend.repository.BienTheRepository;
import com.storebuildpc.backend.repository.DanhGiaRepository;
import com.storebuildpc.backend.repository.DanhMucRepository;
import com.storebuildpc.backend.repository.OrderItemRepository;
import com.storebuildpc.backend.repository.SanPhamRepository;
import com.storebuildpc.backend.util.IdUtil;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/danh-muc")
public class DanhMucController {
    private final DanhMucRepository repository;
    private final SanPhamRepository sanPhamRepository;
    private final BienTheRepository bienTheRepository;
    private final DanhGiaRepository danhGiaRepository;
    private final OrderItemRepository orderItemRepository;

    public DanhMucController(DanhMucRepository repository, SanPhamRepository sanPhamRepository,
                              BienTheRepository bienTheRepository, DanhGiaRepository danhGiaRepository,
                              OrderItemRepository orderItemRepository) {
        this.repository = repository;
        this.sanPhamRepository = sanPhamRepository;
        this.bienTheRepository = bienTheRepository;
        this.danhGiaRepository = danhGiaRepository;
        this.orderItemRepository = orderItemRepository;
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
        DanhMuc dm = repository.findById(parsedId).orElse(null);
        if (dm == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy danh mục"));
        }
        try {
            // Lấy tất cả sản phẩm thuộc danh mục này
            List<SanPham> sanPhams = sanPhamRepository.findByIdDanhMuc(dm);
            for (SanPham sp : sanPhams) {
                // Xóa đánh giá của sản phẩm
                danhGiaRepository.deleteAll(danhGiaRepository.findByIdSanPhamOrderByCreatedAtDesc(sp));
                // Nullify FK trong order_item để bảo toàn lịch sử đơn hàng
                orderItemRepository.nullifyBySanPham(sp);
                // Xóa các biến thể
                bienTheRepository.deleteByIdSanPham(sp);
            }
            // Xóa tất cả sản phẩm của danh mục
            sanPhamRepository.deleteAll(sanPhams);
            // Xóa danh mục
            repository.deleteById(parsedId);
            return ResponseEntity.ok(Map.of("message", "Đã xoá danh mục và toàn bộ sản phẩm liên quan thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi xoá danh mục: " + e.getMessage()));
        }
    }
}
