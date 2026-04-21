# Order schema
from marshmallow import Schema, fields, post_load
from app.models.order import Order

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

