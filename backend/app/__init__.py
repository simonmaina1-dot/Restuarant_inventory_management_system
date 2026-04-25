from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

from app.extensions import db, migrate, ma, jwt

def create_app():
    load_dotenv()
    app = Flask(__name__)

    database_url = os.getenv('DATABASE_URL', 'sqlite:///dineflow.db')
    if database_url.startswith('sqlite:///') and not database_url.startswith('sqlite:////'):
        relative_path = database_url.replace('sqlite:///', '', 1)
        absolute_path = os.path.join(os.path.dirname(app.root_path), relative_path)
        os.makedirs(os.path.dirname(absolute_path), exist_ok=True)
        database_url = f'sqlite:///{absolute_path}'

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    CORS(app)
    
    # Register blueprints
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    from .routes.dashboard import dashboard_bp
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    
    from .routes.inventory import inventory_bp
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    
    from .routes.order import order_bp
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    
    from .routes.product import product_bp
    app.register_blueprint(product_bp, url_prefix='/api/products')
    
    from .routes.supplier import supplier_bp
    app.register_blueprint(supplier_bp, url_prefix='/api/suppliers')
    
    return app
