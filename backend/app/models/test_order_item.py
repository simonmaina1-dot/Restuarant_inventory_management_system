#!/usr/bin/env python3
# Standalone test for OrderItem model with proper Flask app context
import os
import sys
import subprocess



sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from app import create_app
from app.extensions import db
from order_item import OrderItem

app = create_app()
with app.app_context():
    db.create_all()  # Create tables if needed
    print("✅ OrderItem model loaded successfully!")
    print(OrderItem.__tablename__)
    print("Test instance:", OrderItem(quantity=2, unit_price=10.99))
    
print("Done. Full app at http://127.0.0.1:5000")

