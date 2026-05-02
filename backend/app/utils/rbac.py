from functools import wraps
from flask import jsonify, g
from flask_jwt_extended import get_jwt_identity, jwt_required

def role_required(*allowed_roles):
    """
    Decorator to enforce role-based access control
    
    Usage:
    @role_required('admin')
    @role_required('admin', 'manager')  
    @role_required()  # admin only (default)
    """
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            from app.models.users import User
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Default to admin-only if no roles specified
            required_roles = allowed_roles if allowed_roles else ['admin']
            
            if user.role not in required_roles:
                return jsonify({
                    'error': f'Role {user.role} not authorized. Required: {required_roles}'
                }), 403
            
            g.current_user = user
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Role hierarchy check
def can_perform_action(required_role, user_role):
    """Check if user role can perform action requiring specific role"""
    role_hierarchy = {
        'admin': 3,
        'manager': 2, 
        'waiter': 1
    }
    return role_hierarchy.get(user_role, 0) >= role_hierarchy.get(required_role, 0)

