"""Seed script for DineFlow database.

Run from repo root:
    cd backend && source venv/bin/activate && python migrations/seed.py
"""

import sys
import os

# Ensure the backend folder is on the path so `from app import ...` works
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from werkzeug.security import generate_password_hash
from app import create_app
from app.extensions import db
from app.models.users import User
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.order import Order
from app.models.order_item import OrderItem
from datetime import datetime

app = create_app()

SEED_USERS = [
    {"username": "admin", "password": "admin", "role": "admin"},
    {"username": "manager", "password": "password", "role": "manager"},
    {"username": "waiter", "password": "waiter", "role": "waiter"},
]

SEED_CATEGORIES = [
    {"name": "Appetizers", "description": "Starters and small plates"},
    {"name": "Main Courses", "description": "Primary dishes"},
    {"name": "Desserts", "description": "Sweet endings"},
    {"name": "Drinks", "description": "Beverages"},
    {"name": "Salads", "description": "Healthy green salads"},
    {"name": "Seafood", "description": "Fresh from the ocean"},
    {"name": "Vegetarian", "description": "Plant-based options"},
]

SEED_SUPPLIERS = [
    {"name": "Fresh Farms Produce", "contact_email": "orders@freshfarms.com", "phone": "555-0101"},
    {"name": "Ocean Foods Inc", "contact_email": "sales@oceanfoods.com", "phone": "555-0102"},
    {"name": "Sweet Delights Bakery", "contact_email": "info@sweetdelights.com", "phone": "555-0103"},
    {"name": "Meat Masters", "contact_email": "orders@meatmasters.com", "phone": "555-0104"},
    {"name": "Green Leaf Veggies", "contact_email": "sales@greenleaf.com", "phone": "555-0105"},
    {"name": "Spice World", "contact_email": "info@spiceworld.com", "phone": "555-0106"},
    {"name": "Dairy Delight", "contact_email": "contact@dairydelight.com", "phone": "555-0107"},
    {"name": "Beverage Corp", "contact_email": "sales@beveragecorp.com", "phone": "555-0108"},
]

SEED_PRODUCTS = [
    {"name": "Garlic Bread", "price": 5.99, "category_id": 1, "supplier_id": 1},
    {"name": "Caesar Salad", "price": 8.99, "category_id": 1, "supplier_id": 1},
    {"name": "Grilled Salmon", "price": 18.99, "category_id": 2, "supplier_id": 2},
    {"name": "Beef Burger", "price": 14.99, "category_id": 2, "supplier_id": 1},
    {"name": "Chocolate Cake", "price": 6.99, "category_id": 3, "supplier_id": 3},
    {"name": "Coca Cola", "price": 2.50, "category_id": 4, "supplier_id": 1},
    {"name": "Tomato Salad", "price": 7.49, "category_id": 5, "supplier_id": 4},
    {"name": "Grilled Shrimp", "price": 22.99, "category_id": 6, "supplier_id": 2},
    {"name": "Veggie Stir Fry", "price": 12.99, "category_id": 7, "supplier_id": 6},
    {"name": "Pasta Carbonara", "price": 16.99, "category_id": 2, "supplier_id": 5},
    {"name": "Steak", "price": 28.99, "category_id": 2, "supplier_id": 4},
    {"name": "Ice Cream", "price": 4.99, "category_id": 3, "supplier_id": 7},
    {"name": "Lemonade", "price": 3.25, "category_id": 4, "supplier_id": 8},
    {"name": "Quinoa Bowl", "price": 11.99, "category_id": 7, "supplier_id": 5},
    {"name": "Lobster Tail", "price": 39.99, "category_id": 6, "supplier_id": 2},
    {"name": "Cheese Pizza", "price": 13.99, "category_id": 2, "supplier_id": 1},
    {"name": "Apple Pie", "price": 5.49, "category_id": 3, "supplier_id": 3},
]

SEED_INVENTORY = [
    # product_id, quantity, unit_price, reorder_level, location
    (1, 50, 3.00, 10, "Cold storage"),
    (2, 30, 4.50, 8, "Kitchen"),
    (3, 20, 12.00, 5, "Kitchen"),
    (4, 40, 8.00, 10, "Kitchen"),
    (5, 25, 3.50, 5, "Dessert counter"),
    (6, 100, 1.20, 20, "Beverage fridge"),
    (7, 35, 4.00, 8, "Kitchen"),
    (8, 28, 15.00, 5, "Kitchen"),
    (9, 45, 7.00, 10, "Kitchen"),
    (10, 22, 10.00, 5, "Kitchen"),
    (11, 18, 20.00, 4, "Walk-in freezer"),
    (12, 60, 2.50, 10, "Freezer"),
    (13, 80, 1.50, 15, "Beverage fridge"),
    (14, 32, 6.00, 8, "Kitchen"),
    (15, 12, 25.00, 3, "Live tank"),
    (16, 30, 8.50, 8, "Kitchen"),
    (17, 25, 3.00, 5, "Dessert counter"),
]

SEED_ORDERS = [
    # user_id, order_date, status, total_amount
    (2, "2024-01-15 12:30:00", "completed", 35.47),
    (3, "2024-01-15 18:45:00", "pending", 21.49),
    (1, "2024-01-16 11:20:00", "completed", 52.97),
    (2, "2024-01-16 14:30:00", "cancelled", 0.00),
    (3, "2024-01-16 19:10:00", "completed", 68.46),
    (2, "2024-01-17 13:00:00", "pending", 41.98),
]

SEED_ORDER_ITEMS = [
    # order_id, product_id, quantity, unit_price
    (1, 1, 2, 5.99),
    (1, 3, 1, 18.99),
    (1, 6, 1, 2.50),
    (2, 4, 1, 14.99),
    (2, 5, 1, 6.99),
    (2, 2, 1, 8.99),
    (3, 7, 1, 7.49),
    (3, 10, 2, 16.99),
    (4, 15, 1, 39.99),
    (4, 11, 1, 28.99),
    (4, 13, 2, 3.25),
    (5, 9, 1, 12.99),
    (5, 15, 1, 39.99),
    (5, 16, 3, 13.99),
    (6, 10, 1, 16.99),
    (6, 17, 1, 5.49),
    (6, 8, 2, 22.99),
]


def seed():
    with app.app_context():
        # Clear existing data (respect FK order)
        print("Clearing existing data...")
        db.session.query(OrderItem).delete()
        db.session.query(Order).delete()
        db.session.query(Inventory).delete()
        db.session.query(Product).delete()
        db.session.query(Category).delete()
        db.session.query(Supplier).delete()
        db.session.query(User).delete()
        db.session.commit()

        print("Seeding users...")
        user_map = {}
        for u in SEED_USERS:
            user = User(
                username=u["username"],
                password_hash=generate_password_hash(u["password"]),
                role=u["role"],
            )
            db.session.add(user)
            db.session.flush()
            user_map[u["username"]] = user.id
            print(f"  -> {u['username']} ({u['role']}) id={user.id}")

        print("Seeding categories...")
        for c in SEED_CATEGORIES:
            cat = Category(name=c["name"], description=c["description"])
            db.session.add(cat)
        db.session.flush()

        print("Seeding suppliers...")
        for s in SEED_SUPPLIERS:
            sup = Supplier(
                name=s["name"],
                contact_email=s["contact_email"],
                phone=s["phone"],
            )
            db.session.add(sup)
        db.session.flush()

        print("Seeding products...")
        for p in SEED_PRODUCTS:
            prod = Product(
                name=p["name"],
                price=p["price"],
                category_id=p["category_id"],
                supplier_id=p["supplier_id"],
            )
            db.session.add(prod)
        db.session.flush()

        print("Seeding inventory...")
        for inv in SEED_INVENTORY:
            inventory = Inventory(
                product_id=inv[0],
                quantity=inv[1],
                unit_price=inv[2],
                reorder_level=inv[3],
                location=inv[4],
            )
            db.session.add(inventory)
        db.session.flush()

        print("Seeding orders...")
        order_map = {}
        for o in SEED_ORDERS:
            order = Order(
                user_id=o[0],
                order_date=datetime.strptime(o[1], "%Y-%m-%d %H:%M:%S"),
                status=o[2],
                total_amount=o[3],
            )
            db.session.add(order)
            db.session.flush()
            order_map[o] = order.id

        print("Seeding order items...")
        for oi in SEED_ORDER_ITEMS:
            item = OrderItem(
                order_id=oi[0],
                product_id=oi[1],
                quantity=oi[2],
                unit_price=oi[3],
            )
            db.session.add(item)

        db.session.commit()
        print("\nDatabase seeded successfully!")
        print("Login credentials:")
        print("  admin / admin")
        print("  manager / password")
        print("  waiter / waiter")


if __name__ == "__main__":
    seed()

