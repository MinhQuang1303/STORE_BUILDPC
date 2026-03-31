package com.storebuildpc.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "danh_muc")
public class DanhMuc extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String ten;

    @Column(columnDefinition = "TEXT")
    private String moTa;
}
