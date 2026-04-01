package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.BienThe;
import com.storebuildpc.backend.model.DanhMuc;
import com.storebuildpc.backend.model.SanPham;
import com.storebuildpc.backend.repository.BienTheRepository;
import com.storebuildpc.backend.repository.DanhMucRepository;
import com.storebuildpc.backend.repository.SanPhamRepository;
import com.storebuildpc.backend.util.IdUtil;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/san-pham")
public class SanPhamController {
    private final SanPhamRepository sanPhamRepository;
    private final DanhMucRepository danhMucRepository;
    private final BienTheRepository bienTheRepository;
    private final com.storebuildpc.backend.repository.DanhGiaRepository danhGiaRepository;
    private final com.storebuildpc.backend.repository.OrderItemRepository orderItemRepository;

    @Value("${app.server.url:http://localhost:5000}")
    private String serverUrl;

    public SanPhamController(SanPhamRepository sanPhamRepository, DanhMucRepository danhMucRepository, BienTheRepository bienTheRepository, com.storebuildpc.backend.repository.DanhGiaRepository danhGiaRepository, com.storebuildpc.backend.repository.OrderItemRepository orderItemRepository) {
        this.sanPhamRepository = sanPhamRepository;
        this.danhMucRepository = danhMucRepository;
        this.bienTheRepository = bienTheRepository;
        this.danhGiaRepository = danhGiaRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @GetMapping
    public Object layDanhSach(@RequestParam(required = false) String idDanhMuc) {
        List<SanPham> data;
        if (idDanhMuc == null) data = sanPhamRepository.findAll();
        else {
            DanhMuc dm = danhMucRepository.findById(IdUtil.toLong(idDanhMuc)).orElse(null);
            data = dm == null ? List.of() : sanPhamRepository.findByIdDanhMuc(dm);
        }
        data.sort(java.util.Comparator.comparing(SanPham::getCreatedAt).reversed());
        return data.stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> layChiTiet(@PathVariable String id) {
        return sanPhamRepository.findById(IdUtil.toLong(id))
                .map(sp -> ResponseEntity.ok(toResponse(sp)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy sản phẩm")));
    }

    @GetMapping("/lien-quan/{idDanhMuc}")
    public ResponseEntity<?> layLienQuan(@PathVariable String idDanhMuc, @RequestParam(defaultValue = "5") int limit) {
        try {
            DanhMuc dm = danhMucRepository.findById(IdUtil.toLong(idDanhMuc)).orElse(null);
            if (dm == null) return ResponseEntity.ok(List.of());
            List<SanPham> data = sanPhamRepository.findByIdDanhMuc(dm);
            // Limit to top items
            if (data.size() > limit) {
                data = data.subList(0, limit);
            }
            return ResponseEntity.ok(data.stream().map(this::toResponse).toList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Lỗi: " + e.getMessage()));
        }
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> taoMoi(
            @RequestParam(value = "anh", required = false) MultipartFile anhFile,
            @RequestParam(value = "hinhAnhKhac", required = false) List<MultipartFile> hinhAnhKhacFiles,
            HttpServletRequest request) {
        String ten = request.getParameter("ten");
        String idDanhMucStr = request.getParameter("idDanhMuc");
        String gia = request.getParameter("gia");
        String thongSo = request.getParameter("thongSo");

        if (ten == null || idDanhMucStr == null || gia == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu thông tin bắt buộc: ten, idDanhMuc, gia"));
        }

        DanhMuc dm = danhMucRepository.findById(IdUtil.toLong(idDanhMucStr)).orElse(null);
        if (dm == null) return ResponseEntity.badRequest().body(Map.of("message", "idDanhMuc không hợp lệ"));

        // Parse biến thể từ indexed form fields
        List<Map<String, String>> variants = parseVariants(request);
        if (variants.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sản phẩm bắt buộc phải có ít nhất một biến thể (phiên bản)"));
        }

        SanPham sp = new SanPham();
        sp.setTen(ten);
        sp.setGia(Double.parseDouble(gia));
        sp.setThongSo(thongSo);
        sp.setIdDanhMuc(dm);

        // Xử lý upload ảnh
        if (anhFile != null && !anhFile.isEmpty()) {
            String anhUrl = saveFile(anhFile);
            if (anhUrl != null) sp.setAnh(anhUrl);
        }

        // Xử lý upload ảnh phụ
        if (hinhAnhKhacFiles != null && !hinhAnhKhacFiles.isEmpty()) {
            List<String> urls = new ArrayList<>();
            for (MultipartFile file : hinhAnhKhacFiles) {
                if (file != null && !file.isEmpty()) {
                    String url = saveFile(file);
                    if (url != null) urls.add(url);
                }
            }
            if (!urls.isEmpty()) {
                sp.setHinhAnhKhac(String.join(",", urls));
            }
        }

        int tongSoLuong = variants.stream().mapToInt(v -> Integer.parseInt(v.getOrDefault("soLuong", "0"))).sum();
        sp.setSoLuong(tongSoLuong);
        sp.setDaBan(0);
        sp = sanPhamRepository.save(sp);
        SanPham finalSp = sp;
        variants.forEach(v -> saveBienThe(v, finalSp));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(sp));
    }


    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> capNhat(
            @PathVariable String id, 
            @RequestParam(value = "anh", required = false) MultipartFile anhFile,
            @RequestParam(value = "hinhAnhKhac", required = false) List<MultipartFile> hinhAnhKhacFiles,
            HttpServletRequest request) {
        return sanPhamRepository.findById(IdUtil.toLong(id)).map(sp -> {
            String ten = request.getParameter("ten");
            String giaStr = request.getParameter("gia");
            String thongSo = request.getParameter("thongSo");
            String idDanhMucStr = request.getParameter("idDanhMuc");

            if (ten != null && !ten.isEmpty()) sp.setTen(ten);
            if (giaStr != null && !giaStr.isEmpty()) sp.setGia(Double.parseDouble(giaStr));
            if (thongSo != null) sp.setThongSo(thongSo);
            if (idDanhMucStr != null && !idDanhMucStr.isEmpty()) {
                DanhMuc dm = danhMucRepository.findById(IdUtil.toLong(idDanhMucStr)).orElse(null);
                if (dm != null) sp.setIdDanhMuc(dm);
            }

            // Xử lý upload ảnh mới
            if (anhFile != null && !anhFile.isEmpty()) {
                String anhUrl = saveFile(anhFile);
                if (anhUrl != null) sp.setAnh(anhUrl);
            }

            // Xử lý upload ảnh phụ (thêm vào hoặc thay thế)
            if (hinhAnhKhacFiles != null && !hinhAnhKhacFiles.isEmpty()) {
                List<String> urls = new ArrayList<>();
                for (MultipartFile file : hinhAnhKhacFiles) {
                    if (file != null && !file.isEmpty()) {
                        String url = saveFile(file);
                        if (url != null) urls.add(url);
                    }
                }
                if (!urls.isEmpty()) {
                    // Cập nhật (thay thế hoàn toàn danh sách cũ)
                    sp.setHinhAnhKhac(String.join(",", urls));
                }
            }

            sanPhamRepository.save(sp);

            // Cập nhật biến thể nếu có
            List<Map<String, String>> variants = parseVariants(request);
            if (!variants.isEmpty()) {
                List<BienThe> existing = bienTheRepository.findByIdSanPham(sp);
                List<BienThe> toDelete = new java.util.ArrayList<>(existing);

                for (Map<String, String> v : variants) {
                    String tenVar = v.get("ten");
                    BienThe target = existing.stream().filter(e -> e.getTen().equals(tenVar)).findFirst().orElse(new BienThe());
                    target.setTen(tenVar);
                    try { target.setGia(Double.parseDouble(v.getOrDefault("gia", "0"))); } catch (Exception e) { target.setGia(0d); }
                    try { target.setSoLuong(Integer.parseInt(v.getOrDefault("soLuong", "0"))); } catch (Exception e) { target.setSoLuong(0); }
                    try { target.setDaBan(Integer.parseInt(v.getOrDefault("daBan", "0"))); } catch (Exception e) { target.setDaBan(0); }
                    target.setIdSanPham(sp);
                    bienTheRepository.save(target);
                    toDelete.remove(target);
                }

                for (BienThe b : toDelete) {
                    try {
                        bienTheRepository.delete(b);
                    } catch (Exception ignored) {
                        // Bỏ qua lỗi khóa ngoại nếu biến thể này đã từng được đặt hàng mua
                    }
                }

                SanPham finalSp = sp;
                int tongSoLuong = variants.stream().mapToInt(v -> Integer.parseInt(v.getOrDefault("soLuong", "0"))).sum();
                finalSp.setSoLuong(tongSoLuong);
                sanPhamRepository.save(finalSp);
            }
            return ResponseEntity.ok(toResponse(sp));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy sản phẩm")));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoa(@PathVariable String id) {
        return sanPhamRepository.findById(IdUtil.toLong(id)).map(sp -> {
            try {
                // 1. Xóa đánh giá (danh_gia) liên quan
                danhGiaRepository.deleteAll(danhGiaRepository.findByIdSanPhamOrderByCreatedAtDesc(sp));
                // 2. Đặt null FK trong order_item (bảo toàn lịch sử đơn hàng)
                orderItemRepository.nullifyBySanPham(sp);
                // 3. Xóa các biến thể
                bienTheRepository.deleteByIdSanPham(sp);
                // 4. Xóa sản phẩm
                sanPhamRepository.delete(sp);
                return ResponseEntity.ok(Map.of("message", "Đã xoá sản phẩm thành công"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Lỗi khi xoá: " + e.getMessage()));
            }
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy sản phẩm")));
    }

    @PostMapping("/tao-mau")
    public ResponseEntity<?> taoMau() {
        return ResponseEntity.badRequest().body(Map.of("message", "Hàm này đã cũ. Vui lòng sử dụng chức năng tạo mới."));
    }

    // ---- Helper methods ----

    private List<Map<String, String>> parseVariants(HttpServletRequest request) {
        List<Map<String, String>> variants = new ArrayList<>();
        int i = 0;
        while (request.getParameter("bienThe[" + i + "][ten]") != null) {
            Map<String, String> v = new LinkedHashMap<>();
            v.put("ten", request.getParameter("bienThe[" + i + "][ten]"));
            
            String gia = request.getParameter("bienThe[" + i + "][gia]");
            v.put("gia", (gia != null && !gia.isBlank() && !gia.equals("null")) ? gia : "0");
            
            String soLuong = request.getParameter("bienThe[" + i + "][soLuong]");
            v.put("soLuong", (soLuong != null && !soLuong.isBlank() && !soLuong.equals("null")) ? soLuong : "0");
            
            String daBan = request.getParameter("bienThe[" + i + "][daBan]");
            v.put("daBan", (daBan != null && !daBan.isBlank() && !daBan.equals("null")) ? daBan : "0");
            
            variants.add(v);
            i++;
        }
        return variants;
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

    private void saveBienThe(Map<String, String> v, SanPham sp) {
        BienThe bt = new BienThe();
        bt.setTen(v.get("ten"));
        
        try { bt.setGia(Double.parseDouble(v.getOrDefault("gia", "0"))); } catch (Exception e) { bt.setGia(0d); }
        try { bt.setSoLuong(Integer.parseInt(v.getOrDefault("soLuong", "0"))); } catch (Exception e) { bt.setSoLuong(0); }
        try { bt.setDaBan(Integer.parseInt(v.getOrDefault("daBan", "0"))); } catch (Exception e) { bt.setDaBan(0); }
        
        bt.setIdSanPham(sp);
        bienTheRepository.save(bt);
    }

    private Map<String, Object> toResponse(SanPham sp) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("_id", sp.getMongoId());
        data.put("ten", sp.getTen());
        data.put("idDanhMuc", sp.getIdDanhMuc());
        data.put("gia", sp.getGia());
        data.put("thongSo", sp.getThongSo());
        data.put("soLuong", sp.getSoLuong());
        data.put("daBan", sp.getDaBan());
        data.put("anh", sp.getAnh());
        if (sp.getHinhAnhKhac() != null && !sp.getHinhAnhKhac().isEmpty()) {
            data.put("hinhAnhKhac", sp.getHinhAnhKhac().split(","));
        } else {
            data.put("hinhAnhKhac", new String[]{});
        }
        data.put("bienThe", bienTheRepository.findByIdSanPham(sp));
        data.put("createdAt", sp.getCreatedAt());
        data.put("updatedAt", sp.getUpdatedAt());
        return data;
    }
}
