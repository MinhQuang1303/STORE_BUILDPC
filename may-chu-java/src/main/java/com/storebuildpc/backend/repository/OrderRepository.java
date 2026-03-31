package com.storebuildpc.backend.repository;

import com.storebuildpc.backend.model.Order;
import com.storebuildpc.backend.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByIdUserOrderByCreatedAtDesc(User user);
    List<Order> findAllByOrderByCreatedAtDesc();
}
