package com.storebuildpc.backend.controller;

import com.storebuildpc.backend.model.Order;
import com.storebuildpc.backend.repository.OrderRepository;
import com.storebuildpc.backend.repository.SanPhamRepository;
import com.storebuildpc.backend.repository.UserRepository;
import com.storebuildpc.backend.util.ResponseMapper;
import java.time.LocalDate;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/thong-ke")
public class ThongKeController {
    private final OrderRepository orderRepository;
    private final SanPhamRepository sanPhamRepository;
    private final UserRepository userRepository;

    public ThongKeController(OrderRepository orderRepository, SanPhamRepository sanPhamRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/overview")
    public ResponseEntity<?> overview() {
        List<Order> all = orderRepository.findAll();
        double revenue = all.stream().filter(o -> "Delivered".equals(o.getTrangThai())).mapToDouble(Order::getTongTien).sum();
        long users = userRepository.findAll().stream().filter(u -> "user".equals(u.getRole())).count();
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of(
                "revenue", revenue,
                "orders", all.size(),
                "products", sanPhamRepository.count(),
                "users", users
        )));
    }

    @GetMapping("/doanh-thu")
    public ResponseEntity<?> doanhThu() {
        LocalDate start = LocalDate.now().minusMonths(11).withDayOfMonth(1);
        List<Map<String, Object>> monthly = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            LocalDate d = start.plusMonths(i);
            monthly.add(new HashMap<>(Map.of("month", d.getMonthValue() + "/" + d.getYear(), "revenue", 0d)));
        }
        orderRepository.findAll().stream().filter(o -> "Delivered".equals(o.getTrangThai())).forEach(o -> {
            String label = o.getCreatedAt().getMonthValue() + "/" + o.getCreatedAt().getYear();
            monthly.stream().filter(m -> label.equals(m.get("month"))).findFirst().ifPresent(m -> m.put("revenue", (Double) m.get("revenue") + o.getTongTien()));
        });
        return ResponseEntity.ok(Map.of("success", true, "data", monthly));
    }

    @GetMapping("/trang-thai-don-hang")
    public ResponseEntity<?> trangThai() {
        Map<String, Long> grouped = new HashMap<>();
        orderRepository.findAll().forEach(o -> grouped.merge(o.getTrangThai(), 1L, Long::sum));
        List<Map<String, Object>> stats = grouped.entrySet().stream().map(e -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("_id", e.getKey());
            item.put("count", e.getValue());
            return item;
        }).toList();
        return ResponseEntity.ok(Map.of("success", true, "data", stats));
    }

    @GetMapping("/recent")
    public ResponseEntity<?> recent() {
        List<Order> list = orderRepository.findAllByOrderByCreatedAtDesc();
        if (list.size() > 5) list = list.subList(0, 5);
        List<Map<String, Object>> data = list.stream().map(o -> ResponseMapper.order(o, List.of())).toList();
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }
}
