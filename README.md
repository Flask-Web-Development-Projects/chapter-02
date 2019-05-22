# Chapter 2: The Forum

Source code for the basis of chapter 2

## Index

- [Setup](#Setup)
- [The Walkthrough](#Overview-of-the-Walkthrough)

## Setup

**Requirements:**

- Git
- Python 3.7+ and the corresponding version of Pip
  - If you have [Homebrew](https://brew.sh/), you can install the latest version of Python with `brew install python`. If you want to use the specific version of Python that I'm using, `brew install python 3.7.3`
  - If you want to download the official installer, go to [https://www.python.org](https://www.python.org)

Clone this repository to your local development machine.
Note that this was built on a 2017 Macbook Pro running OSX v. 10.13.6.
You will need to [have git on your local machine](https://git-scm.com/downloads) in order to clone this repository down.

```
$ git clone https://github.com/Flask-Web-Development-Projects/chapter-02.git
```

### Start the Python Virtual Environment

Navigate into the cloned directory and start a Python 3 development environment.
You can call yours whatever you want, but I always call mine `ENV`.
Once created, activate it

```
$ cd chapter-02
$ python3.7 -m venv ENV
$ source ENV/bin/activate
(ENV) $
```

### Install the Flask framework and other required packages

When you installed Python 3.7, you should've gotten a corresponding version of `pip`, which is the Python package manager.
Use `pip` to install the required packages for this project

```
(ENV) $ pip install -r requirements.txt
```

### Create a Postgres Database for the application

```
$ createuser -s postgres
$ createdb forumdb
```

### Set an Environment Variable for Running Flask

Append to your `ENV/bin/activate` script an environment variable that points to the flask app.
Reactivate your environment to enable access to the new environment variable.

```
(ENV) $ BASE_DIR=$(pwd)
(ENV) $ echo "export FLASK_APP=$BASE_DIR/server/app.py flask run" >> ENV/bin/activate
(ENV) $ source ENV/bin/activate
```

Run the application with `flask run`.
You'll be able to view the resulting website on http://127.0.0.1:5000

```
(ENV) $ flask run
 * Serving Flask app "server/app.py"
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

## Overview of the Walkthrough

If you want to see this project built step by step, follow the branches of the repository:

- [master](https://github.com/Flask-Web-Development-Projects/chapter-02/) will include the finished product.
- [checkpoint-00](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-00) is the initial commit, with just the most basic file structure.
- [checkpoint-01](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-01) is the start of the inclusion of a PostgreSQL database.
- [checkpoint-02](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-02) adds the User model and `manage.py` for managing database migrations
- [checkpoint-03](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-03) updates the user model so that the given password is hashed on instantiation and adds a route to register a new user
- [checkpoint-04](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-04) updates the user routes to include the login route
- [checkpoint-05](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-05) updates the user routes to include the account update route
- [checkpoint-06](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-06) allows the user to have its account deleted
- [checkpoint-07](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-07) allows the user to change their password
- [checkpoint-08](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-08) retrieves the details for a given user account
- [checkpoint-09](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-09) establishes the Post object and switches the User model to using the db object instead of pulling from SQLAlchemy directly
- [checkpoint-10](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-10) creates the Post creation endpoint
- [checkpoint-11](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-11) creates the post listing endpoint as well as allows the user to get individual posts by ID
- [checkpoint-12](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-12) creates the post editing and deletion endpoints
- [checkpoint-13](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-13) creates the Comment model
- [checkpoint-14](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-14) creates the Comment routes
- [checkpoint-15](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-15) starts the React app
- [checkpoint-16](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-16) creates the initial listing of forum posts on the front page
- [checkpoint-17](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-17) adds view count, like count, comment count, and creation date to the post listing
- [checkpoint-18](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-18) adds react router, the home route, and the not found route
- [checkpoint-19](https://github.com/Flask-Web-Development-Projects/chapter-02/tree/checkpoint-19) handles the post detail route