from setuptools import setup

required = [
    "flask-api==1.1",
    "flask-migrate==2.4.0",
    "flask-script==2.0.6",
    "flask-sqlalchemy==2.4.0",
    "passlib==1.7.1",
    "psycopg2==2.8.2",
]

setup(
    name="forum",
    packages=["forum"],
    include_package_data=True,
    install_requires=required,
)