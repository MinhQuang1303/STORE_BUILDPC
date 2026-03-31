package com.storebuildpc.backend.repository;

import com.storebuildpc.backend.model.DanhMuc;
import com.storebuildpc.backend.model.SanPham;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SanPhamRepository extends JpaRepository<SanPham, Long> {
    List<SanPham> findByIdDanhMuc(DanhMuc danhMuc);
}
