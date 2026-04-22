from __future__ import annotations

from datetime import datetime
from pathlib import Path
import ast
import re


SEED_FILE = Path(__file__).resolve().parents[2] / 'migrations' / 'seed_data.sql'
INSERT_PATTERN = re.compile(
    r"INSERT INTO\s+(?P<table>\w+)\s*\((?P<columns>[^)]+)\)\s*VALUES\s*(?P<values>.*?);",
    re.IGNORECASE | re.DOTALL,
)
TUPLE_PATTERN = re.compile(r"\((.*?)\)", re.DOTALL)


def _coerce_value(value):
    if isinstance(value, str):
      return value.strip()
    return value


def _parse_insert_block(match):
    table = match.group('table').lower()
    columns = [column.strip() for column in match.group('columns').split(',')]
    raw_values = match.group('values')
    rows = []

    for tuple_match in TUPLE_PATTERN.finditer(raw_values):
        tuple_text = tuple_match.group(1)
        normalized = tuple_text.replace('NULL', 'None')
        values = ast.literal_eval(f'({normalized})')
        if not isinstance(values, tuple):
            values = (values,)
        rows.append({column: _coerce_value(value) for column, value in zip(columns, values)})

    return table, rows


def _load_seed_tables():
    sql_text = SEED_FILE.read_text(encoding='utf-8')
    tables = {}

    for match in INSERT_PATTERN.finditer(sql_text):
        table, rows = _parse_insert_block(match)
        tables[table] = rows

    return tables


def _format_inventory_rows(products, categories, suppliers, inventory_rows):
    formatted_rows = []

    for index, row in enumerate(inventory_rows, start=1):
        product = products.get(row['product_id'])
        category = categories.get(product['category_id']) if product else None
        supplier = suppliers.get(product['supplier_id']) if product else None
        reorder_level = max(10, int(row['quantity'] * 0.25))

        formatted_rows.append(
            {
                'id': index,
                'product_id': row['product_id'],
                'name': product['name'] if product else 'Unknown Product',
                'category': category['name'] if category else 'Uncategorized',
                'supplier': supplier['name'] if supplier else 'Unknown Supplier',
                'stock': float(row['quantity']),
                'unit': row['unit'],
                'reorder_level': reorder_level,
                'status': 'Reorder now' if row['quantity'] <= reorder_level else 'Healthy',
                'transaction_type': row['transaction_type'],
                'transaction_date': row['transaction_date'],
            }
        )

    return formatted_rows


def _format_products(products, categories, suppliers, inventory_rows, order_items):
    inventory_map = {row['product_id']: row for row in inventory_rows}
    sold_quantities = {}

    for item in order_items:
        sold_quantities[item['product_id']] = sold_quantities.get(item['product_id'], 0) + int(item['quantity'])

    ranked_sales = sorted(sold_quantities.items(), key=lambda entry: entry[1], reverse=True)
    bestseller_ids = {product_id for product_id, _ in ranked_sales[:4]}

    formatted_rows = []
    for product_id, product in products.items():
        category = categories.get(product['category_id'])
        supplier = suppliers.get(product['supplier_id'])
        inventory = inventory_map.get(product_id, {})

        formatted_rows.append(
            {
                'id': product_id,
                'name': product['name'],
                'price': float(product['price']),
                'category': category['name'] if category else 'Uncategorized',
                'category_id': product['category_id'],
                'supplier': supplier['name'] if supplier else 'Unknown Supplier',
                'supplier_id': product['supplier_id'],
                'stock': float(inventory.get('quantity', 0)),
                'unit': inventory.get('unit'),
                'popular': product_id in bestseller_ids,
            }
        )

    return formatted_rows


def _format_categories(categories, products):
    counts = {}
    for product in products.values():
        counts[product['category_id']] = counts.get(product['category_id'], 0) + 1

    return [
        {
            'id': category_id,
            'name': category['name'],
            'description': category['description'],
            'items': counts.get(category_id, 0),
        }
        for category_id, category in categories.items()
    ]


def _format_orders(orders, users, order_items, products):
    grouped_items = {}
    for item in order_items:
        grouped_items.setdefault(item['order_id'], []).append(item)

    formatted_rows = []
    for order in orders:
        items = grouped_items.get(order['id'], [])
        item_names = []
        for item in items:
            product = products.get(item['product_id'])
            if not product:
                continue
            item_names.append(f"{item['quantity']}x {product['name']}")

        order_time = None
        if order.get('order_date'):
            try:
                order_time = datetime.fromisoformat(order['order_date']).strftime('%H:%M')
            except ValueError:
                order_time = order['order_date']

        formatted_rows.append(
            {
                'id': order['id'],
                'user_id': order['user_id'],
                'server': users.get(order['user_id'], {}).get('username', 'Unknown'),
                'order_date': order['order_date'],
                'time': order_time,
                'status': str(order['status']).capitalize(),
                'total': float(order['total_amount']),
                'items': ', '.join(item_names) if item_names else 'No items',
                'item_count': sum(int(item['quantity']) for item in items),
                'table': order['id'],
            }
        )

    return formatted_rows


def _format_users(users):
    formatted_rows = []
    for user in users.values():
        formatted_rows.append(
            {
                'id': user['id'],
                'username': user['username'],
                'role': user['role'],
                'email': f"{user['username']}@restaurant.com",
            }
        )

    return formatted_rows


def get_seed_dataset():
    tables = _load_seed_tables()

    users = {index: {'id': index, **row} for index, row in enumerate(tables.get('users', []), start=1)}
    categories = {index: {'id': index, **row} for index, row in enumerate(tables.get('categories', []), start=1)}
    suppliers = {index: {'id': index, **row} for index, row in enumerate(tables.get('suppliers', []), start=1)}
    products = {index: {'id': index, **row} for index, row in enumerate(tables.get('products', []), start=1)}

    inventory_rows = []
    for index, row in enumerate(tables.get('inventory', []), start=1):
        if 'unit_price' not in row:
            row['unit_price'] = float(products.get(row['product_id'], {}).get('price', 0))
        if 'reorder_level' not in row:
            row['reorder_level'] = max(10, int(float(row['quantity']) * 0.25))
        inventory_rows.append({'id': index, **row})

    orders = [{'id': index, **row} for index, row in enumerate(tables.get('orders', []), start=1)]

    order_items = []
    for index, row in enumerate(tables.get('order_items', []), start=1):
        normalized = {'id': index, **row}
        if 'price' not in normalized:
            normalized['price'] = float(products.get(normalized['product_id'], {}).get('price', 0))
            normalized['quantity'] = 1
        order_items.append(normalized)

    return {
        'users': _format_users(users),
        'categories': _format_categories(categories, products),
        'suppliers': list(suppliers.values()),
        'products': _format_products(products, categories, suppliers, inventory_rows, order_items),
        'inventory': _format_inventory_rows(products, categories, suppliers, inventory_rows),
        'orders': _format_orders(orders, users, order_items, products),
    }


def find_user(login_value):
    normalized = (login_value or '').strip().lower()
    if not normalized:
        return None

    for user in get_seed_dataset()['users']:
        if normalized in {user['username'].lower(), user['email'].lower()}:
            return user

    return None
