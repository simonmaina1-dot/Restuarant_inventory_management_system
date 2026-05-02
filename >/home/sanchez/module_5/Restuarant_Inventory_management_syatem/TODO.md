# Fix Pylance Errors in Inventory Model

## Issues
1. `self.product` unknown (backref not detected by Pylance)
2. `float(None)` type errors in `to_dict()`

## Steps
- [ ] Step 1: Update `backend/app/models/inventory.py` — add explicit relationship and null-safe float conversions
- [ ] Step 2: Update `backend/app/models/product.py` — change `backref` to `back_populates`
- [ ] Step 3: Update `backend/app/routes/dashboard.py` — fix unsafe `float()` patterns

