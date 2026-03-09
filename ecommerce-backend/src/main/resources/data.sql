-- =============================================
-- Seed Data for E-Commerce Application
-- =============================================

-- =============================================
-- PRODUCTS
-- =============================================
INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('Wireless Noise-Canceling Headphones', 99.99, 'Premium sound quality with industry-leading noise cancellation. 30-hour battery life.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', 'Electronics', 4.5, 2847, 45, NULL, 'Amazon Basics');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('Smart Watch Pro', 249.99, 'Advanced health monitoring, GPS, and seamless phone connectivity. Water-resistant to 50m.', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80', 'Electronics', 4.3, 1523, 30, NULL, 'TechGear');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('Mechanical Gaming Keyboard', 129.99, 'Cherry MX switches, per-key RGB lighting, aircraft-grade aluminum frame.', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80', 'Electronics', 4.7, 3291, 60, NULL, 'GamePro');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('Classic Leather Backpack', 79.99, 'Genuine leather with padded laptop compartment. Perfect for work or travel.', 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&q=80', 'Fashion', 4.4, 892, 25, NULL, 'UrbanStyle');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('Premium Running Shoes', 119.99, 'Ultra-lightweight with responsive cushioning. Breathable mesh upper.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', 'Fashion', 4.6, 4102, 80, NULL, 'FitWear');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('Aviator Sunglasses', 59.99, 'Polarized lenses with UV400 protection. Titanium alloy frame.', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80', 'Fashion', 4.2, 1678, 100, NULL, 'UrbanStyle');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('Smart LED Desk Lamp', 44.99, 'Touch-dimming, 5 color modes, USB charging port. Eye-care technology.', 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=500&q=80', 'Home', 4.5, 2156, 55, NULL, 'HomeBright');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('Stainless Steel Water Bottle', 24.99, 'Triple-wall vacuum insulation. Keeps drinks cold 24h or hot 12h.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80', 'Home', 4.8, 5823, 200, NULL, 'EcoLife');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('Aromatic Candle Set', 34.99, 'Hand-poured soy wax candles. Set of 4 calming scents.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80', 'Home', 4.1, 734, 40, NULL, 'HomeBright');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('The Art of Programming', 39.99, 'A comprehensive guide to mastering algorithms and data structures.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80', 'Books', 4.9, 1245, 150, NULL, 'BookVault');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('Mindfulness Journal', 19.99, 'Guided daily journal for mindfulness and gratitude practice.', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80', 'Books', 4.3, 967, 120, NULL, 'BookVault');

INSERT INTO products (name, price, description, image_url, category, rating, review_count, stock, seller_id, seller_name) VALUES
('World Atlas Illustrated', 29.99, 'Beautifully illustrated atlas with detailed maps and geographic facts.', 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&q=80', 'Books', 4.6, 543, 75, NULL, 'BookVault');

-- =============================================
-- TEST USERS
-- =============================================
INSERT INTO users (name, email, password, phone, address, city, zip_code, created_at) VALUES
('John Doe', 'john@example.com', 'password123', '9876543210', '123 Main Street', 'Mumbai', '400001', NOW());

INSERT INTO users (name, email, password, phone, address, city, zip_code, created_at) VALUES
('Jane Smith', 'jane@example.com', 'password456', '9876543211', '456 Park Avenue', 'Delhi', '110001', NOW());
