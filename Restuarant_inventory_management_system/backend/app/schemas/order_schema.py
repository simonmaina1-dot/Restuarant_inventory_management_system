# Order schemas for FastAPI - defines data structure for requests and responses
# Uses Pydantic BaseModel for validation
>>>>>>> Stashed changes
=======
# Order schemas for FastAPI - defines data structure for requests and responses
# Uses Pydantic BaseModel for validation
=======
# Order schemas for FastAPI - defines data structure for requests and responses
# Uses Pydantic BaseModel for validation
>>>>>>> Stashed changes

from pydantic import BaseModel
from typing import List, Optional

from marshmallow import Schema, fields, post_load
from app.models.order import Order

# Schema for individual item in an order (product and how many)
class OrderItem(BaseModel):
    product_id: int  # ID of the product
    quantity: int    # Number of this product in the order

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    order_date = fields.DateTime(dump_only=True)
    status = fields.Str()
    total_amount = fields.Float()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @post_load
    def make_order(self, data, **kwargs):
        return Order(**data)

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

# Schema for creating a new order (what data client sends to POST /orders)
class OrderCreate(BaseModel):
    user_id: int      # Who placed the order
    status: str = 'pending'  # Order status, defaults to pending
    items: List[OrderItem]   # List of items in this order

# Schema for full order data (what server sends back, includes ID and dates)
class Order(BaseModel):
    id: int          # Unique order ID
    user_id: int     # Who placed the order
    order_date: str  # When order was placed
    status: str      # Current status
    total_amount: float  # Total price
    created_at: str  # When created
    updated_at: str  # When last updated
    items: List[OrderItem] = []  # Items in order

# Schema for updating an order (e.g. change status to 'completed')
class OrderUpdate(BaseModel):
    status: str | None = None  # New status, optional
