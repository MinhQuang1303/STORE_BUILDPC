package com.storebuildpc.backend.repository;

import com.storebuildpc.backend.model.BienThe;
import com.storebuildpc.backend.model.SanPham;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.transaction.Transactional;

public interface BienTheRepository extends JpaRepository<BienThe, Long> {
    List<BienThe> findByIdSanPham(SanPham sanPham);
    
    @Transactional
    void deleteByIdSanPham(SanPham sanPham);
}
