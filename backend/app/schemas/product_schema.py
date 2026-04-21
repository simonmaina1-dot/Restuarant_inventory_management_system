from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.product import Product
from app.schemas.category_schema import CategorySchema
from app.schemas.supplier_schema import SupplierSchema

class ProductSchema(SQLAlchemyAutoSchema):
    category = fields.Nested(CategorySchema, only=('id', 'name'))
    supplier = fields.Nested(SupplierSchema, only=('id', 'name'))
    
    class Meta:
        model = Product
        load_instance = True
        include_relationships = True

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
