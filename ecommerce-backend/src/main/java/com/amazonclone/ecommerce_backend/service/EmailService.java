package com.amazonclone.ecommerce_backend.service;

import com.amazonclone.ecommerce_backend.model.Order;
import com.amazonclone.ecommerce_backend.model.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Welcome to AmazonClone! 🎉");
            helper.setFrom("AmazonClone <noreply@amazonclone.com>");

            String html = """
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                        <div style="background: linear-gradient(135deg, #232f3e 0%%, #131921 100%%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ff9900; margin: 0; font-size: 28px;">Welcome to AmazonClone!</h1>
                        </div>
                        <div style="padding: 30px;">
                            <h2 style="color: #232f3e; margin-top: 0;">Hey %s! 👋</h2>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                                Your account has been created successfully. We're thrilled to have you on board!
                            </p>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                                Start exploring our amazing collection of products and enjoy a seamless shopping experience.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:5173" style="background: #ff9900; color: #131921; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                                    Start Shopping →
                                </a>
                            </div>
                            <p style="color: #888; font-size: 14px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                                Happy Shopping! 🛍️<br>The AmazonClone Team
                            </p>
                        </div>
                    </div>
                    """
                    .formatted(name);

            helper.setText(html, true);
            mailSender.send(message);
            System.out.println("✅ Welcome email sent to: " + to);

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send welcome email to " + to + ": " + e.getMessage());
        }
    }

    @Async
    public void sendOrderConfirmationEmail(String to, String customerName, Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Order Confirmed! #" + order.getId() + " 📦");
            helper.setFrom("AmazonClone <noreply@amazonclone.com>");

            StringBuilder itemRows = new StringBuilder();
            for (OrderItem item : order.getItems()) {
                itemRows.append(String.format("""
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #eee;">%s</td>
                            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">%d</td>
                            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$%.2f</td>
                        </tr>
                        """, item.getProductName(), item.getQuantity(), item.getPrice() * item.getQuantity()));
            }

            String html = String.format(
                    """
                            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                                <div style="background: linear-gradient(135deg, #232f3e 0%%%%, #131921 100%%%%); padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #ff9900; margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
                                    <p style="color: #ccc; margin: 10px 0 0; font-size: 14px;">Order #%d</p>
                                </div>
                                <div style="padding: 30px;">
                                    <h2 style="color: #232f3e; margin-top: 0;">Thanks, %s!</h2>
                                    <p style="color: #555; font-size: 16px; line-height: 1.6;">
                                        Your order has been placed successfully and is being processed.
                                    </p>

                                    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                        <h3 style="color: #232f3e; margin-top: 0;">📍 Shipping To</h3>
                                        <p style="color: #555; margin: 0;">%s, %s %s</p>
                                    </div>

                                    <table style="width: 100%%%%; border-collapse: collapse; margin: 20px 0;">
                                        <thead>
                                            <tr style="background: #f8f9fa;">
                                                <th style="padding: 12px; text-align: left; color: #232f3e;">Item</th>
                                                <th style="padding: 12px; text-align: center; color: #232f3e;">Qty</th>
                                                <th style="padding: 12px; text-align: right; color: #232f3e;">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            %s
                                        </tbody>
                                    </table>

                                    <div style="text-align: right; margin: 20px 0; padding: 15px; background: #232f3e; border-radius: 8px;">
                                        <span style="color: #ccc; font-size: 16px;">Total: </span>
                                        <span style="color: #ff9900; font-size: 24px; font-weight: bold;">$%.2f</span>
                                    </div>

                                    <p style="color: #888; font-size: 14px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                                        Thank you for shopping with us! 🛍️<br>The AmazonClone Team
                                    </p>
                                </div>
                            </div>
                            """,
                    order.getId(),
                    customerName,
                    order.getShippingAddress(), order.getCity(), order.getZipCode(),
                    itemRows.toString(),
                    order.getTotalAmount());

            helper.setText(html, true);
            mailSender.send(message);
            System.out.println("✅ Order confirmation email sent to: " + to);

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send order confirmation email to " + to + ": " + e.getMessage());
        }
    }
}
