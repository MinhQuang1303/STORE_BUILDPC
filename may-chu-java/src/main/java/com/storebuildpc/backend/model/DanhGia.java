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
@Table(name = "danh_gia")
public class DanhGia extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_user", nullable = false)
    private User idUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_san_pham", nullable = false)
    private SanPham idSanPham;

    @Column(nullable = false)
    private Integer soSao;

    @Column(columnDefinition = "TEXT")
    private String noiDung;

}
