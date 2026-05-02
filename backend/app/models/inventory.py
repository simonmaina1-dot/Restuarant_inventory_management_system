from app.extensions import db
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped

if TYPE_CHECKING:
    from app.models.product import Product

# Inventory model
class Inventory(db.Model):
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Float, default=0.0, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    reorder_level = db.Column(db.Float, default=0.0)
    location = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Explicit relationship for type checking
    product: Mapped["Product"] = db.relationship("Product", back_populates="inventory", lazy=True)
    
    def __init__(self, product_id=None, quantity=None, unit_price=None, reorder_level=0.0, location=None, **kwargs):
        super().__init__(**kwargs)
        self.product_id = product_id
        self.quantity = quantity
        self.unit_price = unit_price
        self.reorder_level = reorder_level
        self.location = location

    def __repr__(self):
        return f'<Inventory {self.id} - {self.product.name if self.product else "No Product"}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'quantity': float(self.quantity or 0.0),
            'unit_price': float(self.unit_price or 0.0),
            'reorder_level': float(self.reorder_level or 0.0),
            'location': self.location,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'product': self.product.to_dict() if self.product else None,
            'product_name': self.product.name if self.product else f'Product {self.product_id}',
            'supplier_name': self.product.supplier.name if self.product and hasattr(self.product, 'supplier') and self.product.supplier else 'No supplier'
        }
