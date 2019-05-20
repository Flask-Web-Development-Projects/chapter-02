import datetime

from flask import jsonify, Blueprint, Response, request
from flask_api import status
from passlib.hash import pbkdf2_sha256 as hasher

from forum import db
from forum.auth import auth, authenticate
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

def verify_user(username: str) -> bool:
    """Verify that the user making the request is the right user.
    
    Parameters
    ----------
    username : str
        The username of the account trying to be accessed.
    
    Returns
    -------
    bool
        True if the authorized user is the same as the account trying
        to be accessed, False otherwise.
    """
    token = request.cookies['auth_token']
    auth_user = token.split(':')[0]
    return username == auth_user

@user_routes.route('/users/<string:username>', methods=["PUT"])
@auth.login_required
def update_account(username: str) -> Response:
    """Update the user's account with new information.
    
    Submit new information to be added to the user account. Can be used to
    update the user's password as well.

    Parameters
    ----------
    username : str
        The username for the user's account
    
    Returns
    -------
    Response
        The response body will contain the updated user information as it
        exists within the database
    """
    user = get_user(username)
    if not user:
        response = jsonify({'error': 'This user does not exist.'})
        response.status_code = status.HTTP_404_NOT_FOUND
        return response

    if not verify_user(username):
        response = jsonify({
            'error': 'User is not authorized to make this request'
        })
        repsonse.status_code = status.HTTP_401_UNAUTHORIZED
        return response
    
    user.username = request.data.get('username', user.username)
    user.bio = request.data.get('bio', user.bio)

    if "new_password" in request.data:
        old_pass = request.data["password"]
        new_pass = request.data["new_password"]
        new_pass_match = request.data["new_password2"]

        verify_pass = hasher.verify(old_pass, user.password)
        passwords_match = new_pass == new_pass_match

        if verify_pass and passwords_match:
            user.password = hasher.hash(new_pass)
        
        elif not verify_pass:
            response = jsonify({'error': "Old password is invalid"})
            response.status_code = status.HTTP_403_FORBIDDEN
            return response
        
        else:
            response = jsonify({'error': "New password isn't matched"})
            response.status_code = status.HTTP_400_BAD_REQUEST
            return response

    user.last_updated = datetime.datetime.utcnow()

    db.session.add(user)
    db.session.commit()

    response = jsonify(user.to_json())
    response.status_code = status.HTTP_200_OK
    return authenticate(response, user)

@user_routes.route('/users/<string:username>', methods=["DELETE"])
@auth.login_required
def delete_account(username: str) -> Response:
    """Deletes a user account given the corresponding username.
    
    Parameters
    ----------
    username : str
        The username corresponding to the account to be deleted

    Returns
    -------
    Response
        If the user trying to delete an account is not the account owner,
        the Response will have a status of 401 Unauthorized. Otherwise,
        the Response will be an unauthenticated 204 No Content.
    """
    user = get_user(username)
    if not user:
        response = jsonify({'error': 'This user does not exist.'})
        response.status_code = status.HTTP_404_NOT_FOUND
        return response

    if not verify_user(username):
        response = jsonify({
            'error': 'User is not authorized to make this request'
        })
        repsonse.status_code = status.HTTP_401_UNAUTHORIZED
        return response
    
    db.session.delete(user)
    db.session.commit()

    response = Response()
    response.status_code = status.HTTP_204_NO_CONTENT
    return response

@user_routes.route('/users/<username:string>', methods=["GET"])
def get_account(username: str) -> Response:
    """Retrieve details for a given user account.
    
    Parameters
    ----------
    username : str
        The username of the requested account

    Returns
    -------
    Response
        The details of the user account in JSON format.
    """
    user = get_user(username)
    if not user:
        response = jsonify({'error': 'This user does not exist.'})
        response.status_code = status.HTTP_404_NOT_FOUND
        return response

    return jsonify(user.to_json())
