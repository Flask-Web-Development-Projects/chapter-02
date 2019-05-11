import datetime
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