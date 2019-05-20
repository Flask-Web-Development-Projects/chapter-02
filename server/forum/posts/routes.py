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
    needed = ["title", "body"]
    if all([key in request.data for key in needed]):
        username = request.headers['Authorization'].split(':')[0].replace('Bearer ', '')
        user = get_user(username)
        new_post = Post(
            title=request.data["title"],
            body=request.data["body"],
            author_id=user.id
        )

        db.session.add(new_post)
        db.session.commit()

        response = jsonify(new_post.to_json)
        response.status_code = status.HTTP_201_CREATED
        return 

    response = jsonify({'error': 'Some fields are missing'})
    response.status_code = status.HTTP_400_BAD_REQUEST
    return response