package com.storebuildpc.backend.model;

import jakarta.persistence.Column;
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
@Table(name = "san_pham")
public class SanPham extends BaseEntity {
    @Column(nullable = false)
    private String ten;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_danh_muc", nullable = false)
    private DanhMuc idDanhMuc;

    @Column(nullable = false)
    private Double gia;

    @Column(columnDefinition = "TEXT")
    private String thongSo;

    private Integer soLuong = 0;
    private Integer daBan = 0;
    private String anh;
}
