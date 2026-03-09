package com.amazonclone.ecommerce_backend.controller;

import com.amazonclone.ecommerce_backend.model.Product;
import com.amazonclone.ecommerce_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

        @Autowired
        private ProductRepository productRepository;

        @PostMapping
        public Product createProduct(@RequestBody Product product) {
                return productRepository.save(product);
        }

        @GetMapping
        public List<Product> getAllProducts(
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) String category) {

                List<Product> products = productRepository.findAll();

                if (search != null && !search.isEmpty()) {
                        String lowerSearch = search.toLowerCase();
                        products = products.stream()
                                        .filter(p -> p.getName().toLowerCase().contains(lowerSearch) ||
                                                        p.getDescription().toLowerCase().contains(lowerSearch))
                                        .collect(Collectors.toList());
                }

                if (category != null && !category.isEmpty()) {
                        products = products.stream()
                                        .filter(p -> p.getCategory().equalsIgnoreCase(category))
                                        .collect(Collectors.toList());
                }

                return products;
        }

        @GetMapping("/categories")
        public List<String> getCategories() {
                return productRepository.findAll().stream()
                                .map(Product::getCategory)
                                .distinct()
                                .collect(Collectors.toList());
        }

        @GetMapping("/{id}")
        public ResponseEntity<Product> getProductById(@PathVariable Long id) {
                return productRepository.findById(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @GetMapping("/seller/{sellerId}")
        public List<Product> getSellerProducts(@PathVariable Long sellerId) {
                return productRepository.findAll().stream()
                                .filter(p -> sellerId.equals(p.getSellerId()))
                                .collect(Collectors.toList());
        }

        @PutMapping("/{id}")
        public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
                return productRepository.findById(id)
                                .map(existing -> {
                                        existing.setName(productDetails.getName());
                                        existing.setPrice(productDetails.getPrice());
                                        existing.setDescription(productDetails.getDescription());
                                        existing.setImageUrl(productDetails.getImageUrl());
                                        existing.setCategory(productDetails.getCategory());
                                        existing.setStock(productDetails.getStock());
                                        if (productDetails.getSellerId() != null)
                                                existing.setSellerId(productDetails.getSellerId());
                                        if (productDetails.getSellerName() != null)
                                                existing.setSellerName(productDetails.getSellerName());
                                        return ResponseEntity.ok(productRepository.save(existing));
                                }).orElse(ResponseEntity.notFound().build());
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
                return productRepository.findById(id)
                                .map(product -> {
                                        productRepository.delete(product);
                                        return ResponseEntity.ok().<Void>build();
                                }).orElse(ResponseEntity.notFound().build());
        }
}
