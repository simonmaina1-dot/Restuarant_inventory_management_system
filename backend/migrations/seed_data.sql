-- Sample seed data for Dineflow SQLite database
-- Run with: sqlite3 instance/dineflow.db < seed_data.sql
-- Assumes standard tables from models: users, categories, suppliers, products, inventory, orders, order_items
-- Adjust if actual schema differs


-- 1. Insert users (admin and manager)
INSERT INTO users (username, password_hash, role) VALUES
('admin', 'pbkdf2:sha256:260000$example$hashforadminpass', 'admin'),
('manager', 'pbkdf2:sha256:260000$example$hashformanagerpass', 'manager'),
('waiter', 'pbkdf2:sha256:260000$example$hashforwaiterpass', 'waiter'),
('manager2', 'pbkdf2:sha256:260000$example$hashformanager2pass', 'manager'),
('waiter2', 'pbkdf2:sha256:260000$example$hashforwaiter2pass', 'waiter');

-- 2. Insert categories
INSERT INTO categories (name, description) VALUES
('Appetizers', 'Starters and small plates'),
('Main Courses', 'Primary dishes'),
('Desserts', 'Sweet endings'),
('Drinks', 'Beverages'),
('Salads', 'Healthy green salads'),
('Seafood', 'Fresh from the ocean'),
('Vegetarian', 'Plant-based options');

-- 3. Insert suppliers
INSERT INTO suppliers (name, contact_email, phone) VALUES
('Fresh Farms Produce', 'orders@freshfarms.com', '555-0101'),
('Ocean Foods Inc', 'sales@oceanfoods.com', '555-0102'),
('Sweet Delights Bakery', 'info@sweetdelights.com', '555-0103'),
('Meat Masters', 'orders@meatmasters.com', '555-0104'),
('Green Leaf Veggies', 'sales@greenleaf.com', '555-0105'),
('Spice World', 'info@spiceworld.com', '555-0106'),
('Dairy Delight', 'contact@dairydelight.com', '555-0107'),
('Beverage Corp', 'sales@beveragecorp.com', '555-0108');

-- 4. Insert products (menu items)
INSERT INTO products (name, price, category_id, supplier_id) VALUES
('Garlic Bread', 5.99, 1, 1),
('Caesar Salad', 8.99, 1, 1),
('Grilled Salmon', 18.99, 2, 2),
('Beef Burger', 14.99, 2, 1),
('Chocolate Cake', 6.99, 3, 3),
('Coca Cola', 2.50, 4, 1),
('Tomato Salad', 7.49, 5, 4),
('Grilled Shrimp', 22.99, 6, 2),
('Veggie Stir Fry', 12.99, 7, 6),
('Pasta Carbonara', 16.99, 2, 5),
('Steak', 28.99, 2, 4),
('Ice Cream', 4.99, 3, 7),
('Lemonade', 3.25, 4, 8),
('Quinoa Bowl', 11.99, 7, 5),
('Lobster Tail', 39.99, 6, 2),
('Cheese Pizza', 13.99, 2, 1),
('Apple Pie', 5.49, 3, 3);

-- 5. Insert inventory (initial stock levels)
INSERT INTO inventory (product_id, quantity, unit, transaction_type, transaction_date) VALUES
(1, 50, 'pieces', 'in', '2024-01-01'),
(2, 30, 'portions', 'in', '2024-01-01'),
(3, 20, 'portions', 'in', '2024-01-01'),
(4, 40, 'pieces', 'in', '2024-01-01'),
(5, 25, 'slices', 'in', '2024-01-01'),
(6, 100, 'cans', 'in', '2024-01-01'),
(7, 35, 'portions', 'in', '2024-01-01'),
(8, 28, 'portions', 'in', '2024-01-01'),
(9, 45, 'portions', 'in', '2024-01-01'),
(10, 22, 'portions', 'in', '2024-01-01'),
(11, 18, 'pieces', 'in', '2024-01-01'),
(12, 15, 'portions', 'in', '2024-01-01'),
(13, 60, 'scoops', 'in', '2024-01-01'),
(14, 80, 'glasses', 'in', '2024-01-01'),
(15, 32, 'bowls', 'in', '2024-01-01'),
(16, 12, 'tails', 'in', '2024-01-01'),
(17, 30, 'slices', 'in', '2024-01-01'),
(18, 25, 'slices', 'in', '2024-01-01');

-- 6. Insert orders
INSERT INTO orders (user_id, order_date, status, total_amount) VALUES
(2, '2024-01-15 12:30:00', 'completed', 35.47),
(3, '2024-01-15 18:45:00', 'pending', 21.49),
(1, '2024-01-16 11:20:00', 'completed', 52.97),
(4, '2024-01-16 14:30:00', 'cancelled', 0.00),
(5, '2024-01-16 19:10:00', 'completed', 68.46),
(2, '2024-01-17 13:00:00', 'pending', 41.98);

-- 7. Insert order_items (with inventory deduction logic implied in app)
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 5.99),
(1, 3, 1, 18.99),
(1, 6, 1, 2.50),
(2, 4, 1, 14.99),
(2, 5, 1, 6.99),
(2, 2, 1, 8.99),
(3, 7, 1, 7.49),
(3, 10, 2, 12.99),
(4, 1, 39.99),
(4, 12, 1, 28.99),
(4, 13, 2, 3.25),
(5, 9, 1, 11.99),
(5, 15, 1, 39.99),
(5, 16, 3, 13.99),
(6, 11, 1, 16.99),
(6, 17, 1, 5.49),
(6, 8, 2, 22.99);

-- Verify inserts (updated for new data)
-- SELECT COUNT(*) as user_count FROM users;
-- SELECT COUNT(*) as category_count FROM categories;
-- SELECT COUNT(*) as supplier_count FROM suppliers;
-- SELECT COUNT(*) as product_count FROM products;
-- SELECT COUNT(*) as inventory_count FROM inventory;
-- SELECT COUNT(*) as order_count FROM orders;
-- SELECT COUNT(*) as order_item_count FROM order_items;
-- SELECT * FROM users LIMIT 5;
-- SELECT * FROM categories;
-- SELECT * FROM suppliers LIMIT 5;
-- SELECT p.name, p.price, c.name as category, s.name as supplier FROM products p JOIN categories c ON p.category_id=c.id JOIN suppliers s ON p.supplier_id=s.id LIMIT 10;
-- SELECT i.*, p.name FROM inventory i JOIN products p ON i.product_id = p.id LIMIT 5;
-- SELECT o.*, u.username FROM orders o JOIN users u ON o.user_id = u.id;
-- SELECT oi.*, p.name FROM order_items oi JOIN products p ON oi.product_id = p.id LIMIT 10;

