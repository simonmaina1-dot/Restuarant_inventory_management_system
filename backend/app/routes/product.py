from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.product import Product
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.inventory import Inventory

product_bp = Blueprint('product', __name__, url_prefix='/api/products')

@product_bp.route('/', methods=['GET'])
@jwt_required()
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])

@product_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    required = ['name', 'price', 'category_id', 'supplier_id']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400

    category = Category.query.get(data['category_id'])
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    supplier = Supplier.query.get(data['supplier_id'])
    if not supplier:
        return jsonify({'error': 'Supplier not found'}), 404

    # Check name unique
    if Product.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Product name must be unique'}), 400

    product = Product(
        name=data['name'],
        price=data['price'],
        category_id=data['category_id'],
        supplier_id=data['supplier_id']
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@product_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify(product.to_dict())

@product_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' in data:
        if Product.query.filter(Product.name == data['name'], Product.id != id).first():
            return jsonify({'error': 'Product name must be unique'}), 400
        product.name = data['name']

    if 'price' in data:
        product.price = data['price']

    if 'category_id' in data:
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        product.category_id = data['category_id']

    if 'supplier_id' in data:
        supplier = Supplier.query.get(data['supplier_id'])
        if not supplier:
            return jsonify({'error': 'Supplier not found'}), 404
        product.supplier_id = data['supplier_id']

    db.session.commit()
    return jsonify(product.to_dict())

@product_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'})

@product_bp.route('/available', methods=['GET'])
@jwt_required()
def get_available_products():
    # Products with inventory quantity > 0
    products = Product.query.join(Inventory).filter(Inventory.quantity > 0).all()
    return jsonify([product.to_dict() for product in products])

