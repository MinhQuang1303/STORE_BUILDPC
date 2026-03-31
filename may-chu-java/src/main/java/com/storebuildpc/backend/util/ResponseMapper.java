package com.storebuildpc.backend.util;

import com.storebuildpc.backend.model.BienThe;
import com.storebuildpc.backend.model.Order;
import com.storebuildpc.backend.model.OrderItem;
import com.storebuildpc.backend.model.SanPham;
import com.storebuildpc.backend.model.User;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class ResponseMapper {
    private ResponseMapper() {
    }

    public static Map<String, Object> userBasic(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", user.getMongoId());
        map.put("username", user.getUsername());
        map.put("email", user.getEmail());
        map.put("role", user.getRole());
        map.put("avatar", user.getAvatar());
        map.put("fullName", user.getFullName());
        map.put("phone", user.getPhone());
        map.put("address", user.getAddress());
        map.put("createdAt", user.getCreatedAt());
        return map;
    }

    public static Map<String, Object> bienThe(BienThe bt) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", bt.getMongoId());
        map.put("ten", bt.getTen());
        map.put("gia", bt.getGia());
        map.put("idSanPham", sanPhamLite(bt.getIdSanPham()));
        map.put("soLuong", bt.getSoLuong());
        map.put("daBan", bt.getDaBan());
        map.put("createdAt", bt.getCreatedAt());
        map.put("updatedAt", bt.getUpdatedAt());
        return map;
    }

    public static Map<String, Object> sanPhamLite(SanPham sp) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", sp.getMongoId());
        map.put("ten", sp.getTen());
        map.put("gia", sp.getGia());
        return map;
    }

    public static Map<String, Object> order(Order order, List<OrderItem> items) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("_id", order.getMongoId());
        result.put("idUser", userBasic(order.getIdUser()));
        result.put("tongTien", order.getTongTien());
        result.put("trangThai", order.getTrangThai());
        result.put("diaChi", order.getDiaChi());
        result.put("soDienThoai", order.getSoDienThoai());
        result.put("ghiChu", order.getGhiChu());
        result.put("phuongThucThanhToan", order.getPhuongThucThanhToan());
        result.put("trangThaiThanhToan", order.getTrangThaiThanhToan());
        result.put("maGiaoDich", order.getMaGiaoDich());
        result.put("isStockUpdated", order.getIsStockUpdated());
        result.put("orderItems", items.stream().map(i -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("_id", i.getMongoId());
            item.put("idOrder", order.getMongoId());
            item.put("idSanPham", sanPhamLite(i.getIdSanPham()));
            item.put("idBienThe", i.getIdBienThe() == null ? null : bienThe(i.getIdBienThe()));
            item.put("soLuong", i.getSoLuong());
            item.put("gia", i.getGia());
            item.put("createdAt", i.getCreatedAt());
            item.put("updatedAt", i.getUpdatedAt());
            return item;
        }).toList());
        result.put("createdAt", order.getCreatedAt());
        result.put("updatedAt", order.getUpdatedAt());
        return result;
    }
}
