from flask import Blueprint
from flask_restplus import Api

user_routes = Blueprint('user_routes', __name__)
api = Blueprint(user_routes)