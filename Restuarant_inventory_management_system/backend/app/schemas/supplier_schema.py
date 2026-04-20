from marshmallow import Schema, fields, post_load
from app.models.supplier import Supplier

class SupplierSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    contact_email = fields.Email(required=True)
    phone = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @post_load
    def make_supplier(self, data, **kwargs):
        return Supplier(**data)

supplier_schema = SupplierSchema()
suppliers_schema = SupplierSchema(many=True)