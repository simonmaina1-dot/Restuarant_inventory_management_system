from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.inventory import Inventory
from app.models.product import Product

inventory_bp = Blueprint('inventory', __name__, url_prefix='/api/inventory')

@inventory_bp.route('/', methods=['GET'])
@jwt_required()
def get_inventory():
    inventories = Inventory.query.all()
    return jsonify([inv.to_dict() for inv in inventories])

@inventory_bp.route('/', methods=['POST'])
@jwt_required()
def create_inventory():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Validate required fields
    required = ['product_id', 'quantity', 'unit_price']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    # Check product exists
    product = Product.query.get(data['product_id'])
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    inventory = Inventory(
        product_id=data['product_id'],
        quantity=data['quantity'],
        unit_price=data['unit_price'],
        reorder_level=data.get('reorder_level', 0.0),
        location=data.get('location')
    )
    db.session.add(inventory)
    db.session.commit()
    return jsonify(inventory.to_dict()), 201

@inventory_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_inventory_item(id):
    inventory = Inventory.query.get(id)
    if not inventory:
        return jsonify({'error': 'Inventory not found'}), 404
    return jsonify(inventory.to_dict())

@inventory_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_inventory(id):
    inventory = Inventory.query.get(id)
    if not inventory:
        return jsonify({'error': 'Inventory not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    inventory.quantity = data.get('quantity', inventory.quantity)
    inventory.unit_price = data.get('unit_price', inventory.unit_price)
    inventory.reorder_level = data.get('reorder_level', inventory.reorder_level)
    inventory.location = data.get('location', inventory.location)
    inventory.updated_at = db.func.now()

    db.session.commit()
    return jsonify(inventory.to_dict())

@inventory_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_inventory(id):
    inventory = Inventory.query.get(id)
    if not inventory:
        return jsonify({'error': 'Inventory not found'}), 404

    db.session.delete(inventory)
    db.session.commit()
    return jsonify({'message': 'Inventory deleted successfully'})

@inventory_bp.route('/low-stock', methods=['GET'])
@jwt_required()
def get_low_stock():
    inventories = Inventory.query.filter(Inventory.quantity <= Inventory.reorder_level).all()
    return jsonify([inv.to_dict() for inv in inventories])

