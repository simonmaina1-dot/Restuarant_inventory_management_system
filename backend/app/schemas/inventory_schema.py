from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.inventory import Inventory
from app.schemas.product_schema import ProductSchema

class InventorySchema(SQLAlchemyAutoSchema):
    product = fields.Nested(ProductSchema, only=('id', 'name'))
    
    class Meta:
        model = Inventory
        load_instance = True

inventory_schema = InventorySchema()
inventories_schema = InventorySchema(many=True)
