from flask_jwt_extended import create_refresh_token, jwt_required, get_jwt
from app.models.users import User
from flask import jsonify, current_app

def create_tokens(user):
    """Create access and refresh tokens for user"""
    access_token = current_app.jwt_manager.create_access_token(
        identity=user.id,
        additional_claims={'role': user.role}
    )
    refresh_token = create_refresh_token(identity=user.id)
    return {'access_token': access_token, 'refresh_token': refresh_token}

@jwt_required(refresh=True)
def refresh_access_token():
    """Refresh access token using refresh token"""
    current_user = get_jwt()['sub']
    user = User.query.get(current_user)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    access_token = current_app.jwt_manager.create_access_token(
        identity=user.id,
        additional_claims={'role': user.role}
    )
    return jsonify({'access_token': access_token})

def get_current_user():
    """Get current authenticated user from JWT"""
    from flask import g
    if hasattr(g, 'current_user'):
        return g.current_user
    
    from flask_jwt_extended import get_jwt_identity
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        g.current_user = user
    return user

def require_role(role):
    """Simple role check helper"""
    user = get_current_user()
    if not user or user.role != role:
        return None
    return user

