package com.storebuildpc.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_user", nullable = false)
    private User idUser;

    private Double tongTien = 0d;
    private String trangThai = "Pending";
    private String diaChi;
    private String soDienThoai;
    private String ghiChu;
    private String phuongThucThanhToan = "COD";
    private String trangThaiThanhToan = "Pending";
    private String maGiaoDich;
    private Boolean isStockUpdated = false;
}
