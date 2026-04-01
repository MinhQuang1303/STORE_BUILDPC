package com.storebuildpc.backend.repository;

import com.storebuildpc.backend.model.DanhGia;
import com.storebuildpc.backend.model.SanPham;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, Long> {
    List<DanhGia> findByIdSanPhamOrderByCreatedAtDesc(SanPham idSanPham);
}
