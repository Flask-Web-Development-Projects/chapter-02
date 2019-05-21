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
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=False)
    author_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id')
    )
    creation_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    post_id = db.Column(
        db.Integer,
        db.ForeignKey('post.id'), nullable=False
    )

    def to_json(self) -> dict:
        """Returns the comment's fields in a JSON serializable format.
        
        Returns
        -------
        dict
            The comment's ID as integer, body as string, author as string of
            just username, creation_date as formatted datetime string,
            last_updated as formatted datetime string
        """
        return {
            'id': self.id,
            'body': self.body,
            'author': self.author.username,
            'creation_date': self.creation_date.strftime(TIME_FMT),
            'last_updated': self.last_updated.strftime(TIME_FMT),
            'parent': self.post_id
        }
