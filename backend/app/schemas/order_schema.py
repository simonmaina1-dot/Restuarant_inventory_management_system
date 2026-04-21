from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.order import Order
from app.schemas.order_item_schema import OrderItemSchema

class OrderSchema(SQLAlchemyAutoSchema):
    order_items = fields.Nested(OrderItemSchema, many=True, only=('id', 'product_id', 'quantity'))
    
    class Meta:
        model = Order
        load_instance = True

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
