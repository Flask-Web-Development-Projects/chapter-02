import os
from flask_api import FlaskAPI
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = FlaskAPI(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'POSTGRES_URL',
    'postgres://localhost:5432/forumdb'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db = SQLAlchemy(app)

from forum.constants import API_PREFIX
from forum.users.routes import user_routes
from forum.posts.routes import post_routes
from forum.comments.routes import comment_routes

app.register_blueprint(user_routes, url_prefix=API_PREFIX)
app.register_blueprint(post_routes, url_prefix=API_PREFIX)
app.register_blueprint(comment_routes, url_prefix=API_PREFIX)