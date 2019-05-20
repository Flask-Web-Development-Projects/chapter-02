from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from forum import app, db
from forum.users.models import User
from forum.posts.models import Post

migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()