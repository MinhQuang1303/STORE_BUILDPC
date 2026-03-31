package com.storebuildpc.backend.repository;

import com.storebuildpc.backend.model.MaGiamGia;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaGiamGiaRepository extends JpaRepository<MaGiamGia, Long> {
    Optional<MaGiamGia> findByMaAndTrangThai(String ma, Boolean trangThai);
    Optional<MaGiamGia> findByMa(String ma);
}
