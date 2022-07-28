from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from os import path
from config import config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(config.get('dev'))
    db.init_app(app)
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    from .api import api

    app.register_blueprint(api, url_prefix='/api')

    create_database(app)

    return app


def create_database(app):
    if not path.exists('website/database.db'):
        db.create_all(app=app)
        print('Database created')
