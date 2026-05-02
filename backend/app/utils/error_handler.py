from flask import jsonify, request
from werkzeug.exceptions import NotFound, BadRequest
from app.extensions import db

def register_error_handlers(app):
    """Register custom error handlers"""
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Resource not found',
            'message': str(error),
            'path': request.path,
            'method': request.method
        }), 404
    
    @app.errorhandler(422)
    def unprocessable_entity(error):
        return jsonify({
            'error': 'Unprocessable Entity',
            'message': 'Validation failed',
            'details': error.description,
            'path': request.path
        }), 422
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Bad Request',
            'message': str(error),
            'path': request.path
        }), 400
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            'error': 'Forbidden',
            'message': 'Insufficient permissions',
            'path': request.path
        }), 403
    
    @app.errorhandler(500)
    def internal_server_error(error):
        db.session.rollback()
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'Something went wrong',
            'path': request.path
        }), 500
    
    @app.errorhandler(Exception)
    def handle_generic(error):
        db.session.rollback()
        return jsonify({
            'error': 'Unexpected Error',
            'message': str(error),
            'path': request.path
        }), 500

# Database session error handler
# Database session cleanup should be handled by Flask-SQLAlchemy automatically
# db.session.remove() is now managed by extensions.py setup

