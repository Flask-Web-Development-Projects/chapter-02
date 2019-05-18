from flask import Response
from flask_httpauth import HTTPTokenAuth

from forum.users.models import User, get_user

auth = HTTPTokenAuth(scheme="Token")

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
    response.set_cookie('auth_token', value=token)
    return response


@auth.verify_token
def verify_token(token: str) -> bool:
    """Verify that the incoming request has the expected token."""
    if token:
        username = token.split(':')
        user = get_user(username)
        return token == user.token
    return False