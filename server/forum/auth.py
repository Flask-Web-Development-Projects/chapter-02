from flask import Response, request
from flask_httpauth import HTTPTokenAuth

from forum.users.models import User, get_user
from forum import app

auth = HTTPTokenAuth("Bearer")

def authenticate(response: Response, user: User) -> Response:
    """Authenticate an outgoing response with the user's token.
    
    Set the user's username and authentication token
    on an outgoing response.

    Parameters
    ----------
    response : Response
        The response object that needs to be authenticated.

    username : str
        The username to be used in creating the auth token on 
        the response

    Returns
    -------
    Response
        The full response object, now with a cookie
    """
    token = f"{user.username}:{user.token}"
    response.headers.add('Authorization', token)
    response.headers.add('Access-Control-Expose-Headers', 'Authorization')
    return response


@auth.verify_token
def verify_token(token: str) -> bool:
    """Verify that the incoming request has the expected token."""
    if token:
        username, user_token = token.split(':')
        user = get_user(username)
        return user_token == user.token
    return False