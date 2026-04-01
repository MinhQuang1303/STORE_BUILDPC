package com.storebuildpc.backend.repository;

import com.storebuildpc.backend.model.Order;
import com.storebuildpc.backend.model.OrderItem;
import com.storebuildpc.backend.model.SanPham;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByIdOrder(Order order);

    @Modifying
    @Transactional
    @Query("UPDATE OrderItem oi SET oi.idSanPham = null, oi.idBienThe = null WHERE oi.idSanPham = :sp")
    void nullifyBySanPham(@Param("sp") SanPham sp);
}
