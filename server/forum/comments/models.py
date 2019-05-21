import datetime

from forum import db
from forum.constants import TIME_FMT
from forum.users.models import User

class Comment(db.Model):
    """Model for the Comment object.

    Attributes
    ----------
    id : int
        The automatically-generated database id of the comment

    body : string
        The body of the comment. HTML is allowed for rich text, but
        script tags are not to prevent XSS attacks

    author_id : int
        The database ID of the user that created the comment

    author : User
        The user object associated with the author_id. This is automatically
        created as a back-reference by SQLAlchemy on insertion and not
        declared explicitly amongst the class attributes

    creation_date : datetime
        The date the Comment instance was created

    last_updated : datetime
        The date the Comment instance was last updated

    Methods
    -------
    to_json()
        Returns the comment's fields in a JSON serializable format
    """
    pass