package com.storebuildpc.backend.repository;

import com.storebuildpc.backend.model.Order;
import com.storebuildpc.backend.model.OrderItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByIdOrder(Order order);
}
