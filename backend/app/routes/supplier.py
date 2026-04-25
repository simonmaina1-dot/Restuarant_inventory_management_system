# Supplier routes
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.supplier import Supplier

supplier_bp = Blueprint('supplier', __name__)

@supplier_bp.route('/', methods=['GET'])
@jwt_required()
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify([sup.to_dict() for sup in suppliers])


