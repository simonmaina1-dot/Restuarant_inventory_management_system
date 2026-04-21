from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base product schema with core fields
class ProductBase(BaseModel):
    name: str
    price: float
    category_id: int
    supplier_id: int

# Schema for creating a new product (what client sends to POST /products)
class ProductCreate(ProductBase):
    pass

# Schema for full product data (what server sends back)
class Product(ProductBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

# Schema for updating a product (partial updates, e.g. PATCH /products/{id})
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    supplier_id: Optional[int] = None

