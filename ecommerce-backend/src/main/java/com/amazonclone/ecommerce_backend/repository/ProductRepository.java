package com.amazonclone.ecommerce_backend.repository;

import com.amazonclone.ecommerce_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // JpaRepository gives us all the CRUD methods for free!
    // save(), findAll(), findById(), deleteById()
}
