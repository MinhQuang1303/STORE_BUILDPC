package com.storebuildpc.backend.repository;

import com.storebuildpc.backend.model.CauHinhMau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CauHinhMauRepository extends JpaRepository<CauHinhMau, Long> {
}
