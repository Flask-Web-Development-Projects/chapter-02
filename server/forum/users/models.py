import datetime
from typing import Optional

from passlib.hash import pbkdf2_sha256 as hasher
from sqlalchemy import Column, DateTime, Integer, Text, Unicode

from forum import db

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
        kwargs["token"] = hasher.hash(kwargs["username"])
        super().__init__(self, *args, **kwargs)


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
