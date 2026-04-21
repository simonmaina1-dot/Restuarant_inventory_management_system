from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.users import User

order_bp = Blueprint('order', __name__, url_prefix='/api/orders')

@order_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders])

@order_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    data = request.get_json()
    if not data or 'items' not in data:
        return jsonify({'error': 'Order data and items required'}), 400

    user_id = data.get('user_id')
    if not User.query.get(user_id):
        return jsonify({'error': 'User not found'}), 404

    order = Order(
        user_id=user_id,
        status='pending'
    )
    db.session.add(order)
    db.session.flush()  # Get order.id

    total_amount = 0.0
    for item_data in data['items']:
        product_id = item_data['product_id']
        quantity = item_data['quantity']

        product = Product.query.get(product_id)
        if not product:
            db.session.rollback()
            return jsonify({'error': f'Product {product_id} not found'}), 404

        inventory = Inventory.query.filter_by(product_id=product_id).first()
        if not inventory or inventory.quantity < quantity:
            db.session.rollback()
            return jsonify({'error': f'Insufficient stock for product {product_id}'}), 400

        unit_price = inventory.unit_price  # Snapshot price
        total_amount += quantity * unit_price

        order_item = OrderItem(
            order_id=order.id,
            product_id=product_id,
            quantity=quantity,
            unit_price=unit_price
        )
        db.session.add(order_item)

        # Deduct from inventory
        inventory.quantity -= quantity

    order.total_amount = total_amount
    db.session.commit()
    return jsonify(order.to_dict()), 201

@order_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify(order.to_dict())

@order_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'status' in data:
        order.status = data['status']
    db.session.commit()
    return jsonify(order.to_dict())

@order_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    # Note: In real app, only allow delete if pending; restore inventory if needed
    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': 'Order deleted successfully'})

@order_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_orders(user_id):
    orders = Order.query.filter_by(user_id=user_id).all()
    return jsonify([order.to_dict() for order in orders])

