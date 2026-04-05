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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final SanPhamRepository sanPhamRepository;
    private final BienTheRepository bienTheRepository;
    private final MaGiamGiaRepository maGiamGiaRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public OrderController(OrderRepository orderRepository, OrderItemRepository orderItemRepository, UserRepository userRepository, SanPhamRepository sanPhamRepository, BienTheRepository bienTheRepository, MaGiamGiaRepository maGiamGiaRepository, SimpMessagingTemplate messagingTemplate) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.bienTheRepository = bienTheRepository;
        this.maGiamGiaRepository = maGiamGiaRepository;
        this.messagingTemplate = messagingTemplate;
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
        // Lấy tổng tiền từ Frontend (đã trừ voucher/giảm giá)
        // Nếu không có thì fallback tính lại từ giá gốc
        double tongTienFront = 0;
        try {
            Object tongTienRaw = body.get("tongTien");
            if (tongTienRaw != null) {
                tongTienFront = Double.parseDouble(String.valueOf(tongTienRaw));
            }
        } catch (Exception ignored) {}

        // Lấy số tiền giảm và mã voucher từ frontend (nếu có)
        double soTienGiam = 0;
        try {
            Object soTienGiamRaw = body.get("soTienGiam");
            if (soTienGiamRaw != null) {
                soTienGiam = Double.parseDouble(String.valueOf(soTienGiamRaw));
            }
        } catch (Exception ignored) {}
        String maVoucher = body.get("maVoucher") instanceof String s ? s : null;

        Order order = new Order();
        order.setIdUser(user);
        // Dùng giá Frontend nếu > 0 (có voucher), ngược lại dùng giá tính lại
        order.setTongTien(tongTienFront > 0 ? tongTienFront : tongTien);
        order.setSoTienGiam(soTienGiam);
        order.setMaVoucher(maVoucher);
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

        // Tăng số lượt đã dùng của voucher (nếu có)
        if (maVoucher != null && !maVoucher.isBlank()) {
            maGiamGiaRepository.findByMa(maVoucher.toUpperCase()).ifPresent(mg -> {
                mg.setDaSuDung(mg.getDaSuDung() + 1);
                maGiamGiaRepository.save(mg);
            });
        }

        try {
            messagingTemplate.convertAndSend("/topic/orders", Map.of("message", "Có đơn hàng mới"));
        } catch (Exception e) {
            System.err.println("Error sending websocket message: " + e.getMessage());
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

            // Gửi thông báo WebSocket tới user về việc cập nhật trạng thái đơn hàng
            try {
                String userMongoId = order.getIdUser().getMongoId();
                String trangThaiLabel = switch (trangThai) {
                    case "Confirmed" -> "Đã xác nhận";
                    case "Shipping" -> "Đang giao hàng";
                    case "Delivered" -> "Đã giao hàng";
                    case "Cancelled" -> "Đã hủy";
                    default -> trangThai;
                };
                String topic = "/topic/order-status/" + userMongoId;
                System.out.println("[OrderController] Gửi WebSocket tới topic: " + topic);
                messagingTemplate.convertAndSend(
                    topic,
                    Map.of(
                        "orderId", order.getMongoId(),
                        "trangThai", trangThai,
                        "trangThaiLabel", trangThaiLabel,
                        "message", "Đơn hàng #" + order.getMongoId().toUpperCase() + " đã được cập nhật: " + trangThaiLabel
                    )
                );
                System.out.println("[OrderController] Đã gửi WebSocket thành công!");
            } catch (Exception e) {
                System.err.println("Error sending order-status websocket: " + e.getMessage());
            }

            return ResponseEntity.ok(ResponseMapper.order(order, items));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy đơn hàng")));
    }
}
