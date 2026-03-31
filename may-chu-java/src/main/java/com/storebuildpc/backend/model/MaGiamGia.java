package com.storebuildpc.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ma_giam_gia")
public class MaGiamGia extends BaseEntity {
    private String ma;
    private String moTa;
    private String loaiGiamGia = "phanTram";
    private Double giaTri;
    private Double giaTriDonHangToiThieu = 0d;
    private Double giaTriGiamToiDa;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayHetHan;
    private Integer soLuong = 0;
    private Integer daSuDung = 0;
    private Boolean trangThai = true;
}
