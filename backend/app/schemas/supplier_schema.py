from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.supplier import Supplier

class SupplierSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Supplier
        load_instance = True

supplier_schema = SupplierSchema()
suppliers_schema = SupplierSchema(many=True)
