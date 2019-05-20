from flask import jsonify, Blueprint, Response, request
from flask_api import status

from forum import db
from forum.auth import auth, authenticate
from forum.users.models import get_user, User
from forum.posts.models import Post

post_routes = Blueprint('post_routes', __name__)

@post_routes.route('/posts', methods=["POST"])
@auth.login_required
def create_post() -> Response:
    """Add a new post.

    Create a new post given the post title and body.

    Returns
    -------
    Response
        Contains the full information for the newly-created post
    """
    pass