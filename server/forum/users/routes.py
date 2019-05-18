from flask import Blueprint, Response

from forum.auth import authenticate

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/users', methods=["POST"])
def register_user() -> Response:
    """Add a new user if it doesn't already exist.
    
    Given the appropriate user information, create a new user object.
    If that user already exists, return an error (409 Conflict). If the
    information is itself incomplete, return an error (400 Bad Request).
    Although the password matching should be checked on the client side, check
    here, and if they don't match return an error (417 Expectation Failed).

    Returns
    -------
    Response
        An authenticated Response object containing the new user's information
        on a successful user registration. On a failed one, contains the 
        right status as well as the reason for failure.
    """
    response = Response(
        response = 'You made it!',
        mimetype = 'application/json'
    )
    return response
    