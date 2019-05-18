import os
from flask_api import FlaskAPI
from flask_sqlalchemy import SQLAlchemy

app = FlaskAPI(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'POSTGRES_URL',
    'postgres://localhost:5432/forumdb'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from forum.constants import API_PREFIX
from forum.users.routes import user_routes

app.register_blueprint(user_routes, url_prefix=API_PREFIX)
