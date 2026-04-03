package com.storebuildpc.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cau_hinh_mau")
public class CauHinhMau extends BaseEntity {

    @Column(nullable = false)
    private String ten;

    @Column(nullable = false)
    private Double gia;

    // Ảnh đại diện config
    @Column(columnDefinition = "TEXT")
    private String anh;

    @Column(columnDefinition = "TEXT")
    private String hinhAnhKhac;

    private String cpu;
    private String vga;
    private String mainboard;
    private String ram;
    private String ssd;
    private String psu;
    private String casePc;
    private String tanNhiet;

    // Nội dung mô tả / Tags (VD: "GAMING,RENDER" hoặc văn bản mô tả dài)
    @Column(columnDefinition = "TEXT")
    private String tags;

}
