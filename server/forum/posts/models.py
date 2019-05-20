import datetime
from sqlalchemy import Column, DateTime, Integer, Text, Unicode

from forum import db
from forum.constants import TIME_FMT

class Post(db.Model):
    """Model for the Post object.
    
    Attributes
    ----------
    id : int
        The automatically-generated database id of the post

    title : string
        The title of the post

    body : string
        The body of the post. HTML is allowed for rich text, but
        script tags are not to prevent XSS attacks

    author_id : int
        The database ID of the user that created the post

    author : User
        The user object associated with the author_id. This is automatically
        created as a back-reference by SQLAlchemy on insertion and not
        declared explicitly amongst the class attributes

    creation_date : datetime
        The date the Post instance was created

    last_updated : datetime
        The date the Post instance was last updated

    views : int
        The number of times the Post was viewed

    liked_by : list
        List of user accounts that liked this post

    Methods
    -------
    to_json()
        Returns the post's fields in a JSON serializable format
    """
    pass