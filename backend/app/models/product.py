# Product model
from app.extensions import db
from datetime import datetime
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.inventory import Inventory
    from app.models.order_item import OrderItem

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(255), nullable=True)  # Image URL field
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False) #foreign key
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)#foreign key --links tehm to respective tables..
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships with back_populates for proper bidirectional relationship
    inventory = db.relationship('Inventory', back_populates='product', lazy=True)
    order_items = db.relationship('OrderItem', back_populates='product', lazy=True)

    def __repr__(self):
        return f'<Product {self.name}>'

    def to_dict(self):
        inventory_item = self.inventory[0] if self.inventory else None
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'image': self.image,
            'category_id': self.category_id,
            'supplier_id': self.supplier_id,
            'stock': inventory_item.quantity if inventory_item else 0,
            'category': self.category.to_dict() if self.category else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
