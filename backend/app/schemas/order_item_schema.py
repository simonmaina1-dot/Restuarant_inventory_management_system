from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.order_item import OrderItem

class OrderItemSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = OrderItem
        load_instance = True

order_item_schema = OrderItemSchema()
order_items_schema = OrderItemSchema(many=True)
