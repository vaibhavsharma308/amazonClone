package com.amazonclone.ecommerce_backend.controller;

import com.amazonclone.ecommerce_backend.model.Order;
import com.amazonclone.ecommerce_backend.model.OrderItem;
import com.amazonclone.ecommerce_backend.repository.OrderRepository;
import com.amazonclone.ecommerce_backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        // Set the parent reference on each item
        for (OrderItem item : order.getItems()) {
            item.setOrder(order);
        }
        Order savedOrder = orderRepository.save(order);

        // Send order confirmation email
        if (savedOrder.getEmail() != null && !savedOrder.getEmail().isEmpty()) {
            emailService.sendOrderConfirmationEmail(
                    savedOrder.getEmail(),
                    savedOrder.getCustomerName(),
                    savedOrder);
        }

        return savedOrder;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
