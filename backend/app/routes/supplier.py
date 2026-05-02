# Supplier routes
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.supplier import Supplier
from app.schemas.supplier_schema import supplier_schema, suppliers_schema

supplier_bp = Blueprint('supplier', __name__)


@supplier_bp.route('/', methods=['GET'])
@jwt_required()
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify([sup.to_dict() for sup in suppliers])


@supplier_bp.route('/', methods=['POST'])
@jwt_required()
def create_supplier():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' not in data:
        return jsonify({'error': 'name is required'}), 400

    # Check name unique
    if Supplier.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Supplier name must be unique'}), 400

    supplier = Supplier(
        name=data['name'],
        contact_email=data.get('contact_email', ''),
        phone=data.get('phone', '')
    )
    db.session.add(supplier)
    db.session.commit()
    return jsonify(supplier.to_dict()), 201


@supplier_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_supplier(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({'error': 'Supplier not found'}), 404
    return jsonify(supplier.to_dict())


@supplier_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_supplier(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({'error': 'Supplier not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' in data:
        # Check name unique excluding current
        existing = Supplier.query.filter(
            Supplier.name == data['name'], 
            Supplier.id != id
        ).first()
        if existing:
            return jsonify({'error': 'Supplier name must be unique'}), 400
        supplier.name = data['name']

    if 'contact_email' in data:
        supplier.contact_email = data['contact_email']

    if 'phone' in data:
        supplier.phone = data['phone']

    db.session.commit()
    return jsonify(supplier.to_dict())


@supplier_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_supplier(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({'error': 'Supplier not found'}), 404

    # Check if supplier has products
    if supplier.products:
        return jsonify({'error': 'Cannot delete supplier with products'}), 400

    db.session.delete(supplier)
    db.session.commit()
    return jsonify({'message': 'Supplier deleted successfully'})
