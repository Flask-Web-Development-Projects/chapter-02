import datetime
from passlib.hash import pbkdf2_sha256 as hasher
import secrets
from sqlalchemy import Column, DateTime, Integer, Text, Unicode
from typing import Optional

from forum import db
from forum.constants import TIME_FMT

class User(db.Model):
    """Model for the User object.

    Attributes
    ----------
    id : int
        The automatically-generated database id of the user

    username : string
        The chosen visible name of the user account

    password : string
        The hashed password for the user of the account

    creation_date : datetime
        The date the user instance was created

    last_updated : datetime
        The date the user instance was last modified

    bio : string
        The user's own description of themselves

    Methods
    -------
    to_json()
        Returns the user's fields in a JSON serializable format
    """
    id = Column(Integer, primary_key=True)
    username = Column(Unicode, nullable=False)
    password = Column(Unicode, nullable=False)
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
    bio = Column(Text)
    token = Column(Unicode)

    def __init__(self, *args, **kwargs) -> None:
        """Overrides the inherited init method to hash incoming passwords."""
        kwargs["password"] = hasher.hash(kwargs["password"])
        kwargs["token"] = secrets.token_urlsafe(64)
        super().__init__(*args, **kwargs)

    def to_json(self) -> dict:
        """Returns the user's fields in a JSON serializable format.
        
        Returns
        -------
        dict
            The user's ID as integer, username as string, creation_date and
            last_updated as formatted datetime string, and bio as string.
        """
        return {
            'id': self.id,
            'username': self.username,
            'creation_date': self.creation_date.strftime(TIME_FMT),
            'last_updated': self.last_updated.strftime(TIME_FMT),
            'bio': self.bio
        }


def get_user(username: str) -> Optional[User]:
    """Retrieves a user object if it exists.

    When passed username this function checks the database to return
    the corresponding user object. If that user doesn't exist,
    return None

    Parameters
    ----------
    username : str
        The username for a given user.

    Returns
    -------
    User, None
        If the user with that username exists, the user is returned.
        Otherwise, None is returned.
    """
    return User.query.filter_by(username=username).first()
