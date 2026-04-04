package com.storebuildpc.backend.repository;

import com.storebuildpc.backend.model.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findByIdUser_IdOrderByIsDefaultDesc(Long userId);
}
