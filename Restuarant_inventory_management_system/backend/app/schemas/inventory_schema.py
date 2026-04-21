# Inventory schemas for FastAPI - defines data structure for requests and responses
# Uses Pydantic BaseModel for validation. Matches order_schema.py style.

from pydantic import BaseModel

# Schema for creating/updating inventory (what client sends)
class InventoryCreate(BaseModel):
    product_id: int     # ID of the product this inventory is for
    quantity: float     # Current stock quantity
    unit_price: float   # Price per unit
    reorder_level: float = 0.0  # Level when to reorder
    location: str | None = None  # Storage location (optional)

# Schema for full inventory data (what server sends back)
class Inventory(InventoryCreate):
    id: int             # Unique inventory ID
    created_at: str     # When record was created
    updated_at: str     # When last updated

# For partial updates (e.g. PATCH /inventory/{id})
class InventoryUpdate(BaseModel):
    quantity: float | None = None
    unit_price: float | None = None
    reorder_level: float | None = None
    location: str | None = None
