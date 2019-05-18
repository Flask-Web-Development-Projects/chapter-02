import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from forum.users.routes import user_routes

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'POSTGRES_URL',
    'postgres://localhost:5432/forumdb'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

API_PREFIX = '/api/v1'
app.register_blueprint(user_routes, url_prefix=API_PREFIX)

db = SQLAlchemy(app)