from marshmallow import Schema, fields, post_load
from app.models.category import Category

class CategorySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    description = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @post_load
    def make_category(self, data, **kwargs):
        return Category(**data)

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
