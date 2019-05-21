import datetime

from forum import db
from forum.constants import TIME_FMT

posts = db.Table('posts',
    db.Column(
        'post_id', db.Integer,
        db.ForeignKey('post.id'), primary_key=True
    ),
    db.Column(
        'user_id', db.Integer,
        db.ForeignKey('user.id'), primary_key=True
    )
)

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
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    body = db.Column(db.Text, nullable=False)
    author_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id')
    )
    creation_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    views = db.Column(db.Integer, default=0)
    liked_by = db.relationship('User', secondary=posts, lazy='subquery',
        backref=db.backref('liked', lazy=True))
    
    def to_json(self) -> dict:
        """Returns the post's fields in a JSON serializable format.
        
        Returns
        -------
        dict
            The post's ID as integer, title as string, body as string,
            author as string of just username, creation_date as formatted
            datetime string, last_updated as formatted datetime string,
            views as integer, and liked_by as list of usernames
        """
        return {
            'id': self.id,
            'title': self.title,
            'body': self.body,
            'author': self.author.username,
            'creation_date': self.creation_date.strftime(TIME_FMT),
            'last_updated': self.last_updated.strftime(TIME_FMT),
            'views': self.views,
            'liked_by': [user.username for user in self.liked_by]
        }
