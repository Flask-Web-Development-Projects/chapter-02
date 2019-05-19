from flask import jsonify, Blueprint, Response, request
from flask_api import status
from passlib.hash import pbkdf2_sha256 as hasher

from forum import db
from forum.auth import authenticate
from forum.users.models import get_user, User

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
    needed = ['username', 'password', 'password2']
    if all([key in request.data for key in needed]):
        user = get_user(request.data['username'])
        
        if user:
            response = jsonify({'error': 'User already exists'})
            response.status_code = status.HTTP_400_BAD_REQUEST
            return response

        if request.data['password'] != request.data['password2']:
            response = jsonify({'error': "Passwords don't match"})
            response.status_code = status.HTTP_400_BAD_REQUEST
            return response
        
        new_user = User(
            username=request.data['username'],
            password=request.data['password']
        )

        db.session.add(new_user)
        db.session.commit()

        response = jsonify(new_user.to_json())
        response.status_code = status.HTTP_201_CREATED
        return authenticate(response, user=new_user)
    
    response = jsonify({'error': 'Some fields are missing'})
    response.status_code = status.HTTP_400_BAD_REQUEST
    return response
    
@user_routes.route('/users/login', methods=["POST"])
def login() -> Response:
    """Authenticate the user with successful credentials.
    
    Returns
    -------
    Response
        If the user credentials match, return an authenticated response
        containing the user's token.
    """
    needed = ['username', 'password']
    if all([key in request.data for key in needed]):
        user = get_user(request.data['username'])
        if not user or not hasher.verify(request.data['password'], user.password):
            response = jsonify({
                'error': 'The username/password combination is invalid.'
            })
            response.status_code = status.HTTP_400_BAD_REQUEST
            return response
        
        response = jsonify(user.to_json())
        response.status_code = status.HTTP_200_OK
        return authenticate(response, user=user)

    response = jsonify({'error': 'Some fields are missing'})
    response.status_code = status.HTTP_400_BAD_REQUEST
    return response
    