#!/usr/bin/env python3
import os
import sys
import subprocess

# Auto-activate venv if not active (fixes flask_sqlalchemy import)
if 'venv' not in sys.executable:
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    venv_path = os.path.join(backend_dir, 'venv')
    subprocess.run([os.path.join(venv_path, 'bin', 'python'), __file__])
    sys.exit(0)

app_dir = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, app_dir)
from extensions import db
from datetime import datetime
from sqlalchemy import func

# OrderItem model - Junction table linking Orders and Products
class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    # Unique identifier for the order item
    id = db.Column(db.Integer, primary_key=True)
    # Foreign key to Orders table
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    # Foreign key to Products table
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    # Quantity of the product in this order
    quantity = db.Column(db.Integer, nullable=False, default=1)
    # Price per unit at the time of the order (snapshot price)
    unit_price = db.Column(db.Float, nullable=False)
    # Timestamp when created
    created_at = db.Column(db.DateTime, default=func.utcnow())
    # Timestamp when last updated
    updated_at = db.Column(db.DateTime, default=func.utcnow(), onupdate=func.utcnow())
    
    # Relationship to parent Order
    order = db.relationship('Order', backref='order_items', lazy=True)
    # Relationship to Product
    product = db.relationship('Product', backref='order_items', lazy=True)
    
    def __repr__(self):
        return f'<OrderItem {self.id} - {self.product.name if self.product else "No Product"}>'
    
    def to_dict(self):
        # Convert to dictionary for JSON serialization
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
