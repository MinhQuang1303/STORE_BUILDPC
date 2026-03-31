package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.*;
import com.storebuildpc.backend.repository.*;
import com.storebuildpc.backend.util.IdUtil;
import com.storebuildpc.backend.util.ResponseMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final SanPhamRepository sanPhamRepository;
    private final BienTheRepository bienTheRepository;

    public OrderController(OrderRepository orderRepository, OrderItemRepository orderItemRepository, UserRepository userRepository, SanPhamRepository sanPhamRepository, BienTheRepository bienTheRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.bienTheRepository = bienTheRepository;
    }

    @PostMapping("/thanh-toan")
    public ResponseEntity<?> taoDonThanhToan(@RequestBody Map<String, Object> body, @RequestAttribute(name = "userId", required = false) String userId) {
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Từ chối truy cập. Không tìm thấy token."));
        User user = userRepository.findById(IdUtil.toLong(userId)).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy người dùng đăng nhập."));
        String diaChi = String.valueOf(body.getOrDefault("diaChi", ""));
        String soDienThoai = String.valueOf(body.getOrDefault("soDienThoai", ""));
        if (diaChi.isBlank() || soDienThoai.isBlank()) return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ địa chỉ và số điện thoại."));
        List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");
        if (items == null || items.isEmpty()) return ResponseEntity.badRequest().body(Map.of("message", "Đơn hàng phải có ít nhất một sản phẩm."));

        double tongTien = 0;
        List<OrderItem> stagedItems = new ArrayList<>();
        for (Map<String, Object> item : items) {
            String idSanPham = String.valueOf(item.getOrDefault("idSanPham", item.get("_id")));
            if (idSanPham != null && idSanPham.contains("-")) {
                idSanPham = idSanPham.split("-")[0]; // Fallback cho giỏ hàng cũ lưu _id ghép
            }
            
            String idBienThe = item.get("idBienThe") == null ? (String) item.get("bienTheId") : String.valueOf(item.get("idBienThe"));
            int soLuong = 0;
            try {
                soLuong = Integer.parseInt(String.valueOf(item.getOrDefault("soLuong", item.getOrDefault("qty", 0))));
            } catch (Exception e) {
                soLuong = 1;
            }

            SanPham sp = null;
            try {
                if (idSanPham != null && !idSanPham.isBlank() && !idSanPham.equals("null")) {
                    sp = sanPhamRepository.findById(IdUtil.toLong(idSanPham)).orElse(null);
                }
            } catch (Exception e) {
                // Ignore parse error
            }

            if (sp == null || soLuong <= 0) return ResponseEntity.badRequest().body(Map.of("message", "Dữ liệu sản phẩm không hợp lệ: " + idSanPham));
            
            double gia = sp.getGia();
            BienThe bt = null;
            
            try {
                if (idBienThe != null && !idBienThe.isBlank() && !idBienThe.equals("null")) {
                    bt = bienTheRepository.findById(IdUtil.toLong(idBienThe)).orElse(null);
                    if (bt == null) return ResponseEntity.badRequest().body(Map.of("message", "Biến thể sản phẩm không hợp lệ: " + idBienThe));
                    gia = bt.getGia();
                }
            } catch (Exception e) {
                // Ignore parse error for idBienThe
            }
            
            tongTien += gia * soLuong;
            OrderItem oi = new OrderItem();
            oi.setIdSanPham(sp);
            oi.setIdBienThe(bt);
            oi.setSoLuong(soLuong);
            oi.setGia(gia);
            stagedItems.add(oi);
        }
        Order order = new Order();
        order.setIdUser(user);
        order.setTongTien(tongTien);
        order.setDiaChi(diaChi);
        order.setSoDienThoai(soDienThoai);
        order.setGhiChu((String) body.get("ghiChu"));
        order.setPhuongThucThanhToan(String.valueOf(body.getOrDefault("phuongThucThanhToan", "COD")));
        order.setTrangThaiThanhToan("Pending");
        order = orderRepository.save(order);
        for (OrderItem oi : stagedItems) {
            oi.setIdOrder(order);
            orderItemRepository.save(oi);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseMapper.order(order, orderItemRepository.findByIdOrder(order)));
    }

    @GetMapping("/cua-toi")
    public ResponseEntity<?> cuaToi(@RequestAttribute(name = "userId", required = false) String userId) {
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Từ chối truy cập. Không tìm thấy token."));
        User user = userRepository.findById(IdUtil.toLong(userId)).orElse(null);
        if (user == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(orderRepository.findByIdUserOrderByCreatedAtDesc(user).stream()
                .map(o -> ResponseMapper.order(o, orderItemRepository.findByIdOrder(o))).toList());
    }

    @GetMapping
    public ResponseEntity<?> tatCa(@RequestAttribute(name = "userRole", required = false) String role) {
        if (!"admin".equals(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Từ chối truy cập. Bạn không có quyền Admin."));
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(o -> ResponseMapper.order(o, orderItemRepository.findByIdOrder(o))).toList());
    }

    @GetMapping("/nguoi-dung/{userId}")
    public ResponseEntity<?> theoNguoiDung(@PathVariable String userId, @RequestAttribute(name = "userRole", required = false) String role) {
        if (!"admin".equals(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Từ chối truy cập. Bạn không có quyền Admin."));
        User user = userRepository.findById(IdUtil.toLong(userId)).orElse(null);
        if (user == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(orderRepository.findByIdUserOrderByCreatedAtDesc(user).stream()
                .map(o -> ResponseMapper.order(o, orderItemRepository.findByIdOrder(o))).toList());
    }

    @PutMapping("/{id}/trang-thai")
    public ResponseEntity<?> capNhatTrangThai(@PathVariable String id, @RequestBody Map<String, Object> body, @RequestAttribute(name = "userRole", required = false) String role) {
        if (!"admin".equals(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Từ chối truy cập. Bạn không có quyền Admin."));
        return orderRepository.findById(IdUtil.toLong(id)).map(order -> {
            String trangThai = String.valueOf(body.get("trangThai"));
            List<OrderItem> items = orderItemRepository.findByIdOrder(order);
            if ("Confirmed".equals(trangThai) && !order.getIsStockUpdated()) {
                for (OrderItem item : items) {
                    BienThe bt = item.getIdBienThe();
                    if (bt != null) {
                        bt.setSoLuong(bt.getSoLuong() - item.getSoLuong());
                        bt.setDaBan(bt.getDaBan() + item.getSoLuong());
                        bienTheRepository.save(bt);
                    }
                    SanPham sp = item.getIdSanPham();
                    sp.setSoLuong(sp.getSoLuong() - item.getSoLuong());
                    sp.setDaBan(sp.getDaBan() + item.getSoLuong());
                    sanPhamRepository.save(sp);
                }
                order.setIsStockUpdated(true);
            } else if ("Cancelled".equals(trangThai) && order.getIsStockUpdated()) {
                for (OrderItem item : items) {
                    BienThe bt = item.getIdBienThe();
                    if (bt != null) {
                        bt.setSoLuong(bt.getSoLuong() + item.getSoLuong());
                        bt.setDaBan(bt.getDaBan() - item.getSoLuong());
                        bienTheRepository.save(bt);
                    }
                    SanPham sp = item.getIdSanPham();
                    sp.setSoLuong(sp.getSoLuong() + item.getSoLuong());
                    sp.setDaBan(sp.getDaBan() - item.getSoLuong());
                    sanPhamRepository.save(sp);
                }
                order.setIsStockUpdated(false);
            }
            order.setTrangThai(trangThai);
            orderRepository.save(order);
            return ResponseEntity.ok(ResponseMapper.order(order, items));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy đơn hàng")));
    }
}
