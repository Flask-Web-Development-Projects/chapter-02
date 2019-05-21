import datetime

from flask import jsonify, Blueprint, Response, request
from flask_api import status

from forum import db
from forum.auth import auth, authenticate
from forum.users.models import get_user_from_request
from forum.posts.models import Post
from forum.comments.models import Comment

comment_routes = Blueprint('comment_routes', __name__)

@comment_routes.route('/comments', methods=["POST"])
@auth.login_required
def create_comment() -> Response:
    """Add a new comment to a post.

    Create a new comment given the post parent, as well as the
    comment body.

    Returns
    -------
    Response
        Contains the full information for the newly-created comment
    """
    pass
