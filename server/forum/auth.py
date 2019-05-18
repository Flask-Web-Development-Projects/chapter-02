from flask import Response
from flask_httpauth import HTTPTokenAuth
from passlib.hash import pbkdf2_sha256 as hasher

auth = HTTPTokenAuth(scheme="Token")

def authenticate(response: Response, username: str) -> bool:
    """Authenticate an outgoing response with the user's token.
    
    Hash the user's username and set it as the authentication token
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
    token = hasher.hash(username)
    response.set_cookie('auth_token', value=token)
    return response
