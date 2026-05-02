# Categories routes
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.category import Category

categories_bp = Blueprint('categories', __name__)


@categories_bp.route('/', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([cat.to_dict() for cat in categories])


@categories_bp.route('/', methods=['POST'])
@jwt_required()
def create_category():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' not in data:
        return jsonify({'error': 'name is required'}), 400

    # Check name unique
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Category name must be unique'}), 400

    category = Category(
        name=data['name'],
        description=data.get('description', '')
    )
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201


@categories_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    return jsonify(category.to_dict())


@categories_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' in data:
        # Check name unique excluding current
        existing = Category.query.filter(
            Category.name == data['name'], 
            Category.id != id
        ).first()
        if existing:
            return jsonify({'error': 'Category name must be unique'}), 400
        category.name = data['name']

    if 'description' in data:
        category.description = data['description']

    db.session.commit()
    return jsonify(category.to_dict())


@categories_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    # Check if category has products
    if category.products:
        return jsonify({'error': 'Cannot delete category with products'}), 400

    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted successfully'})
