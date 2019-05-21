import datetime

from flask import jsonify, Blueprint, Response, request
from flask_api import status

from forum import db
from forum.auth import auth, authenticate
from forum.users.models import get_user_from_request
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
        user = get_user_from_request()
        if not user:
            response = jsonify({'error': 'Authorized user not found'})
            response.status_code = status.HTTP_404_NOT_FOUND
            return response

        new_post = Post(
            title=request.data["title"],
            body=request.data["body"],
            author_id=user.id
        )

        db.session.add(new_post)
        db.session.commit()

        response = jsonify(new_post.to_json)
        response.status_code = status.HTTP_201_CREATED
        return response

    response = jsonify({'error': 'Some fields are missing'})
    response.status_code = status.HTTP_400_BAD_REQUEST
    return response

@post_routes.route('/posts', methods=["GET"])
def get_posts() -> Response:
    """Get all the existing posts.
    
    Returns
    -------
    Response
        Contains the JSON serialized forms of all the posts
        within the given parameters.
    """
    page_num = int(request.args.get('page', 0))
    num_posts = int(request.args.get('num_posts', 20))
    posts = Post.query.limit(num_posts).offset(page_num * num_posts).all()
    response = jsonify({'posts': [post.to_json() for post in posts]})
    response.status_code = status.HTTP_200_OK
    return response

@post_routes.route('/posts/<int:post_id>', methods=["GET"])
def get_post(post_id: int) -> Response:
    """Get a post by ID.

    Parameters
    ----------
    post_id : int
        The ID of the requested post

    Returns
    -------
    Response
        Contains the JSON serialized form of the post if it exists.
    """
    post = Post.query.get(post_id)
    if not post:
        response = jsonify({'error': 'This post does not exist'})
        response.status_code = status.HTTP_404_NOT_FOUND
        return response
    
    response = jsonify(post.to_json())
    response.status_code = status.HTTP_200_OK
    return response

@post_routes.route('/posts/<int:post_id>', methods=["DELETE"])
@auth.login_required
def delete_post(post_id: int) -> Response:
    """Delete a post by ID.

    If the post exists and the user is the creator of the post, delete the
    post. Otherwise, pass back errors.

    Returns
    -------
    Response
        Just the 204 No Content repsonse on successful deletion.
        Otherwise, 404 not found or 401 Unauthorized.
    """
    post = Post.query.get(post_id)
    if not post:
        response = jsonify({'error': 'This post does not exist'})
        response.status_code = status.HTTP_404_NOT_FOUND
        return response
    
    user = get_user_from_request()
    if not user:
        response = jsonify({'error': 'Authorized user not found'})
        response.status_code = status.HTTP_404_NOT_FOUND
        return response

    if user != post.author:
        response = jsonify({'error': "User is not the author of this post"})
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response
    
    db.session.delete(post)
    db.session.commit()

    response = Response()
    response.status_code = status.HTTP_204_NO_CONTENT
    return response

@post_routes.route('/posts/<int:post_id>', methods=["PUT"])
@auth.login_required
def update_post(post_id: int) -> Response:
    """Update the post with new data.

    If the user is the post author, update the post title or body.
    Regardless of who is the user, if the post is viewed then update the 
    view count. If the post is liked, add the user to the list of users
    that liked the post.

    Parameters
    ----------
    post_id : int
        The ID of the requested post

    Returns
    -------
    Response
        The response contains the updated post content
    """
    post = Post.query.get(post_id)
    if not post:
        response = jsonify({'error': 'This post does not exist'})
        response.status_code = status.HTTP_404_NOT_FOUND
        return response

    user = get_user_from_request()
    if not user:
        response = jsonify({'error': 'Authorized user not found'})
        response.status_code = status.HTTP_404_NOT_FOUND
        return response

    post.views += 1
    if user not in post.liked_by:
        post.liked_by.append(user)
    
    if user == post.author:
        post.title = request.data.get("title", post.title)
        post.body = request.data.get("body", post.body)
        post.last_updated = datetime.datetime.utcnow()

    db.session.add(post)
    db.session.commit()

    response = jsonify(post.to_json())
    response.status_code = status.HTTP_200_OK
    return response
