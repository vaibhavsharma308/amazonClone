package com.amazonclone.ecommerce_backend.repository;

import com.amazonclone.ecommerce_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByEmailOrderByOrderDateDesc(String email);
}
