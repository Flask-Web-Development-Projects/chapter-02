from setuptools import setup

required = [
    "flask-api"
]

setup(
    name="forum",
    packages=["forum"],
    include_package_data=True,
    install_requires=required,
)