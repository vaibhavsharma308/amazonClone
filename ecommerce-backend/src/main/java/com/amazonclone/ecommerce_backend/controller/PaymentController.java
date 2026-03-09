package com.amazonclone.ecommerce_backend.controller;

import com.amazonclone.ecommerce_backend.model.Order;
import com.amazonclone.ecommerce_backend.model.Payment;
import com.amazonclone.ecommerce_backend.repository.OrderRepository;
import com.amazonclone.ecommerce_backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentRequest) {
        try {
            Long orderId = Long.valueOf(paymentRequest.get("orderId").toString());
            String cardNumber = paymentRequest.get("cardNumber").toString().replaceAll("\\s", "");
            String cardHolderName = paymentRequest.get("cardHolderName").toString();
            double amount = Double.parseDouble(paymentRequest.get("amount").toString());

            // Basic card number validation
            if (cardNumber.length() < 13 || cardNumber.length() > 19) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid card number"));
            }

            // Find the order
            Order order = orderRepository.findById(orderId).orElse(null);
            if (order == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Order not found"));
            }

            // Simulate payment processing delay
            Thread.sleep(1500);

            // Create payment record
            Payment payment = new Payment();
            payment.setOrderId(orderId);
            payment.setCardHolderName(cardHolderName);
            payment.setCardLastFour(cardNumber.substring(cardNumber.length() - 4));
            payment.setAmount(amount);
            payment.setStatus("SUCCESS");

            Payment savedPayment = paymentRepository.save(payment);

            // Update order payment status
            order.setPaymentStatus("PAID");
            order.setPaymentId(savedPayment.getId());
            orderRepository.save(order);

            return ResponseEntity.ok(savedPayment);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.internalServerError().body(Map.of("error", "Payment processing interrupted"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Payment processing failed: " + e.getMessage()));
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .map(payment -> ResponseEntity.ok((Object) payment))
                .orElse(ResponseEntity.notFound().build());
    }
}
