import datetime

from flask import jsonify, Blueprint, Response, request
from flask_api import status

from forum import db
from forum.auth import auth, authenticate
from forum.users.models import get_user_from_request
from forum.posts.models import Post
from forum.comments.models import Comment

comment_routes = Blueprint('comment_routes', __name__)

@comment_routes.route('/posts/<int:post_id>/comments', methods=["POST"])
@auth.login_required
def create_comment(post_id: int) -> Response:
    """Add a new comment to a post.

    Create a new comment given the post parent, as well as the
    comment body.

    Parameters
    ----------
    post_id : int
        The ID for the post that will be this comment's parent

    Returns
    -------
    Response
        Contains the full information for the newly-created comment
    """
    pass

@comment_routes.route('/posts/<int:post_id>/comments/<int:comment_id>', methods=["DELETE"])
@auth.login_required
def delete_comment(post_id: int, comment_id: int) -> Response:
    """Delete a comment from a post.
    
    Delete an existing comment on a given post.

    Parameters
    ----------
    post_id : int
        The ID for the post that is this comment's parent

    comment_id : int
        The ID for the comment that will be deleted
    
    Returns
    -------
    Response
        An empty, 204 No Content response
    """
    pass

@comment_routes.route('/posts/<int:post_id>/comments/<int:comment_id>', methods=["PUT"])
@auth.login_required
def update_comment(post_id: int, comment_id: int) -> Response:
    """Update a comment on a post.
    
    Update an existing comment on a given post.

    Parameters
    ----------
    post_id : int
        The ID for the post that is this comment's parent

    comment_id : int
        The ID for the comment that will be updated
    
    Returns
    -------
    Response
        The updated comment information
    """
    pass
