from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

from app.extensions import db, migrate, ma, jwt

def create_app():
    load_dotenv()
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///dineflow.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Register blueprints later
    # from .routes.auth import auth_bp
    # app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    return app