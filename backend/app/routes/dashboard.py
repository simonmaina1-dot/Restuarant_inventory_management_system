from datetime import datetime

from flask import Blueprint, jsonify
from sqlalchemy import func
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.inventory import Inventory
from app.models.order import Order
from app.models.product import Product

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.get('/summary')
@jwt_required()
def get_dashboard_summary():
    total_products = db.session.query(func.count(Product.id)).scalar() or 0
    total_orders = db.session.query(func.count(Order.id)).scalar() or 0
    pending_orders = (
        db.session.query(func.count(Order.id))
        .filter(Order.status.in_(['pending', 'Cooking', 'Ready']))
        .scalar()
        or 0
    )
    total_revenue = (
        db.session.query(func.coalesce(func.sum(Order.total_amount), 0.0))
        .filter(Order.status != 'cancelled')
        .scalar()
        or 0.0
    )
    low_stock_items = (
        db.session.query(func.count(Inventory.id))
        .filter(Inventory.quantity <= func.coalesce(Inventory.reorder_level, 0))
        .scalar()
        or 0
    )
    inventory_value = (
        db.session.query(func.coalesce(func.sum(Inventory.quantity * Inventory.unit_price), 0.0))
        .scalar()
        or 0.0
    )

    recent_orders = (
        Order.query.order_by(Order.order_date.desc(), Order.id.desc()).limit(5).all()
    )

    inventory_alerts = (
        Inventory.query.filter(Inventory.quantity <= func.coalesce(Inventory.reorder_level, 0))
        .order_by(Inventory.quantity.asc(), Inventory.id.asc())
        .limit(5)
        .all()
    )

    return jsonify(
        {
            'generated_at': datetime.utcnow().isoformat(),
            'metrics': {
                'revenue': round(float(total_revenue), 2),
                'orders_served': total_orders,
                'low_stock_items': low_stock_items,
                'total_products': total_products,
                'pending_orders': pending_orders,
                'inventory_value': round(float(inventory_value), 2),
            },
            'recent_orders': [
                {
                    'id': order.id,
                    'label': f'#{order.id:04d}',
                    'table': f'User {order.user_id}',
                    'total': round(float(order.total_amount), 2),
                    'state': order.status.title(),
                    'order_date': order.order_date.isoformat() if order.order_date else None,
                }
                for order in recent_orders
            ],
            'inventory_alerts': [
                {
                    'id': item.id,
                    'item': item.product.name if item.product else f'Product {item.product_id}',
                    'amount': float(item.quantity),
                    'reorder_level': float(item.reorder_level or 0),
                    'status': 'Critical' if float(item.quantity) <= 0 else 'Low',
                }
                for item in inventory_alerts
            ],
        }
    )
